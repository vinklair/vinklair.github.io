# Vinklair Apps website

vinklairapps.com, served by GitHub Pages. Plain HTML, one stylesheet (`assets/site.css`) and one script (`assets/site.js`), no build step.

- `index.html`: the company page and the three apps.
- `number-sense.html`: Numbers by Ear (the App Store listing links to this name, so it keeps it). Its looping videos are in `media/numbers-by-ear/`, cut from the App Preview clips and the App Store header video.
- `darts-checkout.html`, `darts-checkout-pro.html`: Darts Checkout and Darts Checkout Pro.
- `numbers-by-ear-iphone-duo.html`: the Numbers by Ear 2.1 iPhone Duo page for the App Store featuring nomination (its supplemental link). Not in the menu or the sitemap, and `noindex` until 2.1 is out. Its slides are in `img/numbers-by-ear-iphone-duo/` (AVIF and JPEG at 1920, the PNG at 3840×2160), made by the app's `marketing featuring`; the release tools never touch that folder.
- The privacy policies, one per app, and `404.html`.
- `img/brand/`: the Vinklair Apps mark, Bounce (`mark.svg`; `favicon.svg` is its two-bounce version for small sizes), and the social preview image. The brand colours: night `#0e1330`, signal blue `#4462e8`, mist `#a9b8f5` and the mint ball `#2ed3a0`. No orange.
- `assets/fonts/`: Outfit, the heading face, served from here (SIL Open Font License, `OFL.txt`).

The blocks between `<!-- marketing:<block>:<page>:start -->` and `end` markers, and the image folders `img/number-sense/`, `img/darts-checkout/` and `img/darts-checkout-pro/`, are written by each app's release tools on a `release/<version>` branch. Edit everything else by hand.
