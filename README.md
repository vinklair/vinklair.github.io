# Vinklair Apps website

vinklairapps.com, served by GitHub Pages. Plain HTML, one stylesheet (`assets/site.css`) and one script (`assets/site.js`), no build step.

- `index.html`: the company page and the three apps.
- `number-sense.html`: Numbers by Ear (the App Store listing links to this name, so it keeps it). Its looping videos are in `media/numbers-by-ear/`, cut from the App Preview clips and the App Store header video.
- `darts-checkout.html`, `darts-checkout-pro.html`: Darts Checkout and Darts Checkout Pro.
- The privacy policies, one per app, and `404.html`.
- `img/brand/`: the Vinklair Apps mark (`mark.svg`, also the favicon) and the social preview image.

The blocks between `<!-- marketing:<block>:<page>:start -->` and `end` markers, and the image folders `img/number-sense/`, `img/darts-checkout/` and `img/darts-checkout-pro/`, are written by each app's release tools on a `release/<version>` branch. Edit everything else by hand.
