"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  RemoveFormatting,
  Underline,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Optional soft character cap — shows "n / max" and warns past the cap. */
  maxLength?: number;
  minHeight?: number;
};

/**
 * Lightweight WYSIWYG editor for non-technical editors. Writes plain HTML
 * (the same shape the public article page renders), so authors get bold,
 * headings, and lists without touching tags. Built on contentEditable +
 * document.execCommand — deprecated but universally supported and dependency-
 * free. The output is identical to what a hand-written <p>/<h2>/<ul> would be.
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing…",
  maxLength,
  minHeight = 280,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [chars, setChars] = useState(0);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Sync external value → editor without clobbering the caret on our own edits.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (value !== el.innerHTML) {
      el.innerHTML = value || "";
      setChars(el.innerText.trim().length);
    }
  }, [value]);

  // Prefer <p> over <div> for new paragraphs so output matches the article CSS.
  useEffect(() => {
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
      /* not all browsers honour this — harmless */
    }
  }, []);

  const refreshActive = useCallback(() => {
    if (typeof document === "undefined") return;
    const block = (() => {
      try {
        return String(document.queryCommandValue("formatBlock") || "").toLowerCase();
      } catch {
        return "";
      }
    })();
    const q = (cmd: string) => {
      try {
        return document.queryCommandState(cmd);
      } catch {
        return false;
      }
    };
    setActive({
      bold: q("bold"),
      italic: q("italic"),
      underline: q("underline"),
      ul: q("insertUnorderedList"),
      ol: q("insertOrderedList"),
      h2: block === "h2",
      h3: block === "h3",
    });
  }, []);

  const emit = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    onChange(el.innerHTML);
    setChars(el.innerText.trim().length);
    refreshActive();
  }, [onChange, refreshActive]);

  const exec = useCallback(
    (command: string, valueArg?: string) => {
      ref.current?.focus();
      document.execCommand(command, false, valueArg);
      emit();
    },
    [emit]
  );

  const toggleBlock = useCallback(
    (tag: "h2" | "h3") => {
      const isActive = active[tag];
      exec("formatBlock", isActive ? "p" : tag);
    },
    [active, exec]
  );

  const applyLink = useCallback(() => {
    const url = linkUrl.trim();
    if (url) {
      const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
      exec("createLink", href);
    }
    setLinkUrl("");
    setLinkOpen(false);
  }, [linkUrl, exec]);

  const over = maxLength != null && chars > maxLength;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white-base focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-neutral-100 bg-neutral-50">
        <ToolBtn label="Bold" active={active.bold} onClick={() => exec("bold")}>
          <Bold size={16} />
        </ToolBtn>
        <ToolBtn label="Italic" active={active.italic} onClick={() => exec("italic")}>
          <Italic size={16} />
        </ToolBtn>
        <ToolBtn
          label="Underline"
          active={active.underline}
          onClick={() => exec("underline")}
        >
          <Underline size={16} />
        </ToolBtn>

        <Divider />

        <ToolBtn label="Heading 2" active={active.h2} onClick={() => toggleBlock("h2")}>
          <Heading2 size={16} />
        </ToolBtn>
        <ToolBtn label="Heading 3" active={active.h3} onClick={() => toggleBlock("h3")}>
          <Heading3 size={16} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          label="Bullet list"
          active={active.ul}
          onClick={() => exec("insertUnorderedList")}
        >
          <List size={16} />
        </ToolBtn>
        <ToolBtn
          label="Numbered list"
          active={active.ol}
          onClick={() => exec("insertOrderedList")}
        >
          <ListOrdered size={16} />
        </ToolBtn>

        <Divider />

        <ToolBtn
          label="Add link"
          active={linkOpen}
          onClick={() => setLinkOpen((o) => !o)}
        >
          <Link2 size={16} />
        </ToolBtn>
        <ToolBtn label="Clear formatting" onClick={() => exec("removeFormat")}>
          <RemoveFormatting size={16} />
        </ToolBtn>
      </div>

      {/* Link input row */}
      {linkOpen && (
        <div className="flex items-center gap-2 px-2 py-2 border-b border-neutral-100 bg-primary-50/50">
          <input
            type="url"
            autoFocus
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") setLinkOpen(false);
            }}
            placeholder="https://example.com — select text first, then add the link"
            className="flex-1 h-9 px-3 rounded-md border border-neutral-200 text-sm focus:outline-none focus:border-primary-500"
          />
          <button
            type="button"
            onClick={applyLink}
            className="h-9 px-3 rounded-md bg-primary-500 text-white-base text-sm font-semibold hover:bg-primary-600"
          >
            Apply
          </button>
        </div>
      )}

      {/* Editable surface */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={emit}
        onKeyUp={refreshActive}
        onMouseUp={refreshActive}
        onFocus={refreshActive}
        className="prose-news rte-content px-4 py-3 overflow-y-auto"
        style={{ minHeight }}
      />

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-neutral-100 bg-neutral-50 text-[11px]">
        <span className="text-neutral-400">
          Select text, then use the toolbar — no HTML needed.
        </span>
        <span className={over ? "font-semibold text-error-500" : "text-neutral-400"}>
          {chars}
          {maxLength != null ? ` / ${maxLength}` : " characters"}
        </span>
      </div>
    </div>
  );
}

function ToolBtn({
  children,
  label,
  active,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      // Keep the editor selection alive — buttons must not steal focus.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-md transition-colors ${
        active
          ? "bg-primary-100 text-primary-700"
          : "text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900"
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-1 w-px h-5 bg-neutral-200" />;
}
