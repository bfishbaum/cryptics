export interface Cryptogram {
	id: number;
	puzzle: string;
	solution: string;
	explanation?: string;
	source: 'USER_SUBMITTED' | 'AI_GENERATED' | 'OFFICIAL';
	difficulty: number;
	date_added: Date;
}

export interface CryptogramInput {
	puzzle: string;
	solution: string;
	explanation?: string;
	source: 'USER_SUBMITTED' | 'AI_GENERATED' | 'OFFICIAL';
	difficulty: number;
	date_added: Date;
}