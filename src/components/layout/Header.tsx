"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
// Heroicons - Ícones institucionais
import {
  Bars3Icon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

// Navigation item keys map to translation keys and hrefs
const navItems = [
  { key: "home" as const, href: "#inicio" },
  { key: "party" as const, href: "#partido" },
  { key: "leadership" as const, href: "#lideranca" },
  { key: "news" as const, href: "#noticias" },
  { key: "agenda" as const, href: "#eventos" },
  { key: "program" as const, href: "#programa" },
  { key: "digitalKit" as const, href: "#kit" },
  { key: "ombudsman" as const, href: "#ouvidoria" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg logo-gradient shadow-md">
            <BuildingLibraryIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground leading-tight">
              PARTIDO LIBERAL
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              {t.nav.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navItems.map((item) => (
              <NavigationMenuItem key={item.key}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm font-medium text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {t.nav[item.key]}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher />
          <Link href="#voluntarios">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6">
              {t.nav.beVolunteer}
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Bars3Icon className="h-6 w-6" />
              <span className="sr-only">{t.nav.openMenu}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <div className="flex flex-col gap-6 mt-8">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg logo-gradient shadow-md">
                  <BuildingLibraryIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground leading-tight">
                    PARTIDO LIBERAL
                  </span>
                  <span className="text-xs text-muted-foreground leading-tight">
                    {t.nav.tagline}
                  </span>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {t.nav[item.key]}
                  </Link>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-auto pt-6 border-t">
                <Link href="#voluntarios" onClick={() => setIsOpen(false)}>
                  <Button className="w-full py-6 text-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                    {t.nav.beVolunteer}
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

// Utility function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
