import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/i18n/LanguageContext";
import { toast } from "sonner";

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <a href="/" className="font-display text-3xl font-semibold tracking-wide text-foreground">
            ZEHRA GLAM
          </a>
          <p className="font-body text-sm text-muted-foreground mt-2">{t("admin.login")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-body text-sm text-foreground mb-1.5">{t("admin.email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          <div>
            <label className="block font-body text-sm text-foreground mb-1.5">{t("admin.password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase hover:bg-accent transition-colors disabled:opacity-50"
          >
            {loading ? "..." : t("admin.signIn")}
          </button>
        </form>
      </div>
    </div>
  );
}
