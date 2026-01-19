import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LucideCheck, LucideArrowRight, LucideTrendingUp, LucideLayoutDashboard, LucideShieldCheck } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">
              Plano Portugal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Acessar Sistema <LucideArrowRight size={18} />
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-all"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white -z-10" />

        <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold mb-8 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            A ferramenta definitiva para sua imigração
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-6 text-balance">
            Planeje sua vida em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Portugal</span> de forma inteligente
          </h1>

          <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Organize documentação, controle gastos em Euro, acompanhe checklists e receba dicas personalizadas. Tudo em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
            >
              Começar Agora <LucideArrowRight size={20} />
            </Link>
            <Link
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center"
            >
              Ver Planos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: LucideTrendingUp,
                title: "Controle Financeiro",
                desc: "Acompanhe seus gastos e conversões de moeda em tempo real. Saiba exatamente quanto você já investiu."
              },
              {
                icon: LucideShieldCheck,
                title: "Checklists Inteligentes",
                desc: "Listas completas do que fazer antes e depois de chegar. Desde vistos até aluguel de imóvel."
              },
              {
                icon: LucideLayoutDashboard,
                title: "Dashboard Intuitivo",
                desc: "Uma visão geral clara do seu progresso, com dicas contextuais baseadas na data da sua viagem."
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all border border-gray-100 hover:border-gray-200">
                <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Escolha o plano ideal</h2>
          <p className="text-lg text-gray-500 mb-16">Invista no seu sonho com segurança e organização.</p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all relative">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Básico</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">R$ 59,90<span className="text-sm text-gray-400 font-normal">/ano</span></div>
              <p className="text-sm text-gray-500 mb-8">Para quem quer apenas organizar as tarefas essenciais.</p>

              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Checklist Básico</li>
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Acesso via Web</li>
                <li className="flex items-center gap-3 text-sm text-gray-300 line-through"><LucideCheck size={16} /> Controle Financeiro</li>
              </ul>

              <Link href="/register?plan=basic" className="block w-full py-3 rounded-xl border-2 border-gray-100 text-gray-900 font-bold hover:border-gray-900 transition-colors">
                Começar Básico
              </Link>
            </div>

            {/* Starter Plan (Featured) */}
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-600 shadow-2xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                Mais Popular
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">R$ 89,90<span className="text-sm text-gray-400 font-normal">/ano</span></div>
              <p className="text-sm text-gray-500 mb-8">O essencial para planejar sua viagem com segurança.</p>

              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Checklist Completo</li>
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Controle Financeiro</li>
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Dicas da Estação</li>
              </ul>

              <Link href="/register?plan=starter" className="block w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Assinar Starter
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="text-4xl font-extrabold text-gray-900 mb-6">R$ 149,90<span className="text-sm text-gray-400 font-normal">/ano</span></div>
              <p className="text-sm text-gray-500 mb-8">A experiência completa para sua mudança.</p>

              <ul className="space-y-4 mb-8 text-left">
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Tudo do Starter</li>
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Suporte Prioritário</li>
                <li className="flex items-center gap-3 text-sm text-gray-600"><LucideCheck className="text-green-500" size={16} /> Múltiplos Checklists</li>
              </ul>

              <Link href="/register?plan=pro" className="block w-full py-3 rounded-xl border-2 border-gray-100 text-gray-900 font-bold hover:border-gray-900 transition-colors">
                Assinar Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2026 Plano Portugal. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
