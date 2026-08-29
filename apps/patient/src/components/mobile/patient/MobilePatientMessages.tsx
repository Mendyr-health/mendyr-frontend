'use client';
import { motion } from 'framer-motion';
import { Search, Edit, MoreVertical } from 'lucide-react';
import { useState } from 'react';

// Placeholder data for messages
const messagesData = [
  {
    id: '1',
    sender: 'Sarah Jenkins',
    role: 'Nurse',
    avatar: 'SJ',
    preview: 'I will be arriving in about 15 minutes for your scheduled home visit.',
    time: '9:45 AM',
    unread: 2,
    online: true,
  },
  {
    id: '2',
    sender: 'Mendyr Support',
    role: 'System',
    avatar: 'MS',
    preview:
      'Your appointment for Oct 10 has been successfully completed. How was your experience?',
    time: 'Yesterday',
    unread: 0,
    online: false,
  },
];

export default function MobilePatientMessages() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-foreground text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground text-sm">Stay connected with your care team</p>
        </div>
        <button className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full p-2">
          <Edit className="h-5 w-5" />
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-border bg-card text-foreground focus:border-primary focus:ring-primary w-full rounded-xl border py-3 pr-4 pl-10 text-base focus:ring-1 focus:outline-none"
        />
      </motion.div>

      {/* Messages List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {messagesData.map((message) => (
          <div
            key={message.id}
            className="border-border bg-card active:bg-muted flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-colors"
          >
            <div className="relative">
              <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                {message.avatar}
              </div>
              {message.online && (
                <span className="border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-emerald-500"></span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground truncate text-base font-semibold">
                  {message.sender}
                </h3>
                <span
                  className={`text-xs ${message.unread > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}
                >
                  {message.time}
                </span>
              </div>
              <p className="text-primary/80 text-xs font-medium">{message.role}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <p
                  className={`truncate text-sm ${
                    message.unread > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}
                >
                  {message.preview}
                </p>
                {message.unread > 0 && (
                  <span className="bg-primary text-primary-foreground flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold">
                    {message.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
