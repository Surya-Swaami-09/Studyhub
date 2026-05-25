export interface NoteTopic {
  id: string;
  title: string;
  subject: string;
  preview: string;
  content: string;
  tags: string[];
  classLevel?: number; // 5, 6, 7, 8, 9, 10, 11, 12
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index in options (0, 1, 2, 3)
  explanation?: string;
  subject: string;
  exam: string;
  year?: number;
}

export interface MockTest {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  questions: Question[];
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface SavedHistory {
  date: string;
  testTitle: string;
  score: number;
  totalQuestions: number;
}
