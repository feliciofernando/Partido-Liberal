"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatBubbleOvalLeftEllipsisIcon, XMarkIcon } from "@heroicons/react/24/outline";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const phoneNumber = "244923456789";
  const message = "Olá! Gostaria de saber mais sobre o Partido Liberal.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden mb-2 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="bg-slate-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white">Partido Liberal</p>
                <p className="text-xs text-slate-300">Online agora</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-slate-50">
            <p className="text-sm text-slate-600">
              Olá! Como podemos ajudá-lo? Clique abaixo para iniciar uma conversa.
            </p>
          </div>
          <div className="p-3 border-t border-slate-100">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5 mr-2" />
                Iniciar Conversa
              </Button>
            </a>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="h-14 w-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-white" />
        ) : (
          <ChatBubbleOvalLeftEllipsisIcon className="h-7 w-7 text-white" />
        )}
      </Button>
    </div>
  );
}
