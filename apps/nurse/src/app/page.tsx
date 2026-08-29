'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  CheckSquare,
  MessageSquare,
  Clock,
  Menu,
  Activity,
  Calendar,
  Settings,
  LogOut,
  Stethoscope,
  MapPin,
  DollarSign,
  Power,
  X,
  Navigation,
  Phone,
  Send,
  BarChart3,
  CreditCard,
  User,
  ShieldCheck,
  Check,
  KeySquare,
  CheckCircle2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Video,
  Paperclip,
} from 'lucide-react';
import { Button } from '@mendyr/shared-ui/src/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@mendyr/shared-ui/src/ui/card';

const SIDEBAR_ITEMS = [
  { icon: Activity, label: 'Dashboard', id: 'dashboard' },
  { icon: DollarSign, label: 'Earnings', id: 'earnings' },
  { icon: Calendar, label: 'Schedule', id: 'schedule' },
  { icon: MessageSquare, label: 'Messages', id: 'messages' },
  { icon: Settings, label: 'Settings', id: 'settings' },
];

const METRICS = [
  {
    title: "Today's Earnings",
    value: '$240.00',
    change: '+$45 from yesterday',
    icon: DollarSign,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100',
  },
  {
    title: 'Acceptance Rate',
    value: '94%',
    change: '+2% this week',
    icon: Activity,
    color: 'text-blue-500',
    bg: 'bg-blue-100',
  },
  {
    title: 'Online Time',
    value: '4h 30m',
    change: 'Target: 8h',
    icon: Clock,
    color: 'text-purple-500',
    bg: 'bg-purple-100',
  },
  {
    title: 'Completed Visits',
    value: '6',
    change: '2 remaining',
    icon: CheckSquare,
    color: 'text-orange-500',
    bg: 'bg-orange-100',
  },
];

const INITIAL_REQUESTS = [
  {
    id: 101,
    name: 'Eleanor Pena',
    age: 68,
    condition: 'Post-op Wound Care',
    distance: '4.2 miles',
    time: '12 mins away',
    pay: '$45.00',
    window: 'Today, 2:00 PM - 3:00 PM',
    address: '123 Main St, Springfield',
    details:
      'Patient requires daily dressing changes for a surgical wound on the lower abdomen. Must check for signs of infection and monitor vitals. Requires a sterile environment.',
    requirements: ['Sterile Gloves', 'Wound Cleanser', 'Gauze Pads'],
  },
  {
    id: 102,
    name: 'Wade Warren',
    age: 45,
    condition: 'IV Antibiotics',
    distance: '2.1 miles',
    time: '8 mins away',
    pay: '$30.00',
    window: 'Today, 3:30 PM - 4:00 PM',
    address: '456 Elm St, Springfield',
    details:
      'Patient needs assistance with IV antibiotic administration for a respiratory infection. Verify PICC line is clear and flush before/after administration.',
    requirements: ['Saline Flushes', 'IV Medication', 'Alcohol Wipes'],
  },
];

const INITIAL_UPCOMING_VISITS = [
  {
    id: 201,
    name: 'Jacob Jones',
    address: '123 Main St, Apt 4B',
    time: '01:00 PM',
    type: 'Vitals Check',
    condition: 'Routine Checkup',
    distance: '2.5 miles',
    pay: '$25.00',
  },
];

const EARNINGS_HISTORY = [
  {
    id: 1,
    date: 'Today',
    amount: '$240.00',
    trips: 4,
    status: 'Pending',
    gross: '$300.00',
    platformFee: '-$45.00',
    tax: '-$15.00',
    visits: [
      { type: 'Post-op Wound Care', patient: 'Eleanor Pena', time: '10:00 AM', earned: '$60.00' },
      { type: 'IV Antibiotics', patient: 'Wade Warren', time: '1:30 PM', earned: '$60.00' },
      { type: 'Vitals Check', patient: 'Jacob Jones', time: '3:00 PM', earned: '$60.00' },
      { type: 'Physical Therapy', patient: 'Albert Flores', time: '4:15 PM', earned: '$60.00' },
    ],
  },
  {
    id: 2,
    date: 'Yesterday',
    amount: '$180.00',
    trips: 3,
    status: 'Processed',
    gross: '$225.00',
    platformFee: '-$33.75',
    tax: '-$11.25',
    visits: [
      { type: 'Routine Checkup', patient: 'Esther Howard', time: '9:00 AM', earned: '$60.00' },
      { type: 'Wound Care', patient: 'Guy Hawkins', time: '11:30 AM', earned: '$60.00' },
      { type: 'Medication Admin', patient: 'Ralph Edwards', time: '2:00 PM', earned: '$60.00' },
    ],
  },
  {
    id: 3,
    date: 'Mon, Aug 21',
    amount: '$320.00',
    trips: 6,
    status: 'Processed',
    gross: '$400.00',
    platformFee: '-$60.00',
    tax: '-$20.00',
    visits: [
      {
        type: 'Full Day Care Route',
        patient: 'Multiple Patients',
        time: '8:00 AM - 5:00 PM',
        earned: '$320.00',
      },
    ],
  },
  {
    id: 4,
    date: 'Sun, Aug 20',
    amount: '$0.00',
    trips: 0,
    status: 'Processed',
    gross: '$0.00',
    platformFee: '$0.00',
    tax: '$0.00',
    visits: [],
  },
];

