import { Metadata } from "next";
import { LAYOUT_OPTIONS } from "@/config/enums";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";

enum MODE {
  DARK = "dark",
  LIGHT = "light",
}

export const siteConfig = {
  title: "Ntumai Admin",
  description:
    "Operational control center for Ntumai commerce, dispatch, support, and platform administration.",
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HYDROGEN,
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description,
): Metadata => {
  const fullTitle = title ? `${title} | ${siteConfig.title}` : siteConfig.title;

  return {
    title: fullTitle,
    description,
    openGraph: openGraph ?? {
      title: fullTitle,
      description,
      url: "https://admin.ntumai.com",
      siteName: "Ntumai Admin",
      locale: "en_US",
      type: "website",
    },
  };
};
