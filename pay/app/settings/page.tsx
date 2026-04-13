"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  settingsApiKeyRows,
  settingsOrganizationProfile,
  settingsTabs,
  type SettingsApiKeyRow,
} from "@/lib/dummy-data";

const statusClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-200",
  REVOKED: "bg-orange-500/20 text-orange-200",
};

export default function SettingsRoutePage() {
  const [revokeTarget, setRevokeTarget] = useState<SettingsApiKeyRow | null>(
    null,
  );
  const hasRevokeModal = useMemo(() => Boolean(revokeTarget), [revokeTarget]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative space-y-4"
    >
      <div>
        <h1 className="text-4xl text-slate-100">Settings</h1>
        <p className="mt-1 text-lg text-slate-400">
          Manage Your Account, API Keys And Organization Preferences
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-8 border-b border-slate-800 pb-2">
        {settingsTabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`pb-2 text-xs uppercase ${
              index === 0
                ? "border-b-2 border-btn-gradient text-slate-100"
                : "text-slate-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        className={`${hasRevokeModal ? "blur-sm" : ""} space-y-3 transition`}
      >
        <section className="rounded-md border border-slate-800 bg-[#1d1f22] p-4">
          <h2 className="border-b border-slate-700 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            Organisation Profile
          </h2>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-500 text-sm font-semibold text-slate-100">
                {settingsOrganizationProfile.initials}
              </div>
              <div>
                <p className="text-2xl text-slate-100">
                  {settingsOrganizationProfile.name}
                </p>
                <p className="text-sm text-slate-400">
                  {settingsOrganizationProfile.subtitle}
                </p>
              </div>
            </div>

            <Link
              href="/settings/edit-profile"
              className="rounded-md border border-slate-500 px-4 py-2 text-xs uppercase text-slate-100"
            >
              Edit Profile
            </Link>
          </div>
        </section>

        <section className="rounded-md border border-slate-800 bg-[#1d1f22] p-4">
          <h2 className="border-b border-slate-700 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
            API Keys
          </h2>

          <div className="space-y-4 pt-4">
            {settingsApiKeyRows.map((row) => (
              <div
                key={row.id}
                className="grid items-center gap-3 lg:grid-cols-[1fr_240px_120px_120px]"
              >
                <div>
                  <p className="text-3xl text-slate-100">{row.name}</p>
                  <p className="text-sm text-slate-400">{row.emailRole}</p>
                </div>

                <p className="text-sm text-slate-500">{row.createdAt}</p>

                <span
                  className={`inline-block rounded-md px-3 py-2 text-xs uppercase ${statusClasses[row.status]}`}
                >
                  {row.status}
                </span>

                <div className="flex justify-start lg:justify-end">
                  <button
                    type="button"
                    onClick={() => setRevokeTarget(row)}
                    className="rounded-md border border-red-600 px-4 py-2 text-xs uppercase text-red-400"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-red-900 bg-red-950/25 p-4">
          <h2 className="border-b border-red-900 pb-2 text-xs font-semibold uppercase tracking-wide text-red-400">
            Danger Zone
          </h2>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase text-red-300">
                Delete Organization
              </p>
              <p className="max-w-2xl text-sm text-red-200/75">
                Permanently delete your organization, all agents, pools and
                payment history.
              </p>
            </div>
            <button
              type="button"
              className="rounded-md border border-red-600 px-4 py-2 text-xs uppercase text-red-400"
            >
              Delete Org.
            </button>
          </div>
        </section>
      </div>

      {revokeTarget && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/45 px-4">
          <div className="w-full max-w-lg rounded-md border border-red-900 bg-red-950/70 p-4 shadow-xl backdrop-blur-sm">
            <h3 className="border-b border-red-900 pb-2 text-sm font-semibold uppercase tracking-wide text-red-400">
              Are You Sure You Want To Revoke API ?
            </h3>
            <div className="mt-3">
              <p className="text-3xl text-slate-100">{revokeTarget.name}</p>
              <p className="text-sm text-slate-300">{revokeTarget.emailRole}</p>
            </div>

            <div className="mt-3 rounded-md border border-slate-700 bg-[#2a2d31] px-3 py-2 text-sm text-slate-500">
              API : {revokeTarget.maskedApiKey}
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRevokeTarget(null)}
                className="rounded-md border border-slate-600 px-4 py-2 text-xs uppercase text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded-md border border-red-600 px-4 py-2 text-xs uppercase text-red-400"
              >
                Revoke API
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
