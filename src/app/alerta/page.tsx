import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { BellAlertIcon, CalendarDaysIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

// Fallback data when database is empty
const defaultAlert = {
  id: "1",
  title: "Grande Comício em Luanda",
  message: "<p>Não perca o lançamento da campanha em Luanda!</p><p><strong>Data:</strong> 20 de Fevereiro de 2025</p><p><strong>Local:</strong> Praça da Independência</p><p>Venha participar deste momento histórico para o futuro de Angola.</p>",
  type: "urgente",
  active: true,
  createdAt: new Date().toISOString(),
};

export default async function AlertaPage() {
  const supabase = await createClient();
  
  let alert = defaultAlert;
  
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('Alert')
        .select('*')
        .eq('active', true)
        .order('createdAt', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        alert = data;
      }
    }
  } catch (e) {
    console.log('Using default alert data');
  }

  const typeStyles: Record<string, { bg: string; text: string; icon: string }> = {
    urgente: { bg: "bg-red-100", text: "text-red-700", icon: "text-red-600" },
    aviso: { bg: "bg-amber-100", text: "text-amber-700", icon: "text-amber-600" },
    evento: { bg: "bg-blue-100", text: "text-blue-700", icon: "text-blue-600" },
    info: { bg: "bg-slate-100", text: "text-slate-700", icon: "text-slate-600" },
  };

  const style = typeStyles[alert.type] || typeStyles.info;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className={`${style.bg} py-12`}>
          <div className="container mx-auto px-4">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Voltar ao Início
            </Link>
            
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center ${style.icon}`}>
                <BellAlertIcon className="w-8 h-8" />
              </div>
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text} capitalize mb-2`}>
                  {alert.type}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                  {alert.title}
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <article className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-12">
                {/* Date */}
                <div className="flex items-center gap-2 text-slate-500 mb-6">
                  <CalendarDaysIcon className="w-5 h-5" />
                  <time dateTime={alert.createdAt}>
                    {new Date(alert.createdAt).toLocaleDateString('pt-AO', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>

                {/* Message Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-600 prose-strong:text-slate-900 prose-a:text-party-blue overflow-hidden break-words [&_*]:max-w-full [&_img]:h-auto [&_table]:block [&_table]:overflow-x-auto [&_pre]:overflow-x-auto [&_ul]:break-words [&_ol]:break-words"
                  dangerouslySetInnerHTML={{ __html: alert.message || '<p>Sem conteúdo disponível.</p>' }}
                />
              </article>

              {/* CTA Section */}
              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Voltar à Página Inicial
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
