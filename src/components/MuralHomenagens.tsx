import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, ImagePlus, Quote, Loader2 } from "lucide-react";

type Homenagem = {
  id: string;
  nome: string | null;
  mensagem: string;
  foto_url: string | null;
  created_at: string;
  signedPhoto?: string | null;
};

const ACCEPTED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;

export function MuralHomenagens() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Homenagem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("homenagens")
        .select("id,nome,mensagem,foto_url,created_at")
        .eq("aprovado", true)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      if (error || !data) {
        setLoading(false);
        return;
      }
      const withUrls = await Promise.all(
        data.map(async (row) => {
          if (!row.foto_url) return { ...row, signedPhoto: null };
          const { data: signed } = await supabase.storage
            .from("homenagens-fotos")
            .createSignedUrl(row.foto_url, 60 * 60 * 24);
          return { ...row, signedPhoto: signed?.signedUrl ?? null };
        }),
      );
      if (!cancelled) {
        setItems(withUrls);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const msg = mensagem.trim();
    if (!msg) {
      setError("Escreva uma mensagem antes de enviar.");
      return;
    }
    if (msg.length > 500) {
      setError("A mensagem deve ter no máximo 500 caracteres.");
      return;
    }
    if (foto) {
      if (!ACCEPTED.includes(foto.type)) {
        setError("Formato de imagem inválido. Use .jpg, .jpeg, .png ou .webp.");
        return;
      }
      if (foto.size > MAX_SIZE) {
        setError("A imagem deve ter no máximo 5 MB.");
        return;
      }
    }

    setSubmitting(true);
    try {
      let foto_url: string | null = null;
      if (foto) {
        const ext = foto.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("homenagens-fotos")
          .upload(path, foto, { contentType: foto.type, upsert: false });
        if (upErr) throw upErr;
        foto_url = path;
      }
      const { error: insErr } = await supabase.from("homenagens").insert({
        nome: nome.trim() || null,
        mensagem: msg,
        foto_url,
      });
      if (insErr) throw insErr;
      setSent(true);
      setNome("");
      setMensagem("");
      setFoto(null);
    } catch (err) {
      console.error(err);
      setError("Não foi possível enviar sua homenagem. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-24">
      <div className="max-w-3xl">
        <span className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
          Deixe sua mensagem
        </span>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl text-primary">
          Compartilhe uma homenagem
        </h2>
        <div className="gold-rule-left mt-4" />
        <p className="mt-5 text-muted-foreground leading-relaxed">
          Escreva uma memória, um agradecimento ou uma palavra em honra ao Dr.
          Fernando. Se desejar, envie também uma fotografia.
        </p>
      </div>

      <div className="mt-10 grid md:grid-cols-[1.1fr_1fr] gap-10 items-start">
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border p-8 reveal"
        >
          {sent ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 rounded-full bg-gold/15 grid place-items-center mx-auto">
                <Send className="w-6 h-6 text-gold" />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-primary">
                Homenagem recebida
              </h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Obrigado por compartilhar sua memória. Sua mensagem será
                revisada pela família antes de aparecer publicamente no mural.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-8 text-xs uppercase tracking-[0.2em] text-gold hover:text-primary transition-colors"
              >
                Enviar outra
              </button>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="hom-nome" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Nome (opcional)
                </label>
                <input
                  id="hom-nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={100}
                  className="mt-2 w-full border-b border-border bg-transparent py-2.5 outline-none focus:border-gold transition-colors"
                />
              </div>
              <div className="mt-6">
                <label htmlFor="hom-msg" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Mensagem
                </label>
                <textarea
                  id="hom-msg"
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  required
                  rows={6}
                  maxLength={500}
                  className="mt-2 w-full border border-border bg-background p-3 text-sm outline-none focus:border-gold transition-colors resize-none"
                />
                <p className="mt-1 text-[11px] text-muted-foreground text-right">
                  {mensagem.length}/500
                </p>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="hom-foto"
                  className="inline-flex items-center gap-2 cursor-pointer text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold transition-colors"
                >
                  <ImagePlus className="w-4 h-4" />
                  {foto ? "Trocar foto" : "Anexar foto (opcional)"}
                </label>
                <input
                  id="hom-foto"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                />
                {foto && (
                  <p className="mt-2 text-xs text-muted-foreground truncate">
                    {foto.name}
                  </p>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  .jpg, .jpeg, .png ou .webp — até 5 MB.
                </p>
              </div>

              {error && (
                <p className="mt-4 text-sm text-destructive">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Enviando…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Enviar homenagem
                  </>
                )}
              </button>
              <p className="mt-4 text-[11px] text-muted-foreground leading-relaxed">
                Sua mensagem será revisada pela família antes de aparecer no
                mural público.
              </p>
            </>
          )}
        </form>

        <aside className="p-7 glass-card">
          <Quote className="w-7 h-7 text-gold" />
          <p className="mt-4 font-serif text-lg text-primary leading-relaxed">
            "Cada palavra deixada aqui ajuda a manter viva a memória de quem
            tanto ensinou pelo exemplo."
          </p>
        </aside>
      </div>

      <div className="mt-20">
        <h3 className="font-serif text-2xl text-primary">
          Homenagens do público
        </h3>
        <div className="gold-rule-left mt-4" />

        {loading ? (
          <div className="mt-10 flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Carregando…
          </div>
        ) : items.length === 0 ? (
          <p className="mt-8 text-muted-foreground">
            Ainda não há homenagens aprovadas. Seja o primeiro a compartilhar
            uma memória.
          </p>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((h) => (
              <article
                key={h.id}
                className="bg-card border border-border p-6 hover-lift flex flex-col"
              >
                {h.signedPhoto && (
                  <div className="aspect-[4/3] overflow-hidden mb-5 -mx-6 -mt-6">
                    <img
                      src={h.signedPhoto}
                      alt={`Foto enviada por ${h.nome ?? "visitante anônimo"}`}
                      loading="lazy"
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
                    {new Date(h.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
