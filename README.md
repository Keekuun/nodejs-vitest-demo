<h1 align="center">Welcome to nodejs-vitest-demo 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/Keekuun/nodejs-vitest-demo" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://blog.zkkysqs.top" target="_blank" style="display:inline-flex; align-items: center; padding: 0 4px; height: 20px; background: #de1570; border: 1px solid #de1570;color: #fff; border-radius:4px;">
    <img alt="Blog: https://blog.zkkysqs.top" src="https://blog.zkkysqs.top/images/avatar.png" width="16px"/>
    <span style="color: #fff; font-size: 14px">https://blog.zkkysqs.top</span>
  </a>
</p>

> Node.js complete test environment using TypeScript, Prisma, PostgreSQL and Vitest.

# nodejs-vitest-demo
learn from [here](https://www.douglasgoulart.com/writings/creating-a-complete-nodejs-test-environment-with-vitest-postgresql-and-prisma)

# Use prisma 
```bash
pnpm add prisma  -D
npx prisma init
npx prisma generate
```

# Install PostgreSQL with docker
```bash
docker pull bitnami/postgresql

docker run --name node-test-env-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=node-test-env -p 5432:5432 -d bitnami/postgresql
```
then update `.env` file: 
```env
DATABASE_URL="postgresql://docker:docker@localhost:5432/node-test-env?schema=public"
```

then, migrate to the database:
```bash
npx prisma migrate dev
```

# Install deps
```bash
# use typescript
pnpm i typescript @types/node tsx tsup -D

# generate `tsconfig.json`
npx tsc --init
```

# Use Vitest
```bash
pnpm i vitest vite-tsconfig-paths -D
```
create `vitest.config.ts` and `sample.spec.ts`, then just test:

```bash
 npx vitest run
```

# Update scripts

```bash
{
  ...
  "scripts": {
    "start:dev": "tsx watch src/index.ts", // change the path to match your project initialization file
    "start": "node build/server.js",
    "build": "tsup src --out-dir build",
    "test": "vitest run",
    "test:watch": "vitest", // watching for file changes and re-run
    "test:coverage": "vitest run --coverage" // test coverage report
  }
  ...
}
```
