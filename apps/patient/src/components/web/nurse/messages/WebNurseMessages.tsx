'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Send,
  Phone,
  Video,
  Paperclip,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  User,
  Clock,
  Sparkles,
  MapPin,
  Stethoscope,
  Search,
  MoreVertical,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Input } from '@mendyr/shared-ui/src/ui/input';
import { toast } from 'sonner';

interface Message {
  id: string;
  senderId: 'nurse' | 'patient';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: { type: 'image' | 'doc'; url: string; name: string };
}

interface Thread {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  serviceName: string;
  phone: string;
  online: boolean;
  unreadCount: number;
  lastActive: string;
  messages: Message[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 't-1',
    patientName: 'Aarav Sharma',
    patientAge: 68,
    patientGender: 'Male',
    serviceName: 'Post-Operative Care',
    phone: '+91 98765 43210',
    online: true,
    unreadCount: 2,
    lastActive: 'Active now',
    messages: [
      {
        id: 'm-101',
        senderId: 'patient',
        text: 'Hello Nurse Keshav, what time will you arrive today for my knee dressing change?',
        timestamp: '09:15 AM',
        status: 'read',
      },
      {
        id: 'm-102',
        senderId: 'nurse',
        text: 'Good morning Mr. Sharma! I am scheduled for the 10:00 AM slot. I am currently leaving my clinic and should reach your building by 9:55 AM.',
        timestamp: '09:18 AM',
        status: 'read',
      },
      {
        id: 'm-103',
        senderId: 'patient',
        text: 'Great! My son is at home and will let you in. I also had slight stiffness in my calf this morning.',
        timestamp: '09:25 AM',
      },
      {
        id: 'm-104',
        senderId: 'patient',
        text: 'Should I take the prescribed painkiller before you arrive?',
        timestamp: '09:26 AM',
      },
    ],
  },
  {
    id: 't-2',
    patientName: 'Priya Patel',
    patientAge: 42,
    patientGender: 'Female',
    serviceName: 'IV Therapy & Injections',
    phone: '+91 98111 22334',
    online: false,
    unreadCount: 0,
    lastActive: '20 m ago',
    messages: [
      {
        id: 'm-201',
        senderId: 'patient',
        text: 'Hi! Just confirming that the IV iron ampoules were delivered by the pharmacy.',
        timestamp: 'Yesterday',
        status: 'read',
      },
      {
        id: 'm-202',
        senderId: 'nurse',
        text: 'Wonderful, thank you Priya. Please store them in a cool, dry place. I will see you at 4:00 PM today for the infusion.',
        timestamp: 'Yesterday',
        status: 'read',
      },
    ],
  },
  {
    id: 't-3',
    patientName: 'Meera Joshi',
    patientAge: 75,
    patientGender: 'Female',
    serviceName: 'Elder Care Support',
    phone: '+91 99887 76655',
    online: true,
    unreadCount: 0,
    lastActive: 'Active now',
    messages: [
      {
        id: 'm-301',
        senderId: 'nurse',
        text: 'Good evening Mrs. Joshi, just checking in to see how your blood sugar readings were after dinner?',
        timestamp: '25 Jul',
        status: 'read',
      },
      {
        id: 'm-302',
        senderId: 'patient',
        text: 'It was 138 mg/dL! Feeling much better and did a 15 minute walk.',
        timestamp: '25 Jul',
        status: 'read',
      },
    ],
  },
  {
    id: 't-4',
    patientName: 'Vikram Singh',
    patientAge: 55,
    patientGender: 'Male',
    serviceName: 'Home Nursing & Vitals',
    phone: '+91 97654 32109',
    online: false,
    unreadCount: 0,
    lastActive: '2 hrs ago',
    messages: [
      {
        id: 'm-401',
        senderId: 'nurse',
        text: "Thank you for today's session Mr. Singh. Please remember to keep the dressing dry during your shower.",
        timestamp: '25 Jul',
        status: 'read',
      },
    ],
  },
];

