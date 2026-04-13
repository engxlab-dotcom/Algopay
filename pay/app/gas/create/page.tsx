"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { gasCreateNetworks } from "@/lib/dummy-data";

export default function CreateGasPoolPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      <div>
        <h1 className="text-4xl text-slate-100">Create Gas Pool</h1>
        <p className="mt-1 text-lg text-slate-400">
          Set Up A New Gas Sponsorship Pool For Your Agents
        </p>
      </div>

      <Link
        href="/gas"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back To Gas Pool
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="rounded-md border border-slate-800 bg-[#1d1f22] p-4">
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Pool Name
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. Pool-alpha"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                API Key ID
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. ABCDEF123...XYZ"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Daily Cap (USD cents)
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. 500000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Alert Threshold (USDC)
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Blockchain Network
              </label>
              <div className="flex flex-wrap gap-2">
                {gasCreateNetworks.map((network, index) => (
                  <button
                    key={network}
                    type="button"
                    className={`rounded-md border px-4 py-2 text-xs uppercase ${
                      index === 0
                        ? "bg-slate-100 text-slate-900"
                        : "border-slate-500 text-slate-100"
                    }`}
                  >
                    {network}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-800 pt-4">
              <button
                type="button"
                className="rounded-md border border-slate-500 px-4 py-2 text-xs uppercase text-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-btn-gradient px-4 py-2 text-xs uppercase text-slate-900"
              >
                Create Pool
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-4">
          <aside className="rounded-md border border-slate-700 bg-[#1d1f22] p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              How Gas Pools Work
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-300">
              <li>1. Fund the pool with USDC</li>
              <li>2. Assign agents to this pool</li>
              <li>3. Gas is auto-sponsored per transaction</li>
              <li>4. Monitor burn rate in dashboard</li>
            </ol>
          </aside>

          <aside className="rounded-md border border-emerald-900 bg-emerald-950/30 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Initial Funding Required
            </h2>
            <p className="mt-3 text-sm text-emerald-100/80">
              You will need to top up this pool with USDC after creation before
              agents can process transactions.
            </p>
            <button
              type="button"
              className="mt-4 rounded-md border border-emerald-500 px-4 py-2 text-xs uppercase text-emerald-300"
            >
              Delete Agent
            </button>
          </aside>
        </div>
      </div>
    </motion.section>
  );
}
