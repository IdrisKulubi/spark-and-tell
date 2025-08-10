import type {
	Category,
	GameSettings,
	PowerUpType,
	Question,
	SparkType,
} from "@/types/game";
import type {
	GameEvent,
	MultiplayerGameState,
	Player,
} from "@/types/multiplayer";
import { create } from "zustand";

interface MultiplayerStore {
	// State
	roomId: string;
	roomCode: string;
	players: {
		host: Player;
		guest: Player | null;
	};
	connectionStatus: MultiplayerGameState["connectionStatus"];
	waitingForPlayer: boolean;

	// Game state (inherited from GameState)
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
	gamePhase: MultiplayerGameState["gamePhase"];
	questionCount: number;
	totalQuestions: number;
	timerStartedAt: number | null;

	// Actions
	setConnectionStatus: (
		status: MultiplayerGameState["connectionStatus"],
	) => void;
	setPlayers: (host: Player, guest: Player | null) => void;
	setWaitingForPlayer: (waiting: boolean) => void;
	handleGameEvent: (event: GameEvent) => void;
	resetMultiplayerState: () => void;

	// Room management
	setRoomInfo: (roomId: string, roomCode: string) => void;
	setGamePhase: (phase: MultiplayerGameState["gamePhase"]) => void;

	// Game state updates from events
	updateGameStateFromEvent: (event: GameEvent) => void;
}

const initialState: Omit<
	MultiplayerStore,
	| "setConnectionStatus"
	| "setPlayers"
	| "setWaitingForPlayer"
	| "handleGameEvent"
	| "resetMultiplayerState"
	| "setRoomInfo"
	| "setGamePhase"
	| "updateGameStateFromEvent"
> = {
	roomId: "",
	roomCode: "",
	players: {
		host: {
			id: "",
			name: "",
			isHost: true,
			isConnected: false,
			joinedAt: new Date(),
		},
		guest: null,
	},
	connectionStatus: "disconnected" as const,
	waitingForPlayer: false,

	// Game state (inherited from GameState)
	settings: {
		player1Name: "",
		player2Name: "",
		dateType: "first" as const,
		gameLength: "standard" as const,
		enableTimer: false,
		timerSeconds: 60 as const,
		enableMusic: false,
		showSparks: true,
		selectedCategories: [1, 2, 3, 4, 5, 6],
	},
	currentTurn: 1 as const,
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
	gamePhase: "landing" as const,
	questionCount: 0,
	totalQuestions: 20,
	timerStartedAt: null,
};

export const useMultiplayerStore = create<MultiplayerStore>((set, get) => ({
	...initialState,

	setConnectionStatus: (status) => {
		set({ connectionStatus: status });
	},

	setPlayers: (host, guest) => {
		set({
			players: { host, guest },
			settings: {
				...get().settings,
				player1Name: host.name,
				player2Name: guest?.name || "",
			},
		});
	},

	setWaitingForPlayer: (waiting) => {
		set({ waitingForPlayer: waiting });
	},

	setRoomInfo: (roomId, roomCode) => {
		set({ roomId, roomCode });
	},

	setGamePhase: (phase) => {
		set({ gamePhase: phase });
	},

	handleGameEvent: (event) => {
		const state = get();
		console.log("🎯 Handling game event:", event.type, event.payload);

		switch (event.type) {
			case "PLAYER_JOINED":
				if (event.payload.player.isHost) {
					set({
						players: {
							...state.players,
							host: event.payload.player,
						},
						waitingForPlayer: false,
					});
				} else {
					set({
						players: {
							...state.players,
							guest: event.payload.player,
						},
						waitingForPlayer: false,
						settings: {
							...state.settings,
							player2Name: event.payload.player.name,
						},
					});
				}
				break;

			case "ROOM_UPDATED":
				set({
					players: {
						host: event.payload.host,
						guest: event.payload.guest,
					},
					waitingForPlayer: !event.payload.guest,
					settings: {
						...state.settings,
						player1Name: event.payload.host.name,
						player2Name: event.payload.guest?.name || "",
					},
				});
				break;

			case "PLAYER_LEFT":
				if (state.players.host.id === event.payload.playerId) {
					// Host left - game ends
					set({ connectionStatus: "disconnected", gamePhase: "ended" });
				} else {
					// Guest left
					set({
						players: {
							...state.players,
							guest: null,
						},
						waitingForPlayer: true,
						gamePhase: "setup",
						settings: {
							...state.settings,
							player2Name: "",
						},
					});
				}
				break;

			case "GAME_STARTED":
				set({
					settings: event.payload.settings,
					gamePhase: "playing",
				});
				break;

			case "DICE_ROLLED":
				set({
					currentCategory: event.payload.category,
					lastCategory: event.payload.category,
				});
				break;

			case "SPARKS_AWARDED":
				const sparkPoints = event.payload.sparkTypes.length * 2; // Simplified
				if (event.payload.awardedTo === state.players.host.id) {
					set({ player1Sparks: state.player1Sparks + sparkPoints });
				} else {
					set({ player2Sparks: state.player2Sparks + sparkPoints });
				}
				break;

			case "QUESTION_SELECTED":
				set({
					currentQuestion: event.payload.question,
					questionsAnswered: [...state.questionsAnswered, event.payload.question.id],
				});
				break;

			case "ANSWER_COMPLETED":
				set({
					gamePhase: "awarding-sparks",
				});
				break;

			case "TURN_CHANGED":
				set({
					currentTurn: event.payload.currentTurn,
					currentQuestion: null,
					currentCategory: null,
					gamePhase: "playing",
					questionCount: state.questionCount + 1,
				});
				break;

			case "GAME_ENDED":
				set({
					gamePhase: "ended",
					player1Sparks: event.payload.finalScores.player1,
					player2Sparks: event.payload.finalScores.player2,
				});
				break;

			case "GAME_RESET":
				set({
					...initialState,
					roomId: state.roomId,
					roomCode: state.roomCode,
					players: state.players,
					connectionStatus: state.connectionStatus,
				} as Partial<MultiplayerStore>);
				break;
		}
	},

	updateGameStateFromEvent: (event) => {
		get().handleGameEvent(event);
	},

	resetMultiplayerState: () => {
		set(initialState as Partial<MultiplayerStore>);
	},
}));
