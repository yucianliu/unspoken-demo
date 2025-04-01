import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Palette } from 'lucide-react';
import { Button } from './ui/button'; // Import Button

interface LandingScreenProps {
    key?: string;  // Add key to props
    onNavigate: (screen: string) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef<number>();
    const [dimensions, setDimensions] = useState<{ width: number; height: number }[]>([]);

      useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            try {
                // Simulate fetching images from Unsplash (replace with actual API call if needed)
                const dummyImages = await new Promise<string[]>((resolve) => {
                    setTimeout(() => {
                        const urls = Array.from({ length: 8 }, (_, i) =>
                            `https://source.unsplash.com/random/400x${300 + i * 50}?sig=${i}` // Varying heights
                        );
                        resolve(urls);
                    }, 1500); // Simulate network delay
                });

                setImages(dummyImages);
            } catch (error) {
                console.error('Failed to fetch images:', error);
                // Handle error (e.g., show a message to the user)
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const newDimensions = images.map((image) => {
                const url = new URL(image);
                const width = parseInt(url.searchParams.get('w') || '400', 10);
                const height = parseInt(url.searchParams.get('h') || '300', 10);
                return { width, height };
            });
            setDimensions(newDimensions);

            intervalRef.current = window.setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLoading, images.length, images]);

    const getGridStyle = (index: number) => {
        const numImages = images.length;
        const cols = 2; // Number of columns
        const gap = 15; // Increased gap for less overlap

        let row = Math.floor(index / cols);
        let col = index % cols;
        let width = '100%';
        let height = 200;

        if (dimensions[index]) {
            width = `${(dimensions[index].width / 400) * 100}%`;
            height = (dimensions[index].height / dimensions[index].width) * 400; // Adjusted height calculation
        }

        const x = `calc(${(100 / cols) * col}% + ${col * gap}px)`;
        const y = `${row * (height + gap)}px`; // Use height here

        const style = {
            position: 'absolute',
            left: x,
            top: y,
            width: `calc(${width} - ${2 * gap}px)`,
            height: `calc(${height}px - ${2 * gap}px)`, // Use height here
            zIndex: numImages - Math.abs(index - Math.floor(numImages / 2)),
            opacity: index === currentImageIndex ? 1 : 0.6,
            transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
            borderRadius: '10px',
        };
        return style;
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4 sm:p-6 space-y-6 sm:space-y-8 text-center"
        >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-200">
                Unspoken
            </h1>
            <div
                className="relative w-full h-[1200px]" //  increased height
            >
                {isLoading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute bg-gray-700 animate-pulse"
                            style={getGridStyle(i)}
                        >
                            {/* Placeholder while loading */}
                        </motion.div>
                    ))
                ) : (
                    images.map((image, i) => (
                        <motion.div
                            key={i}
                            className="absolute overflow-hidden"
                            style={getGridStyle(i)}
                        >
                            <img
                                src={image}
                                alt={`Carousel ${i + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </motion.div>
                    ))
                )}
            </div>
            <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
                A safe space to express your feelings anonymously.  Share your
                images and collages, let go of the past week, and start fresh.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                    onClick={() => onNavigate('dump')}
                    className="bg-red-500/90 hover:bg-red-600 text-white py-3 text-lg w-full sm:w-auto"
                >
                    <Upload className="w-6 h-6 mr-2" />
                    Dump Photo
                </Button>
                <Button
                    onClick={() => onNavigate('collage')}
                    className="bg-blue-500/90 hover:bg-blue-600 text-white py-3 text-lg w-full sm:w-auto"
                >
                    <Palette className="w-6 h-6 mr-2" />
                    Make Collage
                </Button>
            </div>
            <p className="text-gray-500 text-sm">
                Your posts are anonymous and will be periodically cleared.
            </p>
        </motion.div>
    );
};

export default LandingScreen;