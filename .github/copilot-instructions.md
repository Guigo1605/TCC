## Purpose
This file gives AI coding agents the minimal, actionable context to work productively on this Express + EJS + Sequelize codebase. This is a pet services scheduler (PetShop) with dual UI/API surfaces.

**Big Picture**
- **Architecture**: Server-rendered web app (EJS) with a REST API. Express routes serve both web views (GET/POST forms) and JSON API endpoints. Sequelize + MySQL handles persistence. Domain: Usuario (accounts), Animal (pets), Servico (services), Agendamento (bookings).
- **Entry point**: `app.js` — loads models, sets up middleware chain (EJS layout, cookie JWT decoding), defines associations, then mounts routes in this exact order: auth → logout → web routes (`/agendamentos`) → API routes (`/api/*`).
- **Models & lifecycle**: All models defined in `models/` are required into `app.js` before `config/associations.js` executes. Password hashing happens in `Usuario` `beforeCreate` hook (bcrypt). Database sync with `{ alter: true }` runs at startup.

**Auth / Sessions**
- **Web (Views)**: Cookie named `token` (set by login response). `app.js` middleware verifies JWT, injects `res.locals.usuario` for EJS templates. Payload: `{ usuario: { id, perfil, nome } }` where `perfil` is 'admin' or 'cliente'. Unauthorized users have `res.locals.usuario = null`.
- **API**: Authorization header `Bearer <token>`. `middleware/authMiddleware.js` validates and attaches `req.usuario` (same shape). Also includes inline `checkAdmin` middleware in routes (e.g., `usuarioRoutes.js`) for role-based access control.

**Conventions & Patterns (project-specific)**
- **Dual response pattern**: Controllers use `req.accepts('json')` to branch responses. If JSON requested (API), return JSON; else render EJS or redirect. Example: `AuthController.login` returns `{ token, perfil }` for API or redirects to `/` for web.
- **View layout**: `express-ejs-layouts` middleware registered early (before routes). Layout file is `views/layout.ejs`. Controllers render views with `res.render('usuarios/login', { title: ... })`. User data via `res.locals.usuario` accessible in all templates.
- **Model hooks**: Cross-cutting logic lives in Sequelize hooks. `Usuario` model hashes password in `beforeCreate` using bcrypt. Do not hash in controller—rely on model lifecycle.
- **Route organization**: Web routes (render HTML) mounted on root (`/`) and `/agendamentos`. API routes mounted on `/api/*` with `authMiddleware` guard. Inline role checks (e.g., `checkAdmin`) appear directly in route files, not in middleware.
- **Database schema**: `sequelize.sync({ alter: true })` runs at startup—mutates schema based on model definitions. Avoid using migrations; schema changes defined in model files.
- **Associations**: Defined in `config/associations.js` after models loaded. Uses aliases (e.g., `as: 'pets'`, `as: 'cliente'`) for eager loading and template clarity.

**Files to inspect for context**
- `app.js` — app wiring, middleware chain (cookie JWT, layout), route mount order, DB sync.
- `config/database.js` — Sequelize connection (disable logging there to debug SQL).
- `config/associations.js` — all model relationships, aliases used in queries and templates.
- `models/Usuario.js` — example of lifecycle hooks (`beforeCreate` password hashing).
- `controllers/AuthController.js` — JWT creation, `req.accepts('json')` branching pattern.
- `middleware/authMiddleware.js` — API Bearer token extraction and `req.usuario` attachment.
- `routes/usuarioRoutes.js` — example of role-based `checkAdmin` middleware and route guards.
- `routes/authRoutes.js` — web form render (GET `/login`) vs. API endpoint (POST `/login`) in same file.

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
- If implementing auth-protected API endpoints, use `middleware/authMiddleware.js` (expects header `Authorization: Bearer <token>`). For web routes that render pages, rely on `res.locals.usuario` populated from cookie.
- If adding role-based access, define `checkAdmin` or similar inline in the route file (not a separate middleware), then apply before controller.
- Avoid removing `express-ejs-layouts` or moving its registration after route mounting — layout middleware must come before routes.
- Do not hash passwords in controllers; instead rely on `Usuario` model `beforeCreate` hook (already in place).
- When updating user-facing routes, ensure both web form display (GET) and API endpoint (POST) are in the same route file if they share purpose.

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
