import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  useGetAdminSummary,
  useGetSiteContent,
  useUpdateSiteContent,
  useListGalleryItems,
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
  getGetSiteContentQueryKey,
  getListGalleryItemsQueryKey,
  getGetAdminSummaryQueryKey,
  useListAdminTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
  getListAdminTestimonialsQueryKey,
  getListTestimonialsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  LockKeyhole,
  LogOut,
  UploadCloud,
  Loader2,
  CheckCircle2,
  MessageSquareQuote,
  Star,
  Pencil,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api-url";

export default function Admin() {
  const [authStatus, setAuthStatus] = useState<
    "checking" | "authenticated" | "guest"
  >("checking");

  useEffect(() => {
    let active = true;

    fetch(apiUrl("/api/admin/session"), { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setAuthStatus(data.authenticated ? "authenticated" : "guest");
        }
      })
      .catch(() => {
        if (active) setAuthStatus("guest");
      });

    return () => {
      active = false;
    };
  }, []);

  if (authStatus === "checking") {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (authStatus === "guest") {
    return (
      <AdminLogin onAuthenticated={() => setAuthStatus("authenticated")} />
    );
  }

  return <AdminDashboard onLogout={() => setAuthStatus("guest")} />;
}

function AdminLogin({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl("/api/admin/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const message =
          response.status === 429
            ? "Příliš mnoho pokusů. Zkuste to prosím později."
            : "Nesprávné heslo.";
        setError(message);
        return;
      }

      setPassword("");
      onAuthenticated();
    } catch {
      setError("Přihlášení se nezdařilo. Zkuste to prosím znovu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#090a09] px-4 py-10 sm:px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.10),transparent_35%)]" />
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-card/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
        <Link href="/" className="mx-auto mb-8 block w-56 max-w-[75%]">
          <img
            src="/bobal-stav-logo.png"
            alt="Bobal Stav"
            className="h-auto w-full"
          />
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Administrace
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Zadejte heslo pro správu obsahu a galerie.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            autoComplete="username"
            value="admin"
            readOnly
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
          <div className="space-y-2">
            <label
              htmlFor="admin-password"
              className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground"
            >
              Heslo
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-lg border border-border bg-background px-4 text-base text-foreground outline-none transition-colors focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15"
              placeholder="Zadejte heslo"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-5 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-60"
          >
            {isSubmitting ? "Přihlašuji..." : "Přihlásit se"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-7 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Zpět na web
        </Link>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "content" | "gallery" | "testimonials"
  >("overview");
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await fetch(apiUrl("/api/admin/logout"), {
      method: "POST",
      credentials: "include",
    }).catch(() => undefined);
    queryClient.clear();
    onLogout();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background md:h-screen md:flex-row md:overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-full shrink-0 flex-col border-b border-border bg-card md:w-64 md:border-b-0 md:border-r">
        <div className="flex min-h-20 items-center justify-between border-b border-border px-4 py-4 sm:px-6">
          <Link href="/" className="block w-36 sm:w-40">
            <img
              src="/bobal-stav-logo.png"
              alt="Bobal Stav"
              className="h-auto w-full"
            />
          </Link>
          <span className="rounded-md border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
            Admin
          </span>
        </div>

        <nav className="grid grid-cols-4 gap-2 overflow-x-auto p-3 md:flex md:flex-1 md:flex-col md:space-y-2 md:p-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex min-w-0 items-center justify-center gap-2 rounded-md px-3 py-3 text-xs font-medium transition-colors md:w-full md:justify-start md:text-sm ${activeTab === "overview" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="truncate">Přehled</span>
          </button>
          <button
            onClick={() => setActiveTab("content")}
            className={`flex min-w-0 items-center justify-center gap-2 rounded-md px-3 py-3 text-xs font-medium transition-colors md:w-full md:justify-start md:text-sm ${activeTab === "content" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <Settings className="w-4 h-4" />
            <span className="truncate">Obsah</span>
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex min-w-0 items-center justify-center gap-2 rounded-md px-3 py-3 text-xs font-medium transition-colors md:w-full md:justify-start md:text-sm ${activeTab === "gallery" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="truncate">Galerie</span>
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex min-w-0 items-center justify-center gap-2 rounded-md px-3 py-3 text-xs font-medium transition-colors md:w-full md:justify-start md:text-sm ${activeTab === "testimonials" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
          >
            <MessageSquareQuote className="h-4 w-4" />
            <span className="truncate">Reference</span>
          </button>
        </nav>

        <div className="hidden border-t border-border p-4 md:block">
          <button
            onClick={handleLogout}
            className="mb-2 flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Odhlásit se
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Zpět na web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background p-4 sm:p-6 md:overflow-auto md:p-8">
        <div className="mb-5 flex items-center justify-end gap-3 md:hidden">
          <Link
            href="/"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            Zpět na web
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-bold text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Odhlásit
          </button>
        </div>
        <div className="max-w-5xl mx-auto">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "content" && <AdminContent />}
          {activeTab === "gallery" && <AdminGallery />}
          {activeTab === "testimonials" && <AdminTestimonials />}
        </div>
      </main>
    </div>
  );
}

function AdminOverview() {
  const { data: summary, isLoading } = useGetAdminSummary();

  if (isLoading) return <div>Načítání...</div>;

  return (
    <div>
      <h1 className="text-3xl font-display font-bold mb-8">Přehled</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-lg">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
            Položky v galerii
          </p>
          <p className="text-4xl font-display font-bold text-foreground">
            {summary?.galleryCount || 0}
          </p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
            Zvýrazněné projekty
          </p>
          <p className="text-4xl font-display font-bold text-primary">
            {summary?.featuredCount || 0}
          </p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">
            Služby
          </p>
          <p className="text-4xl font-display font-bold text-foreground">
            {summary?.serviceCount || 0}
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminContent() {
  const { data: content, isLoading } = useGetSiteContent();
  const updateContent = useUpdateSiteContent();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Local state for form
  const [formData, setFormData] = useState<any>(null);

  // Initialize form data when content loads
  if (content && !formData) {
    setFormData(content);
  }

  if (isLoading || !formData) return <div>Načítání...</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by newline and clean up
    const services = e.target.value
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setFormData({ ...formData, services });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent.mutate(
      { data: formData },
      {
        onSuccess: (updatedContent) => {
          queryClient.setQueryData(getGetSiteContentQueryKey(), updatedContent);
          toast({
            title: "Uloženo",
            description: "Obsah webu byl úspěšně aktualizován.",
          });
        },
        onError: () => {
          toast({
            title: "Chyba",
            description: "Nepodařilo se uložit změny.",
            variant: "destructive",
          });
        },
      },
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Obsah webu</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-lg border border-border bg-card p-4 sm:p-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Název společnosti
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              IČO
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Telefon
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Sídlo
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Služby (jedna na řádek)
          </label>
          <textarea
            name="services"
            value={formData.services?.join("\n") || ""}
            onChange={handleServicesChange}
            rows={5}
            className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            O nás (Česky)
          </label>
          <textarea
            name="aboutCs"
            value={formData.aboutCs}
            onChange={handleChange}
            rows={6}
            className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            O nás (Ukrajinsky)
          </label>
          <textarea
            name="aboutUk"
            value={formData.aboutUk}
            onChange={handleChange}
            rows={6}
            className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={updateContent.isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 hover:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {updateContent.isPending ? (
            "Ukládám..."
          ) : (
            <>
              <Save className="w-4 h-4" /> Uložit změny
            </>
          )}
        </button>
      </form>
    </div>
  );
}

type PendingPhoto = {
  id: string;
  file: File;
  previewUrl: string;
  status: "uploading" | "uploaded" | "error";
  objectPath?: string;
  error?: string;
};

function AdminGallery() {
  const { data: items, isLoading } = useListGalleryItems();
  const deleteItem = useDeleteGalleryItem();
  const createItem = useCreateGalleryItem();
  const updateItem = useUpdateGalleryItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingTitles, setEditingTitles] = useState({ titleCs: "", titleUk: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingBatch, setIsSavingBatch] = useState(false);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [newItem, setNewItem] = useState({
    titleCs: "",
    titleUk: "",
    category: "Realizace",
    imageUrl: "",
    location: "Praha a okolí",
    featured: false,
  });

  if (isLoading) return <div>Načítání...</div>;

  const handleDelete = (id: number) => {
    if (confirm("Opravdu chcete smazat tuto položku?")) {
      deleteItem.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getListGalleryItemsQueryKey(),
            });
            queryClient.invalidateQueries({
              queryKey: getGetAdminSummaryQueryKey(),
            });
            toast({
              title: "Smazáno",
              description: "Položka byla odstraněna.",
            });
          },
        },
      );
    }
  };

  const startEditing = (item: NonNullable<typeof items>[number]) => {
    setEditingItemId(item.id);
    setEditingTitles({ titleCs: item.titleCs, titleUk: item.titleUk });
  };

  const cancelEditing = () => {
    setEditingItemId(null);
    setEditingTitles({ titleCs: "", titleUk: "" });
  };

  const handleUpdateTitle = async (id: number) => {
    const titleCs = editingTitles.titleCs.trim();
    const titleUk = editingTitles.titleUk.trim();
    if (!titleCs || !titleUk) {
      toast({
        title: "Chybí název",
        description: "Vyplňte název v češtině i ukrajinštině.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateItem.mutateAsync({ id, data: { titleCs, titleUk } });
      await queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() });
      cancelEditing();
      toast({
        title: "Uloženo",
        description: "Názvy fotografie byly aktualizovány.",
      });
    } catch {
      toast({
        title: "Chyba",
        description: "Názvy se nepodařilo uložit. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    }
  };

  const resetNewItem = () => {
    pendingPhotos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setPendingPhotos([]);
    setNewItem({
      titleCs: "",
      titleUk: "",
      category: "Realizace",
      imageUrl: "",
      location: "Praha a okolí",
      featured: false,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedPhotos = pendingPhotos.filter(
      (photo) => photo.status === "uploaded" && photo.objectPath,
    );
    if (!newItem.imageUrl && uploadedPhotos.length === 0) {
      toast({
        title: "Chybí fotografie",
        description: "Vyberte alespoň jednu fotografii nebo vložte její URL.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingBatch(true);
    let createdCount = 0;
    try {
      const itemsToCreate = uploadedPhotos.length > 0
        ? uploadedPhotos.map((photo) => {
            const filenameTitle = photo.file.name
              .replace(/\.[^/.]+$/, "")
              .replace(/[-_]+/g, " ")
              .trim() || "Nový projekt";
            const isBatch = uploadedPhotos.length > 1;
            return {
              titleCs: isBatch ? filenameTitle : (newItem.titleCs.trim() || filenameTitle),
              titleUk: isBatch ? filenameTitle : (newItem.titleUk.trim() || filenameTitle),
              category: newItem.category.trim() || "Realizace",
              imageUrl: photo.objectPath!,
              location: newItem.location.trim() || "Praha a okolí",
              featured: newItem.featured,
            };
          })
        : [{
            ...newItem,
            titleCs: newItem.titleCs.trim() || "Nový projekt",
            titleUk: newItem.titleUk.trim() || "Новий проєкт",
            category: newItem.category.trim() || "Realizace",
            location: newItem.location.trim() || "Praha a okolí",
          }];

      for (const item of itemsToCreate) {
        await createItem.mutateAsync({ data: item });
        createdCount += 1;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }),
      ]);
      setIsAdding(false);
      resetNewItem();
      toast({
        title: "Přidáno",
        description: `${itemsToCreate.length} ${itemsToCreate.length === 1 ? "položka byla přidána" : "položky byly přidány"} do galerie.`,
      });
    } catch {
      if (createdCount > 0) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() }),
          queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() }),
        ]);
      }
      toast({
        title: "Chyba",
        description: createdCount > 0
          ? `${createdCount} položky byly uloženy, zbytek se nepodařilo uložit.`
          : "Položky se nepodařilo uložit. Zkuste to prosím znovu.",
        variant: "destructive",
      });
    } finally {
      setIsSavingBatch(false);
    }
  };

  const updatePendingPhoto = (id: string, update: Partial<PendingPhoto>) => {
    setPendingPhotos((photos) =>
      photos.map((photo) => (photo.id === id ? { ...photo, ...update } : photo)),
    );
  };

  const handlePhotoUpload = async (selectedFiles: FileList | File[]) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const files = Array.from(selectedFiles);
    const validFiles = files.filter((file) => allowedTypes.includes(file.type) && file.size <= 5 * 1024 * 1024);
    const invalidCount = files.length - validFiles.length;
    if (invalidCount > 0) {
      toast({
        title: "Některé fotografie byly přeskočeny",
        description: `${invalidCount} ${invalidCount === 1 ? "soubor nesplňuje" : "soubory nesplňují"} formát JPG, PNG nebo WebP a limit 5 MB.`,
        variant: "destructive",
      });
    }
    if (validFiles.length === 0) return;

    const photos = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${file.name}`,
      file,
      previewUrl: URL.createObjectURL(file),
      status: "uploading" as const,
    }));
    setPendingPhotos((current) => [...current, ...photos]);
    setIsUploading(true);

    for (const photo of photos) {
      try {
        const upload = await fetch(apiUrl("/api/storage/uploads"), {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": photo.file.type,
            "X-File-Name": encodeURIComponent(photo.file.name),
          },
          body: photo.file,
        });
        if (!upload.ok) {
          const error = await upload.json().catch(() => null);
          throw new Error(error?.error || "Fotografii se nepodařilo nahrát.");
        }
        const { objectPath } = (await upload.json()) as { objectPath: string };
        updatePendingPhoto(photo.id, { status: "uploaded", objectPath });
      } catch (error) {
        updatePendingPhoto(photo.id, {
          status: "error",
          error: error instanceof Error ? error.message : "Zkuste to znovu.",
        });
      }
    }
    setIsUploading(false);
  };

  const removePendingPhoto = (id: string) => {
    setPendingPhotos((photos) => {
      const photo = photos.find((item) => item.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return photos.filter((item) => item.id !== id);
    });
  };

  const uploadedCount = pendingPhotos.filter((photo) => photo.status === "uploaded").length;
  const previewImageUrl = newItem.imageUrl.startsWith("/objects/")
    ? apiUrl(`/api/storage${newItem.imageUrl}`)
    : newItem.imageUrl;

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-display font-bold">Galerie projektů</h1>
        <button
          onClick={() => {
            if (isAdding) resetNewItem();
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold hover:bg-primary/90 hover:shadow-sm transition-all active:scale-[0.98]"
        >
          {isAdding ? (
            "Zrušit"
          ) : (
            <>
              <Plus className="w-4 h-4" /> Přidat projekt
            </>
          )}
        </button>
      </div>

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="bg-card border border-border p-6 rounded-lg mb-8 space-y-4"
        >
          <div className="mb-5">
            <h2 className="text-lg font-bold">Přidat fotografie</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Vyberte více fotografií najednou. Každá se uloží jako samostatný projekt.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">
                Název (CS) <span className="text-muted-foreground/70">(nepovinné)</span>
              </label>
              <input
                type="text"
                value={newItem.titleCs}
                onChange={(e) =>
                  setNewItem({ ...newItem, titleCs: e.target.value })
                }
                className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">
                Název (UK) <span className="text-muted-foreground/70">(nepovinné)</span>
              </label>
              <input
                type="text"
                value={newItem.titleUk}
                onChange={(e) =>
                  setNewItem({ ...newItem, titleUk: e.target.value })
                }
                className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Kategorie</label>
              <input
                type="text"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Lokace</label>
              <input
                type="text"
                value={newItem.location}
                onChange={(e) =>
                  setNewItem({ ...newItem, location: e.target.value })
                }
                className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs text-muted-foreground">
                Fotografie projektu <span className="text-primary">(vyberte jednu nebo více)</span>
              </label>
              <label
                htmlFor="gallery-photo-upload"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  if (!isUploading && event.dataTransfer.files.length > 0) {
                    void handlePhotoUpload(event.dataTransfer.files);
                  }
                }}
                className={`flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary/45 bg-primary/5 px-5 py-7 text-center transition-colors hover:bg-primary/10 ${isUploading ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  id="gallery-photo-upload"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={(event) => {
                    if (event.target.files?.length) {
                      void handlePhotoUpload(event.target.files);
                    }
                    event.target.value = "";
                  }}
                />
                {isUploading ? (
                  <>
                    <Loader2 className="mb-2 h-7 w-7 animate-spin text-primary" />
                    <span className="text-sm font-semibold">
                      Nahrávám fotografie…
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      Nahrávání probíhá postupně, okno nezavírejte
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-2 h-8 w-8 text-primary" />
                    <span className="text-sm font-semibold">
                      Vybrat fotografie z telefonu nebo počítače
                    </span>
                    <span className="mt-1 text-xs text-muted-foreground">
                      Nebo je sem přetáhněte • JPG, PNG, WebP • max. 5 MB za kus
                    </span>
                  </>
                )}
              </label>
              {pendingPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {pendingPhotos.map((photo) => (
                    <div key={photo.id} className="group relative overflow-hidden rounded-lg border border-border bg-background">
                      <img
                        src={photo.previewUrl}
                        alt={photo.file.name}
                        className={`aspect-square w-full object-cover ${photo.status === "uploading" ? "opacity-50" : ""}`}
                      />
                      {photo.status === "uploading" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                          <Loader2 className="h-6 w-6 animate-spin text-white" />
                        </div>
                      )}
                      {photo.status === "uploaded" && (
                        <div className="absolute left-2 top-2 rounded-full bg-green-500 p-1 text-white">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      )}
                      {photo.status === "error" && (
                        <div className="absolute inset-x-0 bottom-0 bg-destructive/90 px-2 py-1 text-[10px] text-white">
                          Nahrání selhalo
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePendingPhoto(photo.id)}
                        disabled={photo.status === "uploading"}
                        className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white opacity-0 transition-opacity hover:bg-destructive group-hover:opacity-100 disabled:pointer-events-none"
                        aria-label={`Odebrat ${photo.file.name}`}
                      >
                        ×
                      </button>
                      <p className="truncate px-2 py-2 text-[11px] text-muted-foreground" title={photo.file.name}>
                        {photo.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {uploadedCount > 1 && (
                <p className="text-xs text-primary">
                  {uploadedCount} fotografií připraveno. Název každého projektu se vezme z názvu souboru.
                </p>
              )}
              <div>
                <label className="text-xs text-muted-foreground">
                  Nebo vložte URL jednoho obrázku
                </label>
                <input
                  type="url"
                  value={newItem.imageUrl.startsWith("/objects/") ? "" : newItem.imageUrl}
                  placeholder="https://…"
                  onChange={(e) =>
                    setNewItem({ ...newItem, imageUrl: e.target.value })
                  }
                  className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary"
                />
              </div>
              {previewImageUrl && (
                <img
                  src={previewImageUrl}
                  alt="Náhled fotografie projektu"
                  className="aspect-video w-full rounded-lg border border-border object-cover"
                />
              )}
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={newItem.featured}
                onChange={(e) =>
                  setNewItem({ ...newItem, featured: e.target.checked })
                }
                className="rounded-sm"
              />
              <label htmlFor="featured" className="text-sm">
                Zvýrazněný projekt na úvodní stránce
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={createItem.isPending || isUploading || isSavingBatch}
            className="bg-primary text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSavingBatch ? "Ukládám fotografie..." : uploadedCount > 1 ? `Uložit ${uploadedCount} projekty` : "Uložit do galerie"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg overflow-hidden group"
          >
            <div className="aspect-[4/3] relative">
              <img
                src={item.imageUrl}
                alt={item.titleCs}
                className="w-full h-full object-cover"
              />
              {item.featured && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                  Zvýrazněno
                </div>
              )}
            </div>
            <div className="p-4">
              {editingItemId === item.id ? (
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">Název (CS)</span>
                    <input
                      type="text"
                      value={editingTitles.titleCs}
                      onChange={(event) => setEditingTitles((current) => ({ ...current, titleCs: event.target.value }))}
                      className="w-full rounded-md border border-border bg-background p-2 text-sm focus:border-primary focus:outline-none"
                      maxLength={200}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-muted-foreground">Název (UK)</span>
                    <input
                      type="text"
                      value={editingTitles.titleUk}
                      onChange={(event) => setEditingTitles((current) => ({ ...current, titleUk: event.target.value }))}
                      className="w-full rounded-md border border-border bg-background p-2 text-sm focus:border-primary focus:outline-none"
                      maxLength={200}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateTitle(item.id)}
                      disabled={updateItem.isPending}
                      className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60"
                    >
                      {updateItem.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      Uložit
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={updateItem.isPending}
                      className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-60"
                    >
                      <X className="h-3.5 w-3.5" />
                      Zrušit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold">{item.titleCs}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.titleUk}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEditing(item)}
                      className="p-1 text-muted-foreground transition-colors hover:text-primary"
                      aria-label={`Upravit název ${item.titleCs}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteItem.isPending}
                      className="p-1 text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Smazat ${item.titleCs}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mb-1">
                {item.category} • {item.location}
              </p>
            </div>
          </div>
        ))}
      </div>
      {items?.length === 0 && (
        <p className="text-muted-foreground">Zatím žádné projekty v galerii.</p>
      )}
    </div>
  );
}

