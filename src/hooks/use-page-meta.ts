import { useEffect } from "react";
import { siteUrl, type PageMeta } from "../config/seo";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

/** Keeps the document title, description, canonical URL and social tags in step with the current page. */
export function usePageMeta({ title, description }: PageMeta) {
  // Runs after every render so tab changes inside a layout (rider pages) update the canonical URL too.
  useEffect(() => {
    // Filters live in the query string; the canonical URL is the page itself.
    const { pathname } = window.location;
    const url = `${siteUrl}${pathname === "/" ? "/" : pathname.replace(/\/$/, "")}`;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setCanonical(url);
  });
}
