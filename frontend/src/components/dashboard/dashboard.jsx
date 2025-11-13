import React from "react";
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
} from "lucide-react";
import { motion } from "motion/react";
import SidebarDemo from "../destination/sidebar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const quickMetrics = [
  {
    title: "Active itineraries",
    value: "4",
    delta: "2 wrap this week",
    icon: CalendarRange,
  },
  {
    title: "Cities locked",
    value: "9",
    delta: "3 fresh for 2026",
    icon: MapPin,
  },
  {
    title: "Travel crew",
    value: "5 explorers",
    delta: "Sam shared notes",
    icon: Users,
  },
  {
    title: "Wallet synced",
    value: "$3.4k",
    delta: "Budget in range",
    icon: Wallet,
  },
];

const journeyTimeline = [
  { month: "Jan", percent: 45 },
  { month: "Mar", percent: 60 },
  { month: "May", percent: 75 },
  { month: "Jul", percent: 90 },
  { month: "Sep", percent: 55 },
  { month: "Nov", percent: 80 },
];

const taskChecklist = [
  { title: "Lock final flights", detail: "Hold expires in 2 days", done: true },
  { title: "Confirm Kyoto experiences", detail: "Awaiting vendor reply", done: false },
  { title: "Sync travel wallet", detail: "Add dining buffer for day 3", done: false },
  { title: "Share packing list", detail: "Send to crew", done: true },
];

const experienceHighlights = [
  {
    title: "Street food crawl",
    note: "8 tastings • curated by local host",
    icon: Sparkles,
  },
  {
    title: "Sunrise hike",
    note: "Mt. Takao trail with guide",
    icon: Flame,
  },
  {
    title: "Rail pass ready",
    note: "Unlimited JR lines for 7 days",
    icon: Ticket,
  },
];

const aiStarterPrompts = [
  "Spin up a 3-day foodie chase in Osaka with relaxed mornings",
  "Design a Kyoto culture crawl that ends with a tea ceremony",
  "Suggest a chill arrival day with jet-lag friendly pacing",
];

const insightCards = [
  {
    title: "Moments planned",
    value: "18 experiences",
    delta: "+6 vs last month",
    icon: Compass,
  },
  {
    title: "Flight segments",
    value: "6 booked",
    delta: "2 layovers optimised",
    icon: Plane,
  },
  {
    title: "Local guides",
    value: "4 confirmed",
    delta: "All briefs sent",
    icon: Globe2,
  },
];

const quickActions = [
  { label: "Download day cards", icon: ClipboardList },
  { label: "Share guest pass", icon: Ticket },
  { label: "Add travel notes", icon: Sparkles },
];

const toolkitBlocks = [
  {
    title: "Ready-made day templates",
    description: "Street food sampler • Studio Ghibli detour • Osaka nightlife hop",
    icon: NotebookPen,
  },
  {
    title: "Logistics checklist",
    description: "Rail passes • pocket Wi-Fi • luggage transfer tokens",
    icon: CalendarCheck,
  },
  {
    title: "Story prompts",
    description: "Capture alley portraits, note coffee spots for the blog, map Geo tags",
    icon: ScrollText,
  },
];

const fieldNotes = [
  "Upload Kyoto tasting menu PDF for day 3 dinner",
  "Confirm luggage transfer to Osaka hotel",
  "Add late checkout request for final morning",
];

const likedItineraries = [
  {
    title: "Kyoto culture immersion",
    duration: "5 day loop",
    updated: "Touched 2 days ago",
    focus: "Tea ceremony • Gion lights • Nishiki bites",
  },
  {
    title: "Osaka foodie chase",
    duration: "3 day sprint",
    updated: "Saved last week",
    focus: "Kuromon market • Izakaya crawl",
  },
  {
    title: "Tokyo studio break",
    duration: "4 day edit",
    updated: "Refreshed this morning",
    focus: "TeamLab • Shibuya nights • Coffee alleys",
  },
];

