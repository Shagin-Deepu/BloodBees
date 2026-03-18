import React from 'react';
import { Heart } from 'lucide-react';

const BreathingHeart = () => {
    return (
        <div className="relative flex items-center justify-center w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] mx-auto">
            {/* Outer Ripple 1 */}
            <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] bg-red-500/20 rounded-full animate-ping [animation-duration:3s]"></div>

            {/* Outer Ripple 2 (Delayed) */}
            <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] bg-red-500/10 rounded-full animate-ping [animation-duration:3s] [animation-delay:1.5s]"></div>

            {/* Glowing Background */}
            <div className="absolute w-40 h-40 sm:w-48 sm:h-48 bg-red-500/30 rounded-full blur-xl animate-pulse"></div>

            {/* Breathing Heart */}
            <Heart
                className="w-40 h-40 sm:w-48 sm:h-48 text-red-600 dark:text-red-500 fill-current drop-shadow-2xl animate-[heartbeat_1.5s_ease-in-out_infinite] relative z-10"
                strokeWidth={1.5}
            />

            <style>{`
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    14% { transform: scale(1.1); }
                    28% { transform: scale(1); }
                    42% { transform: scale(1.1); }
                    70% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
};

export default BreathingHeart;
