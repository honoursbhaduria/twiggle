// Dashboard.jsx
import React, { useState } from "react";
import {
  Brain,
  CalendarCheck,
  CalendarRange,
  CheckCircle2,
  ClipboardList,
  Clock,
  Compass,
  Flame,
  Globe2,
  MapPin,
  MessageCircle,
  NotebookPen,
  Plane,
  ScrollText,
  Send,
  Sparkles,
  Heart,
  Ticket,
  Users,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";
import SidebarDemo from "../destination/sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";

/**
 * India-focused travel dashboard
 * - Cleaned layout (removed personal greeting)
 * - Relevant India data (cities, trains, budgets, experiences)
 * - Same color theme (#fe6d3c)
 */

const quickMetrics = [
  {
    title: "Active itineraries",
    value: "3",
    delta: "2 updated this week",
    icon: CalendarRange,
  },
  {
    title: "Cities in India",
    value: "12",
    delta: "New: Varanasi added",
    icon: MapPin,
  },
  {
    title: "Group members",
    value: "4",
    delta: "2 confirmed",
    icon: Users,
  },
  {
    title: "Wallet synced",
    value: "₹42,800",
    delta: "Within budget",
    icon: Wallet,
  },
];

const journeyTimeline = [
  { month: "Jan", percent: 30 },
  { month: "Mar", percent: 55 },
  { month: "May", percent: 70 },
  { month: "Jul", percent: 90 },
  { month: "Sep", percent: 60 },
  { month: "Nov", percent: 80 },
];

const taskChecklist = [
  { title: "Confirm train tickets", detail: "IRCTC PNR pending", done: false },
  { title: "Book homestay in Varanasi", detail: "Host verification pending", done: false },
  { title: "Upload ID copies", detail: "Needed for train bookings", done: true },
  { title: "Finalize local guide", detail: "Rs. 1,200/day quoted", done: false },
];

const experienceHighlights = [
  {
    title: "Street food trail",
    note: "Delhi • Old Ravi • Paranthe Wali Gali",
    icon: Sparkles,
  },
  {
    title: "Heritage walk",
    note: "Jaipur old city & bazaars",
    icon: Compass,
  },
  {
    title: "Ghat sunrise",
    note: "Varanasi boat + puja plan",
    icon: Flame,
  },
];

const aiStarterPrompts = [
  "Plan a 4-day Rajasthan loop on a ₹20k budget",
  "Cheap train + homestay combo for Varanasi trip",
  "Weekend getaway from Delhi with food focus",
];

const insightCards = [
  {
    title: "Experiences planned",
    value: "12 items",
    delta: "+3 vs last month",
    icon: Compass,
  },
  {
    title: "Train segments",
    value: "4 booked",
    delta: "AC sleeper & chair car mix",
    icon: Plane,
  },
  {
    title: "Local hosts",
    value: "3 connected",
    delta: "IDs verified",
    icon: Globe2,
  },
];

const quickActions = [
  { label: "Download trip pack", icon: ClipboardList },
  { label: "Share guest pass", icon: Ticket },
  { label: "Add travel notes", icon: Sparkles },
];

const toolkitBlocks = [
  {
    title: "Day templates",
    description: "Market crawl • Temple morning • Evening ghat",
    icon: NotebookPen,
  },
  {
    title: "Logistics checklist",
    description: "Train PNR • ID upload • Luggage drop",
    icon: CalendarCheck,
  },
  {
    title: "Story prompts",
    description: "Capture bazaar portraits, food notes, Geo tags",
    icon: ScrollText,
  },
];

const fieldNotes = [
  "Upload Aadhaar copy for train booking",
  "Confirm cab from station to homestay",
  "Ask host for local SIM top-up options",
];

const recentBookings = [
  {
    type: "Train tickets",
    title: "Varanasi Express",
    details: "Coach S3 • Seat 45A",
    date: "Dec 2, 2025",
    icon: Plane,
    color: "bg-blue-100 text-blue-600"
  },
  {
    type: "Hotel bookings",
    title: "Dashaswamedh Guest House",
    details: "Deluxe Room • River View",
    date: "Dec 2-7, 2025",
    icon: MapPin,
    color: "bg-green-100 text-green-600"
  },
  {
    type: "Cab bookings",
    title: "Station to Hotel",
    details: "Sedan • Scheduled at 6:00 AM",
    date: "Dec 2, 2025",
    icon: Ticket,
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    type: "Guides booked",
    title: "Local Heritage Guide",
    details: "5-hour Ghat Tour",
    date: "Dec 3, 2025",
    icon: Users,
    color: "bg-purple-100 text-purple-600"
  }
];

const likedItineraries = [
  {
    title: "Golden Triangle (Delhi–Agra–Jaipur)",
    duration: "5 day loop",
    updated: "Saved 3 days ago",
    focus: "Taj • Amber Fort • Local food",
  },
  {
    title: "Varanasi break",
    duration: "2 day retreat",
    updated: "Saved last week",
    focus: "Ghat sunrise • Boat ride • Street eats",
  },
  {
    title: "Goa coastal unwind",
    duration: "4 day chill",
    updated: "Refreshed this morning",
    focus: "Beaches • Cafes • Night market",
  },
];

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 11, 2)); // Dec 2, 2025
  
  const completedTasks = taskChecklist.filter((item) => item.done).length;
  const completionPercent = Math.round(
    (completedTasks / taskChecklist.length) * 100
  );

  const navigate = useNavigate();

  // Calendar logic
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <SidebarDemo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* =========================================================
            TOP SECTION — HERO + CALENDAR
        ========================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* LEFT SIDE — HERO + INFO */}
          <div className="lg:col-span-8 bg-white rounded-3xl border shadow-sm overflow-hidden">

            {/* HERO */}
            <div 
              className="relative h-64 bg-cover bg-center px-6 flex flex-col justify-between items-start overflow-hidden"
              style={{
                backgroundImage: `url('https://media.istockphoto.com/id/1357609436/photo/ancient-varanasi-city-architecture-at-sunset.webp?a=1&b=1&s=612x612&w=0&k=20&c=Ww4wWi9Wzsp8TMXwcv5FZfxQmBQeP5Vz2oHHeWWGi0Y=')`,
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Hero Text */}
              <div className="relative z-10 pt-4">
                <p className="text-sm text-white/90 font-semibold">Nearest trip</p>
                <h1 className="text-5xl font-bold mt-2 text-white">Varanasi</h1>
                <p className="text-base text-white/95 mt-3">Spiritual journey • Ghat visits • Local food</p>
              </div>
            </div>

            {/* SAVED ITINERARIES */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500 font-semibold">Your itineraries</p>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">Explore India Trips</h3>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {likedItineraries.map((it) => {
                  // Map titles to background images
                  const imageMap = {
                    "Golden Triangle (Delhi–Agra–Jaipur)": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80",
                    "Varanasi break": "https://media.istockphoto.com/id/1752927355/photo/colourful-scene-showing-boats-on-the-sacred-ganges-river-at-dashashwamedh-ghat-in-varanasi.webp?a=1&b=1&s=612x612&w=0&k=20&c=ToXa4gyKDSoGXIEsydLxVKdKGQdJLf2guAjUIA21Eeg=",
                    "Goa coastal unwind": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"
                  };
                  
                  return (
                    <div 
                      key={it.title} 
                      className="group relative overflow-hidden rounded-3xl h-48 bg-cover bg-center transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
                      style={{
                        backgroundImage: `url('${imageMap[it.title] || "https://images.unsplash.com/photo-1552520206-7eae00fb6801?w=600&q=80"}')`,
                      }}
                    >
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      {/* Content */}
                      <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        {/* Heart Icon */}
                        <div className="flex justify-end">
                          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition">
                            <Heart className="h-5 w-5 text-white fill-white" />
                          </button>
                        </div>

                        {/* Text Content */}
                        <div>
                          <h4 className="text-lg font-bold text-white leading-tight">{it.title}</h4>
                          <p className="text-sm text-white/90 mt-2">{it.duration}</p>
                          <p className="text-sm text-[#fea561] font-semibold mt-2">✨ {it.focus}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — CALENDAR */}
          <div className="lg:col-span-4 bg-white rounded-3xl border shadow-sm p-5">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Trip Calendar</h2>
              <Button className="rounded-full bg-[#fe6d3c] text-white px-4 h-8 hover:bg-[#e86a28] font-semibold">
                Add event
              </Button>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={handlePrevMonth} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <ChevronLeft className="h-5 w-5 text-slate-600" />
              </button>
              <h3 className="text-base font-semibold text-slate-900">{monthName}</h3>
              <button onClick={handleNextMonth} className="p-1 hover:bg-slate-100 rounded-lg transition">
                <ChevronRight className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="h-8"></div>;
                }

                const isSelected =
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === currentMonth.getMonth() &&
                  selectedDate.getFullYear() === currentMonth.getFullYear();

                const isTrip =
                  currentMonth.getMonth() === 11 && // December
                  currentMonth.getFullYear() === 2025 &&
                  day >= 2 &&
                  day <= 7;

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-[#fe6d3c] text-white shadow-md"
                        : isTrip
                        ? "bg-[#fe6d3c]/20 text-[#fe6d3c] border border-[#fe6d3c]/40 hover:bg-[#fe6d3c]/30"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Selected Date Info */}
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">Selected Date</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {selectedDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
              {selectedDate >= new Date(2025, 11, 2) && selectedDate <= new Date(2025, 11, 7) && (
                <p className="text-xs text-[#fe6d3c] mt-1 font-semibold">✓ During Varanasi trip</p>
              )}
            </div>
          </div>
        </div>

        {/* Lower block: Progress + Toolkit */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-5 grid gap-4 lg:grid-cols-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-3xl border border-slate-200 bg-white p-4 lg:col-span-8 shadow-sm"
          >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Build progress</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Itinerary timeline</h2>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">{completedTasks} of {taskChecklist.length} tasks complete</p>
                <div className="mt-1.5 h-2 w-40 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#fe6d3c]" style={{ width: `${completionPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-slate-200 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Journey cadence</p>
                <div className="mt-3 flex items-end gap-3">
                  {journeyTimeline.map((entry) => (
                    <div key={entry.month} className="flex flex-1 flex-col items-center gap-2">
                      <div className="flex h-24 w-10 items-end rounded-full bg-slate-100">
                        <div
                          className="w-full rounded-full bg-[#fe6d3c]"
                          style={{ height: `${entry.percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500">{entry.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Checklist</p>
                <div className="mt-2 space-y-2">
                  {taskChecklist.map((task) => (
                    <div key={task.title} className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 h-5 w-5 rounded-full border ${task.done ? "border-[#fe6d3c] bg-[#fe6d3c]" : "border-slate-300"}`}
                        aria-hidden="true"
                      >
                        {task.done && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Experience focus</p>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {experienceHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-[#fe6d3c]/30 bg-[#fe6d3c]/10 p-3">
                    <item.icon className="h-5 w-5 text-[#fe6d3c]" />
                    <h3 className="mt-2 text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-600">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.35 }}
            className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4 lg:col-span-4 shadow-sm"
          >
            <div className="rounded-2xl border border-dashed border-[#fe6d3c]/30 bg-[#fe6d3c]/10 p-4">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-[#fe6d3c]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Recent bookings</p>
                  <h4 className="text-base font-semibold text-slate-900">Your travel confirmations</h4>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {recentBookings.map((booking) => (
                  <div key={booking.type} className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${booking.color}`}>
                        <booking.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.15em] text-slate-500 font-semibold">{booking.type}</p>
                        <p className="text-sm font-semibold text-slate-900 mt-0.5">{booking.title}</p>
                        <p className="text-xs text-slate-600 mt-1">{booking.details}</p>
                        <p className="text-xs text-[#fe6d3c] font-semibold mt-1">📅 {booking.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
