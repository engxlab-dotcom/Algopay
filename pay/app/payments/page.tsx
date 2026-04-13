"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Funnel, SlidersHorizontal } from "lucide-react";
import { paymentListRows, paymentProcessSteps } from "@/lib/dummy-data";

const statusClasses: Record<string, string> = {
  Settled: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  Pending: "bg-amber-500/20 text-amber-200 border-amber-400/30",
  Failed: "bg-rose-500/20 text-rose-200 border-rose-400/30",
  Processing: "bg-blue-500/20 text-blue-200 border-blue-400/30",
};

export default function PaymentsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-4"
    >
      <div>
        <h1 className="text-4xl text-slate-100">Payments</h1>
        <p className="mt-1 text-lg text-slate-400">
          Initiate And Process USDC Payments With Gas Sponsorship
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {paymentProcessSteps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            <div className="rounded-md bg-[#202225] px-4 py-2 text-xs uppercase tracking-wide text-slate-300">
              {step}
            </div>
            {index < paymentProcessSteps.length - 1 && (
              <span className="text-xl text-slate-400">→</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="h-10 w-full rounded-md border border-slate-700 bg-white px-4 text-sm text-black placeholder:text-slate-500 sm:w-72"
            placeholder="Search Invoice ID"
          />
          <button
            type="button"
            className="h-10 rounded-md bg-btn-gradient px-5 text-sm uppercase tracking-wide text-slate-900"
          >
            Connect Wallet
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="h-10 rounded-md border border-slate-500 px-4 text-xs uppercase text-slate-100"
          >
            View Logs
          </button>
          <button
            type="button"
            className="h-10 rounded-md border border-slate-500 px-4 text-xs uppercase text-slate-100"
          >
            Process Payment
          </button>
          <button
            type="button"
            className="h-10 rounded-md bg-btn-gradient px-4 text-xs uppercase text-slate-900"
          >
            + Create Payment
          </button>
          <button
            type="button"
            onClick={() => setIsFilterOpen((prev) => !prev)}
            className="grid h-10 w-11 place-items-center rounded-md border border-slate-500 text-slate-200"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        {isFilterOpen && (
          <aside className="absolute right-0 top-2 z-10 h-fit w-42.5 rounded-md bg-[#242629] p-3">
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
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentListRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => router.push(`/payments/${row.id}`)}
                    className="cursor-pointer border-t border-slate-800 text-slate-200 hover:bg-white/5"
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
                    <td className="px-4 py-3">{row.actionTime}</td>
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
    </motion.section>
  );
}
