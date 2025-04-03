import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DumpScreen from './components/Dump';
import LandingScreen from './components/Landing';
import MakeCollageScreen from './components/Collage';

const App = () => {
    const [currentScreen, setCurrentScreen] = useState<'landing' | 'dump' | 'collage'>('landing');
    const [posts, setPosts] = useState<{ image: string; story: string }[]>([]);

    const handleNavigate = useCallback((screen: string) => {
        setCurrentScreen(screen as 'landing' | 'dump' | 'collage');
    }, []);

    const handlePost = useCallback((post: { image: string; story: string }) => {
        setPosts((prevPosts) => [...prevPosts, post]);
        console.log('New Post:', post);
    }, []);

    return (
        <div>
            {/* Sticky Header */}
            <div className="sticky top-10 z-10 p-4 flex justify-center items-center bg-[#E5DDD740] backdrop-blur-md">
                <h3>Unspoken</h3>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full px-4 sm:px-8">
                <AnimatePresence mode='wait'>
                    {currentScreen === 'landing' && (
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <LandingScreen onNavigate={handleNavigate} />
                        </motion.div>
                    )}
                    {currentScreen === 'dump' && (
                        <motion.div
                            key="dump"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DumpScreen onNavigate={handleNavigate} />
                        </motion.div>
                    )}
                    {currentScreen === 'collage' && (
                        <motion.div
                            key="collage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MakeCollageScreen onNavigate={handleNavigate} onPost={handlePost} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default App;

