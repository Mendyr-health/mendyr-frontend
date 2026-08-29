"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, Search, CheckSquare, MessageSquare, Clock, Menu, Activity, Calendar, Settings, LogOut, Stethoscope,
  MapPin, DollarSign, Power, X, Navigation, Phone, Send, BarChart3, CreditCard, User, ShieldCheck, Check, KeySquare, CheckCircle2, MoreHorizontal, ChevronDown, ChevronUp, Video, Paperclip
} from "lucide-react";
import { Button } from "@mendyr/shared-ui/src/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@mendyr/shared-ui/src/ui/card";

const SIDEBAR_ITEMS = [
  { icon: Activity, label: "Dashboard", id: "dashboard" },
  { icon: DollarSign, label: "Earnings", id: "earnings" },
  { icon: Calendar, label: "Schedule", id: "schedule" },
  { icon: MessageSquare, label: "Messages", id: "messages" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const METRICS = [
  { title: "Today's Earnings", value: "$240.00", change: "+$45 from yesterday", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-100" },
  { title: "Acceptance Rate", value: "94%", change: "+2% this week", icon: Activity, color: "text-blue-500", bg: "bg-blue-100" },
  { title: "Online Time", value: "4h 30m", change: "Target: 8h", icon: Clock, color: "text-purple-500", bg: "bg-purple-100" },
  { title: "Completed Visits", value: "6", change: "2 remaining", icon: CheckSquare, color: "text-orange-500", bg: "bg-orange-100" },
];

const INITIAL_REQUESTS = [
  { 
    id: 101, 
    name: "Eleanor Pena", 
    age: 68, 
    condition: "Post-op Wound Care", 
    distance: "4.2 miles", 
    time: "12 mins away", 
    pay: "$45.00", 
    window: "Today, 2:00 PM - 3:00 PM",
    address: "123 Main St, Springfield", 
    details: "Patient requires daily dressing changes for a surgical wound on the lower abdomen. Must check for signs of infection and monitor vitals. Requires a sterile environment.", 
    requirements: ["Sterile Gloves", "Wound Cleanser", "Gauze Pads"]
  },
  { 
    id: 102, 
    name: "Wade Warren", 
    age: 45, 
    condition: "IV Antibiotics", 
    distance: "2.1 miles", 
    time: "8 mins away", 
    pay: "$30.00", 
    window: "Today, 3:30 PM - 4:00 PM",
    address: "456 Elm St, Springfield", 
    details: "Patient needs assistance with IV antibiotic administration for a respiratory infection. Verify PICC line is clear and flush before/after administration.", 
    requirements: ["Saline Flushes", "IV Medication", "Alcohol Wipes"]
  },
];

const INITIAL_UPCOMING_VISITS = [
  { id: 201, name: "Jacob Jones", address: "123 Main St, Apt 4B", time: "01:00 PM", type: "Vitals Check", condition: "Routine Checkup", distance: "2.5 miles", pay: "$25.00" },
];

const EARNINGS_HISTORY = [
  { 
    id: 1, date: "Today", amount: "$240.00", trips: 4, status: "Pending", gross: "$300.00", platformFee: "-$45.00", tax: "-$15.00",
    visits: [
      { type: "Post-op Wound Care", patient: "Eleanor Pena", time: "10:00 AM", earned: "$60.00" },
      { type: "IV Antibiotics", patient: "Wade Warren", time: "1:30 PM", earned: "$60.00" },
      { type: "Vitals Check", patient: "Jacob Jones", time: "3:00 PM", earned: "$60.00" },
      { type: "Physical Therapy", patient: "Albert Flores", time: "4:15 PM", earned: "$60.00" }
    ]
  },
  { 
    id: 2, date: "Yesterday", amount: "$180.00", trips: 3, status: "Processed", gross: "$225.00", platformFee: "-$33.75", tax: "-$11.25",
    visits: [
      { type: "Routine Checkup", patient: "Esther Howard", time: "9:00 AM", earned: "$60.00" },
      { type: "Wound Care", patient: "Guy Hawkins", time: "11:30 AM", earned: "$60.00" },
      { type: "Medication Admin", patient: "Ralph Edwards", time: "2:00 PM", earned: "$60.00" }
    ]
  },
  { 
    id: 3, date: "Mon, Aug 21", amount: "$320.00", trips: 6, status: "Processed", gross: "$400.00", platformFee: "-$60.00", tax: "-$20.00",
    visits: [
      { type: "Full Day Care Route", patient: "Multiple Patients", time: "8:00 AM - 5:00 PM", earned: "$320.00" }
    ]
  },
  { 
    id: 4, date: "Sun, Aug 20", amount: "$0.00", trips: 0, status: "Processed", gross: "$0.00", platformFee: "$0.00", tax: "$0.00",
    visits: []
  },
];

const INITIAL_MESSAGES_DATA = [
  { 
    id: 1, sender: "Eleanor Pena", preview: "I'll leave the front door unlocked.", time: "10:30 AM", unread: 2,
    history: [
      { sender: "nurse", text: "Hi Eleanor, I'll be arriving around 2:00 PM for your wound care.", time: "09:00 AM" },
      { sender: "patient", text: "Sounds good! I'll leave the front door unlocked.", time: "10:30 AM" }
    ]
  },
  { 
    id: 2, sender: "Dr. Smith (Coord)", preview: "Can you take an extra visit today?", time: "09:15 AM", unread: 0,
    history: [
      { sender: "patient", text: "Hi! Can you take an extra visit today in Springfield?", time: "09:15 AM" }
    ]
  },
  { 
    id: 3, sender: "Wade Warren", preview: "Thank you for the care yesterday!", time: "Yesterday", unread: 0,
    history: [
      { sender: "patient", text: "Thank you for the care yesterday! Feeling much better.", time: "04:30 PM" }
    ]
  },
];

const INITIAL_WEEK_DAYS = [
  { day: "Mon", date: "21", visits: [{ id: "cal_1", time: "09:00 AM", type: "Physical Therapy", patient: "Albert Flores", address: "321 Oak St, Springfield", requirements: ["Resistance Bands", "Gait Belt"], color: "bg-blue-100 text-blue-700 border-blue-200" }] },
  { day: "Tue", date: "22", visits: [] },
  { day: "Wed", date: "23", visits: [
    { id: "cal_2", time: "10:00 AM", type: "Vitals Check", patient: "Jacob Jones", address: "123 Main St, Apt 4B", requirements: ["Stethoscope", "BP Cuff"], color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { id: "cal_3", time: "02:00 PM", type: "Wound Care", patient: "Eleanor Pena", address: "456 Elm St, Springfield", requirements: ["Sterile Gloves", "Gauze", "Cleanser"], color: "bg-rose-100 text-rose-700 border-rose-200" }
  ]},
  { day: "Thu", date: "24", visits: [{ id: "cal_4", time: "11:30 AM", type: "IV Antibiotics", patient: "Wade Warren", address: "789 Pine St, Springfield", requirements: ["IV Medication", "Saline Flushes"], color: "bg-purple-100 text-purple-700 border-purple-200" }] },
  { day: "Fri", date: "25", visits: [{ id: "cal_5", time: "01:00 PM", type: "Routine Checkup", patient: "Esther Howard", address: "555 Cedar Ln, Springfield", requirements: ["Thermometer", "Oximeter"], color: "bg-orange-100 text-orange-700 border-orange-200" }] },
  { day: "Sat", date: "26", visits: [] },
  { day: "Sun", date: "27", visits: [] },
];

const INITIAL_MOCK_VISITS_BY_DATE: Record<string, any[]> = {
  "2": [{ id: "cal_8", time: "08:00 AM", type: "Vitals Check", patient: "Brooklyn Simmons", address: "12 Maple St", requirements: [], color: "bg-blue-100 text-blue-700 border-blue-200" }],
  "5": [
    { id: "cal_6", time: "10:00 AM", type: "Vitals Check", patient: "Ronald Richards", address: "987 Walnut Dr", requirements: ["BP Cuff", "Thermometer"], color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { id: "cal_9", time: "02:00 PM", type: "Physical Therapy", patient: "Darrell Steward", address: "54 Pine Rd", requirements: ["Gait Belt"], color: "bg-rose-100 text-rose-700 border-rose-200" }
  ],
  "8": [{ id: "cal_10", time: "11:00 AM", type: "Wound Care", patient: "Courtney Henry", address: "88 Oak Ave", requirements: ["Dressing Kit"], color: "bg-purple-100 text-purple-700 border-purple-200" }],
  "14": [
    { id: "cal_7", time: "09:00 AM", type: "Wound Care", patient: "Arlene McCoy", address: "654 Birch Ct", requirements: ["Wound Dressing Kit"], color: "bg-rose-100 text-rose-700 border-rose-200" },
    { id: "cal_11", time: "12:00 PM", type: "IV Antibiotics", patient: "Cody Fisher", address: "123 Elm St", requirements: ["IV Kit"], color: "bg-orange-100 text-orange-700 border-orange-200" },
    { id: "cal_12", time: "03:00 PM", type: "Vitals Check", patient: "Kristin Watson", address: "44 Cedar Ln", requirements: ["Thermometer"], color: "bg-emerald-100 text-emerald-700 border-emerald-200" }
  ],
  "17": [{ id: "cal_13", time: "10:30 AM", type: "Physical Therapy", patient: "Jerome Bell", address: "77 Spruce St", requirements: ["Resistance Bands"], color: "bg-blue-100 text-blue-700 border-blue-200" }],
  "28": [
    { id: "cal_14", time: "09:00 AM", type: "Routine Checkup", patient: "Kathryn Murphy", address: "90 Fir Dr", requirements: [], color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { id: "cal_15", time: "01:00 PM", type: "Wound Care", patient: "Savannah Nguyen", address: "11 Ash St", requirements: ["Cleanser", "Gauze"], color: "bg-rose-100 text-rose-700 border-rose-200" }
  ]
};

export default function NurseDashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isOnline, setIsOnline] = useState(true);
  const [calendarView, setCalendarView] = useState<"week" | "month">("week");
  
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeVisits, setActiveVisits] = useState<any[]>(INITIAL_UPCOMING_VISITS);
  
  // Modals & Overlays
  const [selectedRequest, setSelectedRequest] = useState<typeof INITIAL_REQUESTS[0] | null>(null);
  const [expandedPayoutId, setExpandedPayoutId] = useState<number | null>(null);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [cancelVisitId, setCancelVisitId] = useState<number | string | null>(null);
  const [showOtherReason, setShowOtherReason] = useState(false);
  const [otherReasonText, setOtherReasonText] = useState("");
  const [executionVisit, setExecutionVisit] = useState<any | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [calendarWeekDays, setCalendarWeekDays] = useState(INITIAL_WEEK_DAYS);
  const [calendarMonthVisits, setCalendarMonthVisits] = useState(INITIAL_MOCK_VISITS_BY_DATE);
  const [executionState, setExecutionState] = useState<"en_route" | "arrived" | "in_progress">("en_route");
  const [otp, setOtp] = useState(["", "", "", ""]);
  
  // Chat state
  const [messagesData, setMessagesData] = useState(INITIAL_MESSAGES_DATA);
  const [chatInput, setChatInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video">("audio");

  const handleSendMessage = () => {
    if (!chatInput.trim() || activeChatId === null) return;
    
    setMessagesData(prev => prev.map(msg => {
      if (msg.id === activeChatId) {
        return {
          ...msg,
          history: [...msg.history, { sender: "nurse", text: chatInput.trim(), time: "Just now" }],
          preview: chatInput.trim()
        };
      }
      return msg;
    }));
    setChatInput("");
  };

  const handleAccept = (req: any) => {
    setRequests(requests.filter(r => r.id !== req.id));
    setActiveVisits([...activeVisits, { ...req, type: req.condition }]);
    setSelectedRequest(null);
  };

  const handleDecline = (id: number) => {
    setRequests(requests.filter(r => r.id !== id));
    setSelectedRequest(null);
  };

  const rollbackVisit = (id: number | string) => {
    setActiveVisits(activeVisits.filter(v => v.id !== id));
    setCalendarWeekDays(prev => prev.map(dayObj => ({
      ...dayObj,
      visits: dayObj.visits.filter(v => v.id !== id)
    })));
    setCalendarMonthVisits(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(date => {
        next[date] = next[date].filter(v => v.id !== id);
      });
      return next;
    });
    setCancelVisitId(null);
    setShowOtherReason(false);
    setOtherReasonText("");
  };

  const startVisit = (visit: any) => {
    setExecutionVisit(visit);
    setExecutionState("en_route");
    setOtp(["", "", "", ""]);
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
    if (otp.join("") === "1234") { 
      setExecutionState("in_progress");
    } else {
      alert("Invalid OTP. Try 1234");
    }
  };

  const completeVisit = () => {
    setActiveVisits(activeVisits.filter(v => v.id !== executionVisit.id));
    setExecutionVisit(null);
  };

  const renderDashboard = () => (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground font-outfit">
            {isOnline ? "You are Online" : "You are Offline"}
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            {isOnline ? (
              <><span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span> Searching for nearby care requests...</>
            ) : (
              <><Power className="w-4 h-4 text-rose-500" /> Go online to receive care requests.</>
            )}
          </p>
        </div>
        {isOnline && <h2 className="text-2xl font-bold font-outfit text-primary">{requests.length} New Requests</h2>}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {METRICS.map((metric, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.1 }}>
            <Card className="bg-card border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                    <h3 className="text-3xl font-bold mt-2 font-outfit">{metric.value}</h3>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">{metric.change}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${metric.bg}`}>
                    <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit">Incoming Requests</h2>
            <Button variant="link" className="text-primary hover:text-primary-dark">View Map <Navigation className="w-4 h-4 ml-1" /></Button>
          </div>
          <div className="space-y-4">
            <AnimatePresence>
              {requests.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-card rounded-2xl border border-border p-12 text-center shadow-sm">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4"><Activity className="w-8 h-8 text-muted-foreground" /></div>
                  <h3 className="text-lg font-bold">No new requests</h3>
                  <p className="text-muted-foreground mt-2">You will be notified when a patient requests care in your area.</p>
                </motion.div>
              ) : (
                requests.map((req) => (
                  <motion.div key={req.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95, x: -20 }} className="bg-card rounded-2xl border-2 border-primary/20 p-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10"></div>
                    <div className="flex flex-col sm:flex-row justify-between gap-6">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">{req.name.charAt(0)}</div>
                          <div><h3 className="text-xl font-bold text-foreground">{req.condition}</h3><p className="text-muted-foreground font-medium">{req.name}, {req.age} yrs</p></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-muted-foreground" /><div><p className="text-sm font-semibold">{req.distance}</p><p className="text-xs text-muted-foreground">{req.time}</p></div></div>
                          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" /><div><p className="text-sm font-semibold">Time Window</p><p className="text-xs text-muted-foreground">{req.window}</p></div></div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-4 min-w-[140px] border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
                        <div className="text-right"><p className="text-sm text-muted-foreground font-medium">Est. Payout</p><p className="text-3xl font-bold text-emerald-600 font-outfit">{req.pay}</p></div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <Button variant="outline" className="flex-1 border-primary/20 text-primary hover:bg-primary/5 h-11" onClick={() => setSelectedRequest(req)}>Details</Button>
                          <Button className="flex-1 bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/20 h-11" onClick={() => handleAccept(req)}>Accept</Button>
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
        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit">Active & Upcoming Visits</h2>
            <Button variant="ghost" size="icon"><div className="w-1 h-1 bg-muted-foreground rounded-full shadow-[0_4px_0_0_currentColor,0_-4px_0_0_currentColor]"></div></Button>
          </div>
          <Card className="bg-card border-none shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {activeVisits.length === 0 && <div className="p-6 text-center text-muted-foreground">No upcoming visits</div>}
                {activeVisits.map((visit) => (
                  <div key={visit.id} className="p-5 hover:bg-muted/30 transition-colors group cursor-pointer border-l-4 border-primary bg-primary/5 relative">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-foreground leading-tight">{visit.type}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">{visit.time || visit.window}</span>
                        {/* Cancel Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCancelVisitId(visit.id); }} 
                          className="text-rose-500 hover:bg-rose-100 hover:text-rose-700 rounded-md transition-colors p-1"
                          title="Cancel Request"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium">{visit.name}</p>
                    <div className="flex items-start gap-1 mt-2 text-xs text-muted-foreground"><MapPin className="w-3.5 h-3.5 mt-0.5" /> <span>{visit.address}</span></div>
                    <Button onClick={() => startVisit(visit)} className="w-full mt-4 text-sm h-10 shadow-md shadow-primary/20 hover:scale-105 transition-transform"><Navigation className="w-4 h-4 mr-2" /> Start Visit / Navigate</Button>
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold font-outfit">Earnings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-white border-none shadow-lg shadow-primary/20 md:col-span-2">
          <CardContent className="p-8">
            <p className="text-primary-foreground/80 font-medium">Balance Available</p>
            <h2 className="text-6xl font-bold mt-2 font-outfit">$845.50</h2>
          </CardContent>
        </Card>
        <Card className="bg-card border-none shadow-sm">
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><BarChart3 className="w-6 h-6" /></div>
              <div><p className="text-muted-foreground text-sm">Weekly Goal</p><p className="font-bold text-xl">$1000</p></div>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-2"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: '84%' }}></div></div>
            <p className="text-xs text-muted-foreground text-right">84% completed</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3 className="text-xl font-bold font-outfit mb-4">Recent Payouts</h3>
        <Card className="bg-card border-none shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {EARNINGS_HISTORY.map((hist) => {
                const isExpanded = expandedPayoutId === hist.id;
                return (
                  <div key={hist.id} className="transition-colors hover:bg-muted/30">
                    <div 
                      className="p-6 flex justify-between items-center cursor-pointer"
                      onClick={() => setExpandedPayoutId(isExpanded ? null : hist.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{hist.date}</h4>
                          <p className="text-muted-foreground text-sm">{hist.trips} completed visits</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-foreground">{hist.amount}</p>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-md ${hist.status === 'Processed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {hist.status}
                        </span>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 border-t border-border mx-6 flex flex-col gap-3 text-sm">
                            
                            {/* Daily Visits Breakdown */}
                            {hist.visits.length > 0 && (
                              <div className="mt-4 mb-2 space-y-3">
                                <h5 className="font-bold text-foreground text-xs uppercase tracking-wider mb-2">Visits Completed ({hist.visits.length})</h5>
                                <div className="space-y-2">
                                  {hist.visits.map((visit: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center bg-muted/50 p-2 rounded-lg">
                                      <div>
                                        <p className="font-semibold text-foreground">{visit.type}</p>
                                        <p className="text-xs text-muted-foreground">{visit.patient} • {visit.time}</p>
                                      </div>
                                      <span className="font-semibold text-emerald-600">{visit.earned}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <h5 className="font-bold text-foreground text-xs uppercase tracking-wider mt-4 mb-1">Financial Breakdown</h5>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gross Earnings</span>
                              <span className="font-semibold">{hist.gross}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Platform Fee (15%)</span>
                              <span className="font-semibold text-rose-500">{hist.platformFee}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Estimated Taxes (5%)</span>
                              <span className="font-semibold text-rose-500">{hist.tax}</span>
                            </div>
                            <div className="h-px bg-border w-full my-1"></div>
                            <div className="flex justify-between items-center">
                              <span className="font-bold">Net Payout</span>
                              <span className="font-bold text-emerald-600 text-lg">{hist.amount}</span>
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
    Object.keys(calendarMonthVisits).forEach(k => {
      monthVisits[k] = calendarMonthVisits[k].length;
    });
    calendarWeekDays.forEach(d => {
      if (d.visits.length > 0) {
        monthVisits[d.date] = (monthVisits[d.date] || 0) + d.visits.length;
      }
    });

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-outfit">My Schedule</h1>
            <p className="text-muted-foreground mt-1">August 2026</p>
          </div>
          <div className="flex bg-muted rounded-xl p-1 border border-border">
            <button 
              onClick={() => setCalendarView("week")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${calendarView === "week" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Week
            </button>
            <button 
              onClick={() => setCalendarView("month")}
              className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${calendarView === "month" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Month
            </button>
          </div>
        </div>
        
        <Card className="bg-card border-none shadow-sm overflow-hidden min-h-[600px]">
           <CardContent className="p-0 h-full">
             {calendarView === "week" ? (
               <div className="flex flex-col md:flex-row min-h-[600px] h-full divide-y md:divide-y-0 md:divide-x divide-border">
                 {calendarWeekDays.map((dayObj, i) => (
                   <div key={i} className="flex-1 min-w-[140px] flex flex-col h-full bg-background">
                     <div className={`p-4 text-center border-b border-border ${dayObj.date === "23" ? "bg-primary/5 border-b-primary/30" : "bg-muted/30"}`}>
                       <p className={`text-sm font-bold uppercase tracking-wider ${dayObj.date === "23" ? "text-primary" : "text-muted-foreground"}`}>{dayObj.day}</p>
                       <p className={`text-3xl font-outfit font-bold mt-1 ${dayObj.date === "23" ? "text-primary" : "text-foreground"}`}>{dayObj.date}</p>
                     </div>
                     <div 
                       className={`flex-1 p-3 space-y-3 min-h-[120px] md:min-h-[500px] ${dayObj.date === "23" ? "bg-primary/5" : ""} cursor-pointer hover:bg-muted/50 transition-colors`}
                       onClick={() => setSelectedCalendarDate(dayObj.date)}
                     >
                       {dayObj.visits.length === 0 ? (
                         <div className="h-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity min-h-[80px]">
                           <span className="text-xs text-muted-foreground font-medium">+ Add Visit</span>
                         </div>
                       ) : (
                         dayObj.visits.map((visit, j) => (
                           <div key={j} className={`p-3 rounded-xl border-l-4 shadow-sm border ${visit.color} hover:scale-105 transition-transform bg-white`}>
                             <p className="text-xs font-bold mb-1 opacity-80">{visit.time}</p>
                             <p className="font-bold text-sm leading-tight mb-1">{visit.type}</p>
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
                 <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4 text-center">
                   {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                     <div key={d} className="font-bold text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{d}</div>
                   ))}
                 </div>
                 <div className="grid grid-cols-7 gap-2 md:gap-4">
                   {/* Empty days for August starting on Saturday */}
                   {Array.from({ length: 6 }).map((_, i) => <div key={`empty-${i}`} className="h-16 md:h-28 rounded-xl md:rounded-2xl bg-muted/20 border border-border/50 hidden md:block"></div>)}
                   
                   {MONTH_DAYS.map((day) => {
                     const visitCount = monthVisits[day.toString()] || 0;
                     const isToday = day === 23;
                     return (
                       <div 
                         key={day} 
                         onClick={() => setSelectedCalendarDate(day.toString())}
                         className={`h-16 md:h-28 rounded-xl md:rounded-2xl border ${isToday ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border bg-card hover:border-primary/50'} p-2 md:p-3 transition-colors cursor-pointer flex flex-col`}
                       >
                         <span className={`text-sm md:text-lg font-bold ${isToday ? 'text-primary' : 'text-foreground'}`}>{day}</span>
                         <div className="mt-auto space-y-1">
                           {visitCount > 0 && (
                             <div className="hidden md:block">
                               {Array.from({length: visitCount}).map((_, i) => (
                                 <div key={i} className="h-1.5 w-full bg-primary/60 rounded-full mb-1"></div>
                               ))}
                               <p className="text-[10px] font-bold text-muted-foreground mt-1 text-right">{visitCount} visits</p>
                             </div>
                           )}
                           {visitCount > 0 && (
                             <div className="md:hidden flex justify-center">
                               <div className="w-2 h-2 rounded-full bg-primary"></div>
                             </div>
                           )}
                         </div>
                       </div>
                     )
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
    const activeChat = messagesData.find(m => m.id === activeChatId);
    const filteredMessages = messagesData.filter(m => 
      m.sender.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-[calc(100vh-140px)] flex bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted border-none text-sm outline-none" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-border">
            {filteredMessages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No messages found.</div>
            ) : (
              filteredMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors relative ${activeChatId === msg.id ? 'bg-primary/5' : ''}`}
                onClick={() => setActiveChatId(msg.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`font-bold text-sm truncate pr-4 ${activeChatId === msg.id ? 'text-primary' : ''}`}>{msg.sender}</h4>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{msg.time}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{msg.preview}</p>
                {msg.unread > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{msg.unread}</span>
                )}
              </div>
            )))}
          </div>
        </div>
        
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-background relative">
            <div className="p-5 border-b border-border flex justify-between items-center bg-card z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {activeChat.sender.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{activeChat.sender}</h3>
                  <p className="text-xs text-emerald-600 font-medium">Online</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setIsCalling(true); setCallType("audio"); }}><Phone className="w-5 h-5 text-primary" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { setIsCalling(true); setCallType("video"); }}><Video className="w-5 h-5 text-primary" /></Button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              {activeChat.history.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'nurse' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl p-4 ${msg.sender === 'nurse' ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-sm' : 'bg-muted rounded-tl-sm text-foreground border border-border/50 shadow-sm'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] mt-2 font-medium ${msg.sender === 'nurse' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-card border-t border-border">
              <div className="flex items-end gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full text-muted-foreground flex-shrink-0 mb-1"
                  onClick={() => alert("File picker would open here")}
                >
                  <Paperclip className="w-5 h-5" />
                </Button>
                <textarea 
                  className="flex-1 min-h-[48px] max-h-32 bg-muted rounded-2xl border-none p-3 text-sm resize-none outline-none focus:ring-1 focus:ring-primary/30 transition-shadow"
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
                  className="rounded-full w-12 h-12 flex-shrink-0 bg-primary hover:bg-primary-dark shadow-md mb-0.5"
                  onClick={handleSendMessage}
                >
                  <Send className="w-5 h-5 text-white ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/10">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4"><MessageSquare className="w-10 h-10 text-muted-foreground" /></div>
            <h2 className="text-xl font-bold">Your Messages</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">Select a conversation from the list to start messaging with patients or coordinators.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderSettings = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold font-outfit">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-2">
          {["Account Profile", "Payment Methods", "Notifications", "Security", "Support"].map((item, i) => (
            <button key={i} className={`w-full text-left p-3 rounded-xl font-semibold transition-colors ${i === 0 ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
              {item}
            </button>
          ))}
        </div>
        
        <div className="flex-1 space-y-6">
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader className="border-b border-border bg-muted/30">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-muted overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=nurse1" alt="Profile" className="w-full h-full object-cover" />
                </div>
                <Button variant="outline">Change Photo</Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><label className="text-sm font-semibold text-muted-foreground">First Name</label><input type="text" defaultValue="Sarah" className="w-full p-3 rounded-xl bg-muted border-none outline-none" /></div>
                <div className="space-y-2"><label className="text-sm font-semibold text-muted-foreground">Last Name</label><input type="text" defaultValue="Jenkins" className="w-full p-3 rounded-xl bg-muted border-none outline-none" /></div>
                <div className="space-y-2 col-span-2"><label className="text-sm font-semibold text-muted-foreground">Email</label><input type="email" defaultValue="sarah.j@mendyr.com" className="w-full p-3 rounded-xl bg-muted border-none outline-none" /></div>
                <div className="space-y-2 col-span-2"><label className="text-sm font-semibold text-muted-foreground">Phone</label><input type="text" defaultValue="+1 (555) 123-4567" className="w-full p-3 rounded-xl bg-muted border-none outline-none" /></div>
              </div>
              <Button className="w-full mt-4">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 280 }}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="hidden md:flex flex-col bg-sidebar-glass text-sidebar-foreground border-r border-sidebar-border z-20 transition-all duration-300"
      >
        <div className="h-20 flex items-center justify-center border-b border-sidebar-border/50">
          <Stethoscope className="w-8 h-8 text-primary-light" />
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 text-xl font-bold tracking-wide font-outfit"
            >
              Mendyr <span className="text-primary-light font-light">Nurse</span>
            </motion.span>
          )}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          {SIDEBAR_ITEMS.map((item, idx) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary z-0"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 z-10 ${!isSidebarOpen && "mx-auto"}`} />
                {isSidebarOpen && (
                  <span className="ml-3 font-medium z-10">{item.label}</span>
                )}
              </button>
            )
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-glass border-b border-border flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center bg-muted/50 rounded-full p-1 border border-border">
              <button 
                onClick={() => setIsOnline(true)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${isOnline ? 'bg-white shadow-sm text-emerald-600' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Online
              </button>
              <button 
                onClick={() => setIsOnline(false)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${!isOnline ? 'bg-white shadow-sm text-rose-600' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Offline
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Sarah Jenkins</p>
                <p className="text-xs text-muted-foreground">Registered Nurse</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-full border-2 border-white bg-white overflow-hidden">
                  <img src="https://i.pravatar.cc/150?u=nurse1" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth bg-background-secondary relative">
           <AnimatePresence mode="wait">
             {activeTab === 'dashboard' && <motion.div key="dashboard" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{renderDashboard()}</motion.div>}
             {activeTab === 'earnings' && <motion.div key="earnings" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{renderEarnings()}</motion.div>}
             {activeTab === 'schedule' && <motion.div key="schedule" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{renderSchedule()}</motion.div>}
             {activeTab === 'messages' && <motion.div key="messages" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{renderMessages()}</motion.div>}
             {activeTab === 'settings' && <motion.div key="settings" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{renderSettings()}</motion.div>}
           </AnimatePresence>
        </div>
      </main>

      {/* --- OVERLAYS --- */}

      {/* MODAL: Calendar Day Visits */}
      <AnimatePresence>
        {selectedCalendarDate && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCalendarDate(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-background rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 bg-muted/50 border-b border-border flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold font-outfit text-foreground">August {selectedCalendarDate}, 2026</h3>
                  <p className="text-muted-foreground text-sm">Scheduled Visits</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedCalendarDate(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {(() => {
                  const visits = [
                    ...((calendarWeekDays.find(d => d.date === selectedCalendarDate)?.visits) || []),
                    ...(calendarMonthVisits[selectedCalendarDate] || [])
                  ].filter((v, i, a) => a.findIndex(t => t.patient === v.patient && t.time === v.time) === i); // Unique

                  if (visits.length === 0) return (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-semibold">No visits scheduled</p>
                      <p className="text-sm">You have the day off.</p>
                      <Button className="mt-4" variant="outline">+ Add Availability</Button>
                    </div>
                  );
                  
                  return visits.map((visit, j) => (
                    <div key={j} className={`p-5 rounded-xl border-l-4 shadow-sm border ${visit.color || 'bg-card border-primary text-foreground'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-bold text-lg leading-tight">{visit.type}</p>
                        <span className="text-xs font-bold px-2 py-1 bg-black/5 rounded-md">{visit.time}</span>
                      </div>
                      
                      <div className="space-y-2 mt-4 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 opacity-70 flex-shrink-0" />
                          <span>{visit.patient}</span>
                        </div>
                        {visit.address && (
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 opacity-70 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{visit.address}</span>
                          </div>
                        )}
                        {visit.requirements && (
                          <div className="flex items-start gap-2">
                            <CheckSquare className="w-4 h-4 opacity-70 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground text-xs leading-tight mt-0.5 font-normal bg-muted px-2 py-1 rounded-md">{visit.requirements.join(", ")}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3 mt-5 pt-4 border-t border-border/50">
                        <Button 
                          className="flex-1 h-9 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700" 
                          variant="outline"
                          onClick={() => { setCancelVisitId(visit.id); setSelectedCalendarDate(null); }}
                        >
                          Cancel Visit
                        </Button>
                        <Button className="flex-1 h-9 text-xs shadow-sm bg-primary text-white hover:bg-primary-dark">View Details</Button>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setCancelVisitId(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-background rounded-3xl shadow-2xl max-w-md w-full p-8"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold font-outfit mb-2 text-foreground">Cancel Visit</h3>
              <p className="text-muted-foreground mb-6 text-sm">Please select a reason for rolling back this request. Warning: Excessive cancellations may affect your acceptance rate.</p>
              
              <div className="space-y-3 mb-6">
                {!showOtherReason ? (
                  <>
                    {[
                      "Patient requested cancellation", 
                      "Vehicle or transport issue", 
                      "Personal emergency", 
                      "Distance is too far"
                    ].map((reason, i) => (
                      <button 
                        key={i} 
                        className="w-full text-left p-4 rounded-xl border border-border hover:border-rose-300 hover:bg-rose-50 text-foreground hover:text-rose-700 transition-colors font-medium text-sm"
                        onClick={() => rollbackVisit(cancelVisitId)}
                      >
                        {reason}
                      </button>
                    ))}
                    <button 
                      className="w-full text-left p-4 rounded-xl border border-border hover:border-rose-300 hover:bg-rose-50 text-foreground hover:text-rose-700 transition-colors font-medium text-sm"
                      onClick={() => setShowOtherReason(true)}
                    >
                      Other...
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <textarea 
                      placeholder="Please specify the reason..."
                      className="w-full p-4 rounded-xl border border-border bg-muted/50 focus:border-primary outline-none min-h-[100px] text-sm text-foreground"
                      value={otherReasonText}
                      onChange={(e) => setOtherReasonText(e.target.value)}
                    ></textarea>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setShowOtherReason(false)}>Back</Button>
                      <Button className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-12 shadow-md shadow-rose-500/20" onClick={() => {
                        if (otherReasonText.trim()) rollbackVisit(cancelVisitId);
                      }}>Submit</Button>
                    </div>
                  </div>
                )}
              </div>
              
              <Button variant="ghost" className="w-full h-12 rounded-xl text-muted-foreground hover:text-foreground" onClick={() => { setCancelVisitId(null); setShowOtherReason(false); setOtherReasonText(""); }}>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-background rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-primary to-primary-dark p-6 text-white relative">
                <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white/70 hover:bg-white/20 hover:text-white rounded-full" onClick={() => setSelectedRequest(null)}>
                  <X className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-2 border-white/40 shadow-inner">
                    {selectedRequest.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-outfit">{selectedRequest.condition}</h2>
                    <p className="text-white/80 font-medium">{selectedRequest.name}, {selectedRequest.age} yrs</p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-md">
                   <div>
                     <p className="text-white/70 text-sm font-medium">Est. Payout</p>
                     <p className="text-3xl font-bold">{selectedRequest.pay}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-white/70 text-sm font-medium">Distance</p>
                     <p className="text-2xl font-bold">{selectedRequest.distance}</p>
                   </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> Time & Location</h3>
                  <div className="bg-muted rounded-xl p-4 space-y-3 text-sm border border-border/50">
                    <div className="flex justify-between"><span className="text-muted-foreground font-medium">Time Window</span><span className="font-semibold">{selectedRequest.window}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground font-medium">Address</span><span className="font-semibold text-right max-w-[200px]">{selectedRequest.address}</span></div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border bg-muted/30 flex gap-4">
                <Button variant="outline" className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 h-14 text-lg font-bold rounded-xl" onClick={() => handleDecline(selectedRequest.id)}>Decline</Button>
                <Button className="flex-1 bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/30 h-14 text-lg font-bold rounded-xl" onClick={() => handleAccept(selectedRequest)}>Accept Request</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN OVERLAY: Active Execution Visit */}
      <AnimatePresence>
        {executionVisit && (
          <motion.div 
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
          >
            {/* Header */}
            <div className="bg-foreground text-background p-6 pt-10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold font-outfit">Active Visit</h2>
                <p className="text-muted/70">{executionVisit.name} • {executionVisit.type}</p>
              </div>
              <Button variant="ghost" size="icon" className="text-background hover:bg-white/20 rounded-full" onClick={() => setExecutionVisit(null)}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Map Placeholder for Navigation */}
            <div className="flex-1 bg-muted relative">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%239C92AC' fill-opacity='1'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                {executionState === "en_route" && (
                   <motion.div initial={{scale:0.8}} animate={{scale:1}} className="bg-white text-foreground px-6 py-3 rounded-full font-bold shadow-xl border-2 border-primary text-xl flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-primary" /> Heading to Destination
                   </motion.div>
                )}
                {executionState === "arrived" && (
                   <div className="w-24 h-24 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-rose-500/50"><MapPin className="w-10 h-10" /></div>
                )}
              </div>
            </div>

            {/* Bottom Sheet Controls */}
            <div className="bg-card shadow-[0_-20px_40px_rgba(0,0,0,0.1)] rounded-t-3xl -mt-6 relative z-10 p-8 flex flex-col">
              
              {executionState === "en_route" && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-lg mx-auto text-center space-y-6">
                  <h3 className="text-2xl font-bold font-outfit">En Route to {executionVisit.name}</h3>
                  <div className="flex items-center gap-4 bg-muted p-4 rounded-xl text-left">
                    <MapPin className="w-8 h-8 text-rose-500 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{executionVisit.address}</p>
                      <p className="text-muted-foreground text-sm">Est. arrival in 12 mins ({executionVisit.distance || "2.5 miles"})</p>
                    </div>
                  </div>
                  <Button className="w-full h-16 text-xl font-bold rounded-2xl bg-primary hover:bg-primary-dark shadow-xl shadow-primary/30" onClick={() => setExecutionState("arrived")}>
                    I have arrived
                  </Button>
                </motion.div>
              )}

              {executionState === "arrived" && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-lg mx-auto text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2"><KeySquare className="w-8 h-8" /></div>
                  <h3 className="text-2xl font-bold font-outfit">Verify Patient OTP</h3>
                  <p className="text-muted-foreground">Please ask {executionVisit.name} for their 4-digit Service OTP to begin care.</p>
                  
                  <div className="flex justify-center gap-4 my-8">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-16 h-20 text-center text-3xl font-bold rounded-2xl border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none transition-all"
                        placeholder="•"
                      />
                    ))}
                  </div>

                  <Button className="w-full h-16 text-xl font-bold rounded-2xl bg-primary hover:bg-primary-dark shadow-xl shadow-primary/30" onClick={verifyOtp}>
                    Verify & Start Service
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">For demo, use PIN: 1234</p>
                </motion.div>
              )}

              {executionState === "in_progress" && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} className="w-full max-w-lg mx-auto space-y-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold mb-4">
                      <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
                      Service In Progress
                    </div>
                    <h3 className="text-3xl font-bold font-outfit">00:15:42</h3>
                  </div>

                  <div className="bg-muted rounded-xl p-6 border border-border">
                    <h4 className="font-bold text-lg mb-4">Checklist & Notes</h4>
                    <div className="space-y-3">
                       <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" /> <span className="font-medium">Verify Vitals</span></label>
                       <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" /> <span className="font-medium">Administer Treatment</span></label>
                       <label className="flex items-center gap-3"><input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" /> <span className="font-medium">Update Electronic Health Record</span></label>
                    </div>
                  </div>

                  <Button className="w-full h-16 text-xl font-bold rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2" onClick={completeVisit}>
                    <CheckCircle2 className="w-6 h-6" /> Mark Service Complete
                  </Button>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCalling && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-ping"></div>
                {callType === 'video' ? <Video className="w-12 h-12" /> : <Phone className="w-12 h-12" />}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {messagesData.find(m => m.id === activeChatId)?.sender}
              </h2>
              <p className="text-white/60 mb-12">{callType === 'video' ? 'Video Calling...' : 'Calling...'}</p>
              
              <div className="flex gap-6">
                <Button className="rounded-full w-16 h-16 bg-white/10 hover:bg-white/20 text-white border-none">
                  <Phone className="w-6 h-6" />
                </Button>
                <Button 
                  className="rounded-full w-16 h-16 bg-rose-500 hover:bg-rose-600 text-white border-none shadow-lg shadow-rose-500/20"
                  onClick={() => setIsCalling(false)}
                >
                  <Phone className="w-6 h-6 rotate-[135deg]" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
