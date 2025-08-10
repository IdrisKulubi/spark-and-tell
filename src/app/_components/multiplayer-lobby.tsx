"use client";

import { useMultiplayerStore } from "@/store/multiplayerStore";
import { api } from "@/trpc/react";
import type { DateType, GameLength } from "@/types/game";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MultiplayerLobby() {
	const {
		roomCode,
		players,
		waitingForPlayer,
		connectionStatus,
		handleGameEvent,
	} = useMultiplayerStore();

	const [dateType, setDateType] = useState<DateType>("first");
	const [gameLength, setGameLength] = useState<GameLength>("standard");
	const [copied, setCopied] = useState(false);

	const roomId = localStorage.getItem("spark-tell-room-id") || "";
	const playerId = localStorage.getItem("spark-tell-player-id") || "";

	// Subscribe to room events
	api.game.subscribeToRoom.useSubscription(
		{ roomId, playerId },
		{
			onData: (event) => {
				handleGameEvent(event);
			},
			onError: (error) => {
				console.error("Subscription error:", error);
			},
		},
	);

	const startGameMutation = api.game.startGame.useMutation({
		onError: (error) => {
			console.error("Failed to start game:", error);
		},
	});

	const leaveRoomMutation = api.game.leaveRoom.useMutation({
		onSuccess: () => {
			localStorage.removeItem("spark-tell-player-id");
			localStorage.removeItem("spark-tell-room-id");
			// Navigate back to landing
			window.location.reload();
		},
	});

	const handleCopyRoomCode = async () => {
		try {
			await navigator.clipboard.writeText(roomCode);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = roomCode;
			document.body.appendChild(textArea);
			textArea.select();
			document.execCommand("copy");
			document.body.removeChild(textArea);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const handleStartGame = () => {
		if (!players.guest) return;

		startGameMutation.mutate({
			roomId,
			playerId,
			settings: {
				dateType,
				gameLength,
				enableTimer: false,
				timerSeconds: 60,
				enableMusic: false,
				showSparks: true,
				selectedCategories: [1, 2, 3, 4, 5, 6],
			},
		});
	};

	const handleLeaveRoom = () => {
		leaveRoomMutation.mutate({ roomId, playerId });
	};

	if (connectionStatus === "disconnected") {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
				<div className="text-center text-white">
					<h2 className="mb-4 font-bold text-2xl">Connection Lost</h2>
					<p className="mb-6">You've been disconnected from the game room.</p>
					<button
						onClick={() => window.location.reload()}
						className="rounded-full bg-white px-6 py-3 font-bold text-purple-600"
					>
						Return to Home
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-lg rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8"
			>
				{/* Room Code Display */}
				<div className="mb-6 text-center">
					<h2 className="mb-4 font-bold text-2xl text-white sm:text-3xl">
						Game Room
					</h2>
					<div className="mb-2 text-white/80">Room Code:</div>
					<div className="flex items-center justify-center gap-2">
						<div className="rounded-lg bg-white/20 px-4 py-2 font-bold font-mono text-2xl text-white tracking-widest">
							{roomCode}
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleCopyRoomCode}
							className="rounded-lg bg-white/20 p-2 text-white hover:bg-white/30"
						>
							{copied ? "✓" : "📋"}
						</motion.button>
					</div>
					{copied && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0 }}
							className="mt-2 text-green-300 text-sm"
						>
							Copied to clipboard!
						</motion.div>
					)}
				</div>

				{/* Players */}
				<div className="mb-6 space-y-3">
					<div className="flex items-center rounded-lg bg-white/20 p-3">
						<div className="mr-3 text-2xl">👑</div>
						<div>
							<div className="font-semibold text-white">
								{players.host.name}
							</div>
							<div className="text-sm text-white/70">Host</div>
						</div>
						{players.host.isConnected && (
							<div className="ml-auto h-3 w-3 rounded-full bg-green-400"></div>
						)}
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
						{players.guest?.isConnected && (
							<div className="ml-auto h-3 w-3 rounded-full bg-green-400"></div>
						)}
					</div>
				</div>

				{/* Game Settings (Host Only) */}
				{players.host.id === playerId && players.guest && (
					<div className="mb-6 space-y-4">
						<div>
							<div className="mb-3 block text-sm text-white/90">Date Type</div>
							<div className="grid grid-cols-3 gap-2">
								<DateTypeButton
									active={dateType === "first"}
									onClick={() => setDateType("first")}
									label="First"
								/>
								<DateTypeButton
									active={dateType === "dating"}
									onClick={() => setDateType("dating")}
									label="Dating"
								/>
								<DateTypeButton
									active={dateType === "longterm"}
									onClick={() => setDateType("longterm")}
									label="Long-term"
								/>
							</div>
						</div>

						<div>
							<div className="mb-3 block text-sm text-white/90">
								Game Length
							</div>
							<div className="grid grid-cols-3 gap-2">
								<GameLengthButton
									active={gameLength === "quick"}
									onClick={() => setGameLength("quick")}
									label="Quick"
								/>
								<GameLengthButton
									active={gameLength === "standard"}
									onClick={() => setGameLength("standard")}
									label="Standard"
								/>
								<GameLengthButton
									active={gameLength === "marathon"}
									onClick={() => setGameLength("marathon")}
									label="Marathon"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Actions */}
				<div className="space-y-3">
					{players.host.id === playerId && players.guest && (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleStartGame}
							disabled={startGameMutation.isPending}
							className="w-full rounded-full bg-white py-3 font-bold text-lg text-purple-600 shadow-xl transition-shadow hover:shadow-white/30 disabled:opacity-50 sm:py-4 sm:text-xl"
						>
							{startGameMutation.isPending ? "Starting..." : "Start Game! 🎲"}
						</motion.button>
					)}

					{waitingForPlayer && (
						<div className="text-center text-white/80">
							<div className="mb-2">Share the room code with your partner!</div>
							<div className="text-sm">
								They can join at spark-and-tell.vercel.app
							</div>
						</div>
					)}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleLeaveRoom}
						disabled={leaveRoomMutation.isPending}
						className="w-full rounded-full bg-red-500/20 py-2 font-semibold text-red-200 hover:bg-red-500/30"
					>
						Leave Room
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
}

function DateTypeButton({
	active,
	onClick,
	label,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
}) {
	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`rounded-xl py-2 text-center transition-colors ${
				active ? "bg-white/30 shadow-lg" : "bg-white/10 hover:bg-white/20"
			}`}
		>
			<div className="font-semibold text-sm text-white">{label}</div>
		</motion.button>
	);
}

function GameLengthButton({
	active,
	onClick,
	label,
}: {
	active: boolean;
	onClick: () => void;
	label: string;
}) {
	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`rounded-xl py-2 text-center transition-colors ${
				active ? "bg-white/30 shadow-lg" : "bg-white/10 hover:bg-white/20"
			}`}
		>
			<div className="font-semibold text-sm text-white">{label}</div>
		</motion.button>
	);
}
