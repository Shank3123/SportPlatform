import { create } from 'zustand';
import { Post, User, Conversation, Message } from '../types';

interface AppState {
  currentView: 'home' | 'discover' | 'notifications' | 'messages' | 'profile' | 'expert';
  posts: Post[];
  users: User[];
  comments: Comment[];
  conversations: Conversation[];
  messages: Message[];
  notifications: Notification[];
  setCurrentView: (view: AppState['currentView']) => void;
  addPost: (post: Post) => void;
  updatePostLikes: (postId: string, likes: number, isLiked: boolean) => void;
  updatePostShares: (postId: string, shares: number) => void;
  addSharedPost: (userId: string, postId: string) => void;
  getSharedPosts: (userId: string) => Post[];
  addComment: (comment: Comment) => void;
  getPostComments: (postId: string) => Comment[];
  getFilteredPosts: (userSportsCategory: string) => Post[];
  getFilteredUsers: (userSportsCategory: string) => User[];
  addMessage: (message: Message) => void;
  getConversations: (userId: string, userSportsCategory: string) => Conversation[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (notificationId: string) => void;
}

interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'verification';
  message: string;
  isRead: boolean;
  createdAt: string;
  fromUser?: User;
}

// Mock data for different sports categories
const mockUsers: User[] = [
  {
    id: '8',
    email: 'coach2@martial.com',
    username: 'martialcoach2',
    fullName: 'Sarah Johnson',
    role: 'coach',
    sportsCategory: 'martial-arts',
    isVerified: true,
    profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Professional martial arts instructor with 10+ years experience',
    followers: 2500,
    following: 150,
    posts: 89,
    sharedPosts: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '9',
    email: 'coach2@calorie.com',
    username: 'caloriecoach2',
    fullName: 'Mike Chen',
    role: 'coach',
    sportsCategory: 'calorie-fight',
    isVerified: true,
    profileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Certified fitness trainer specializing in calorie burning workouts',
    followers: 1800,
    following: 200,
    posts: 156,
    sharedPosts: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '10',
    email: 'coach2@coco.com',
    username: 'cococoach2',
    fullName: 'Alex Rodriguez',
    role: 'coach',
    sportsCategory: 'coco',
    isVerified: true,
    profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Coco sport specialist and performance coach',
    followers: 1200,
    following: 80,
    posts: 67,
    sharedPosts: [],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '11',
    email: 'user2@martial.com',
    username: 'martialuser2',
    fullName: 'Emma Davis',
    role: 'user',
    sportsCategory: 'martial-arts',
    isVerified: false,
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Martial arts enthusiast, always learning',
    followers: 150,
    following: 45,
    posts: 12,
    sharedPosts: [],
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '12',
    email: 'user2@calorie.com',
    username: 'calorieuser2',
    fullName: 'John Smith',
    role: 'user',
    sportsCategory: 'calorie-fight',
    isVerified: false,
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Fitness enthusiast on a weight loss journey',
    followers: 89,
    following: 67,
    posts: 8,
    sharedPosts: [],
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: '13',
    email: 'user2@coco.com',
    username: 'cocouser2',
    fullName: 'Maria Garcia',
    role: 'user',
    sportsCategory: 'coco',
    isVerified: false,
    profileImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Coco enthusiast, learning from the best',
    followers: 67,
    following: 34,
    posts: 3,
    sharedPosts: [],
    createdAt: '2024-02-20T00:00:00Z',
  },
];

