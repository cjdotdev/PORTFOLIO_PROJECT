---
title: "Validating API input with Zod in TypeScript"
subtitle: "TypeScript checks nothing once your app is running. Here is how to validate request bodies, environment variables and API responses with one Zod schema that also gives you the type."
date: 2026-09-18
tags: ["TypeScript", "Validation", "Zod"]
cover: ./cover.webp
coverAlt: "The Zod logo, a blue shield with a white Z, on a white background"
draft: true
---

TypeScript catches a large class of bugs before the code ever runs. It checks that functions receive the arguments they expect, that objects have the properties we read, and that we do not pass a string where a number belongs. However, this protection ends at compile time. Once the code is compiled to JavaScript, the types are gone.

This becomes a problem as soon as data comes from outside the application. A request body, a query string, an environment variable or the response of a third-party API is not checked by the compiler. A type annotation on that data is only a promise: nothing verifies it at runtime.

In this article, we will explore why types alone are not enough at the boundaries of a backend, and how Zod closes that gap. We will cover what Zod is, how it compares to its alternatives, the rules that make validation actually protect an API, and build request validation, environment checks and documentation from a single schema.

## Compile time vs. runtime

TypeScript is a **static** type system. It analyzes the code before it runs, then removes every type annotation when it produces JavaScript.

This means a type can only describe data the compiler can see. Data that arrives while the program is running is outside its reach.

### Where untrusted data comes from

A typical backend receives data from many sources it does not control:

1. **HTTP requests**

   Request bodies, query strings, route parameters and headers are written by the client, or by anyone calling the API.

2. **Environment variables**

   They are always strings, they can be missing, and they change between machines.

3. **External services**

   A third-party API can change its response format, return an error page instead of JSON, or send `null` where a value was expected.

4. **Stored and generated data**

   JSON files, message queues, webhooks and the output of language models all arrive as unchecked values.

Consider this route handler:

```typescript
type CreateUser = {
    email: string;
    age: number;
};

app.post('/users', async (req, res) => {
    const user: CreateUser = req.body;

    // TypeScript is satisfied, but nothing was checked.
    await db.users.insert(user);
});
```

The annotation tells the compiler that `req.body` is a `CreateUser`. It does not make it one. If a client sends `{ "email": 42 }`, the value reaches the database as it is.

### Types vs. runtime validation

| Feature | TypeScript Types | Runtime Validation |
| --- | --- | --- |
| When it runs | At compile time | While the application runs |
| Checks | Your own code | The data your code receives |
| Exists in production | No, types are erased | Yes |
| Protects Against | Programming mistakes | Malformed, missing or malicious input |

Both are needed. Types protect the code from itself, while validation protects the code from the outside world.

The usual answer is to write a validation function next to each type. This works, but it creates two descriptions of the same data that must be kept in sync by hand. When one changes and the other does not, the type starts lying.

## What is Zod?

Zod is a TypeScript-first schema validation library. Instead of writing a type and a validation function separately, we describe the expected shape of the data once, in a **schema**.

From that schema, Zod provides two things:

- **Runtime validation**: the schema checks real values while the application runs.
- **Static types**: the TypeScript type is inferred from the schema with `z.infer`.

A schema becomes the single source of truth for the shape of the data.

### Defining a schema

```typescript
import { z } from 'zod';

const CreateUser = z.object({
    email: z.email(),
    name: z.string().trim().min(2).max(80),
    age: z.number().int().min(18),
});

type CreateUser = z.infer<typeof CreateUser>;
// { email: string; name: string; age: number }
```

The type is never written by hand. If a field is added to the schema, the type follows automatically.

### Parsing data

Zod offers two main ways to check a value.

#### parse()

`parse()` returns the validated data, or throws a `ZodError` when the value does not match:

```typescript
const user = CreateUser.parse(req.body);
// user is now a CreateUser, checked at runtime
```

#### safeParse()

`safeParse()` never throws. It returns an object that tells us whether validation succeeded:

```typescript
const result = CreateUser.safeParse(req.body);

if (!result.success) {
    console.log(result.error.issues);
} else {
    console.log(result.data);
}
```

`safeParse()` is usually the better choice in request handlers, where invalid input is expected and should lead to a clear error response rather than an exception.

Note that Zod **parses** data, it does not simply check it. The value returned is a new object: transformations such as `.trim()` have been applied, and default values have been filled in.

### What changed in Zod 4

Zod 4 is the current major version. A few changes are worth knowing before reading older tutorials:

- String formats are top-level functions: `z.email()`, `z.url()`, `z.uuid()` instead of `z.string().email()`.
- `z.strictObject()` and `z.looseObject()` make the handling of unknown keys explicit.
- `z.toJSONSchema()` converts a schema to JSON Schema without an extra package.
- `zod/mini` offers a smaller, tree-shakable API for the browser and edge runtimes.

