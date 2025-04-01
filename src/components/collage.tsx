import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import { cn } from '../utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/Dialog";

// Dummy image data for collage creation
const collageImages = [
    'https://placehold.co/200x200/F44336/FFFFFF?text=Sad',
    'https://placehold.co/200x200/4CAF50/FFFFFF?text=Happy',
    'https://placehold.co/200x200/2196F3/FFFFFF?text=Calm',
    'https://placehold.co/200x200/FFC107/000000?text=Anxious',
    'https://placehold.co/200x200/9C27B0/FFFFFF?text=Reflective',
    'https://placehold.co/200x200/00BCD4/000000?text=Energetic',
    'https://placehold.co/200x200/607D8B/FFFFFF?text=Neutral',
    'https://placehold.co/200x200/8BC34A/FFFFFF?text=Hopeful',
    'https://placehold.co/200x200/FF5722/FFFFFF?text=Frustrated',
    'https://placehold.co/200x200/3F51B5/FFFFFF?text=Content',
];

interface MakeCollageScreenProps {
    onNavigate: (screen: string) => void;
    onPost: (post: { image: string; story: string }) => void;
}

// Helper component for the dialog inside the map to manage its own state
const ImagePickerDialog = ({
    trigger,
    index,
    onImageSelect,
}: {
    trigger: React.ReactNode;
    index: number;
    onImageSelect: (image: string) => void;
}) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    return (
        <Dialog open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <DialogTrigger>
                <div onClick={() => setIsPickerOpen(true)}>{trigger}</div>
            </DialogTrigger>
            {isPickerOpen && (
                <DialogContent
                    className="bg-gray-900 border-gray-700 text-white max-w-[95vw] sm:max-w-[80vw] md:max-w-[60vw]"
                >
                    <DialogHeader>
                        <DialogTitle>Choose Image for Slot {index + 1}</DialogTitle>
                        <DialogDescription>
                            Select an image from the list below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
                        {collageImages.map((img, i) => (
                            <div
                                key={i}
                                className="w-full h-24 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => {
                                    onImageSelect(img);
                                    setIsPickerOpen(false);
                                }}
                            >
                                <img
                                    src={img}
                                    alt={`Selectable ${i + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setIsPickerOpen(false)}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
};

const MakeCollageScreen = ({ onNavigate, onPost }: MakeCollageScreenProps) => {
    const [selectedImages, setSelectedImages] = useState<string[]>(Array(4).fill(''));
    const [story, setStory] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [postSuccess, setPostSuccess] = useState<boolean | null>(null);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);

    const handleImageSelect = (index: number, image: string) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages[index] = image;
        setSelectedImages(newSelectedImages);
    };

    const handlePost = () => {
        const hasImages = selectedImages.some(img => img !== '');

        if (hasImages) {
            setIsPosting(true);
            setTimeout(() => {
                const collageImageUrl = 'https://placehold.co/600x400/808080/FFFFFF?text=Collage';
                onPost({ image: collageImageUrl, story });
                setIsPosting(false);
                setPostSuccess(true);
                setOpenStatusDialog(true);
                setSelectedImages(Array(4).fill(''));
                setStory('');
            }, 2000);
        } else {
            setPostSuccess(false);
            setOpenStatusDialog(true);
        }
    };

    const resetPostStatus = () => {
        setPostSuccess(null);
        setOpenStatusDialog(false);
        if (postSuccess === true) {
            onNavigate('landing');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 space-y-6"
        >
            <Button
                variant="ghost"
                onClick={() => onNavigate('landing')}
                className="text-gray-400 hover:text-gray-300"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Landing
            </Button>
            <div className="grid grid-cols-2 gap-4">
                {selectedImages.map((selectedImage, index) => {
                    const imageSrc = selectedImage || `https://placehold.co/200x200/E0E0E0/36454F?text=${index + 1}`;
                    const triggerElement = (
                        <div
                            className={cn(
                                'w-full h-32 rounded-lg cursor-pointer',
                                'border-2 border-dashed border-gray-400',
                                'bg-white/5 backdrop-blur-md',
                                'relative overflow-hidden',
                                'hover:bg-gray-800/50',
                            )}
                        >
                            <img
                                src={imageSrc}
                                alt={`Slot ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    );
                    return (
                        <ImagePickerDialog
                            key={index}
                            trigger={triggerElement}
                            index={index}
                            onImageSelect={(img) => handleImageSelect(index, img)}
                        />
                    );
                })}
            </div>

            <Textarea
                placeholder="Write a short description about your collage..."
                value={story}
                onChange={(e) => setStory(e.target.value)}
                className="bg-white/5 backdrop-blur-md text-gray-300 border-gray-700 placeholder:text-gray-400 w-full"
                rows={4}
            />

            <Button
                onClick={handlePost}
                className="w-full bg-blue-500/90 hover:bg-blue-600 text-white py-3 text-lg"
                disabled={isPosting}
            >
                {isPosting ? 'Posting...' : 'Save Collage'}
            </Button>

            <Dialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
                <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
                    <DialogHeader>
                        {postSuccess === true && (
                            <>
                                <DialogTitle className="text-green-400 flex items-center">
                                    <CheckCircle className="w-6 h-6 mr-2" />
                                    Collage Saved!
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Your collage has been anonymously saved.
                                </DialogDescription>
                            </>
                        )}
                        {postSuccess === false && (
                            <>
                                <DialogTitle className="text-red-400 flex items-center">
                                    <AlertTriangle className="w-6 h-6 mr-2" />
                                    Error
                                </DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Please select at least one image for your collage.
                                </DialogDescription>
                            </>
                        )}
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={resetPostStatus}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-full sm:w-auto"
                        >
                            {postSuccess === true ? 'OK' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </motion.div>
    );
};

export default MakeCollageScreen; 