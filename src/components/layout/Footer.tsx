"use client";

import Link from "next/link";
import {
  BuildingLibraryIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/lib/i18n";

const socialLinks = [
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Twitter", href: "#", icon: "twitter" },
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "YouTube", href: "#", icon: "youtube" },
];

// Footer link column definitions mapping translation keys to hrefs
const footerLinkColumns = {
  partido: [
    { key: "aboutUs" as const, href: "#partido" },
    { key: "leadership" as const, href: "#lideranca" },
    { key: "statute" as const, href: "#" },
    { key: "transparency" as const, href: "#" },
  ],
  participate: [
    { key: "beVolunteer" as const, href: "#voluntarios" },
    { key: "agenda" as const, href: "#eventos" },
    { key: "news" as const, href: "#noticias" },
    { key: "ombudsman" as const, href: "#ouvidoria" },
  ],
  resources: [
    { key: "govProgram" as const, href: "#programa" },
    { key: "digitalKit" as const, href: "#kit" },
    { key: "newsletter" as const, href: "#newsletter" },
    { key: "contact" as const, href: "#contato" },
  ],
};

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer-gradient text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <BuildingLibraryIcon className="h-7 w-7 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight">PARTIDO LIBERAL</span>
                <span className="text-sm text-blue-200 leading-tight">{t.footer.tagline}</span>
              </div>
            </Link>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-6 max-w-md">
              {t.footer.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-blue-100/80">
                <MapPinIcon className="w-5 h-5 text-amber-400" />
                <span>{t.footer.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-100/80">
                <PhoneIcon className="w-5 h-5 text-amber-400" />
                <span>+244 923 456 789</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-blue-100/80">
                <EnvelopeIcon className="w-5 h-5 text-amber-400" />
                <span>contacto@partidoliberal.ao</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-100">{t.footer.columns.party}</h3>
            <ul className="space-y-3">
              {footerLinkColumns.partido.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-blue-100/70 hover:text-amber-400 transition-colors">
                    {t.footer.links[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-100">{t.footer.columns.participate}</h3>
            <ul className="space-y-3">
              {footerLinkColumns.participate.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-blue-100/70 hover:text-amber-400 transition-colors">
                    {t.footer.links[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-100">{t.footer.columns.resources}</h3>
            <ul className="space-y-3">
              {footerLinkColumns.resources.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-blue-100/70 hover:text-amber-400 transition-colors">
                    {t.footer.links[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-blue-100/60">
              © {new Date().getFullYear()} {t.footer.copyright}
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-blue-100/60 hover:text-amber-400 transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="#" className="text-sm text-blue-100/60 hover:text-amber-400 transition-colors">
                {t.footer.termsOfUse}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
