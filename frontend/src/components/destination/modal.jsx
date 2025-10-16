import React, { useEffect, useMemo, useState } from "react";

/*
Contract:
- props:
  - open: boolean -> controls visibility
  - initialDays: Array<{ day_number: number, title?: string }>
  - places: { attractions: Place[], restaurants: Place[], experiences: Place[] }
  - onCancel: () => void
  - onApply: (days: DaySelection[]) => void

Types:
  type Place = { id: string|number, name: string, address?: string, estimated_cost?: number, description?: string };
  type DaySelection = {
    day_number: number,
    title?: string,
    locations?: string,
    attractions: Place[],
    restaurants: Place[],
    experiences: Place[]
  };
*/

const Modal = ({ open = false, initialDays = [{ day_number: 1 }], places, onCancel, onApply }) => {
  const [days, setDays] = useState(() => {
    const list = initialDays?.length ? initialDays : [{ day_number: 1 }];
    return list.map((d, i) => ({
      day_number: d.day_number ?? i + 1,
      title: d.title || "",
      locations: d.locations || "",
      // Preserve existing selections
      attractions: d.attractions || [],
      restaurants: d.restaurants || [],
      experiences: d.experiences || [],
    }));
  });
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // When initialDays changes or modal re-opens, load from initialDays (preserving selections)
  useEffect(() => {
    if (!open) return;
    const list = initialDays?.length ? initialDays : [{ day_number: 1 }];
    const next = list.map((d, i) => ({
      day_number: d.day_number ?? i + 1,
      title: d.title || "",
      locations: d.locations || "",
      // Preserve existing selections from initialDays
      attractions: d.attractions || [],
      restaurants: d.restaurants || [],
      experiences: d.experiences || [],
    }));
    setDays(next);
    setActiveDayIndex(0);
  }, [open, initialDays]);

  const activeDay = days[activeDayIndex];

  const addDay = () => {
    setDays((prev) => [
      ...prev,
      {
        day_number: prev.length + 1,
        title: "",
        locations: "",
        attractions: [],
        restaurants: [],
        experiences: [],
      },
    ]);
    setActiveDayIndex((prev) => prev + 1);
  };

  const toggleSelect = (key, item, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDays((prev) => {
      const copy = JSON.parse(JSON.stringify(prev)); // Deep clone to ensure React detects change
      const arr = copy[activeDayIndex][key] || [];
      const exists = arr.find((x) => String(x.id) === String(item.id));
      if (exists) {
        copy[activeDayIndex][key] = arr.filter((x) => String(x.id) !== String(item.id));
      } else {
        copy[activeDayIndex][key] = [...arr, item];
      }
      return copy;
    });
  };

  const isSelected = (key, item) => {
    const selected = !!(activeDay?.[key] || []).find((x) => String(x.id) === String(item.id));
    return selected;
  };

  const handleApply = () => {
    // Normalize and send back
    const normalized = days.map((d, i) => ({
      day_number: i + 1,
      title: d.title || "",
      locations: d.locations || "",
      attractions: (d.attractions || []).map(mapPlaceForDay),
      restaurants: (d.restaurants || []).map(mapPlaceForDay),
      experiences: (d.experiences || []).map(mapPlaceForDay),
    }));
    onApply?.(normalized);
  };

  const mapPlaceForDay = (p) => ({
    id: p.id ?? Date.now(),
    name: p.name || p.title || "",
    image: p.image || "",
    address: p.address || "",
    latitude: p.latitude || "",
    longitude: p.longitude || "",
    description: p.description || "",
    estimated_cost: p.estimated_cost || 0,
    cuisine: p.cuisine || "",
  });

  const sections = useMemo(() => ([
    { key: "attractions", title: "Attractions", badge: "bg-indigo-100 text-indigo-700", itemBg: "bg-indigo-50", btn: "text-indigo-600" },
    { key: "restaurants", title: "Restaurants", badge: "bg-emerald-100 text-emerald-700", itemBg: "bg-emerald-50", btn: "text-emerald-600" },
    { key: "experiences", title: "Experiences", badge: "bg-fuchsia-100 text-fuchsia-700", itemBg: "bg-fuchsia-50", btn: "text-fuchsia-600" },
  ]), []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs animate-in fade-in duration-300">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full min-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Plan your days</h3>
            <p className="text-sm text-slate-500">Start with Day 1, add more days, and pick places for each day. Click Done to apply.</p>
          </div>
          <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-full text-sm bg-slate-100 hover:bg-slate-200">Close</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
          {/* Day sidebar */}
          <div className="lg:col-span-1 border-r p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Days</p>
              <button type="button" onClick={addDay} className="text-xs px-3 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800">+ Add day</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {days.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDayIndex(idx)}
                  type="button"
                  className={`px-4 py-2 rounded-xl text-sm font-medium border ${idx === activeDayIndex ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                >
                  Day {d.day_number}
                </button>
              ))}
            </div>

           
            {activeDay && (
              <div className="mt-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-600 mb-1">Day title</label>
                <input 
                  type="text"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., Exploring Old City"
                  value={activeDay.title}
                  onChange={(e) => setDays((prev)=>{ const c=[...prev]; c[activeDayIndex] = { ...c[activeDayIndex], title: e.target.value }; return c; })}
                />
                <label className="block text-xs font-semibold text-slate-600 mb-1 mt-3">Locations (comma separated)</label>
                <input 
                  type="text"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="e.g., Jaipur, Amber Fort"
                  value={activeDay.locations}
                  onChange={(e) => setDays((prev)=>{ const c=[...prev]; c[activeDayIndex] = { ...c[activeDayIndex], locations: e.target.value }; return c; })}
                />
              </div>
            )}
          </div>

          {/* Places content */}
          <div className="lg:col-span-3 p-6 space-y-8 overflow-y-auto max-h-[70vh]">
            {sections.map((sec) => (
              <div key={sec.key}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${sec.badge}`}>{sec.title}</span>
                    <span className="text-xs text-slate-500">Selected: {activeDay?.[sec.key]?.length || 0}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(places?.[sec.key] || []).map((item) => {
                    const selected = isSelected(sec.key, item);
                    return (
                      <div
                        key={`${sec.key}-${item.id}`}
                        role="button"
                        tabIndex={0}
                        onClick={(e) => toggleSelect(sec.key, item, e)}
                        onKeyDown={(e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggleSelect(sec.key, item, e); } }}
                        className={`text-left rounded-2xl p-4 border cursor-pointer transition-all duration-200 ${selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                      >
                        <p className="font-semibold text-sm">{item.name} {selected && '✓'}</p>
                        {item.address && <p className="text-xs opacity-70 mt-1">{item.address}</p>}
                        {(item.estimated_cost || item.description) && (
                          <p className="text-xs opacity-70 mt-1">{item.estimated_cost ? `~₹${item.estimated_cost}` : item.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-white">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100">Cancel</button>
          <button type="button" onClick={handleApply} className="px-5 py-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 text-white">Done</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;