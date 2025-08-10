"use client";

import { useMultiplayerStore } from "@/store/multiplayerStore";
import { api } from "@/trpc/react";
import { motion } from "framer-motion";
import React, { useState } from "react";

interface MultiplayerSetupProps {
	onBack: () => void;
}

export function MultiplayerSetup({ onBack }: MultiplayerSetupProps) {
	const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
	const [playerName, setPlayerName] = useState("");
	const [roomCode, setRoomCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const { setRoomInfo, setPlayers, setConnectionStatus, setWaitingForPlayer, setGamePhase } =
		useMultiplayerStore();

	// Check for existing connection on component mount
	React.useEffect(() => {
		const savedPlayerId = localStorage.getItem("spark-tell-player-id");
		const savedRoomId = localStorage.getItem("spark-tell-room-id");
		
		if (savedPlayerId && savedRoomId) {
			console.log("🔄 Found existing session, attempting to reconnect:", {
				playerId: savedPlayerId,
				roomId: savedRoomId
			});
			
			// Try to reconnect to existing room
			setConnectionStatus("connecting");
			// The GameContainer will handle the reconnection logic
		}
	}, [setConnectionStatus]);

	const createRoomMutation = api.game.createRoom.useMutation({
		onSuccess: (data) => {
			console.log("🏠 Room created successfully:", data);
			setRoomInfo(data.roomId, data.roomCode);
			setPlayers(
				{
					id: data.playerId,
					name: playerName.trim(),
					isHost: true,
					isConnected: true,
					joinedAt: new Date(),
				},
				null,
			);
			setConnectionStatus("connected");
			setWaitingForPlayer(true);
			setGamePhase("setup"); // Set to lobby phase
			// Store player ID in localStorage for reconnection
			localStorage.setItem("spark-tell-player-id", data.playerId);
			localStorage.setItem("spark-tell-room-id", data.roomId);
			console.log("💾 Stored in localStorage:", {
				playerId: data.playerId,
				roomId: data.roomId
			});
		},
		onError: (error) => {
			setError(error.message);
			setIsLoading(false);
		},
	});

	const joinRoomMutation = api.game.joinRoom.useMutation({
		onSuccess: (data) => {
			console.log("🚪 Joined room successfully:", data);
			setRoomInfo(data.roomId, data.roomCode);
			
			// Set up both players - host info from gameState, guest is current player
			setPlayers(
				{
					id: "", // Host ID will be set by backend events
					name: data.gameState.settings.player1Name,
					isHost: true,
					isConnected: true,
					joinedAt: new Date(),
				},
				{
					id: data.playerId,
					name: playerName.trim(),
					isHost: false,
					isConnected: true,
					joinedAt: new Date(),
				}
			);
			
			setConnectionStatus("connected");
			setWaitingForPlayer(false);
			setGamePhase("setup"); // Set to lobby phase
			// Store player ID in localStorage for reconnection
			localStorage.setItem("spark-tell-player-id", data.playerId);
			localStorage.setItem("spark-tell-room-id", data.roomId);
			console.log("💾 Stored in localStorage:", {
				playerId: data.playerId,
				roomId: data.roomId
			});
		},
		onError: (error) => {
			setError(error.message);
			setIsLoading(false);
		},
	});

	const handleCreateRoom = async () => {
		if (!playerName.trim()) {
			setError("Please enter your name");
			return;
		}

		setIsLoading(true);
		setError("");
		createRoomMutation.mutate({ hostName: playerName.trim() });
	};

	const handleJoinRoom = async () => {
		if (!playerName.trim()) {
			setError("Please enter your name");
			return;
		}

		if (!roomCode.trim() || roomCode.length !== 6) {
			setError("Please enter a valid 6-character room code");
			return;
		}

		setIsLoading(true);
		setError("");
		joinRoomMutation.mutate({
			roomCode: roomCode.trim().toUpperCase(),
			guestName: playerName.trim(),
		});
	};

	if (mode === "choose") {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8"
				>
					<motion.button
						onClick={onBack}
						className="mb-4 text-white/70 hover:text-white"
						whileHover={{ scale: 1.05 }}
					>
						← Back
					</motion.button>

					<h2 className="mb-6 text-center font-bold text-2xl text-white sm:mb-8 sm:text-3xl">
						Play Online
					</h2>

					<div className="space-y-4">
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setMode("create")}
							className="w-full rounded-xl bg-white/20 p-4 text-left transition-colors hover:bg-white/30"
						>
							<div className="flex items-center">
								<span className="mr-3 text-2xl">🏠</span>
								<div>
									<div className="font-semibold text-white">Create Room</div>
									<div className="text-sm text-white/70">
										Start a new game and invite someone
									</div>
								</div>
							</div>
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => setMode("join")}
							className="w-full rounded-xl bg-white/20 p-4 text-left transition-colors hover:bg-white/30"
						>
							<div className="flex items-center">
								<span className="mr-3 text-2xl">🚪</span>
								<div>
									<div className="font-semibold text-white">Join Room</div>
									<div className="text-sm text-white/70">
										Enter a room code to join a game
									</div>
								</div>
							</div>
						</motion.button>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8"
			>
				<motion.button
					onClick={() => setMode("choose")}
					className="mb-4 text-white/70 hover:text-white"
					whileHover={{ scale: 1.05 }}
				>
					← Back
				</motion.button>

				<h2 className="mb-6 text-center font-bold text-2xl text-white sm:mb-8 sm:text-3xl">
					{mode === "create" ? "Create Room" : "Join Room"}
				</h2>

				<div className="space-y-4 sm:space-y-6">
					<div>
						<label
							htmlFor="playerName"
							className="mb-2 block text-sm text-white/90"
						>
							Your Name
						</label>
						<input
							id="playerName"
							type="text"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							placeholder="Enter your name..."
							className="w-full rounded-xl bg-white/20 px-3 py-2.5 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/30 focus:outline-none sm:px-4 sm:py-3"
							maxLength={50}
						/>
					</div>

					{mode === "join" && (
						<div>
							<label
								htmlFor="roomCode"
								className="mb-2 block text-sm text-white/90"
							>
								Room Code
							</label>
							<input
								id="roomCode"
								type="text"
								value={roomCode}
								onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
								placeholder="Enter 6-character code..."
								className="w-full rounded-xl bg-white/20 px-3 py-2.5 text-center font-mono text-lg text-white tracking-widest placeholder-white/50 backdrop-blur-sm focus:bg-white/30 focus:outline-none sm:px-4 sm:py-3"
								maxLength={6}
							/>
						</div>
					)}

					{error && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className="rounded-lg bg-red-500/20 p-3 text-red-200 text-sm"
						>
							{error}
						</motion.div>
					)}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={mode === "create" ? handleCreateRoom : handleJoinRoom}
						disabled={isLoading}
						className="w-full rounded-full bg-white py-3 font-bold text-lg text-purple-600 shadow-xl transition-shadow hover:shadow-white/30 disabled:opacity-50 sm:py-4 sm:text-xl"
					>
						{isLoading ? (
							<span className="flex items-center justify-center">
								<svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
										fill="none"
									/>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									/>
								</svg>
								{mode === "create" ? "Creating..." : "Joining..."}
							</span>
						) : (
							`${mode === "create" ? "Create Room" : "Join Room"} 🎮`
						)}
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
}
