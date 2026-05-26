"use client";

import { useState, useEffect } from "react";
import { LucideX, LucideGift, LucideExternalLink, LucideCheck } from "lucide-react";

const WISE_URL = process.env.NEXT_PUBLIC_WISE_URL || "https://wise.com";
const NOMAD_URL = process.env.NEXT_PUBLIC_NOMAD_URL || "https://nomadglobal.com";
const LOCAL_STORAGE_KEY = "restarta_hide_affiliate_modal";

export function AffiliateModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        // Read from localStorage only after component mounts to avoid hydration mismatch
        const hideModal = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (hideModal !== "true") {
            // Delay modal presentation slightly for better UX (500ms)
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem(LOCAL_STORAGE_KEY, "true");
        }
        setIsOpen(false);
    };

    const handleDontShowAgainToggle = () => {
        const newValue = !dontShowAgain;
        setDontShowAgain(newValue);
        if (newValue) {
            localStorage.setItem(LOCAL_STORAGE_KEY, "true");
        } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
                onClick={handleClose}
            />

            {/* Modal Card */}
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-lg w-full overflow-hidden transform transition-all duration-300 animate-in zoom-in-95 z-10 flex flex-col">
                
                {/* Close Button Top Right */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors z-20"
                    aria-label="Fechar"
                >
                    <LucideX className="w-5 h-5" />
                </button>

                {/* Top Banner Accent */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                        <LucideGift className="w-40 h-40" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                            <LucideGift className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase bg-white/20 px-2.5 py-1 rounded-full">
                            Parcerias Exclusivas
                        </span>
                    </div>
                    <h3 className="text-2xl font-bold mt-4 leading-tight">
                        Ganhe Benefícios na sua Viagem!
                    </h3>
                    <p className="text-blue-100 text-sm mt-2 max-w-sm leading-relaxed">
                        Economize na conversão e taxas ao enviar dinheiro para o exterior. Abra sua conta usando nossos links oficiais de indicação.
                    </p>
                </div>

                {/* Modal Body / Affiliate Options */}
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* Wise Box */}
                    <div className="border border-emerald-100 rounded-2xl bg-emerald-50/30 p-4 hover:border-emerald-200 transition-colors flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                <h4 className="font-extrabold text-emerald-800 text-base">Wise</h4>
                            </div>
                            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Taxa Zero
                            </span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed mb-4">
                            Abra sua conta e ganhe a <strong>primeira transferência gratuita</strong> de até R$ 3.000 (ou equivalente). Cotação comercial real com tarifas transparentes.
                        </p>
                        <a
                            href={WISE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] duration-200"
                        >
                            Criar Conta na Wise <LucideExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    {/* Nomad Box */}
                    <div className="border border-slate-200 rounded-2xl bg-slate-50/50 p-4 hover:border-slate-300 transition-colors flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 animate-ping" />
                                <h4 className="font-extrabold text-slate-800 text-base">Nomad</h4>
                            </div>
                            <span className="text-[11px] font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                                Até $20 Cashback
                            </span>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed mb-4">
                            Abra sua conta digital em dólar e ganhe <strong>até US$ 20 de cashback</strong> no seu primeiro depósito realizado em até 15 dias.
                        </p>
                        <a
                            href={NOMAD_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 hover:bg-slate-850 active:bg-slate-950 text-white font-bold text-sm rounded-xl shadow-md shadow-slate-200 hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] duration-200"
                        >
                            Criar Conta na Nomad <LucideExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                    <label 
                        className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer select-none"
                    >
                        <button
                            type="button"
                            onClick={handleDontShowAgainToggle}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                                dontShowAgain 
                                    ? "bg-blue-600 border-blue-600 text-white" 
                                    : "border-gray-300 bg-white hover:border-blue-400"
                            }`}
                        >
                            {dontShowAgain && <LucideCheck className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <span>Não mostrar esta mensagem novamente</span>
                    </label>

                    <button
                        onClick={handleClose}
                        className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-200 bg-white transition-colors"
                    >
                        Talvez mais tarde
                    </button>
                </div>
            </div>
        </div>
    );
}
