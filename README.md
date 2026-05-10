
# Milledoni Cadeau-inspiratie applicatie
Ontwerp en maak een interactieve website die snel laadt en prettig te gebruiken is.

Milledoni helpt gebruikers het perfecte cadeau te vinden uit verschillende webshops. Je kunt producten zoeken, filteren op prijs, en opslaan in persoonlijke lijsten.

De instructie vind je in: [INSTRUCTIONS.md](https://github.com/fdnd-task/enhanced-website/blob/main/docs/INSTRUCTIONS.md)

## Snelle projectlinks:

* [API Endpoint](https://fdnd-agency.directus.app/items/milledoni_products)
* [Resources](https://github.com/fdnd-agency/milledoni/wiki/Design-Challenge#resources)
* [FDND-agency GitHub](https://github.com/fdnd-agency/milledoni)
* [Milledoni FDND website](https://milledoni.dev.fdnd.nl/?page=1)
* [Milledoni website](https://milledoni.nl/)
* [Interface Inventory voorbeeld](https://www.figma.com/design/nCBX4Dgea2Y5xPcQcvcbkm/Interface-Inventory?node-id=43-15)
* [Mijn Figma](https://www.figma.com/design/o3bhgO0r5fMdONfRWEeoXv/Untitled?node-id=8-138&t=kUnXS8BY8zGYV35h-1)

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Kenmerken](#kenmerken)
  * [Installatie](#installatie)
  * [Performance](#performance)
  * [Progressive Enhancement](#progressive-enhancement)
  * [Bronnen](#bronnen)
  * [Licentie](#licentie)

## Beschrijving
Milledoni is een server-side rendered webapplicatie gebouwd met Node.js, Express en LiquidJS. Productdata wordt opgehaald via de Directus API van FDND Agency. Gebruikers kunnen cadeaus zoeken op naam, filteren op prijs en producten opslaan in lijsten.

Visual poster 📸 -->
<img width="936" height="706" alt="Screenshot 2026-05-10 at 17 03 35" src="https://github.com/user-attachments/assets/3f9e191c-2785-48ca-9be1-e8c82a598b9b" />


De website vindt je via deze [link](user-experience-enhanced-website-oupi.onrender.com)
🌐

## Kenmerken
- Zoeken op naam via URL-parameter (?search=)
- Filteren op prijs (min/max via Directus API-filters)
- Product opslaan in een persoonlijke favorieten-lijst
- Lijsten aanmaken met naam, leeftijd en beschrijving
- Responsive navigatie met CSS Grid en media queries
- Toegankelijkheid – visueel verborgen labels, alt-teksten, prefers-reduced-motion

## Installatie
# 1. Clone de repository
git clone https://github.com/ahlamad/user-experience-enhanced-website.git
cd user-experience-enhanced-website

# 2. Installeer dependencies
npm install

# 3. Start de server
npm start
De app draait op http://localhost:8000

## Performance
### Afbeeldingen
Productafbeeldingen worden geleverd in moderne formaten met een <picture>-element en loading="lazy":
https://github.com/ahlamad/user-experience-enhanced-website/blob/37ba949edfd52095811ef33995c503ca0b5676f9/views/index.liquid#L66-L76

AVIF → kleinste bestandsgrootte, moderne browsers
WebP → goede compressie, brede ondersteuning
JPEG → fallback voor oudere browsers
width en height op <img> voorkomen layout shifts (CLS)
loading="lazy" zorgt dat afbeeldingen buiten het scherm pas laden als de gebruiker ernaar toe scrollt

### Server-side rendering
Alle data wordt op de server opgehaald en als HTML naar de browser gestuurd. Dit zorgt voor:

Snellere First Contentful Paint (FCP)
Geen client-side data-fetching nodig
Werkt ook zonder JavaScript

#### CSS Animaties
Animaties zijn vermindert als dat de voorkeur heeft:
https://github.com/ahlamad/user-experience-enhanced-website/blob/37ba949edfd52095811ef33995c503ca0b5676f9/public/styles/style.css#L240-L257

## Progressive Enhancement
De app werkt op drie lagen, van basis naar verrijkt:
1. HTML (functionele basis)
Alle kernfunctionaliteit werkt puur via HTML formulieren en server-side routes:

Zoeken → `<form method="GET">`
Product opslaan → `<form method="POST" action="/product-opslaan">`
Lijst aanmaken → `<form method="POST" action="/lijsten">`

De app is volledig bruikbaar zonder CSS en zonder JavaScript.


2. CSS (visuele laag)

Responsive layout met CSS Grid en media queries
Hover-effecten op productkaarten
Animaties voor success/error meldingen
Moderne typografie met fonts (Parkinsans)

3. JavaScript (verrijking)
JavaScript wordt alleen gebruikt voor UI-verbetering, niet voor kernfunctionaliteit:

Success-melding automatisch verbergen na 2 seconden
Alle interacties werken ook zonder JS via de `?status=-queryparameter`

## Bronnen
* [PPRPL pattern](https://web.dev/articles/apply-instant-loading-with-prpl#audit_your_page_with_lighthouse)
* [CSS Fading in & out](https://dev.to/nicm42/fading-in-and-fading-out-with-css-transitions-3lc1)
* [Success state](https://www.useronboard.com/onboarding-ux-patterns/success-states/)
* [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/report#/https://user-experience-enhanced-website-oupi.onrender.com/)
* [MDN](https://developer.mozilla.org/en-US/)

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
