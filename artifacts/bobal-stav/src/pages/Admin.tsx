import { useEffect, useState } from "react";
import { Link } from "wouter";
import { 
  useGetAdminSummary, 
  useGetSiteContent, 
  useUpdateSiteContent,
  useListGalleryItems,
  useCreateGalleryItem,
  useDeleteGalleryItem,
  getGetSiteContentQueryKey,
  getListGalleryItemsQueryKey,
  getGetAdminSummaryQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Settings, Image as ImageIcon, Plus, Trash2, Save, ArrowLeft, LockKeyhole, LogOut, UploadCloud, Loader2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiUrl } from "@/lib/api-url";

export default function Admin() {
  const [authStatus, setAuthStatus] = useState<"checking" | "authenticated" | "guest">("checking");

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
    return <AdminLogin onAuthenticated={() => setAuthStatus("authenticated")} />;
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
        const message = response.status === 429
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
          <img src="/bobal-stav-logo.png" alt="Bobal Stav" className="h-auto w-full" />
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Administrace</h1>
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
            <label htmlFor="admin-password" className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
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
            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
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

        <Link href="/" className="mt-7 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Zpět na web
        </Link>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "gallery">("overview");
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
            <img src="/bobal-stav-logo.png" alt="Bobal Stav" className="h-auto w-full" />
          </Link>
          <span className="rounded-md border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#D4AF37]">
            Admin
          </span>
        </div>
        
        <nav className="grid grid-cols-3 gap-2 overflow-x-auto p-3 md:flex md:flex-1 md:flex-col md:space-y-2 md:p-4">
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
        </nav>
        
        <div className="hidden border-t border-border p-4 md:block">
          <button
            onClick={handleLogout}
            className="mb-2 flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Odhlásit se
          </button>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full">
            <ArrowLeft className="w-4 h-4" />
            Zpět na web
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background p-4 sm:p-6 md:overflow-auto md:p-8">
        <div className="mb-5 flex items-center justify-end gap-3 md:hidden">
          <Link href="/" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
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
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">Položky v galerii</p>
          <p className="text-4xl font-display font-bold text-foreground">{summary?.galleryCount || 0}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">Zvýrazněné projekty</p>
          <p className="text-4xl font-display font-bold text-primary">{summary?.featuredCount || 0}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-lg">
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider mb-2">Služby</p>
          <p className="text-4xl font-display font-bold text-foreground">{summary?.serviceCount || 0}</p>
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by newline and clean up
    const services = e.target.value.split('\n').map(s => s.trim()).filter(s => s.length > 0);
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
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">Obsah webu</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 rounded-lg border border-border bg-card p-4 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Název společnosti</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">IČO</label>
            <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Telefon</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Sídlo</label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Služby (jedna na řádek)</label>
          <textarea 
            name="services" 
            value={formData.services?.join('\n') || ''} 
            onChange={handleServicesChange} 
            rows={5} 
            className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">O nás (Česky)</label>
          <textarea name="aboutCs" value={formData.aboutCs} onChange={handleChange} rows={6} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">O nás (Ukrajinsky)</label>
          <textarea name="aboutUk" value={formData.aboutUk} onChange={handleChange} rows={6} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary" />
        </div>

        <button 
          type="submit" 
          disabled={updateContent.isPending}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold hover:bg-primary/90 hover:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {updateContent.isPending ? "Ukládám..." : <><Save className="w-4 h-4" /> Uložit změny</>}
        </button>
      </form>
    </div>
  );
}

