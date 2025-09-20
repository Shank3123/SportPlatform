import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { Feed } from '../components/feed/Feed';
import { UserProfile } from '../components/profile/UserProfile';
import { MessagesPage } from '../components/messaging/MessagesPage';
import { DiscoverPage } from '../components/discover/DiscoverPage';
import { NotificationsPage } from '../components/notifications/NotificationsPage';
import { ExpertDashboard } from '../components/expert/ExpertDashboard';
import { PlayPage } from '../components/play/PlayPage';
import { useAuthStore } from '../store/authStore';
import { useSocketStore } from '../store/socketStore';
import { useAppStore } from '../store/appStore';

export function Dashboard() {
  const { user } = useAuthStore();
  const { connect } = useSocketStore();
  const { currentView } = useAppStore();

  useEffect(() => {
    if (user) {
      connect(user.id);
    }
  }, [user, connect]);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Feed />;
      case 'discover':
        return <DiscoverPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'profile':
        return <UserProfile />;
      case 'expert':
        return <ExpertDashboard />;
      case 'play':
        return <PlayPage />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}