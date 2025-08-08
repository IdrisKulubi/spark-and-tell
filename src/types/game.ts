export enum Category {
	ICEBREAKER = 1,
	DREAMS = 2,
	WOULD_YOU_RATHER = 3,
	STORY_TIME = 4,
	SPICY = 5,
	DEEP_DIVE = 6,
}

export const CategoryNames: Record<Category, string> = {
	[Category.ICEBREAKER]: "🧊 Icebreakers",
	[Category.DREAMS]: "✨ Dreams & Adventures",
	[Category.WOULD_YOU_RATHER]: "🤔 Would You Rather",
	[Category.STORY_TIME]: "📖 Story Time",
	[Category.SPICY]: "🔥 Spicy",
	[Category.DEEP_DIVE]: "💭 Deep Dive",
};

export interface Question {
	id: string;
	category: Category;
	difficulty: 1 | 2 | 3;
	points: number; // Base points awarded for answering
	text: string;
	followUp?: string;
	tags: string[];
	type: "standard" | "challenge" | "both-answer";
}

export type DateType = "first" | "dating" | "longterm" | "custom";
export type GameLength = "quick" | "standard" | "marathon";

export interface GameSettings {
	player1Name: string;
	player2Name: string;
	dateType: DateType;
	gameLength: GameLength;
	enableTimer: boolean;
	timerSeconds: 30 | 60 | 90;
	enableMusic: boolean;
	showSparks: boolean;
	selectedCategories: Category[];
}

export type SparkType =
	| "made-me-laugh"
	| "adorable"
	| "didnt-know"
	| "connection"
	| "hot"
	| "brave"
	| "same";

export interface SparkReaction {
	type: SparkType;
	label: string;
	emoji: string;
	points: number;
}

export const SPARK_REACTIONS: SparkReaction[] = [
	{ type: "made-me-laugh", label: "Made Me Laugh", emoji: "😂", points: 2 },
	{ type: "adorable", label: "That's Adorable", emoji: "🥰", points: 2 },
	{ type: "didnt-know", label: "Didn't Know That", emoji: "🤯", points: 3 },
	{ type: "connection", label: "Felt Connection", emoji: "💕", points: 3 },
	{ type: "hot", label: "That Was Hot", emoji: "🔥", points: 2 },
	{ type: "brave", label: "Brave Share", emoji: "💪", points: 4 },
	{ type: "same", label: "Same!", emoji: "🎯", points: 2 },
];

export type PowerUpType = "reverse" | "both-answer" | "skip" | "re-roll";

export interface PowerUp {
	type: PowerUpType;
	label: string;
	emoji: string;
	description: string;
	maxUses: number;
}

export const POWER_UPS: PowerUp[] = [
	{
		type: "reverse",
		label: "Reverse Card",
		emoji: "🔄",
		description: "Ask the question back to them",
		maxUses: 3,
	},
	{
		type: "both-answer",
		label: "Both Answer",
		emoji: "👥",
		description: "Both players answer the same question",
		maxUses: 3,
	},
	{
		type: "skip",
		label: "Skip",
		emoji: "⏭️",
		description: "Skip uncomfortable question",
		maxUses: 2,
	},
	{
		type: "re-roll",
		label: "Re-roll",
		emoji: "🎲",
		description: "Roll the dice again for new category",
		maxUses: 3,
	},
];

export interface GameState {
	settings: GameSettings;
	currentTurn: 1 | 2;
	player1Sparks: number;
	player2Sparks: number;
	questionsAnswered: string[];
	currentQuestion: Question | null;
	currentCategory: Category | null;
	lastCategory: Category | null;
	powerUpsUsed: Record<1 | 2, Record<PowerUpType, number>>;
	bookmarkedQuestions: string[];
	gamePhase:
		| "landing"
		| "setup"
		| "playing"
		| "awarding-sparks"
		| "mini-game"
		| "ended";
	questionCount: number;
	totalQuestions: number;
	timerStartedAt: number | null;
}

export interface GameStats {
	totalSparks: number;
	favoriteCategory: Category;
	mostLaughs: 1 | 2;
	vulnerabilityChampion: 1 | 2;
	bestStoryTeller: 1 | 2;
	sparkMaster: 1 | 2;
	totalQuestions: number;
	gameDuration: number;
}
