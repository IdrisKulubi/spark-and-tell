import questionsData from "@/data/questions.json";
import type {
	Category,
	DateType,
	GameLength,
	GameSettings,
	GameState,
	PowerUpType,
	Question,
	SparkType,
} from "@/types/game";
import { SPARK_REACTIONS } from "@/types/game";
import { create } from "zustand";

const questions = questionsData as Question[];

interface GameStore extends GameState {
	initializeGame: (settings: GameSettings) => void;
	rollDice: () => Category;
	selectQuestion: (category: Category) => void;
	awardBasePoints: () => void;
	awardSparks: (sparkTypes: SparkType[]) => void;
	nextTurn: () => void;
	usePowerUp: (powerUpType: PowerUpType) => void;
	bookmarkQuestion: (questionId: string) => void;
	endGame: () => void;
	resetGame: () => void;
	setGamePhase: (phase: GameState["gamePhase"]) => void;
}

const getQuestionLimit = (gameLength: GameLength): number => {
	switch (gameLength) {
		case "quick":
			return 10;
		case "standard":
			return 20;
		case "marathon":
			return 999;
		default:
			return 20;
	}
};

const filterQuestions = (
	category: Category,
	settings: GameSettings,
	answeredIds: string[],
): Question[] => {
	return questions.filter((q) => {
		if (q.category !== category) return false;
		if (answeredIds.includes(q.id)) return false;
		if (!settings.selectedCategories.includes(q.category)) return false;
		return true;
	});
};

