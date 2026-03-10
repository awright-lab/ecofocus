"use client";

import { useMemo, useState } from "react";
import type { PortalDashboard } from "@/lib/portal/types";

const issueTypes = [
  "Login / Access",
  "Dashboard Navigation",
  "Chart Export",
  "Data Question",
  "Possible Bug",
  "Feature Request",
  "Training Request",
] as const;

const priorities = ["low", "medium", "high", "urgent"] as const;

type FormState = {
  name: string;
  email: string;
  company: string;
  dashboardName: string;
  issueType: string;
  priority: string;
  description: string;
  notes: string;
  attachmentName: string;
};

export function SupportTicketForm({
  userName,
  userEmail,
  companyName,
  dashboards,
  defaultDashboard,
  defaultIssueType,
}: {
  userName: string;
  userEmail: string;
  companyName: string;
  dashboards: PortalDashboard[];
  defaultDashboard?: string;
  defaultIssueType?: string;
}) {
  const [form, setForm] = useState<FormState>({
    name: userName,
    email: userEmail,
    company: companyName,
    dashboardName: defaultDashboard || dashboards[0]?.name || "",
    issueType: defaultIssueType || issueTypes[0],
    priority: "medium",
    description: "",
    notes: "",
    attachmentName: "",
  });
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dashboardOptions = useMemo(
    () => dashboards.map((dashboard) => ({ value: dashboard.name, label: dashboard.name })),
    [dashboards],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    if (!/\S+@\S+\.\S+/.test(form.email)) nextErrors.email = "Enter a valid email.";
    if (!form.company.trim()) nextErrors.company = "Company is required.";
    if (!form.dashboardName.trim()) nextErrors.dashboardName = "Select a dashboard or project.";
    if (!form.issueType.trim()) nextErrors.issueType = "Issue type is required.";
    if (!form.priority.trim()) nextErrors.priority = "Priority is required.";
    if (form.description.trim().length < 20) nextErrors.description = "Add at least 20 characters of detail.";
    return nextErrors;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // TODO: replace with persisted ticket creation, notifications, and CRM/email workflow.
    setSubmittedId(`TCK-MVP-${Math.floor(Math.random() * 9000) + 1000}`);
  }

  if (submittedId) {
    return (
      <div className="rounded-[28px] border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Request received</p>
        <h3 className="mt-2 text-xl font-semibold text-emerald-950">Support ticket submitted</h3>
        <p className="mt-2 text-sm text-emerald-900/80">
          Placeholder submission complete for <span className="font-semibold">{submittedId}</span>. Wire this form to the
          production ticket backend, email automation, and audit logging next.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Name" error={errors.name}>
          <input value={form.name} onChange={(event) => update("name", event.target.value)} className={inputClass} />
        </Field>
        <Field label="Email" error={errors.email}>
          <input value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} />
        </Field>
        <Field label="Company" error={errors.company}>
          <input value={form.company} onChange={(event) => update("company", event.target.value)} className={inputClass} />
        </Field>
        <Field label="Dashboard / Project" error={errors.dashboardName}>
          <select
            value={form.dashboardName}
            onChange={(event) => update("dashboardName", event.target.value)}
            className={inputClass}
          >
            {dashboardOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Issue Type" error={errors.issueType}>
          <select value={form.issueType} onChange={(event) => update("issueType", event.target.value)} className={inputClass}>
            {issueTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Priority" error={errors.priority}>
          <select value={form.priority} onChange={(event) => update("priority", event.target.value)} className={inputClass}>
            {priorities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" error={errors.description}>
        <textarea
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          rows={6}
          className={`${inputClass} resize-none`}
          placeholder="Describe what happened, expected behavior, timing, and any blockers."
        />
      </Field>

      <Field label="Screenshot / File upload placeholder">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <input
            type="file"
            onChange={(event) => update("attachmentName", event.target.files?.[0]?.name || "")}
            className="block w-full text-sm text-slate-600"
          />
          <p className="mt-2 text-xs text-slate-500">
            TODO: store file uploads in the production support workflow. {form.attachmentName ? `Selected: ${form.attachmentName}` : ""}
          </p>
        </div>
      </Field>

      <Field label="Optional browser / environment notes">
        <textarea
          value={form.notes}
          onChange={(event) => update("notes", event.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Browser version, device context, VPN, screen size, or reproducibility notes."
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Submit support ticket
        </button>
        <p className="text-xs text-slate-500">
          TODO: connect to database persistence, internal assignment, and notification handling.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs font-medium text-rose-600">{error}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";
