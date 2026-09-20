# Door2Pick

Shopify storefront for Door2Pick, built on the **Horizon** theme.

Jewellery, home decor, kitchen, tech and wellness — a dark/gold marketplace
design with custom sections for the parts Horizon's own blocks cannot express.

## Custom sections

| Section | Purpose |
|---|---|
| `custom-header` | Utility bar, pill search, and a mega menu with a category rail, subcategory columns, promo card and trust row. Replaces Horizon's header. |
| `hero-banner` | Image-only slideshow for pre-designed banner artwork. |
| `d2p-product-grid` | Product cards with discount badge, rating, wishlist, compare-at price and Add to Cart. |
| `d2p-category-icons` | Circular category shortcuts. |
| `d2p-trust-bar` | Icon + heading + subtext strip (delivery, payments, returns, support). |
| `d2p-promo-banners` | Side-by-side promo panels and the newsletter signup. |

`snippets/d2p-icon.liquid` holds 15 inline SVGs for categories and trust
messaging, since Horizon ships none.

## Design notes

Two constraints shaped the implementation and are worth knowing before editing:

- **`image_picker` settings read from Shopify Files, not theme assets.** The
  logo and hero images therefore take an asset filename as a text setting, with
  the picker left as an override for anything uploaded later.
- **Category links resolve through collection objects, never hardcoded URLs.**
  A category whose collection is missing is skipped rather than rendering a
  link to a 404.

Colours are defined once in `config/settings_data.json` and flow to every
template through the palette. All pairings are checked against WCAG AA
(text 16:1, gold on black 8:1).

## Local development

```bash
shopify theme dev --store <your-store>.myshopify.com
shopify theme push --theme <theme-id>      # unpublished preview
```

Validate before pushing:

```bash
shopify theme check
```

## Repository layout

Standard Shopify theme structure — `assets`, `blocks`, `config`, `layout`,
`locales`, `sections`, `snippets`, `templates`. Full-resolution source artwork
lives in `source-images/` (git-ignored); the optimised copies in `assets/` are
what ship, because Shopify rejects subfolders inside `assets/`.
