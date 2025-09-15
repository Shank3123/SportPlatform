import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PostCard } from '../posts/PostCard';
import { CreatePost } from '../posts/CreatePost';
import { Post } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useAppStore } from '../../store/appStore';

export function Feed() {
  const { user } = useAuthStore();
  const { posts, getFilteredPosts, addPost } = useAppStore();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (user) {
      const userPosts = getFilteredPosts(user.sportsCategory);
      setFilteredPosts(userPosts);
    }
  }, [user, posts, getFilteredPosts]);

  const handlePostCreated = (newPost: Post) => {
    addPost(newPost);
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      
      {filteredPosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">
            No posts from {user.sportsCategory.replace('-', ' ')} coaches yet. 
            {user.role === 'coach' && ' Be the first to share something amazing!'}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}