import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/i18n/LanguageContext";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface Service {
  id: string;
  name_en: string;
  name_fr: string;
  name_nl: string;
  name_ar: string;
  description_en: string;
  description_fr: string;
  description_nl: string;
  description_ar: string;
  price: number;
  duration_minutes: number;
  category: string;
  active: boolean;
}

const emptyService: Omit<Service, "id"> = {
  name_en: "", name_fr: "", name_nl: "", name_ar: "",
  description_en: "", description_fr: "", description_nl: "", description_ar: "",
  price: 0, duration_minutes: 60, category: "general", active: true,
};

export default function ServicesAdmin() {
  const { t } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    setServices(data || []);
  };

  const save = async () => {
    if (!editing) return;
    if (!editing.name_en) { toast.error("Name (EN) is required"); return; }

    if (isNew) {
      const { error } = await supabase.from("services").insert(editing);
      if (error) { toast.error(error.message); return; }
      toast.success("Service created");
    } else {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("services").update(rest).eq("id", id);
      if (error) { toast.error(error.message); return; }
      toast.success("Service updated");
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Service deleted");
    load();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-light text-foreground">{t("admin.services")}</h1>
          <button
            onClick={() => { setEditing({ ...emptyService }); setIsNew(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-body text-sm rounded-sm hover:bg-accent/90"
          >
            <Plus className="w-4 h-4" /> Add Service
          </button>
        </div>

        {editing && (
          <div className="mb-8 p-6 bg-card border border-border rounded-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl text-foreground">{isNew ? "New Service" : "Edit Service"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["en", "fr", "nl", "ar"] as const).map((lang) => (
                <div key={lang}>
                  <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Name ({lang.toUpperCase()})</label>
                  <input
                    value={(editing as any)[`name_${lang}`] || ""}
                    onChange={(e) => setEditing({ ...editing, [`name_${lang}`]: e.target.value })}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              ))}
              {(["en", "fr", "nl", "ar"] as const).map((lang) => (
                <div key={`desc_${lang}`}>
                  <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Description ({lang.toUpperCase()})</label>
                  <textarea
                    value={(editing as any)[`description_${lang}`] || ""}
                    onChange={(e) => setEditing({ ...editing, [`description_${lang}`]: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              ))}
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Price (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editing.price || 0}
                  onChange={(e) => setEditing({ ...editing, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Duration (min)</label>
                <input
                  type="number"
                  value={editing.duration_minutes || 60}
                  onChange={(e) => setEditing({ ...editing, duration_minutes: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Category</label>
                <select
                  value={editing.category || "general"}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent"
                >
                  <option value="facial">Facial</option>
                  <option value="epilation">Epilation</option>
                  <option value="eyelash">Eyelash</option>
                  <option value="skincare">Skincare</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.active ?? true}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="font-body text-sm text-foreground">Active</label>
              </div>
            </div>
            <button
              onClick={save}
              className="mt-4 flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-body text-sm rounded-sm hover:bg-accent"
            >
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        )}

        <div className="bg-card border border-border rounded-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Category</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Active</th>
                <th className="text-left p-4 font-body text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-muted/50">
                  <td className="p-4 font-body text-sm text-foreground">{s.name_en}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground capitalize">{s.category}</td>
                  <td className="p-4 font-body text-sm text-foreground">€{s.price}</td>
                  <td className="p-4 font-body text-sm text-muted-foreground">{s.duration_minutes} min</td>
                  <td className="p-4">
                    <span className={`inline-block w-2 h-2 rounded-full ${s.active ? "bg-green-500" : "bg-red-500"}`} />
                  </td>
                  <td className="p-4 flex gap-2">
                    <button onClick={() => { setEditing(s); setIsNew(false); }} className="p-1.5 hover:bg-muted rounded-sm"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => remove(s.id)} className="p-1.5 hover:bg-red-50 rounded-sm"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
