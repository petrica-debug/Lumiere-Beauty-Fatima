import { useState, useRef, useCallback, type DragEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Upload, Camera, ArrowLeft, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface AnalysisResult {
  skin_type: string;
  concerns: string[];
  overall_score: number;
  recommendations: string[];
  recommended_services: string[];
}

const MAX_DIMENSION = 1024;
const JPEG_QUALITY = 0.7;

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export default function SkinAnalysis() {
  const { t } = useTranslation();
  const inputId = "skin-photo-input";
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedBase64, setCompressedBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPEG, PNG, or WebP).");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Image is too large. Please use a photo under 20 MB.");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const resized = await resizeImage(file);
      setPreview(resized);
      setCompressedBase64(resized.split(",")[1]);
      setResult(null);
    } catch {
      setError("Failed to process image. Please try another photo.");
    } finally {
      setProcessing(false);
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const analyze = async () => {
    if (!compressedBase64) return;
    setLoading(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke("analyze-skin", {
        body: { image_base64: compressedBase64 },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setCompressedBase64(null);
    setResult(null);
    setError("");
    if (formRef.current) formRef.current.reset();
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-body text-xs uppercase tracking-wider text-accent">Zehra AI</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-4">{t("skin.title")}</h1>
          <p className="font-body text-muted-foreground max-w-lg mx-auto">{t("skin.subtitle")}</p>
        </div>

        {!result ? (
          <div className="max-w-lg mx-auto">
            {!preview ? (
              <form ref={formRef}>
                <label
                  htmlFor={inputId}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`block w-full aspect-square max-h-96 border-2 border-dashed rounded-sm cursor-pointer
                    flex flex-col items-center justify-center gap-4 transition-colors
                    ${dragOver ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"}`}
                >
                  <input
                    id={inputId}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  {processing ? (
                    <Loader2 className="w-10 h-10 text-accent animate-spin" />
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-accent" />
                      </div>
                      <div className="text-center px-4">
                        <p className="font-body text-sm text-foreground mb-1">{t("skin.upload")}</p>
                        <p className="font-body text-xs text-muted-foreground flex items-center gap-1 justify-center">
                          <Upload className="w-3 h-3" /> Click to browse or drag & drop
                        </p>
                      </div>
                    </>
                  )}
                </label>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square max-h-96 overflow-hidden rounded-sm border border-border mx-auto">
                  <img src={preview} alt="Your photo" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 py-3 border border-border font-body text-sm hover:bg-muted transition-colors"
                  >
                    {t("skin.tryAgain")}
                  </button>
                  <button
                    onClick={analyze}
                    disabled={loading}
                    className="flex-1 py-3 bg-accent text-accent-foreground font-body text-sm hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? t("skin.analyzing") : t("skin.analyze")}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="font-body text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-card border border-border rounded-sm text-center">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Skin Type</p>
                <p className="font-display text-2xl text-foreground">{result.skin_type}</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-sm text-center">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Health Score</p>
                <p className={`font-display text-4xl ${scoreColor(result.overall_score)}`}>{result.overall_score}</p>
              </div>
              <div className="p-6 bg-card border border-border rounded-sm text-center">
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Concerns Found</p>
                <p className="font-display text-2xl text-foreground">{result.concerns.length}</p>
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-sm mb-6">
              <h3 className="font-display text-xl text-foreground mb-4">Skin Concerns</h3>
              <ul className="space-y-2">
                {result.concerns.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-card border border-border rounded-sm mb-6">
              <h3 className="font-display text-xl text-foreground mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                    <span className="font-medium text-accent shrink-0">{i + 1}.</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-accent/5 border border-accent/20 rounded-sm mb-8">
              <h3 className="font-display text-xl text-foreground mb-4">{t("skin.recommendations")}</h3>
              <div className="flex flex-wrap gap-3">
                {result.recommended_services.map((s) => (
                  <Link
                    key={s}
                    to="/booking"
                    className="px-4 py-2 bg-accent text-accent-foreground font-body text-sm rounded-sm hover:bg-accent/90 transition-colors"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={reset} className="flex-1 py-3 border border-border font-body text-sm hover:bg-muted transition-colors">
                {t("skin.tryAgain")}
              </button>
              <Link to="/booking" className="flex-1 py-3 bg-gold text-warm-dark font-body text-sm text-center tracking-[0.15em] uppercase hover:bg-gold-light transition-colors">
                {t("nav.booking")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