const mockPosts: Post[] = [
  {
    id: '1',
    userId: '8',
    user: mockUsers[0],
    content: 'Remember, consistency is key in martial arts training. Here\'s a quick warm-up routine that will prepare your body for intensive training. Practice these movements daily! 🥋',
    mediaUrl: 'https://images.pexels.com/photos/4752861/pexels-photo-4752861.jpeg?auto=compress&cs=tinysrgb&w=800',
    mediaType: 'image',
    likes: 234,
    comments: 18,
    shares: 12,
    isLiked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '9',
    user: mockUsers[1],
    content: 'New HIIT workout video is live! This 20-minute session will help you burn calories efficiently. Perfect for busy schedules. Who\'s joining me? 💪',
    mediaUrl: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    mediaType: 'image',
    likes: 456,
    comments: 32,
    shares: 28,
    isLiked: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    userId: '10',
    user: mockUsers[2],
    content: 'Coco training session complete! Focus on technique and breathing. Remember, it\'s not about speed, it\'s about precision and control. 🎯',
    mediaUrl: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=800',
    mediaType: 'image',
    likes: 189,
    comments: 15,
    shares: 8,
    isLiked: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'like',
    message: 'Sarah Johnson liked your post',
    isRead: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
    fromUser: mockUsers[0],
  },
  {
    id: '2',
    userId: '1',
    type: 'follow',
    message: 'Mike Chen started following you',
    isRead: false,
    createdAt: new Date(Date.now() - 600000).toISOString(),
    fromUser: mockUsers[1],
  },
  {
    id: '3',
    userId: '1',
    type: 'verification',
    message: 'Your account has been verified by an expert',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useAppStore = create<AppState>((set, get) => ({
  currentView: 'home',
  posts: mockPosts,
  users: mockUsers,
  comments: [],
  conversations: [],
  messages: [],
  notifications: mockNotifications,

  setCurrentView: (view) => set({ currentView: view }),

  addPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  updatePostLikes: (postId, likes, isLiked) => {
    set((state) => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, likes, isLiked }
          : post
      ),
    }));
  },

  updatePostShares: (postId, shares) => {
    set((state) => ({
      posts: state.posts.map(post =>
        post.id === postId
          ? { ...post, shares }
          : post
      ),
    }));
  },

  addSharedPost: (userId, postId) => {
    set((state) => ({
      users: state.users.map(user =>
        user.id === userId
          ? { ...user, sharedPosts: [...(user.sharedPosts || []), postId] }
          : user
      ),
    }));
  },

  getSharedPosts: (userId) => {
    const { users, posts } = get();
    const user = users.find(u => u.id === userId);
    if (!user?.sharedPosts) return [];
    
    return posts.filter(post => user.sharedPosts?.includes(post.id));
  },

  addComment: (comment) => {
    set((state) => ({
      comments: [...state.comments, comment],
      posts: state.posts.map(post =>
        post.id === comment.postId
          ? { ...post, comments: post.comments + 1 }
          : post
      ),
    }));
  },

  getPostComments: (postId) => {
    const { comments } = get();
    return comments
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  },

  getFilteredPosts: (userSportsCategory) => {
    const { posts } = get();
    return posts.filter(post => 
      post.user.sportsCategory === userSportsCategory
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getFilteredUsers: (userSportsCategory) => {
    const { users } = get();
    return users.filter(user => user.sportsCategory === userSportsCategory);
  },

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  getConversations: (userId, userSportsCategory) => {
    const { users, messages } = get();
    const filteredUsers = users.filter(user => 
      user.sportsCategory === userSportsCategory && user.id !== userId
    );
    
    const conversations: Conversation[] = filteredUsers.map(otherUser => {
      const conversationMessages = messages.filter(msg =>
        (msg.senderId === userId && msg.receiverId === otherUser.id) ||
        (msg.senderId === otherUser.id && msg.receiverId === userId)
      );
      
      const lastMessage = conversationMessages.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      
      const unreadCount = conversationMessages.filter(msg =>
        msg.receiverId === userId && !msg.isRead
      ).length;
      
      return {
        id: `conv-${userId}-${otherUser.id}`,
        participants: [otherUser],
        lastMessage,
        unreadCount,
        updatedAt: lastMessage?.createdAt || new Date().toISOString(),
      };
    });
    
    return conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  addNotification: (notification) => {
    set((state) => ({ notifications: [notification, ...state.notifications] }));
  },

  markNotificationAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      ),
    }));
  },
}));