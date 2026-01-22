'use client';

import { useState } from 'react';
import { updateTravelDetails } from '@/actions/user';
import { searchPlaces } from '@/lib/places'; // Import search function
import { Loader2, Save, LucidePlane, LucideMapPin, LucideUser, Check } from 'lucide-react';
import { UserProfile } from '@prisma/client';
import { useEffect, useRef } from 'react';

interface TravelFormProps {
    initialData: {
        travelDate: string | null;
        city: string | null;
        profile: UserProfile | null;
    };
}

export function TravelForm({ initialData }: TravelFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    // Handle initial date string yyyy-mm-dd
    const [date, setDate] = useState(initialData.travelDate ? initialData.travelDate.split('T')[0] : '');
    const [city, setCity] = useState(initialData.city || '');
    // Default to TOURIST if null
    const [profile, setProfile] = useState<UserProfile>(initialData.profile || 'TOURIST');
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Autocomplete State
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCity(val);
        if (val.length > 0) {
            const results = searchPlaces(val);
            setSuggestions(results);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (val: string) => {
        setCity(val);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            await updateTravelDetails({
                travelDate: date ? new Date(date) : null,
                city,
                profile
            });
            setMessage({ text: 'Dados de viagem atualizados com sucesso!', type: 'success' });
        } catch (error) {
            setMessage({ text: 'Erro ao atualizar dados. Tente novamente.', type: 'error' });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Detalhes da Viagem</h3>
                    <p className="text-sm text-gray-500">Configure sua data e destino para receber dicas personalizadas.</p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <LucidePlane size={16} className="text-blue-500" />
                            Data da Viagem
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-gray-700"
                        />
                    </div>

                    <div className="space-y-2 relative" ref={wrapperRef}>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <LucideMapPin size={16} className="text-blue-500" />
                            Cidade de Destino
                        </label>
                        <input
                            type="text"
                            value={city}
                            onChange={handleCityChange}
                            onFocus={() => { if (city) setShowSuggestions(true); }}
                            placeholder="Ex: Lisboa, Porto..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            autoComplete="off"
                        />
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-50 w-full bg-white border border-gray-100 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                                {suggestions.map((s, i) => (
                                    <li
                                        key={i}
                                        onClick={() => selectSuggestion(s)}
                                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between group"
                                    >
                                        {s}
                                        {city === s && <Check size={14} className="text-blue-600" />}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <LucideUser size={16} className="text-blue-500" />
                            Perfil do Viajante
                        </label>
                        <select
                            value={profile}
                            onChange={(e) => setProfile(e.target.value as UserProfile)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                        >
                            <option value="TOURIST">Turista</option>
                            <option value="RESIDENT">Residente</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Isso ajusta as dicas e checklists para seu objetivo.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                    Salvar Alterações
                </button>
            </div>
        </form>
    );
}
