import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/i18n/LanguageContext";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";

export default function Bookings() {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, [filter]);

  const load = async () => {
    let query = supabase
      .from("bookings")
      .select("*, services(name_en, price)")
      .order("booking_date", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);

    const { data } = await query;
    setBookings(data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Booking ${status}`);
    load();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-light text-foreground">{t("admin.bookings")}</h1>
          <div className="flex gap-2">
            {["all", "pending", "confirmed", "completed", "cancelled"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 font-body text-xs uppercase tracking-wider rounded-sm transition-colors ${
                  filter === f ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Customer</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Email</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Phone</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Service</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Date/Time</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-4 font-body text-sm text-foreground">{b.customer_name}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{b.customer_email}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{b.customer_phone}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{b.services?.name_en || "—"}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{b.booking_date} {b.booking_time}</td>
                  <td className="p-4 font-body text-sm text-foreground">€{b.services?.price || "—"}</td>
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
                    <div className="flex gap-2">
                      {b.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(b.id, "confirmed")} className="px-2 py-1 bg-green-100 text-green-700 font-body text-xs rounded-sm hover:bg-green-200">Confirm</button>
                          <button onClick={() => updateStatus(b.id, "cancelled")} className="px-2 py-1 bg-red-100 text-red-700 font-body text-xs rounded-sm hover:bg-red-200">Cancel</button>
                        </>
                      )}
                      {b.status === "confirmed" && (
                        <button onClick={() => updateStatus(b.id, "completed")} className="px-2 py-1 bg-blue-100 text-blue-700 font-body text-xs rounded-sm hover:bg-blue-200">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center font-body text-sm text-muted-foreground">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
