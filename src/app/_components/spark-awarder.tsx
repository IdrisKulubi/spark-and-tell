"use client";

import { SPARK_REACTIONS } from "@/types/game";
import type { SparkType } from "@/types/game";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface SparkAwarderProps {
	onAward: (sparkTypes: SparkType[]) => void;
	recipientName: string;
}

interface ExtendedSparkAwarderProps extends SparkAwarderProps {
	basePointsAwarded?: number;
}

export function SparkAwarder({
	onAward,
	recipientName,
	basePointsAwarded,
}: ExtendedSparkAwarderProps) {
	const [selectedSparks, setSelectedSparks] = useState<SparkType[]>([]);
	const [showConfetti, setShowConfetti] = useState(false);

	const toggleSparkSelection = (sparkType: SparkType) => {
		setSelectedSparks((prev) =>
			prev.includes(sparkType)
				? prev.filter((s) => s !== sparkType)
				: [...prev, sparkType],
		);
	};

	const handleAwardSparks = () => {
		if (selectedSparks.length > 0) {
			setShowConfetti(true);
		}
		onAward(selectedSparks);

		// Reset after animation
		setTimeout(() => {
			setSelectedSparks([]);
			setShowConfetti(false);
		}, 1500);
	};

	const totalPoints = selectedSparks.reduce((sum, type) => {
		const reaction = SPARK_REACTIONS.find((r) => r.type === type);
		return sum + (reaction?.points ?? 0);
	}, 0);

	return (
		<div className="mx-auto w-full max-w-2xl">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-6 text-center"
			>
				<h3 className="mb-2 font-bold text-white text-xl sm:text-2xl">
					Award Sparks to {recipientName}! ✨
				</h3>
				{basePointsAwarded && (
					<p className="mb-1 text-sm text-white/70">
						({recipientName} already earned {basePointsAwarded} base points)
					</p>
				)}
				<p className="text-sm text-white/80 sm:text-base">
					How did their answer make you feel?
				</p>
			</motion.div>

			<div className="mb-6 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
				{SPARK_REACTIONS.map((reaction, index) => (
					<motion.button
						key={reaction.type}
						type="button"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: index * 0.05 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={() => toggleSparkSelection(reaction.type)}
						className={`relative rounded-xl p-3 transition-all sm:rounded-2xl sm:p-4 ${
							selectedSparks.includes(reaction.type)
								? "scale-105 bg-white shadow-xl"
								: "bg-white/20 hover:bg-white/30"
						}`}
					>
						<div className="mb-1 text-2xl sm:text-3xl">{reaction.emoji}</div>
						<div
							className={`font-semibold text-[10px] sm:text-xs ${
								selectedSparks.includes(reaction.type)
									? "text-purple-600"
									: "text-white"
							}`}
						>
							{reaction.label}
						</div>
						<div
							className={`mt-1 text-[10px] sm:text-xs ${selectedSparks.includes(reaction.type) ? "text-purple-500" : "text-white/70"}`}
						>
							+{reaction.points} sparks
						</div>
						{selectedSparks.includes(reaction.type) && (
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className="-top-2 -right-2 absolute flex h-6 w-6 items-center justify-center rounded-full bg-purple-500"
							>
								<span className="text-white text-xs">✓</span>
							</motion.div>
						)}
					</motion.button>
				))}
			</div>

			{selectedSparks.length > 0 && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					className="mb-4 text-center"
				>
					<div className="text-base text-white sm:text-lg">
						Total:{" "}
						<span className="font-bold text-xl sm:text-2xl">
							+{totalPoints}
						</span>{" "}
						sparks
					</div>
				</motion.div>
			)}

			<motion.button
				type="button"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				onClick={handleAwardSparks}
				className="w-full rounded-full bg-white py-3 font-bold text-lg text-purple-600 shadow-xl transition-all hover:shadow-white/30 sm:py-4 sm:text-xl"
			>
				{selectedSparks.length > 0
					? `Award ${totalPoints} Sparks! 🎉`
					: "Skip - No Sparks"}
			</motion.button>

			{/* Confetti Animation */}
			<AnimatePresence>
				{showConfetti && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="pointer-events-none fixed inset-0 z-50"
					>
						{[...Array(20)].map((_, i) => (
							<motion.div
								key={`confetti-${i}`}
								initial={{
									x: "50vw",
									y: "50vh",
									scale: 0,
								}}
								animate={{
									x: `${Math.random() * 100}vw`,
									y: `${Math.random() * 100}vh`,
									scale: [0, 1, 0],
								}}
								transition={{
									duration: 1.5,
									ease: "easeOut",
								}}
								className="absolute text-3xl"
							>
								✨
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
