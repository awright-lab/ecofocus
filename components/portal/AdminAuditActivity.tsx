"use client";

import { useState } from "react";

const AUDIT_PAGE_SIZE = 6;

type AuditLogCard = {
  id: string;
  title: string;
  subtitle: string;
  metaPrimary: string;
  metaSecondary: string;
  badge?: string;
  value?: string;
};

export function AdminAuditActivity({
  adminActionExportHref,
  adminOperations,
  embedExportHref,
  embedLogs,
  rawUsageExportHref,
  sessionExportHref,
  usageSessions,
}: {
  adminActionExportHref: string;
  adminOperations: AuditLogCard[];
  embedExportHref: string;
  embedLogs: AuditLogCard[];
  rawUsageExportHref: string;
  sessionExportHref: string;
  usageSessions: AuditLogCard[];
}) {
  const [adminPage, setAdminPage] = useState(1);
  const [embedPage, setEmbedPage] = useState(1);
  const [usagePage, setUsagePage] = useState(1);

  const adminTotalPages = Math.max(Math.ceil(adminOperations.length / AUDIT_PAGE_SIZE), 1);
  const embedTotalPages = Math.max(Math.ceil(embedLogs.length / AUDIT_PAGE_SIZE), 1);
  const usageTotalPages = Math.max(Math.ceil(usageSessions.length / AUDIT_PAGE_SIZE), 1);
  const currentAdminPage = Math.min(adminPage, adminTotalPages);
  const currentEmbedPage = Math.min(embedPage, embedTotalPages);
  const currentUsagePage = Math.min(usagePage, usageTotalPages);
  const paginatedAdminOperations = adminOperations.slice(
    (currentAdminPage - 1) * AUDIT_PAGE_SIZE,
    currentAdminPage * AUDIT_PAGE_SIZE,
  );
  const paginatedEmbedLogs = embedLogs.slice(
    (currentEmbedPage - 1) * AUDIT_PAGE_SIZE,
    currentEmbedPage * AUDIT_PAGE_SIZE,
  );
  const paginatedUsageSessions = usageSessions.slice(
    (currentUsagePage - 1) * AUDIT_PAGE_SIZE,
    currentUsagePage * AUDIT_PAGE_SIZE,
  );

  const pagerButtonClass =
    "rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700";
  const disabledPagerButtonClass =
    "pointer-events-none rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-400";

  return (
    <section className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Support operations</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review support-side admin actions for the selected workspace and audit window.
            </p>
          </div>
          <a
            href={adminActionExportHref}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Export actions CSV
          </a>
        </div>

        <div className="mt-5 space-y-3">
          {adminOperations.length ? (
            paginatedAdminOperations.map((event) => (
              <div key={event.id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{event.title}</p>
                  {event.badge ? <p className="text-sm font-medium text-slate-700">{event.badge}</p> : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">{event.subtitle}</p>
                <p className="mt-2 text-sm text-slate-700">{event.metaPrimary}</p>
                <p className="mt-1 text-xs text-slate-500">{event.metaSecondary}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
              No recent support operations match this workspace and date range yet.
            </div>
          )}
        </div>

        {adminOperations.length > AUDIT_PAGE_SIZE ? (
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-600">
              Page {currentAdminPage} of {adminTotalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAdminPage((page) => Math.max(page - 1, 1))}
                disabled={currentAdminPage === 1}
                className={currentAdminPage === 1 ? disabledPagerButtonClass : pagerButtonClass}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setAdminPage((page) => Math.min(page + 1, adminTotalPages))}
                disabled={currentAdminPage === adminTotalPages}
                className={currentAdminPage === adminTotalPages ? disabledPagerButtonClass : pagerButtonClass}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Embed audit</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Review token issuance and redirect events for the selected workspace.
            </p>
          </div>
          <a
            href={embedExportHref}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Export embed CSV
          </a>
        </div>

        <div className="mt-5 space-y-3">
          {embedLogs.length ? (
            paginatedEmbedLogs.map((log) => (
              <div key={log.id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{log.title}</p>
                  {log.badge ? <p className="text-sm font-medium text-slate-700">{log.badge}</p> : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">{log.subtitle}</p>
                <p className="mt-2 text-sm text-slate-700">{log.metaPrimary}</p>
                <p className="mt-1 text-xs text-slate-500">{log.metaSecondary}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
              No embed audit events are available for this filter yet.
            </div>
          )}
        </div>

        {embedLogs.length > AUDIT_PAGE_SIZE ? (
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-600">
              Page {currentEmbedPage} of {embedTotalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEmbedPage((page) => Math.max(page - 1, 1))}
                disabled={currentEmbedPage === 1}
                className={currentEmbedPage === 1 ? disabledPagerButtonClass : pagerButtonClass}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setEmbedPage((page) => Math.min(page + 1, embedTotalPages))}
                disabled={currentEmbedPage === embedTotalPages}
                className={currentEmbedPage === embedTotalPages ? disabledPagerButtonClass : pagerButtonClass}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[32px] border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Usage audit</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Inspect grouped dashboard sessions and the users responsible for them.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={rawUsageExportHref}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              Raw usage CSV
            </a>
            <a
              href={sessionExportHref}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
            >
              Session summary CSV
            </a>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {usageSessions.length ? (
            paginatedUsageSessions.map((session) => (
              <div key={session.id} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{session.title}</p>
                  {session.value ? <p className="text-sm font-medium text-slate-700">{session.value}</p> : null}
                </div>
                <p className="mt-1 text-sm text-slate-600">{session.subtitle}</p>
                <p className="mt-1 text-xs text-slate-500">{session.metaPrimary}</p>
                <p className="mt-1 text-xs text-slate-500">{session.metaSecondary}</p>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] bg-slate-50 p-5 text-sm text-slate-600">
              No tracked usage sessions are available for this filter yet.
            </div>
          )}
        </div>

        {usageSessions.length > AUDIT_PAGE_SIZE ? (
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-600">
              Page {currentUsagePage} of {usageTotalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUsagePage((page) => Math.max(page - 1, 1))}
                disabled={currentUsagePage === 1}
                className={currentUsagePage === 1 ? disabledPagerButtonClass : pagerButtonClass}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setUsagePage((page) => Math.min(page + 1, usageTotalPages))}
                disabled={currentUsagePage === usageTotalPages}
                className={currentUsagePage === usageTotalPages ? disabledPagerButtonClass : pagerButtonClass}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
