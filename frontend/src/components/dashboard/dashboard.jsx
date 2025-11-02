import React from "react";
import {
  CalendarRange,
  Compass,
  Flame,
  Heart,
  MapPin,
  Plane,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import SidebarDemo from "../destination/sidebar";
import { Button } from "../ui/button";

const stats = [
  {
    title: "Trips Planned",
    value: "12",
    delta: "+3 this month",
    icon: Plane,
    gradient: "from-sky-100 to-blue-50",
  },
  {
    title: "Travel Buddies",
    value: "5",
    delta: "2 new invites",
    icon: Users,
    gradient: "from-purple-100 to-pink-50",
  },
  {
    title: "Total Itineraries",
    value: "15",
    delta: "4 added this week",
    icon: Compass,
    gradient: "from-emerald-100 to-green-50",
  },
  {
    title: "Rewards Earned",
    value: "3,240",
    delta: "+18% vs last trip",
    icon: Wallet,
    gradient: "from-amber-100 to-yellow-50",
  },
];

const upcomingTrips = [
  {
    destination: "Bali Adventure Escape",
    dates: "12 - 19 Dec, 2025",
    status: "On Track",
    highlights: ["Private villa stay", "Scuba lessons", "Ubud cultural tour"],
    accent: "from-orange-500/20 to-yellow-500/10",
  },
  {
    destination: "Swiss Alps Retreat",
    dates: "03 - 10 Feb, 2026",
    status: "Planning",
    highlights: ["Glacier Express", "Lake Lucerne", "Ski lessons"],
    accent: "from-blue-500/20 to-indigo-500/10",
  },
];

const recommendations = [
  {
    title: "Popular in December",
    description: "Aurora escapes in Norway are trending 24% among explorers like you.",
    icon: Sparkles,
    badge: "Curated for You",
    gradient: "from-sky-100 to-blue-50",
  },
  {
    title: "Wishlist Momentum",
    description: "Add two more experiences to unlock the Winter Wanderer badge.",
    icon: Heart,
    badge: "One Step Away",
    gradient: "from-rose-100 to-pink-50",
  },
];

const insights = [
  {
    title: "Adventure Focus",
    detail: "68% of your 2025 trips lean towards curated adventure experiences.",
    icon: Flame,
  },
  {
    title: "Cultural Immersion",
    detail: "You’ve spent 42 hrs exploring local experiences this quarter.",
    icon: Compass,
  },
  {
    title: "Sustainability",
    detail: "Carbon offset for 4 journeys supported rainforest projects.",
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <SidebarDemo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-sky-50 to-blue-50 p-8 md:p-10 lg:col-span-7 text-slate-900"
          >
            <div className="absolute inset-x-10 -top-24 h-56 rounded-full bg-gradient-to-r from-sky-300/20 via-indigo-200/30 to-transparent blur-3xl" />
            <div className="relative flex flex-col gap-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-blue-500">Welcome back</p>
                  <h1 className="mt-2 text-3xl font-semibold sm:text-4xl font-poppins text-slate-900">Tejash, your next journey awaits</h1>
                  <p className="mt-4 max-w-xl text-sm text-slate-600 md:text-base">
                    Save time with curated itineraries, live travel insights, and personalised rewards. We’ve refreshed your dashboard with new seasonal picks just for you.
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="rounded-2xl bg-white px-6 py-4 shadow-lg"
                >
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Next Trip</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Tokyo Street Food Trail</h2>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                    <CalendarRange className="h-4 w-4" /> 21 - 27 Nov, 2025
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" /> Shibuya • Tsukiji Market • Kyoto day escape
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button className="rounded-full bg-slate-900 text-white hover:bg-slate-700">Plan a new experience</Button>
                <Button variant="outline" className="rounded-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100">
                  View saved itineraries
                </Button>
              </div>
            </div>
            
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Trip Progress</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Upcoming Journeys</h2>
              </div>
              <Button variant="ghost" className="rounded-full px-4 text-slate-600 hover:bg-slate-100">See all</Button>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip.destination}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05, duration: 0.4 }}
                  className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br ${trip.accent} p-5`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{trip.destination}</h3>
                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                        <CalendarRange className="h-4 w-4" /> {trip.dates}
                      </p>
                    </div>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs uppercase tracking-wide text-slate-700">
                      {trip.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    {trip.highlights.map((highlight) => (
                      <span key={highlight} className="rounded-full bg-white/70 px-3 py-1">
                        {highlight}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-md"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{item.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{item.value}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-emerald-600">
                    <TrendingUp className="h-4 w-4" /> {item.delta}
                  </p>
                </div>
                <item.icon className="h-10 w-10 text-slate-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-8 grid gap-6 lg:grid-cols-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="rounded-3xl bg-white p-6 shadow-lg lg:col-span-8"
          >
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Insights</p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-900">Travel Intelligence</h2>
              </div>
              <Button variant="outline" className="rounded-full border-slate-200 bg-white text-slate-900 hover:bg-slate-100">
                Export monthly report
              </Button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {insights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.05, duration: 0.3 }}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <item.icon className="h-8 w-8 text-sky-500" />
                  <h3 className="mt-4 text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.35 }}
            className="space-y-4 rounded-3xl bg-white p-6 shadow-lg lg:col-span-4"
          >
            {recommendations.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05, duration: 0.3 }}
                className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br ${card.gradient} p-5`}
              >
                <div className="relative flex flex-col gap-3">
                  <span className="w-max rounded-full bg-white/70 px-3 py-1 text-xs uppercase tracking-wide text-slate-700">{card.badge}</span>
                  <div className="flex items-center gap-3">
                    <card.icon className="h-8 w-8 text-slate-700" />
                    <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.description}</p>
                  <Button variant="ghost" className="w-max rounded-full px-0 text-sm text-slate-700 hover:bg-slate-100">
                    Discover more
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-lg"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Need a boost?</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Schedule a call with a travel guru to personalise your 2026 adventures.</h3>
          </div>
          <Button className="rounded-full bg-sky-500 px-6 text-white hover:bg-sky-400">Connect now</Button>
        </motion.div>
      </div>
    </div>
  );
}
