"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, CheckCircle, Loader2, CalendarDays } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  province: string;
  date: string;
  time: string;
  type: string;
  status: string;
  attendees: number;
  confirmations: number;
}

// Helper functions to avoid hydration mismatch
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function formatMonth(dateStr: string): string {
  const date = new Date(dateStr);
  return MONTHS_SHORT[date.getMonth()];
}

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getDate()} de ${MONTHS_PT[date.getMonth()]} de ${date.getFullYear()}`;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Grande Comício em Luanda",
    description: "Lançamento oficial da campanha eleitoral com a presença de toda a liderança.",
    location: "Praça da Independência, Luanda",
    province: "Luanda",
    date: "2025-02-20",
    time: "09:00",
    type: "comicio",
    status: "agendado",
    attendees: 15000,
    confirmations: 0,
  },
  {
    id: "2",
    title: "Encontro com Jovens Empreendedores",
    description: "Discussão sobre políticas de apoio ao empreendedorismo juvenil.",
    location: "Centro de Conferências, Benguela",
    province: "Benguela",
    date: "2025-02-22",
    time: "14:00",
    type: "encontro",
    status: "agendado",
    attendees: 500,
    confirmations: 0,
  },
  {
    id: "3",
    title: "Passeata pela Paz",
    description: "Caminhada pacífica em defesa da democracia e tolerância.",
    location: "Avenida Principal, Huambo",
    province: "Huambo",
    date: "2025-02-25",
    time: "07:00",
    type: "passeata",
    status: "agendado",
    attendees: 3000,
    confirmations: 0,
  },
  {
    id: "4",
    title: "Reunião de Fiscais",
    description: "Capacitação para fiscais de mesa no dia da eleição.",
    location: "Sede do Partido, Saurimo",
    province: "Lunda Sul",
    date: "2025-02-18",
    time: "10:00",
    type: "reuniao",
    status: "agendado",
    attendees: 200,
    confirmations: 0,
  },
  {
    id: "5",
    title: "Comício em Cabinda",
    description: "Apresentação das propostas para a província de Cabinda.",
    location: "Estádio Municipal, Cabinda",
    province: "Cabinda",
    date: "2025-02-28",
    time: "16:00",
    type: "comicio",
    status: "agendado",
    attendees: 8000,
    confirmations: 0,
  },
];

const typeLabels: Record<string, string> = {
  comicio: "Comício",
  passeata: "Passeata",
  encontro: "Encontro",
  reuniao: "Reunião",
};

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [confirmedEvents, setConfirmedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events?upcoming=true");
        const data = await response.json();
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
        }
      } catch (error) {
        console.log("Usando eventos de fallback");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleConfirmation = async (eventId: string) => {
    if (confirmedEvents.includes(eventId)) {
      setConfirmedEvents((prev) => prev.filter((id) => id !== eventId));
      return;
    }

    setConfirming(eventId);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          name: "Apoiante",
        }),
      });

      if (response.ok) {
        setConfirmedEvents((prev) => [...prev, eventId]);
      }
    } catch (error) {
      console.error("Erro ao confirmar presença:", error);
      setConfirmedEvents((prev) => [...prev, eventId]);
    } finally {
      setConfirming(null);
    }
  };

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date());

  // Get unique provinces
  const provinces = [...new Set(events.map(e => e.province))].filter(Boolean);

  // Filter events for modal
  const filteredEvents = selectedProvince 
    ? events.filter(e => e.province === selectedProvince)
    : events;

  // Group events by month
  const groupedEvents = filteredEvents.reduce((acc, event) => {
    const date = new Date(event.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[key]) {
      acc[key] = {
        label: `${MONTHS_PT[date.getMonth()]} ${date.getFullYear()}`,
        events: []
      };
    }
    acc[key].events.push(event);
    return acc;
  }, {} as Record<string, { label: string; events: Event[] }>);

  return (
    <>
      <section id="eventos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-slate-100 text-slate-700 mb-4">
              Agenda
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Próximos <span className="text-party-blue">Eventos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Participe dos nossos eventos e faça parte da mudança. Confirme sua presença
              e ajude-nos a construir um Angola melhor.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-16 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="card-hover border-0 shadow-md overflow-hidden"
                >
                  {/* Date Header */}
                  <div className="bg-slate-800 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg bg-white/10 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="text-xs uppercase">
                          {formatMonth(event.date)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-white/80">
                          <Clock className="h-4 w-4" />
                          {event.time}h
                        </div>
                        <Badge className="bg-white/20 text-white mt-1">
                          {typeLabels[event.type] || event.type}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 text-slate-500" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span>{formatNumber(event.attendees || 0)} participantes esperados</span>
                      </div>
                    </div>

                    {/* Province Badge */}
                    <Badge variant="outline" className="border-slate-200 text-slate-600">
                      {event.province}
                    </Badge>

                    {/* Confirm Button */}
                    <Button
                      onClick={() => toggleConfirmation(event.id)}
                      disabled={confirming === event.id}
                      className={`w-full ${
                        confirmedEvents.includes(event.id)
                          ? "bg-slate-700 hover:bg-slate-800"
                          : "btn-cta"
                      }`}
                    >
                      {confirming === event.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Confirmando...
                        </>
                      ) : confirmedEvents.includes(event.id) ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Presença Confirmada
                        </>
                      ) : (
                        "Confirmar Presença"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-slate-300 text-slate-700"
              onClick={() => setShowCalendar(true)}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Ver Calendário Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Modal - Calendário Completo */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="w-5 h-5 text-slate-600" />
              Calendário Completo de Eventos
            </DialogTitle>
          </DialogHeader>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 pb-4 border-b">
            <Button
              variant={selectedProvince === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedProvince(null)}
              className={selectedProvince === null ? "bg-slate-800 hover:bg-slate-900" : ""}
            >
              Todas as Províncias
            </Button>
            {provinces.map((province) => (
              <Button
                key={province}
                variant={selectedProvince === province ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProvince(province)}
                className={selectedProvince === province ? "bg-slate-800 hover:bg-slate-900" : ""}
              >
                {province}
              </Button>
            ))}
          </div>

          {/* Events List */}
          <div className="flex-1 overflow-y-auto -mx-6 px-6 py-4">
            {Object.keys(groupedEvents).length === 0 ? (
              <div className="text-center py-12">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Nenhum evento encontrado</h3>
                <p className="text-muted-foreground">
                  {selectedProvince ? "Tente selecionar outra província." : "Novos eventos serão adicionados em breve."}
                </p>
              </div>
            ) : (
              Object.entries(groupedEvents).map(([key, group]) => (
                <div key={key} className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    {group.label}
                  </h3>
                  <div className="space-y-3">
                    {group.events.map((event) => (
                      <Card
                        key={event.id}
                        className="cursor-pointer hover:shadow-md transition-all duration-300 border"
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-slate-100 text-slate-700">
                              <span className="text-2xl font-bold">
                                {new Date(event.date).getDate()}
                              </span>
                              <span className="text-xs uppercase">
                                {formatMonth(event.date)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-foreground">
                                    {event.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {event.description}
                                  </p>
                                </div>
                                <Badge className="bg-white/20 text-slate-700 border border-slate-200 ml-2">
                                  {typeLabels[event.type] || event.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4 text-slate-500" />
                                  <span>{event.time}h</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-slate-500" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-slate-500" />
                                  <span>{formatNumber(event.attendees || 0)}</span>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {event.province}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-4 border-t text-center">
            <p className="text-sm text-muted-foreground">
              {filteredEvents.length} evento(s) encontrado(s)
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
