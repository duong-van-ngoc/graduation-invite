"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { DEFAULT_WISHES, EMOJI_OPTIONS } from "@/lib/constants";
import type { Wish } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import { Send, MessageCircleHeart } from "lucide-react";
import { wishCardAppear, staggerContainer, staggerItem } from "@/lib/animation";

export default function WishSection() {
  const [wishes, setWishes] = useState<Wish[]>(DEFAULT_WISHES);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🎉");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fireConfetti = useCallback(() => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 1000,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ["#FACC15", "#F59E0B"] });
    fire(0.2, { spread: 60, colors: ["#FACC15", "#FDE68A"] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#FACC15", "#F8FAFC"] });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#FACC15"] });
    fire(0.1, { spread: 120, startVelocity: 45, colors: ["#EAB308", "#FACC15"] });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);

    const newWish: Wish = {
      id: generateId(),
      name: name.trim(),
      message: message.trim(),
      emoji: selectedEmoji,
      timestamp: Date.now(),
    };

    setTimeout(() => {
      setWishes((prev) => [newWish, ...prev]);
      setName("");
      setMessage("");
      setSelectedEmoji("🎉");
      setIsSubmitting(false);
      fireConfetti();
    }, 300);
  };

  return (
    <section className="relative py-32 px-6" id="wishes">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageCircleHeart className="w-5 h-5 text-accent" />
            <p className="text-accent text-sm uppercase tracking-[0.3em]">
              Lời chúc
            </p>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-surface mb-4">
            Gửi Lời Chúc
          </h2>
          <p className="text-muted max-w-md mx-auto">
            Hãy để lại lời chúc tốt đẹp nhất cho ngày trọng đại này
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="glass rounded-3xl p-6 md:p-8 border border-accent/10 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Name */}
            <div>
              <label
                htmlFor="wish-name"
                className="block text-muted text-sm mb-2"
              >
                Tên của bạn
              </label>
              <input
                id="wish-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên..."
                className="w-full px-5 py-3 bg-surface/5 border border-surface/10 rounded-2xl text-surface placeholder:text-muted/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-300"
                required
              />
            </div>

            {/* Emoji */}
            <div>
              <label className="block text-muted text-sm mb-2">
                Chọn emoji
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all duration-200 ${
                      selectedEmoji === emoji
                        ? "bg-accent/20 border border-accent/50 scale-110"
                        : "bg-surface/5 border border-surface/10 hover:bg-surface/10"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label
              htmlFor="wish-message"
              className="block text-muted text-sm mb-2"
            >
              Lời chúc
            </label>
            <textarea
              id="wish-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Viết lời chúc tốt đẹp nhất..."
              rows={3}
              className="w-full px-5 py-3 bg-surface/5 border border-surface/10 rounded-2xl text-surface placeholder:text-muted/40 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all duration-300 resize-none"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="group flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-accent to-accent-dark text-primary font-bold rounded-full hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              {isSubmitting ? "Đang gửi..." : "Gửi Lời Chúc"}
            </button>
          </div>
        </motion.form>

        {/* Wishes List */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {wishes.map((wish) => (
              <motion.div
                key={wish.id}
                variants={wishCardAppear}
                initial="hidden"
                animate="visible"
                layout
                className="glass-light rounded-2xl p-5 border border-surface/5 hover:border-accent/20 transition-all duration-300 group"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
                    {wish.emoji}
                  </div>
                  <div>
                    <p className="text-surface font-medium text-sm">
                      {wish.name}
                    </p>
                    <p className="text-muted/50 text-xs">
                      {new Date(wish.timestamp).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <p className="text-surface/80 text-sm leading-relaxed">
                  {wish.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
