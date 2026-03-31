"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Loader2, CheckCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/i18n";

export function NewsletterSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.newsletter.errorSubscription);
      }

      setIsSuccess(true);
      toast({
        title: t.newsletter.toast.successTitle,
        description: data.message || t.newsletter.toast.successDescription,
      });
    } catch (error: any) {
      toast({
        title: t.newsletter.toast.errorTitle,
        description: error.message || t.newsletter.toast.errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Info */}
            <div className="bg-blue-gradient p-8 lg:p-12 text-white">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">
                <Bell className="h-3 w-3 mr-1" />
                Newsletter
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {t.newsletter.heading}
              </h2>
              <p className="text-white/80 mb-6">
                {t.newsletter.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-white/70" />
                  <span className="text-sm text-white/90">{t.newsletter.features.events}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-white/70" />
                  <span className="text-sm text-white/90">{t.newsletter.features.news}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-white/70" />
                  <span className="text-sm text-white/90">{t.newsletter.features.official}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <CardContent className="p-8 lg:p-12 flex items-center">
              {isSuccess ? (
                <div className="text-center w-full">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-slate-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {t.newsletter.successTitle}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t.newsletter.successDescription}
                  </p>
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      setEmail("");
                    }}
                    variant="outline"
                  >
                    {t.newsletter.newEmail}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="newsletter-email" className="text-sm font-medium text-foreground">
                      {t.newsletter.emailLabel}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 py-6"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-foreground">
                      {t.newsletter.preferencesLabel}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {t.newsletter.preferences.map((label, index) => (
                        <label
                          key={["eventos", "noticias", "comunicados", "campanha"][index]}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-slate-700 border-slate-300 rounded focus:ring-slate-500"
                          />
                          <span className="text-sm text-muted-foreground">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-cta py-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.newsletter.subscribing}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t.newsletter.submit}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    {t.newsletter.privacy}
                  </p>
                </form>
              )}
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  );
}
