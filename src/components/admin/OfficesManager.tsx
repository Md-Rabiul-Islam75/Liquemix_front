"use client";

import { useEffect, useState } from "react";
import {
  FiHome,
  FiMapPin,
  FiPhone,
  FiMail,
  FiLink,
  FiClock,
  FiPlus,
  FiSave,
  FiTrash2,
} from "react-icons/fi";
import {
  adminDelete,
  adminGet,
  adminPost,
  adminPut,
} from "@/lib/adminApi";
import { ErrorToast, SuccessToast } from "@/helpers/ToastHelper";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { Office } from "@/data/offices";

const ENDPOINT = "/api/v1/admin/content/offices";

// The editable subset of an office (strings never null in the form).
type Draft = {
  label: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  mapLink: string;
  hours: string;
  isHeadquarters: boolean;
};

const BLANK_DRAFT: Draft = {
  label: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  mapLink: "",
  hours: "",
  isHeadquarters: false,
};

function toDraft(o: Office): Draft {
  return {
    label: o.label ?? "",
    city: o.city ?? "",
    address: o.address ?? "",
    phone: o.phone ?? "",
    email: o.email ?? "",
    mapLink: o.mapLink ?? "",
    hours: o.hours ?? "",
    isHeadquarters: o.isHeadquarters,
  };
}

/**
 * Admin manager for the office list (backend CRUD at
 * /api/v1/admin/content/offices). Each office is an editable card that
 * saves/deletes on its own; a dashed "add" card at the end creates a new one.
 * Mirrors LogoListManager's per-row model, with the richer office fields.
 */
