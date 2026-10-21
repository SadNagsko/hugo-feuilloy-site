import type { ArticlePageData } from "../../data/pages";
import { site } from "../../data/site";
import { ContentLayout } from "./ContentLayout";

export function ArticlePage({ page }: { page: ArticlePageData }) {
  return (
    <ContentLayout
      page={page}
      meta={
        <p className="mt-6 text-[15px] text-muted">
          Par {site.name} · Publié le <time dateTime={page.published}>{page.publishedLabel}</time>
        </p>
      }
    />
  );
}
