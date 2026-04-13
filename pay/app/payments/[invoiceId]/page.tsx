"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { paymentDetailById } from "@/lib/dummy-data";

type PaymentDetailsPageProps = {
  invoiceId: string;
};

const statusStyles: Record<string, string> = {
  Settled: "bg-[#2d3d2c] text-[#c8e9bf]",
  Failed: "bg-[#3d2626] text-[#f0a1a1]",
  Processing: "bg-[#3f2f1f] text-[#f2b27a]",
};

export default function PaymentDetailsPage({
  invoiceId,
}: PaymentDetailsPageProps) {
  const details =
    paymentDetailById[invoiceId] ?? paymentDetailById["INV-2024-0091"];

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-4xl text-slate-100">Payment Details</h1>
            {details.badgeStatuses.map((status) => (
              <span
                key={status}
                className={`rounded-md px-3 py-1 text-xs uppercase ${statusStyles[status]}`}
              >
                {status}
              </span>
            ))}
          </div>
          <p className="mt-2 text-xl text-slate-300">
            Payment ID: {details.id}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            <ShieldAlert className="h-4 w-4" />
            Retry Payment
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {details.flow.map((step, index) => {
          const isCurrent = step === details.currentFlow;
          return (
            <div key={step} className="flex items-center gap-3">
              <div
                className={`rounded-md px-4 py-2 text-xs uppercase ${
                  isCurrent
                    ? "bg-[#2f332e] text-[#d5e4ce]"
                    : "bg-[#232528] text-slate-400"
                }`}
              >
                {step}
              </div>
              {index < details.flow.length - 1 && (
                <span className="text-xl text-slate-400">→</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-md border border-slate-800 bg-[#1d1f22]">
          <div className="border-b border-slate-800 bg-white/4 px-4 py-3 text-lg text-slate-100">
            Transactions Details
          </div>
          <div className="space-y-3 px-4 py-5 text-sm">
            <div className="grid grid-cols-[150px_1fr] text-slate-400">
              <span>AGENT ID</span>
              <span className="text-slate-200">
                {details.transactionDetails.agentId}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] text-slate-400">
              <span>POOL ID</span>
              <span className="text-slate-200">
                {details.transactionDetails.poolId}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] text-slate-400">
              <span>CHAIN</span>
              <span className="text-slate-200">
                {details.transactionDetails.chain}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] text-slate-400">
              <span>AMOUNT</span>
              <span className="text-slate-200">
                {details.transactionDetails.amount}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] text-slate-400">
              <span>TIMESTAMP</span>
              <span className="text-slate-200">
                {details.transactionDetails.timestamp}
              </span>
            </div>
            <div className="grid grid-cols-[150px_1fr] text-slate-400">
              <span>GAS SPONSORED</span>
              <span className="flex items-center gap-2 text-[#d5efcd]">
                <CheckCircle2 className="h-4 w-4 text-lime-400" />
                {details.transactionDetails.gasSponsored ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-md border border-slate-800 bg-[#1d1f22]">
          <div className="border-b border-slate-800 bg-white/4 px-4 py-3 text-lg text-slate-100">
            Blockchain Info
          </div>
          <div className="space-y-3 px-4 py-5 text-sm">
            <div className="grid grid-cols-[180px_1fr] text-slate-400">
              <span>TRANSACTION HASH</span>
              <span className="text-slate-200">
                {details.blockchainInfo.transactionHash}
              </span>
            </div>
            <div className="grid grid-cols-[180px_1fr] text-slate-400">
              <span>BLOCK NUMBER / ROUND</span>
              <span className="text-slate-200">
                {details.blockchainInfo.blockNumberRound}
              </span>
            </div>
            <div className="grid grid-cols-[180px_1fr] text-slate-400">
              <span>CONFIRMATION TIME</span>
              <span className="text-slate-200">
                {details.blockchainInfo.confirmationTime}
              </span>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-md border border-slate-800 bg-[#1d1f22]">
        <div className="border-b border-slate-800 bg-white/4 px-4 py-3 text-lg text-slate-100">
          Logs
        </div>
        <div className="space-y-3 px-4 py-5 text-sm">
          <div className="grid grid-cols-[220px_1fr] text-slate-400">
            <span>PAYMENT INITIATED</span>
            <span className="text-slate-200">
              {details.logs.paymentInitiated}
            </span>
          </div>
          <div className="grid grid-cols-[220px_1fr] text-slate-400">
            <span>PROCESSING STARTED</span>
            <span className="text-slate-200">
              {details.logs.processingStarted}
            </span>
          </div>
          <div className="grid grid-cols-[220px_1fr] text-slate-400">
            <span>CONFIRMED</span>
            <span className="text-slate-200">{details.logs.confirmed}</span>
          </div>
          <div className="grid grid-cols-[220px_1fr] text-slate-400">
            <span>WEBHOOK TRIGGERED</span>
            <span className="text-slate-200">
              {details.logs.webhookTriggered}
            </span>
          </div>
        </div>
      </section>
    </motion.section>
  );
}
