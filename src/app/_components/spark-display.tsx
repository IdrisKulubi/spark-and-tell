"use client";

import { motion } from "framer-motion";

interface SparkDisplayProps {
    player1Name: string;
    player2Name: string;
    player1Sparks: number;
    player2Sparks: number;
    currentTurn: 1 | 2;
    questionCount: number;
    totalQuestions: number;
}

export function SparkDisplay({
    player1Name,
    player2Name,
    player1Sparks,
    player2Sparks,
    currentTurn,
    questionCount,
    totalQuestions,
}: SparkDisplayProps) {
    return (
        <div className="mx-auto w-full max-w-4xl">
            {/* Progress Bar */}
            <div className="mb-4 sm:mb-6">
                <div className="mb-2 flex justify-between text-xs sm:text-sm text-white/80">
                    <span>
                        Question {questionCount} of {totalQuestions}
                    </span>
                    <span>{Math.round((questionCount / totalQuestions) * 100)}% Complete</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/20">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(questionCount / totalQuestions) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Players Score Display */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Player 1 */}
                <motion.div
                    className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all ${
                        currentTurn === 1 ? "scale-105 bg-white/30 shadow-xl" : "bg-white/10"
                    }`}
                    animate={currentTurn === 1 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {currentTurn === 1 && (
                        <motion.div
                            className="-top-3 -translate-x-1/2 absolute left-1/2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="rounded-full bg-white px-2 sm:px-3 py-0.5 sm:py-1 font-bold text-purple-600 text-[10px] sm:text-xs whitespace-nowrap">
                                YOUR TURN
                            </span>
                        </motion.div>
                    )}
                    <div className="text-center">
                        <div className="mb-1 font-semibold text-base sm:text-lg text-white">{player1Name}</div>
                        <motion.div
                            className="font-bold text-3xl sm:text-4xl text-white"
                            key={player1Sparks}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {player1Sparks}
                        </motion.div>
                        <div className="text-xs sm:text-sm text-white/70">sparks</div>
                    </div>
                </motion.div>

                {/* Player 2 */}
                <motion.div
                    className={`relative rounded-xl sm:rounded-2xl p-3 sm:p-4 transition-all ${
                        currentTurn === 2 ? "scale-105 bg-white/30 shadow-xl" : "bg-white/10"
                    }`}
                    animate={currentTurn === 2 ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 0.3 }}
                >
                    {currentTurn === 2 && (
                        <motion.div
                            className="-top-3 -translate-x-1/2 absolute left-1/2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <span className="rounded-full bg-white px-2 sm:px-3 py-0.5 sm:py-1 font-bold text-purple-600 text-[10px] sm:text-xs whitespace-nowrap">
                                YOUR TURN
                            </span>
                        </motion.div>
                    )}
                    <div className="text-center">
                        <div className="mb-1 font-semibold text-base sm:text-lg text-white">{player2Name}</div>
                        <motion.div
                            className="font-bold text-3xl sm:text-4xl text-white"
                            key={player2Sparks}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {player2Sparks}
                        </motion.div>
                        <div className="text-xs sm:text-sm text-white/70">sparks</div>
                    </div>
                </motion.div>
            </div>

            {/* Total Sparks */}
            <motion.div className="mt-4 text-center text-white/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <span className="text-xs sm:text-sm">Total Connection Score: </span>
                <span className="font-bold text-base sm:text-lg">{player1Sparks + player2Sparks} ✨</span>
            </motion.div>
        </div>
    );
}
