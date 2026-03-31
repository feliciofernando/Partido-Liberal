"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

interface Alert {
  id: string;
  title: string;
  message: string;
  type: string;
}

export function AlertBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const { t } = useTranslation();

  const defaultAlert: Alert = {
    id: "1",
    title: t.alert.defaultTitle,
    message: t.alert.defaultMessage,
    type: "urgente",
  };

  const activeAlert = alert ?? defaultAlert;

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        const res = await fetch('/api/alerts');
        const data = await res.json();
        if (data.alerts && data.alerts.length > 0) {
          setAlert(data.alerts[0]);
        }
      } catch (e) {
        console.log('Using default alert');
      }
    };
    fetchAlert();
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="relative bg-gradient-to-r from-party-blue to-party-blue-dark text-white"
      >
        <Link href="/alerta" className="block cursor-pointer">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Bell className="h-5 w-5 text-party-yellow" />
                  </motion.div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{activeAlert.title}</p>
                  <p className="text-xs text-white/80 truncate hidden sm:block">
                    {activeAlert.message?.replace(/<[^>]*>/g, '').substring(0, 100)}
                  </p>
                </div>
                <span className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 bg-party-yellow text-party-blue-dark hover:bg-party-yellow-dark text-xs font-medium rounded-md transition-colors">
                  {t.alert.learnMore}
                  <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors z-10"
          aria-label={t.alert.close}
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
