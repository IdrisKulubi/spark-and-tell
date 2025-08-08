"use client";

import { useGameStore } from "@/store/gameStore";
import { GameEnd } from "./game-end";
import { GamePlay } from "./game-play";
import { GameSetup } from "./game-setup";
import { Landing } from "./landing";

export function GameContainer() {
	const gamePhase = useGameStore((state) => state.gamePhase);

	switch (gamePhase) {
		case "landing":
			return <Landing />;
		case "setup":
			return <GameSetup />;
		case "playing":
		case "awarding-sparks":
		case "mini-game":
			return <GamePlay />;
		case "ended":
			return <GameEnd />;
		default:
			return <Landing />;
	}
}