export default function Dashboard() {
  const completedTasks = taskChecklist.filter((item) => item.done).length;
  const completionPercent = taskChecklist.length
    ? Math.round((completedTasks / taskChecklist.length) * 100)
    : 0;

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900">
      <SidebarDemo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative overflow-hidden rounded-3xl bg-white p-5 md:p-6 lg:col-span-8 shadow-sm border border-slate-200"
          >
            <div className="absolute right-8 top-8 hidden h-24 w-24 rounded-3xl bg-[#fe6d3c]/20 blur-2xl md:block" />
            <div className="relative flex flex-col gap-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Traveler dashboard</p>
                  <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Hey Tejash, itinerary mode is on</h1>
                  <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">
                    Your Tokyo + Kyoto route is 75% ready. Finalise the day 3 experiences and send the guest pass when you are happy with the draft.
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="rounded-2xl border border-[#fe6d3c]/30 bg-[#fe6d3c]/10 px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[#fe6d3c]">Next segment</p>
                  <h2 className="mt-1 text-lg font-semibold text-slate-900">Tokyo → Kyoto express</h2>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <CalendarRange className="h-4 w-4" /> 24 Nov • Depart 08:12 AM
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
                    <Clock className="h-3.5 w-3.5" /> Seats 4A • Bento service confirmed
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button className="rounded-full bg-[#fe6d3c] text-white font-semibold hover:bg-[#df5b2c]">Publish itinerary update</Button>
                <Button variant="outline" className="rounded-full border-[#fe6d3c]/40 bg-white text-[#fe6d3c] hover:bg-[#fe6d3c]/10">
                  Duplicate for new trip
                </Button>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Liked itineraries</p>
                    <p className="text-sm text-slate-600">Saved journeys you revisit often</p>
                  </div>
                  <Button variant="ghost" className="px-3 py-1.5 text-sm font-medium text-[#fe6d3c] hover:bg-[#fe6d3c]/10">
                    View all
                  </Button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {likedItineraries.map((itinerary) => (
                    <div key={itinerary.title} className="group relative overflow-hidden rounded-2xl bg-[#fe6d3c]/5 p-4 transition-transform duration-200 hover:-translate-y-1">
                      <div className="absolute right-3 top-3 rounded-full bg-white/70 p-1">
                        <Heart className="h-4 w-4 text-[#fe6d3c]" />
                      </div>
                      <div className="pr-6">
                        <h3 className="text-sm font-semibold text-slate-900">{itinerary.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">{itinerary.duration}</p>
                      </div>
                      <div className="mt-3 space-y-1 text-xs text-slate-600">
                        <p className="font-medium text-slate-700">{itinerary.focus}</p>
                        <p className="text-slate-500">{itinerary.updated}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Insight stream</p>
                    <h3 className="text-lg font-semibold text-slate-900">How this itinerary is shaping up</h3>
                  </div>
                  <Button variant="outline" className="rounded-full border-[#fe6d3c]/40 bg-white px-3 py-1.5 text-sm text-[#fe6d3c] hover:bg-[#fe6d3c]/10">
                    Export summary
                  </Button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {insightCards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-slate-200 p-3">
                      <card.icon className="h-5 w-5 text-[#fe6d3c]" />
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-500">{card.title}</p>
                      <p className="mt-1.5 text-base font-semibold text-slate-900">{card.value}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{card.delta}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-[#fe6d3c]/30 bg-[#fe6d3c]/10 p-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Reminder</p>
                  <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-sm text-slate-600">Add sushi studio feedback before sharing the final copy.</span>
                    <Button className="rounded-full bg-[#fe6d3c] px-4 py-1.5 text-sm text-white hover:bg-[#df5b2c]">Add note</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-4 flex flex-col gap-4"
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-[#fe6d3c]" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trip Muse Live</p>
                    <h3 className="text-base font-semibold text-slate-900">Create an itinerary with AI</h3>
                  </div>
                </div>
                <Button className="rounded-full bg-[#fe6d3c] px-3 py-1.5 text-sm text-white hover:bg-[#df5b2c]">Start fresh</Button>
              </div>

              <div className="mt-3 rounded-2xl border border-dashed border-[#fe6d3c]/40 bg-[#fe6d3c]/10 p-3 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Trip Muse builds day cards and budgets from your brief.</p>
                <p className="mt-1 leading-relaxed">Describe the vibe, pace, and non-negotiables. We will assemble logistics you can drop straight into the planner.</p>
              </div>

              <div className="mt-3 flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-4 text-center text-sm text-slate-500">
                <div className="flex h-full flex-col items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5 text-[#fe6d3c]" />
                  <p className="max-w-xs leading-relaxed">Tell Trip Muse what you want to experience and we will draft a fresh itinerary in seconds.</p>
                </div>
              </div>

              <div className="mt-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Try a prompt</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {aiStarterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      className="rounded-full border border-slate-200 px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-[#fe6d3c]/60 hover:text-[#fe6d3c]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm">
                <Input
                  placeholder="Describe the trip you want to build…"
                  className="border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
                />
                <Button size="icon" className="h-9 w-9 rounded-full bg-[#fe6d3c] text-white hover:bg-[#df5b2c]">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Trip snapshot</p>
              <h2 className="mt-1.5 text-xl font-semibold text-slate-900">Tokyo street food quest</h2>
              <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
                <span className="inline-flex w-max items-center gap-2 rounded-full bg-[#fe6d3c]/10 px-2.5 py-1 text-[#fe6d3c]">
                  <Plane className="h-4 w-4" /> BA 117 • Seat 4K
                </span>
                <div className="flex items-center gap-2">
                  <CalendarRange className="h-4 w-4 text-[#fe6d3c]" /> 21 - 27 Nov, 2025
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#fe6d3c]" /> Shibuya • Tsukiji • Gion
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-[#fe6d3c]/40 bg-[#fe6d3c]/5 p-3">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Crew status</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <p className="text-sm text-slate-600">Check-in reminders auto-sent</p>
                  <CheckCircle2 className="h-5 w-5 text-[#fe6d3c]" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Travel wallet balance</span>
                  <span className="text-sm font-semibold text-slate-900">$1.9k remaining</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:border-[#fe6d3c]/60 hover:text-[#fe6d3c]"
                  >
                    <span className="flex items-center gap-2">
                      <action.icon className="h-4 w-4" /> {action.label}
                    </span>
                    <span className="text-xs uppercase tracking-wide">Go</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

       

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
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
                      <span className={`mt-0.5 h-5 w-5 rounded-full border ${task.done ? "border-[#fe6d3c] bg-[#fe6d3c]" : "border-slate-300"}`}
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
                <NotebookPen className="h-5 w-5 text-[#fe6d3c]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Trip builder toolkit</p>
                  <h4 className="text-base font-semibold text-slate-900">Assets ready to drop in</h4>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {toolkitBlocks.map((block) => (
                  <div key={block.title} className="rounded-2xl border border-slate-200 bg-white/80 px-3 py-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                      <block.icon className="h-4 w-4 text-[#fe6d3c]" /> {block.title}
                    </div>
                    <p className="mt-0.5 text-xs text-slate-600">{block.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-[#fe6d3c]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Field notes</p>
                  <h4 className="text-base font-semibold text-slate-900">Personal reminders</h4>
                </div>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {fieldNotes.map((note) => (
                  <li key={note} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#fe6d3c]" aria-hidden="true" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}





