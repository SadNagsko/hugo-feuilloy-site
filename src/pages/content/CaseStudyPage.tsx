import type { CaseStudyPageData } from "../../data/pages";
import { ArrowUpRight, pressable } from "../../components/primitives";
import { ContentLayout } from "./ContentLayout";

export function CaseStudyPage({ page }: { page: CaseStudyPageData }) {
  return (
    <ContentLayout
      page={page}
      meta={
        <a
          href={page.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${page.siteLabel} ${page.client} (nouvel onglet)`}
          className={`mt-6 inline-flex min-h-11 items-center gap-1.5 text-[17px] font-semibold text-violet-soft hover:text-ink ${pressable}`}
        >
          {page.siteLabel}
          <ArrowUpRight className="size-4" />
        </a>
      }
    />
  );
}
