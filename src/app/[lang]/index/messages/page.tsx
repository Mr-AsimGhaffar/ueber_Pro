"use client";

import React, { useState } from 'react';
import { Input, Badge, Avatar, List, Card, Button } from 'antd';
import { SearchOutlined, PhoneOutlined, VideoCameraOutlined, EllipsisOutlined } from '@ant-design/icons';
import Image from 'next/image';

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: 'user' | 'other';
  images?: string[];
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  online: boolean;
  messages: ChatMessage[];
}

const chats: Chat[] = [
  {
    id: '1',
    name: 'Mark Williams',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastMessage: 'Have you called them?',
    timestamp: '2 min',
    online: true,
    messages: [
      {
        id: '1',
        content: 'Hello. What can I do for you?',
        timestamp: '8:30 AM',
        sender: 'other'
      },
      {
        id: '2',
        content: "I'm just looking around.\nWill you tell me something about yourself?",
        timestamp: '8:35 AM',
        sender: 'user'
      },
      {
        id: '3',
        content: 'Are you there? That time!',
        timestamp: '8:40 AM',
        sender: 'user',
        images: [
          '/images/car1.jpg',
          '/images/car2.jpg'
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Elizabeth Sosa',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastMessage: "I'll call you later",
    timestamp: '8:01 PM',
    online: true,
    messages: []
  },
  {
    id: '3',
    name: 'Michael Howard',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastMessage: 'Thank you',
    timestamp: '7:30 PM',
    online: true,
    messages: []
  }
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<Chat>(chats[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Chats</h2>
          <Input
            placeholder="Search"
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          <List
            dataSource={filteredChats}
            renderItem={chat => (
              <div
                key={chat.id}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                  selectedChat.id === chat.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <Badge dot={chat.online} offset={[-6, 6]} color="green">
                  <Avatar src={chat.avatar} size={40} />
                </Badge>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{chat.name}</span>
                    <span className="text-xs text-gray-500">{chat.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            )}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
          <div className="flex items-center">
            <Badge dot={selectedChat.online} offset={[-6, 6]} color="green">
              <Avatar src={selectedChat.avatar} size={40} />
            </Badge>
            <div className="ml-3">
              <h3 className="font-medium">{selectedChat.name}</h3>
              <span className="text-sm text-gray-500">
                {selectedChat.online ? 'online' : 'offline'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button icon={<PhoneOutlined />} />
            <Button icon={<VideoCameraOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedChat.messages.map(message => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'flex flex-row-reverse' : 'flex'
              }`}
            >
              <div
                className={`max-w-[70%] ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-l-lg rounded-br-lg'
                    : 'bg-white rounded-r-lg rounded-bl-lg'
                } p-3 shadow-sm`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
                {message.images && (
                  <div className="mt-2 flex gap-2">
                    {message.images.map((image, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <Image
                          src={image}
                          alt="Shared image"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <Input.TextArea
            placeholder="Type a message..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
}