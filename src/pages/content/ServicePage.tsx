import type { ServicePageData } from "../../data/pages";
import { ContentLayout, CtaButton } from "./ContentLayout";

export function ServicePage({ page }: { page: ServicePageData }) {
  return <ContentLayout page={page} meta={<CtaButton className="mt-8 max-md:w-full" />} />;
}
