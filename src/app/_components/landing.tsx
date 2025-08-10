"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { useState } from "react";
import { BuyMeCoffee } from "./buy-me-coffee";
import { TutorialModal } from "./tutorial-modal";

export function Landing() {
	const setGamePhase = useGameStore((state) => state.setGamePhase);
	const currentGamePhase = useGameStore((state) => state.gamePhase);
	const [showTutorial, setShowTutorial] = useState(false);
	
	console.log("🏠 Landing component - current gamePhase:", currentGamePhase);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
			{/* Tutorial Modal */}
			<TutorialModal
				isOpen={showTutorial}
				onClose={() => setShowTutorial(false)}
			/>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-4xl px-4 text-center"
			>
				<motion.h1
					className="mb-4 font-bold text-5xl text-white sm:text-6xl md:text-7xl lg:text-8xl"
					initial={{ scale: 0.5 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					Spark & Tell
				</motion.h1>
				<motion.p
					className="mb-8 px-4 text-lg text-white/90 sm:mb-12 sm:px-0 sm:text-xl md:text-2xl"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					Turn awkward dates into unforgettable connections
				</motion.p>

				<motion.div
					className="space-y-4"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.6 }}
				>
					<div className="flex flex-col items-center gap-3 sm:gap-4">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setGamePhase("setup")}
							className="rounded-full bg-white px-8 py-4 font-bold text-lg text-purple-600 shadow-2xl transition-shadow hover:shadow-white/20 sm:px-10 sm:py-5 sm:text-xl md:px-12 md:py-6 md:text-2xl"
						>
							Play Together 👫
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => {
								console.log("🌐 Play Online clicked - BEFORE setGamePhase");
								console.log("🔍 Current gamePhase before:", currentGamePhase);
								setGamePhase("multiplayer-setup");
								console.log("✅ setGamePhase called with 'multiplayer-setup'");
								
								// Check if state updated immediately (it might not due to async nature)
								setTimeout(() => {
									console.log("🔍 GamePhase after 100ms:", useGameStore.getState().gamePhase);
								}, 100);
							}}
							className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 font-bold text-lg text-white shadow-2xl transition-shadow hover:shadow-blue/20 sm:px-10 sm:py-5 sm:text-xl md:px-12 md:py-6 md:text-2xl"
						>
							Play Online 🌐
						</motion.button>

						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => setShowTutorial(true)}
							className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white text-xl backdrop-blur-sm transition-all hover:bg-white/30 sm:h-14 sm:w-14 sm:text-2xl"
							aria-label="How to play"
						>
							?
						</motion.button>
					</div>

					<div className="flex justify-center gap-6 pt-6 sm:gap-8 sm:pt-8">
						<motion.div
							whileHover={{ scale: 1.1 }}
							className="text-center text-white"
						>
							<div className="mb-1 text-2xl sm:text-3xl">🎲</div>
							<div className="text-xs sm:text-sm">Roll & Ask</div>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.1 }}
							className="text-center text-white"
						>
							<div className="mb-1 text-2xl sm:text-3xl">💕</div>
							<div className="text-xs sm:text-sm">Earn Sparks</div>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.1 }}
							className="text-center text-white"
						>
							<div className="mb-1 text-2xl sm:text-3xl">🏆</div>
							<div className="text-xs sm:text-sm">Connect & Win</div>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>

			<motion.div
				className="absolute right-0 bottom-4 left-0 px-4 text-center text-white/70 text-xs sm:bottom-6 sm:text-sm md:bottom-8"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 1 }}
			>
				<p>Best experienced together on one device</p>
				<p className="mb-3 sm:mb-4">No sign-up required • Just pure fun</p>

				{/* Buy Me a Coffee Button */}
				{/* <BuyMeCoffee size="medium" /> */}
			</motion.div>
		</div>
	);
}
