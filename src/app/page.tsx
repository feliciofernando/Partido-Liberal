import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AlertBanner } from "@/components/layout/AlertBanner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { HeroSection } from "@/components/sections/HeroSection";
import { PartySection } from "@/components/sections/PartySection";
import { LeadersSection } from "@/components/sections/LeadersSection";
import { NewsSection } from "@/components/sections/NewsSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { ProgramSection } from "@/components/sections/ProgramSection";
import { KitSection } from "@/components/sections/KitSection";
import { VolunteersSection } from "@/components/sections/VolunteersSection";
import { ComplaintsSection } from "@/components/sections/ComplaintsSection";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { ElectionResultsSection } from "@/components/sections/ElectionResultsSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <AlertBanner />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <PartySection />
        <LeadersSection />
        <NewsSection />
        <EventsSection />
        <ProgramSection />
        <ElectionResultsSection />
        <KitSection />
        <VolunteersSection />
        <NewsletterSection />
        <ComplaintsSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
