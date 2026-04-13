"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function CreateAgentPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-4"
    >
      <div>
        <h1 className="text-4xl text-slate-100">Create Agent</h1>
        <p className="mt-1 text-lg text-slate-400">
          Add A New Agent Authorized To Initiate Payments
        </p>
      </div>

      <Link
        href="/agents"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back To Agents
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="rounded-md border border-slate-800 bg-[#1d1f22] p-4">
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Agent Name
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. Agent-04"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Wallet Address (Algorand)
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. ABCDEF123...XYZ"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Daily Limit (USD cents)
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. 500000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Pool Assignment
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="Select a pool..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Vendor Whitelist Hash (optional)
              </label>
              <input
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. 0x1a2b3c..."
              />
            </div>

            <div className="flex items-center gap-3 pt-1">
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
                Create Agents
              </button>
            </div>
          </form>
        </section>

        <aside className="h-fit rounded-md border border-slate-800 bg-[#1d1f22] p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            About Agents
          </h2>
          <ul className="mt-4 space-y-4 text-sm text-slate-400">
            <li>
              Agents are authorized entities that can initiate USDC payments on
              behalf of your platform.
            </li>
            <li>
              Each agent has a daily spending limit that resets at midnight UTC.
            </li>
            <li>
              Agents must be linked to a funded Gas Pool to process
              transactions.
            </li>
            <li>
              Vendor Whitelist restricts which merchants the agent can pay.
            </li>
          </ul>
        </aside>
      </div>
    </motion.section>
  );
}
