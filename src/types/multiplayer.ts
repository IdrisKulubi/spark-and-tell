import type {
	Category,
	GameSettings,
	GameState,
	PowerUpType,
	Question,
	SparkType,
} from "./game";

export interface GameRoom {
	id: string;
	code: string; // 6-digit room code
	hostId: string;
	guestId: string | null;
	gameState: GameState;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

export interface Player {
	id: string;
	name: string;
	isHost: boolean;
	isConnected: boolean;
	joinedAt: Date;
}

export interface MultiplayerGameState extends GameState {
	roomId: string;
	roomCode: string;
	players: {
		host: Player;
		guest: Player | null;
	};
	connectionStatus: "connecting" | "connected" | "disconnected" | "error";
	waitingForPlayer: boolean;
}

export type GameEvent =
	| { type: "PLAYER_JOINED"; payload: { player: Player } }
	| { type: "PLAYER_LEFT"; payload: { playerId: string } }
	| { type: "GAME_STARTED"; payload: { settings: GameSettings } }
	| { type: "DICE_ROLLED"; payload: { category: Category; playerId: string } }
	| { type: "QUESTION_SELECTED"; payload: { question: Question } }
	| { type: "ANSWER_COMPLETED"; payload: { playerId: string } }
	| {
			type: "SPARKS_AWARDED";
			payload: {
				sparkTypes: SparkType[];
				awardedBy: string;
				awardedTo: string;
			};
	  }
	| {
			type: "POWER_UP_USED";
			payload: { powerUpType: PowerUpType; playerId: string };
	  }
	| { type: "TURN_CHANGED"; payload: { currentTurn: 1 | 2 } }
	| {
			type: "GAME_ENDED";
			payload: { finalScores: { player1: number; player2: number } };
	  }
	| { type: "GAME_RESET"; payload: Record<string, never> };

export interface RoomCreationResult {
	roomId: string;
	roomCode: string;
	playerId: string;
}

export interface RoomJoinResult {
	roomId: string;
	roomCode: string;
	playerId: string;
	gameState: MultiplayerGameState;
}
