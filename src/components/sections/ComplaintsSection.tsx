"use client";

import { useState } from "react";
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
import {
  MessageSquare,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Send,
  Loader2,
  CheckCircle,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

const complaintTypeValues = [
  { value: "sugestao", icon: Lightbulb },
  { value: "denuncia", icon: AlertTriangle },
  { value: "reclamacao", icon: MessageSquare },
  { value: "informacao", icon: HelpCircle },
];

const complaintTypeLabels = ["suggestion", "complaint", "grievance", "infoRequest"] as const;

const provinces = [
  "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango",
  "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo", "Huíla",
  "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico",
  "Namibe", "Uíge", "Zaire"
];

export function ComplaintsSection() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    email: "",
    phone: "",
    province: "",
    subject: "",
    message: "",
    anonymous: false,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          anonymous: isAnonymous,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar mensagem");
      }

      setIsSuccess(true);
      toast({
        title: "Mensagem enviada com sucesso!",
        description: isAnonymous
          ? "Sua mensagem anônima foi registrada. Obrigado!"
          : "Entraremos em contato em breve. Obrigado!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no envio",
        description: error.message || "Ocorreu um erro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ouvidoria" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="bg-blue-100 text-blue-700 mb-4">
            {t.complaints.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.complaints.heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.complaints.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Type Selection Cards */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground mb-4">{t.complaints.messageType}</h3>
            {complaintTypeValues.map((type, index) => (
              <Card
                key={type.value}
                className={`cursor-pointer transition-all ${
                  formData.type === type.value
                    ? "border-blue-600 border-2 shadow-md"
                    : "border hover:border-blue-300"
                }`}
                onClick={() => setFormData({ ...formData, type: type.value })}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <type.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{t.complaints.types[complaintTypeLabels[index]]}</h4>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Privacy Info */}
            <Card className="bg-blue-50 border-blue-200 mt-6">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{t.complaints.privacy.heading}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t.complaints.privacy.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-blue-gradient text-white rounded-t-lg">
                <h3 className="text-xl font-semibold">{t.complaints.form.title}</h3>
              </CardHeader>
              <CardContent className="p-6">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">
                      {t.complaints.form.successTitle}
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      {t.complaints.form.successDescription}
                    </p>
                    <Button
                      onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                          type: "",
                          name: "",
                          email: "",
                          phone: "",
                          province: "",
                          subject: "",
                          message: "",
                          anonymous: false,
                        });
                        setIsAnonymous(false);
                      }}
                      variant="outline"
                    >
                      {t.complaints.form.newMessage}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Anonymous Toggle */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        {isAnonymous ? (
                          <EyeOff className="h-5 w-5 text-slate-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-600" />
                        )}
                        <div>
                          <span className="font-medium text-foreground">{t.complaints.form.anonymous}</span>
                          <p className="text-xs text-muted-foreground">
                            {isAnonymous
                              ? t.complaints.form.anonymousDesc
                              : t.complaints.form.identifiedDesc}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={isAnonymous ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setIsAnonymous(!isAnonymous);
                          setFormData({
                            ...formData,
                            anonymous: !isAnonymous,
                            name: !isAnonymous ? "" : formData.name,
                            email: !isAnonymous ? "" : formData.email,
                            phone: !isAnonymous ? "" : formData.phone,
                          });
                        }}
                        className={isAnonymous ? "bg-blue-600 hover:bg-blue-700" : ""}
                      >
                        {isAnonymous ? t.complaints.form.anonymousLabel : t.complaints.form.identifiedLabel}
                      </Button>
                    </div>

                    {/* Personal Info - Only if not anonymous */}
                    {!isAnonymous && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t.complaints.form.name}</Label>
                          <Input
                            id="name"
                            placeholder={t.complaints.form.namePlaceholder}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required={!isAnonymous}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t.complaints.form.phone}</Label>
                          <Input
                            id="phone"
                            placeholder="+244 9XX XXX XXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {!isAnonymous && (
                      <div className="space-y-2">
                        <Label htmlFor="email">{t.complaints.form.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required={!isAnonymous}
                        />
                      </div>
                    )}

                    {/* Province */}
                    <div className="space-y-2">
                      <Label>{t.complaints.form.province}</Label>
                      <Select
                        value={formData.province}
                        onValueChange={(value) => setFormData({ ...formData, province: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t.complaints.form.provincePlaceholder} />
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

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t.complaints.form.subject}</Label>
                      <Input
                        id="subject"
                        placeholder={t.complaints.form.subjectPlaceholder}
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">{t.complaints.form.message}</Label>
                      <Textarea
                        id="message"
                        placeholder={t.complaints.form.messagePlaceholder}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        required
                      />
                    </div>

                    {/* Type validation */}
                    {!formData.type && (
                      <p className="text-sm text-slate-600">
                        {t.complaints.form.selectType}
                      </p>
                    )}

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full btn-cta py-6"
                      disabled={isSubmitting || !formData.type}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t.complaints.form.submitting}
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          {t.complaints.form.submit}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
