import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";
import { CheckCircle } from "lucide-react";

export default function BookingSuccess() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="font-display text-4xl font-light text-foreground mb-4">
          {t("booking.success.title")}
        </h1>
        <p className="font-body text-muted-foreground mb-8">
          {t("booking.success.desc")}
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-[0.2em] uppercase hover:bg-accent transition-colors"
        >
          {t("booking.success.home")}
        </Link>
      </div>
    </div>
  );
}
