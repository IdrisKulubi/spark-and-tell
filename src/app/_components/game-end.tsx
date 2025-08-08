"use client";

import { useGameStore } from "@/store/gameStore";

export function GameEnd() {
	const resetGame = useGameStore((state) => state.resetGame);

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-4">
			<div className="text-center text-white">
				<h1 className="mb-4 text-4xl">Game Over!</h1>
				<p className="mb-8 text-xl">Thanks for playing!</p>
				<button
					type="button"
					onClick={resetGame}
					className="rounded-full bg-white px-8 py-3 font-bold text-purple-600"
				>
					Play Again
				</button>
			</div>
		</div>
	);
}
