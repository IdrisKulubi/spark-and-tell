"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface TutorialModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
	const [currentStep, setCurrentStep] = useState(0);

	const tutorialSteps = [
		{
			title: "Welcome to Spark & Tell! 🎉",
			content: "A fun game for couples to connect deeper through meaningful questions.",
			emoji: "💕",
		},
		{
			title: "How to Play",
			content: "Take turns rolling the dice. Each number corresponds to a different question category.",
			emoji: "🎲",
		},
		{
			title: "Categories",
			content: "1: Icebreakers 🧊\n2: Dreams ✨\n3: Would You Rather 🤔\n4: Story Time 📖\n5: Spicy 🔥\n6: Deep Dive 💭",
			emoji: "📝",
		},
		{
			title: "Answering Questions",
			content: "Answer honestly and from the heart. Each question has base points based on difficulty.",
			emoji: "💬",
		},
		{
			title: "Award Sparks",
			content: "After your partner answers, award them sparks based on how their answer made you feel!",
			emoji: "✨",
		},
		{
			title: "Power-Ups",
			content: "Use special abilities like Skip, Re-roll, or Both Answer to spice things up!",
			emoji: "⚡",
		},
		{
			title: "Win Together",
			content: "The goal isn't to beat each other - it's to connect and learn about each other!",
			emoji: "🏆",
		},
	];

	const handleNext = () => {
		if (currentStep < tutorialSteps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			onClose();
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSkip = () => {
		onClose();
		setCurrentStep(0);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
					onClick={handleSkip}
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ type: "spring", duration: 0.5 }}
						className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button */}
						<button
							type="button"
							onClick={handleSkip}
							className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						>
							<svg
								className="h-6 w-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>

						{/* Progress dots */}
						<div className="mb-6 flex justify-center gap-2">
							{tutorialSteps.map((_, index) => (
								<div
									key={`step-${index}`}
									className={`h-2 rounded-full transition-all ${
										index === currentStep
											? "w-8 bg-purple-600"
											: index < currentStep
											  ? "w-2 bg-purple-300"
											  : "w-2 bg-gray-300"
									}`}
								/>
							))}
						</div>

						{/* Content */}
						<AnimatePresence mode="wait">
							<motion.div
								key={currentStep}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className="text-center"
							>
								<div className="mb-4 text-6xl">
									{tutorialSteps[currentStep]?.emoji}
								</div>
								<h2 className="mb-4 font-bold text-2xl text-gray-800">
									{tutorialSteps[currentStep]?.title}
								</h2>
								<p className="whitespace-pre-line text-gray-600">
									{tutorialSteps[currentStep]?.content}
								</p>
							</motion.div>
						</AnimatePresence>

						{/* Navigation buttons */}
						<div className="mt-8 flex justify-between gap-4">
							<button
								type="button"
								onClick={handlePrevious}
								disabled={currentStep === 0}
								className={`rounded-full px-6 py-2 font-semibold transition-all ${
									currentStep === 0
										? "cursor-not-allowed bg-gray-100 text-gray-400"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								Previous
							</button>

							<button
								type="button"
								onClick={handleSkip}
								className="font-semibold text-gray-500 hover:text-gray-700"
							>
								Skip Tutorial
							</button>

							<button
								type="button"
								onClick={handleNext}
								className="rounded-full bg-purple-600 px-6 py-2 font-semibold text-white hover:bg-purple-700"
							>
								{currentStep === tutorialSteps.length - 1 ? "Let's Play!" : "Next"}
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}