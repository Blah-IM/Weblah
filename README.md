# Weblah

A web client for Blah IM, built with [SvelteKit](https://kit.svelte.dev) & [Tailwind CSS](https://tailwindcss.com).

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

The `main` branch is automatically deployed to Cloudflare Pages: [web.blah.ing](https://web.blah.ing).

A Zeabur deployment is also available: [blah.zeabur.app](https://blah.zeabur.app).

Out of box, Weblah is configured to be deployed on Cloudflare Pages or Zeabur. You can fork this repo and deploy it on Cloudflare Pages / Zeabur with a single click.

Being a SvelteKit app, you can also deploy it on other platforms like Vercel, Netlify, etc. or choose to self-host as a static site / or node server. See SvelteKit's [build and deploy guide](https://kit.svelte.dev/docs/building-your-app) for more information.

## License

This project is open source and available under the [GNU General Public License v3.0](LICENSE).
