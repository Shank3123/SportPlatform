import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  connect: (userId: string) => void;
  disconnect: () => void;
  sendMessage: (data: any) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],

  connect: (userId: string) => {
    const socket = io('ws://localhost:3001', {
      auth: { userId }
    });

    socket.on('connect', () => {
      set({ isConnected: true });
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
      console.log('Disconnected from server');
    });

    socket.on('online-users', (users: string[]) => {
      set({ onlineUsers: users });
    });

    set({ socket });
  },

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false, onlineUsers: [] });
    }
  },

  sendMessage: (data: any) => {
    const { socket } = get();
    if (socket) {
      socket.emit('message', data);
    }
  },

  joinRoom: (roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('join-room', roomId);
    }
  },

  leaveRoom: (roomId: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('leave-room', roomId);
    }
  },
}));