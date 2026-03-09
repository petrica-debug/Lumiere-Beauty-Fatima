import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Scissors, MessageSquareQuote, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/i18n/LanguageContext";

const AdminSidebar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/admin", icon: LayoutDashboard, label: t("admin.dashboard") },
    { to: "/admin/bookings", icon: CalendarDays, label: t("admin.bookings") },
    { to: "/admin/services", icon: Scissors, label: t("admin.services") },
    { to: "/admin/testimonials", icon: MessageSquareQuote, label: t("admin.testimonials") },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/" className="font-display text-xl font-semibold tracking-wide text-foreground">
          ZEHRA GLAM
        </Link>
        <p className="font-body text-xs text-muted-foreground mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-sm font-body text-sm transition-colors ${
              isActive(to)
                ? "bg-accent/15 text-accent font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full font-body text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("admin.logout")}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
