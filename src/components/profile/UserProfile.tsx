import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Edit, Calendar } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export function UserProfile() {
  const { user } = useAuthStore();

  if (!user) return null;

  const getVerificationBadge = () => {
    if (!user.isVerified) return null;
    
    const badgeColor = user.role === 'coach' ? 'text-purple-500' : 'text-blue-500';
    
    return (
      <svg className={`w-6 h-6 ${badgeColor}`} fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  const getRoleBadge = () => {
    const roleColors = {
      user: 'bg-gray-100 text-gray-800',
      coach: 'bg-purple-100 text-purple-800',
      expert: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <motion.img
          src={user.profileImage || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={user.fullName}
          className="absolute bottom-4 left-6 h-32 w-32 rounded-full border-4 border-white object-cover"
          whileHover={{ scale: 1.05 }}
        />
      </div>
      
      <div className="pt-20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
              {getVerificationBadge()}
            </div>
            <div className="flex items-center space-x-3">
              <p className="text-gray-600">@{user.username}</p>
              {getRoleBadge()}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {user.bio && (
          <p className="text-gray-700 mb-4">{user.bio}</p>
        )}

        <div className="flex items-center space-x-6 mb-4">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{user.posts}</p>
            <p className="text-sm text-gray-600">Posts</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{user.followers.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{user.following}</p>
            <p className="text-sm text-gray-600">Following</p>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <span className="capitalize">{user.sportsCategory.replace('-', ' ')}</span>
        </div>

        {!user.isVerified && user.role !== 'expert' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <p className="text-sm text-yellow-800">
              <strong>Verification Pending:</strong> Your account is under review by our experts.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}