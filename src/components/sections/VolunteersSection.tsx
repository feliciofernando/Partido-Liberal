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
import { useTranslation } from "@/lib/i18n";

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

const interestAreaIds = [
  "campanha", "eventos", "comunicacao", "fiscal", "mobilizacao", "administrativo",
];

interface VolunteerStats {
  total: number;
  fiscals: number;
}

export function VolunteersSection() {
  const { t } = useTranslation();
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
          <Badge className="bg-blue-100 text-blue-700 mb-4">
            {t.volunteers.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.volunteers.heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.volunteers.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Info Cards */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t.volunteers.cards.campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.volunteers.cards.campaign.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.volunteers.cards.campaign.description}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t.volunteers.cards.pollWatcher.title}</h3>
                    <p className="text-sm text-muted-foreground">{t.volunteers.cards.pollWatcher.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t.volunteers.cards.pollWatcher.description}
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-blue-gradient text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{formatNumber(stats.total)}</div>
                  <div className="text-white/80 text-sm">{t.volunteers.stats.activeVolunteers}</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-gradient-dark text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold mb-1">{formatNumber(stats.fiscals)}</div>
                  <div className="text-white/80 text-sm">{t.volunteers.stats.trainedWatchers}</div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h4 className="font-semibold text-foreground mb-4">{t.volunteers.benefits.heading}</h4>
              <ul className="space-y-3">
                {t.volunteers.benefits.items.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-blue-gradient text-white rounded-t-lg">
              <h3 className="text-xl font-semibold">{t.volunteers.form.title}</h3>
              <p className="text-white/80 text-sm">{t.volunteers.form.subtitle}</p>
            </CardHeader>
            <CardContent className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-600" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    {t.volunteers.form.successTitle}
                  </h4>
                  <p className="text-muted-foreground mb-6">
                    {t.volunteers.form.successDescription}
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
                    {t.volunteers.form.newRegistration}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.volunteers.form.fullName}</Label>
                      <Input
                        id="name"
                        placeholder={t.volunteers.form.fullNamePlaceholder}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.volunteers.form.phone}</Label>
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
                    <Label htmlFor="email">{t.volunteers.form.email}</Label>
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
                      <Label>{t.volunteers.form.province}</Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData({ ...formData, province: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.volunteers.form.selectPlaceholder} />
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
                      <Label htmlFor="municipality">{t.volunteers.form.municipality}</Label>
                      <Input
                        id="municipality"
                        placeholder={t.volunteers.form.municipalityPlaceholder}
                        value={formData.municipality}
                        onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-2">
                    <Label>{t.volunteers.form.availability}</Label>
                    <Select
                      value={formData.availability}
                      onValueChange={(value) => setFormData({ ...formData, availability: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.volunteers.form.availabilityPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tempo_integral">{t.shared.availability.fullTime}</SelectItem>
                        <SelectItem value="fins_semana">{t.shared.availability.weekends}</SelectItem>
                        <SelectItem value="horario_noturno">{t.shared.availability.nightShift}</SelectItem>
                        <SelectItem value="flexivel">{t.shared.availability.flexible}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label>{t.volunteers.form.interestAreas}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {interestAreaIds.map((areaId, index) => (
                        <div key={areaId} className="flex items-center space-x-2">
                          <Checkbox
                            id={areaId}
                            checked={formData.interests.includes(areaId)}
                            onCheckedChange={(checked) =>
                              handleInterestChange(areaId, checked as boolean)
                            }
                          />
                          <Label htmlFor={areaId} className="text-sm font-normal cursor-pointer">
                            {t.volunteers.form.areas[index]}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="experience">{t.volunteers.form.experience}</Label>
                    <Textarea
                      id="experience"
                      placeholder={t.volunteers.form.experiencePlaceholder}
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
                        {t.volunteers.form.pollWatcher}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {t.volunteers.form.pollWatcherDesc}
                      </p>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button type="submit" className="w-full btn-cta py-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.volunteers.form.submitting}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t.volunteers.form.submit}
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
