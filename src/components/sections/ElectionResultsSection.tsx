"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  BarChart3, 
  TrendingUp, 
  MapPin, 
  Users, 
  Clock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const mockResults = [
  { province: "Luanda", votes: 125000, percentage: 62, reported: 95 },
  { province: "Benguela", votes: 45000, percentage: 58, reported: 88 },
  { province: "Huambo", votes: 38000, percentage: 55, reported: 82 },
  { province: "Huíla", votes: 32000, percentage: 54, reported: 75 },
  { province: "Cabinda", votes: 18000, percentage: 65, reported: 90 },
  { province: "Lunda Sul", votes: 12000, percentage: 70, reported: 85 },
];

// Formatação consistente sem depender de locale
function formatVotes(votes: number): string {
  if (votes >= 1000) {
    return `${Math.floor(votes / 1000)} mil`;
  }
  return String(votes);
}

export function ElectionResultsSection() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const totalVotes = mockResults.reduce((acc, curr) => acc + curr.votes, 0);
  const avgPercentage = Math.round(mockResults.reduce((acc, curr) => acc + curr.percentage, 0) / mockResults.length);

  return (
    <section id="resultados" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="bg-slate-100 text-slate-700 mb-4">
            <BarChart3 className="h-3 w-3 mr-1" />
            Resultados
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Acompanhamento <span className="text-party-blue">Eleitoral</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Acompanhe em tempo real os resultados apurados pelos nossos fiscais.
            Transparência e democracia em primeiro lugar.
          </p>
        </div>

        {/* Accordion - Seção Colapsável */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="resultados" className="border-0">
              <AccordionTrigger className="px-6 py-5 hover:no-underline hover:bg-muted/50 bg-white">
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-slate-600" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-foreground text-lg">
                      Prévia dos Resultados Eleitorais
                    </span>
                    <p className="text-sm text-muted-foreground">
                      Clique para expandir e ver os dados detalhados por província
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                    Em breve
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-0 pb-0">
                {/* Status Banner */}
                <div className="px-6 pb-4">
                  <Card className="mb-6 border-0 shadow-md bg-slate-800 text-white">
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Apuração em Andamento</h3>
                            <p className="text-white/80 text-sm">Última atualização: há 5 minutos</p>
                          </div>
                        </div>
                        <Button
                          onClick={handleRefresh}
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                          Atualizar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <Card className="border shadow-sm">
                      <CardContent className="p-4 text-center">
                        <TrendingUp className="h-7 w-7 text-slate-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-foreground">{avgPercentage}%</div>
                        <div className="text-xs text-muted-foreground">Média Nacional</div>
                      </CardContent>
                    </Card>
                    <Card className="border shadow-sm">
                      <CardContent className="p-4 text-center">
                        <Users className="h-7 w-7 text-slate-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-foreground">270K</div>
                        <div className="text-xs text-muted-foreground">Votos Apurados</div>
                      </CardContent>
                    </Card>
                    <Card className="border shadow-sm">
                      <CardContent className="p-4 text-center">
                        <MapPin className="h-7 w-7 text-slate-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-foreground">18</div>
                        <div className="text-xs text-muted-foreground">Províncias</div>
                      </CardContent>
                    </Card>
                    <Card className="border shadow-sm">
                      <CardContent className="p-4 text-center">
                        <Clock className="h-7 w-7 text-slate-600 mx-auto mb-2" />
                        <div className="text-xl font-bold text-foreground">85%</div>
                        <div className="text-xs text-muted-foreground">Mesas Apuradas</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Results by Province */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2 pt-4">
                      <h3 className="text-lg font-semibold text-foreground">Resultados por Província</h3>
                      <p className="text-sm text-muted-foreground">Dados apurados pelos fiscais do Partido Liberal</p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y">
                        {mockResults.map((result, index) => (
                          <div key={result.province} className="p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-muted-foreground w-6">{index + 1}</span>
                                <span className="font-medium text-foreground">{result.province}</span>
                                <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                                  {result.reported}% apurado
                                </Badge>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-slate-800 text-lg">{result.percentage}%</span>
                                <p className="text-xs text-muted-foreground">
                                  {formatVotes(result.votes)} votos
                                </p>
                              </div>
                            </div>
                            <Progress value={result.percentage} className="h-2 bg-slate-100" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Disclaimer */}
                  <div className="mt-6 p-4 bg-slate-100 border border-slate-200 rounded-lg">
                    <p className="text-sm text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-500" />
                      Estes são dados preliminares apurados pelos fiscais do Partido Liberal.
                      Os resultados oficiais serão divulgados pela Comissão Nacional Eleitoral.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </section>
  );
}
