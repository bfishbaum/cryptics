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
	creator_name?: string;
	source: 'USER_SUBMITTED' | 'AI_GENERATED' | 'OFFICIAL';
	difficulty: number;
	date_added: Date;
	private: boolean;
}

export interface User {
	id: number;
	auth0_user_id: string;
	display_name: string;
}

export interface UserProfile {
	userId: string;
	displayName: string;
	puzzles: Cryptogram[];
}