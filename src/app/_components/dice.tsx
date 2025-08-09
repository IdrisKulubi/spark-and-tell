"use client";

import { CategoryNames } from "@/types/game";
import type { Category } from "@/types/game";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
// @ts-ignore - package doesn't have types
import DiceRoll from "react-dice-roll";

interface DiceProps {
    onRoll: (category: Category) => void;
    disabled?: boolean;
}

export function Dice({ onRoll, disabled }: DiceProps) {
    const [isRolling, setIsRolling] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [highlightedCategory, setHighlightedCategory] = useState<Category | null>(null);
    const [diceSize, setDiceSize] = useState(120);

    useEffect(() => {
        const updateDiceSize = () => {
            setDiceSize(window.innerWidth < 640 ? 100 : 120);
        };
        updateDiceSize();
        window.addEventListener("resize", updateDiceSize);
        return () => window.removeEventListener("resize", updateDiceSize);
    }, []);

    const handleDiceRoll = (value: number) => {
        const category = value as Category;

        // Highlight the rolled category
        setHighlightedCategory(category);
        setIsRolling(false);

        // Keep legend visible for 2 seconds to show the result
        setTimeout(() => {
            setShowLegend(false);
            setHighlightedCategory(null);
        }, 2000);

        onRoll(category);
    };

    const handleDiceClick = () => {
        if (!disabled) {
            setIsRolling(true);
            setShowLegend(true);
        }
    };

    // Category colors for the legend
    const categoryColors: Record<number, string> = {
        1: "from-blue-400 to-blue-600",
        2: "from-purple-400 to-purple-600",
        3: "from-green-400 to-green-600",
        4: "from-yellow-400 to-yellow-600",
        5: "from-red-400 to-red-600",
        6: "from-indigo-400 to-indigo-600",
    };

    return (
        <div className="flex flex-col items-center space-y-4 sm:space-y-6">
            {/* Category Legend */}
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                    opacity: showLegend ? 1 : 0,
                    height: showLegend ? "auto" : 0,
                }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-2 sm:gap-3 overflow-hidden md:grid-cols-3"
            >
                {Object.entries(CategoryNames).map(([num, name]) => {
                    const categoryNum = Number.parseInt(num);
                    const isHighlighted = highlightedCategory === categoryNum;
                    return (
                        <motion.div
                            key={num}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: showLegend ? 1 : 0.8,
                                opacity: showLegend ? (highlightedCategory && !isHighlighted ? 0.3 : 1) : 0,
                            }}
                            transition={{
                                delay: showLegend ? categoryNum * 0.05 : 0,
                                duration: 0.3,
                            }}
                            className={`rounded-lg bg-gradient-to-r ${
                                categoryColors[categoryNum] ?? "from-gray-400 to-gray-600"
                            } px-2 sm:px-3 py-1.5 sm:py-2 font-semibold text-xs sm:text-sm text-white shadow-lg`}
                        >
                            <span className="mr-2">{num}</span>
                            <span>{name}</span>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Dice */}
            <div
                onClick={handleDiceClick}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        handleDiceClick();
                    }
                }}
                role="button"
                tabIndex={disabled ? -1 : 0}
                className={`relative ${disabled ? "pointer-events-none opacity-50" : ""}`}
            >
                <DiceRoll
                    onRoll={handleDiceRoll}
                    size={diceSize}
                    rollingTime={1500}
                    disabled={disabled}
                    sound="/dice-roll.mp3" // Optional: add a dice roll sound
                    triggers={disabled ? [] : ["click"]}
                />
            </div>

            {/* Instructions */}
            {!isRolling && !disabled && !highlightedCategory && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <p className="font-semibold text-base sm:text-lg text-white">Tap the dice to roll!</p>
                    <p className="mt-1 text-xs sm:text-sm text-white/70">Each number is a different category</p>
                </motion.div>
            )}

            {isRolling && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-semibold text-base sm:text-lg text-white">
                    Rolling for your category...
                </motion.div>
            )}

            {highlightedCategory && !isRolling && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                    <p className="font-bold text-xl sm:text-2xl text-white">You rolled: {CategoryNames[highlightedCategory]}!</p>
                    <p className="mt-1 text-xs sm:text-sm text-white/70">Preparing your question...</p>
                </motion.div>
            )}
        </div>
    );
}
