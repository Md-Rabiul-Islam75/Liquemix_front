"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
} from "react-icons/fi";
import { adminLogin } from "@/lib/adminApi";

/**
 * Admin login — posts to /api/v1/auth/admin/login, stores the access
 * token in localStorage via adminApi.setToken(), then bounces to the
 * dashboard (or to ?next=... if present).
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("admin@liquemix.local");
  const [password, setPassword] = useState("Admin@1234");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await adminLogin(email, password);
      router.push(next);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary-900 text-white-base">
        <div
          aria-hidden
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 85% 30%, rgba(245,124,0,0.5) 0%, transparent 60%), radial-gradient(ellipse 70% 60% at 10% 90%, rgba(255,179,0,0.3) 0%, transparent 55%), linear-gradient(120deg, #072454 0%, #0a3674 35%, #0d4690 75%, #1565c0 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo/LiqueMix.png"
              alt="LiqueMix"
              width={150}
              height={40}
              priority
              className="h-9 w-auto brightness-0 invert"
            />
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold tracking-wider uppercase text-accent-300">
              Admin
            </span>
          </Link>

          <div className="max-w-md">
            <p className="text-[11px] font-bold tracking-[0.22em] uppercase text-accent-300 mb-3">
              For LiqueMix staff only
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Run the catalog the public site reads from.
            </h1>
            <p className="mt-4 text-white/75 leading-relaxed">
              Manage products, categories, system solutions, references,
              news, and the technical documents that ship with every order
              — from one workspace.
            </p>
          </div>

          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} LiqueMix. Internal use only.
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white-base">
        <div className="w-full max-w-sm">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <Image
              src="/logo/LiqueMix.png"
              alt="LiqueMix"
              width={150}
              height={40}
              priority
              className="h-9 w-auto"
            />
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary-50 text-[10px] font-bold tracking-wider uppercase text-primary-700">
              Admin
            </span>
          </Link>

          <h2 className="text-2xl font-bold text-neutral-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-neutral-600">
            Sign in with your LiqueMix admin credentials.
          </p>

          {error && (
            <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-300 text-error-600 text-sm">
              <FiAlertCircle className="text-base mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-neutral-800 mb-1.5"
              >
                Work email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@liquemix.com"
                  className="w-full h-11 pl-10 pr-3 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-neutral-800"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-semibold text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-400 hover:text-primary-600 hover:bg-primary-50"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
              />
              Keep me signed in for 7 days
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-500 text-white-base font-semibold hover:bg-primary-600 transition-colors shadow-[0_8px_24px_-8px_rgba(21,101,192,0.45)] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing in…" : <>Sign in <FiArrowRight /></>}
            </button>
          </form>

          <p className="mt-8 text-xs text-neutral-500 text-center">
            Trouble signing in? Contact{" "}
            <a
              href="mailto:it@liquemix.com"
              className="font-semibold text-primary-600 hover:text-primary-700"
            >
              it@liquemix.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
