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
