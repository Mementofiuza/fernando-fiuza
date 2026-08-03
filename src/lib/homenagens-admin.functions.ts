import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin");
  if (error || !data || data.length === 0) throw new Error("Forbidden");
}

export const listarHomenagens = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("homenagens")
      .select("id,nome,mensagem,foto_url,aprovado,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;

    const rows = await Promise.all(
      (data ?? []).map(async (row) => {
        if (!row.foto_url) return { ...row, signedPhoto: null as string | null };
        const { data: signed } = await supabaseAdmin.storage
          .from("homenagens-fotos")
          .createSignedUrl(row.foto_url, 60 * 60);
        return { ...row, signedPhoto: signed?.signedUrl ?? null };
      }),
    );
    return rows;
  });

export const definirAprovacao = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid(), aprovado: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("homenagens")
      .update({ aprovado: data.aprovado })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const editarHomenagem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        nome: z.string().max(100).nullable(),
        mensagem: z.string().min(1).max(500),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("homenagens")
      .update({ nome: data.nome, mensagem: data.mensagem })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const excluirHomenagem = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin
      .from("homenagens")
      .select("foto_url")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await supabaseAdmin.from("homenagens").delete().eq("id", data.id);
    if (error) throw error;
    if (row?.foto_url) {
      await supabaseAdmin.storage.from("homenagens-fotos").remove([row.foto_url]);
    }
    return { ok: true };
  });
