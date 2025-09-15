import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, Send } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Only show create post for coaches
  if (user?.role !== 'coach') return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsPosting(true);
    
    try {
      // Mock post creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newPost = {
        id: Date.now().toString(),
        userId: user.id,
        user,
        content,
        mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : undefined,
        mediaType: mediaFile?.type.startsWith('video/') ? 'video' as const : 'image' as const,
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false,
        createdAt: new Date().toISOString(),
      };
      
      onPostCreated(newPost);
      
      // Update user's post count
      const updatedUser = { ...user, posts: user.posts + 1 };
      // Note: In a real app, this would update the user in the backend
      
      setContent('');
      setMediaFile(null);
      toast.success('Post created successfully!');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    if (file.size > maxSize) {
      toast.error('File size must be less than 50MB');
      return;
    }
    
    setMediaFile(file);
    toast.success('Media file selected');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <img
            src={user?.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={user?.fullName}
            className="h-12 w-12 rounded-full object-cover"
          />
          
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your training tips, techniques, or motivation..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
            
            {mediaFile && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{mediaFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setMediaFile(null)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 cursor-pointer transition-colors"
                >
                  <Image className="h-5 w-5" />
                  <span className="text-sm">Photo</span>
                </label>
                
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 cursor-pointer transition-colors"
                >
                  <Video className="h-5 w-5" />
                  <span className="text-sm">Video</span>
                </label>
              </div>
              
              <Button
                type="submit"
                loading={isPosting}
                disabled={!content.trim()}
                size="sm"
              >
                <Send className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
}