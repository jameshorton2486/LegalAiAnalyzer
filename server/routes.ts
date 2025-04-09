import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import {
  insertCaseSchema,
  insertTranscriptSchema,
  insertAnalysisSchema,
  insertContradictionSchema,
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Create OpenAI instance
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept only .txt, .pdf, .docx files
    const allowedExtensions = [".txt", ".pdf", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .txt, .pdf, .docx files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  const handleError = (err: any, res: Response) => {
    console.error(err);

    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ error: validationError.message });
    }

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  };

  // Cases API
  app.get("/api/cases", async (req: Request, res: Response) => {
    try {
      const cases = await storage.getAllCases();
      res.json(cases);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.get("/api/cases/:id", async (req: Request, res: Response) => {
    try {
      const caseId = Number(req.params.id);
      const caseData = await storage.getCase(caseId);

      if (!caseData) {
        return res.status(404).json({ error: "Case not found" });
      }

      res.json(caseData);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post("/api/cases", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCaseSchema.parse(req.body);
      const newCase = await storage.createCase(validatedData);
      res.status(201).json(newCase);
    } catch (err) {
      handleError(err, res);
    }
  });

  // Transcripts API
  app.get(
    "/api/cases/:caseId/transcripts",
    async (req: Request, res: Response) => {
      try {
        const caseId = Number(req.params.caseId);
        const transcripts = await storage.getTranscriptsByCaseId(caseId);
        res.json(transcripts);
      } catch (err) {
        handleError(err, res);
      }
    },
  );

  app.get("/api/transcripts/:id", async (req: Request, res: Response) => {
    try {
      const transcriptId = Number(req.params.id);
      const transcript = await storage.getTranscript(transcriptId);

      if (!transcript) {
        return res.status(404).json({ error: "Transcript not found" });
      }

      res.json(transcript);
    } catch (err) {
      handleError(err, res);
    }
  });

  app.post(
    "/api/cases/:caseId/transcripts",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file uploaded" });
        }

        const caseId = Number(req.params.caseId);

        // Read file content
        const filePath = req.file.path;
        const content = fs.readFileSync(filePath, "utf8");

        // Determine page count (simple approximation)
        const pages = Math.ceil(content.split("\n").length / 25);

        // Validate and create transcript
        const transcriptData = {
          caseId,
          title: req.body.title || req.file.originalname,
          witnessName: req.body.witnessName || "Unknown Witness",
          witnessType: req.body.witnessType || "Witness",
          date: req.body.date ? new Date(req.body.date) : new Date(),
          content,
          pages,
        };

        const validatedData = insertTranscriptSchema.parse(transcriptData);
        const newTranscript = await storage.createTranscript(validatedData);

        // Clean up the uploaded file
        fs.unlinkSync(filePath);

        // Process transcript with AI in the background
        processTranscriptWithAI(newTranscript.id).catch(console.error);

        res.status(201).json(newTranscript);
      } catch (err) {
        handleError(err, res);
      }
    },
  );

  // Analysis API
  app.get(
    "/api/transcripts/:transcriptId/analysis",
    async (req: Request, res: Response) => {
      try {
        const transcriptId = Number(req.params.transcriptId);
        const analysis = await storage.getAnalysisByTranscriptId(transcriptId);
        res.json(analysis);
      } catch (err) {
        handleError(err, res);
      }
    },
  );

  // Contradictions API
  app.get(
    "/api/cases/:caseId/contradictions",
    async (req: Request, res: Response) => {
      try {
        const caseId = Number(req.params.caseId);
        const contradictions = await storage.getContradictionsByCaseId(caseId);
        res.json(contradictions);
      } catch (err) {
        handleError(err, res);
      }
    },
  );

  app.post(
    "/api/cases/:caseId/compare",
    async (req: Request, res: Response) => {
      try {
        const caseId = Number(req.params.caseId);
        const transcriptIds = req.body.transcriptIds;

        if (!Array.isArray(transcriptIds) || transcriptIds.length < 2) {
          return res
            .status(400)
            .json({ error: "At least two transcript IDs are required" });
        }

        // This would be an async operation in practice
        compareTranscripts(caseId, transcriptIds).catch(console.error);

        res
          .status(202)
          .json({ message: "Comparison initiated", status: "processing" });
      } catch (err) {
        handleError(err, res);
      }
    },
  );

  const httpServer = createServer(app);
  return httpServer;
}

