import React, { useState } from 'react';
import { MessageList } from './MessageList';
import { ChatWindow } from './ChatWindow';
import { Conversation } from '../../types';

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-lg shadow-md overflow-hidden">
      <div className="w-full md:w-1/3 border-r border-gray-200">
        <MessageList onConversationSelect={setSelectedConversation} />
      </div>
      
      <div className="hidden md:flex flex-1">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose someone to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}