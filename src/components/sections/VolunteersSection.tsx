"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  CheckCircle,
  Shield,
  Send,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper function to format numbers consistently (avoid hydration mismatch)
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const provinces = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico",
  "Namibe", "Uíge", "Zaire"
];

const interestAreas = [
  { id: "campanha", label: "Campanha Eleitoral" },
  { id: "eventos", label: "Organização de Eventos" },
  { id: "comunicacao", label: "Comunicação e Redes Sociais" },
  { id: "fiscal", label: "Fiscalização Eleitoral" },
  { id: "mobilizacao", label: "Mobilização Comunitária" },
  { id: "administrativo", label: "Apoio Administrativo" },
];

interface VolunteerStats {
  total: number;
  fiscals: number;
}

export function VolunteersSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [stats, setStats] = useState<VolunteerStats>({ total: 15000, fiscals: 3850 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    municipality: "",
    availability: "",
    interests: [] as string[],
    experience: "",
    isFiscal: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/volunteers");
        const data = await response.json();
        if (data.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      }
    };

    fetchStats();
  }, []);

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, interest]
        : prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      setIsSuccess(true);
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Entraremos em contato em breve. Obrigado pelo seu apoio!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no cadastro",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="voluntarios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-slate-100 text-slate-700 mb-4">
            Junte-se a Nós
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Seja um <span className="text-party-blue">Voluntário</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Faça parte da mudança! Cadastre-se como voluntário e ajude-nos a construir
            um Angola melhor. Precisamos de pessoas comprometidas como você.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Voluntário de Campanha</h3>
                    <p className="text-sm text-muted-foreground">Apoie nossas atividades</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ajude na organização de eventos, mobilização comunitária, distribuição
                  de materiais e muito mais. Sua participação é fundamental!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Fiscal de Mesa</h3>
                    <p className="text-sm text-muted-foreground">Garanta eleições justas</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Seja fiscal de mesa no dia da eleição. Receba treinamento e ajude a
                  garantir um processo eleitoral transparente e democrático.
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-slate-800 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{formatNumber(stats.total)}</div>
                  <div className="text-white/80 text-sm">Voluntários Ativos</div>
                </CardContent>
              </Card>
              <Card className="bg-slate-700 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{formatNumber(stats.fiscals)}</div>
                  <div className="text-white/80 text-sm">Fiscais Treinados</div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-foreground mb-4">Benefícios de ser Voluntário</h4>
              <ul className="space-y-3">
                {[
                  "Certificado de participação",
                  "Treinamentos exclusivos",
                  "Acesso a eventos do partido",
                  "Networking com lideranças",
                  "Material de apoio gratuito",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-slate-600 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-slate-800 text-white rounded-t-lg">
              <h3 className="text-xl font-semibold">Formulário de Cadastro</h3>
              <p className="text-white/80 text-sm">Preencha seus dados para participar</p>
            </CardHeader>
            <CardContent className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-slate-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Cadastro Realizado!
                  </h4>
                  <p className="text-muted-foreground mb-6">
                    Obrigado pelo seu interesse. Nossa equipe entrará em contato em breve.
                  </p>
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        province: "",
                        municipality: "",
                        availability: "",
                        interests: [],
                        experience: "",
                        isFiscal: false,
                      });
                    }}
                    variant="outline"
                  >
                    Novo Cadastro
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone/WhatsApp *</Label>
                      <Input
                        id="phone"
                        placeholder="+244 9XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Província *</Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData({ ...formData, province: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="municipality">Município</Label>
                      <Input
                        id="municipality"
                        placeholder="Seu município"
                        value={formData.municipality}
                        onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <Label>Disponibilidade</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => setFormData({ ...formData, availability: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua disponibilidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tempo_integral">Tempo Integral</SelectItem>
                        <SelectItem value="fins_semana">Fins de Semana</SelectItem>
                        <SelectItem value="horario_noturno">Horário Noturno</SelectItem>
                        <SelectItem value="flexivel">Flexível</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label>Áreas de Interesse</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {interestAreas.map((area) => (
                        <div key={area.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={area.id}
                            checked={formData.interests.includes(area.id)}
                            onCheckedChange={(checked) =>
                              handleInterestChange(area.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={area.id} className="text-sm font-normal cursor-pointer">
                            {area.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiência Relevante</Label>
                    <Textarea
                      id="experience"
                      placeholder="Conte-nos sobre sua experiência anterior..."
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {/* Fiscal Checkbox */}
                  <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <Checkbox
                      id="isFiscal"
                      checked={formData.isFiscal}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isFiscal: checked as boolean })
                      }
                    />
                    <div>
                      <Label htmlFor="isFiscal" className="font-medium cursor-pointer">
                        Quero ser Fiscal de Mesa
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receberei treinamento para atuar como fiscal no dia da eleição.
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button type="submit" className="w-full btn-cta py-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Cadastrar como Voluntário
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
