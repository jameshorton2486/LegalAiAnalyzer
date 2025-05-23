import {
  users,
  type User,
  type InsertUser,
  cases,
  type Case,
  type InsertCase,
  transcripts,
  type Transcript,
  type InsertTranscript,
  analysis,
  type Analysis,
  type InsertAnalysis,
  contradictions,
  type Contradiction,
  type InsertContradiction,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Cases
  getAllCases(): Promise<Case[]>;
  getCase(id: number): Promise<Case | undefined>;
  createCase(caseData: InsertCase): Promise<Case>;

  // Transcripts
  getTranscriptsByCaseId(caseId: number): Promise<Transcript[]>;
  getTranscript(id: number): Promise<Transcript | undefined>;
  createTranscript(transcript: InsertTranscript): Promise<Transcript>;
  updateTranscriptStatus(id: number, status: string): Promise<void>;

  // Analysis
  getAnalysisByTranscriptId(transcriptId: number): Promise<Analysis[]>;
  createAnalysis(analysis: InsertAnalysis): Promise<Analysis>;

  // Contradictions
  getAllContradictions(): Promise<Contradiction[]>;
  getContradictionsByCaseId(caseId: number): Promise<Contradiction[]>;
  createContradiction(
    contradiction: InsertContradiction,
  ): Promise<Contradiction>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cases: Map<number, Case>;
  private transcripts: Map<number, Transcript>;
  private analysisItems: Map<number, Analysis>;
  private contradictionItems: Map<number, Contradiction>;

  private userCurrentId: number;
  private caseCurrentId: number;
  private transcriptCurrentId: number;
  private analysisCurrentId: number;
  private contradictionCurrentId: number;

  constructor() {
    this.users = new Map();
    this.cases = new Map();
    this.transcripts = new Map();
    this.analysisItems = new Map();
    this.contradictionItems = new Map();

    this.userCurrentId = 1;
    this.caseCurrentId = 1;
    this.transcriptCurrentId = 1;
    this.analysisCurrentId = 1;
    this.contradictionCurrentId = 1;

    // Add some sample data
    const caseId = this.caseCurrentId;
    this.createCase({
      title: "Smith v. Johnson",
      caseNumber: "12345",
      description: "Insurance Claim Dispute",
    });
    
    // Add sample contradictions
    this.createContradiction({
      caseId: caseId,
      transcript1Id: 1,
      transcript2Id: 2,
      witness1: "John Smith",
      witness2: "Sarah Johnson",
      description: "Contradicting statements about the time of the accident",
      testimony1: "I am absolutely certain the accident occurred at approximately 3:30 PM, as I had just checked my watch before it happened.",
      testimony2: "The accident definitely happened around 5:00 PM. I remember because I was on my way home from work.",
      confidence: 92
    });
    
    this.createContradiction({
      caseId: caseId,
      transcript1Id: 1,
      transcript2Id: 3,
      witness1: "John Smith",
      witness2: "Officer Rodriguez",
      description: "Disagreement about weather conditions during the incident",
      testimony1: "It was raining heavily at the time of the accident, which is why visibility was poor.",
      testimony2: "According to my police report, the weather was clear and dry when I arrived at the scene, approximately 10 minutes after the incident.",
      confidence: 78
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Cases
  async getAllCases(): Promise<Case[]> {
    return Array.from(this.cases.values());
  }

  async getCase(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }

  async createCase(insertCase: InsertCase): Promise<Case> {
    const id = this.caseCurrentId++;
    const newCase: Case = {
      ...insertCase,
      id,
      createdAt: new Date(),
      description: insertCase.description || null,
      caseNumber: insertCase.caseNumber || null
    };
    this.cases.set(id, newCase);
    return newCase;
  }

  // Transcripts
  async getTranscriptsByCaseId(caseId: number): Promise<Transcript[]> {
    return Array.from(this.transcripts.values()).filter(
      (transcript) => transcript.caseId === caseId,
    );
  }

  async getTranscript(id: number): Promise<Transcript | undefined> {
    return this.transcripts.get(id);
  }

  async createTranscript(
    insertTranscript: InsertTranscript,
  ): Promise<Transcript> {
    const id = this.transcriptCurrentId++;
    const transcript: Transcript = {
      ...insertTranscript,
      id,
      status: "pending",
      createdAt: new Date(),
      date: insertTranscript.date || null,
      witnessType: insertTranscript.witnessType || null,
      pages: insertTranscript.pages || null
    };
    this.transcripts.set(id, transcript);
    return transcript;
  }

  async updateTranscriptStatus(id: number, status: string): Promise<void> {
    const transcript = this.transcripts.get(id);
    if (transcript) {
      transcript.status = status;
      this.transcripts.set(id, transcript);
    }
  }

  // Analysis
  async getAnalysisByTranscriptId(transcriptId: number): Promise<Analysis[]> {
    return Array.from(this.analysisItems.values()).filter(
      (analysis) => analysis.transcriptId === transcriptId,
    );
  }

  async createAnalysis(insertAnalysis: InsertAnalysis): Promise<Analysis> {
    const id = this.analysisCurrentId++;
    const analysis: Analysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.analysisItems.set(id, analysis);
    return analysis;
  }

  // Contradictions
  async getAllContradictions(): Promise<Contradiction[]> {
    return Array.from(this.contradictionItems.values());
  }
  
  async getContradictionsByCaseId(caseId: number): Promise<Contradiction[]> {
    return Array.from(this.contradictionItems.values()).filter(
      (contradiction) => contradiction.caseId === caseId,
    );
  }

  async createContradiction(
    insertContradiction: InsertContradiction,
  ): Promise<Contradiction> {
    const id = this.contradictionCurrentId++;
    const contradiction: Contradiction = {
      ...insertContradiction,
      id,
      createdAt: new Date(),
    };
    this.contradictionItems.set(id, contradiction);
    return contradiction;
  }
}

export const storage = new MemStorage();
