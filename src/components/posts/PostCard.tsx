import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import { Post } from '../../types';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const { updatePostLikes, addNotification } = useAppStore();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    const newIsLiked = !isLiked;
    const newLikesCount = newIsLiked ? likesCount + 1 : likesCount - 1;
    
    setIsLiked(newIsLiked);
    setLikesCount(newLikesCount);
    
    // Update the post in the store
    updatePostLikes(post.id, newLikesCount, newIsLiked);
    
    // Add notification if liking (not unliking) and not own post
    if (newIsLiked && user && user.id !== post.userId) {
      addNotification({
        id: Date.now().toString(),
        userId: post.userId,
        type: 'like',
        message: `${user.fullName} liked your post`,
        isRead: false,
        createdAt: new Date().toISOString(),
        fromUser: user,
      });
    }
  };

  const getVerificationBadge = () => {
    if (!post.user.isVerified) return null;
    
    const badgeColor = post.user.role === 'coach' ? 'text-purple-500' : 'text-blue-500';
    
    return (
      <svg className={`w-4 h-4 ${badgeColor}`} fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.user.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={post.user.fullName}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-1">
              <h3 className="font-semibold text-gray-900">{post.user.username}</h3>
              {getVerificationBadge()}
            </div>
            <p className="text-sm text-gray-500 capitalize">{post.user.sportsCategory.replace('-', ' ')}</p>
          </div>
        </div>
        
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <div className="relative">
          {post.mediaType === 'video' ? (
            <video
              src={post.mediaUrl}
              className="w-full h-80 object-cover"
              controls
            />
          ) : (
            <img
              src={post.mediaUrl}
              alt="Post content"
              className="w-full h-80 object-cover"
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-900 mb-3">{post.content}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-6">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </motion.button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            
            <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
              <Share className="h-6 w-6" />
              <span className="text-sm font-medium">{post.shares}</span>
            </button>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </motion.div>
  );
}