import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Clock, Hammer, Mail, MapPin, MessageCircle, Phone, Send, Shield, CheckCircle2 } from "lucide-react";
import { useGetSiteContent } from "@workspace/api-client-react";
import { localizeText, useLanguage } from "@/contexts/LanguageContext";
import { apiUrl } from "@/lib/api-url";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  website: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
  website: "",
};

const serviceOptions = [
  "Rekonstrukce bytů a domů / Реконструкція квартир і будинків",
  "Zednické práce / Мурувальні роботи",
  "Sádrokartony, omítky a štukování / Гіпсокартон, штукатурка та шпаклювання",
  "Malování, obklady a dlažby / Фарбування, облицювання та плитка",
  "Zámková dlažba a betonářské práce / Бруківка та бетонні роботи",
  "Fasády, zateplení a dokončovací práce / Фасади, утеплення та оздоблювальні роботи",
  "Jiná služba / Інша послуга",
];

export default function Contact() {
  const { t, language } = useLanguage();
  const { data: content, isLoading } = useGetSiteContent();
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const whatsappNumber = content?.phone.replace(/\D/g, "") || "420731988868";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    t("Dobrý den, mám zájem o stavební práce.", "Добрий день, мене цікавлять будівельні роботи."),
  )}`;

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status !== "idle") setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    try {
      const databaseResponse = await fetch(apiUrl("/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!databaseResponse.ok) throw new Error("Contact database request failed");

      if (import.meta.env.PROD) {
        const netlifyData = new URLSearchParams({
          "form-name": "contact",
          ...form,
        });
        const netlifyResponse = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: netlifyData.toString(),
        });
        if (!netlifyResponse.ok) throw new Error("Netlify Forms request failed");
      }

      setForm(initialForm);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (isLoading) {
    return <div className="h-[80vh] flex items-center justify-center bg-background"><div className="w-12 h-12 border border-primary border-t-transparent animate-spin" /></div>;
  }

  return (
    <div className="pt-32 pb-32 max-w-[1400px] mx-auto px-6 lg:px-12 bg-background">
      <div className="max-w-4xl mb-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-4 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-8">
            <span className="w-8 h-px bg-primary" />{t("Jsme tu pro vás", "Ми тут для вас")}
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight uppercase leading-[0.9]">
            {t("Kontakt", "Контакти")}<span className="text-primary">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light border-l border-primary pl-6">
            {t("Popište nám svůj projekt přes formulář nebo nám napište přímo. Ozveme se co nejdříve.", "Опишіть свій проєкт у формі або напишіть нам безпосередньо. Ми зв’яжемося з вами якомога швидше.")}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[0.82fr_1.18fr] gap-0 border border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="bg-card p-8 md:p-14 lg:p-16 border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden"
        >
          <div className="absolute right-0 bottom-0 text-primary/5 opacity-50 translate-x-1/4 translate-y-1/4 pointer-events-none"><Hammer className="w-96 h-96" /></div>
          <h2 className="text-3xl font-display font-bold mb-12 uppercase tracking-tight relative z-10">{t("Kontaktní údaje", "Контактні дані")}</h2>
          <div className="space-y-10 relative z-10">
            <a href={`tel:${content?.phone}`} className="flex items-start gap-5 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 border border-primary text-primary flex items-center justify-center shrink-0"><Phone className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-2">{t("Zavolejte nám", "Зателефонуйте нам")}</p>
                <p className="text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{content?.phone}</p>
              </div>
            </a>
            <a href="mailto:bobalstav.cz@gmail.com" className="flex items-start gap-5 group hover:translate-x-2 transition-transform duration-300">
              <div className="w-12 h-12 border border-border text-primary flex items-center justify-center shrink-0"><Mail className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-2">{t("Napište nám", "Напишіть нам")}</p>
                <p className="text-base sm:text-lg font-medium break-all text-foreground group-hover:text-primary transition-colors">bobalstav.cz@gmail.com</p>
              </div>
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-3 w-full min-h-14 px-5 py-4 rounded-md border-2 border-[#25D366] bg-[#25D366]/10 text-foreground font-bold text-xs uppercase tracking-[0.16em] hover:bg-[#25D366] hover:text-black transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5 text-[#25D366] group-hover:text-black" />
              {t("Napsat na WhatsApp", "Написати у WhatsApp")}
            </a>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 border border-border text-primary flex items-center justify-center shrink-0"><MapPin className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-2">{t("Sídlo společnosti", "Місцезнаходження")}</p>
                <p className="text-lg font-light text-foreground">{content?.address}</p>
                <p className="text-sm text-muted-foreground mt-2 font-light">IČO: {content?.registrationNumber}</p>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 border border-border text-primary flex items-center justify-center shrink-0"><Clock className="w-5 h-5" /></div>
              <div className="w-full">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-4">{t("Pracovní doba", "Робочий час")}</p>
                <div className="space-y-2 text-sm font-light w-full max-w-xs">
                  <div className="flex justify-between border-b border-border/50 pb-2"><span className="uppercase tracking-wider">{t("Po - Pá:", "Пн - Пт:")}</span><span className="font-bold text-foreground">8:00 - 18:00</span></div>
                  <div className="flex justify-between pt-1"><span className="uppercase tracking-wider">{t("Sobota:", "Субота:")}</span><span className="font-bold text-foreground">{t("Dle dohody", "За домовл.")}</span></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="bg-background p-8 md:p-14 lg:p-16"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-5"><Send className="w-4 h-4" />{t("Nezávazná poptávka", "Безкоштовний запит")}</div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-5 uppercase tracking-tight">{t("Napište nám", "Напишіть нам")}<span className="text-primary">.</span></h2>
            <p className="text-muted-foreground mb-10 font-light leading-relaxed text-lg">
              {t("Vyplňte několik údajů a stručně popište, co potřebujete. Připravíme další postup a domluvíme se na konzultaci.", "Заповніть кілька полів і коротко опишіть, що вам потрібно. Ми підготуємо подальші кроки та домовимося про консультацію.")}
            </p>

            <form
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="website"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="form-label">{t("Jméno a příjmení", "Ім’я та прізвище")}</span>
                  <input name="name" value={form.name} onChange={updateField} required minLength={2} maxLength={120} autoComplete="name" className="form-input" placeholder={t("Jan Novák", "Іван Іваненко")} />
                </label>
                <label className="block">
                  <span className="form-label">{t("E-mail", "Електронна пошта")}</span>
                  <input type="email" name="email" value={form.email} onChange={updateField} required maxLength={254} autoComplete="email" className="form-input" placeholder="vas@email.cz" />
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="block">
                  <span className="form-label">{t("Telefon", "Телефон")} <span className="text-muted-foreground/70 normal-case tracking-normal font-normal">({t("nepovinné", "необов’язково")})</span></span>
                  <input type="tel" name="phone" value={form.phone} onChange={updateField} maxLength={40} autoComplete="tel" className="form-input" placeholder="+420 731 988 868" />
                </label>
                <label className="block">
                  <span className="form-label">{t("Typ služby", "Тип послуги")}</span>
                  <select name="service" value={form.service} onChange={updateField} className="form-input">
                    <option value="">{t("Vyberte službu", "Оберіть послугу")}</option>
                    {serviceOptions.map((service) => <option key={service} value={service}>{localizeText(service, language)}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="form-label">{t("Popis projektu", "Опис проєкту")}</span>
                <textarea name="message" value={form.message} onChange={updateField} required minLength={10} maxLength={5000} rows={6} className="form-input resize-y" placeholder={t("Napište nám o prostoru, rozsahu prací a vašem termínu...", "Розкажіть про приміщення, обсяг робіт і бажані терміни...")} />
              </label>
              <label className="hidden" aria-hidden="true">
                Web
                <input name="website" value={form.website} onChange={updateField} tabIndex={-1} autoComplete="off" />
              </label>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-3">
                <button type="submit" disabled={status === "submitting"} className="btn-premium btn-primary w-full sm:w-auto group disabled:opacity-60 disabled:cursor-wait">
                  {status === "submitting" ? t("Odesíláme...", "Надсилаємо...") : t("Odeslat poptávku", "Надіслати запит")}
                  {status === "submitting" ? <span className="ml-3 w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" /> : <Send className="ml-3 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />}
                </button>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">{t("Odpovíme vám během pracovní doby.", "Ми відповімо вам у робочий час.")}</p>
              </div>

              {status === "success" && <div role="status" className="flex items-start gap-3 border border-primary/40 bg-primary/10 p-4 text-sm text-foreground"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" />{t("Děkujeme, vaše poptávka byla odeslána. Brzy se vám ozveme.", "Дякуємо, ваш запит надіслано. Ми скоро з вами зв’яжемося.")}</div>}
              {status === "error" && <div role="alert" className="border border-destructive/50 bg-destructive/10 p-4 text-sm text-foreground">{t("Odeslání se nezdařilo. Zkuste to prosím znovu nebo nám napište přímo na bobalstav.cz@gmail.com.", "Не вдалося надіслати запит. Спробуйте ще раз або напишіть нам на bobalstav.cz@gmail.com.")}</div>}
            </form>

            <div className="mt-12 p-6 border border-border border-l-4 border-l-primary bg-card/50">
              <h3 className="font-bold mb-5 flex items-center gap-3 uppercase tracking-wider text-sm"><Shield className="w-5 h-5 text-primary" />{t("Proč si vybrat nás", "Чому варто обрати нас")}</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground font-light list-none">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block" />{t("Rychlá komunikace", "Швидка комунікація")}</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block" />{t("Jasná nabídka", "Зрозуміла пропозиція")}</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block" />{t("Čistota na staveništi", "Чистота на об’єкті")}</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-primary rounded-full block" />{t("Záruka na dílo", "Гарантія на роботи")}</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}