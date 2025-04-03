import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';

interface LandingScreenProps {
    onNavigate: (screen: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
    const [currentDate, setCurrentDate] = useState("");

    // dynamic date
    useEffect(() => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
        setCurrentDate(formattedDate);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:py-12"
        >
            {/* Date */}
            <p className="mb-2 sm:mb-4">
                {currentDate}
            </p>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-semibold text-[#1B4B43] text-center leading-tight">
                Share your<br />emotions.
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg sm:text-xl max-w-2xl text-center mt-4 sm:mt-6">
                A safe space to express your feelings anonymously. <br /> Let go of the past week, and start fresh.
            </p>

            {/* Buttons Container */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md px-4 mt-6">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={() => onNavigate('dump')}
                    className="border-2 border-[#2a483a] text-[#2a483a] hover:bg-[#ffffff] hover:border-0"

                >
                    Throw a photo
                </Button>
                <Button
                    variant="default"
                    size="lg"
                    onClick={() => onNavigate('collage')}
                    className="bg-[#2A483A] hover:bg-[#B2B2A8] text-white py-3 text-lg w-full sm:w-auto"
                >
                    Weekly collage
                </Button>
            </div>
        </motion.div>
    );
};

export default LandingScreen;
