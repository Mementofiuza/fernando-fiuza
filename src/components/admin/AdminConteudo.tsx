import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Pencil, Trash2, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Documento, GaleriaImagem, Secao } from "@/lib/conteudo";
import { fetchDocumentos, fetchGaleria } from "@/lib/conteudo";

function inputCls() {
  return "w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold";
}

async function uploadArquivo(file: File, pasta: string): Promise<string> {
  const clean = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const path = `${pasta}/${Date.now()}-${clean}`;
  const { error } = await supabase.storage.from("conteudo").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return `/api/public/arquivo/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/* ---------------- Documentos (Artigos / Aulas / Crônicas) ---------------- */

type DocForm = { id?: string; titulo: string; url: string; categoria: string; ano: string; ordem: number };

export function AdminDocumentos({ secao, titulo }: { secao: Secao; titulo: string }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["documentos", secao], queryFn: () => fetchDocumentos(secao) });
  const [form, setForm] = useState<DocForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const items: Documento[] = data ?? [];

  function novo() {
    setErro(null);
    setForm({ titulo: "", url: "", categoria: "", ano: "", ordem: items.length });
  }

  function editar(d: Documento) {
    setErro(null);
    setForm({ id: d.id, titulo: d.titulo, url: d.url, categoria: d.categoria ?? "", ano: d.ano ?? "", ordem: d.ordem });
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
      ordem: Number(form.ordem) || 0,
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
      setForm({ ...form, url, titulo: form.titulo || file.name.replace(/\.[^.]+$/, "") });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no envio do arquivo.");
    }
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-xl text-primary">{titulo}</h2>
        <button
          onClick={novo}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar
        </button>
      </div>

      {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}

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
            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ordem</label>
              <input type="number" className={inputCls()} value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} />
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
        <div className="mt-8 divide-y divide-border border border-border bg-card">
          {items.length === 0 && <p className="p-6 text-muted-foreground">Nenhum item cadastrado.</p>}
          {items.map((d) => (
            <div key={d.id} className="p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-serif text-primary">{d.titulo}</p>
                <p className="text-[11px] text-muted-foreground break-all">
                  {d.categoria ? `${d.categoria} · ` : ""}{d.ano ? `${d.ano} · ` : ""}ordem {d.ordem}
                </p>
                <a href={d.url} target="_blank" rel="noreferrer" className="text-[11px] text-gold break-all hover:underline">{d.url}</a>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => editar(d)} aria-label="Editar" className="p-2 border border-border hover:border-gold text-muted-foreground hover:text-primary">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => excluir(d.id)} aria-label="Excluir" className="p-2 border border-border hover:border-destructive text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Galeria ---------------- */

type ImgForm = { id?: string; titulo: string; url: string; ordem: number };

export function AdminGaleria() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["galeria"], queryFn: fetchGaleria });
  const [form, setForm] = useState<ImgForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const items: GaleriaImagem[] = data ?? [];

  async function salvar() {
    if (!form || !form.titulo.trim() || !form.url.trim()) {
      setErro("Preencha o título e a imagem/link.");
      return;
    }
    setSaving(true);
    setErro(null);
    const payload = { titulo: form.titulo.trim(), url: form.url.trim(), ordem: Number(form.ordem) || 0 };
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
      setForm({ ...form, url, titulo: form.titulo || file.name.replace(/\.[^.]+$/, "") });
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Falha no envio da imagem.");
    }
    setUploading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="font-serif text-xl text-primary">Galeria e Imagens</h2>
        <button
          onClick={() => { setErro(null); setForm({ titulo: "", url: "", ordem: items.length }); }}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors"
        >
          <Plus className="w-4 h-4" /> Adicionar imagem
        </button>
      </div>

      {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}

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
          <div className="max-w-[180px]">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ordem</label>
            <input type="number" className={inputCls()} value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} />
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
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((img) => (
            <article key={img.id} className="bg-card border border-border overflow-hidden flex flex-col">
              <img src={img.url} alt={img.titulo} className="w-full aspect-[4/3] object-cover bg-muted" />
              <div className="p-4 flex-1">
                <p className="font-serif text-primary text-sm">{img.titulo}</p>
                <p className="text-[11px] text-muted-foreground">ordem {img.ordem}</p>
              </div>
              <div className="p-4 pt-0 flex gap-2">
                <button
                  onClick={() => { setErro(null); setForm({ id: img.id, titulo: img.titulo, url: img.url, ordem: img.ordem }); }}
                  className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold"
                >
                  <Pencil className="w-4 h-4" /> Editar
                </button>
                <button
                  onClick={() => excluir(img.id)}
                  className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive hover:border-destructive"
                >
                  <Trash2 className="w-4 h-4" /> Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
