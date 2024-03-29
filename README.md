# Visualization Playground

Data Visualization Experimental Projects

## 🏗️ Deployments

| Name       | URL                                        |
| :--------- | :----------------------------------------- |
| Production | _Not launched yet_                         |
| Staging    | https://visualization-playground.pages.dev |

## 🍱 Tech Stack

- [Astro](https://astro.build) + [Vue](https://vuejs.org) + [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders:

```text
/
├── public/
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 🎨 Design Systems

- Use [WeVis Design System's typography](https://wevisdemo.github.io/design-systems/typography/) font family and sizes with slightly changes of CSS class name. Available typography CSS classes are defined in [main.css](src/assets/main.css)