// AI processing functions
async function processTranscriptWithAI(transcriptId: number) {
  try {
    // Fetch transcript
    const transcript = await storage.getTranscript(transcriptId);
    if (!transcript) return;

    // Update status
    await storage.updateTranscriptStatus(transcriptId, "processing");

    // Generate questions using OpenAI
    const questions = await generateQuestions(transcript.content);

    // Save questions analysis
    await storage.createAnalysis({
      transcriptId,
      type: "questions",
      content: JSON.stringify(questions),
    });

    // Generate insights
    const insights = await generateInsights(transcript.content);

    // Save insights analysis
    await storage.createAnalysis({
      transcriptId,
      type: "insights",
      content: JSON.stringify(insights),
    });

    // Update status
    await storage.updateTranscriptStatus(transcriptId, "analyzed");
  } catch (error) {
    console.error("Error processing transcript:", error);
    await storage.updateTranscriptStatus(transcriptId, "error");
  }
}

async function compareTranscripts(caseId: number, transcriptIds: number[]) {
  try {
    // Fetch transcripts
    const transcripts = [];
    for (const id of transcriptIds) {
      const transcript = await storage.getTranscript(id);
      if (transcript) {
        transcripts.push(transcript);
      }
    }

    if (transcripts.length < 2) return;

    // Compare each pair of transcripts
    for (let i = 0; i < transcripts.length; i++) {
      for (let j = i + 1; j < transcripts.length; j++) {
        const transcript1 = transcripts[i];
        const transcript2 = transcripts[j];

        // Find contradictions using OpenAI
        const contradictions = await findContradictions(
          transcript1.content,
          transcript2.content,
        );

        // Save each contradiction
        for (const contradiction of contradictions) {
          await storage.createContradiction({
            caseId,
            transcript1Id: transcript1.id,
            transcript2Id: transcript2.id,
            description: contradiction.description,
            excerpt1: contradiction.excerpt1,
            excerpt2: contradiction.excerpt2,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error comparing transcripts:", error);
  }
}

async function generateQuestions(transcriptContent: string) {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert legal assistant specialized in analyzing deposition transcripts. Your task is to identify areas where follow-up questions would be beneficial for an attorney conducting the deposition. Focus on inconsistencies, vague responses, potential contradictions, or areas where more detail would be helpful.",
        },
        {
          role: "user",
          content: `Please analyze this legal deposition transcript and suggest 5-7 follow-up questions the attorney should ask. For each question, provide: 1) A clear, specific question, 2) Reasoning for why this question is important, and 3) Reference to the relevant part of the transcript. Format your response as a JSON array of objects with fields: "question", "reasoning", and "reference". Here's the transcript:\n\n${transcriptContent.substring(0, 15000)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.questions || [];
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}

async function generateInsights(transcriptContent: string) {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert legal assistant that analyzes deposition transcripts to identify key insights, themes, and important details that might be relevant to the case.",
        },
        {
          role: "user",
          content: `Please analyze this legal deposition transcript and extract 5-7 key insights. For each insight, provide: 1) A concise title, 2) A detailed description of the insight, and 3) Reference to the relevant part of the transcript. Format your response as a JSON array of objects with fields: "title", "description", and "reference". Here's the transcript:\n\n${transcriptContent.substring(0, 15000)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.insights || [];
  } catch (error) {
    console.error("Error generating insights:", error);
    return [];
  }
}

async function findContradictions(content1: string, content2: string) {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are an expert legal assistant specialized in identifying contradictions between witness testimonies in depositions. Your task is to compare two deposition transcripts and highlight significant contradictions.",
        },
        {
          role: "user",
          content: `Compare these two deposition transcripts and identify any contradictions between the testimonies. For each contradiction, provide: 1) A description of the contradiction, 2) The relevant excerpt from the first transcript, and 3) The relevant excerpt from the second transcript. Format your response as a JSON array of objects with fields: "description", "excerpt1", and "excerpt2". If no contradictions are found, return an empty array. Here are the transcripts:\n\nTRANSCRIPT 1:\n${content1.substring(0, 10000)}\n\nTRANSCRIPT 2:\n${content2.substring(0, 10000)}`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result.contradictions || [];
  } catch (error) {
    console.error("Error finding contradictions:", error);
    return [];
  }
}