const INITIAL_MESSAGES_DATA = [
  {
    id: 1,
    sender: 'Eleanor Pena',
    preview: "I'll leave the front door unlocked.",
    time: '10:30 AM',
    unread: 2,
    history: [
      {
        sender: 'nurse',
        text: "Hi Eleanor, I'll be arriving around 2:00 PM for your wound care.",
        time: '09:00 AM',
      },
      {
        sender: 'patient',
        text: "Sounds good! I'll leave the front door unlocked.",
        time: '10:30 AM',
      },
    ],
  },
  {
    id: 2,
    sender: 'Dr. Smith (Coord)',
    preview: 'Can you take an extra visit today?',
    time: '09:15 AM',
    unread: 0,
    history: [
      {
        sender: 'patient',
        text: 'Hi! Can you take an extra visit today in Springfield?',
        time: '09:15 AM',
      },
    ],
  },
  {
    id: 3,
    sender: 'Wade Warren',
    preview: 'Thank you for the care yesterday!',
    time: 'Yesterday',
    unread: 0,
    history: [
      {
        sender: 'patient',
        text: 'Thank you for the care yesterday! Feeling much better.',
        time: '04:30 PM',
      },
    ],
  },
];

const INITIAL_WEEK_DAYS = [
  {
    day: 'Mon',
    date: '21',
    visits: [
      {
        id: 'cal_1',
        time: '09:00 AM',
        type: 'Physical Therapy',
        patient: 'Albert Flores',
        address: '321 Oak St, Springfield',
        requirements: ['Resistance Bands', 'Gait Belt'],
        color: 'bg-blue-100 text-blue-700 border-blue-200',
      },
    ],
  },
  { day: 'Tue', date: '22', visits: [] },
  {
    day: 'Wed',
    date: '23',
    visits: [
      {
        id: 'cal_2',
        time: '10:00 AM',
        type: 'Vitals Check',
        patient: 'Jacob Jones',
        address: '123 Main St, Apt 4B',
        requirements: ['Stethoscope', 'BP Cuff'],
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      },
      {
        id: 'cal_3',
        time: '02:00 PM',
        type: 'Wound Care',
        patient: 'Eleanor Pena',
        address: '456 Elm St, Springfield',
        requirements: ['Sterile Gloves', 'Gauze', 'Cleanser'],
        color: 'bg-rose-100 text-rose-700 border-rose-200',
      },
    ],
  },
  {
    day: 'Thu',
    date: '24',
    visits: [
      {
        id: 'cal_4',
        time: '11:30 AM',
        type: 'IV Antibiotics',
        patient: 'Wade Warren',
        address: '789 Pine St, Springfield',
        requirements: ['IV Medication', 'Saline Flushes'],
        color: 'bg-purple-100 text-purple-700 border-purple-200',
      },
    ],
  },
  {
    day: 'Fri',
    date: '25',
    visits: [
      {
        id: 'cal_5',
        time: '01:00 PM',
        type: 'Routine Checkup',
        patient: 'Esther Howard',
        address: '555 Cedar Ln, Springfield',
        requirements: ['Thermometer', 'Oximeter'],
        color: 'bg-orange-100 text-orange-700 border-orange-200',
      },
    ],
  },
  { day: 'Sat', date: '26', visits: [] },
  { day: 'Sun', date: '27', visits: [] },
];

