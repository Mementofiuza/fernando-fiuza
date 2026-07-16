import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Check, Trash2, LogOut, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Moderação de homenagens" }, { name: "robots", content: "noindex" }] }),
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

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tab, setTab] = useState<"pendentes" | "aprovadas">("pendentes");
  const [items, setItems] = useState<Homenagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

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
      if (!roles || roles.length === 0) {
        setChecking(false);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(true);
      setChecking(false);
    })();
  }, [navigate]);

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

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function aprovar(id: string) {
    setActing(id);
    await supabase.from("homenagens").update({ aprovado: true }).eq("id", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActing(null);
  }

  async function excluir(id: string, foto_url: string | null) {
    if (!confirm("Excluir esta homenagem definitivamente?")) return;
    setActing(id);
    await supabase.from("homenagens").delete().eq("id", id);
    if (foto_url) {
      await supabase.storage.from("homenagens-fotos").remove([foto_url]);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActing(null);
  }

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
          <h1 className="mt-2 font-serif text-3xl md:text-4xl text-primary">Moderação de homenagens</h1>
          <div className="gold-rule-left mt-4" />
        </div>
        <button
          onClick={sair}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="mt-10 flex gap-2 border-b border-border">
        {(["pendentes", "aprovadas"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
              tab === t
                ? "text-primary border-b-2 border-gold"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {t === "pendentes" ? "Pendentes" : "Aprovadas"}
          </button>
        ))}
      </div>

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
                  <img
                    src={h.signedPhoto}
                    alt={`Foto enviada por ${h.nome ?? "visitante anônimo"}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Quote className="w-5 h-5 text-gold" />
              <p className="mt-3 font-serif text-primary leading-relaxed whitespace-pre-line">
                {h.mensagem}
              </p>
              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  — {h.nome?.trim() || "Anônimo"}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(h.created_at).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="mt-5 flex gap-2">
                {!h.aprovado && (
                  <button
                    onClick={() => aprovar(h.id)}
                    disabled={acting === h.id}
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60"
                  >
                    {acting === h.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Aprovar
                  </button>
                )}
                <button
                  onClick={() => excluir(h.id, h.foto_url)}
                  disabled={acting === h.id}
                  className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-60"
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
