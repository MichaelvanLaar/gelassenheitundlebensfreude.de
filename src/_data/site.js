// Site-wide metadata — single source of truth for base URL, name, categories.
module.exports = {
  name: "Gelassenheit und Lebensfreude",
  shortName: "Gelassenheit & Lebensfreude",
  url: "https://gelassenheitundlebensfreude.de",
  locale: "de-DE",
  language: "de",
  titleSuffix: " — Gelassenheit und Lebensfreude",
  description:
    "Impulse für Gelassenheit, innere Stärke und Lebensfreude — ein deutschsprachiger Blog über Achtsamkeit, Produktivität und persönliche Entwicklung.",
  logoPath: "/assets/logo.svg",
  // Main navigation — exact order is mandated by the requirements.
  nav: [
    { label: "Gelassene Produktivität", url: "/gelassene-produktivitaet/" },
    { label: "Innere Stärke", url: "/innere-staerke/" },
    { label: "Leichte Balance", url: "/leichte-balance/" },
    { label: "Verbunden kommunizieren", url: "/verbunden-kommunizieren/" },
  ],
  categories: {
    "gelassene-produktivitaet": "Gelassene Produktivität",
    "innere-staerke": "Innere Stärke",
    "leichte-balance": "Leichte Balance",
    "verbunden-kommunizieren": "Verbunden kommunizieren",
  },
};
