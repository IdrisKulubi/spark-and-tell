"use client";

import React from "react";
import { useGameStore } from "@/store/gameStore";
import { useMultiplayerStore } from "@/store/multiplayerStore";
import { GameEnd } from "./game-end";
import { GamePlay } from "./game-play";
import { GameSetup } from "./game-setup";
import { Landing } from "./landing";
import { MultiplayerGamePlay } from "./multiplayer-game-play";
import { MultiplayerLobby } from "./multiplayer-lobby";
import { MultiplayerSetup } from "./multiplayer-setup";

export function GameContainer() {
	const gamePhase = useGameStore((state) => state.gamePhase);
	const multiplayerPhase = useMultiplayerStore((state) => state.gamePhase);
	const connectionStatus = useMultiplayerStore(
		(state) => state.connectionStatus,
	);
	const setGamePhase = useGameStore((state) => state.setGamePhase);
	const { setConnectionStatus, setGamePhase: setMultiplayerPhase } = useMultiplayerStore();

	// Auto-reconnection logic
	React.useEffect(() => {
		const savedPlayerId = localStorage.getItem("spark-tell-player-id");
		const savedRoomId = localStorage.getItem("spark-tell-room-id");
		
		if (savedPlayerId && savedRoomId && connectionStatus === "disconnected") {
			console.log("🔄 Auto-reconnecting to saved session:", {
				playerId: savedPlayerId,
				roomId: savedRoomId
			});
			
			setConnectionStatus("connecting");
			setMultiplayerPhase("setup");
		}
	}, [connectionStatus, setConnectionStatus, setMultiplayerPhase]);

	// Debug logging
	console.log("🎮 GameContainer state:", {
		gamePhase,
		multiplayerPhase,
		connectionStatus,
		isMultiplayer: connectionStatus === "connected" || connectionStatus === "connecting"
	});

	// Check if we're in multiplayer mode
	const isMultiplayer =
		connectionStatus === "connected" || connectionStatus === "connecting";

	// Handle multiplayer phases - only if we have valid connection
	if (isMultiplayer && connectionStatus === "connected") {
		switch (multiplayerPhase) {
			case "setup":
				return <MultiplayerLobby />;
			case "playing":
			case "awarding-sparks":
			case "mini-game":
				return <MultiplayerGamePlay />;
			case "ended":
				return <GameEnd />;
			default:
				return <MultiplayerLobby />;
		}
	}

	// Handle single-player phases
	switch (gamePhase) {
		case "landing":
			return <Landing />;
		case "multiplayer-setup":
			return <MultiplayerSetup onBack={() => setGamePhase("landing")} />;
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