## Zod and its alternatives

Zod is not the only validation library in the TypeScript ecosystem.

| Library | Approach | Best Suited For |
| --- | --- | --- |
| Zod | Chained schema API, type inference | General-purpose validation, the largest ecosystem |
| Valibot | Small composable functions | Bundle size: browser and edge code |
| ArkType | Syntax close to TypeScript types | Teams that want schemas to read like types |
| Yup | Chained schema API | Existing projects, especially with Formik |
| Joi | Chained schema API, JavaScript-first | Existing Node.js projects without TypeScript |

Zod, Valibot and ArkType all implement **Standard Schema**, a shared interface that lets frameworks accept any of them. Moving from one to another is easier than it used to be.

Zod's main strength remains its ecosystem: request validators for Hono, Express and tRPC, form libraries such as React Hook Form, and structured output for language models all support it directly.

## The three rules of validating input with Zod

Adding Zod to a project does not make it safe by itself. Validation only protects an API when it is applied in the right place and in the right way.

### Rule 1: Validate at the boundary, then trust the data

Validation belongs at the point where data **enters** the application: the request handler, the configuration loader, the client that calls an external API.

Once a value has passed through a schema, the rest of the code can rely on its type. Services, repositories and helpers do not need to check it again.

Bad:

```typescript
// The service receives unchecked data and defends itself everywhere.
function createUser(input: any) {
    if (typeof input.email !== 'string') {
        throw new Error('Invalid email');
    }
    // ...
}
```

Good:

```typescript
// The handler validates once, the service receives a typed value.
const user = CreateUser.parse(req.body);

await createUser(user);

function createUser(user: CreateUser) {
    // user.email is a valid email address here
}
```

Validating at the boundary keeps the checks in one place and makes the types inside the application true.

### Rule 2: Reject unknown fields

By default, `z.object()` **strips** keys that are not part of the schema:

```typescript
const Profile = z.object({ name: z.string() });

Profile.parse({ name: 'Joel', isAdmin: true });
// { name: 'Joel' }
```

Stripping is safe for the data that is stored, but it hides mistakes. A client that sends `emial` instead of `email`, or a field the API does not support, gets no feedback.

For request bodies, it is often better to reject unknown keys with `z.strictObject()`:

```typescript
const Profile = z.strictObject({ name: z.string() });

Profile.safeParse({ name: 'Joel', isAdmin: true }).success;
// false: Unrecognized key: "isAdmin"
```

A strict schema makes the contract explicit. The API accepts exactly the fields it documents, and everything else is an error the client can fix.

### Rule 3: Never return raw errors

A `ZodError` contains detailed information about every failed check: codes, paths, and sometimes internal details such as the regular expression used to validate an email address.

That information is useful in logs, but it should not be sent to clients as it is. An error response is part of the API: it should be stable, readable and free of implementation details.

Zod provides helpers to turn an error into a clean structure:

```typescript
const result = CreateUser.safeParse(input);

if (!result.success) {
    z.flattenError(result.error);
}
```

Example output:

```json
{
  "formErrors": ["Unrecognized key: \"isAdmin\""],
  "fieldErrors": {
    "email": ["Invalid email address"],
    "age": ["Too small: expected number to be >=18"]
  }
}
```

`formErrors` holds the errors that concern the whole object, and `fieldErrors` holds one list of messages per field. For logs and command-line tools, `z.prettifyError()` produces a human-readable string instead.

Following these three rules turns validation from a formality into a real contract between the API and its clients.

## Implementation in Node.js

We will now build three pieces on top of the same schemas:

- Request validation in an HTTP route
- Environment variables checked at startup
- JSON Schema generated for documentation

The examples use **Hono**, a small web framework that runs on Node.js and on edge runtimes. The same ideas apply to Express, as shown at the end of Step 3.

### Step 1: Install the dependencies

```bash
npm install zod hono @hono/zod-validator
```

`@hono/zod-validator` is the official middleware that connects Zod schemas to Hono routes.

### Step 2: Define the request schema

Create a module that holds the schemas of the API:

```typescript
// schemas.ts

import { z } from 'zod';

export const CreateUser = z.strictObject({
    email: z.email(),
    name: z.string().trim().min(2).max(80),
    age: z.number().int().min(18),
    role: z.enum(['admin', 'member']).default('member'),
});

export type CreateUser = z.infer<typeof CreateUser>;
```

This schema:

- Requires a valid email address
- Trims the name, then checks its length
- Requires an integer age of at least 18
- Accepts only two roles, and uses `member` when none is sent
- Rejects any other field

### Step 3: Validate the request

