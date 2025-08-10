"use client";

import { useGameStore } from "@/store/gameStore";
import type { PowerUpType } from "@/types/game";
import { motion } from "framer-motion";

const POWER_UPS = [
	{
		type: "skip" as PowerUpType,
		label: "Skip",
		emoji: "⏭️",
		description: "Skip this question",
		maxUses: 2,
	},
	{
		type: "re-roll" as PowerUpType,
		label: "Re-Roll",
		emoji: "🎲",
		description: "Roll the dice again",
		maxUses: 2,
	},
	{
		type: "both-answer" as PowerUpType,
		label: "Both Answer",
		emoji: "👥",
		description: "Both players answer",
		maxUses: 1,
	},
	{
		type: "reverse" as PowerUpType,
		label: "Reverse",
		emoji: "🔄",
		description: "Switch who answers",
		maxUses: 1,
	},
];

export function PowerUps() {
	const { currentTurn, powerUpsUsed, usePowerUp, currentQuestion, gamePhase } =
		useGameStore();

	const currentPlayerPowerUps = powerUpsUsed[currentTurn];

	const handleUsePowerUp = (type: PowerUpType) => {
		usePowerUp(type);
	};

	// Only show during playing phase
	if (gamePhase !== "playing") return null;

	// Filter power-ups based on context
	const availablePowerUps = POWER_UPS.filter((powerUp) => {
		if (!currentQuestion) {
			// Before rolling dice - can't skip or re-roll yet
			return powerUp.type === "both-answer" || powerUp.type === "reverse";
		} else {
			// After seeing question - all power-ups available
			return true;
		}
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
			className="flex flex-wrap justify-center gap-2"
		>
			{availablePowerUps.map((powerUp) => {
				const usesLeft = powerUp.maxUses - currentPlayerPowerUps[powerUp.type];
				const isDisabled = usesLeft <= 0;

				return (
					<motion.button
						key={powerUp.type}
						type="button"
						whileHover={!isDisabled ? { scale: 1.05 } : {}}
						whileTap={!isDisabled ? { scale: 0.95 } : {}}
						onClick={() => !isDisabled && handleUsePowerUp(powerUp.type)}
						disabled={isDisabled}
						className={`group relative rounded-full px-4 py-2 font-semibold text-sm transition-all ${
							isDisabled
								? "cursor-not-allowed bg-white/10 text-white/30"
								: "bg-white/20 text-white hover:bg-white/30"
						}`}
					>
						<span className="mr-1 text-lg">{powerUp.emoji}</span>
						<span>{powerUp.label}</span>
						<span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
							{usesLeft}
						</span>

						{/* Tooltip */}
						{!isDisabled && (
							<div className="-top-10 -translate-x-1/2 pointer-events-none absolute left-1/2 whitespace-nowrap rounded-lg bg-black/80 px-3 py-1 text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
								{powerUp.description}
							</div>
						)}
					</motion.button>
				);
			})}
		</motion.div>
	);
}
