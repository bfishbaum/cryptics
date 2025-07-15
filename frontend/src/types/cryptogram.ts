export const Source = {
  USER_SUBMITTED: 'USER_SUBMITTED',
  AI_GENERATED: 'AI_GENERATED',
  OFFICIAL: 'OFFICIAL'
} as const;

export type Source = (typeof Source)[keyof typeof Source];

export interface Cryptogram {
  id: number;
  puzzle: string;
  solution: string;
  explanation?: string;
  source: Source;
  difficulty: number;
  date_added: Date;
}

export interface CryptogramInput {
  puzzle: string;
  solution: string;
  explanation?: string;
  source: Source;
  difficulty: number;
  date_added: Date;
}