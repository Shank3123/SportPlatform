export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'coach' | 'expert';
  sportsCategory: 'coco' | 'martial-arts' | 'calorie-fight';
  isVerified: boolean;
  profileImage?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  createdAt: string;
  sharedPosts?: string[]; // Array of post IDs that user has shared
  documents?: VerificationDocument[];
}

export interface VerificationDocument {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  documentType: 'certificate' | 'id' | 'license';
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  likes: number;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'video';
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  coachId: string;
  coach: User;
  category: 'coco' | 'martial-arts' | 'calorie-fight';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'free' | 'premium';
  tokenCost: number; // 0 for free videos
  views: number;
  likes: number;
  isLiked: boolean;
  tags: string[];
  createdAt: string;
}

export interface Membership {
  id: string;
  name: string;
  description: string;
  price: number; // in tokens
  duration: number; // in days
  benefits: string[];
  coachId: string;
  coach: User;
  isActive: boolean;
}

export interface UserTokens {
  userId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: TokenTransaction[];
}

export interface TokenTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'purchased';
  amount: number;
  reason: string;
  description: string;
  createdAt: string;
}