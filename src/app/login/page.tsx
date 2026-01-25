"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LucideEuro } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            console.log("Attempting login with:", email);
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log("SignIn response details:", JSON.stringify(res, null, 2));

            if (res?.error) {
                console.error("Login error confirmed:", res.error);
                setError("Credenciais inválidas");
                setLoading(false);
                return;
            }

            if (!res?.ok) {
                console.error("Login response not OK:", res);
                setError("Erro ao conectar com o servidor");
                setLoading(false);
                return;
            }

            console.log("Login successful, redirecting to /dashboard via window.location...");
            // Force a hard reload to ensure cookies are set correctly
            window.location.href = "/dashboard";

        } catch (err) {
            console.error("Unexpected error during login:", err);
            setError("Ocorreu um erro inesperado");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Column - Form */}
            <div className="flex flex-col justify-center w-full lg:w-[35%] px-4 py-12 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 lg:bg-white z-10">
                <div className="w-full max-w-sm mx-auto space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="mx-auto lg:mx-0 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg mb-6 transform rotate-3">
                            <LucideEuro className="h-8 w-8" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            ReStarta
                        </h2>
                        <p className="mt-2 text-base text-gray-600">
                            Bem-vindo de volta! Gerencie suas compras e planeje sua viagem.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border hover:border-blue-400 transition-colors"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border hover:border-blue-400 transition-colors"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4 border border-red-200">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">Erro no login</h3>
                                        <div className="mt-2 text-sm text-red-700">{error}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 transition-all duration-200 transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Entrando...
                                    </span>
                                ) : "Entrar na Plataforma"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right Column - Image */}
            <div className="hidden lg:block lg:w-[65%] relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
                    style={{
                        backgroundImage: "url('/login-bg.jpg')",
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-20 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-3xl font-bold mb-2">Porto, Portugal</h3>
                    <p className="text-lg text-blue-100">Contagem regressiva para a sua Imigração / Viagem!</p>
                </div>
            </div>
        </div>
    );
}
