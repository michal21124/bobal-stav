import { useState } from "react";
import { Star } from "lucide-react";
import { useSubmitTestimonial } from "@workspace/api-client-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function ReviewSubmissionForm() {
  const { t } = useLanguage();
  const submitTestimonial = useSubmitTestimonial();
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitTestimonial.mutate(
      { data: { name: name.trim(), text: text.trim(), rating, website } },
      {
        onSuccess: () => {
          setSubmitted(true);
          setName("");
          setText("");
          setRating(5);
          setWebsite("");
        },
      },
    );
  };

  return (
    <section id="review-form" className="border-t border-border bg-card/30 py-24">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-12">
        <div>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {t("Váš názor", "Ваша думка")}
          </p>
          <h2 className="text-4xl font-display font-bold uppercase tracking-tight md:text-6xl">
            {t("Napište nám recenzi", "Залиште відгук")}<span className="text-primary">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg font-light leading-8 text-muted-foreground">
            {t(
              "Vaše recenze se po odeslání zobrazí administrátorovi ke schválení.",
              "Після надсилання відгук надійде адміністратору на перевірку.",
            )}
          </p>
        </div>

        {submitted ? (
          <div className="flex min-h-80 items-center rounded-xl border border-primary/30 bg-primary/5 p-8">
            <div>
              <Star className="mb-5 h-10 w-10 fill-primary text-primary" />
              <h3 className="text-2xl font-display font-bold">{t("Děkujeme za recenzi", "Дякуємо за відгук")}</h3>
              <p className="mt-3 text-muted-foreground">
                {t("Po schválení ji zveřejníme na webu.", "Після підтвердження ми опублікуємо його на сайті.")}
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="mt-7 text-sm font-bold text-primary">
                {t("Napsat další recenzi", "Залишити ще один відгук")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-background p-6 sm:p-9">
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Jméno", "Ім’я")}</span>
              <input required minLength={2} maxLength={120} value={name} onChange={(event) => setName(event.target.value)}
                className="w-full rounded-md border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
            </label>
            <fieldset>
              <legend className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Hodnocení", "Оцінка")}</legend>
              <div className="flex gap-2" aria-label={t("Hodnocení hvězdičkami", "Оцінка зірками")}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} / 5`}
                    className="p-1 text-[#D4AF37] transition-transform hover:scale-110">
                    <Star className={`h-8 w-8 ${value <= rating ? "fill-current" : "opacity-30"}`} />
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Text recenze", "Текст відгуку")}</span>
              <textarea required minLength={10} maxLength={2000} rows={6} value={text} onChange={(event) => setText(event.target.value)}
                className="w-full resize-y rounded-md border border-border bg-card px-4 py-3 outline-none focus:border-primary" />
            </label>
            <input tabIndex={-1} autoComplete="off" aria-hidden="true" value={website}
              onChange={(event) => setWebsite(event.target.value)} className="absolute left-[-9999px]" name="website" />
            {submitTestimonial.isError && (
              <p role="alert" className="text-sm text-destructive">{t("Recenzi se nepodařilo odeslat. Zkuste to znovu.", "Не вдалося надіслати відгук. Спробуйте ще раз.")}</p>
            )}
            <button type="submit" disabled={submitTestimonial.isPending}
              className="min-h-12 w-full rounded-md bg-primary px-6 font-bold text-primary-foreground disabled:opacity-60">
              {submitTestimonial.isPending ? t("Odesílám…", "Надсилання…") : t("Odeslat recenzi", "Надіслати відгук")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}