import { offers } from "./offers.ts";
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

/** Balises propres à chaque page, injectées dans le <head> au pré-rendu. */
export function routeHead(path: string) {
  const route = routes.find((item) => item.path === path);
  if (!route?.indexable) return '<meta name="robots" content="noindex, follow" />';
  if (path !== "/") return "";
  const json = JSON.stringify(structuredData()).replace(/</g, "\\u003c");
  return `<script type="application/ld+json">${json}</script>`;
}
