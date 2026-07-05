"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiImage, FiPlus, FiSave, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import {
  adminDelete,
  adminGet,
  adminPost,
  adminPut,
  adminUploadFile,
} from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";

export type LogoItem = {
  id: number;
  name: string;
  logo: string | null;
  displayOrder: number;
  isActive: boolean;
};

/**
 * Reusable manager for a simple "logo + name + order + active" list backed by
 * an admin CRUD endpoint. Used for both Top Clients and Certifications — they
 * share the exact same shape. Each row saves/deletes independently; an "Add"
 * card creates a new one.
 */
export default function LogoListManager({
  endpoint,
  itemNoun,
  uploadPrefix,
  addLabel = "Add",
}: {
  /** Admin CRUD base, e.g. "/api/v1/admin/content/top-clients". */
  endpoint: string;
  /** Singular noun for messages, e.g. "client" / "certification". */
  itemNoun: string;
  /** Storage folder for uploaded logos, e.g. "top-clients". */
  uploadPrefix: string;
  addLabel?: string;
}) {
  const [items, setItems] = useState<LogoItem[]>([]);
  const [saved, setSaved] = useState<LogoItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState<number | "new" | null>(null);

  const [draftName, setDraftName] = useState("");
  const [draftLogo, setDraftLogo] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await adminGet<LogoItem[]>(endpoint);
        const arr = Array.isArray(list) ? list : [];
        setItems(arr);
        setSaved(arr);
      } catch (e) {
        ErrorToast("Load failed", e instanceof Error ? e.message : "Unknown error.");
      } finally {
        setLoaded(true);
      }
    })();
  }, [endpoint]);

  function setField<K extends keyof LogoItem>(id: number, key: K, value: LogoItem[K]) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  }

  function rowDirty(it: LogoItem): boolean {
    const s = saved.find((x) => x.id === it.id);
    return !s || JSON.stringify(s) !== JSON.stringify(it);
  }

  async function saveRow(it: LogoItem) {
    if (!it.name.trim()) {
      ErrorToast("Name required", `Every ${itemNoun} needs a name.`);
      return;
    }
    setBusyId(it.id);
    try {
      const updated = await adminPut<LogoItem>(`${endpoint}/${it.id}`, {
        name: it.name,
        logo: it.logo,
        displayOrder: it.displayOrder,
        isActive: it.isActive,
      });
      setItems((prev) => prev.map((x) => (x.id === it.id ? updated : x)));
      setSaved((prev) => prev.map((x) => (x.id === it.id ? updated : x)));
      SuccessToast("Saved", `${cap(itemNoun)} updated.`);
    } catch (e) {
      ErrorToast("Save failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeRow(it: LogoItem) {
    setBusyId(it.id);
    try {
      await adminDelete(`${endpoint}/${it.id}`);
      setItems((prev) => prev.filter((x) => x.id !== it.id));
      setSaved((prev) => prev.filter((x) => x.id !== it.id));
      SuccessToast("Deleted", `${cap(itemNoun)} removed.`);
    } catch (e) {
      ErrorToast("Delete failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setBusyId(null);
    }
  }

  async function addNew() {
    if (!draftName.trim()) {
      ErrorToast("Name required", `Enter a ${itemNoun} name first.`);
      return;
    }
    setBusyId("new");
    try {
      const created = await adminPost<LogoItem>(endpoint, {
        name: draftName,
        logo: draftLogo || null,
        displayOrder: items.length,
        isActive: true,
      });
      setItems((prev) => [...prev, created]);
      setSaved((prev) => [...prev, created]);
      setDraftName("");
      setDraftLogo("");
      SuccessToast("Added", `${cap(itemNoun)} created.`);
    } catch (e) {
      ErrorToast("Add failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setBusyId(null);
    }
  }

  if (!loaded) {
    return (
      <p className="text-sm text-neutral-500">Loading {itemNoun}s…</p>
    );
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-neutral-500">
          No {itemNoun}s yet. Add one below — the public section stays hidden
          until at least one is active.
        </p>
      )}

      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-3">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex gap-3 rounded-xl border border-neutral-100 bg-white-base p-3"
          >
            <LogoCell
              value={it.logo ?? ""}
              onChange={(v) => setField(it.id, "logo", v || null)}
              prefix={uploadPrefix}
            />
            <div className="flex-1 min-w-0 flex flex-col gap-2">
              <input
                type="text"
                value={it.name}
                onChange={(e) => setField(it.id, "name", e.target.value)}
                placeholder={`${cap(itemNoun)} name`}
                className="admin-input"
                maxLength={200}
              />
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 select-none shrink-0">
                  <input
                    type="checkbox"
                    checked={it.isActive}
                    onChange={(e) => setField(it.id, "isActive", e.target.checked)}
                  />
                  Active
                </label>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => saveRow(it)}
                    disabled={busyId === it.id || !rowDirty(it)}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-primary-500 text-white-base text-xs font-semibold hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <FiSave /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(it)}
                    disabled={busyId === it.id}
                    aria-label={`Delete ${itemNoun}`}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-neutral-200 text-error-500 hover:bg-error-50 disabled:opacity-40"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
        {/* Add card — flows as the next grid cell (half-row), matching a client card */}
        <li className="flex gap-3 rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 p-3">
          <LogoCell value={draftLogo} onChange={setDraftLogo} prefix={uploadPrefix} />
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <input
              type="text"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder={`New ${itemNoun} name`}
              className="admin-input"
              maxLength={200}
              onKeyDown={(e) => {
                if (e.key === "Enter") addNew();
              }}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addNew}
                disabled={busyId === "new" || !draftName.trim()}
                className="ml-auto inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-secondary-500 text-white-base text-sm font-semibold hover:bg-secondary-600 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FiPlus /> {busyId === "new" ? "Adding…" : addLabel}
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Compact square logo cell: thumbnail + click-to-upload + clear. */
function LogoCell({
  value,
  onChange,
  prefix,
}: {
  value: string;
  onChange: (next: string) => void;
  prefix: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      ErrorToast("Not an image", `"${file.name}" is not an image.`);
      return;
    }
    try {
      setBusy(true);
      const url = await adminUploadFile(file, prefix);
      onChange(url);
    } catch (err) {
      ErrorToast("Upload failed", err instanceof Error ? err.message : "Unknown error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative w-16 h-16 shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden">
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      {value ? (
        <>
          <Image src={value} alt="logo" fill sizes="64px" className="object-contain p-1" unoptimized />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove logo"
            className="absolute top-0.5 right-0.5 inline-flex items-center justify-center w-5 h-5 rounded bg-white-base/90 text-error-500 shadow-soft"
          >
            <FiX className="text-xs" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-full text-neutral-400 hover:text-primary-500"
        >
          {busy ? <FiUpload className="animate-pulse" /> : <FiImage />}
          <span className="text-[9px] mt-0.5">{busy ? "…" : "Logo"}</span>
        </button>
      )}
    </div>
  );
}
