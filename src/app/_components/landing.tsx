"use client";

import { useGameStore } from "@/store/gameStore";
import { motion } from "framer-motion";
import { useState } from "react";
import { TutorialModal } from "./tutorial-modal";
import { BuyMeCoffee } from "./buy-me-coffee";

export function Landing() {
	const setGamePhase = useGameStore((state) => state.setGamePhase);
	const [showTutorial, setShowTutorial] = useState(false);

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
				className="text-center"
			>
				<motion.h1
					className="mb-4 font-bold text-6xl text-white md:text-8xl"
					initial={{ scale: 0.5 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					Spark & Tell
				</motion.h1>
				<motion.p
					className="mb-12 text-white/90 text-xl md:text-2xl"
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
					<div className="flex items-center justify-center gap-3">
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={() => setGamePhase("setup")}
							className="rounded-full bg-white px-12 py-6 font-bold text-2xl text-purple-600 shadow-2xl transition-shadow hover:shadow-white/20"
						>
							Start New Game ✨
						</motion.button>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							onClick={() => setShowTutorial(true)}
							className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-2xl text-white backdrop-blur-sm transition-all hover:bg-white/30"
							aria-label="How to play"
						>
							?
						</motion.button>
					</div>

					<div className="flex justify-center gap-8 pt-8">
						<motion.div
							whileHover={{ scale: 1.1 }}
							className="text-center text-white"
						>
							<div className="text-3xl">🎲</div>
							<div className="text-sm">Roll & Ask</div>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.1 }}
							className="text-center text-white"
						>
							<div className="text-3xl">💕</div>
							<div className="text-sm">Earn Sparks</div>
						</motion.div>
						<motion.div
							whileHover={{ scale: 1.1 }}
							className="text-center text-white"
						>
							<div className="text-3xl">🏆</div>
							<div className="text-sm">Connect & Win</div>
						</motion.div>
					</div>
				</motion.div>
			</motion.div>

			<motion.div
				className="absolute bottom-8 text-center text-sm text-white/70"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5, delay: 1 }}
			>
				<p>Best experienced together on one device</p>
				<p className="mb-4">No sign-up required • Just pure fun</p>
				
				{/* Buy Me a Coffee Button */}
				<BuyMeCoffee size="medium" />
			</motion.div>
		</div>
	);
}
