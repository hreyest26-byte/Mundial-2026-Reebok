"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { BrandedPageHeader } from "@/components/brand/BrandedPageHeader";
import { FootballJersey } from "@/components/brand/FootballIcons";
import { cn, getInitials } from "@/lib/utils";

interface Profile {
  id: string;
  full_name: string;
  nickname: string;
  avatar_url: string | null;
  total_points: number;
  rank_position: number;
  exact_scores: number;
  correct_results: number;
}

export function PerfilClient({ profile, userId }: { profile: Profile; userId: string }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatar_url);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB.");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError(null);
    setSuccess(false);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setError("Error al subir la imagen. Intenta nuevamente.");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", userId);

    if (updateError) {
      setError("Imagen subida pero no se pudo guardar en el perfil.");
      setUploading(false);
      return;
    }

    setAvatarUrl(publicUrl);
    setPreview(null);
    setFile(null);
    setSuccess(true);
    setUploading(false);
  }

  function cancelPreview() {
    setPreview(null);
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const displaySrc = preview ?? avatarUrl ?? undefined;
  const showRank = profile.rank_position > 0;
  const rankProp =
    profile.rank_position === 1 ? (1 as const) :
    profile.rank_position === 2 ? (2 as const) :
    profile.rank_position === 3 ? (3 as const) :
    undefined;

  const plateBg =
    profile.rank_position === 1
      ? "bg-rb-gold text-rb-black"
      : profile.rank_position === 2
        ? "bg-rb-silver text-rb-black"
        : profile.rank_position === 3
          ? "bg-rb-bronze text-rb-white"
          : "bg-rb-800 text-rb-500 border border-rb-700";

  return (
    <div className="container mx-auto px-4 py-5 max-w-md">
      <BrandedPageHeader
        kicker="Reebok Player"
        title="Mi Perfil"
        subtitle="Tu identidad en el pool · Estadísticas y avatar"
        imagery="jersey"
      />

      {/* Avatar + jersey number plate */}
      <div className="relative overflow-hidden rb-card rounded-rb p-6 flex flex-col items-center gap-4 mb-4">
        {/* Decorative jersey watermark */}
        <div aria-hidden className="pointer-events-none absolute -left-8 -bottom-8 opacity-[0.05]">
          <FootballJersey size={180} color="#F5F4F0" />
        </div>

        {/* Jersey number plate flotando arriba del avatar */}
        {showRank && (
          <div className="relative">
            <div
              className={cn(
                "absolute -top-2 -right-2 z-10 font-display font-black leading-none tabular-nums rounded-rb px-2 py-1 min-w-[32px] text-center shadow-card",
                plateBg
              )}
            >
              <span className="text-base">{profile.rank_position}</span>
            </div>
            <div className={cn(
              "w-24 h-24 rounded-full overflow-hidden bg-rb-800 border-2 border-rb-700 flex items-center justify-center relative z-0",
              rankProp === 1 && "ring-2 ring-rb-gold ring-offset-2 ring-offset-rb-900",
              rankProp === 2 && "ring-2 ring-rb-silver ring-offset-2 ring-offset-rb-900",
              rankProp === 3 && "ring-2 ring-rb-bronze ring-offset-2 ring-offset-rb-900",
            )}>
              {displaySrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displaySrc} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display font-bold text-rb-500 text-h2">
                  {getInitials(profile.full_name)}
                </span>
              )}
            </div>
          </div>
        )}

        {!showRank && (
          <div className="w-24 h-24 rounded-full overflow-hidden bg-rb-800 border-2 border-rb-700 flex items-center justify-center relative">
            {displaySrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={displaySrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display font-bold text-rb-500 text-h2">
                {getInitials(profile.full_name)}
              </span>
            )}
            {preview && (
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rb-red flex items-center justify-center z-10">
                <span className="text-white text-[10px] font-bold">!</span>
              </div>
            )}
          </div>
        )}

        {/* Nombre destacado */}
        <div className="text-center relative">
          <p className="font-display font-black text-rb-white text-h3 uppercase italic leading-none tracking-tight">
            {profile.nickname}
          </p>
          <p className="text-small text-rb-500 mt-1">{profile.full_name}</p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

        {!preview ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative px-5 py-2 rounded-rb bg-rb-800 border border-rb-700 text-rb-white font-display font-bold uppercase text-[0.7rem] tracking-wider hover:bg-rb-700 transition-colors active:scale-[0.98]"
          >
            {avatarUrl ? "Cambiar foto" : "Subir foto"}
          </button>
        ) : (
          <div className="flex gap-2 w-full relative">
            <button
              type="button"
              onClick={cancelPreview}
              disabled={uploading}
              className="flex-1 py-2 rounded-rb bg-rb-800 border border-rb-700 text-rb-500 font-display font-bold uppercase text-[0.7rem] tracking-wider hover:bg-rb-700 transition-colors disabled:opacity-40 active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 py-2 rounded-rb bg-rb-red text-white font-display font-bold uppercase text-[0.7rem] tracking-wider hover:bg-rb-red/90 transition-colors disabled:opacity-60 active:scale-[0.98]"
            >
              {uploading ? "Subiendo…" : "Guardar foto"}
            </button>
          </div>
        )}

        {error && <p className="text-small text-rb-red text-center relative">{error}</p>}
        {success && <p className="text-small text-rb-blue text-center relative">✓ Foto actualizada</p>}

        <p className="text-[0.65rem] text-rb-700 text-center relative">
          JPG, PNG o WebP · Máx. 5 MB
        </p>
      </div>

      {/* Stats card */}
      <div className="rb-card rounded-rb p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <span
            className="inline-block px-1.5 py-0.5 font-display font-black text-[0.55rem] tracking-[0.25em] uppercase text-rb-white"
            style={{ backgroundColor: "#CC0000" }}
          >
            Stats
          </span>
          <span className="rb-label">Tu desempeño en el pool</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatItem
            label="Puntos"
            value={profile.total_points.toLocaleString("es-CL")}
            color="text-rb-gold"
          />
          <StatItem
            label="Ranking"
            value={showRank ? `#${profile.rank_position}` : "—"}
            color={showRank ? "text-rb-white" : "text-rb-500"}
          />
          <StatItem
            label="Exactos"
            value={profile.exact_scores}
            color="text-rb-red"
          />
          <StatItem
            label="Resultados ✓"
            value={profile.correct_results}
            color="text-rb-blue"
          />
        </div>
      </div>

      {/* Aviso bucket */}
      <div className="px-4 py-3 rounded-rb bg-rb-800/50 border border-rb-700/30">
        <p className="text-[0.7rem] text-rb-500">
          Las fotos se guardan en Supabase Storage. Asegúrate de haber creado el bucket <span className="text-rb-white font-bold">avatars</span> como público en tu proyecto.
        </p>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center bg-rb-black/40 rounded-rb p-3 border border-rb-800">
      <p className={cn("font-display font-black text-[1.5rem] leading-none tabular-nums", color)}>{value}</p>
      <p className="rb-label text-rb-500 mt-1.5">{label}</p>
    </div>
  );
}