function AdminGallery() {
  const { data: items, isLoading } = useListGalleryItems();
  const deleteItem = useDeleteGalleryItem();
  const createItem = useCreateGalleryItem();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newItem, setNewItem] = useState({
    titleCs: "", titleUk: "", category: "", imageUrl: "", location: "", featured: false
  });

  if (isLoading) return <div>Načítání...</div>;

  const handleDelete = (id: number) => {
    if (confirm("Opravdu chcete smazat tuto položku?")) {
      deleteItem.mutate(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() });
            queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
            toast({ title: "Smazáno", description: "Položka byla odstraněna." });
          }
        }
      );
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.imageUrl) {
      toast({
        title: "Chybí fotografie",
        description: "Nahrajte fotografii nebo vložte její URL.",
        variant: "destructive",
      });
      return;
    }
    createItem.mutate(
      { data: newItem },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListGalleryItemsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetAdminSummaryQueryKey() });
          setIsAdding(false);
          setNewItem({ titleCs: "", titleUk: "", category: "", imageUrl: "", location: "", featured: false });
          toast({ title: "Přidáno", description: "Nová položka byla přidána do galerie." });
        },
        onError: () => {
          toast({
            title: "Chyba",
            description: "Projekt se nepodařilo uložit.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handlePhotoUpload = async (file: File) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Nepodporovaný formát",
        description: "Použijte fotografii JPG, PNG nebo WebP.",
        variant: "destructive",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Soubor je příliš velký",
        description: "Maximální velikost fotografie je 10 MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const request = await fetch(apiUrl("/api/storage/uploads/request-url"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          size: file.size,
          contentType: file.type,
        }),
      });

      if (!request.ok) {
        const error = await request.json().catch(() => null);
        throw new Error(error?.error || "Nepodařilo se připravit nahrávání.");
      }

      const { uploadURL, objectPath } = await request.json() as {
        uploadURL: string;
        objectPath: string;
      };
      const upload = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!upload.ok) {
        throw new Error("Fotografii se nepodařilo nahrát.");
      }

      setNewItem((current) => ({ ...current, imageUrl: objectPath }));
      toast({
        title: "Fotografie nahrána",
        description: "Nyní můžete projekt uložit do galerie.",
      });
    } catch (error) {
      toast({
        title: "Nahrávání selhalo",
        description: error instanceof Error ? error.message : "Zkuste to prosím znovu.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const previewImageUrl = newItem.imageUrl.startsWith("/objects/")
    ? apiUrl(`/api/storage${newItem.imageUrl}`)
    : newItem.imageUrl;

  return (
    <div>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-display font-bold">Galerie projektů</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-bold hover:bg-primary/90 hover:shadow-sm transition-all active:scale-[0.98]"
        >
          {isAdding ? "Zrušit" : <><Plus className="w-4 h-4" /> Přidat projekt</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreate} className="bg-card border border-border p-6 rounded-lg mb-8 space-y-4">
          <h2 className="text-lg font-bold mb-4">Nový projekt</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Název (CS)</label>
              <input required type="text" value={newItem.titleCs} onChange={e => setNewItem({...newItem, titleCs: e.target.value})} className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Název (UK)</label>
              <input required type="text" value={newItem.titleUk} onChange={e => setNewItem({...newItem, titleUk: e.target.value})} className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Kategorie</label>
              <input required type="text" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Lokace</label>
              <input required type="text" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary" />
            </div>
            <div className="space-y-3 md:col-span-2">
              <label className="text-xs text-muted-foreground">Fotografie projektu</label>
              <label
                htmlFor="gallery-photo-upload"
                className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary/45 bg-primary/5 px-5 py-6 text-center transition-colors hover:bg-primary/10 ${isUploading ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  id="gallery-photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  disabled={isUploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handlePhotoUpload(file);
                    event.target.value = "";
                  }}
                />
                {isUploading ? (
                  <>
                    <Loader2 className="mb-2 h-7 w-7 animate-spin text-primary" />
                    <span className="text-sm font-semibold">Nahrávám fotografii…</span>
                  </>
                ) : newItem.imageUrl.startsWith("/objects/") ? (
                  <>
                    <CheckCircle2 className="mb-2 h-7 w-7 text-green-500" />
                    <span className="text-sm font-semibold">Fotografie je nahrána</span>
                    <span className="mt-1 text-xs text-muted-foreground">Kliknutím můžete vybrat jinou</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="mb-2 h-7 w-7 text-primary" />
                    <span className="text-sm font-semibold">Vybrat fotografii z telefonu nebo počítače</span>
                    <span className="mt-1 text-xs text-muted-foreground">JPG, PNG nebo WebP, maximálně 10 MB</span>
                  </>
                )}
              </label>
              {previewImageUrl && (
                <img
                  src={previewImageUrl}
                  alt="Náhled fotografie projektu"
                  className="aspect-video w-full rounded-lg border border-border object-cover"
                />
              )}
              <div>
                <label className="text-xs text-muted-foreground">Nebo vložte URL obrázku</label>
                <input
                  type="url"
                  value={newItem.imageUrl.startsWith("/objects/") ? "" : newItem.imageUrl}
                  placeholder="https://…"
                  onChange={e => setNewItem({...newItem, imageUrl: e.target.value})}
                  className="w-full bg-background border border-border p-2 rounded-md focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="md:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="featured" checked={newItem.featured} onChange={e => setNewItem({...newItem, featured: e.target.checked})} className="rounded-sm" />
              <label htmlFor="featured" className="text-sm">Zvýrazněný projekt na úvodní stránce</label>
            </div>
          </div>
          <button type="submit" disabled={createItem.isPending || isUploading} className="bg-primary text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-primary/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50">
            {createItem.isPending ? "Ukládám..." : "Uložit projekt"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map(item => (
          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden group">
            <div className="aspect-[4/3] relative">
              <img src={item.imageUrl} alt={item.titleCs} className="w-full h-full object-cover" />
              {item.featured && (
                <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-md">
                  Zvýrazněno
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold">{item.titleCs}</h3>
                <button 
                  onClick={() => handleDelete(item.id)}
                  disabled={deleteItem.isPending}
                  className="text-muted-foreground hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{item.category} • {item.location}</p>
            </div>
          </div>
        ))}
      </div>
      {items?.length === 0 && <p className="text-muted-foreground">Zatím žádné projekty v galerii.</p>}
    </div>
  );
}