const INITIAL_MOCK_VISITS_BY_DATE: Record<string, any[]> = {
  '2': [
    {
      id: 'cal_8',
      time: '08:00 AM',
      type: 'Vitals Check',
      patient: 'Brooklyn Simmons',
      address: '12 Maple St',
      requirements: [],
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
  ],
  '5': [
    {
      id: 'cal_6',
      time: '10:00 AM',
      type: 'Vitals Check',
      patient: 'Ronald Richards',
      address: '987 Walnut Dr',
      requirements: ['BP Cuff', 'Thermometer'],
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      id: 'cal_9',
      time: '02:00 PM',
      type: 'Physical Therapy',
      patient: 'Darrell Steward',
      address: '54 Pine Rd',
      requirements: ['Gait Belt'],
      color: 'bg-rose-100 text-rose-700 border-rose-200',
    },
  ],
  '8': [
    {
      id: 'cal_10',
      time: '11:00 AM',
      type: 'Wound Care',
      patient: 'Courtney Henry',
      address: '88 Oak Ave',
      requirements: ['Dressing Kit'],
      color: 'bg-purple-100 text-purple-700 border-purple-200',
    },
  ],
  '14': [
    {
      id: 'cal_7',
      time: '09:00 AM',
      type: 'Wound Care',
      patient: 'Arlene McCoy',
      address: '654 Birch Ct',
      requirements: ['Wound Dressing Kit'],
      color: 'bg-rose-100 text-rose-700 border-rose-200',
    },
    {
      id: 'cal_11',
      time: '12:00 PM',
      type: 'IV Antibiotics',
      patient: 'Cody Fisher',
      address: '123 Elm St',
      requirements: ['IV Kit'],
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    {
      id: 'cal_12',
      time: '03:00 PM',
      type: 'Vitals Check',
      patient: 'Kristin Watson',
      address: '44 Cedar Ln',
      requirements: ['Thermometer'],
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
  ],
  '17': [
    {
      id: 'cal_13',
      time: '10:30 AM',
      type: 'Physical Therapy',
      patient: 'Jerome Bell',
      address: '77 Spruce St',
      requirements: ['Resistance Bands'],
      color: 'bg-blue-100 text-blue-700 border-blue-200',
    },
  ],
  '28': [
    {
      id: 'cal_14',
      time: '09:00 AM',
      type: 'Routine Checkup',
      patient: 'Kathryn Murphy',
      address: '90 Fir Dr',
      requirements: [],
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    {
      id: 'cal_15',
      time: '01:00 PM',
      type: 'Wound Care',
      patient: 'Savannah Nguyen',
      address: '11 Ash St',
      requirements: ['Cleanser', 'Gauze'],
      color: 'bg-rose-100 text-rose-700 border-rose-200',
    },
  ],
};

export default function NurseDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOnline, setIsOnline] = useState(true);
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');

  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeVisits, setActiveVisits] = useState<any[]>(INITIAL_UPCOMING_VISITS);

  // Modals & Overlays
  const [selectedRequest, setSelectedRequest] = useState<(typeof INITIAL_REQUESTS)[0] | null>(null);
  const [expandedPayoutId, setExpandedPayoutId] = useState<number | null>(null);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [cancelVisitId, setCancelVisitId] = useState<number | string | null>(null);
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [executionVisit, setExecutionVisit] = useState<any | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [calendarWeekDays, setCalendarWeekDays] = useState(INITIAL_WEEK_DAYS);
  const [calendarMonthVisits, setCalendarMonthVisits] = useState(INITIAL_MOCK_VISITS_BY_DATE);
  const [executionState, setExecutionState] = useState<'en_route' | 'arrived' | 'in_progress'>(
    'en_route',
  );
  const [otp, setOtp] = useState(['', '', '', '']);

  // Chat state
  const [messagesData, setMessagesData] = useState(INITIAL_MESSAGES_DATA);
  const [chatInput, setChatInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');

  const handleSendMessage = () => {
    if (!chatInput.trim() || activeChatId === null) return;

    setMessagesData((prev) =>
      prev.map((msg) => {
        if (msg.id === activeChatId) {
          return {
            ...msg,
            history: [
              ...msg.history,
              { sender: 'nurse', text: chatInput.trim(), time: 'Just now' },
            ],
            preview: chatInput.trim(),
          };
        }
        return msg;
      }),
    );
    setChatInput('');
  };

  const handleAccept = (req: unknown) => {
    setRequests(requests.filter((r) => r.id !== req.id));
    setActiveVisits([...activeVisits, { ...req, type: req.condition }]);
    setSelectedRequest(null);
  };

  const handleDecline = (id: number) => {
    setRequests(requests.filter((r) => r.id !== id));
    setSelectedRequest(null);
  };

  const rollbackVisit = (id: number | string) => {
    setActiveVisits(activeVisits.filter((v) => v.id !== id));
    setCalendarWeekDays((prev) =>
      prev.map((dayObj) => ({
        ...dayObj,
        visits: dayObj.visits.filter((v) => v.id !== id),
      })),
    );
    setCalendarMonthVisits((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((date) => {
        next[date] = next[date].filter((v) => v.id !== id);
      });
      return next;
    });
    setCancelVisitId(null);
    setShowOtherReason(false);
    setOtherReasonText('');
  };

  const startVisit = (visit: unknown) => {
    setExecutionVisit(visit);
    setExecutionState('en_route');
    setOtp(['', '', '', '']);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const verifyOtp = () => {
    if (otp.join('') === '1234') {
      setExecutionState('in_progress');
    } else {
      alert('Invalid OTP. Try 1234');
    }
  };

  const completeVisit = () => {
    setActiveVisits(activeVisits.filter((v) => v.id !== executionVisit.id));
    setExecutionVisit(null);
  };

  const renderDashboard = () => (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <h1 className="text-foreground font-outfit text-3xl font-bold">
            {isOnline ? 'You are Online' : 'You are Offline'}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            {isOnline ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                </span>{' '}
                Searching for nearby care requests...
              </>
            ) : (
              <>
                <Power className="h-4 w-4 text-rose-500" /> Go online to receive care requests.
              </>
            )}
          </p>
        </div>
        {isOnline && (
          <h2 className="font-outfit text-primary text-2xl font-bold">
            {requests.length} New Requests
          </h2>
        )}
      </motion.div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((metric, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
          >
            <Card className="bg-card border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">{metric.title}</p>
                    <h3 className="font-outfit mt-2 text-3xl font-bold">{metric.value}</h3>
                    <p className="text-muted-foreground mt-2 text-xs font-medium">
                      {metric.change}
                    </p>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${metric.bg}`}
                  >
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <motion.div
          className="space-y-4 lg:col-span-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-outfit text-xl font-bold">Incoming Requests</h2>
            <Button variant="link" className="text-primary hover:text-primary-dark">
              View Map <Navigation className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {requests.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-card border-border rounded-2xl border p-12 text-center shadow-sm"
                >
                  <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Activity className="text-muted-foreground h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold">No new requests</h3>
                  <p className="text-muted-foreground mt-2">
                    You will be notified when a patient requests care in your area.
                  </p>
                </motion.div>
              ) : (
                requests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    className="bg-card border-primary/20 relative overflow-hidden rounded-2xl border-2 p-6 shadow-md transition-all hover:shadow-lg"
                  >
                    <div className="bg-primary/5 absolute top-0 right-0 -z-10 h-32 w-32 rounded-bl-full"></div>
                    <div className="flex flex-col justify-between gap-6 sm:flex-row">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold">
                            {req.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-foreground text-xl font-bold">{req.condition}</h3>
                            <p className="text-muted-foreground font-medium">
                              {req.name}, {req.age} yrs
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="text-muted-foreground h-4 w-4" />
                            <div>
                              <p className="text-sm font-semibold">{req.distance}</p>
                              <p className="text-muted-foreground text-xs">{req.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="text-muted-foreground h-4 w-4" />
                            <div>
                              <p className="text-sm font-semibold">Time Window</p>
                              <p className="text-muted-foreground text-xs">{req.window}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border-border flex min-w-[140px] flex-col items-end justify-between gap-4 border-t pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                        <div className="text-right">
                          <p className="text-muted-foreground text-sm font-medium">Est. Payout</p>
                          <p className="font-outfit text-3xl font-bold text-emerald-600">
                            {req.pay}
                          </p>
                        </div>
                        <div className="flex w-full flex-col gap-2 sm:flex-row">
                          <Button
                            variant="outline"
                            className="border-primary/20 text-primary hover:bg-primary/5 h-11 flex-1"
                            onClick={() => setSelectedRequest(req)}
                          >
                            Details
                          </Button>
                          <Button
                            className="bg-primary hover:bg-primary-dark shadow-primary/20 h-11 flex-1 text-white shadow-md"
                            onClick={() => handleAccept(req)}
                          >
                            Accept
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Upcoming Visits Panel */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-outfit text-xl font-bold">Active & Upcoming Visits</h2>
            <Button variant="ghost" size="icon">
              <div className="bg-muted-foreground h-1 w-1 rounded-full shadow-[0_4px_0_0_currentColor,0_-4px_0_0_currentColor]"></div>
            </Button>
          </div>
          <Card className="bg-card border-none shadow-sm">
            <CardContent className="p-0">
              <div className="divide-border divide-y">
                {activeVisits.length === 0 && (
                  <div className="text-muted-foreground p-6 text-center">No upcoming visits</div>
                )}
                {activeVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="hover:bg-muted/30 group border-primary bg-primary/5 relative cursor-pointer border-l-4 p-5 transition-colors"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <p className="text-foreground text-sm leading-tight font-semibold">
                        {visit.type}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-primary bg-primary/10 rounded-md px-2 py-1 text-xs font-bold">
                          {visit.time || visit.window}
                        </span>
                        {/* Cancel Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCancelVisitId(visit.id);
                          }}
                          className="rounded-md p-1 text-rose-500 transition-colors hover:bg-rose-100 hover:text-rose-700"
                          title="Cancel Request"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{visit.name}</p>
                    <div className="text-muted-foreground mt-2 flex items-start gap-1 text-xs">
                      <MapPin className="mt-0.5 h-3.5 w-3.5" /> <span>{visit.address}</span>
                    </div>
                    <Button
                      onClick={() => startVisit(visit)}
                      className="shadow-primary/20 mt-4 h-10 w-full text-sm shadow-md transition-transform hover:scale-105"
                    >
                      <Navigation className="mr-2 h-4 w-4" /> Start Visit / Navigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );

  const renderEarnings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      <h1 className="font-outfit text-3xl font-bold">Earnings</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bg-primary shadow-primary/20 border-none text-white shadow-lg md:col-span-2">
          <CardContent className="p-8">
            <p className="text-primary-foreground/80 font-medium">Balance Available</p>
            <h2 className="font-outfit mt-2 text-6xl font-bold">$845.50</h2>
          </CardContent>
        </Card>
        <Card className="bg-card border-none shadow-sm">
          <CardContent className="flex h-full flex-col justify-center p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Weekly Goal</p>
                <p className="text-xl font-bold">$1000</p>
              </div>
            </div>
            <div className="bg-muted mb-2 h-3 w-full rounded-full">
              <div className="h-3 rounded-full bg-emerald-500" style={{ width: '84%' }}></div>
            </div>
            <p className="text-muted-foreground text-right text-xs">84% completed</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3 className="font-outfit mb-4 text-xl font-bold">Recent Payouts</h3>
        <Card className="bg-card border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-border divide-y">
              {EARNINGS_HISTORY.map((hist) => {
                const isExpanded = expandedPayoutId === hist.id;
                return (
                  <div key={hist.id} className="hover:bg-muted/30 transition-colors">
                    <div
                      className="flex cursor-pointer items-center justify-between p-6"
                      onClick={() => setExpandedPayoutId(isExpanded ? null : hist.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted rounded-full p-2">
                          {isExpanded ? (
                            <ChevronUp className="text-muted-foreground h-5 w-5" />
                          ) : (
                            <ChevronDown className="text-muted-foreground h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">{hist.date}</h4>
                          <p className="text-muted-foreground text-sm">
                            {hist.trips} completed visits
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-xl font-bold">{hist.amount}</p>
                        <span
                          className={`rounded-md px-2 py-1 text-xs font-semibold ${hist.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                        >
                          {hist.status}
                        </span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="border-border mx-6 flex flex-col gap-3 border-t p-6 pt-0 text-sm">
                            {/* Daily Visits Breakdown */}
                            {hist.visits.length > 0 && (
                              <div className="mt-4 mb-2 space-y-3">
                                <h5 className="text-foreground mb-2 text-xs font-bold tracking-wider uppercase">
                                  Visits Completed ({hist.visits.length})
                                </h5>
                                <div className="space-y-2">
                                  {hist.visits.map((visit: unknown, idx: number) => (
                                    <div
                                      key={idx}
                                      className="bg-muted/50 flex items-center justify-between rounded-lg p-2"
                                    >
                                      <div>
                                        <p className="text-foreground font-semibold">
                                          {visit.type}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                          {visit.patient} • {visit.time}
                                        </p>
                                      </div>
                                      <span className="font-semibold text-emerald-600">
                                        {visit.earned}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <h5 className="text-foreground mt-4 mb-1 text-xs font-bold tracking-wider uppercase">
                              Financial Breakdown
                            </h5>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gross Earnings</span>
                              <span className="font-semibold">{hist.gross}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Platform Fee (15%)</span>
                              <span className="font-semibold text-rose-500">
                                {hist.platformFee}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Estimated Taxes (5%)</span>
                              <span className="font-semibold text-rose-500">{hist.tax}</span>
                            </div>
                            <div className="bg-border my-1 h-px w-full"></div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold">Net Payout</span>
                              <span className="text-lg font-bold text-emerald-600">
                                {hist.amount}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderSchedule = () => {
    const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
    const monthVisits: Record<string, number> = {};
    Object.keys(calendarMonthVisits).forEach((k) => {
      monthVisits[k] = calendarMonthVisits[k].length;
    });
    calendarWeekDays.forEach((d) => {
      if (d.visits.length > 0) {
        monthVisits[d.date] = (monthVisits[d.date] || 0) + d.visits.length;
      }
    });

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-outfit text-3xl font-bold">My Schedule</h1>
            <p className="text-muted-foreground mt-1">August 2026</p>
          </div>
          <div className="bg-muted border-border flex rounded-xl border p-1">
            <button
              onClick={() => setCalendarView('week')}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${calendarView === 'week' ? 'text-foreground bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarView('month')}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${calendarView === 'month' ? 'text-foreground bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Month
            </button>
          </div>
        </div>

        <Card className="bg-card min-h-[600px] overflow-hidden border-none shadow-sm">
          <CardContent className="h-full p-0">
            {calendarView === 'week' ? (
              <div className="divide-border flex h-full min-h-[600px] flex-col divide-y md:flex-row md:divide-x md:divide-y-0">
                {calendarWeekDays.map((dayObj, i) => (
                  <div key={i} className="bg-background flex h-full min-w-[140px] flex-1 flex-col">
                    <div
                      className={`border-border border-b p-4 text-center ${dayObj.date === '23' ? 'bg-primary/5 border-b-primary/30' : 'bg-muted/30'}`}
                    >
                      <p
                        className={`text-sm font-bold tracking-wider uppercase ${dayObj.date === '23' ? 'text-primary' : 'text-muted-foreground'}`}
                      >
                        {dayObj.day}
                      </p>
                      <p
                        className={`font-outfit mt-1 text-3xl font-bold ${dayObj.date === '23' ? 'text-primary' : 'text-foreground'}`}
                      >
                        {dayObj.date}
                      </p>
                    </div>
                    <div
                      className={`min-h-[120px] flex-1 space-y-3 p-3 md:min-h-[500px] ${dayObj.date === '23' ? 'bg-primary/5' : ''} hover:bg-muted/50 cursor-pointer transition-colors`}
                      onClick={() => setSelectedCalendarDate(dayObj.date)}
                    >
                      {dayObj.visits.length === 0 ? (
                        <div className="flex h-full min-h-[80px] items-center justify-center opacity-50 transition-opacity hover:opacity-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            + Add Visit
                          </span>
                        </div>
                      ) : (
                        dayObj.visits.map((visit, j) => (
                          <div
                            key={j}
                            className={`rounded-xl border border-l-4 p-3 shadow-sm ${visit.color} bg-white transition-transform hover:scale-105`}
                          >
                            <p className="mb-1 text-xs font-bold opacity-80">{visit.time}</p>
                            <p className="mb-1 text-sm leading-tight font-bold">{visit.type}</p>
                            <p className="text-xs font-medium opacity-90">{visit.patient}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <div className="mb-4 grid grid-cols-7 gap-2 text-center md:gap-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div
                      key={d}
                      className="text-muted-foreground text-xs font-bold tracking-wider uppercase md:text-sm"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 md:gap-4">
                  {/* Empty days for August starting on Saturday */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="bg-muted/20 border-border/50 hidden h-16 rounded-xl border md:block md:h-28 md:rounded-2xl"
                    ></div>
                  ))}

                  {MONTH_DAYS.map((day) => {
                    const visitCount = monthVisits[day.toString()] || 0;
                    const isToday = day === 23;
                    return (
                      <div
                        key={day}
                        onClick={() => setSelectedCalendarDate(day.toString())}
                        className={`h-16 rounded-xl border md:h-28 md:rounded-2xl ${isToday ? 'border-primary bg-primary/5 ring-primary/20 ring-2' : 'border-border bg-card hover:border-primary/50'} flex cursor-pointer flex-col p-2 transition-colors md:p-3`}
                      >
                        <span
                          className={`text-sm font-bold md:text-lg ${isToday ? 'text-primary' : 'text-foreground'}`}
                        >
                          {day}
                        </span>
                        <div className="mt-auto space-y-1">
                          {visitCount > 0 && (
                            <div className="hidden md:block">
                              {Array.from({ length: visitCount }).map((_, i) => (
                                <div
                                  key={i}
                                  className="bg-primary/60 mb-1 h-1.5 w-full rounded-full"
                                ></div>
                              ))}
                              <p className="text-muted-foreground mt-1 text-right text-[10px] font-bold">
                                {visitCount} visits
                              </p>
                            </div>
                          )}
                          {visitCount > 0 && (
                            <div className="flex justify-center md:hidden">
                              <div className="bg-primary h-2 w-2 rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderMessages = () => {
    const activeChat = messagesData.find((m) => m.id === activeChatId);
    const filteredMessages = messagesData.filter(
      (m) =>
        m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.preview.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-border flex h-[calc(100vh-140px)] overflow-hidden rounded-2xl border shadow-sm"
      >
        <div className="border-border flex w-80 flex-col border-r">
          <div className="border-border border-b p-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages..."
                className="bg-muted h-10 w-full rounded-xl border-none pr-4 pl-10 text-sm outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="divide-border flex-1 divide-y overflow-y-auto">
            {filteredMessages.length === 0 ? (
              <div className="text-muted-foreground p-8 text-center text-sm">
                No messages found.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`hover:bg-muted/50 relative cursor-pointer p-4 transition-colors ${activeChatId === msg.id ? 'bg-primary/5' : ''}`}
                  onClick={() => setActiveChatId(msg.id)}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <h4
                      className={`truncate pr-4 text-sm font-bold ${activeChatId === msg.id ? 'text-primary' : ''}`}
                    >
                      {msg.sender}
                    </h4>
                    <span className="text-muted-foreground flex-shrink-0 text-xs">{msg.time}</span>
                  </div>
                  <p className="text-muted-foreground truncate text-sm">{msg.preview}</p>
                  {msg.unread > 0 && (
                    <span className="bg-primary absolute top-1/2 right-4 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-[10px] font-bold text-white">
                      {msg.unread}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {activeChat ? (
          <div className="bg-background relative flex flex-1 flex-col">
            <div className="border-border bg-card z-10 flex items-center justify-between border-b p-5">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                  {activeChat.sender.charAt(0)}
                </div>
                <div>
                  <h3 className="text-foreground font-bold">{activeChat.sender}</h3>
                  <p className="text-xs font-medium text-emerald-600">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    setIsCalling(true);
                    setCallType('audio');
                  }}
                >
                  <Phone className="text-primary h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => {
                    setIsCalling(true);
                    setCallType('video');
                  }}
                >
                  <Video className="text-primary h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {activeChat.history.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'nurse' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'nurse' ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' : 'bg-muted text-foreground border-border/50 rounded-tl-sm border shadow-sm'}`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={`mt-2 text-[10px] font-medium ${msg.sender === 'nurse' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-card border-border border-t p-4">
              <div className="flex items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground mb-1 flex-shrink-0 rounded-full"
                  onClick={() => alert('File picker would open here')}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <textarea
                  className="bg-muted focus:ring-primary/30 max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border-none p-3 text-sm transition-shadow outline-none focus:ring-1"
                  placeholder="Type a message..."
                  rows={1}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                ></textarea>
                <Button
                  className="bg-primary hover:bg-primary-dark mb-0.5 h-12 w-12 flex-shrink-0 rounded-full shadow-md"
                  onClick={handleSendMessage}
                >
                  <Send className="ml-1 h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/10 flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="bg-muted mb-4 flex h-20 w-20 items-center justify-center rounded-full">
              <MessageSquare className="text-muted-foreground h-10 w-10" />
            </div>
            <h2 className="text-xl font-bold">Your Messages</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Select a conversation from the list to start messaging with patients or coordinators.
            </p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-3xl space-y-8"
    >
      <h1 className="font-outfit text-3xl font-bold">Settings</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full space-y-2 md:w-64">
          {['Account Profile', 'Payment Methods', 'Notifications', 'Security', 'Support'].map(
            (item, i) => (
              <button
                key={i}
                className={`w-full rounded-xl p-3 text-left font-semibold transition-colors ${i === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
              >
                {item}
              </button>
            ),
          )}
        </div>

        <div className="flex-1 space-y-6">
          <Card className="bg-card border-border border shadow-sm">
            <CardHeader className="border-border bg-muted/30 border-b">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center gap-6">
                <div className="border-muted h-24 w-24 overflow-hidden rounded-full border-4">
                  <img
                    src="https://i.pravatar.cc/150?u=nurse1"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-semibold">First Name</label>
                  <input
                    type="text"
                    defaultValue="Sarah"
                    className="bg-muted w-full rounded-xl border-none p-3 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground text-sm font-semibold">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Jenkins"
                    className="bg-muted w-full rounded-xl border-none p-3 outline-none"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-muted-foreground text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    defaultValue="sarah.j@mendyr.com"
                    className="bg-muted w-full rounded-xl border-none p-3 outline-none"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-muted-foreground text-sm font-semibold">Phone</label>
                  <input
                    type="text"
                    defaultValue="+1 (555) 123-4567"
                    className="bg-muted w-full rounded-xl border-none p-3 outline-none"
                  />
                </div>
              </div>
              <Button className="mt-4 w-full">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="bg-background flex min-h-screen flex-col font-sans md:flex-row">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-sidebar-glass text-sidebar-foreground border-sidebar-border z-20 hidden flex-col border-r transition-all duration-300 md:flex"
      >
        <div className="border-sidebar-border/50 flex h-20 items-center justify-center border-b">
          <Stethoscope className="text-primary-light h-8 w-8" />
          {isSidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-outfit ml-3 text-xl font-bold tracking-wide"
            >
              Mendyr <span className="text-primary-light font-light">Nurse</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 space-y-2 px-4 py-8">
          {SIDEBAR_ITEMS.map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.id)}
                className={`group relative flex w-full items-center overflow-hidden rounded-xl p-3 transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-primary/20 shadow-lg'
                    : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="bg-primary absolute inset-0 z-0"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`z-10 h-5 w-5 ${!isSidebarOpen && 'mx-auto'}`} />
                {isSidebarOpen && <span className="z-10 ml-3 font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex h-screen flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-glass border-border sticky top-0 z-10 flex h-20 items-center justify-between border-b px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="bg-muted/50 border-border flex items-center rounded-full border p-1">
              <button
                onClick={() => setIsOnline(true)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${isOnline ? 'bg-white text-emerald-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Online
              </button>
              <button
                onClick={() => setIsOnline(false)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${!isOnline ? 'bg-white text-rose-600 shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Offline
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="group flex cursor-pointer items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                  Sarah Jenkins
                </p>
                <p className="text-muted-foreground text-xs">Registered Nurse</p>
              </div>
              <div className="from-primary to-accent h-10 w-10 rounded-full bg-gradient-to-tr p-0.5">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-white bg-white">
                  <img
                    src="https://i.pravatar.cc/150?u=nurse1"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="bg-background-secondary relative flex-1 overflow-y-auto scroll-smooth p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderDashboard()}
              </motion.div>
            )}
            {activeTab === 'earnings' && (
              <motion.div
                key="earnings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderEarnings()}
              </motion.div>
            )}
            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderSchedule()}
              </motion.div>
            )}
            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderMessages()}
              </motion.div>
            )}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {renderSettings()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- OVERLAYS --- */}

      {/* MODAL: Calendar Day Visits */}
      <AnimatePresence>
        {selectedCalendarDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCalendarDate(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-background w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-muted/50 border-border flex items-center justify-between border-b p-6">
                <div>
                  <h3 className="font-outfit text-foreground text-2xl font-bold">
                    August {selectedCalendarDate}, 2026
                  </h3>
                  <p className="text-muted-foreground text-sm">Scheduled Visits</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setSelectedCalendarDate(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
                {(() => {
                  const visits = [
                    ...(calendarWeekDays.find((d) => d.date === selectedCalendarDate)?.visits ||
                      []),
                    ...(calendarMonthVisits[selectedCalendarDate] || []),
                  ].filter(
                    (v, i, a) =>
                      a.findIndex((t) => t.patient === v.patient && t.time === v.time) === i,
                  ); // Unique

                  if (visits.length === 0)
                    return (
                      <div className="text-muted-foreground py-8 text-center">
                        <Calendar className="mx-auto mb-3 h-12 w-12 opacity-20" />
                        <p className="font-semibold">No visits scheduled</p>
                        <p className="text-sm">You have the day off.</p>
                        <Button className="mt-4" variant="outline">
                          + Add Availability
                        </Button>
                      </div>
                    );

                  return visits.map((visit, j) => (
                    <div
                      key={j}
                      className={`rounded-xl border border-l-4 p-5 shadow-sm ${visit.color || 'bg-card border-primary text-foreground'}`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <p className="text-lg leading-tight font-bold">{visit.type}</p>
                        <span className="rounded-md bg-black/5 px-2 py-1 text-xs font-bold">
                          {visit.time}
                        </span>
                      </div>

                      <div className="mt-4 space-y-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 flex-shrink-0 opacity-70" />
                          <span>{visit.patient}</span>
                        </div>
                        {visit.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" />
                            <span className="text-muted-foreground">{visit.address}</span>
                          </div>
                        )}
                        {visit.requirements && (
                          <div className="flex items-start gap-2">
                            <CheckSquare className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-70" />
                            <span className="text-muted-foreground bg-muted mt-0.5 rounded-md px-2 py-1 text-xs leading-tight font-normal">
                              {visit.requirements.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="border-border/50 mt-5 flex gap-3 border-t pt-4">
                        <Button
                          className="h-9 flex-1 border-rose-200 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          variant="outline"
                          onClick={() => {
                            setCancelVisitId(visit.id);
                            setSelectedCalendarDate(null);
                          }}
                        >
                          Cancel Visit
                        </Button>
                        <Button className="bg-primary hover:bg-primary-dark h-9 flex-1 text-xs text-white shadow-sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Cancel Request (Rollback) */}
      <AnimatePresence>
        {cancelVisitId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setCancelVisitId(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-background w-full max-w-md rounded-3xl p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-outfit text-foreground mb-2 text-2xl font-bold">Cancel Visit</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Please select a reason for rolling back this request. Warning: Excessive
                cancellations may affect your acceptance rate.
              </p>

              <div className="mb-6 space-y-3">
                {!showOtherReason ? (
                  <>
                    {[
                      'Patient requested cancellation',
                      'Vehicle or transport issue',
                      'Personal emergency',
                      'Distance is too far',
                    ].map((reason, i) => (
                      <button
                        key={i}
                        className="border-border text-foreground w-full rounded-xl border p-4 text-left text-sm font-medium transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => rollbackVisit(cancelVisitId)}
                      >
                        {reason}
                      </button>
                    ))}
                    <button
                      className="border-border text-foreground w-full rounded-xl border p-4 text-left text-sm font-medium transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => setShowOtherReason(true)}
                    >
                      Other...
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <textarea
                      placeholder="Please specify the reason..."
                      className="border-border bg-muted/50 focus:border-primary text-foreground min-h-[100px] w-full rounded-xl border p-4 text-sm outline-none"
                      value={otherReasonText}
                      onChange={(e) => setOtherReasonText(e.target.value)}
                    ></textarea>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="h-12 flex-1 rounded-xl"
                        onClick={() => setShowOtherReason(false)}
                      >
                        Back
                      </Button>
                      <Button
                        className="h-12 flex-1 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-500/20 hover:bg-rose-700"
                        onClick={() => {
                          if (otherReasonText.trim()) rollbackVisit(cancelVisitId);
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground h-12 w-full rounded-xl"
                onClick={() => {
                  setCancelVisitId(null);
                  setShowOtherReason(false);
                  setOtherReasonText('');
                }}
              >
                Keep Visit
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL: Request Details */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-background w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="from-primary to-primary-dark relative bg-gradient-to-br p-6 text-white">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 rounded-full text-white/70 hover:bg-white/20 hover:text-white"
                  onClick={() => setSelectedRequest(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/40 bg-white/20 text-2xl font-bold shadow-inner">
                    {selectedRequest.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-outfit text-2xl font-bold">{selectedRequest.condition}</h2>
                    <p className="font-medium text-white/80">
                      {selectedRequest.name}, {selectedRequest.age} yrs
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur-md">
                  <div>
                    <p className="text-sm font-medium text-white/70">Est. Payout</p>
                    <p className="text-3xl font-bold">{selectedRequest.pay}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white/70">Distance</p>
                    <p className="text-2xl font-bold">{selectedRequest.distance}</p>
                  </div>
                </div>
              </div>

              <div className="max-h-[60vh] space-y-6 overflow-y-auto p-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold">
                    <Clock className="text-primary h-5 w-5" /> Time & Location
                  </h3>
                  <div className="bg-muted border-border/50 space-y-3 rounded-xl border p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Time Window</span>
                      <span className="font-semibold">{selectedRequest.window}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-medium">Address</span>
                      <span className="max-w-[200px] text-right font-semibold">
                        {selectedRequest.address}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-border bg-muted/30 flex gap-4 border-t p-6">
                <Button
                  variant="outline"
                  className="h-14 flex-1 rounded-xl border-rose-200 text-lg font-bold text-rose-600 hover:bg-rose-50"
                  onClick={() => handleDecline(selectedRequest.id)}
                >
                  Decline
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-dark shadow-primary/30 h-14 flex-1 rounded-xl text-lg font-bold text-white shadow-lg"
                  onClick={() => handleAccept(selectedRequest)}
                >
                  Accept Request
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN OVERLAY: Active Execution Visit */}
      <AnimatePresence>
        {executionVisit && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="bg-background fixed inset-0 z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="bg-foreground text-background flex items-center justify-between p-6 pt-10">
              <div>
                <h2 className="font-outfit text-2xl font-bold">Active Visit</h2>
                <p className="text-muted/70">
                  {executionVisit.name} • {executionVisit.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-background rounded-full hover:bg-white/20"
                onClick={() => setExecutionVisit(null)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Map Placeholder for Navigation */}
            <div className="bg-muted relative flex-1">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%239C92AC' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                {executionState === 'en_route' && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-foreground border-primary flex items-center gap-2 rounded-full border-2 bg-white px-6 py-3 text-xl font-bold shadow-xl"
                  >
                    <Navigation className="text-primary h-5 w-5" /> Heading to Destination
                  </motion.div>
                )}
                {executionState === 'arrived' && (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-rose-500 text-white shadow-xl shadow-rose-500/50">
                    <MapPin className="h-10 w-10" />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Sheet Controls */}
            <div className="bg-card relative z-10 -mt-6 flex flex-col rounded-t-3xl p-8 shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
              {executionState === 'en_route' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-auto w-full max-w-lg space-y-6 text-center"
                >
                  <h3 className="font-outfit text-2xl font-bold">
                    En Route to {executionVisit.name}
                  </h3>
                  <div className="bg-muted flex items-center gap-4 rounded-xl p-4 text-left">
                    <MapPin className="h-8 w-8 flex-shrink-0 text-rose-500" />
                    <div>
                      <p className="font-semibold">{executionVisit.address}</p>
                      <p className="text-muted-foreground text-sm">
                        Est. arrival in 12 mins ({executionVisit.distance || '2.5 miles'})
                      </p>
                    </div>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary-dark shadow-primary/30 h-16 w-full rounded-2xl text-xl font-bold shadow-xl"
                    onClick={() => setExecutionState('arrived')}
                  >
                    I have arrived
                  </Button>
                </motion.div>
              )}

              {executionState === 'arrived' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-auto w-full max-w-lg space-y-6 text-center"
                >
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <KeySquare className="h-8 w-8" />
                  </div>
                  <h3 className="font-outfit text-2xl font-bold">Verify Patient OTP</h3>
                  <p className="text-muted-foreground">
                    Please ask {executionVisit.name} for their 4-digit Service OTP to begin care.
                  </p>

                  <div className="my-8 flex justify-center gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="border-border focus:border-primary focus:ring-primary/20 h-20 w-16 rounded-2xl border-2 text-center text-3xl font-bold transition-all outline-none focus:ring-4"
                        placeholder="•"
                      />
                    ))}
                  </div>

                  <Button
                    className="bg-primary hover:bg-primary-dark shadow-primary/30 h-16 w-full rounded-2xl text-xl font-bold shadow-xl"
                    onClick={verifyOtp}
                  >
                    Verify & Start Service
                  </Button>
                  <p className="text-muted-foreground mt-4 text-xs">For demo, use PIN: 1234</p>
                </motion.div>
              )}

              {executionState === 'in_progress' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-auto w-full max-w-lg space-y-6"
                >
                  <div className="mb-6 text-center">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-bold text-emerald-700">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
                      </span>
                      Service In Progress
                    </div>
                    <h3 className="font-outfit text-3xl font-bold">00:15:42</h3>
                  </div>

                  <div className="bg-muted border-border rounded-xl border p-6">
                    <h4 className="mb-4 text-lg font-bold">Checklist & Notes</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
                        />{' '}
                        <span className="font-medium">Verify Vitals</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
                        />{' '}
                        <span className="font-medium">Administer Treatment</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="text-primary focus:ring-primary h-5 w-5 rounded border-gray-300"
                        />{' '}
                        <span className="font-medium">Update Electronic Health Record</span>
                      </label>
                    </div>
                  </div>

                  <Button
                    className="flex h-16 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 text-xl font-bold text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-700"
                    onClick={completeVisit}
                  >
                    <CheckCircle2 className="h-6 w-6" /> Mark Service Complete
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalling && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white/10">
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-white/20"></div>
                {callType === 'video' ? (
                  <Video className="h-12 w-12" />
                ) : (
                  <Phone className="h-12 w-12" />
                )}
              </div>
              <h2 className="mb-2 text-3xl font-bold">
                {messagesData.find((m) => m.id === activeChatId)?.sender}
              </h2>
              <p className="mb-12 text-white/60">
                {callType === 'video' ? 'Video Calling...' : 'Calling...'}
              </p>

              <div className="flex gap-6">
                <Button className="h-16 w-16 rounded-full border-none bg-white/10 text-white hover:bg-white/20">
                  <Phone className="h-6 w-6" />
                </Button>
                <Button
                  className="h-16 w-16 rounded-full border-none bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:bg-rose-600"
                  onClick={() => setIsCalling(false)}
                >
                  <Phone className="h-6 w-6 rotate-[135deg]" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