export default function OfficesManager() {
  const [items, setItems] = useState<Office[]>([]);
  const [saved, setSaved] = useState<Office[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busyId, setBusyId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(BLANK_DRAFT);
  // The office awaiting delete confirmation (null = dialog closed).
  const [pendingDelete, setPendingDelete] = useState<Office | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const list = await adminGet<Office[]>(ENDPOINT);
        const arr = Array.isArray(list) ? list : [];
        setItems(arr);
        setSaved(arr);
      } catch (e) {
        ErrorToast("Load failed", e instanceof Error ? e.message : "Unknown error.");
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  function setField<K extends keyof Office>(id: number, key: K, value: Office[K]) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [key]: value } : it)));
  }

  function rowDirty(it: Office): boolean {
    const s = saved.find((x) => x.id === it.id);
    return !s || JSON.stringify(s) !== JSON.stringify(it);
  }

  async function saveRow(it: Office) {
    if (!it.label.trim()) {
      ErrorToast("Label required", "Every office needs a country / label.");
      return;
    }
    setBusyId(it.id);
    try {
      const updated = await adminPut<Office>(`${ENDPOINT}/${it.id}`, payload(it, it.displayOrder, it.isActive));
      setItems((prev) => prev.map((x) => (x.id === it.id ? updated : x)));
      setSaved((prev) => prev.map((x) => (x.id === it.id ? updated : x)));
      SuccessToast("Saved", "Office updated.");
    } catch (e) {
      ErrorToast("Save failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setBusyId(null);
    }
  }

  async function removeRow(it: Office) {
    setBusyId(it.id);
    try {
      await adminDelete(`${ENDPOINT}/${it.id}`);
      setItems((prev) => prev.filter((x) => x.id !== it.id));
      setSaved((prev) => prev.filter((x) => x.id !== it.id));
      SuccessToast("Deleted", "Office removed.");
    } catch (e) {
      ErrorToast("Delete failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setBusyId(null);
    }
  }

  async function addNew() {
    if (!draft.label.trim()) {
      ErrorToast("Label required", "Enter a country / label first.");
      return;
    }
    setBusyId("new");
    try {
      const created = await adminPost<Office>(ENDPOINT, {
        ...draft,
        displayOrder: items.length,
        isActive: true,
      });
      setItems((prev) => [...prev, created]);
      setSaved((prev) => [...prev, created]);
      setDraft(BLANK_DRAFT);
      SuccessToast("Added", "Office created.");
    } catch (e) {
      ErrorToast("Add failed", e instanceof Error ? e.message : "Unknown error.");
    } finally {
      setBusyId(null);
    }
  }

  if (!loaded) {
    return <p className="text-sm text-neutral-500">Loading offices…</p>;
  }

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-neutral-500">
          No offices yet. Add one below — it appears on the public /contact page
          and in the footer.
        </p>
      )}

      <ul className="space-y-4">
        {items.map((it) => (
          <li
            key={it.id}
            className={`rounded-xl border bg-white-base p-4 md:p-5 ${
              it.isHeadquarters ? "border-primary-200 ring-1 ring-primary-100" : "border-neutral-100"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600">
                <FiMapPin />
              </span>
              <p className="text-sm font-bold text-neutral-900">
                {it.label || "Untitled office"}
                {it.city ? <span className="font-medium text-neutral-500"> · {it.city}</span> : null}
              </p>
              {it.isHeadquarters && (
                <span className="inline-flex items-center gap-1 px-2 h-5 rounded-full bg-primary-500 text-white-base text-[10px] font-bold uppercase tracking-wide">
                  <FiHome className="text-[10px]" /> HQ
                </span>
              )}
              {!it.isActive && (
                <span className="inline-flex items-center px-2 h-5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-bold uppercase tracking-wide">
                  Hidden
                </span>
              )}
            </div>

            <OfficeFields
              value={toDraft(it)}
              onChange={(patch) =>
                setItems((prev) =>
                  prev.map((x) => (x.id === it.id ? { ...x, ...patch } : x))
                )
              }
            />

            <div className="mt-3 flex items-center gap-4 flex-wrap">
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 select-none">
                <input
                  type="checkbox"
                  checked={it.isHeadquarters}
                  onChange={(e) => setField(it.id, "isHeadquarters", e.target.checked)}
                />
                Headquarters
              </label>
              <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 select-none">
                <input
                  type="checkbox"
                  checked={it.isActive}
                  onChange={(e) => setField(it.id, "isActive", e.target.checked)}
                />
                Active (visible on site)
              </label>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => saveRow(it)}
                  disabled={busyId === it.id || !rowDirty(it)}
                  className="inline-flex items-center gap-1 h-9 px-4 rounded-lg bg-primary-500 text-white-base text-xs font-semibold hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiSave /> {busyId === it.id ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setPendingDelete(it)}
                  disabled={busyId === it.id}
                  aria-label="Delete office"
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-neutral-200 text-error-500 hover:bg-error-50 disabled:opacity-40"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </li>
        ))}

        {/* Add card */}
        <li className="rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 p-4 md:p-5">
          <p className="text-sm font-bold text-neutral-900 mb-3">Add an office</p>
          <OfficeFields
            value={draft}
            onChange={(patch) => setDraft((d) => ({ ...d, ...patch }))}
          />
          <div className="mt-3 flex items-center gap-4">
            <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={draft.isHeadquarters}
                onChange={(e) => setDraft((d) => ({ ...d, isHeadquarters: e.target.checked }))}
              />
              Headquarters
            </label>
            <button
              type="button"
              onClick={addNew}
              disabled={busyId === "new" || !draft.label.trim()}
              className="ml-auto inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-secondary-500 text-white-base text-sm font-semibold hover:bg-secondary-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FiPlus /> {busyId === "new" ? "Adding…" : "Add office"}
            </button>
          </div>
        </li>
      </ul>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this office?"
        message={
          pendingDelete
            ? `“${pendingDelete.label}${
                pendingDelete.city ? ` · ${pendingDelete.city}` : ""
              }” will be removed from the Contact page and footer. This can’t be undone.`
            : ""
        }
        confirmLabel="Delete office"
        onConfirm={() => {
          if (pendingDelete) removeRow(pendingDelete);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}

function payload(d: Draft | Office, displayOrder: number, isActive: boolean) {
  return {
    label: d.label,
    city: d.city,
    address: d.address,
    phone: d.phone,
    email: d.email,
    mapLink: d.mapLink,
    hours: d.hours,
    isHeadquarters: d.isHeadquarters,
    displayOrder,
    isActive,
  };
}

/** The shared field grid used by both existing cards and the add card. */
function OfficeFields({
  value,
  onChange,
}: {
  value: Draft;
  onChange: (patch: Partial<Draft>) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FieldText
          label="Country / label"
          placeholder="Bangladesh"
          value={value.label}
          onChange={(v) => onChange({ label: v })}
          maxLength={120}
        />
        <FieldText
          label="City"
          placeholder="Dhaka"
          value={value.city}
          onChange={(v) => onChange({ city: v })}
          maxLength={120}
        />
      </div>
      <Field label="Address" icon={<FiMapPin />}>
        <textarea
          rows={2}
          className="admin-input resize-y"
          placeholder="House# 1/C, Road# 07, …"
          value={value.address}
          onChange={(e) => onChange({ address: e.target.value })}
        />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Phone" icon={<FiPhone />}>
          <input
            className="admin-input"
            placeholder="+880 …"
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            maxLength={60}
          />
        </Field>
        <Field label="Email" icon={<FiMail />}>
          <input
            className="admin-input"
            placeholder="dhaka@liquemix.com"
            value={value.email}
            onChange={(e) => onChange({ email: e.target.value })}
            maxLength={160}
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Google Maps link" icon={<FiLink />}>
          <input
            className="admin-input"
            placeholder="https://maps.google.com/?q=…"
            value={value.mapLink}
            onChange={(e) => onChange({ mapLink: e.target.value })}
          />
        </Field>
        <Field label="Business hours" icon={<FiClock />}>
          <input
            className="admin-input"
            placeholder="Mon–Sat · 10:00–19:00 (IST)"
            value={value.hours}
            onChange={(e) => onChange({ hours: e.target.value })}
            maxLength={160}
          />
        </Field>
      </div>
    </div>
  );
}

function FieldText({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <Field label={label}>
      <input
        className="admin-input"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-neutral-500 mb-1">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
