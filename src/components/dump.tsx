import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from './ui/Button';

interface DumpScreenProps {
  onNavigate: (screen: string) => void;
}

const DumpScreen: React.FC<DumpScreenProps> = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // TODO: Implement actual upload logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate upload
      onNavigate('landing'); // Return to landing after successful upload
    } catch (error) {
      console.error('Upload failed:', error);
      // Handle error (show error message to user)
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="p-4 sm:p-6 space-y-6"
    >
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
              Throw
          </h2>
      </div>
      <div className="text-center">
        <p className="mb-8">
          Throw away an unwanted image, and let others embrace it.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded-lg mx-auto"
              />
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-red-500 hover:bg-red-600 text-white w-full"
              >
                {isUploading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Upload Photo
                  </>
                )}
              </Button>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-gray-400" />
                <p className="text-gray-400">
                  Click or drag an image here to upload
                </p>
              </div>
            </label>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DumpScreen;
