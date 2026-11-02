---
title: "Why I use Drizzle for every TypeScript backend"
subtitle: "Raw SQL has no types, and heavy ORMs hide the SQL. Drizzle sits in between: you write TypeScript that reads like SQL, and every query is typed from your schema."
date: 2026-09-04
tags: ["TypeScript", "Tools"]
cover: ./cover.webp
coverAlt: "The Drizzle logo in lime green beside the words Drizzle ORM, with a code panel showing a users table and a typed select query"
draft: false
---

Every backend eventually talks to a database. In TypeScript, there are two common ways to do it, and both have a cost.

Writing raw SQL keeps full control, but the results come back untyped. A renamed column or a typo in a query is only discovered at runtime. Traditional ORMs solve the typing problem, but they hide the SQL behind their own abstractions, and it becomes hard to know which queries actually run against the database.

In this article, I will explain why Drizzle ORM has become my default choice for TypeScript backends, how it compares to the alternatives, and how to set it up from scratch with PostgreSQL: the schema, migrations, queries, relations and transactions.

## What is Drizzle?

**Drizzle ORM** is a TypeScript ORM that describes the database schema in TypeScript and exposes queries that look like SQL.

Its philosophy is summed up in one line of its documentation: if you know SQL, you know Drizzle.

Drizzle is built around three ideas:

- **The schema is TypeScript code.** Tables, columns, indexes and foreign keys are declared in `.ts` files.
- **Queries mirror SQL.** `select`, `from`, `where`, `join` and `orderBy` read the same way as the SQL they produce.
- **Types are inferred.** Every query result is typed from the schema, with no code generation step.

Drizzle comes with a companion tool, **Drizzle Kit**, which generates and applies migrations from the schema.

### Drizzle and its alternatives

| Tool | Schema defined in | Query style | Best Suited For |
| --- | --- | --- | --- |
| Raw SQL | The database | SQL strings | Full control, no types |
| Prisma | Its own schema language | A generated client with its own API | Teams that prefer to avoid SQL |
| TypeORM | Classes and decorators | Repositories and entities | Object-oriented codebases |
| Kysely | TypeScript types | A type-safe query builder | Typed SQL without an ORM |
| Drizzle | TypeScript code | SQL-like builder and a relational API | Typed SQL with a schema and migrations |

Each tool is a valid choice. Drizzle stands out because it combines what is usually split between tools: a schema written in TypeScript, migrations generated from that schema, and queries that stay close to SQL.

## Why Drizzle is so good

### The types come from the schema

Source: [Drizzle docs, Get started with PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).

A table is declared once, and its types follow:

```typescript
type User = typeof users.$inferSelect;    // a row read from the table
type NewUser = typeof users.$inferInsert; // a row to insert
```

`$inferInsert` knows which columns are optional, such as generated ids or columns with a default value. Adding a column to the table updates both types immediately.

### If you know SQL, you know Drizzle

