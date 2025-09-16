import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, MoreHorizontal, Send } from 'lucide-react';
import { Post } from '../../types';
import { useAppStore } from '../../store/appStore';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore();
  const { updatePostLikes, updatePostShares, addSharedPost, addComment, getPostComments, addNotification } = useAppStore();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [sharesCount, setSharesCount] = useState(post.shares);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const comments = getPostComments(post.id);

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

  const handleShare = () => {
    if (!user) return;
    
    const newSharesCount = sharesCount + 1;
    setSharesCount(newSharesCount);
    
    // Update the post in the store
    updatePostShares(post.id, newSharesCount);
    
    // Add to user's shared posts
    addSharedPost(user.id, post.id);
    
    // Copy post URL to clipboard (mock functionality)
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`).then(() => {
      toast.success('Post link copied to clipboard!');
    }).catch(() => {
      toast.success('Post shared!');
    });
    
    // Add notification if not own post
    if (user.id !== post.userId) {
      addNotification({
        id: Date.now().toString(),
        userId: post.userId,
        type: 'comment',
        message: `${user.fullName} shared your post`,
        isRead: false,
        createdAt: new Date().toISOString(),
        fromUser: user,
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !user) return;
    
    setIsCommenting(true);
    
    try {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comment = {
        id: Date.now().toString(),
        postId: post.id,
        userId: user.id,
        user,
        content: newComment,
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      
      addComment(comment);
      
      // Add notification if not own post
      if (user.id !== post.userId) {
        addNotification({
          id: (Date.now() + 1).toString(),
          userId: post.userId,
          type: 'comment',
          message: `${user.fullName} commented on your post`,
          isRead: false,
          createdAt: new Date().toISOString(),
          fromUser: user,
        });
      }
      
      setNewComment('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsCommenting(false);
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
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-sm font-medium">{post.comments + comments.length}</span>
            </button>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
            >
              <Share className="h-6 w-6" />
              <span className="text-sm font-medium">{sharesCount}</span>
            </motion.button>
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
      
      {/* Comments Section */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-100 p-4"
        >
          {/* Comment Form */}
          {user && (
            <form onSubmit={handleComment} className="mb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={user.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newComment.trim()}
                      loading={isCommenting}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
          
          {/* Comments List */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <img
                  src={comment.user.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={comment.user.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-1 mb-1">
                      <p className="font-medium text-sm text-gray-900">{comment.user.fullName}</p>
                      {comment.user.isVerified && (
                        <svg className={`w-3 h-3 ${comment.user.role === 'coach' ? 'text-purple-500' : 'text-blue-500'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-3">
                    {new Date(comment.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
            
            {comments.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}