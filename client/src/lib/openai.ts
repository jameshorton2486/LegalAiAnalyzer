import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: localStorage.getItem('openai_api_key') || '',
  dangerouslyAllowBrowser: true 
});

export type Question = {
  question: string;
  reasoning: string;
  reference: string;
};

export type Insight = {
  title: string;
  description: string;
  reference: string;
};

export async function analyzeTranscript(content: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert legal assistant analyzing deposition transcripts."
        },
        {
          role: "user",
          content: `Analyze this transcript and provide key insights and questions: ${content}`
        }
      ]
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error analyzing transcript:', error);
    throw error;
  }
}

export async function findContradictions(content1: string, content2: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Compare these two testimonies and identify contradictions."
        },
        {
          role: "user",
          content: `Compare:\n\nTranscript 1:\n${content1}\n\nTranscript 2:\n${content2}`
        }
      ]
    });

    return response.choices[0]?.message?.content;
  } catch (error) {
    console.error('Error finding contradictions:', error);
    throw error;
  }
}