Source: [Drizzle docs, Select](https://orm.drizzle.team/docs/select).

There is no new query language to learn. A Drizzle query and the SQL it produces look alike:

```typescript
await db.select().from(users).where(eq(users.id, 42));
```

```sql
select "id", "name", "age" from "users" where "users"."id" = $1; -- params: [42]
```

Values are always sent as parameters, never concatenated into the query string, which protects against SQL injection.

### No magic

Drizzle does not generate a client, does not hide queries behind lazy loading, and does not run its own engine next to the application. What you write is what runs.

### It runs anywhere

Drizzle is lightweight and supports many drivers: node-postgres, Postgres.js, Neon, Supabase, PGlite, MySQL, SQLite, Cloudflare D1 and others. The same schema and queries work on a long-running Node.js server, in serverless functions and at the edge.

### Drizzle Studio

Source: [Drizzle docs, Drizzle Kit](https://orm.drizzle.team/docs/kit-overview).

Drizzle Kit includes a database browser that reads your schema:

```bash
npx drizzle-kit studio
```

It is a convenient way to inspect and edit data during development without installing another tool.

## Setting up Drizzle with PostgreSQL

The examples follow the official documentation, which now targets **Drizzle 1.0**, installed from the `rc` tag. Projects still on version 0.x use a slightly different API for relations.

Every code snippet in this article comes from the [official Drizzle documentation](https://orm.drizzle.team/docs/overview), sometimes adapted to the same `users` and `posts` tables. Each section links to the page it comes from.

### Step 1: Install the dependencies

Source: [Drizzle docs, Get started with PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).

```bash
npm i drizzle-orm@rc pg dotenv
npm i -D drizzle-kit@rc tsx @types/pg
```

- `drizzle-orm` is the ORM itself
- `pg` is the PostgreSQL driver (node-postgres)
- `drizzle-kit` generates and applies migrations

### Step 2: Set the connection string

Source: [Drizzle docs, Get started with PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).

```dotenv
DATABASE_URL=postgres://user:password@localhost:5432/app
```

Never commit this file to version control.

### Step 3: Declare the schema

Source: [Drizzle docs, Get started with PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).

```typescript
// src/db/schema.ts

import { index, integer, pgTable, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
});

export const posts = pgTable(
    'posts',
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        content: text().notNull(),
        ownerId: integer('owner_id').references(() => users.id),
    },
    (table) => [index('posts_owner_idx').on(table.ownerId)]
);
```

This schema:

- Uses identity columns for the primary keys
- Makes the email unique
- Links each post to its author with a foreign key
- Indexes `owner_id`, the column used to find the posts of a user

The property name is used in TypeScript, and the first argument of a column, such as `'owner_id'`, is the name used in the database.

### Step 4: Declare the relations

Source: [Drizzle docs, Relations](https://orm.drizzle.team/docs/relations).

Foreign keys describe the database. **Relations** describe how Drizzle should load connected rows in relational queries:

```typescript
// src/db/relations.ts

import { defineRelations } from 'drizzle-orm';
import * as schema from './schema';

export const relations = defineRelations(schema, (r) => ({
    users: {
        posts: r.many.posts(),
    },
    posts: {
        author: r.one.users({
            from: r.posts.ownerId,
            to: r.users.id,
        }),
    },
}));
```

### Step 5: Create the database client

Source: [Drizzle docs, Get started with PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).

```typescript
// src/db/index.ts

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { relations } from './relations';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({ client: pool, relations });
```

The rest of the application imports `db` and never creates its own connection.

### Step 6: Configure Drizzle Kit

Source: [Drizzle docs, Get started with PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).

```typescript
// drizzle.config.ts

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
```

### Step 7: Apply the schema to the database

Source: [Drizzle docs, Migrations](https://orm.drizzle.team/docs/migrations).

Drizzle Kit offers two main workflows.

#### Push

```bash
npx drizzle-kit push
```

`push` compares the schema with the database and applies the differences directly, without creating migration files. It is ideal for prototyping.

#### Generate and migrate

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

`generate` writes a SQL migration file to the `drizzle` folder, and `migrate` applies the migrations that have not run yet.

Migrations can also be applied when the application starts:

```typescript
import { migrate } from 'drizzle-orm/node-postgres/migrator';

await migrate(db);
```

For anything that will reach production, I recommend generated migrations: they are plain SQL files that can be reviewed and committed with the code.

## Querying the database

### Insert

Source: [Drizzle docs, Insert](https://orm.drizzle.team/docs/insert).

```typescript
import { users } from './db/schema';

const user: typeof users.$inferInsert = {
    name: 'John',
    age: 30,
    email: 'john@example.com',
};

await db.insert(users).values(user);
```

In PostgreSQL, `returning()` gives back the inserted row, or only the columns you ask for:

```typescript
const [created] = await db.insert(users).values(user).returning();

const [{ insertedId }] = await db
    .insert(users)
    .values({ name: 'Dan', age: 25, email: 'dan@example.com' })
    .returning({ insertedId: users.id });
```

### Select

Source: [Drizzle docs, Select](https://orm.drizzle.team/docs/select).

```typescript
import { eq } from 'drizzle-orm';

const allUsers = await db.select().from(users);
// { id: number; name: string; age: number; email: string }[]

const john = await db
    .select()
    .from(users)
    .where(eq(users.email, 'john@example.com'));
```

A partial select returns only the requested columns, and the type follows:

```typescript
const emails = await db
    .select({ id: users.id, email: users.email })
    .from(users);
// { id: number; email: string }[]
```

Conditions are combined with helpers such as `and`, `or`, `gt` and `ilike`. An `undefined` condition is simply ignored, which makes optional filters easy:

```typescript
import { ilike } from 'drizzle-orm';

const searchPosts = async (term?: string) => {
    return db
        .select()
        .from(posts)
        .where(term ? ilike(posts.content, term) : undefined);
};
```

### Update and delete

Source: [Drizzle docs, Get started with PostgreSQL](https://orm.drizzle.team/docs/get-started/postgresql-new).

```typescript
await db
    .update(users)
    .set({ age: 31 })
    .where(eq(users.email, 'john@example.com'));

await db.delete(users).where(eq(users.email, 'john@example.com'));
```

### Joins

Source: [Drizzle docs, Joins](https://orm.drizzle.team/docs/joins).

```typescript
const result = await db
    .select()
    .from(users)
    .leftJoin(posts, eq(users.id, posts.ownerId));
```

The result is typed, including the fact that a left join can return no post:

```typescript
const result: {
    users: { id: number; name: string; age: number; email: string };
    posts: { id: number; content: string; ownerId: number | null } | null;
}[];
```

### Relational queries

Source: [Drizzle docs, Relational queries](https://orm.drizzle.team/docs/rqb).

For nested data, the relational API loads rows with their relations in a single query:

```typescript
const usersWithPosts = await db.query.users.findMany({
    with: {
        posts: true,
    },
});

const user = await db.query.users.findFirst({
    where: {
        id: 1,
    },
    with: {
        posts: true,
    },
});
```

Each user comes back with a `posts` array, typed from the schema. `findFirst()` adds `limit 1` to the query.

### Transactions

Source: [Drizzle docs, Transactions](https://orm.drizzle.team/docs/transactions).

A transaction groups several queries that must succeed or fail together. This example from the documentation moves money between two accounts:

```typescript
await db.transaction(async (tx) => {
    const [account] = await tx
        .select({ balance: accounts.balance })
        .from(accounts)
        .where(eq(users.name, 'Dan'));

    if (account.balance < 100) {
        // This throws an exception that rolls back the transaction.
        tx.rollback();
    }

    await tx.update(accounts).set({ balance: sql`${accounts.balance} - 100.00` }).where(eq(users.name, 'Dan'));
    await tx.update(accounts).set({ balance: sql`${accounts.balance} + 100.00` }).where(eq(users.name, 'Andrew'));
});
```

If any query fails, or `tx.rollback()` is called, none of the changes are kept.

## Good practices

### Commit your migrations

Generated migrations are part of the code. Review them like any other change, and commit them with the schema change that produced them.

### Keep push for prototyping

`drizzle-kit push` is fast, but it leaves no history. Once a database holds real data, switch to `generate` and `migrate`.

### One schema file per domain

As the application grows, split the schema into several files, such as `users.ts`, `billing.ts` or `posts.ts`, and point `schema` in the configuration to the folder.

### Validate input before it reaches the database

Source: [Drizzle docs, drizzle-zod](https://orm.drizzle.team/docs/zod).

The schema describes the database, not what clients are allowed to send. Drizzle can generate Zod schemas from tables:

```typescript
import { createInsertSchema } from 'drizzle-orm/zod';

const userInsertSchema = createInsertSchema(users);

const parsed = userInsertSchema.parse(input);
await db.insert(users).values(parsed);
```

The validation rules stay in sync with the table, and invalid data is rejected before the query runs.

## Conclusion

Drizzle gives TypeScript backends what raw SQL and traditional ORMs each miss: the control and readability of SQL, with types that come directly from the schema.

In this article, we looked at what Drizzle is, how it compares to Prisma, TypeORM and Kysely, and why it has become my default. We then set it up with PostgreSQL, from the schema and relations to migrations, queries and transactions.

What makes it my choice for every TypeScript backend:

- A schema written in TypeScript, with types inferred from it
- Queries that read like the SQL they produce
- Migrations generated from the schema, as plain SQL files
- A small library that runs on servers, serverless platforms and the edge

The best tool is the one that stays out of the way. With Drizzle, the database remains SQL, the code remains TypeScript, and the compiler checks that the two agree.
