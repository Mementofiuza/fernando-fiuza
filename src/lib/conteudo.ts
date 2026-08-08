import { supabase } from "@/integrations/supabase/client";

export type Secao = "artigos" | "aulas" | "cronicas";

export type Documento = {
  id: string;
  secao: Secao;
  titulo: string;
  url: string;
  categoria: string | null;
  ano: string | null;
  ordem: number;
};

export type GaleriaImagem = {
  id: string;
  titulo: string;
  url: string;
  ordem: number;
  album_id: string | null;
};

export type GaleriaAlbum = {
  id: string;
  titulo: string;
  ordem: number;
};

export async function fetchDocumentos(secao: Secao): Promise<Documento[]> {
  const { data, error } = await supabase
    .from("documentos")
    .select("id,secao,titulo,url,categoria,ano,ordem")
    .eq("secao", secao)
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Documento[];
}

export async function fetchGaleria(): Promise<GaleriaImagem[]> {
  const { data, error } = await supabase
    .from("galeria_imagens")
    .select("id,titulo,url,ordem,album_id")
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as GaleriaImagem[];
}

export async function fetchAlbuns(): Promise<GaleriaAlbum[]> {
  const { data, error } = await supabase
    .from("galeria_albuns")
    .select("id,titulo,ordem")
    .order("ordem", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as GaleriaAlbum[];
}

/** Baixa o arquivo direto no navegador, sem abrir outra aba. */
export async function baixarArquivo(url: string, nome: string) {
  const safeName = `${nome.replace(/[\\/:*?"<>|]+/g, " ").trim().slice(0, 120) || "arquivo"}.pdf`;
  try {
    const href = url.startsWith("/") && url.includes("/api/public/arquivo/")
      ? `${url}${url.includes("?") ? "&" : "?"}download=1`
      : url;
    const res = await fetch(href);
    if (!res.ok) throw new Error("falha");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = safeName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);
  } catch {
    const a = document.createElement("a");
    a.href = url;
    a.download = safeName;
    a.target = "_blank";
    a.rel = "noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}
