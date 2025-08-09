"use client";

import { useGameStore } from "@/store/gameStore";
import type { Category, SparkType } from "@/types/game";
import { motion } from "framer-motion";
import { Dice } from "./dice";
import { PowerUps } from "./power-ups";
import { QuestionCard } from "./question-card";
import { SparkAwarder } from "./spark-awarder";
import { SparkDisplay } from "./spark-display";
import { BuyMeCoffee } from "./buy-me-coffee";

export function GamePlay() {
    const {
        settings,
        currentTurn,
        currentQuestion,
        player1Sparks,
        player2Sparks,
        questionCount,
        totalQuestions,
        gamePhase,
        selectQuestion,
        awardBasePoints,
        awardSparks,
        nextTurn,
        setGamePhase,
    } = useGameStore();

    const handleDiceRoll = (category: Category) => {
        setTimeout(() => {
            selectQuestion(category);
        }, 2000);
    };

    const handleAwardSparks = (sparkTypes: SparkType[]) => {
        awardSparks(sparkTypes);
        setTimeout(() => {
            nextTurn();
        }, 1500);
    };

    const handleAnswerComplete = () => {
        // Award base points for answering the question
        awardBasePoints();
        setGamePhase("awarding-sparks");
    };

    const currentPlayerName = currentTurn === 1 ? settings.player1Name : settings.player2Name;
    const otherPlayerName = currentTurn === 1 ? settings.player2Name : settings.player1Name;

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

                <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col items-center space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Game Phase: Rolling Dice */}
                    {gamePhase === "playing" && !currentQuestion && (
                        <>
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center text-white">
                                <h2 className="mb-2 font-bold text-2xl sm:text-3xl">{currentPlayerName}'s Turn</h2>
                                <p className="text-white/80 text-sm sm:text-base">Roll the dice to get your question!</p>
                            </motion.div>
                            <Dice onRoll={handleDiceRoll} disabled={false} />
                        </>
                    )}

                    {/* Game Phase: Showing Question */}
                    {gamePhase === "playing" && currentQuestion && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 sm:mb-8 md:mb-10 text-center text-white"
                            >
                                <h2 className="font-bold text-xl sm:text-2xl">{currentPlayerName}, answer this:</h2>
                            </motion.div>
                            <QuestionCard question={currentQuestion} isVisible={true} />
                            <PowerUps />
                            <motion.button
                                type="button"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAnswerComplete}
                                className="rounded-full bg-white px-6 sm:px-8 py-2.5 sm:py-3 font-bold text-base sm:text-lg text-purple-600 shadow-xl hover:shadow-white/30"
                            >
                                I've Answered! ✅
                            </motion.button>
                        </>
                    )}

                    {/* Game Phase: Awarding Sparks */}
                    {gamePhase === "awarding-sparks" && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-3 sm:mb-4 text-center text-white"
                            >
                                <h2 className="font-bold text-xl sm:text-2xl">{otherPlayerName}'s Turn to Award</h2>
                            </motion.div>
                            <SparkAwarder onAward={handleAwardSparks} recipientName={currentPlayerName} />
                        </>
                    )}

                    {/* Power-ups for before rolling dice */}
                    {gamePhase === "playing" && !currentQuestion && <PowerUps />}
                </div>
            </div>

            {/* Floating Buy Me a Coffee Button */}
            <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50">
                <BuyMeCoffee size="small" />
            </div>
        </div>
    );
}
