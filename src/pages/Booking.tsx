import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/i18n/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, ArrowRight, Clock, Check } from "lucide-react";
import type { Lang } from "@/i18n/translations";

interface Service {
  id: string;
  name_en: string;
  name_fr: string;
  name_nl: string;
  name_ar: string;
  price: number;
  duration_minutes: number;
  category: string;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30",
];

export default function Booking() {
  const { t, lang } = useTranslation();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").eq("active", true).order("sort_order").then(({ data }) => {
      setServices(data || []);
    });
  }, []);

  const getServiceName = (s: Service) => {
    const key = `name_${lang}` as keyof Service;
    return (s[key] as string) || s.name_en;
  };

  const handlePayment = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !name || !email) return;
    setLoading(true);

    const bookingDate = selectedDate.toISOString().split("T")[0];

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          service_id: selectedService.id,
          service_name: getServiceName(selectedService),
          price: selectedService.price,
          booking_date: bookingDate,
          booking_time: selectedTime,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      const { error: insertError } = await supabase.from("bookings").insert({
        service_id: selectedService.id,
        booking_date: bookingDate,
        booking_time: selectedTime,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        status: "pending",
        stripe_payment_status: "unpaid",
        notes: "Direct booking (fallback)",
      });

      if (!insertError) {
        try {
          await supabase.functions.invoke("send-email", {
            body: {
              type: "booking_confirmation",
              customer_email: email,
              customer_name: name,
              service_name: getServiceName(selectedService),
              booking_date: bookingDate,
              booking_time: selectedTime,
              price: selectedService.price,
            },
          });
        } catch { /* email is best-effort */ }
        window.location.href = "/booking/success";
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: t("booking.step1") },
    { num: 2, label: t("booking.step2") },
    { num: 3, label: t("booking.step3") },
    { num: 4, label: t("booking.step4") },
  ];

  const canNext = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) return !!name && !!email;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24">
        <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> {t("booking.back")}
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-12">{t("booking.title")}</h1>

        {/* Step indicators */}
        <div className="flex items-center gap-2 mb-12">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-sm font-body text-sm ${
                step === s.num ? "bg-accent text-accent-foreground" :
                step > s.num ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
              }`}>
                {step > s.num ? <Check className="w-4 h-4" /> : <span>{s.num}</span>}
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedService(s)}
                className={`text-left p-6 border rounded-sm transition-all ${
                  selectedService?.id === s.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display text-xl text-foreground mb-1">{getServiceName(s)}</h3>
                    <div className="flex items-center gap-3 font-body text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration_minutes} {t("booking.duration")}</span>
                      <span className="capitalize">{s.category}</span>
                    </div>
                  </div>
                  <span className="font-display text-2xl text-foreground">€{s.price}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="font-body text-sm text-muted-foreground mb-4">{t("booking.selectDate")}</p>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-sm border border-border"
              />
            </div>
            <div>
              <p className="font-body text-sm text-muted-foreground mb-4">{t("booking.selectTime")}</p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 font-body text-sm rounded-sm border transition-colors ${
                      selectedTime === time
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Customer Details */}
        {step === 3 && (
          <div className="max-w-lg">
            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm text-foreground mb-1.5">{t("contact.name")}</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block font-body text-sm text-foreground mb-1.5">{t("contact.email")}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:border-accent"
                  required
                />
              </div>
              <div>
                <label className="block font-body text-sm text-foreground mb-1.5">{t("booking.phone")}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-border bg-card text-foreground font-body text-sm focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary & Pay */}
        {step === 4 && selectedService && selectedDate && (
          <div className="max-w-lg">
            <div className="p-6 bg-card border border-border rounded-sm mb-6">
              <h3 className="font-display text-xl text-foreground mb-4">Booking Summary</h3>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="text-foreground">{getServiceName(selectedService)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="text-foreground">{selectedDate.toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="text-foreground">{selectedTime}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="text-foreground">{selectedService.duration_minutes} min</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">{name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{email}</span></div>
                <div className="border-t border-border pt-3 mt-3 flex justify-between font-medium">
                  <span className="text-foreground">Total</span>
                  <span className="font-display text-2xl text-foreground">€{selectedService.price}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-4 bg-gold text-warm-dark font-body text-sm tracking-[0.2em] uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? "..." : t("booking.payNow")}
            </button>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between mt-12">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 px-6 py-3 border border-border font-body text-sm hover:bg-muted transition-colors">
                <ArrowLeft className="w-4 h-4" /> {t("booking.back")}
              </button>
            ) : <div />}
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm hover:bg-accent transition-colors disabled:opacity-50"
            >
              {t("booking.next")} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
