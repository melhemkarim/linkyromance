# Linky · Love Letters (Next.js)

An envelope-opening romance gift page: wax seal, 3D flap, letter, stamps, "open when" envelopes, and an eternal blooming rose.

## Run it
```bash
npm install
npm run dev      # http://localhost:3000
```

## Customize
Edit the `C` object at the top of `app/page.js`:
```js
const C = { to: 'Dana', from: 'Adam', date: '2023-10-21' }
```
Stamps and "open when" messages are the `STAMPS` and `OPEN_WHEN` arrays right below it.

## Stamp photos
Drop your photos into `public/stamps/` (`coffee.jpg`, `trip.jpg`, `joke.jpg`, `today.jpg`, portrait 4:5). Missing ones fall back to the emoji. See `public/stamps/README.txt`.

## Deploy
Push to GitHub and import the repo on vercel.com, or run `npx vercel`.

Note: fonts load through `next/font/google`, so the first build needs internet access.
