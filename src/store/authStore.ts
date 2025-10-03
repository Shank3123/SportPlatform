import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  fullName: string;
  role: 'user' | 'coach';
  sportsCategory: 'coco' | 'martial-arts' | 'calorie-fight';
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      // Mock API call - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user database - in real app, this would be fetched from backend
      const mockUserDatabase: Record<string, User> = {
        'coach@martial.com': {
          id: '1',
          email: 'coach@martial.com',
          username: 'martialcoach',
          fullName: 'Sarah Johnson',
          role: 'coach',
          sportsCategory: 'martial-arts',
          isVerified: true,
          profileImage: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Professional martial arts instructor with 10+ years experience',
          followers: 2500,
          following: 150,
          posts: 89,
          createdAt: '2024-01-01T00:00:00Z',
        },
        'user@martial.com': {
          id: '2',
          email: 'user@martial.com',
          username: 'martialuser',
          fullName: 'Emma Davis',
          role: 'user',
          sportsCategory: 'martial-arts',
          isVerified: false,
          profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Martial arts enthusiast, always learning',
          followers: 150,
          following: 45,
          posts: 0,
          createdAt: '2024-02-01T00:00:00Z',
        },
        'coach@coco.com': {
          id: '3',
          email: 'coach@coco.com',
          username: 'cococoach',
          fullName: 'Alex Rodriguez',
          role: 'coach',
          sportsCategory: 'coco',
          isVerified: true,
          profileImage: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Coco sport specialist and performance coach',
          followers: 1200,
          following: 80,
          posts: 67,
          createdAt: '2024-01-01T00:00:00Z',
        },
        'user@coco.com': {
          id: '4',
          email: 'user@coco.com',
          username: 'cocouser',
          fullName: 'Maria Garcia',
          role: 'user',
          sportsCategory: 'coco',
          isVerified: false,
          profileImage: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Coco enthusiast, learning from the best',
          followers: 89,
          following: 23,
          posts: 0,
          createdAt: '2024-02-15T00:00:00Z',
        },
        'coach@calorie.com': {
          id: '5',
          email: 'coach@calorie.com',
          username: 'caloriecoach',
          fullName: 'Mike Chen',
          role: 'coach',
          sportsCategory: 'calorie-fight',
          isVerified: true,
          profileImage: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Certified fitness trainer specializing in calorie burning workouts',
          followers: 1800,
          following: 200,
          posts: 156,
          createdAt: '2024-01-01T00:00:00Z',
        },
        'user@calorie.com': {
          id: '6',
          email: 'user@calorie.com',
          username: 'calorieuser',
          fullName: 'John Smith',
          role: 'user',
          sportsCategory: 'calorie-fight',
          isVerified: false,
          profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Fitness enthusiast on a weight loss journey',
          followers: 89,
          following: 67,
          posts: 0,
          createdAt: '2024-02-15T00:00:00Z',
        },
        'expert@sports.com': {
          id: '7',
          email: 'expert@sports.com',
          username: 'sportsexpert',
          fullName: 'Dr. Lisa Thompson',
          role: 'expert',
          sportsCategory: 'martial-arts',
          isVerified: true,
          profileImage: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
          bio: 'Sports medicine expert and verification specialist',
          followers: 5000,
          following: 100,
          posts: 0,
          createdAt: '2024-01-01T00:00:00Z',
        },
      };
      
      // Find user by email
      const mockUser = mockUserDatabase[email.toLowerCase().trim()];
      
      if (!mockUser) {
        console.error('User not found for email:', email);
        console.log('Available emails:', Object.keys(mockUserDatabase));
        throw new Error('Invalid credentials. Please use one of the demo emails provided.');
      }
      
      set({ user: mockUser, isAuthenticated: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData: RegisterData) => {
    set({ isLoading: true });
    try {
      // Mock API call - replace with actual registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        username: userData.username,
        fullName: userData.fullName,
        role: userData.role,
        sportsCategory: userData.sportsCategory,
        isVerified: false,
        followers: 0,
        following: 0,
        posts: 0,
        createdAt: new Date().toISOString(),
      };
      
      set({ user: newUser, isAuthenticated: true });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });
    }
  },
}));