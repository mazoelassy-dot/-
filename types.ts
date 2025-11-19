export interface GradingResult {
  studentName?: string;
  transcribedText: string;
  score: number;
  maxScore: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  reasoning: string;
}

export interface GradingCriteria {
  standardAnswer: string;
  maxScore: number;
  instructions: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}