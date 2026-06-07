"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDocAction } from "@/actions/post-arrival";
import { LucideFileText, Edit3, CheckCircle2, Clock, XCircle, Save, Loader2, Upload, Paperclip } from "lucide-react";
import clsx from "clsx";

interface DocItem {
    id: string;
    type: string;
    status: string;
    emissionDate: string;
    notes: string;
    fileUrl: string;
}

interface DocsListProps {
    initialDocs: DocItem[];
}

export function DocsList({ initialDocs }: DocsListProps) {
    const router = useRouter();
    const [docs, setDocs] = useState<DocItem[]>(initialDocs);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form inputs state
    const [editStatus, setEditStatus] = useState("NOT_STARTED");
    const [editEmissionDate, setEditEmissionDate] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [fileName, setFileName] = useState("");

    const docNames: Record<string, { title: string; desc: string }> = {
        NIF: { title: "NIF", desc: "Número de Identificação Fiscal (Essencial para tudo)" },
        NISS: { title: "NISS", desc: "Número de Identificação da Segurança Social (Para trabalhar)" },
        UTENTE: { title: "Número de Utente", desc: "Acesso ao Sistema Nacional de Saúde (SNS)" },
        RESIDENCIA: { title: "Título de Residência", desc: "Autorização legal de residência em Portugal" },
        CONTA_BANCARIA: { title: "Conta Bancária", desc: "Conta aberta em banco local para transações e salários" },
        COMPROVATIVO_MORADA: { title: "Comprovativo de Morada", desc: "Atestado da junta de freguesia ou fatura de serviços" }
    };

    const statusMap: Record<string, { label: string; color: string; icon: any }> = {
        NOT_STARTED: { label: "Não iniciado", color: "bg-gray-100 text-gray-700 border-gray-200", icon: XCircle },
        IN_PROGRESS: { label: "Em andamento", color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
        COMPLETED: { label: "Concluído", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle2 }
    };

    const handleEdit = (doc: DocItem) => {
        setEditingId(doc.id);
        setEditStatus(doc.status);
        setEditEmissionDate(doc.emissionDate || "");
        setEditNotes(doc.notes || "");
        setFileName(doc.fileUrl ? "comprovante_enviado.pdf" : "");
    };

    const handleSave = async (id: string) => {
        setIsLoading(true);
        try {
            await updateDocAction(id, {
                status: editStatus,
                emissionDate: editEmissionDate ? new Date(editEmissionDate) : null,
                notes: editNotes
            });

            // Update local state
            setDocs(prev => prev.map(d => d.id === id ? {
                ...d,
                status: editStatus,
                emissionDate: editEmissionDate,
                notes: editNotes,
                fileUrl: fileName ? "comprovante.pdf" : ""
            } : d));

            setEditingId(null);
            router.refresh();
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Erro ao atualizar o documento.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 items-start w-full">
            {/* Docs List */}
            <div className="lg:col-span-2 space-y-4">
                {docs.map((doc) => {
                    const info = docNames[doc.type] || { title: doc.type, desc: "" };
                    const statusInfo = statusMap[doc.status] || statusMap.NOT_STARTED;
                    const StatusIcon = statusInfo.icon;
                    const isEditing = editingId === doc.id;

                    return (
                        <div 
                            key={doc.id}
                            className={clsx(
                                "bg-white rounded-2xl border p-5 shadow-sm transition-all duration-300 relative overflow-hidden",
                                isEditing ? "border-blue-500 ring-2 ring-blue-500/10" : "border-gray-100 hover:shadow-md"
                            )}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-start gap-4">
                                    <div className={clsx(
                                        "p-3 rounded-xl border text-white shadow-sm",
                                        doc.status === "COMPLETED" 
                                            ? "bg-emerald-600 border-emerald-500" 
                                            : doc.status === "IN_PROGRESS" 
                                                ? "bg-amber-500 border-amber-400" 
                                                : "bg-gray-400 border-gray-300"
                                    )}>
                                        <LucideFileText size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-base">{info.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{info.desc}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-center">
                                    <span className={clsx("inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm", statusInfo.color)}>
                                        <StatusIcon size={12} />
                                        {statusInfo.label}
                                    </span>
                                    {!isEditing && (
                                        <button
                                            onClick={() => handleEdit(doc)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                            title="Editar Documento"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Additional Information Drawer */}
                            {(doc.notes || doc.emissionDate || doc.fileUrl) && !isEditing && (
                                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    {doc.emissionDate && (
                                        <div>
                                            <span className="font-bold text-gray-400 uppercase tracking-wider block">Data de Emissão</span>
                                            <span className="font-medium text-gray-700 block mt-0.5">
                                                {new Date(doc.emissionDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                            </span>
                                        </div>
                                    )}
                                    {doc.fileUrl && (
                                        <div>
                                            <span className="font-bold text-gray-400 uppercase tracking-wider block">Arquivo Comprovativo</span>
                                            <div className="flex items-center gap-1.5 text-blue-600 font-semibold mt-0.5 hover:underline cursor-pointer">
                                                <Paperclip size={12} />
                                                <span>comprovante.pdf</span>
                                            </div>
                                        </div>
                                    )}
                                    {doc.notes && (
                                        <div className="sm:col-span-2">
                                            <span className="font-bold text-gray-400 uppercase tracking-wider block">Observações</span>
                                            <p className="font-medium text-gray-600 mt-1 leading-relaxed bg-gray-50/50 p-2.5 rounded-xl border border-gray-100">
                                                {doc.notes}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Editing Details Panel */}
                            {isEditing && (
                                <div className="mt-6 pt-5 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                            <select
                                                value={editStatus}
                                                onChange={(e) => setEditStatus(e.target.value)}
                                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                                            >
                                                <option value="NOT_STARTED">Não iniciado</option>
                                                <option value="IN_PROGRESS">Em andamento</option>
                                                <option value="COMPLETED">Concluído</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Data de Emissão</label>
                                            <input
                                                type="date"
                                                value={editEmissionDate}
                                                onChange={(e) => setEditEmissionDate(e.target.value)}
                                                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                            />
                                        </div>
                                    </div>

                                    {/* Mock file upload */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Upload de Comprovativo</label>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 cursor-pointer shadow-sm transition-colors">
                                                <Upload size={14} />
                                                Selecionar Arquivo
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                                                />
                                            </label>
                                            {fileName && (
                                                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 bg-green-50 border border-green-100 px-2.5 py-1 rounded-lg">
                                                    <Paperclip size={12} />
                                                    {fileName}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Observações</label>
                                        <textarea
                                            rows={2}
                                            value={editNotes}
                                            onChange={(e) => setEditNotes(e.target.value)}
                                            placeholder="Ex: Fui à Loja do Cidadão, agendado para o dia X..."
                                            className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2.5 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            disabled={isLoading}
                                            className="px-3.5 py-1.5 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSave(doc.id)}
                                            disabled={isLoading}
                                            className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm disabled:opacity-50 transition-all"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin w-3 h-3" /> : <Save className="w-3 h-3" />}
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* General Info Sidecard */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                    Guia de Burocracia 🇵🇹
                </h3>
                
                <div className="space-y-4 text-xs leading-relaxed text-gray-600">
                    <div>
                        <strong className="text-gray-900 block mb-1">NIF (Número Fiscal)</strong>
                        <p>Primeiro documento necessário. Sem ele você não consegue abrir conta bancária, assinar contratos de moradia, ou registrar chip de celular.</p>
                    </div>

                    <div>
                        <strong className="text-gray-900 block mb-1">NISS (Segurança Social)</strong>
                        <p>Necessário para iniciar contrato de trabalho. A empresa pode solicitar ou você pode fazê-lo diretamente nos balcões da Segurança Social.</p>
                    </div>

                    <div>
                        <strong className="text-gray-900 block mb-1">Número de Utente</strong>
                        <p>Seu registro no Sistema de Saúde Pública. Dirija-se ao Centro de Saúde (Centro de Saúde) da sua área de residência munido de comprovativo de morada e NIF.</p>
                    </div>

                    <div>
                        <strong className="text-gray-900 block mb-1">Comprovativo de Morada</strong>
                        <p>Emitido pela Junta de Freguesia da sua área (geralmente exige 2 testemunhas que sejam eleitores locais) ou seu contrato de aluguel registrado nas Finanças.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
