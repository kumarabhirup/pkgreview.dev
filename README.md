# 🏄 pkgreview.dev

[![Type](https://img.shields.io/badge/type-monorepo-yellow.svg?style=flat-square)](https://github.com/KumarAbhirup/pkgreview.dev)
[![emoji-log](https://cdn.jsdelivr.net/gh/ahmadawais/stuff@ca978741836412b5e33ce8561f5f95c933177067/emoji-log/flat.svg)](https://github.com/KumarAbhirup/Emoji-Log/)
[![Twitter](https://img.shields.io/twitter/follow/kumar_abhirup.svg?style=social&label=@kumar_abhirup)](https://twitter.com/kumar_abhirup/)

## 📦 Setup

### 🖥️ Development environment

- Run

```bash
$ git clone https://github.com/KumarAbhirup/pkgreview.dev pkgreview # to clone project
$ cd pkgreview # enter in the project
$ yarn # install modules
$ yarn dev # run development server
```

- Rename `packages/web/.env.example` to `.env`.

- Rename `packages/backend/.env.example` to `.env`.

- Visit `http://localhost:3001/`

### 🎷 SASS usage

- Dump all your `.scss` files in `packages/web/static/assets/styles`.
- Run `npm run gulp` in `packages/web` directory to generate minified CSS files.
- While styling, use `npm run gulp:watch` in `packages/web` directory, for live compilation.

### ⚒️ Linting

#### In VSCode

- Install ESLint and Prettier VSCode extensions.
- **Done! Now you have live linting and autofixing setup!**

#### In Any other IDE

- Run `npm run lint` to check for linting errors.
- Run `npm run lint:fix` to fix the linting errors.

## 🦄 Info

- The Lerna monorepo setup was put up by [Harshit Pant](https://twitter.com/pantharshit00).
- To customize the linter, use `.eslintrc` and `.prettierrc` file. [Learn more](https://eslint.org)

## 📝 License

**MIT**
