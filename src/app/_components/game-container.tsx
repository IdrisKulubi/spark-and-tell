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
import { MultiplayerManager } from "./multiplayer-manager";

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
		
		console.log("🔍 Checking for saved session:", {
			savedPlayerId: savedPlayerId ? "EXISTS" : "NONE",
			savedRoomId: savedRoomId ? "EXISTS" : "NONE",
			connectionStatus,
			multiplayerPhase
		});
		
		if (savedPlayerId && savedRoomId && connectionStatus === "disconnected") {
			console.log("🔄 Auto-reconnecting to saved session:", {
				playerId: savedPlayerId,
				roomId: savedRoomId
			});
			
			setConnectionStatus("connecting");
			setMultiplayerPhase("setup");
		}
	}, [connectionStatus, setConnectionStatus, setMultiplayerPhase, multiplayerPhase]);

	// Check if we're in multiplayer mode
	const isMultiplayer =
		connectionStatus === "connected" || connectionStatus === "connecting";

	// Debug logging
	console.log("🎮 GameContainer state:", {
		gamePhase,
		multiplayerPhase,
		connectionStatus,
		isMultiplayer
	});

	// Debug which component will be rendered
	if (isMultiplayer && connectionStatus === "connected") {
		console.log("🎯 Rendering multiplayer component for phase:", multiplayerPhase);
	} else {
		console.log("🎯 Rendering single-player component for phase:", gamePhase);
		if (gamePhase === "multiplayer-setup") {
			console.log("✅ Should render MultiplayerSetup component");
		} else if (gamePhase === "landing") {
			console.log("✅ Should render Landing component");
		}
	}

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
			return <MultiplayerManager onBack={() => setGamePhase("landing")} />;
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
