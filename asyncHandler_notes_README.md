# Understanding `asyncHandler` in Express + TypeScript

## The Original Code

```ts
import type { Response, NextFunction, Request } from "express";

export const asyncHandler = <T = any, R extends Request = Request>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

---

# The Main Problem This Solves

In Express, async routes can crash or fail silently if errors are not caught properly.

Example:

```ts
app.get("/user", async (req, res) => {
  const user = await getUser(); // what if this fails?
  res.json(user);
});
```

If `getUser()` throws an error:

```ts
throw new Error("DB failed");
```

Express does NOT automatically catch async errors properly.

So normally you'd do this every single time:

```ts
app.get("/user", async (req, res, next) => {
  try {
    const user = await getUser();
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

Now imagine writing that in 100 routes.

So people created `asyncHandler`.

---

# What `asyncHandler` Does

It wraps your async function and automatically catches errors.

Instead of:

```ts
router.get("/user", async (req, res, next) => {
  try {
    const user = await getUser();
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

You do:

```ts
router.get(
  "/user",
  asyncHandler(async (req, res) => {
    const user = await getUser();
    res.json(user);
  }),
);
```

Cleaner and reusable.

---

# Breaking Down The Code

## 1. The Import

```ts
import type { Response, NextFunction, Request } from "express";
```

These are TypeScript types from Express.

| Type | Meaning |
|---|---|
| `Request` | Incoming request |
| `Response` | Outgoing response |
| `NextFunction` | Express next middleware function |

---

## 2. The Generic Part

```ts
<T = any, R extends Request = Request>
```

This is TypeScript generics.

Think of it as:

> "This function can work with different return types."

In this specific code:

```ts
R extends Request = Request
```

is not actually being used.

You could simplify the function and it would still work.

---

## 3. The `fn` Parameter

```ts
fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
```

This means:

> "`fn` must be an async function"

because async functions return Promises.

Example:

```ts
async (req, res, next) => {
  const users = await db.query(...);
  res.json(users);
}
```

That route callback gets passed into `asyncHandler`.

---

## 4. The Returned Function

```ts
return (req: Request, res: Response, next: NextFunction) => {
```

This returns a normal Express middleware function.

Express expects middleware in this format:

```ts
(req, res, next) => {}
```

So `asyncHandler` returns one.

---

## 5. The Real Magic

```ts
Promise.resolve(fn(req, res, next)).catch(next);
```

This is the important part.

### Step 1: Run your async function

```ts
fn(req, res, next)
```

### Step 2: Wrap it safely in a Promise

```ts
Promise.resolve(...)
```

### Step 3: Catch any errors

```ts
.catch(next)
```

Equivalent to:

```ts
catch(error) {
  next(error);
}
```

---

# Visual Flow

Without `asyncHandler`

```txt
Route -> Error -> App crashes / unhandled
```

With `asyncHandler`

```txt
Route -> Error -> catch(next) -> Error middleware
```

---

# Real Example

## Without `asyncHandler`

```ts
router.get("/users", async (req, res, next) => {
  try {
    const users = await pool.query("SELECT * FROM users");

    res.json(users.rows);
  } catch (error) {
    next(error);
  }
});
```

---

## With `asyncHandler`

```ts
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await pool.query("SELECT * FROM users");

    res.json(users.rows);
  }),
);
```

---

# Why `next(error)` Matters

Express has global error middleware:

```ts
app.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
  });
});
```

`next(error)` sends errors there automatically.

---

# Important Note

This mainly catches async errors like:

- Database errors
- Failed awaits
- Rejected promises

---

# Simplified Beginner Version

```ts
export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
```

---

# Mental Model

Think of `asyncHandler` as:

> "Automatic try/catch for async Express routes."

That is the whole idea behind it.
