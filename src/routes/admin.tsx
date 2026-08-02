import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Check, Trash2, LogOut, Quote, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDocumentos, AdminGaleria } from "@/components/admin/AdminConteudo";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Painel de administração" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

type Homenagem = {
  id: string;
  nome: string | null;
  mensagem: string;
  foto_url: string | null;
  aprovado: boolean;
  created_at: string;
  signedPhoto?: string | null;
};

const SECOES = [
  { key: "homenagens", label: "Homenagens" },
  { key: "artigos", label: "Artigos e Capítulos" },
  { key: "aulas", label: "Aulas e Palestras" },
  { key: "cronicas", label: "Crônicas e Cartas" },
  { key: "galeria", label: "Galeria e Imagens" },
] as const;

type SecaoKey = (typeof SECOES)[number]["key"];

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [secao, setSecao] = useState<SecaoKey>("homenagens");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate({ to: "/auth" });
        return;
      }
      const uid = sessionData.session.user.id;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin");
      setIsAdmin(!!roles && roles.length > 0);
      setChecking(false);
    })();
  }, [navigate]);

  async function sair() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="w-6 h-6 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-2xl text-primary">Acesso negado</h1>
          <div className="gold-rule-left mx-auto mt-3" />
          <p className="mt-4 text-sm text-muted-foreground">
            Sua conta não tem permissão de administrador.
          </p>
          <button onClick={sair} className="mt-6 text-xs uppercase tracking-[0.2em] text-gold hover:text-primary">
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">Administração</span>
          <h1 className="mt-2 font-serif text-3xl md:text-4xl text-primary">Painel do site</h1>
          <div className="gold-rule-left mt-4" />
        </div>
        <button
          onClick={sair}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="mt-10 flex gap-2 border-b border-border overflow-x-auto">
        {SECOES.map((s) => (
          <button
            key={s.key}
            onClick={() => setSecao(s.key)}
            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-colors ${
              secao === s.key ? "text-primary border-b-2 border-gold" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {secao === "homenagens" && <Homenagens />}
        {secao === "artigos" && <AdminDocumentos secao="artigos" titulo="Artigos e Capítulos de livros" />}
        {secao === "aulas" && <AdminDocumentos secao="aulas" titulo="Aulas e Palestras" />}
        {secao === "cronicas" && <AdminDocumentos secao="cronicas" titulo="Crônicas e Cartas" />}
        {secao === "galeria" && <AdminGaleria />}
      </div>
    </div>
  );
}

function Homenagens() {
  const [tab, setTab] = useState<"pendentes" | "aprovadas">("pendentes");
  const [items, setItems] = useState<Homenagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; nome: string; mensagem: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("homenagens")
      .select("id,nome,mensagem,foto_url,aprovado,created_at")
      .eq("aprovado", tab === "aprovadas")
      .order("created_at", { ascending: false });
    const withUrls = await Promise.all(
      (data ?? []).map(async (row) => {
        if (!row.foto_url) return { ...row, signedPhoto: null };
        const { data: signed } = await supabase.storage
          .from("homenagens-fotos")
          .createSignedUrl(row.foto_url, 60 * 60);
        return { ...row, signedPhoto: signed?.signedUrl ?? null };
      }),
    );
    setItems(withUrls);
    setLoading(false);
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  async function aprovar(id: string) {
    setActing(id);
    await supabase.from("homenagens").update({ aprovado: true }).eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActing(null);
  }

  async function reprovar(id: string) {
    setActing(id);
    await supabase.from("homenagens").update({ aprovado: false }).eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActing(null);
  }

  async function salvarEdicao() {
    if (!editing) return;
    setActing(editing.id);
    setErro(null);
    const { error } = await supabase
      .from("homenagens")
      .update({ nome: editing.nome.trim() || null, mensagem: editing.mensagem.trim() })
      .eq("id", editing.id);
    setActing(null);
    if (error) { setErro(error.message); return; }
    setItems((prev) =>
      prev.map((i) => (i.id === editing.id ? { ...i, nome: editing.nome.trim() || null, mensagem: editing.mensagem.trim() } : i)),
    );
    setEditing(null);
  }

  async function excluir(id: string, foto_url: string | null) {
    if (!confirm("Excluir esta homenagem definitivamente?")) return;
    setActing(id);
    await supabase.from("homenagens").delete().eq("id", id);
    if (foto_url) await supabase.storage.from("homenagens-fotos").remove([foto_url]);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActing(null);
  }

  return (
    <div>
      <div className="flex gap-2 border-b border-border">
        {(["pendentes", "aprovadas"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === t ? "text-primary border-b-2 border-gold" : "text-muted-foreground hover:text-primary"
            }`}
          >
            {t === "pendentes" ? "Pendentes" : "Aprovadas"}
          </button>
        ))}
      </div>

      {erro && <p className="mt-4 text-sm text-destructive">{erro}</p>}

      {loading ? (
        <div className="mt-10 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          {tab === "pendentes"
            ? "Nenhuma homenagem aguardando moderação."
            : "Nenhuma homenagem aprovada até o momento."}
        </p>
      ) : (
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {items.map((h) => (
            <article key={h.id} className="bg-card border border-border p-6 flex flex-col">
              {h.signedPhoto && (
                <div className="aspect-[4/3] overflow-hidden mb-5 -mx-6 -mt-6 bg-muted">
                  <img src={h.signedPhoto} alt={`Foto enviada por ${h.nome ?? "visitante anônimo"}`} className="w-full h-full object-cover" />
                </div>
              )}

              {editing?.id === h.id ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Editando</span>
                    <button onClick={() => setEditing(null)} aria-label="Cancelar" className="text-muted-foreground hover:text-primary">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    value={editing.nome}
                    onChange={(e) => setEditing({ ...editing, nome: e.target.value })}
                    placeholder="Nome"
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                  <textarea
                    value={editing.mensagem}
                    onChange={(e) => setEditing({ ...editing, mensagem: e.target.value })}
                    rows={6}
                    className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  />
                  <button
                    onClick={salvarEdicao}
                    disabled={acting === h.id}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground disabled:opacity-60"
                  >
                    {acting === h.id && <Loader2 className="w-4 h-4 animate-spin" />} Salvar
                  </button>
                </div>
              ) : (
                <>
                  <Quote className="w-5 h-5 text-gold" />
                  <p className="mt-3 font-serif text-primary leading-relaxed whitespace-pre-line">{h.mensagem}</p>
                  <div className="mt-5 pt-4 border-t border-border">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">— {h.nome?.trim() || "Anônimo"}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{new Date(h.created_at).toLocaleString("pt-BR")}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {!h.aprovado ? (
                      <button
                        onClick={() => aprovar(h.id)}
                        disabled={acting === h.id}
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60"
                      >
                        {acting === h.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Aprovar
                      </button>
                    ) : (
                      <button
                        onClick={() => reprovar(h.id)}
                        disabled={acting === h.id}
                        className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold disabled:opacity-60"
                      >
                        Ocultar
                      </button>
                    )}
                    <button
                      onClick={() => setEditing({ id: h.id, nome: h.nome ?? "", mensagem: h.mensagem })}
                      className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold"
                    >
                      <Pencil className="w-4 h-4" /> Editar
                    </button>
                    <button
                      onClick={() => excluir(h.id, h.foto_url)}
                      disabled={acting === h.id}
                      className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-60"
                    >
                      <Trash2 className="w-4 h-4" /> Excluir
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
