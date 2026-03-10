import type { Metadata } from "next";

export const portalRobots = {
  index: false,
  follow: false,
  noarchive: true,
  nocache: true,
  nosnippet: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
} satisfies NonNullable<Metadata["robots"]>;

export function buildPortalMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: portalRobots,
  };
}