export const useGameStore = create<GameStore>((set, get) => ({
	settings: {
		player1Name: "",
		player2Name: "",
		dateType: "first",
		gameLength: "standard",
		enableTimer: false,
		timerSeconds: 60,
		enableMusic: false,
		showSparks: true,
		selectedCategories: [1, 2, 3, 4, 5, 6],
	},
	currentTurn: 1,
	player1Sparks: 0,
	player2Sparks: 0,
	questionsAnswered: [],
	currentQuestion: null,
	currentCategory: null,
	lastCategory: null,
	powerUpsUsed: {
		1: { reverse: 0, "both-answer": 0, skip: 0, "re-roll": 0 },
		2: { reverse: 0, "both-answer": 0, skip: 0, "re-roll": 0 },
	},
	bookmarkedQuestions: [],
	gamePhase: "landing",
	questionCount: 0,
	totalQuestions: 20,
	timerStartedAt: null,

	initializeGame: (settings) => {
		const totalQuestions = getQuestionLimit(settings.gameLength);
		set({
			settings,
			gamePhase: "playing",
			currentTurn: 1,
			player1Sparks: 0,
			player2Sparks: 0,
			questionsAnswered: [],
			currentQuestion: null,
			currentCategory: null,
			lastCategory: null,
			powerUpsUsed: {
				1: { reverse: 0, "both-answer": 0, skip: 0, "re-roll": 0 },
				2: { reverse: 0, "both-answer": 0, skip: 0, "re-roll": 0 },
			},
			bookmarkedQuestions: [],
			questionCount: 0,
			totalQuestions,
			timerStartedAt: null,
		});
	},

	rollDice: () => {
		const state = get();
		const availableCategories = state.settings.selectedCategories.filter(
			(cat) => cat !== state.lastCategory,
		);
		const randomIndex = Math.floor(Math.random() * availableCategories.length);
		const category = availableCategories[randomIndex] as Category;
		set({ currentCategory: category });
		return category;
	},

	selectQuestion: (category) => {
		const state = get();
		// Set the current and last category immediately
		set({ currentCategory: category, lastCategory: category });

		const availableQuestions = filterQuestions(
			category,
			state.settings,
			state.questionsAnswered,
		);

		if (availableQuestions.length === 0) {
			const allAvailable = questions.filter(
				(q) =>
					state.settings.selectedCategories.includes(q.category) &&
					!state.questionsAnswered.includes(q.id),
			);
			if (allAvailable.length > 0) {
				const randomIndex = Math.floor(Math.random() * allAvailable.length);
				const question = allAvailable[randomIndex];
				set({
					currentQuestion: question,
					timerStartedAt: state.settings.enableTimer ? Date.now() : null,
				});
			}
		} else {
			const randomIndex = Math.floor(Math.random() * availableQuestions.length);
			const question = availableQuestions[randomIndex];
			set({
				currentQuestion: question,
				timerStartedAt: state.settings.enableTimer ? Date.now() : null,
			});
		}
	},

	awardBasePoints: () => {
		const state = get();
		if (!state.currentQuestion) return;

		const basePoints = state.currentQuestion.points;
		if (state.currentTurn === 1) {
			set({ player1Sparks: state.player1Sparks + basePoints });
		} else {
			set({ player2Sparks: state.player2Sparks + basePoints });
		}
	},

	awardSparks: (sparkTypes) => {
		const state = get();
		const totalPoints = sparkTypes.reduce((sum, type) => {
			const reaction = SPARK_REACTIONS.find((r) => r.type === type);
			return sum + (reaction?.points ?? 0);
		}, 0);

		// The current player is the one who answered the question and receives sparks
		if (state.currentTurn === 1) {
			set({ player1Sparks: state.player1Sparks + totalPoints });
		} else {
			set({ player2Sparks: state.player2Sparks + totalPoints });
		}
	},

	nextTurn: () => {
		const state = get();
		const newCount = state.questionCount + 1;

		if (state.currentQuestion) {
			set({
				questionsAnswered: [
					...state.questionsAnswered,
					state.currentQuestion.id,
				],
				questionCount: newCount,
			});
		}

		if (newCount >= state.totalQuestions) {
			set({ gamePhase: "ended" });
		} else {
			set({
				currentTurn: state.currentTurn === 1 ? 2 : 1,
				currentQuestion: null,
				gamePhase: "playing",
				timerStartedAt: null,
			});
		}
	},

	usePowerUp: (powerUpType) => {
		const state = get();
		const player = state.currentTurn;
		const currentUses = state.powerUpsUsed[player][powerUpType];

		set({
			powerUpsUsed: {
				...state.powerUpsUsed,
				[player]: {
					...state.powerUpsUsed[player],
					[powerUpType]: currentUses + 1,
				},
			},
		});

		if (powerUpType === "skip") {
			get().nextTurn();
		} else if (powerUpType === "re-roll") {
			set({ currentCategory: null, currentQuestion: null });
		} else if (powerUpType === "reverse") {
			set({ currentTurn: state.currentTurn === 1 ? 2 : 1 });
		}
	},

	bookmarkQuestion: (questionId) => {
		const state = get();
		const isBookmarked = state.bookmarkedQuestions.includes(questionId);
		if (isBookmarked) {
			set({
				bookmarkedQuestions: state.bookmarkedQuestions.filter(
					(id) => id !== questionId,
				),
			});
		} else {
			set({
				bookmarkedQuestions: [...state.bookmarkedQuestions, questionId],
			});
		}
	},

	endGame: () => {
		set({ gamePhase: "ended" });
	},

	resetGame: () => {
		set({
			gamePhase: "landing",
			currentTurn: 1,
			player1Sparks: 0,
			player2Sparks: 0,
			questionsAnswered: [],
			currentQuestion: null,
			currentCategory: null,
			lastCategory: null,
			powerUpsUsed: {
				1: { reverse: 0, "both-answer": 0, skip: 0, "re-roll": 0 },
				2: { reverse: 0, "both-answer": 0, skip: 0, "re-roll": 0 },
			},
			bookmarkedQuestions: [],
			questionCount: 0,
			timerStartedAt: null,
		});
	},

	setGamePhase: (phase) => {
		set({ gamePhase: phase });
	},
}));
