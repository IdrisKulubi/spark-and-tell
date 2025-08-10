"use client";

import React, { useEffect, useState } from "react";
import { useMultiplayerStore } from "@/store/multiplayerStore";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";

interface MultiplayerManagerProps {
	onBack: () => void;
}

export function MultiplayerManager({ onBack }: MultiplayerManagerProps) {
	const [step, setStep] = useState<"setup" | "lobby" | "game">("setup");
	const [mode, setMode] = useState<"create" | "join" | null>(null);
	const [playerName, setPlayerName] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [roomInfo, setLocalRoomInfo] = useState<{roomId: string, roomCode: string, playerId: string} | null>(null);

	const {
		players,
		connectionStatus,
		gamePhase,
		setPlayers,
		setConnectionStatus,
		setRoomInfo: setStoreRoomInfo,
		setGamePhase,
		handleGameEvent,
	} = useMultiplayerStore();

	// Auto-restore session on mount
	useEffect(() => {
		const savedPlayerId = localStorage.getItem("spark-tell-player-id");
		const savedRoomId = localStorage.getItem("spark-tell-room-id");
		
		if (savedPlayerId && savedRoomId) {
			console.log("🔄 Restoring session:", { savedPlayerId, savedRoomId });
			setStoreRoomInfo(savedRoomId, "RESTORED");
			setConnectionStatus("connected");
			setStep("lobby");
			setLocalRoomInfo({
				roomId: savedRoomId,
				roomCode: "RESTORED",
				playerId: savedPlayerId
			});
		}
	}, [setRoomInfo, setConnectionStatus]);

	// Create room mutation
	const createRoomMutation = api.game.createRoom.useMutation({
		onSuccess: (data) => {
			console.log("✅ Room created:", data);
			
			// Store session
			localStorage.setItem("spark-tell-player-id", data.playerId);
			localStorage.setItem("spark-tell-room-id", data.roomId);
			
			// Update state
			setStoreRoomInfo(data.roomId, data.roomCode);
			setPlayers(
				{
					id: data.playerId,
					name: playerName,
					isHost: true,
					isConnected: true,
					joinedAt: new Date(),
				},
				null
			);
			setConnectionStatus("connected");
			setGamePhase("setup");
			setStep("lobby");
			setLocalRoomInfo(data);
			setIsLoading(false);
		},
		onError: (error) => {
			console.error("❌ Create room failed:", error);
			setError(error.message);
			setIsLoading(false);
		},
	});

	// Join room mutation
	const joinRoomMutation = api.game.joinRoom.useMutation({
		onSuccess: (data) => {
			console.log("✅ Room joined:", data);
			
			// Store session
			localStorage.setItem("spark-tell-player-id", data.playerId);
			localStorage.setItem("spark-tell-room-id", data.roomId);
			
			// Update state
			setStoreRoomInfo(data.roomId, data.roomCode);
			setPlayers(
				{
					id: "", // Will be updated by room events
					name: data.gameState.settings.player1Name,
					isHost: true,
					isConnected: true,
					joinedAt: new Date(),
				},
				{
					id: data.playerId,
					name: playerName,
					isHost: false,
					isConnected: true,
					joinedAt: new Date(),
				}
			);
			setConnectionStatus("connected");
			setGamePhase("setup");
			setStep("lobby");
			setLocalRoomInfo({
				roomId: data.roomId,
				roomCode: data.roomCode,
				playerId: data.playerId
			});
			setIsLoading(false);
		},
		onError: (error) => {
			console.error("❌ Join room failed:", error);
			setError(error.message);
			setIsLoading(false);
		},
	});

	// Start game mutation
	const startGameMutation = api.game.startGame.useMutation({
		onSuccess: () => {
			console.log("✅ Game started");
			setGamePhase("playing");
			setStep("game");
		},
		onError: (error) => {
			console.error("❌ Start game failed:", error);
			setError(error.message);
		},
	});

	const handleCreateRoom = () => {
		if (!playerName.trim()) {
			setError("Please enter your name");
			return;
		}
		setIsLoading(true);
		setError("");
		createRoomMutation.mutate({ hostName: playerName.trim() });
	};

	const handleJoinRoom = () => {
		if (!playerName.trim() || !roomCode.trim()) {
			setError("Please enter your name and room code");
			return;
		}
		setIsLoading(true);
		setError("");
		joinRoomMutation.mutate({
			roomCode: roomCode.trim().toUpperCase(),
			guestName: playerName.trim(),
		});
	};

	const handleStartGame = () => {
		if (!roomInfo) return;
		startGameMutation.mutate({
			roomId: roomInfo.roomId,
			playerId: roomInfo.playerId,
			settings: {
				dateType: "dating",
				gameLength: "standard",
				enableTimer: false,
				timerSeconds: 60,
				enableMusic: false,
				showSparks: true,
				selectedCategories: [1, 2, 3, 4, 5, 6],
			},
		});
	};

	const clearSession = () => {
		localStorage.removeItem("spark-tell-player-id");
		localStorage.removeItem("spark-tell-room-id");
		setStep("setup");
		setMode(null);
		setLocalRoomInfo(null);
		setConnectionStatus("disconnected");
		setError("");
	};

	// Setup Phase
	if (step === "setup") {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="w-full max-w-md rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md"
				>
					<h2 className="mb-6 text-center font-bold text-2xl text-white">
						Play Online
					</h2>

					{!mode && (
						<div className="space-y-4">
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setMode("create")}
								className="w-full rounded-full bg-white py-3 font-bold text-lg text-purple-600"
							>
								Create Room
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setMode("join")}
								className="w-full rounded-full bg-white/20 py-3 font-bold text-lg text-white"
							>
								Join Room
							</motion.button>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={onBack}
								className="w-full rounded-full bg-red-500/20 py-2 font-semibold text-red-200"
							>
								Back
							</motion.button>
						</div>
					)}

					{mode && (
						<div className="space-y-4">
							<input
								type="text"
								placeholder="Your name"
								value={playerName}
								onChange={(e) => setPlayerName(e.target.value)}
								className="w-full rounded-full px-4 py-3 text-center font-semibold text-gray-800"
								maxLength={20}
							/>

							{mode === "join" && (
								<input
									type="text"
									placeholder="Room Code (6 letters)"
									value={roomCode}
									onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
									className="w-full rounded-full px-4 py-3 text-center font-mono font-semibold text-gray-800 tracking-widest"
									maxLength={6}
								/>
							)}

							{error && (
								<div className="rounded-lg bg-red-500/20 p-3 text-center text-red-200 text-sm">
									{error}
								</div>
							)}

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={mode === "create" ? handleCreateRoom : handleJoinRoom}
								disabled={isLoading}
								className="w-full rounded-full bg-white py-3 font-bold text-lg text-purple-600 disabled:opacity-50"
							>
								{isLoading ? "Loading..." : mode === "create" ? "Create Room" : "Join Room"}
							</motion.button>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setMode(null)}
								className="w-full rounded-full bg-white/20 py-2 font-semibold text-white"
							>
								Back
							</motion.button>
						</div>
					)}
				</motion.div>
			</div>
		);
	}

	// Lobby Phase
	if (step === "lobby") {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="w-full max-w-lg rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md"
				>
					<h2 className="mb-4 text-center font-bold text-2xl text-white">
						Game Room
					</h2>

					{roomInfo && roomInfo.roomCode !== "RESTORED" && (
						<div className="mb-6 text-center">
							<div className="mb-2 text-white/80">Room Code:</div>
							<div className="rounded-lg bg-white/20 px-4 py-2 font-bold font-mono text-2xl text-white tracking-widest">
								{roomInfo.roomCode}
							</div>
						</div>
					)}

					<div className="mb-6 space-y-3">
						<div className="flex items-center rounded-lg bg-white/20 p-3">
							<div className="mr-3 text-2xl">👑</div>
							<div>
								<div className="font-semibold text-white">
									{players.host.name || "Host"}
								</div>
								<div className="text-sm text-white/70">Host</div>
							</div>
							<div className="ml-auto h-3 w-3 rounded-full bg-green-400"></div>
						</div>

						<div className="flex items-center rounded-lg bg-white/20 p-3">
							<div className="mr-3 text-2xl">👤</div>
							<div>
								{players.guest ? (
									<>
										<div className="font-semibold text-white">
											{players.guest.name}
										</div>
										<div className="text-sm text-white/70">Player 2</div>
									</>
								) : (
									<div className="text-white/70">Waiting for player...</div>
								)}
							</div>
							{players.guest && (
								<div className="ml-auto h-3 w-3 rounded-full bg-green-400"></div>
							)}
						</div>
					</div>

					<div className="space-y-3">
						{players.host.id === roomInfo?.playerId && players.guest && (
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={handleStartGame}
								disabled={startGameMutation.isPending}
								className="w-full rounded-full bg-white py-3 font-bold text-lg text-purple-600"
							>
								{startGameMutation.isPending ? "Starting..." : "Start Game! 🎲"}
							</motion.button>
						)}

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={clearSession}
							className="w-full rounded-full bg-red-500/20 py-2 font-semibold text-red-200"
						>
							Leave Room
						</motion.button>
					</div>

					<div className="mt-4 text-center">
						<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80">
							<div className="h-2 w-2 rounded-full bg-green-400"></div>
							Connected
						</div>
					</div>
				</motion.div>
			</div>
		);
	}

	// Game Phase - Import the actual game component
	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700">
			<div className="p-4 text-center text-white">
				<h1 className="font-bold text-2xl">Game Started!</h1>
				<p>Room: {roomInfo?.roomCode}</p>
				<p>Status: Connected</p>
				<button
					onClick={clearSession}
					className="mt-4 rounded-full bg-red-500/20 px-4 py-2 text-red-200"
				>
					Leave Game
				</button>
			</div>
		</div>
	);
}