"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Ban, Eye, Funnel, Pencil, X } from "lucide-react";
import {
  gasHeaderPills,
  gasOverviewCards,
  gasPoolDetailById,
  gasPoolRows,
} from "@/lib/dummy-data";

const pillToneClasses: Record<string, string> = {
  ok: "bg-emerald-500/20 text-emerald-200",
  warn: "bg-orange-500/20 text-orange-200",
  danger: "bg-rose-500/20 text-rose-200",
};

const statusClasses: Record<string, string> = {
  Healthy: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  Moderate: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  "High Risk": "bg-rose-500/20 text-rose-200 border-rose-400/30",
};

export default function GasRoutePage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);

  const selectedDetails = selectedPoolId
    ? (gasPoolDetailById[selectedPoolId] ?? gasPoolDetailById["INV-2024-0091"])
    : null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative space-y-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-4xl text-slate-100">Gas Pools</h1>
            {gasHeaderPills.map((pill) => (
              <span
                key={pill.label}
                className={`rounded-md px-3 py-1 text-xs uppercase ${pillToneClasses[pill.tone]}`}
              >
                {pill.label}
              </span>
            ))}
          </div>
          <div className="h-1 max-w-[520px] rounded-full bg-btn-gradient" />
          <p className="text-xl text-slate-400">
            Manage Gas Sponsorship Pools Powering Agent Payments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="flex h-10 items-center gap-2 rounded-md border border-slate-500 px-4 text-xs uppercase text-slate-100"
          >
            <Funnel className="h-4 w-4" />
            Filter
          </button>
          <Link
            href="/gas/create"
            className="h-10 rounded-md bg-btn-gradient px-4 py-3 text-xs uppercase text-slate-900"
          >
            + Create Pool
          </Link>
        </div>
      </div>

      <div className="grid gap-2 lg:grid-cols-4">
        {gasOverviewCards.map((card) => (
          <article key={card.label} className="bg-[#202225] p-4">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-1 text-4xl font-impact tracking-tight text-slate-100">
              {card.value}
            </p>
          </article>
        ))}
      </div>

      {isFilterOpen && (
        <aside className="absolute right-0 top-[70px] z-20 h-fit w-42.5 rounded-md bg-[#242629] p-3">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase text-slate-300">
            <Funnel className="h-3.5 w-3.5" />
            <span>Filter</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Status", value: "All" },
              { label: "Network", value: "All" },
              { label: "Agent", value: "All" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-2"
              >
                <span className="text-xs uppercase text-slate-300">
                  {item.label}
                </span>
                <button
                  type="button"
                  className="rounded-md bg-[#344136] px-3 py-1.5 text-xs uppercase text-[#c8e8c8]"
                >
                  {item.value}
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 w-full rounded-md bg-[#9bd69e] py-2 text-xs font-semibold uppercase text-[#172417]"
          >
            Apply
          </button>
        </aside>
      )}

      <div className={`${selectedPoolId ? "blur-sm" : ""} transition`}>
        <div className="overflow-hidden rounded-md border border-slate-800 bg-[#1f1f1f]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-btn-gradient text-sm uppercase tracking-wide text-[#111111]">
                <tr>
                  <th className="px-4 py-3">Pool ID</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Daily Cap</th>
                  <th className="px-4 py-3">Burn Rate</th>
                  <th className="px-4 py-3">Linked Agents</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {gasPoolRows.map((row) => (
                  <tr
                    key={`${row.id}-${row.dailyCap}`}
                    className="border-t border-slate-800 text-slate-200 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3 font-medium">{row.balance}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${statusClasses[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.dailyCap}</td>
                    <td className="px-4 py-3">{row.burnRate}</td>
                    <td className="px-4 py-3">{row.linkedAgents}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          className="text-slate-200 hover:text-white"
                          aria-label="Edit gas pool"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-slate-200 hover:text-white"
                          aria-label="Disable gas pool"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedPoolId(row.id)}
                          className="text-slate-200 hover:text-white"
                          aria-label="View gas pool details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-800 px-4 py-3 text-xs text-slate-400">
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1.5 hover:text-slate-200"
            >
              Previous
            </button>
            <span>Page 1 of 184</span>
            <button
              type="button"
              className="rounded-md border border-slate-700 px-3 py-1.5 hover:text-slate-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedPoolId && selectedDetails && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-600 bg-[#202225] p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedPoolId(null)}
                className="text-slate-300 hover:text-white"
                aria-label="Close pool detail modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <h2 className="text-4xl text-slate-100">Pool Detail Page</h2>
            <div className="mt-5 space-y-2 text-lg text-slate-400">
              <div className="grid grid-cols-[220px_1fr]">
                <span>CURRENT BALANCE</span>
                <span className="text-slate-200">
                  {selectedDetails.currentBalance}
                </span>
              </div>
              <div className="grid grid-cols-[220px_1fr]">
                <span>TRANSACTIONS (TOP-UPS)</span>
                <span className="text-slate-200">
                  {selectedDetails.transactionsTopUps}
                </span>
              </div>
              <div className="grid grid-cols-[220px_1fr]">
                <span>AGENTS LINKED</span>
                <span className="text-slate-200">
                  {selectedDetails.agentsLinked}
                </span>
              </div>
              <div className="grid grid-cols-[220px_1fr]">
                <span>SPEND HISTORY</span>
                <span className="text-slate-200">
                  {selectedDetails.spendHistory}
                </span>
              </div>
              <div className="grid grid-cols-[220px_1fr]">
                <span>ALLOWED MERCHANTS</span>
                <span className="text-slate-200">
                  {selectedDetails.allowedMerchants}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
}
