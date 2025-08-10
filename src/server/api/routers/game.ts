import { EventEmitter } from "events";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type {
	Category,
	GameSettings,
	PowerUpType,
	SparkType,
} from "@/types/game";
import type {
	GameEvent,
	GameRoom,
	MultiplayerGameState,
	Player,
} from "@/types/multiplayer";
import { observable } from "@trpc/server/observable";
import { z } from "zod";

// In-memory storage for game rooms (in production, use Redis or database)
const gameRooms = new Map<string, GameRoom>();
const playerSessions = new Map<string, string>(); // playerId -> roomId
const roomEvents = new EventEmitter();

// Generate a 6-digit room code
function generateRoomCode(): string {
	return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Generate unique IDs
function generateId(): string {
	return Math.random().toString(36).substring(2, 15);
}

export const gameRouter = createTRPCRouter({
	// Create a new game room
	createRoom: publicProcedure
		.input(
			z.object({
				hostName: z.string().min(1).max(50),
			}),
		)
		.mutation(({ input }) => {
			const roomId = generateId();
			const roomCode = generateRoomCode();
			const playerId = generateId();

			const host: Player = {
				id: playerId,
				name: input.hostName,
				isHost: true,
				isConnected: true,
				joinedAt: new Date(),
			};

			const gameRoom: GameRoom = {
				id: roomId,
				code: roomCode,
				hostId: playerId,
				guestId: null,
				gameState: {
					settings: {
						player1Name: input.hostName,
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
					gamePhase: "setup",
					questionCount: 0,
					totalQuestions: 20,
					timerStartedAt: null,
				},
				createdAt: new Date(),
				updatedAt: new Date(),
				isActive: true,
			};

			gameRooms.set(roomId, gameRoom);
			playerSessions.set(playerId, roomId);

			return {
				roomId,
				roomCode,
				playerId,
			};
		}),

	// Join an existing game room
	joinRoom: publicProcedure
		.input(
			z.object({
				roomCode: z.string().length(6),
				guestName: z.string().min(1).max(50),
			}),
		)
		.mutation(({ input }) => {
			// Find room by code
			const room = Array.from(gameRooms.values()).find(
				(r) => r.code === input.roomCode.toUpperCase(),
			);

			if (!room) {
				throw new Error("Room not found");
			}

			if (room.guestId) {
				throw new Error("Room is full");
			}

			if (!room.isActive) {
				throw new Error("Room is no longer active");
			}

			const playerId = generateId();

			// Update room with guest
			room.guestId = playerId;
			room.gameState.settings.player2Name = input.guestName;
			room.updatedAt = new Date();

			playerSessions.set(playerId, room.id);

			// Emit player joined event
			const guest: Player = {
				id: playerId,
				name: input.guestName,
				isHost: false,
				isConnected: true,
				joinedAt: new Date(),
			};

			roomEvents.emit(`room:${room.id}`, {
				type: "PLAYER_JOINED",
				payload: { player: guest },
			});

			return {
				roomId: room.id,
				roomCode: room.code,
				playerId,
				gameState: room.gameState,
			};
		}),

	// Get room state
	getRoomState: publicProcedure
		.input(
			z.object({
				roomId: z.string(),
				playerId: z.string(),
			}),
		)
		.query(({ input }) => {
			const room = gameRooms.get(input.roomId);

			if (!room) {
				throw new Error("Room not found");
			}

			// Verify player is in this room
			const playerRoom = playerSessions.get(input.playerId);
			if (playerRoom !== input.roomId) {
				throw new Error("Player not in this room");
			}

			return room.gameState;
		}),

	// Start the game (host only)
	startGame: publicProcedure
		.input(
			z.object({
				roomId: z.string(),
				playerId: z.string(),
				settings: z.object({
					dateType: z.enum(["first", "dating", "longterm", "custom"]),
					gameLength: z.enum(["quick", "standard", "marathon"]),
					enableTimer: z.boolean(),
					timerSeconds: z.union([z.literal(30), z.literal(60), z.literal(90)]),
					enableMusic: z.boolean(),
					showSparks: z.boolean(),
					selectedCategories: z.array(z.number().min(1).max(6)),
				}),
			}),
		)
		.mutation(({ input }) => {
			const room = gameRooms.get(input.roomId);

			if (!room) {
				throw new Error("Room not found");
			}

			if (room.hostId !== input.playerId) {
				throw new Error("Only host can start the game");
			}

			if (!room.guestId) {
				throw new Error("Need another player to start");
			}

			// Update game settings and start
			room.gameState.settings = {
				...room.gameState.settings,
				dateType: input.settings.dateType,
				gameLength: input.settings.gameLength,
				enableTimer: input.settings.enableTimer,
				timerSeconds: input.settings.timerSeconds,
				enableMusic: input.settings.enableMusic,
				showSparks: input.settings.showSparks,
				selectedCategories: input.settings.selectedCategories,
			};
			room.gameState.gamePhase = "playing";
			room.updatedAt = new Date();

			// Emit game started event
			roomEvents.emit(`room:${room.id}`, {
				type: "GAME_STARTED",
				payload: { settings: room.gameState.settings },
			});

			return { success: true };
		}),

	// Roll dice
	rollDice: publicProcedure
		.input(
			z.object({
				roomId: z.string(),
				playerId: z.string(),
				category: z.number().min(1).max(6),
			}),
		)
		.mutation(({ input }) => {
			const room = gameRooms.get(input.roomId);

			if (!room) {
				throw new Error("Room not found");
			}

			// Update room state
			room.gameState.currentCategory = input.category as Category;
			room.gameState.lastCategory = input.category as Category;
			room.updatedAt = new Date();

			// Emit dice rolled event
			roomEvents.emit(`room:${room.id}`, {
				type: "DICE_ROLLED",
				payload: {
					category: input.category as Category,
					playerId: input.playerId,
				},
			});

			return { success: true };
		}),

	// Award sparks
	awardSparks: publicProcedure
		.input(
			z.object({
				roomId: z.string(),
				playerId: z.string(),
				sparkTypes: z.array(z.string()),
				awardedTo: z.string(),
			}),
		)
		.mutation(({ input }) => {
			const room = gameRooms.get(input.roomId);

			if (!room) {
				throw new Error("Room not found");
			}

			// Calculate spark points (simplified - you'd import the actual logic)
			const sparkPoints = input.sparkTypes.length * 2; // Simplified calculation

			// Update scores
			if (input.awardedTo === room.hostId) {
				room.gameState.player1Sparks += sparkPoints;
			} else {
				room.gameState.player2Sparks += sparkPoints;
			}

			room.updatedAt = new Date();

			// Emit sparks awarded event
			roomEvents.emit(`room:${room.id}`, {
				type: "SPARKS_AWARDED",
				payload: {
					sparkTypes: input.sparkTypes as SparkType[],
					awardedBy: input.playerId,
					awardedTo: input.awardedTo,
				},
			});

			return { success: true };
		}),

	// Next turn
	nextTurn: publicProcedure
		.input(
			z.object({
				roomId: z.string(),
				playerId: z.string(),
			}),
		)
		.mutation(({ input }) => {
			const room = gameRooms.get(input.roomId);

			if (!room) {
				throw new Error("Room not found");
			}

			// Switch turns
			room.gameState.currentTurn = room.gameState.currentTurn === 1 ? 2 : 1;
			room.gameState.questionCount += 1;
			room.gameState.currentQuestion = null;
			room.gameState.currentCategory = null;

			// Check if game should end
			if (room.gameState.questionCount >= room.gameState.totalQuestions) {
				room.gameState.gamePhase = "ended";
			} else {
				room.gameState.gamePhase = "playing";
			}

			room.updatedAt = new Date();

			// Emit turn changed event
			roomEvents.emit(`room:${room.id}`, {
				type: "TURN_CHANGED",
				payload: { currentTurn: room.gameState.currentTurn },
			});

			return { success: true };
		}),

	// Subscribe to room events (WebSocket-like functionality)
	subscribeToRoom: publicProcedure
		.input(
			z.object({
				roomId: z.string(),
				playerId: z.string(),
			}),
		)
		.subscription(({ input }) => {
			return observable<GameEvent>((emit) => {
				// Verify player is in room
				const playerRoom = playerSessions.get(input.playerId);
				if (playerRoom !== input.roomId) {
					emit.error(new Error("Player not in this room"));
					return;
				}

				const onRoomEvent = (event: GameEvent) => {
					emit.next(event);
				};

				// Listen for events on this room
				roomEvents.on(`room:${input.roomId}`, onRoomEvent);

				// Cleanup
				return () => {
					roomEvents.off(`room:${input.roomId}`, onRoomEvent);
				};
			});
		}),

	// Leave room
	leaveRoom: publicProcedure
		.input(
			z.object({
				roomId: z.string(),
				playerId: z.string(),
			}),
		)
		.mutation(({ input }) => {
			const room = gameRooms.get(input.roomId);

			if (!room) {
				return { success: true }; // Room already gone
			}

			// Remove player from room
			if (room.hostId === input.playerId) {
				// Host left - end the room
				room.isActive = false;
				gameRooms.delete(input.roomId);
			} else if (room.guestId === input.playerId) {
				// Guest left
				room.guestId = null;
				room.gameState.settings.player2Name = "";
				room.gameState.gamePhase = "setup";
			}

			playerSessions.delete(input.playerId);

			// Emit player left event
			roomEvents.emit(`room:${input.roomId}`, {
				type: "PLAYER_LEFT",
				payload: { playerId: input.playerId },
			});

			return { success: true };
		}),
});
