"use client";

import { motion } from "framer-motion";
import { EVENT, generateCalendarUrl } from "@/lib/constants";
import { MapPin, Navigation, CalendarPlus } from "lucide-react";

export default function MapSection() {
  return (
    <section className="relative py-32 px-6" id="map">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-accent" />
            <p className="text-accent text-sm uppercase tracking-[0.3em]">
              Địa điểm
            </p>
          </div>

          <p className="text-muted max-w-lg mx-auto">
            {EVENT.venue}
          </p>
          <p className="text-muted/70 text-sm mt-1">{EVENT.address}</p>
        </motion.div>

        {/* Map + Actions */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Map Container */}
          <div className="glass rounded-3xl overflow-hidden border border-accent/10 mb-8">
            <div className="relative w-full h-[300px] md:h-[400px] bg-primary-light">
              <iframe
                src={EVENT.mapUrl}
                className="absolute inset-0 w-full h-full border-0 opacity-80 hover:opacity-100 transition-opacity duration-500"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Event Location Map"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={EVENT.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-primary font-bold rounded-full hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:scale-105 transition-all duration-300"
            >
              <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
              Xem Đường Đi
            </a>

            <a
              href={generateCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 glass border border-accent/20 text-surface font-medium rounded-full hover:border-accent/50 hover:scale-105 transition-all duration-300"
            >
              <CalendarPlus className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
              Thêm vào Google Calendar
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
