"use client";

import questionsData from "@/data/questions.json";
import { useMultiplayerStore } from "@/store/multiplayerStore";
import { api } from "@/trpc/react";
import type { Category, SparkType } from "@/types/game";
import type { Question } from "@/types/game";
import { motion } from "framer-motion";
import { BuyMeCoffee } from "./buy-me-coffee";
import { Dice } from "./dice";
import { PowerUps } from "./power-ups";
import { QuestionCard } from "./question-card";
import { SparkAwarder } from "./spark-awarder";
import { SparkDisplay } from "./spark-display";

const questions = questionsData as Question[];

export function MultiplayerGamePlay() {
	const {
		settings,
		currentTurn,
		currentQuestion,
		currentCategory,
		player1Sparks,
		player2Sparks,
		questionCount,
		totalQuestions,
		gamePhase,
		players,
		questionsAnswered,
		handleGameEvent,
	} = useMultiplayerStore();

	const roomId = localStorage.getItem("spark-tell-room-id") || "";
	const playerId = localStorage.getItem("spark-tell-player-id") || "";
	const isMyTurn =
		(currentTurn === 1 && players.host.id === playerId) ||
		(currentTurn === 2 && players.guest?.id === playerId);
	const isHost = players.host.id === playerId;

	const rollDiceMutation = api.game.rollDice.useMutation();
	const awardSparksMutation = api.game.awardSparks.useMutation();
	const nextTurnMutation = api.game.nextTurn.useMutation();

	const handleDiceRoll = (category: Category) => {
		if (!isMyTurn) return;

		rollDiceMutation.mutate({
			roomId,
			playerId,
			category,
		});

		// Select question locally and sync via events
		setTimeout(() => {
			selectQuestionLocally(category);
		}, 2000);
	};

	const selectQuestionLocally = (category: Category) => {
		const availableQuestions = questions.filter((q) => {
			if (q.category !== category) return false;
			if (questionsAnswered.includes(q.id)) return false;
			if (!settings.selectedCategories.includes(q.category)) return false;
			return true;
		});

		if (availableQuestions.length > 0) {
			const randomIndex = Math.floor(Math.random() * availableQuestions.length);
			const question = availableQuestions[randomIndex];

			if (question) {
				// Update local state via event
				handleGameEvent({
					type: "QUESTION_SELECTED",
					payload: { question },
				});
			}
		}
	};

	const handleAwardSparks = (sparkTypes: SparkType[]) => {
		const recipientId = currentTurn === 1 ? players.host.id : players.guest?.id;
		if (!recipientId) return;

		awardSparksMutation.mutate({
			roomId,
			playerId,
			sparkTypes,
			awardedTo: recipientId,
		});

		setTimeout(() => {
			nextTurnMutation.mutate({
				roomId,
				playerId,
			});
		}, 1500);
	};

	const handleAnswerComplete = () => {
		// Just move to awarding phase locally
		handleGameEvent({
			type: "ANSWER_COMPLETED",
			payload: { playerId },
		});
	};

	const currentPlayerName =
		currentTurn === 1 ? settings.player1Name : settings.player2Name;
	const otherPlayerName =
		currentTurn === 1 ? settings.player2Name : settings.player1Name;
	const isAwarding = !isMyTurn && gamePhase === "awarding-sparks";

	return (
		<div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 p-3 sm:p-4">
			<div className="mx-auto max-w-4xl py-4 sm:py-6 md:py-8">
				{/* Score Display */}
				<SparkDisplay
					player1Name={settings.player1Name}
					player2Name={settings.player2Name}
					player1Sparks={player1Sparks}
					player2Sparks={player2Sparks}
					currentTurn={currentTurn}
					questionCount={questionCount}
					totalQuestions={totalQuestions}
				/>

				{/* Connection Status */}
				<div className="mb-4 text-center">
					<div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur-sm">
						<div className="h-2 w-2 rounded-full bg-green-400"></div>
						Playing Online • Room: {useMultiplayerStore.getState().roomCode}
					</div>
				</div>

				<div className="mt-4 flex flex-col items-center space-y-4 sm:mt-6 sm:space-y-6 md:mt-8 md:space-y-8">
					{/* Game Phase: Rolling Dice */}
					{gamePhase === "playing" && !currentQuestion && (
						<>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-center text-white"
							>
								<h2 className="mb-2 font-bold text-2xl sm:text-3xl">
									{isMyTurn ? "Your Turn!" : `${currentPlayerName}'s Turn`}
								</h2>
								<p className="text-sm text-white/80 sm:text-base">
									{isMyTurn
										? "Roll the dice to get your question!"
										: "Waiting for them to roll..."}
								</p>
							</motion.div>
							<Dice onRoll={handleDiceRoll} disabled={!isMyTurn} />
						</>
					)}

					{/* Game Phase: Showing Question */}
					{gamePhase === "playing" && currentQuestion && (
						<>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="mb-6 text-center text-white sm:mb-8 md:mb-10"
							>
								<h2 className="font-bold text-xl sm:text-2xl">
									{isMyTurn
										? "Your question:"
										: `${currentPlayerName}, answer this:`}
								</h2>
							</motion.div>
							<QuestionCard question={currentQuestion} isVisible={true} />
							{isMyTurn && <PowerUps />}
							{isMyTurn && (
								<motion.button
									type="button"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.8 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={handleAnswerComplete}
									className="rounded-full bg-white px-6 py-2.5 font-bold text-base text-purple-600 shadow-xl hover:shadow-white/30 sm:px-8 sm:py-3 sm:text-lg"
								>
									I've Answered! ✅
								</motion.button>
							)}
							{!isMyTurn && (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-center text-white/80"
								>
									Waiting for {currentPlayerName} to answer...
								</motion.div>
							)}
						</>
					)}

					{/* Game Phase: Awarding Sparks */}
					{gamePhase === "awarding-sparks" && (
						<>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="mb-3 text-center text-white sm:mb-4"
							>
								<h2 className="font-bold text-xl sm:text-2xl">
									{isAwarding
										? "Your Turn to Award"
										: `${otherPlayerName}'s Turn to Award`}
								</h2>
							</motion.div>
							{isAwarding ? (
								<SparkAwarder
									onAward={handleAwardSparks}
									recipientName={currentPlayerName}
								/>
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-center text-white/80"
								>
									Waiting for {otherPlayerName} to award sparks...
								</motion.div>
							)}
						</>
					)}

					{/* Power-ups for before rolling dice */}
					{gamePhase === "playing" && !currentQuestion && isMyTurn && (
						<PowerUps />
					)}
				</div>
			</div>

			{/* Floating Buy Me a Coffee Button */}
			<div className="fixed right-3 bottom-3 z-50 sm:right-4 sm:bottom-4">
				<BuyMeCoffee size="small" />
			</div>
		</div>
	);
}
