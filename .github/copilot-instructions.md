## Purpose
This file gives AI coding agents the minimal, actionable context to work productively on this Express + EJS + Sequelize codebase.

**Big Picture**
- **Architecture**: Server-rendered web app (EJS) with a small JSON API. Express routes serve both web views and API endpoints. Sequelize + MySQL is used for persistence.
- **Entry point**: `app.js` — sets up EJS layouts, cookie-based JWT decoding (for views), and mounts web and API routes.
- **Models & associations**: All models live in `models/` and are required from `app.js` before `config/associations.js` is invoked. The DB connection is in `config/database.js`.

**Auth / Sessions**
- Views expect a cookie named `token`. `app.js` verifies the JWT and injects `res.locals.usuario` for templates (see `app.js` middleware). Example payload shape: `{ usuario: { id, perfil, nome } }` (created in `controllers/AuthController.js`).
- API endpoints use an Authorization header in the form `Bearer <token>`; see `middleware/authMiddleware.js` which verifies the token and attaches `req.usuario`.

**Conventions & Patterns (project-specific)**
- View layout: `express-ejs-layouts` is used and must be registered before routes. The layout name is `layout` (look in `views/layout.ejs`).
- Controllers branch on `req.accepts('json')` to return either JSON (API) or redirect/render (web). See `controllers/AuthController.js` for a clear example.
- Models may include lifecycle hooks (e.g., `models/Usuario.js` hashes passwords in `beforeCreate`). Prefer using model hooks for cross-cutting logic like password hashing.
- `app.js` calls `sequelize.sync({ alter: true })` at startup — it mutates DB schema. Avoid changing this behavior for production without discussion.

**Files to inspect for context**
- `app.js` — app wiring, layout + cookie JWT middleware, route mounting.
- `controllers/AuthController.js` — login/register flows and JWT creation.
- `middleware/authMiddleware.js` — API token verification, attaches `req.usuario`.
- `models/*.js` — Sequelize models and hooks (e.g., `models/Usuario.js`).
- `config/database.js` & `config/associations.js` — DB connection and associations.
- `routes/*.js` — where endpoints are declared; web routes live at root and `/agendamentos`, API routes under `/api/*`.

**Environment & running**
- Required env vars (used directly in code): `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `JWT_SECRET`, `PORT`.
- Example `.env` (not included in repo):
  DB_NAME=your_db
  DB_USER=your_user
  DB_PASSWORD=your_pass
  DB_HOST=localhost
  JWT_SECRET=replace_this
  PORT=3000
- Start commands (from `package.json`):
  - `npm start` — production run (uses `node app.js`).
  - `npm run dev` — uses `nodemon app.js` for development.

**Testing / Debugging notes**
- Sequelize logging is disabled in `config/database.js` (`logging: false`). To debug SQL enable logging there.
- The app populates `res.locals.usuario` for templates, but controllers and API routes rely on `req.usuario` only when `middleware/authMiddleware.js` is used. Be careful: some routes rely only on `res.locals.usuario` (web), others require the header-based middleware (API).

**When changing or adding code**
- If adding a new model, require it in `app.js` (so associations file sees it), then add relationships in `config/associations.js`.
- If implementing auth-protected API endpoints, use `middleware/authMiddleware.js` (expects header `Authorization: Bearer <token>`). For web routes that rely on page rendering, rely on `res.locals.usuario` which is populated from cookie.
- Avoid removing `express-ejs-layouts` or moving its registration after route mounting — layout middleware must come before routes.

**Examples (quick references)**
- Cookie -> template user injection (from `app.js`):
  ```js
  const token = req.cookies.token; // cookie-parser is used
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  res.locals.usuario = decoded;
  ```
- API auth middleware (from `middleware/authMiddleware.js`):
  ```js
  const token = req.header('Authorization'); // 'Bearer <token>'
  const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
  req.usuario = decoded.usuario;
  ```

If anything above is unclear or you'd like me to emphasize other files or workflows (e.g., migrations, test harness, or CI), tell me which area to expand and I will iterate.

-- End of file
