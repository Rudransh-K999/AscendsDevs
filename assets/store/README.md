# Store product images

Drop product images in this folder, then point a product's `image` field at
the file in `js/store.js`. Paths are written **from the site root**:

```js
image: 'assets/store/website.jpg'
```

## Filenames used by the starter products

```
assets/store/website.jpg
assets/store/thumbnails.jpg
assets/store/custom-bots.jpg
assets/store/discord-setup.jpg
assets/store/sponsorships.jpg
assets/store/roblox-services.jpg
assets/store/minecraft-animation.jpg
assets/store/minecraft-server-development.jpg
```

You don't have to use these names. Any file works as long as the `image` path
matches it exactly (file names are case-sensitive on most hosts).

## If an image is missing

Nothing breaks. The card shows a branded placeholder (AscendDevs gradient, the
product number and category, and a small "IMAGE PLACEHOLDER" tag). The moment a
file exists at the path, the real image fades in over it. This works
automatically for every product you add later.

## Sizing tips

- **Ratio:** roughly 16:10 (for example 1280 × 800). Cards crop with
  `object-fit: cover`, so keep the important part of the image near the centre.
- **Featured cards** are wider and show the image at a taller ratio — use a
  larger image (about 1600 px wide) for those.
- **Format:** `.jpg` or `.webp`. Aim for under ~200 KB each so the store stays fast.
- The same image is reused in the detail window.

## Adding a product

Add an object to the `PRODUCTS` array at the top of `js/store.js`
(see the "ADD / EDIT PRODUCTS HERE" comment), save this image here, and the
product appears on the store automatically.