"use client";

import { motion } from "framer-motion";

interface BuyMeCoffeeProps {
    size?: "small" | "medium" | "large";
    className?: string;
}

export function BuyMeCoffee({ size = "medium", className = "" }: BuyMeCoffeeProps) {
    const sizeClasses = {
        small: "px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm",
        medium: "px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base",
        large: "px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg",
    };

    const emojiSizes = {
        small: "text-base sm:text-lg",
        medium: "text-xl sm:text-2xl",
        large: "text-2xl sm:text-3xl",
    };

    return (
        <motion.a
            href="https://buymeacoffee.com/elliottchong"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`inline-flex items-center gap-2 rounded-full bg-yellow-400 font-semibold text-gray-900 shadow-lg transition-all hover:bg-yellow-300 hover:shadow-xl ${sizeClasses[size]} ${className}`}
        >
            Buy me a coffee <span className={emojiSizes[size]}>☕</span>
        </motion.a>
    );
}
