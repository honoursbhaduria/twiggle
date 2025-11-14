import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Globe2,
  MapPin,
  Sparkles,
  Users
} from 'lucide-react';

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  if (!amount) {
    return '₹0';
  }
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

const buildList = (value, fallback) => {
  if (Array.isArray(value) && value.length > 0) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return fallback;
};

const ItineraryComponent = ({ data }) => {
  const days = data?.days || [];

  const metaStats = useMemo(
    () => [
      {
        label: 'Duration',
        value: data?.duration_days ? `${data.duration_days} days` : `${Math.max(days.length, 1)} days`,
        icon: Calendar
      },
      {
        label: 'Group size',
        value: data?.group_size || 'Up to 10 people',
        icon: Users
      },
      {
        label: 'Ages',
        value: data?.age_group || '18 – 65 yrs',
        icon: Sparkles
      },
      {
        label: 'Languages',
        value: data?.languages?.join(', ') || 'English, Local guide',
        icon: Globe2
      }
    ],
    [data, days.length]
  );

  const [modalDay, setModalDay] = useState(null);

  const overviewText =
    data?.overview ||
    data?.description ||
    'Designed for explorers who want the comfort of a guided experience with plenty of time to roam freely. Each day balances headline attractions with thoughtful local gems.';

  const highlights = buildList(data?.highlights, [
    'Speedboat transfer to the headline attractions with scenic island views.',
    'Visit signature lookouts with time for relaxed exploration and photo stops.',
    'Snorkel-ready waters with equipment provided and on-hand guidance.',
    "Lunch curated by locals featuring the region's standout dishes.",
    'Small group vibe with a dedicated host to keep the day flowing smoothly.'
  ]);

  const inclusions = buildList(data?.inclusions, [
    'Expert local guide and concierge',
    'Hotel pickup and drop-off (selected locations)',
    'Breakfast and curated lunch',
    'Entry passes for scheduled attractions',
    'Bottled water and light refreshments'
  ]);

  const totals = useMemo(
    () =>
      days.reduce(
        (acc, day) => ({
          attractions: acc.attractions + (day.attractions?.length || 0),
          experiences: acc.experiences + (day.experiences?.length || 0),
          restaurants: acc.restaurants + (day.restaurants?.length || 0)
        }),
        { attractions: 0, experiences: 0, restaurants: 0 }
      ),
    [days]
  );

  return (
    <section className="py-12">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {metaStats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-start gap-3 border-slate-200 sm:border-r last:sm:border-r-0 sm:pr-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fe6d3c]/12 text-[#fe6d3c]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-12">
            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-900">Tour Overview</h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{overviewText}</p>

              <section className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900">Tour Highlights</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {highlights.map((item, index) => (
                    <li key={`highlight-${index}`} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-[#fe6d3c]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mt-8">
                <h3 className="text-lg font-semibold text-slate-900">What's included</h3>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {inclusions.map((item, index) => (
                    <div
                      key={`include-${index}`}
                      className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                    >
                      <div className="h-2.5 w-2.5 rounded-full bg-[#fe6d3c]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </article>

            <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">Itinerary</h2>
                <span className="text-sm font-medium text-slate-400">{days.length} day plan</span>
              </div>
              <ol className="mt-6 space-y-6">
                {days.map((day, index) => {
                  const stopsCount =
                    (day.attractions?.length || 0) +
                    (day.restaurants?.length || 0) +
                    (day.experiences?.length || 0);

                  return (
                    <li key={day.day_number || index} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fe6d3c] text-sm font-semibold text-white">
                          {day.day_number || index + 1}
                        </div>
                        {index !== days.length - 1 ? (
                          <span className="mt-1 h-full w-0.5 bg-[#fe6d3c]/30" />
                        ) : null}
                      </div>
                      <div className="flex-1 rounded-2xl bg-slate-50 px-5 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[#fe6d3c]/80">Day {day.day_number || index + 1}</p>
                            <h3 className="text-lg font-semibold text-slate-900">{day.theme || 'Immersive sightseeing'}</h3>
                          </div>
                          <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                            <Clock className="h-3.5 w-3.5 text-[#fe6d3c]" />
                            {stopsCount} planned stops
                          </div>
                        </div>
                        {day.description ? (
                          <p className="mt-2 text-sm text-slate-600">{day.description}</p>
                        ) : null}
                        <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                          {day.attractions && day.attractions.length > 0 ? (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Attractions</p>
                              <ul className="mt-2 space-y-1">
                                {day.attractions.slice(0, 3).map((item, idx) => (
                                  <li key={`attr-${idx}`}>• {item.name}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          {day.restaurants && day.restaurants.length > 0 ? (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dining</p>
                              <ul className="mt-2 space-y-1">
                                {day.restaurants.slice(0, 2).map((item, idx) => (
                                  <li key={`rest-${idx}`}>• {item.name}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                          {day.experiences && day.experiences.length > 0 ? (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Experiences</p>
                              <ul className="mt-2 space-y-1">
                                {day.experiences.slice(0, 2).map((item, idx) => (
                                  <li key={`exp-${idx}`}>• {item.name}</li>
                                ))}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => setModalDay(day)}
                          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#fe6d3c]/20 bg-white px-4 py-2 text-xs font-semibold text-[#fe6d3c] transition hover:border-[#fe6d3c] hover:bg-[#fe6d3c]/10"
                        >
                          Open day detail
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </article>
          </div>

          <aside className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trip snapshot</p>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Total budget</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(data?.total_budget)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Planned attractions</span>
                  <span className="font-semibold text-slate-900">{totals.attractions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Experiences lined up</span>
                  <span className="font-semibold text-slate-900">{totals.experiences}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dining spots</span>
                  <span className="font-semibold text-slate-900">{totals.restaurants}</span>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Curate or swap experiences anytime. We keep day summaries synced with your detailed plans.
              </div>
            </div>

         
          </aside>
        </div>
      </div>

      {modalDay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Day detail</p>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Day {modalDay.day_number}: {modalDay.title || modalDay.theme || 'Curated Experiences'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalDay(null)}
                className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>
            <div className="space-y-6 px-6 py-6 text-sm text-slate-600">
              {modalDay.description ? (
                <p className="leading-relaxed text-slate-600">{modalDay.description}</p>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Attractions</p>
                  {modalDay.attractions && modalDay.attractions.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-slate-600">
                      {modalDay.attractions.map((item) => (
                        <li key={`md-attr-${item.id || item.name}`}>• {item.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-slate-400">No attractions planned.</p>
                  )}
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Experiences</p>
                  {modalDay.experiences && modalDay.experiences.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-slate-600">
                      {modalDay.experiences.map((item) => (
                        <li key={`md-exp-${item.id || item.name}`}>• {item.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-slate-400">No experiences planned.</p>
                  )}
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dining</p>
                  {modalDay.restaurants && modalDay.restaurants.length > 0 ? (
                    <ul className="mt-3 space-y-2 text-slate-600">
                      {modalDay.restaurants.map((item) => (
                        <li key={`md-rest-${item.id || item.name}`}>• {item.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-xs text-slate-400">No dining stops scheduled.</p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</p>
                <p className="mt-2 text-xs text-slate-500">
                  Add reminders, packing prompts, or meeting points for this day from the planner dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ItineraryComponent;




