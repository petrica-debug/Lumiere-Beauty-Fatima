import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "@/i18n/LanguageContext";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  text: string;
  service: string;
  rating: number;
  lang: string;
  active: boolean;
}

export default function TestimonialsAdmin() {
  const { t } = useTranslation();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  const save = async () => {
    if (!editing?.name || !editing?.text) { toast.error("Name and text are required"); return; }

    if (isNew) {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("testimonials").insert(rest);
      if (error) { toast.error(error.message); return; }
      toast.success("Testimonial created");
    } else {
      const { id, ...rest } = editing;
      const { error } = await supabase.from("testimonials").update(rest).eq("id", id);
      if (error) { toast.error(error.message); return; }
      toast.success("Testimonial updated");
    }
    setEditing(null);
    setIsNew(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-light text-foreground">{t("admin.testimonials")}</h1>
          <button
            onClick={() => { setEditing({ name: "", text: "", service: "", rating: 5, lang: "en", active: true }); setIsNew(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground font-body text-sm rounded-sm hover:bg-accent/90"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>

        {editing && (
          <div className="mb-8 p-6 bg-card border border-border rounded-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl text-foreground">{isNew ? "New Testimonial" : "Edit Testimonial"}</h2>
              <button onClick={() => { setEditing(null); setIsNew(false); }}><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Name</label>
                <input
                  value={editing.name || ""}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Service</label>
                <input
                  value={editing.service || ""}
                  onChange={(e) => setEditing({ ...editing, service: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Text</label>
                <textarea
                  value={editing.text || ""}
                  onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent resize-none"
                />
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} onClick={() => setEditing({ ...editing, rating: r })}>
                      <Star className={`w-5 h-5 ${r <= (editing.rating || 5) ? "fill-gold text-gold" : "text-border"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-muted-foreground mb-1">Language</label>
                <select
                  value={editing.lang || "en"}
                  onChange={(e) => setEditing({ ...editing, lang: e.target.value })}
                  className="w-full px-3 py-2 border border-border bg-background text-foreground font-body text-sm focus:outline-none focus:border-accent"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="nl">Nederlands</option>
                  <option value="ar">العربية</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="w-4 h-4" />
                <label className="font-body text-sm text-foreground">Active</label>
              </div>
            </div>
            <button onClick={save} className="mt-4 flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-body text-sm rounded-sm hover:bg-accent">
              <Check className="w-4 h-4" /> Save
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className={`p-6 bg-card border rounded-sm ${item.active ? "border-border" : "border-red-200 opacity-60"}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-0.5">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing(item); setIsNew(false); }} className="p-1 hover:bg-muted rounded-sm"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => remove(item.id)} className="p-1 hover:bg-red-50 rounded-sm"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                </div>
              </div>
              <p className="font-body text-sm text-muted-foreground italic mb-3">&ldquo;{item.text}&rdquo;</p>
              <p className="font-body text-sm font-medium text-foreground">{item.name}</p>
              <p className="font-body text-xs text-accent">{item.service} &middot; {item.lang.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
