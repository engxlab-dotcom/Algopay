import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { agentById, editAgentRecentChanges } from "@/lib/dummy-data";

type EditAgentPageProps = {
  params: Promise<{ agentId: string }>;
};

export default async function EditAgentPage({ params }: EditAgentPageProps) {
  const { agentId } = await params;
  const agent = agentById[agentId];

  if (!agent) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl text-slate-100">Edit Agent</h1>
          <p className="mt-1 text-lg text-slate-400">
            Modify Agent Settings And Limits
          </p>
        </div>
        <span className="rounded-md bg-[#2f3f2f] px-3 py-1.5 text-xs uppercase text-[#b6e0b6]">
          {agent.state}
        </span>
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
                defaultValue={agent.name}
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. Agent-04"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Wallet Address (Algorand)
              </label>
              <input
                defaultValue={agent.walletAddress}
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. ABCDEF123...XYZ"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Daily Limit (USD cents)
              </label>
              <input
                defaultValue={agent.dailyLimitCents}
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. 500000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Pool Assignment
              </label>
              <input
                defaultValue={agent.poolAssignment}
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="Select a pool..."
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Vendor Whitelist Hash (optional)
              </label>
              <input
                defaultValue={agent.vendorWhitelistHash}
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

        <div className="space-y-4">
          <aside className="rounded-md border border-red-900 bg-red-950/25 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-red-400">
              Danger Zone
            </h2>
            <p className="mt-3 border-t border-red-900 pt-3 text-sm text-red-200/80">
              Permanently delete this agent and all associated payment history.
            </p>
            <button
              type="button"
              className="mt-4 rounded-md border border-red-600 px-4 py-2 text-xs uppercase text-red-300"
            >
              Delete Agent
            </button>
          </aside>

          <aside className="rounded-md border border-slate-700 bg-[#1d1f22] p-4">
            <h2 className="text-xl text-slate-200">Recent Changes</h2>
            <div className="mt-3 space-y-3 border-t border-slate-700 pt-3">
              {editAgentRecentChanges.map((item) => (
                <div key={item.title}>
                  <p className="text-sm font-semibold text-slate-200">
                    {item.title}
                  </p>
                  <p className="text-sm text-slate-500">{item.meta}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
