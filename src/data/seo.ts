import { maintenancePlans, offers, type Offer } from "./offers.ts";
import { findContentPage, type ContentPage } from "./pages.ts";
import { about, phoneHref, routes, site } from "./site.ts";

const absolute = (path: string) => `${site.url}${path}`;
const ids = {
  business: absolute("/#entreprise"),
  person: absolute("/#hugo"),
  website: absolute("/#site"),
  catalog: absolute("/#offres"),
};

function startingPrice(price: string) {
  const value = Number(price.replace(/[^\d]/g, ""));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function structuredData() {
  const sameAs = Object.values(site.social).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ids.business,
        name: site.name,
        url: absolute("/"),
        logo: absolute("/brand/icon-512.png"),
        image: absolute("/og.jpg"),
        description: site.seo.description,
        telephone: phoneHref.replace("tel:", ""),
        email: site.email,
        priceRange: "€€",
        address: {
          "@type": "PostalAddress",
          addressLocality: site.address.locality,
          postalCode: site.address.postalCode,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        areaServed: site.areaServed.map((area) => ({ "@type": area.type, name: area.name })),
        founder: { "@id": ids.person },
        hasOfferCatalog: { "@id": ids.catalog },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "Person",
        "@id": ids.person,
        name: site.name,
        jobTitle: "Développeur web freelance",
        description: about.text,
        image: absolute(site.portrait),
        url: absolute("/"),
        alumniOf: { "@type": "EducationalOrganization", name: site.school },
        worksFor: { "@id": ids.business },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        name: site.name,
        url: absolute("/"),
        inLanguage: "fr-FR",
        publisher: { "@id": ids.business },
      },
      {
        "@type": "OfferCatalog",
        "@id": ids.catalog,
        name: "Création de sites web",
        itemListElement: offers.map((offer) => {
          const price = startingPrice(offer.price);
          return {
            "@type": "Offer",
            name: offer.name,
            description: offer.text,
            seller: { "@id": ids.business },
            itemOffered: { "@type": "Service", name: offer.name, description: offer.text, provider: { "@id": ids.business } },
            ...(price ? { priceCurrency: "EUR", priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: "EUR" } } : {}),
          };
        }),
      },
    ],
  };
}

const providerRef = () => ({ "@type": "ProfessionalService", "@id": ids.business, name: site.name, url: absolute("/") });
const areaServed = () => site.areaServed.map((area) => ({ "@type": area.type, name: area.name }));

function offerNode(offer: Offer) {
  const price = startingPrice(offer.price);
  return {
    "@type": "Offer",
    name: offer.name,
    description: offer.text,
    ...(price ? { priceCurrency: "EUR", priceSpecification: { "@type": "PriceSpecification", minPrice: price, priceCurrency: "EUR" } } : {}),
  };
}

const planNodes = () =>
  maintenancePlans.map((plan) => ({
    "@type": "Offer",
    name: `Formule ${plan.name}`,
    priceCurrency: "EUR",
    price: plan.monthlyPrice,
    priceSpecification: { "@type": "UnitPriceSpecification", price: plan.monthlyPrice, priceCurrency: "EUR", unitText: "mois" },
  }));

function pageGraph(page: ContentPage) {
  const url = absolute(page.path);
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: page.breadcrumb, item: url },
    ],
  };
  const nodes: object[] = [breadcrumb];

  if (page.kind === "service") {
    nodes.push({
      "@type": "Service",
      name: page.service.name,
      serviceType: page.service.type,
      description: page.description,
      url,
      provider: providerRef(),
      areaServed: areaServed(),
      offers: page.service.offers === "maintenance" ? planNodes() : page.service.offers.map(offerNode),
    });
  }
  if (page.kind === "article") {
    nodes.push({
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      datePublished: page.published,
      inLanguage: "fr-FR",
      mainEntityOfPage: url,
      image: absolute("/og.jpg"),
      author: { "@type": "Person", "@id": ids.person, name: site.name, url: absolute("/") },
      publisher: providerRef(),
    });
  }
  return { "@context": "https://schema.org", "@graph": nodes };
}

const jsonLd = (data: object) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

/** Données structurées d'une page de contenu (services, page locale, étude de cas, article). */
export function contentStructuredData(path: string) {
  const page = findContentPage(path);
  return page ? pageGraph(page) : undefined;
}

/** Balises propres à chaque page, injectées dans le <head> au pré-rendu. */
export function routeHead(path: string) {
  const route = routes.find((item) => item.path === path);
  if (!route?.indexable) return '<meta name="robots" content="noindex, follow" />';
  if (path === "/") return jsonLd(structuredData());
  const content = contentStructuredData(path);
  return content ? jsonLd(content) : "";
}
