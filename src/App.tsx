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
        <div className="min-h-screen bg-lavender-500 text-gray-800">
            {/* App Header */}
            <div className="sticky top-0 z-10 bg-white/5 backdrop-blur-md border-b border-white/10 p-4 flex justify-center items-center">
                <h1 className="text-xl font-bold text-gray-200">Reflect & Release</h1>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
                <AnimatePresence mode='wait'>
                    {currentScreen === 'landing' && (
                        <LandingScreen
                            key="landing"
                            onNavigate={handleNavigate}
                        />
                    )}
                    {currentScreen === 'dump' && (
                        <DumpScreen
                            key="dump"
                            onNavigate={handleNavigate}
                        />
                    )}
                    {currentScreen === 'collage' && (
                        <MakeCollageScreen
                            key="collage"
                            onNavigate={handleNavigate}
                            onPost={handlePost}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default App;

