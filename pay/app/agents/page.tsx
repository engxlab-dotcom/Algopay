"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Ban, Circle, Eye, Pencil } from "lucide-react";
import {
  agentRows,
  agentsHeaderStatuses,
  agentsOverviewCards,
  showAgentsEmptyState,
} from "@/lib/dummy-data";

const statusClasses: Record<string, string> = {
  Settled: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  Pending: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  Failed: "bg-rose-500/20 text-rose-200 border-rose-400/30",
  Processing: "bg-blue-500/20 text-blue-200 border-blue-400/30",
  Completed: "bg-slate-600/40 text-slate-100 border-slate-400/30",
};

export default function AgentsRoutePage() {
  const rows = showAgentsEmptyState ? [] : agentRows;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-4xl text-slate-100">Agents</h1>
            {agentsHeaderStatuses.map((status) => (
              <span
                key={status}
                className={`rounded-md px-3 py-1 text-xs uppercase ${statusClasses[status]}`}
              >
                {status}
              </span>
            ))}
          </div>
          <p className="mt-1 text-lg text-slate-400">
            Manage Entities Authorized To Initiate Payments
          </p>
        </div>

        <Link
          href="/agents/create"
          className="h-10 rounded-md bg-btn-gradient px-4 py-3 text-xs uppercase text-slate-900"
        >
          + Create Agent
        </Link>
      </div>

      <div className="grid gap-2 lg:grid-cols-4">
        {agentsOverviewCards.map((card) => (
          <article key={card.label} className="bg-[#202225] p-4">
            <p className="text-sm uppercase text-slate-400">{card.label}</p>
            <p className="mt-1 text-4xl font-impact tracking-tight text-slate-100">
              {card.value}
            </p>
          </article>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="h-10 rounded-md border border-slate-500 px-4 text-xs uppercase text-slate-100"
        >
          Copy Tx ID
        </button>
        <button
          type="button"
          className="h-10 rounded-md border border-slate-500 px-4 text-xs uppercase text-slate-100"
        >
          View Webhook
        </button>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-md bg-btn-gradient px-4 text-xs uppercase text-slate-900"
        >
          <Circle className="h-4 w-4" />
          Retry Payment
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-800 bg-[#1f1f1f]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-btn-gradient text-sm uppercase tracking-wide text-[#111111]">
              <tr>
                <th className="px-4 py-3">Agent Name / ID</th>
                <th className="px-4 py-3">Daily Limit</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Daily Used</th>
                <th className="px-4 py-3">Last Activity</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16">
                    <div className="mx-auto max-w-md text-center">
                      <Circle className="mx-auto h-10 w-10 text-slate-300" />
                      <h2 className="mt-4 text-5xl text-slate-100">
                        No agents yet
                      </h2>
                      <p className="mt-2 text-slate-400">
                        Create your first agent to start processing payments.
                        Agents are authorized entities that initiate USDC
                        payments on Algorand.
                      </p>
                      <Link
                        href="/agents/create"
                        className="mt-5 inline-block rounded-md bg-btn-gradient px-4 py-2 text-xs font-semibold uppercase text-slate-900"
                      >
                        + Create Your First Agent
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={`${row.id}-${row.status}-${row.lastActivity}`}
                    className="border-t border-slate-800 text-slate-200 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">{row.id}</td>
                    <td className="px-4 py-3 font-medium">{row.dailyLimit}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${statusClasses[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.dailyUsed}</td>
                    <td className="px-4 py-3">{row.lastActivity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/agents/${row.id}/edit`}
                          className="text-slate-200 hover:text-white"
                          aria-label="Edit agent"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          className="text-slate-200 hover:text-white"
                          aria-label="Suspend agent"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="text-slate-200 hover:text-white"
                          aria-label="View agent"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
    </motion.section>
  );
}
