"use client";

import Link from "next/link";
import {
  BuildingLibraryIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const footerLinks = {
  partido: [
    { name: "Sobre Nós", href: "#partido" },
    { name: "Liderança", href: "#lideranca" },
    { name: "Estatuto", href: "#" },
    { name: "Transparência", href: "#" },
  ],
  participate: [
    { name: "Seja Voluntário", href: "#voluntarios" },
    { name: "Agenda", href: "#eventos" },
    { name: "Notícias", href: "#noticias" },
    { name: "Ouvidoria", href: "#ouvidoria" },
  ],
  resources: [
    { name: "Programa de Governo", href: "#programa" },
    { name: "Kit Digital", href: "#kit" },
    { name: "Newsletter", href: "#newsletter" },
    { name: "Contacto", href: "#contato" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Twitter", href: "#", icon: "twitter" },
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "YouTube", href: "#", icon: "youtube" },
];

export function Footer() {
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
                <span className="text-sm text-blue-200 leading-tight">Construindo o Futuro de Angola</span>
              </div>
            </Link>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-6 max-w-md">
              O Partido Liberal é a voz da mudança, da liberdade e do progresso. 
              Trabalhamos por um Angola próspero, justo e democrático para todos os cidadãos.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-blue-100/80">
                <MapPinIcon className="w-5 h-5 text-amber-400" />
                <span>Luanda, Angola</span>
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
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-100">O Partido</h3>
            <ul className="space-y-3">
              {footerLinks.partido.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-blue-100/70 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-100">Participe</h3>
            <ul className="space-y-3">
              {footerLinks.participate.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-blue-100/70 hover:text-amber-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-blue-100">Recursos</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-blue-100/70 hover:text-amber-400 transition-colors">
                    {link.name}
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
              © {new Date().getFullYear()} Partido Liberal. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-sm text-blue-100/60 hover:text-amber-400 transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-sm text-blue-100/60 hover:text-amber-400 transition-colors">
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
