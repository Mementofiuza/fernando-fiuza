import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, X, Upload, GripVertical, Layers } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import type { Documento, GaleriaImagem, Secao } from "@/lib/conteudo";
import { fetchDocumentos, fetchGaleria } from "@/lib/conteudo";

function inputCls() {
  return "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold";
}

async function uploadArquivo(file: File, pasta: string): Promise<string> {
  const clean = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const path = `${pasta}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${clean}`;
  const { error } = await supabase.storage.from("conteudo").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return `/api/public/arquivo/${path.split("/").map(encodeURIComponent).join("/")}`;
}

function tituloDoArquivo(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Envia vários arquivos em pequenos lotes, reportando progresso. */
async function enviarEmLote<T>(
  files: File[],
  pasta: string,
  criar: (item: { titulo: string; url: string; ordem: number }, index: number) => Promise<T>,
  ordemInicial: number,
  onProgress: (feitos: number, total: number) => void,
): Promise<string[]> {
  const erros: string[] = [];
  let feitos = 0;
  const LOTE = 4;
  for (let i = 0; i < files.length; i += LOTE) {
    const bloco = files.slice(i, i + LOTE);
    await Promise.all(
      bloco.map(async (file, j) => {
        const index = i + j;
        try {
          const url = await uploadArquivo(file, pasta);
          await criar({ titulo: tituloDoArquivo(file.name), url, ordem: ordemInicial + index }, index);
        } catch (err) {
          erros.push(`${file.name}: ${err instanceof Error ? err.message : "falha no envio"}`);
        } finally {
          feitos += 1;
          onProgress(feitos, files.length);
        }
      }),
    );
  }
  return erros;
}

function BarraProgresso({ feitos, total }: { feitos: number; total: number }) {
  return (
    <div className="mt-4 border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Enviando… {feitos} de {total}
      </p>
      <div className="mt-2 h-1.5 bg-muted overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-300"
          style={{ width: `${Math.round((feitos / Math.max(total, 1)) * 100)}%` }}
        />
      </div>
    </div>
  );
}

/* ---------------- Documentos (Artigos / Aulas / Crônicas) ---------------- */

type DocForm = { id?: string; titulo: string; url: string; categoria: string; ano: string };

function LinhaDocumento({
  d,
  onEditar,
  onExcluir,
}: {
  d: Documento;
  onEditar: (d: Documento) => void;
  onExcluir: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: d.id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`p-4 flex items-start gap-3 bg-card ${isDragging ? "opacity-70 shadow-[var(--shadow-elegant)] z-10 relative" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className="mt-1 p-1.5 text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-primary">{d.titulo}</p>
        <p className="text-[11px] text-muted-foreground break-all">
          {d.categoria ? `${d.categoria} · ` : ""}
          {d.ano ?? ""}
        </p>
        <a href={d.url} target="_blank" rel="noreferrer" className="text-[11px] text-gold break-all hover:underline">
          {d.url}
        </a>
      </div>
      <div className="flex gap-2 shrink-0">
        <button onClick={() => onEditar(d)} aria-label="Editar" className="p-2 border border-border hover:border-gold text-muted-foreground hover:text-primary">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => onExcluir(d.id)} aria-label="Excluir" className="p-2 border border-border hover:border-destructive text-muted-foreground hover:text-destructive">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function AdminDocumentos({ secao, titulo }: { secao: Secao; titulo: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["documentos", secao], queryFn: () => fetchDocumentos(secao) });
  const [form, setForm] = useState<DocForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [lista, setLista] = useState<Documento[]>([]);
  const [lote, setLote] = useState<{ feitos: number; total: number } | null>(null);

  useEffect(() => {
    setLista(data ?? []);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  );

  function novo() {
    setErro(null);
    setForm({ titulo: "", url: "", categoria: "", ano: "" });
  }

  function editar(d: Documento) {
    setErro(null);
    setForm({ id: d.id, titulo: d.titulo, url: d.url, categoria: d.categoria ?? "", ano: d.ano ?? "" });
  }

  async function salvar() {
    if (!form || !form.titulo.trim() || !form.url.trim()) {
      setErro("Preencha o título e o arquivo/link.");
      return;
    }
    setSaving(true);
    setErro(null);
    const payload = {
      secao,
      titulo: form.titulo.trim(),
      url: form.url.trim(),
      categoria: form.categoria.trim() || null,
      ano: form.ano.trim() || null,
      ...(form.id ? {} : { ordem: lista.length }),
    };
    const res = form.id
      ? await supabase.from("documentos").update(payload).eq("id", form.id)
      : await supabase.from("documentos").insert(payload);
    setSaving(false);
    if (res.error) {
      setErro(res.error.message);
      return;
    }
    setForm(null);
    qc.invalidateQueries({ queryKey: ["documentos", secao] });
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este item definitivamente?")) return;
    const { error } = await supabase.from("documentos").delete().eq("id", id);
    if (error) { setErro(error.message); return; }
    qc.invalidateQueries({ queryKey: ["documentos", secao] });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    setErro(null);
    try {
      const url = await uploadArquivo(file, secao);
      setForm({ ...form, url, titulo: form.titulo || tituloDoArquivo(file.name) });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no envio do arquivo.");
    }
    setUploading(false);
  }

  async function onFilesLote(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setErro(null);
    setLote({ feitos: 0, total: files.length });
    const erros = await enviarEmLote(
      files,
      secao,
      async (item) => {
        const { error } = await supabase.from("documentos").insert({ secao, ...item, categoria: null, ano: null });
        if (error) throw error;
      },
      lista.length,
      (feitos, total) => setLote({ feitos, total }),
    );
    setLote(null);
    if (erros.length) setErro(`${erros.length} arquivo(s) não enviados:\n${erros.join("\n")}`);
    qc.invalidateQueries({ queryKey: ["documentos", secao] });
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = lista.findIndex((i) => i.id === active.id);
    const newIndex = lista.findIndex((i) => i.id === over.id);
    const nova = arrayMove(lista, oldIndex, newIndex);
    setLista(nova);
    await Promise.all(
      nova.map((item, i) =>
        item.ordem === i ? Promise.resolve() : supabase.from("documentos").update({ ordem: i }).eq("id", item.id),
      ),
    );
    qc.invalidateQueries({ queryKey: ["documentos", secao] });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-xl text-primary">{titulo}</h2>
        <div className="flex gap-2 flex-wrap">
          <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] cursor-pointer hover:border-gold text-primary">
            <Layers className="w-4 h-4" /> Enviar vários PDFs
            <input type="file" accept="application/pdf" multiple className="hidden" onChange={onFilesLote} />
          </label>
          <button
            onClick={novo}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            <Plus className="w-4 h-4" /> Adicionar
          </button>
        </div>
      </div>

      {lote && <BarraProgresso feitos={lote.feitos} total={lote.total} />}
      {erro && <p className="mt-4 text-sm text-destructive whitespace-pre-line">{erro}</p>}

      {form && (
        <div className="mt-6 border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-primary">{form.id ? "Editar item" : "Novo item"}</h3>
            <button onClick={() => setForm(null)} aria-label="Fechar" className="text-muted-foreground hover:text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Título</label>
              <input className={inputCls()} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Categoria (opcional)</label>
              <input className={inputCls()} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} placeholder="Ex.: Artigos, Cartas…" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ano (opcional)</label>
              <input className={inputCls()} value={form.ano} onChange={(e) => setForm({ ...form, ano: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Arquivo PDF ou link</label>
              <input className={inputCls()} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://… ou envie um arquivo abaixo" />
              <label className="mt-3 inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] cursor-pointer hover:border-gold">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Enviar PDF
                <input type="file" accept="application/pdf" className="hidden" onChange={onFile} />
              </label>
            </div>
          </div>

          <button
            onClick={salvar}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Salvar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
        </div>
      ) : (
        <>
          {lista.length > 1 && (
            <p className="mt-8 mb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Arraste pela alça para mudar a ordem
            </p>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={lista.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-border border border-border bg-card">
                {lista.length === 0 && <p className="p-6 text-muted-foreground">Nenhum item cadastrado.</p>}
                {lista.map((d) => (
                  <LinhaDocumento key={d.id} d={d} onEditar={editar} onExcluir={excluir} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}

/* ---------------- Galeria ---------------- */

type ImgForm = { id?: string; titulo: string; url: string };

function CartaoImagem({
  img,
  onEditar,
  onExcluir,
}: {
  img: GaleriaImagem;
  onEditar: (img: GaleriaImagem) => void;
  onExcluir: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: img.id });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`bg-card border border-border overflow-hidden flex flex-col ${isDragging ? "opacity-70 shadow-[var(--shadow-elegant)]" : ""}`}
    >
      <div className="relative">
        <img src={img.url} alt={img.titulo} className="w-full aspect-[4/3] object-cover bg-muted" />
        <button
          {...attributes}
          {...listeners}
          aria-label="Arrastar para reordenar"
          className="absolute top-2 left-2 p-2 bg-background/90 border border-border text-muted-foreground hover:text-primary cursor-grab active:cursor-grabbing touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4 flex-1">
        <p className="font-serif text-primary text-sm">{img.titulo}</p>
      </div>
      <div className="p-4 pt-0 flex gap-2">
        <button
          onClick={() => onEditar(img)}
          className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold"
        >
          <Pencil className="w-4 h-4" /> Editar
        </button>
        <button
          onClick={() => onExcluir(img.id)}
          className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive hover:border-destructive"
        >
          <Trash2 className="w-4 h-4" /> Excluir
        </button>
      </div>
    </article>
  );
}

export function AdminGaleria() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["galeria"], queryFn: fetchGaleria });
  const [form, setForm] = useState<ImgForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [lista, setLista] = useState<GaleriaImagem[]>([]);
  const [lote, setLote] = useState<{ feitos: number; total: number } | null>(null);

  useEffect(() => {
    setLista(data ?? []);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  );

  async function salvar() {
    if (!form || !form.titulo.trim() || !form.url.trim()) {
      setErro("Preencha o título e a imagem/link.");
      return;
    }
    setSaving(true);
    setErro(null);
    const payload = {
      titulo: form.titulo.trim(),
      url: form.url.trim(),
      ...(form.id ? {} : { ordem: lista.length }),
    };
    const res = form.id
      ? await supabase.from("galeria_imagens").update(payload).eq("id", form.id)
      : await supabase.from("galeria_imagens").insert(payload);
    setSaving(false);
    if (res.error) { setErro(res.error.message); return; }
    setForm(null);
    qc.invalidateQueries({ queryKey: ["galeria"] });
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta imagem definitivamente?")) return;
    const { error } = await supabase.from("galeria_imagens").delete().eq("id", id);
    if (error) { setErro(error.message); return; }
    qc.invalidateQueries({ queryKey: ["galeria"] });
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !form) return;
    setUploading(true);
    setErro(null);
    try {
      const url = await uploadArquivo(file, "galeria");
      setForm({ ...form, url, titulo: form.titulo || tituloDoArquivo(file.name) });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no envio da imagem.");
    }
    setUploading(false);
  }

  async function onFilesLote(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setErro(null);
    setLote({ feitos: 0, total: files.length });
    const erros = await enviarEmLote(
      files,
      "galeria",
      async (item) => {
        const { error } = await supabase.from("galeria_imagens").insert(item);
        if (error) throw error;
      },
      lista.length,
      (feitos, total) => setLote({ feitos, total }),
    );
    setLote(null);
    if (erros.length) setErro(`${erros.length} arquivo(s) não enviados:\n${erros.join("\n")}`);
    qc.invalidateQueries({ queryKey: ["galeria"] });
  }

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = lista.findIndex((i) => i.id === active.id);
    const newIndex = lista.findIndex((i) => i.id === over.id);
    const nova = arrayMove(lista, oldIndex, newIndex);
    setLista(nova);
    await Promise.all(
      nova.map((item, i) =>
        item.ordem === i ? Promise.resolve() : supabase.from("galeria_imagens").update({ ordem: i }).eq("id", item.id),
      ),
    );
    qc.invalidateQueries({ queryKey: ["galeria"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-xl text-primary">Galeria e Imagens</h2>
        <div className="flex gap-2 flex-wrap">
          <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] cursor-pointer hover:border-gold text-primary">
            <Layers className="w-4 h-4" /> Enviar várias imagens
            <input type="file" accept="image/*" multiple className="hidden" onChange={onFilesLote} />
          </label>
          <button
            onClick={() => { setErro(null); setForm({ titulo: "", url: "" }); }}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors"
          >
            <Plus className="w-4 h-4" /> Adicionar imagem
          </button>
        </div>
      </div>

      {lote && <BarraProgresso feitos={lote.feitos} total={lote.total} />}
      {erro && <p className="mt-4 text-sm text-destructive whitespace-pre-line">{erro}</p>}

      {form && (
        <div className="mt-6 border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-primary">{form.id ? "Editar imagem" : "Nova imagem"}</h3>
            <button onClick={() => setForm(null)} aria-label="Fechar" className="text-muted-foreground hover:text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Título / legenda</label>
            <input className={inputCls()} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Imagem ou link</label>
            <input className={inputCls()} value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://… ou envie um arquivo abaixo" />
            <label className="mt-3 inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] cursor-pointer hover:border-gold">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Enviar imagem
              <input type="file" accept="image/*" className="hidden" onChange={onFile} />
            </label>
          </div>
          <button
            onClick={salvar}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />} Salvar
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
        </div>
      ) : (
        <>
          {lista.length > 1 && (
            <p className="mt-8 mb-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Arraste pela alça para mudar a ordem
            </p>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={lista.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {lista.map((img) => (
                  <CartaoImagem
                    key={img.id}
                    img={img}
                    onEditar={(i) => { setErro(null); setForm({ id: i.id, titulo: i.titulo, url: i.url }); }}
                    onExcluir={excluir}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </>
      )}
    </div>
  );
}