const emptyTestimonial = {
  name: "",
  textCs: "",
  textUk: "",
  project: "",
  rating: 5,
  featured: true,
};

function AdminTestimonials() {
  const { data: testimonials, isLoading } = useListAdminTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyTestimonial);

  const refreshTestimonials = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: getListAdminTestimonialsQueryKey() }),
      queryClient.invalidateQueries({ queryKey: getListTestimonialsQueryKey() }),
    ]);
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTestimonial.mutate(
      {
        data: {
          ...form,
          project: form.project.trim() || undefined,
          rating: Number(form.rating),
        },
      },
      {
        onSuccess: async () => {
          await refreshTestimonials();
          setForm(emptyTestimonial);
          setIsAdding(false);
          toast({
            title: "Reference přidána",
            description: "Nová reference je nyní uložená a podle nastavení viditelná na webu.",
          });
        },
        onError: () => {
          toast({
            title: "Uložení se nezdařilo",
            description: "Zkontrolujte vyplněné údaje a zkuste to znovu.",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleTogglePublished = (id: number, featured: boolean) => {
    updateTestimonial.mutate(
      { id, data: { featured: !featured } },
      {
        onSuccess: refreshTestimonials,
        onError: () => toast({
          title: "Změna se nezdařila",
          description: "Stav zveřejnění se nepodařilo změnit.",
          variant: "destructive",
        }),
      },
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Opravdu chcete tuto referenci smazat?")) return;
    deleteTestimonial.mutate(
      { id },
      {
        onSuccess: async () => {
          await refreshTestimonials();
          toast({ title: "Reference smazána" });
        },
        onError: () => toast({
          title: "Smazání se nezdařilo",
          variant: "destructive",
        }),
      },
    );
  };

  if (isLoading) return <div>Načítání...</div>;

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-display font-bold">Reference klientů</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Přidávejte skutečné zkušenosti klientů a určete, které se zobrazí na hlavní stránce.
          </p>
        </div>
        <button
          onClick={() => {
            setIsAdding((current) => !current);
            setForm(emptyTestimonial);
          }}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          {isAdding ? "Zrušit" : <><Plus className="h-4 w-4" /> Přidat referenci</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="mb-8 space-y-5 rounded-lg border border-border bg-card p-5 sm:p-7">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jméno klienta</span>
              <input
                required
                maxLength={120}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-md border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Jan Novák"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Projekt / lokalita</span>
              <input
                maxLength={160}
                value={form.project}
                onChange={(event) => setForm({ ...form, project: event.target.value })}
                className="w-full rounded-md border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Rekonstrukce bytu, Praha 8"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Text reference (CS)</span>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={form.textCs}
                onChange={(event) => setForm({ ...form, textCs: event.target.value })}
                className="w-full resize-y rounded-md border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Napište zkušenost klienta v češtině…"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Текст відгуку (UK)</span>
              <textarea
                required
                minLength={10}
                maxLength={2000}
                rows={5}
                value={form.textUk}
                onChange={(event) => setForm({ ...form, textUk: event.target.value })}
                className="w-full resize-y rounded-md border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Напишіть відгук українською…"
              />
            </label>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <label className="space-y-2">
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Hodnocení</span>
              <select
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: Number(event.target.value) })}
                className="min-w-44 rounded-md border border-border bg-background px-4 py-3 outline-none focus:border-primary"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>{rating} / 5</option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              />
              Zobrazit na hlavní stránce
            </label>
          </div>

          <button
            type="submit"
            disabled={createTestimonial.isPending}
            className="flex min-h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {createTestimonial.isPending ? "Ukládám…" : "Uložit referenci"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {testimonials?.map((testimonial) => (
          <article key={testimonial.id} className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">{testimonial.name}</h2>
                {testimonial.project && <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{testimonial.project}</p>}
              </div>
              <div className="flex shrink-0 gap-0.5 text-[#D4AF37]" aria-label={`${testimonial.rating} z 5`}>
                {Array.from({ length: testimonial.rating }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
              </div>
            </div>
            <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">{testimonial.textCs}</p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => handleTogglePublished(testimonial.id, testimonial.featured)}
                disabled={updateTestimonial.isPending}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-colors ${testimonial.featured ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
              >
                {testimonial.featured ? "Zveřejněno" : "Skryto"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(testimonial.id)}
                disabled={deleteTestimonial.isPending}
                className="flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Smazat
              </button>
            </div>
          </article>
        ))}
      </div>

      {testimonials?.length === 0 && (
        <div className="rounded-lg border border-dashed border-border bg-card/40 px-6 py-14 text-center">
          <MessageSquareQuote className="mx-auto mb-4 h-10 w-10 text-primary" />
          <h2 className="font-bold">Zatím žádné reference</h2>
          <p className="mt-2 text-sm text-muted-foreground">Klikněte na „Přidat referenci“ a vložte první zkušenost klienta.</p>
        </div>
      )}
    </div>
  );
}
