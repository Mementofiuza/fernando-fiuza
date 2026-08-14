import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  Check,
  Trash2,
  LogOut,
  Quote,
  Pencil,
  X,
  MessageSquareHeart,
  FileText,
  GraduationCap,
  PenLine,
  Images,
  Clock,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Users,
  ShieldOff,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminDocumentos, AdminGaleria } from "@/components/admin/AdminConteudo";
import {
  listarHomenagens,
  definirAprovacao,
  editarHomenagem,
  excluirHomenagem,
} from "@/lib/homenagens-admin.functions";
import { listarUsuarios, definirAdmin } from "@/lib/usuarios-admin.functions";

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
  { key: "homenagens", label: "Homenagens", icon: MessageSquareHeart },
  { key: "artigos", label: "Artigos e Capítulos", icon: FileText },
  { key: "aulas", label: "Aulas e Palestras", icon: GraduationCap },
  { key: "cronicas", label: "Crônicas e Cartas", icon: PenLine },
  { key: "galeria", label: "Galeria e Imagens", icon: Images },
  { key: "usuarios", label: "Usuários e Permissões", icon: Users },
] as const;

type SecaoKey = (typeof SECOES)[number]["key"];

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [secao, setSecao] = useState<SecaoKey>("homenagens");

  useEffect(() => {
    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        navigate({ to: "/auth" });
        return;
      }
      const uid = sessionData.session.user.id;
      setEmail(sessionData.session.user.email ?? null);
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

  const ativa = SECOES.find((s) => s.key === secao)!;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 flex-wrap bg-card/80 backdrop-blur-sm border border-border rounded-xl px-6 py-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-gold/15 grid place-items-center">
              <ShieldCheck className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-medium">Administração</p>
              <h1 className="font-serif text-2xl text-primary leading-tight">Painel do site</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {email && <span className="hidden sm:block text-xs text-muted-foreground">{email}</span>}
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-5 py-2 text-xs uppercase tracking-[0.18em] shadow-sm hover:bg-gold hover:text-gold-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao site
            </Link>
            <button
              onClick={sair}
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </header>

        <div className="mt-8 grid lg:grid-cols-[240px_1fr] gap-8 items-start">
          {/* Sidebar */}
          <nav className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-3 flex lg:flex-col gap-1 overflow-x-auto shadow-sm">
            {SECOES.map((s) => {
              const Icon = s.icon;
              const active = secao === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSecao(s.key)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left text-sm whitespace-nowrap transition-colors ${
                    active
                      ? "bg-gold/15 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-gold" : ""}`} />
                  {s.label}
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <main className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-6 md:p-8 shadow-sm min-h-[60vh]">
            <div className="flex items-center gap-3 pb-5 border-b border-border">
              <ativa.icon className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-xl text-primary">{ativa.label}</h2>
            </div>
            <div className="mt-8">
              {secao === "homenagens" && <Homenagens />}
              {secao === "artigos" && <AdminDocumentos secao="artigos" titulo="Artigos e Capítulos de livros" />}
              {secao === "aulas" && <AdminDocumentos secao="aulas" titulo="Aulas e Palestras" />}
              {secao === "cronicas" && <AdminDocumentos secao="cronicas" titulo="Crônicas e Cartas" />}
              {secao === "galeria" && <AdminGaleria />}
              {secao === "usuarios" && <Usuarios />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function Homenagens() {
  const [tab, setTab] = useState<"pendentes" | "aprovadas">("pendentes");
  const [all, setAll] = useState<Homenagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [editing, setEditing] = useState<{ id: string; nome: string; mensagem: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      const rows = (await listarHomenagens()) as Homenagem[];
      setAll(rows);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível carregar as homenagens.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const pendentes = all.filter((h) => !h.aprovado);
  const aprovadas = all.filter((h) => h.aprovado);
  const items = tab === "pendentes" ? pendentes : aprovadas;

  async function alterarAprovacao(id: string, aprovado: boolean) {
    setActing(id);
    setErro(null);
    try {
      await definirAprovacao({ data: { id, aprovado } });
      setAll((prev) => prev.map((i) => (i.id === id ? { ...i, aprovado } : i)));
    } catch (e) {
      console.error(e);
      setErro("Não foi possível atualizar esta homenagem.");
    } finally {
      setActing(null);
    }
  }

  async function salvarEdicao() {
    if (!editing) return;
    setActing(editing.id);
    setErro(null);
    try {
      const nome = editing.nome.trim() || null;
      const mensagem = editing.mensagem.trim();
      await editarHomenagem({ data: { id: editing.id, nome, mensagem } });
      setAll((prev) => prev.map((i) => (i.id === editing.id ? { ...i, nome, mensagem } : i)));
      setEditing(null);
    } catch (e) {
      console.error(e);
      setErro("Não foi possível salvar as alterações.");
    } finally {
      setActing(null);
    }
  }

  async function excluir(id: string) {
    if (!confirm("Excluir esta homenagem definitivamente?")) return;
    setActing(id);
    setErro(null);
    try {
      await excluirHomenagem({ data: { id } });
      setAll((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error(e);
      setErro("Não foi possível excluir esta homenagem.");
    } finally {
      setActing(null);
    }
  }

  const stats = [
    { label: "Pendentes", value: pendentes.length, icon: Clock },
    { label: "Aprovadas", value: aprovadas.length, icon: Check },
    { label: "Total", value: all.length, icon: MessageSquareHeart },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-border rounded-lg p-5 bg-card/70 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</span>
              <s.icon className="w-4 h-4 text-gold" />
            </div>
            <p className="mt-3 font-serif text-3xl text-primary">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex rounded-lg border border-border p-1 bg-background/60">
          {(["pendentes", "aprovadas"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-md text-xs uppercase tracking-[0.18em] transition-colors ${
                tab === t ? "bg-gold/20 text-primary font-medium" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t === "pendentes" ? `Pendentes (${pendentes.length})` : `Aprovadas (${aprovadas.length})`}
            </button>
          ))}
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </button>
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
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {items.map((h) => (
            <article key={h.id} className="bg-background/60 border border-border rounded-lg overflow-hidden flex flex-col">
              {h.signedPhoto && (
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={h.signedPhoto}
                    alt={`Foto enviada por ${h.nome ?? "visitante anônimo"}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
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
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                    />
                    <textarea
                      value={editing.mensagem}
                      onChange={(e) => setEditing({ ...editing, mensagem: e.target.value })}
                      rows={6}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                    />
                    <button
                      onClick={salvarEdicao}
                      disabled={acting === h.id}
                      className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground disabled:opacity-60"
                    >
                      {acting === h.id && <Loader2 className="w-4 h-4 animate-spin" />} Salvar
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <Quote className="w-5 h-5 text-gold" />
                      <span
                        className={`text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${
                          h.aprovado ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {h.aprovado ? "Publicada" : "Pendente"}
                      </span>
                    </div>
                    <p className="mt-3 font-serif text-primary leading-relaxed whitespace-pre-line">{h.mensagem}</p>
                    <div className="mt-5 pt-4 border-t border-border">
                      <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        — {h.nome?.trim() || "Anônimo"}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {new Date(h.created_at).toLocaleString("pt-BR")}
                      </p>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {!h.aprovado ? (
                        <button
                          onClick={() => alterarAprovacao(h.id, true)}
                          disabled={acting === h.id}
                          className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60"
                        >
                          {acting === h.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                          Aprovar
                        </button>
                      ) : (
                        <button
                          onClick={() => alterarAprovacao(h.id, false)}
                          disabled={acting === h.id}
                          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold disabled:opacity-60"
                        >
                          Ocultar
                        </button>
                      )}
                      <button
                        onClick={() => setEditing({ id: h.id, nome: h.nome ?? "", mensagem: h.mensagem })}
                        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-primary hover:border-gold"
                      >
                        <Pencil className="w-4 h-4" /> Editar
                      </button>
                      <button
                        onClick={() => excluir(h.id)}
                        disabled={acting === h.id}
                        className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
