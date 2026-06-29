import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { deleteCategory, saveCategory } from "@/lib/cms.api";
import { categoryImageFallbacks, type DbCategory } from "@/lib/content";
import { Field, ImageField, inputCls } from "./ImageField";

function CategoryCard({ cat }: { cat: DbCategory }) {
  const [name, setName] = useState(cat.name);
  const [image, setImage] = useState<string | null>(cat.image_url);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }
    setBusy(true);
    try {
      await saveCategory({ id: cat.id, name: name.trim(), image_url: image });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success(`${name} saved`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete category "${cat.name}"? Its products stay but lose the category.`))
      return;
    setBusy(true);
    try {
      await deleteCategory({ id: cat.id });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Category deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-background p-5 space-y-3">
      <ImageField
        value={image}
        fallback={categoryImageFallbacks[cat.slug]}
        aspect="aspect-[3/4] max-w-[180px]"
        onChange={setImage}
        label="Change image"
      />
      <Field label="Name">
        <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <div className="flex gap-2">
        <button
          onClick={submit}
          disabled={busy}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground text-background px-4 py-2.5 text-xs font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
          Save
        </button>
        <button
          onClick={remove}
          disabled={busy}
          className="rounded-full border border-destructive/40 text-destructive px-3 py-2.5 hover:bg-destructive/10 transition"
          aria-label="Delete category"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function CategoriesTab({ categories }: { categories: DbCategory[] }) {
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const add = async () => {
    const name = newName.trim();
    if (!name) {
      toast.error("Enter a category name");
      return;
    }
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setBusy(true);
    try {
      await saveCategory({ name, slug, sort_order: categories.length + 1 });
      qc.invalidateQueries({ queryKey: ["site-content"] });
      setNewName("");
      toast.success(`${name} added`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not add category");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <CategoryCard key={c.id} cat={c} />
        ))}
      </div>
      <div className="rounded-3xl border border-dashed border-border bg-background p-5 flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <Field label="New category name">
            <input
              className={inputCls}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Sandals"
            />
          </Field>
        </div>
        <button
          onClick={add}
          disabled={busy}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-xs font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          Add category
        </button>
      </div>
    </div>
  );
}