const QUICK_TEMPLATES = [
  'I am on my way! 🚗',
  'Have you taken morning medications? 💊',
  'I have arrived at your building location 📍',
  'Please prepare sterile dressing table 🩺',
  "How is the patient's pain level right now? 🩹",
];

export default function WebNurseMessages() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>('t-1');
  const [inputVal, setInputVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages.length, activeThreadId]);

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unreadCount: 0 } : t)));
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = textToSend || inputVal;
    if (!content.trim()) return;

    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: 'nurse',
      text: content.trim(),
      timestamp: nowStr,
      status: 'sent',
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, messages: [...t.messages, newMsg], lastActive: 'Just now' }
          : t,
      ),
    );

    if (!textToSend) {
      setInputVal('');
    }

    // Simulate patient auto-reply after 2.5 seconds for interactive realism
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === activeThreadId) {
            const replyMsg: Message = {
              id: `m-${Date.now() + 1}`,
              senderId: 'patient',
              text: `Thank you for the update, Nurse Keshav! Received your message.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            return { ...t, messages: [...t.messages, replyMsg] };
          }
          return t;
        }),
      );
    }, 2500);
  };

  const handleSimulateAttachment = () => {
    const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const docMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: 'nurse',
      text: 'Attached clinical dressing guidelines & vital sign record.',
      timestamp: nowStr,
      status: 'sent',
      attachment: {
        type: 'doc',
        name: 'PostOp_Care_Instructions.pdf',
        url: '#',
      },
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? { ...t, messages: [...t.messages, docMsg], lastActive: 'Just now' }
          : t,
      ),
    );
    toast.success('Document shared with patient');
  };

  const filteredThreads = threads.filter(
    (t) =>
      t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 pt-8 lg:pt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-foreground font-outfit flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <MessageSquare className="text-primary h-8 w-8" />
          Patient & Care Communication Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Real-time secure chat with your scheduled patients and family caregivers.
        </p>
      </motion.div>

      {/* Main Chat Grid */}
      <div className="bg-glass border-border grid h-[720px] grid-cols-1 gap-6 overflow-hidden rounded-3xl border shadow-2xl lg:grid-cols-12">
        {/* Left Sidebar: Thread List (4 cols) */}
        <div className="border-border bg-card/40 flex h-full flex-col border-r lg:col-span-4">
          <div className="border-border space-y-3 border-b p-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search patients or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted/40 border-border h-10 rounded-xl pl-10"
              />
            </div>
          </div>

          <div className="divide-border/40 flex-1 divide-y overflow-y-auto">
            {filteredThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const isSelected = thread.id === activeThreadId;
              return (
                <button
                  key={thread.id}
                  onClick={() => handleSelectThread(thread.id)}
                  className={`hover:bg-muted/40 flex w-full items-start gap-3 p-4 text-left transition-all ${
                    isSelected ? 'bg-primary/10 border-primary border-l-4' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="bg-primary/15 text-primary flex h-12 w-12 items-center justify-center rounded-2xl text-base font-bold">
                      {thread.patientName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    {thread.online && (
                      <div className="border-card absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 bg-emerald-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-foreground truncate text-sm font-bold">
                        {thread.patientName}
                      </h4>
                      <span className="text-muted-foreground shrink-0 text-[11px]">
                        {lastMsg?.timestamp}
                      </span>
                    </div>
                    <span className="text-primary mt-0.5 block text-[10px] font-semibold">
                      {thread.serviceName}
                    </span>
                    <p
                      className={`mt-1 truncate text-xs ${thread.unreadCount > 0 ? 'text-foreground font-bold' : 'text-muted-foreground'}`}
                    >
                      {lastMsg
                        ? `${lastMsg.senderId === 'nurse' ? 'You: ' : ''}${lastMsg.text}`
                        : 'No messages yet'}
                    </p>
                  </div>

                  {thread.unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground shrink-0 self-center rounded-full px-2 py-0.5 text-xs font-bold">
                      {thread.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Area: Active Thread (8 cols) */}
        <div className="bg-card/20 flex h-full flex-col lg:col-span-8">
          {/* Thread Header */}
          <div className="border-border bg-glass flex shrink-0 items-center justify-between border-b p-4 px-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 text-primary flex h-11 w-11 items-center justify-center rounded-2xl text-base font-bold">
                {activeThread.patientName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground text-base font-bold">
                    {activeThread.patientName}
                  </h3>
                  <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                    {activeThread.patientAge} yrs • {activeThread.patientGender}
                  </span>
                  {activeThread.online ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" /> Online
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-xs">{activeThread.lastActive}</span>
                  )}
                </div>
                <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                  <span className="text-primary font-semibold">{activeThread.serviceName}</span> •
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-red-400" /> Mumbai
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeThread.phone}`}
                className="bg-glass border-border hover:bg-muted text-muted-foreground hover:text-foreground rounded-xl border p-2.5 transition-colors"
                title="Voice Call"
              >
                <Phone className="h-4 w-4" />
              </a>
              <button
                onClick={() =>
                  toast.info('Video Consultation Room Starting...', {
                    description: `Inviting ${activeThread.patientName} to encrypted telehealth call.`,
                  })
                }
                className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 rounded-xl border p-2.5 transition-colors"
                title="Video Call"
              >
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 space-y-4 overflow-y-auto p-6">
            <div className="my-2 text-center">
              <span className="bg-muted/60 text-muted-foreground rounded-full px-3 py-1 text-[11px] font-medium tracking-wider uppercase">
                End-to-End Encrypted Healthcare Chat • HIPAA Compliant
              </span>
            </div>

            {activeThread.messages.map((msg) => {
              const isMe = msg.senderId === 'nurse';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex max-w-[80%] items-end gap-2 md:max-w-[70%]">
                    {!isMe && (
                      <div className="bg-primary/15 text-primary mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {activeThread.patientName[0]}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-4 text-sm leading-relaxed ${
                        isMe
                          ? 'bg-primary text-primary-foreground shadow-primary/15 rounded-br-xs shadow-lg'
                          : 'bg-glass border-border text-foreground rounded-bl-xs border'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.attachment && (
                        <div
                          className={`mt-2 flex items-center gap-3 rounded-xl border p-3 ${isMe ? 'border-white/20 bg-white/10' : 'bg-muted border-border'}`}
                        >
                          <Paperclip className="h-5 w-5 shrink-0" />
                          <div className="min-w-0">
                            <span className="block truncate text-xs font-bold">
                              {msg.attachment.name}
                            </span>
                            <span className="text-[10px] opacity-80">
                              Click to preview document
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`text-muted-foreground flex items-center gap-1 px-1 text-[10px] ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <span className="ml-1">
                        {msg.status === 'read' ? (
                          <CheckCheck className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Templates Bar */}
          <div className="border-border/40 bg-muted/20 flex shrink-0 scrollbar-none items-center gap-2 overflow-x-auto border-t px-4 py-2">
            <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase">
              <Sparkles className="text-primary h-3 w-3" /> Quick Reply:
            </span>
            {QUICK_TEMPLATES.map((tpl) => (
              <button
                key={tpl}
                onClick={() => handleSendMessage(tpl)}
                className="bg-glass border-border/80 text-muted-foreground hover:text-foreground hover:border-primary/50 shrink-0 rounded-lg border px-3 py-1 text-xs font-medium transition-all active:scale-95"
              >
                {tpl}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-border bg-glass shrink-0 border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handleSimulateAttachment}
                className="bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted shrink-0 rounded-xl p-2.5 transition-colors"
                title="Attach Document or Image"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <Input
                placeholder={`Type a secure message to ${activeThread.patientName}...`}
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="bg-muted/40 border-border focus-visible:ring-primary/50 h-12 rounded-xl text-sm"
              />

              <Button
                type="submit"
                disabled={!inputVal.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 h-12 shrink-0 gap-2 rounded-xl px-6 font-semibold shadow-lg"
              >
                <Send className="h-4 w-4" /> Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
