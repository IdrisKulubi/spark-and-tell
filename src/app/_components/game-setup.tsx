"use client";

import { useGameStore } from "@/store/gameStore";
import type { DateType, GameLength, GameSettings } from "@/types/game";
import { motion } from "framer-motion";
import { useState } from "react";

export function GameSetup() {
	const initializeGame = useGameStore((state) => state.initializeGame);
	const setGamePhase = useGameStore((state) => state.setGamePhase);

	const [player1Name, setPlayer1Name] = useState("");
	const [player2Name, setPlayer2Name] = useState("");
	const [dateType, setDateType] = useState<DateType>("first");
	const [gameLength, setGameLength] = useState<GameLength>("standard");

	const handleStartGame = () => {
		const settings: GameSettings = {
			player1Name: player1Name || "Player 1",
			player2Name: player2Name || "Player 2",
			dateType,
			gameLength,
			enableTimer: false,
			timerSeconds: 60,
			enableMusic: false,
			showSparks: true,
			selectedCategories: [1, 2, 3, 4, 5, 6], // All categories available
		};
		initializeGame(settings);
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
			<motion.div
				initial={{ opacity: 0, scale: 0.9 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md rounded-3xl bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8"
			>
				<motion.button
					onClick={() => setGamePhase("landing")}
					className="mb-4 text-white/70 hover:text-white"
					whileHover={{ scale: 1.05 }}
				>
					← Back
				</motion.button>

				<h2 className="mb-6 text-center font-bold text-2xl text-white sm:mb-8 sm:text-3xl">
					Let's Get Started!
				</h2>

				<div className="space-y-4 sm:space-y-6">
					<div>
						<label
							htmlFor="player1"
							className="mb-2 block text-sm text-white/90"
						>
							Player 1 Name
						</label>
						<input
							id="player1"
							type="text"
							value={player1Name}
							onChange={(e) => setPlayer1Name(e.target.value)}
							placeholder="Enter name..."
							className="w-full rounded-xl bg-white/20 px-3 py-2.5 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/30 focus:outline-none sm:px-4 sm:py-3"
						/>
					</div>

					<div>
						<label
							htmlFor="player2"
							className="mb-2 block text-sm text-white/90"
						>
							Player 2 Name
						</label>
						<input
							id="player2"
							type="text"
							value={player2Name}
							onChange={(e) => setPlayer2Name(e.target.value)}
							placeholder="Enter name..."
							className="w-full rounded-xl bg-white/20 px-3 py-2.5 text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/30 focus:outline-none sm:px-4 sm:py-3"
						/>
					</div>

					<div>
						<div className="mb-3 block text-sm text-white/90">
							What kind of date is this?
						</div>
						<div className="space-y-2">
							<DateTypeButton
								active={dateType === "first"}
								onClick={() => setDateType("first")}
								emoji="🌟"
								label="First Date"
								description="Gentle icebreakers"
							/>
							<DateTypeButton
								active={dateType === "dating"}
								onClick={() => setDateType("dating")}
								emoji="💕"
								label="Been Dating"
								description="Balanced mix"
							/>
							<DateTypeButton
								active={dateType === "longterm"}
								onClick={() => setDateType("longterm")}
								emoji="🔥"
								label="Long-term Love"
								description="All categories"
							/>
						</div>
					</div>

					<div>
						<div className="mb-3 block text-sm text-white/90">
							How long do you want to play?
						</div>
						<div className="grid grid-cols-3 gap-2">
							<GameLengthButton
								active={gameLength === "quick"}
								onClick={() => setGameLength("quick")}
								label="Quick"
								time="15 min"
							/>
							<GameLengthButton
								active={gameLength === "standard"}
								onClick={() => setGameLength("standard")}
								label="Standard"
								time="30 min"
							/>
							<GameLengthButton
								active={gameLength === "marathon"}
								onClick={() => setGameLength("marathon")}
								label="Marathon"
								time="60+ min"
							/>
						</div>
					</div>

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={handleStartGame}
						className="w-full rounded-full bg-white py-3 font-bold text-lg text-purple-600 shadow-xl transition-shadow hover:shadow-white/30 sm:py-4 sm:text-xl"
					>
						Let's Play! 🎲
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
}

function DateTypeButton({
	active,
	onClick,
	emoji,
	label,
	description,
}: {
	active: boolean;
	onClick: () => void;
	emoji: string;
	label: string;
	description: string;
}) {
	return (
		<motion.button
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			onClick={onClick}
			className={`flex w-full items-center rounded-xl p-2.5 text-left transition-colors sm:p-3 ${
				active ? "bg-white/30 shadow-lg" : "bg-white/10 hover:bg-white/20"
			}`}
		>
			<span className="mr-2 text-xl sm:mr-3 sm:text-2xl">{emoji}</span>
			<div>
				<div className="font-semibold text-sm text-white sm:text-base">
					{label}
				</div>
				<div className="text-white/70 text-xs">{description}</div>
			</div>
		</motion.button>
	);
}

function GameLengthButton({
	active,
	onClick,
	label,
	time,
}: { active: boolean; onClick: () => void; label: string; time: string }) {
	return (
		<motion.button
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={onClick}
			className={`rounded-xl py-2.5 text-center transition-colors sm:py-3 ${
				active ? "bg-white/30 shadow-lg" : "bg-white/10 hover:bg-white/20"
			}`}
		>
			<div className="font-semibold text-sm text-white sm:text-base">
				{label}
			</div>
			<div className="text-white/70 text-xs">{time}</div>
		</motion.button>
	);
}
