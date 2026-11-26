# Samuel Ume — Portfolio

Portfolio of Samuel Ume (Artpostle Sam), a Nigerian visual artist who paints with fire and acrylic.

Built with Next.js (App Router), TypeScript and plain CSS. Off-white and black with a film-grain overlay.

## Editing content

Everything lives in **`src/content/site.ts`**:

| What | Where |
| --- | --- |
| Name, email, socials, stats | `site` |
| Artworks (title, medium, size, year, status, story, image, process video) | `works` |
| Filter categories | `categories` |
| The three process stages on the About page | `process` |

- Artwork photos go in `public/works/{slug}.webp`. A work without `image` shows an "Image coming soon" tile and is left out of the home carousel.
- Process videos go in `public/video/{name}.mp4` with a poster at `public/video/{name}.jpg` (keep them muted, ~540px wide).

## Pages

- `/`: full-screen arc carousel (scroll, drag, arrow keys or click)
- `/works`: filterable grid
- `/works/[slug]`: artwork, story, process video, more works
- `/about`: intro, process (sketch, fire, acrylic), stats, gallery

## Develop

```bash
npm install
npm run dev
```
