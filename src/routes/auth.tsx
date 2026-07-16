import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Entrar — Área restrita" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        setMsg("Conta criada. Peça ao administrador para conceder acesso.");
      }
    } catch (e: any) {
      setErr(e.message || "Erro ao autenticar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 py-24">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-card border border-border p-8">
        <h1 className="font-serif text-2xl text-primary">Área restrita</h1>
        <div className="gold-rule-left mt-3" />
        <p className="mt-4 text-sm text-muted-foreground">
          {mode === "signin" ? "Entre para acessar a moderação de homenagens." : "Crie sua conta administrativa."}
        </p>

        <div className="mt-6">
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2.5 outline-none focus:border-gold"
          />
        </div>
        <div className="mt-5">
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Senha</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2.5 outline-none focus:border-gold"
          />
        </div>

        {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
        {msg && <p className="mt-4 text-sm text-gold">{msg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full inline-flex justify-center items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </button>

        <button
          type="button"
          onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(null); setMsg(null); }}
          className="mt-5 w-full text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold"
        >
          {mode === "signin" ? "Criar nova conta" : "Já tenho conta — Entrar"}
        </button>
      </form>
    </div>
  );
}
