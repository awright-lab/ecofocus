"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SecurityGovernance() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative section-slab-deep" aria-labelledby="sec-gov-privacy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-14 md:py-16">
        {/* Heading + subhead */}
        <div className="mb-8 text-center">
          <motion.h2
            id="sec-gov-privacy"
            initial={reduceMotion ? false : { opacity: 0, y: -10 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-bold leading-tight text-white text-[clamp(1.6rem,5.2vw,2.2rem)]"
          >
            Security, Governance & Privacy
          </motion.h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-white/85"
          >
            Enterprise-minded by default: encryption in transit/at rest, least-privilege access,
            SSO on eligible plans, and DPA support—so joined datasets stay protected end-to-end.
          </motion.p>
        </div>

        {/* Four benefit cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Security Controls"
            points={[
              "TLS 1.2+ in transit; encrypted at rest",
              "Least-privilege access; key rotation",
              "Secrets management & scoped credentials",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Governance & Access"
            points={[
              "SSO on Studio/Enterprise (add-on for Team)",
              "Role-based permissions",
              "Audit trail on eligible plans",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Privacy & Data Handling"
            points={[
              "Hashed IDs & aggregated joins supported",
              "No PII required for most integrations",
              "Assumptions & small bases clearly flagged",
            ]}
          />
          <BenefitCard
            className="md:col-span-6 lg:col-span-3"
            title="Delivery & Compliance"
            points={[
              "Signed URL bucket/API delivery",
              "DPA support for Enterprise",
              "IP allowlists available on request",
            ]}
          />
        </div>

        {/* Emerald stat slab */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 grid grid-cols-2 gap-4 rounded-2xl section-slab-emerald p-6 shadow-lg sm:grid-cols-4"
        >
          <Stat label="Authentication" value="SSO" inverse />
          <Stat label="Compliance" value="DPAs" inverse />
          <Stat label="Delivery" value="Signed URLs" inverse />
          <Stat label="Network" value="IP Allowlist" inverse />
        </motion.div>
      </div>
    </section>
  );
}

function BenefitCard({
  title,
  points,
  className = "",
}: {
  title: string;
  points: string[];
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <ul role="list" className="mt-3 space-y-2.5 text-sm text-gray-700">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400"
              aria-hidden="true"
            />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: string;
  inverse?: boolean;
}) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold ${inverse ? "text-white" : "text-gray-900"}`}>{value}</div>
      <div className={`mt-0.5 text-xs ${inverse ? "text-white/85" : "text-gray-600"}`}>{label}</div>
    </div>
  );
}

