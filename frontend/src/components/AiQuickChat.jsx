import { useMemo, useState } from "react";
import { userRequest } from "../requestMethods";

const AiQuickChat = ({ context, buttonLabel = "AI Product Details" }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Ask AI about the product details.",
    },
  ]);

  const safeContext = useMemo(() => {
    if (!context || typeof context !== "object") return { type: "unknown" };
    return context;
  }, [context]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await userRequest.post("/ai/chat", {
        message: text,
        context: safeContext,
      });

      const reply = res?.data?.reply || "Sorry, I couldn't answer that.";
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (e) {
      const data = e?.response?.data;
      const parts = [data?.message, data?.hint, data?.details].filter(Boolean);
      const msg =
        parts.length > 0
          ? parts.join("\n")
          : "AI is unavailable right now. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", text: msg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full sm:w-auto px-6 py-3 rounded-full border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold shadow-sm"
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200/60 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">AI Product Helper</h3>
            <span className="text-xs text-gray-500">
              {loading ? "Thinking..." : ""}
            </span>
          </div>

          <div className="p-5 space-y-3 max-h-72 overflow-y-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] bg-purple-600 text-white px-4 py-3 rounded-2xl"
                      : "max-w-[85%] bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl"
                  }
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200/60 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about usage, gifting, delivery..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-white/90"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={loading}
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-bold shadow-md disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiQuickChat;