```typescript
// app.ts

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { CreateUser } from './schemas';

const app = new Hono();


app.post(
    '/users',
    zValidator('json', CreateUser, (result, c) => {
        if (!result.success) {
            return c.json(
                {
                    error: 'Invalid request body',
                    details: z.flattenError(result.error)
                },
                400
            );
        }
    }),
    async (c) => {
        const user = c.req.valid('json');
        // user: { email: string; name: string; age: number; role: 'admin' | 'member' }

        return c.json({ email: user.email, role: user.role }, 201);
    }
);


export default app;
```

The third argument of `zValidator` is a hook that runs after validation. Without it, the middleware still answers `400`, but its body contains the raw `ZodError`. The hook lets us apply Rule 3 and return a clean error instead.

Inside the handler, `c.req.valid('json')` returns the parsed value with its inferred type. The handler never touches unchecked data.

With Express, the same schema is used with `safeParse()`:

```typescript
app.post('/users', (req, res) => {
    const result = CreateUser.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            error: 'Invalid request body',
            details: z.flattenError(result.error)
        });
    }

    const user = result.data;
    // ...
});
```

### Step 4: Validate environment variables

Configuration is external data too. A missing database URL or a malformed port should stop the application at startup, not crash it at the first request.

```typescript
// env.ts

import { z } from 'zod';

const Env = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.url(),
});


const result = Env.safeParse(process.env);

if (!result.success) {
    console.error('Invalid environment variables:');
    console.error(z.prettifyError(result.error));
    process.exit(1);
}


export const env = result.data;
```

Environment variables are always strings. `z.coerce.number()` converts `"8080"` into the number `8080` before checking it.

Be careful with booleans: `z.coerce.boolean()` follows JavaScript rules, so the string `"false"` becomes `true`. Use `z.stringbool()` instead, which understands values such as `"true"`, `"false"`, `"1"` and `"0"`.

The rest of the application imports `env` and never reads `process.env` directly:

```typescript
import { env } from './env';

console.log(`Listening on port ${env.PORT}`);
// env.PORT is a number
```

### Step 5: Generate JSON Schema for documentation

API documentation often describes the same fields a third time, in an OpenAPI file. With Zod 4, the documentation can be generated from the schema itself:

```typescript
import { z } from 'zod';
import { CreateUser } from './schemas';

const jsonSchema = z.toJSONSchema(CreateUser, { io: 'input' });
```

Example output, shortened (Zod also writes the email pattern and the integer bounds):

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "email": { "type": "string", "format": "email" },
    "name": { "type": "string", "minLength": 2, "maxLength": 80 },
    "age": { "type": "integer", "minimum": 18 },
    "role": {
      "type": "string",
      "enum": ["admin", "member"],
      "default": "member"
    }
  },
  "required": ["email", "name", "age"],
  "additionalProperties": false
}
```

The `io: 'input'` option describes what the client must **send**. Since `role` has a default value, it is optional for the client and does not appear in `required`. The strict object becomes `"additionalProperties": false`.

This JSON Schema can be placed directly in the `requestBody` of an OpenAPI document. The documentation can no longer drift away from the validation, because both come from the same schema.

### How the implementation works

#### Request flow

When a request reaches `POST /users`:

1. Hono reads the JSON body.
2. `zValidator` parses it with the `CreateUser` schema.
3. If parsing fails, the hook returns a `400` response with a flattened error.
4. If parsing succeeds, the handler receives the parsed value: trimmed, with defaults applied, and typed.

#### One schema, three uses

The `CreateUser` schema now provides:

- The **runtime validation** of every request
- The **TypeScript type** used by the rest of the code
- The **JSON Schema** used by the documentation

Changing a rule in the schema updates all three at once.

## Conclusion

TypeScript makes a codebase safer, but its guarantees stop at the edges of the application. Request bodies, environment variables and external responses arrive at runtime, where types no longer exist.

By validating this data with schemas, an application can rely on its types again, and reject bad input before it reaches the business logic or the database.

In this article, we explored the difference between compile-time types and runtime validation, the main ideas behind Zod, and how it compares to Valibot, ArkType, Yup and Joi. We then built request validation, environment checks and generated documentation from a single schema.

The implementation follows the core rules of input validation:

- Validating data once, where it enters the application
- Rejecting unknown fields instead of silently ignoring them
- Returning clean, stable errors instead of raw validation output
- Keeping one schema as the source of truth for validation, types and documentation

However, validation is only one layer of a secure API. Authentication, authorization, rate limiting and careful handling of errors are still required.

The goal of validation is not simply to reject bad data. It is to make sure that every value inside the application is exactly what the code believes it is.

Writing the schema first, and letting the types and documentation follow, creates APIs that are easier to trust, easier to change and harder to break.
