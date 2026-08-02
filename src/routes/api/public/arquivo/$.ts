import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/arquivo/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const splat = (params as Record<string, string>)["_splat"] ?? "";
        const path = decodeURIComponent(splat);
        if (!path || path.includes("..")) {
          return new Response("Arquivo inválido", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("conteudo").download(path);
        if (error || !data) {
          return new Response("Arquivo não encontrado", { status: 404 });
        }

        const url = new URL(request.url);
        const wantsDownload = url.searchParams.get("download") === "1";
        const filename = path.split("/").pop() ?? "arquivo";
        const type = data.type || "application/octet-stream";

        return new Response(data, {
          headers: {
            "Content-Type": type,
            "Cache-Control": "public, max-age=3600",
            "Content-Disposition": `${wantsDownload ? "attachment" : "inline"}; filename="${filename.replace(/"/g, "")}"`,
          },
        });
      },
    },
  },
});
