import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/i18n/LanguageContext";
import AdminSidebar from "@/components/AdminSidebar";
import { CalendarDays, DollarSign, Clock, Users } from "lucide-react";

interface Stats {
  todayBookings: number;
  totalRevenue: number;
  upcoming: number;
  totalClients: number;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats>({ todayBookings: 0, totalRevenue: 0, upcoming: 0, totalClients: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    loadStats();
    loadRecent();
  }, []);

  const loadStats = async () => {
    const today = new Date().toISOString().split("T")[0];

    const [todayRes, revenueRes, upcomingRes, clientsRes] = await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("booking_date", today),
      supabase.from("bookings").select("service_id, services(price)").eq("stripe_payment_status", "paid"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).gte("booking_date", today).in("status", ["pending", "confirmed"]),
      supabase.from("bookings").select("customer_email").then(({ data }) => {
        const unique = new Set(data?.map((b: any) => b.customer_email));
        return { count: unique.size };
      }),
    ]);

    const revenue = (revenueRes.data || []).reduce((sum: number, b: any) => sum + (b.services?.price || 0), 0);

    setStats({
      todayBookings: todayRes.count || 0,
      totalRevenue: revenue,
      upcoming: upcomingRes.count || 0,
      totalClients: clientsRes.count || 0,
    });
  };

  const loadRecent = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, services(name_en, price)")
      .order("created_at", { ascending: false })
      .limit(10);
    setRecentBookings(data || []);
  };

  const statCards = [
    { icon: CalendarDays, label: t("admin.todayBookings"), value: stats.todayBookings, color: "text-blue-500" },
    { icon: DollarSign, label: t("admin.totalRevenue"), value: `€${stats.totalRevenue.toFixed(2)}`, color: "text-green-500" },
    { icon: Clock, label: t("admin.upcoming"), value: stats.upcoming, color: "text-amber-500" },
    { icon: Users, label: t("admin.totalClients"), value: stats.totalClients, color: "text-purple-500" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-3xl font-light text-foreground mb-8">{t("admin.dashboard")}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statCards.map((card) => (
            <div key={card.label} className="p-6 bg-card border border-border rounded-sm">
              <div className="flex items-center gap-3 mb-3">
                <card.icon className={`w-5 h-5 ${card.color}`} />
                <span className="font-body text-xs text-muted-foreground uppercase tracking-wider">{card.label}</span>
              </div>
              <p className="font-display text-3xl font-light text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-sm">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-xl text-foreground">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Service</th>
                  <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Payment</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-muted/50">
                    <td className="p-4 font-body text-sm text-foreground">{b.customer_name}</td>
                    <td className="p-4 font-body text-sm text-muted-foreground">{b.services?.name_en || "—"}</td>
                    <td className="p-4 font-body text-sm text-muted-foreground">{b.booking_date} {b.booking_time}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 font-body text-xs uppercase tracking-wider rounded-sm ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                        b.status === "completed" ? "bg-blue-100 text-blue-700" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`font-body text-xs ${b.stripe_payment_status === "paid" ? "text-green-600" : "text-muted-foreground"}`}>
                        {b.stripe_payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center font-body text-sm text-muted-foreground">No bookings yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
