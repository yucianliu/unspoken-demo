import React, { useState, useCallback, useEffect, useRef } from 'react';
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
            {/* --- CHANGE START --- */}
            {/*
              Use `asChild` to pass the trigger props directly to the custom `trigger` element,
              instead of wrapping it in another clickable div. This lets the DialogTrigger
              component correctly handle opening the dialog when the `trigger` element is clicked.
            */}
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            {/* --- CHANGE END --- */}

            {/* Removed redundant isPickerOpen check, Dialog handles content visibility */}
            <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-[95vw] sm:max-w-[80vw] md:max-w-[60vw]">
                <DialogHeader>
                    <DialogTitle>Choose a photo that relates to your feelings</DialogTitle>
                    <DialogDescription>
                        Pick up to 4
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
        </Dialog>
    );
};


const MakeCollageScreen = ({ onNavigate, onPost }: MakeCollageScreenProps) => {
    const [selectedImages, setSelectedImages] = useState<string[]>(Array(4).fill(''));
    const [story, setStory] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [postSuccess, setPostSuccess] = useState<boolean | null>(null);
    const [openStatusDialog, setOpenStatusDialog] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleImageSelect = useCallback((index: number, image: string) => {
        setSelectedImages(prev => {
            const newImages = [...prev];
            newImages[index] = image;
            return newImages;
        });
    }, []);

    const handlePost = useCallback(() => {
        const hasImages = selectedImages.some(img => img !== '');

        if (hasImages) {
            setIsPosting(true);
            // Simulate API call
            setTimeout(() => {
                const collageImageUrl = 'https://placehold.co/600x400/808080/FFFFFF?text=Collage';
                onPost({ image: collageImageUrl, story });
                setIsPosting(false);
                setPostSuccess(true);
                setOpenStatusDialog(true);
                // Reset form after successful post showing status
                // setSelectedImages(Array(4).fill('')); // Moved reset to after dialog close
                // setStory('');
            }, 1500); // Reduced timeout for faster feedback
        } else {
            setPostSuccess(false);
            setOpenStatusDialog(true);
        }
    }, [onPost, selectedImages, story]);

    // Modified reset function to clear form only on success AND dialog close
    const resetPostStatusAndForm = useCallback(() => {
         const wasSuccess = postSuccess === true;
         setPostSuccess(null);
         setOpenStatusDialog(false);
         if (wasSuccess) {
             setSelectedImages(Array(4).fill(''));
             setStory('');
             onNavigate('landing'); // Navigate only after successful post is acknowledged
         }
     }, [onNavigate, postSuccess]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
        }
    }, [story]);

    // Auto-focus the textarea and scroll into view when component mounts, if needed
    // Can be useful on mobile if keyboard might obscure input initially
    useEffect(() => {
        textareaRef.current?.focus();
        textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);


    return (
        <motion.div
            ref={containerRef}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 space-y-6 min-h-screen flex flex-col" // Use flex-col for layout
        >
            {/* Header */}
            <div className="flex items-center justify-between w-full mb-4 flex-shrink-0">
                <Button
                    variant="ghost"
                    onClick={() => onNavigate('landing')}
                    className="text-gray-500 hover:text-gray-700 flex items-center p-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-5 h-5 mr-1 sm:mr-2" />
                    Back
                </Button>
                <h2>
                    Create Collage
                </h2>
            </div>

            <div className="container w-3/4 mx-auto px-4 max-h-screen overflow-auto">
                {/* Image Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {selectedImages.map((selectedImage, index) => {
                        const imageSrc = selectedImage || `https://placehold.co/200x200/E0E0E0/36454F?text=${index + 1}&font=sans-serif`;

                        const triggerElement = (
                            <div
                                className={cn(
                                    'w-full aspect-square rounded-lg cursor-pointer',
                                    'border-2 border-dashed border-gray-400 hover:border-gray-500',
                                    'bg-white/5 backdrop-blur-sm',
                                    'relative overflow-hidden group',
                                    'transition-all duration-200 ease-in-out',
                                    selectedImage ? 'border-solid border-blue-500' : ''
                                )}
                                title={`Select image for slot ${index + 1}`}
                            >
                                // TODO: modify to enable square image cover
                                <img
                                    src={imageSrc}
                                    alt={selectedImage ? `Selected for slot ${index + 1}` : `Placeholder for slot ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => e.currentTarget.src = `https://placehold.co/200x200/CCCCCC/FFFFFF?text=Error`}
                                />
                                {!selectedImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <span className="text-white text-xs font-semibold">Choose Image</span>
                                    </div>
                                )}
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

                {/* Story Textarea */}
                <Textarea
                    ref={textareaRef}
                    placeholder="Write a short memo for your future self"
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    rows={5}
                />
            </div>

            {/* Footer Button (Fixed or at bottom) */}
            <div className="mt-auto pt-4 flex-shrink-0"> {/* Use mt-auto to push to bottom in flex-col */}
                 <Button
                    onClick={handlePost}
                    className="w-full bg-blue-500/90 hover:bg-blue-600 text-white py-3 text-lg disabled:opacity-50" // Added disabled style
                    disabled={isPosting || !selectedImages.some(img => img !== '')} // Disable if posting or no images selected
                >
                    {isPosting ? 'Posting...' : 'Save Collage'}
                </Button>
            </div>


            {/* Status Dialog */}
            <Dialog open={openStatusDialog} onOpenChange={setOpenStatusDialog}>
                <DialogContent className="bg-gray-900 border-gray-700 text-white sm:max-w-md">
                    <DialogHeader>
                        {postSuccess === true && (
                            <>
                                <DialogTitle className="text-green-400 flex items-center">
                                    <CheckCircle className="w-6 h-6 mr-2" />
                                    Collage Saved!
                                </DialogTitle>
                                <DialogDescription className="text-gray-400 pt-2">
                                    You can view all your past collages at our next Rewind.
                                </DialogDescription>
                            </>
                        )}
                        {postSuccess === false && (
                            <>
                                <DialogTitle className="text-red-400 flex items-center">
                                    <AlertTriangle className="w-6 h-6 mr-2" />
                                    Be more expressive!
                                </DialogTitle>
                                <DialogDescription className="text-gray-400 pt-2">
                                    Please select at least one image for your collage.
                                </DialogDescription>
                            </>
                        )}
                        {postSuccess === null && isPosting && ( /* Optional: Add a loading state in dialog if needed */
                            <>
                               <DialogTitle className="text-blue-400 flex items-center">
                                   {/* Add a spinner icon if available */}
                                   Updating...
                               </DialogTitle>
                               <DialogDescription className="text-gray-400 pt-2">
                                   Saving your collage.
                               </DialogDescription>
                            </>
                        )}
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <Button
                            // --- CHANGE HERE --- Use the updated reset function
                            onClick={resetPostStatusAndForm}
                            className="bg-gray-700 hover:bg-gray-600 text-white w-full sm:w-auto"
                        >
                            {postSuccess === true ? 'Continue' : 'Close'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </motion.div>
    );
};

export default MakeCollageScreen;