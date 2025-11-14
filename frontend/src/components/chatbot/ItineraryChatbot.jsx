import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

const ItineraryChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: "Hey there! I can help craft a tailored itinerary. Tell me the city, travel dates, or experiences you're after.",
    },
  ]);
  const chatBodyRef = useRef(null);

  const suggestions = useMemo(
    () => [
      'Weekend escape in Goa',
      'Family trip to Paris in June',
      'Adventure activities in Rishikesh',
    ],
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const node = chatBodyRef.current;
    if (!node) {
      return;
    }

    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages, isOpen]);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSuggestionClick = (text) => {
    setInputValue(text);
  };

  const getBotResponse = (text) => {
    if (!text) {
      return "Let me know the basics like destination or travel dates, and I'll suggest a day-by-day outline.";
    }

    return `Noted! I'll sketch a draft itinerary around "${text}". Add more details or ask for adjustments anytime.`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: getBotResponse(trimmed),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 400);
  };

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <div className="pointer-events-auto flex flex-col items-end">
        {isOpen ? (
          <div className="mb-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
            <header className="flex items-start justify-between border-b border-slate-100 bg-white/90 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Trip assistant</p>
                <h2 className="text-lg font-semibold text-slate-900">Build your itinerary</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Share your destination, dates, or vibe and I will propose a day-wise plan.
                </p>
              </div>
              <button
                type="button"
                onClick={toggleWidget}
                className="rounded-full border border-slate-200 p-1 text-slate-500 transition hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={chatBodyRef} className="max-h-72 space-y-3 overflow-y-auto px-5 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.sender === 'user'
                      ? 'ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-[#fe6d3c]/10 px-4 py-2 text-sm text-[#fe6d3c]'
                      : 'max-w-[90%] rounded-2xl rounded-bl-md bg-slate-100 px-4 py-2 text-sm text-slate-700'
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 transition hover:border-[#fe6d3c]/40 hover:text-[#fe6d3c]"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Describe your trip..."
                  className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none transition focus:border-[#fe6d3c]/60 focus:ring-2 focus:ring-[#fe6d3c]/20"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#fe6d3c] p-2 text-white transition hover:bg-[#fe6d3c]/90"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={toggleWidget}
          className="flex items-center gap-3 rounded-full bg-white px-4 py-3 shadow-lg shadow-slate-900/5 transition hover:shadow-xl"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fe6d3c]/10">
            <MessageCircle className="h-5 w-5 text-[#fe6d3c]" />
          </span>
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Chatbot</p>
            <p className="text-sm font-semibold text-slate-900">Plan an itinerary</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ItineraryChatbot;
