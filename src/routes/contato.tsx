import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Memorial Dr. Fernando Fiuza" },
      { name: "description", content: "Entre em contato para enviar homenagens, depoimentos, fotos ou documentos relacionados ao acervo do Dr. Fernando Fiuza." },
      { property: "og:title", content: "Contato" },
      { property: "og:description", content: "Fale com os mantenedores do memorial." },
      { property: "og:url", content: "https://fernando-fiuza.lovable.app/contato" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://fernando-fiuza.lovable.app/contato" }],
  }),
  component: Contato,
});


function Contato() {
  const [sent, setSent] = useState(false);

  return (
    <PageShell
      eyebrow="Contato"
      title="Compartilhe sua memória."
      intro="Envie depoimentos, fotos, documentos ou mensagens em homenagem ao Dr. Fiuza. Cada contribuição enriquece este memorial."
    >
      <div className="grid md:grid-cols-[1fr_1.4fr] gap-12">
        <div className="space-y-6 reveal">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 grid place-items-center bg-primary/5 border border-gold/40 text-gold shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">E-mail</p>
              <a href="mailto:contato@fernandofiuza.com.br" className="font-serif text-lg text-primary hover:text-gold transition-colors story-link">
                contato@fernandofiuza.com.br
              </a>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 grid place-items-center bg-primary/5 border border-gold/40 text-gold shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Origem</p>
              <p className="font-serif text-lg text-primary">Belém, Pará — Brasil</p>
            </div>
          </div>

          <div className="mt-10 p-7 glass-card">
            <p className="font-serif text-lg text-primary leading-relaxed">
              "Memórias verdadeiras não se desfazem com o tempo — apenas
              encontram novas formas de continuar."
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          className="bg-card border border-border p-8 reveal"
          style={{ animationDelay: "0.15s" }}
        >
          {sent ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-gold/15 grid place-items-center mx-auto">
                <Send className="w-6 h-6 text-gold" />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-primary">Mensagem enviada</h3>
              <p className="mt-2 text-muted-foreground">Obrigado por compartilhar sua memória conosco.</p>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contato-nome" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nome</label>
                  <input id="contato-nome" name="nome" required className="mt-2 w-full border-b border-border bg-transparent py-2.5 outline-none focus:border-gold transition-colors" />
                </div>
                <div>
                  <label htmlFor="contato-email" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">E-mail</label>
                  <input id="contato-email" name="email" type="email" required className="mt-2 w-full border-b border-border bg-transparent py-2.5 outline-none focus:border-gold transition-colors" />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="contato-assunto" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Assunto</label>
                <input id="contato-assunto" name="assunto" className="mt-2 w-full border-b border-border bg-transparent py-2.5 outline-none focus:border-gold transition-colors" />
              </div>
              <div className="mt-6">
                <label htmlFor="contato-mensagem" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Mensagem ou homenagem</label>
                <textarea id="contato-mensagem" name="mensagem" required rows={6} className="mt-2 w-full border border-border bg-background p-3 text-sm outline-none focus:border-gold transition-colors resize-none" />
              </div>

              <button type="submit" className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 text-sm uppercase tracking-[0.18em] hover:bg-gold hover:text-gold-foreground transition-colors">
                <Send className="w-4 h-4" /> Enviar mensagem
              </button>
            </>
          )}
        </form>
      </div>
    </PageShell>
  );
}
