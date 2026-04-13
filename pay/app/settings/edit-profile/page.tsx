import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditSettingsProfilePage() {
  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-4xl text-slate-100">Edit Profile</h1>
        <p className="text-2xl text-slate-400">-</p>
      </div>

      <Link
        href="/settings"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back To Setting
      </Link>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <section className="rounded-md border border-slate-800 bg-[#1d1f22] p-4">
          <form className="space-y-4">
            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Name of the Org.
              </label>
              <input
                defaultValue=""
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. Pool-alpha"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                API Key ID
              </label>
              <input
                defaultValue=""
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. ABCDEF123...XYZ"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Daily Cap (USD cents)
              </label>
              <input
                defaultValue=""
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="e.g. 500000"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm text-slate-300">
                Alert Threshold (USDC)
              </label>
              <input
                defaultValue=""
                className="h-12 w-full rounded-md border border-slate-700 bg-[#242629] px-3 text-slate-100 placeholder:text-slate-500"
                placeholder="50"
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                type="submit"
                className="rounded-md bg-btn-gradient px-4 py-2 text-xs uppercase text-slate-900"
              >
                Update Profile
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-500 px-4 py-2 text-xs uppercase text-slate-100"
              >
                Discard Change
              </button>
            </div>
          </form>
        </section>

        <div className="space-y-4">
          <aside className="rounded-md border border-slate-700 bg-[#1d1f22] p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
              How Gas Pools Work
            </h2>
            <div className="mt-4 border-t border-slate-700 pt-3">
              <div className="mx-auto h-44 w-44 rounded-full bg-slate-500" />
              <button
                type="button"
                className="mx-auto mt-4 block rounded-md border border-slate-500 px-4 py-2 text-xs uppercase text-slate-100"
              >
                Update Profile Pic
              </button>
              <p className="mt-4 text-center text-sm text-slate-300">
                Last Updated On 12 march
              </p>
            </div>
          </aside>

          <aside className="rounded-md border border-emerald-900 bg-emerald-950/30 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Initial Funding Required
            </h2>
            <p className="mt-3 border-t border-emerald-900 pt-3 text-sm text-emerald-100/80">
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
    </section>
  );
}
