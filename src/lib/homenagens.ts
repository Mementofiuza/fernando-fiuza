import { supabase } from "@/integrations/supabase/client";

export type HomenagemPublica = {
  id: string;
  nome: string | null;
  mensagem: string;
  foto_url: string | null;
  created_at: string;
  signedPhoto?: string | null;
};

const SUPABASE_URL = import.meta.env["VITE_SUPABASE_URL"] as string;
const SUPABASE_KEY = (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  import.meta.env["VITE_SUPABASE_ANON_KEY"]) as string;

/**
 * Lê as homenagens aprovadas sempre "frescas": requisição REST direta com
 * cache desativado, para que navegadores/CDN nunca devolvam uma lista antiga
 * depois de uma aprovação no painel.
 */
export async function fetchHomenagensAprovadas(limit?: number): Promise<HomenagemPublica[]> {
  const params = new URLSearchParams({
    select: "id,nome,mensagem,foto_url,created_at",
    aprovado: "eq.true",
    order: "created_at.desc",
  });
  if (limit) params.set("limit", String(limit));
  params.set("_", String(Date.now()));

  let rows: HomenagemPublica[] = [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/homenagens?${params.toString()}`, {
      cache: "no-store",
      headers: { apikey: SUPABASE_KEY, Accept: "application/json" },
    });
    if (!res.ok) throw new Error(String(res.status));
    rows = (await res.json()) as HomenagemPublica[];
  } catch {
    let query = supabase
      .from("homenagens")
      .select("id,nome,mensagem,foto_url,created_at")
      .eq("aprovado", true)
      .order("created_at", { ascending: false });
    if (limit) query = query.limit(limit);
    const { data } = await query;
    rows = (data ?? []) as HomenagemPublica[];
  }

  return Promise.all(
    rows.map(async (row) => {
      if (!row.foto_url) return { ...row, signedPhoto: null };
      const { data: signed } = await supabase.storage
        .from("homenagens-fotos")
        .createSignedUrl(row.foto_url, 60 * 60 * 24);
      return { ...row, signedPhoto: signed?.signedUrl ?? null };
    }),
  );
}
