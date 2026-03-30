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

const navigation = [
  { name: "Início", href: "#inicio" },
  { name: "O Partido", href: "#partido" },
  { name: "Liderança", href: "#lideranca" },
  { name: "Notícias", href: "#noticias" },
  { name: "Agenda", href: "#eventos" },
  { name: "Programa", href: "#programa" },
  { name: "Kit Digital", href: "#kit" },
  { name: "Ouvidoria", href: "#ouvidoria" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
            <BuildingLibraryIcon className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-800 leading-tight">
              PARTIDO LIBERAL
            </span>
            <span className="text-xs text-slate-500 leading-tight">
              Construindo o Futuro
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navigation.map((item) => (
              <NavigationMenuItem key={item.name}>
                <NavigationMenuLink asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-sm font-medium text-slate-600 hover:text-slate-900"
                    )}
                  >
                    {item.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="#voluntarios">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-6">
              Seja Voluntário
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Bars3Icon className="h-6 w-6" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[350px]">
            <div className="flex flex-col gap-6 mt-8">
              {/* Mobile Logo */}
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
                  <BuildingLibraryIcon className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-800 leading-tight">
                    PARTIDO LIBERAL
                  </span>
                  <span className="text-xs text-slate-500 leading-tight">
                    Construindo o Futuro
                  </span>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-auto pt-6 border-t">
                <Link href="#voluntarios" onClick={() => setIsOpen(false)}>
                  <Button className="w-full py-6 text-lg bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold">
                    Seja Voluntário
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
