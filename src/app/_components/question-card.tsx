"use client";

import { CategoryNames } from "@/types/game";
import type { Question } from "@/types/game";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface QuestionCardProps {
	question: Question | null;
	isVisible: boolean;
}

export function QuestionCard({ question, isVisible }: QuestionCardProps) {
	const [isFlipped, setIsFlipped] = useState(false);

	if (!question) return null;

	const categoryColors: Record<number, string> = {
		1: "from-blue-400 to-blue-600",
		2: "from-purple-400 to-purple-600",
		3: "from-green-400 to-green-600",
		4: "from-yellow-400 to-yellow-600",
		5: "from-red-400 to-red-600",
		6: "from-indigo-400 to-indigo-600",
	};

	const difficultyStars = "⭐".repeat(question.difficulty);

	return (
		<AnimatePresence mode="wait">
			{isVisible && (
				<motion.div
					key={question.id}
					initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
					animate={{ opacity: 1, scale: 1, rotateY: 0 }}
					exit={{ opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.6, type: "spring" }}
					className="w-full max-w-sm px-4 sm:max-w-md sm:px-0"
				>
					<div
						className={`relative rounded-2xl bg-gradient-to-br sm:rounded-3xl ${
							categoryColors[question.category] ?? "from-gray-400 to-gray-600"
						} p-6 shadow-2xl sm:p-8`}
					>
						{/* Category Badge */}
						<div className="-top-3 sm:-top-4 -translate-x-1/2 absolute left-1/2 rounded-full bg-white px-3 py-0.5 shadow-lg sm:px-4 sm:py-1">
							<span className="font-semibold text-gray-800 text-xs sm:text-sm">
								{CategoryNames[question.category]}
							</span>
						</div>

						{/* Question Number */}
						<div className="-top-3 sm:-top-4 absolute right-3 rounded-full bg-white px-2 py-0.5 shadow-lg sm:right-4 sm:px-3 sm:py-1">
							<span className="font-semibold text-gray-600 text-xs">
								#{question.id.split("-")[1]}
							</span>
						</div>

						{/* Main Question */}
						<div className="mt-4 text-center">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="mb-4 font-bold text-white text-xl sm:text-2xl md:text-3xl"
							>
								{question.text}
							</motion.div>

							{/* Follow-up Question */}
							{question.followUp && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.5 }}
									className="mt-4 text-base text-white/90 italic sm:text-lg"
								>
									{question.followUp}
								</motion.div>
							)}

							{/* Question Type Badge */}
							{question.type !== "standard" && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.6 }}
									className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1.5 sm:mt-6 sm:px-4 sm:py-2"
								>
									<span className="font-semibold text-sm text-white sm:text-base">
										{question.type === "both-answer"
											? "👥 Both Answer"
											: "🎯 Challenge"}
									</span>
								</motion.div>
							)}

							{/* Points and Difficulty */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
								className="mt-4 flex items-center justify-center gap-3"
							>
								<span className="rounded-full bg-white/20 px-2 py-0.5 font-semibold text-white text-xs sm:px-3 sm:py-1 sm:text-sm">
									+{question.points} base points
								</span>
								<span className="text-base text-white/80 sm:text-lg">
									{difficultyStars}
								</span>
							</motion.div>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
