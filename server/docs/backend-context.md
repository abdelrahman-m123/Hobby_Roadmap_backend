# Backend Context — HobbyRoadmap API

This document summarizes the backend endpoints and models for the HobbyRoadmap project (server code under `hobbyroadmap/`). Use this as a quick reference for API routes, HTTP methods, and the primary Mongoose models.

**Base URL**: `/api`

**Mounted routes** (see `index.js`):
- `app.use('/api/auth', authRoutes)` — authentication and user profile
- `app.use('/api/categories', categoryRoutes)` — categories
- `app.use('/api/roadmaps', roadmapRoutes)` — roadmaps and user actions
- `app.use('/api/resources', resourceRoutes)` — resources for roadmaps
- `app.use('/api/quizzes', quizRoutes)` — quizzes and attempts
- `app.use('/api/flashcards', flashcardRoutes)` — flashcard sets
- Swagger UI served at `/api/docs` (spec at `config/swagger.json`)
- Health check: `GET /api/health`

**Endpoints (summary by route file)**

- Auth (`/api/auth`)
  - POST `/register` — register new user
  - POST `/login` — login and receive JWT
  - GET `/me` — get current user (protected)
  - PATCH `/me` — update current user (protected)

- Categories (`/api/categories`)
  - GET `/` — list categories
  - GET `/{slug}` — get category by slug
  - POST `/` — create category (admin)
  - PATCH `/{id}` — update category (admin)
  - DELETE `/{id}` — delete category (admin)

- Roadmaps (`/api/roadmaps`)
  - GET `/` — public roadmaps
  - GET `/admin/all` — all roadmaps (admin)
  - GET `/{slug}` — get roadmap by slug
  - POST `/` — create roadmap (admin)
  - PATCH `/{id}` — update roadmap (admin)
  - DELETE `/{id}` — delete roadmap (admin)
  - POST `/{id}/save` — toggle saved roadmap (protected)
  - GET `/{id}/progress` — get user progress for roadmap (protected)
  - PATCH `/{id}/progress` — update progress (protected)

- Resources (`/api/resources`)
  - GET `/` — resources by roadmap (query or params used in controller)
  - GET `/{id}` — get resource
  - POST `/` — create resource (admin)
  - PATCH `/{id}` — update resource (admin)
  - DELETE `/{id}` — delete resource (admin)

- Quizzes (`/api/quizzes`)
  - GET `/` — quizzes by resource
  - GET `/{id}` — get quiz
  - GET `/{id}/attempts` — get quiz attempts (protected)
  - POST `/` — create quiz (admin)
  - POST `/import` — import quizzes JSON (admin)
  - PATCH `/{id}` — update quiz (admin)
  - DELETE `/{id}` — delete quiz (admin)
  - POST `/{id}/submit` — submit answers (protected)

- Flashcards (`/api/flashcards`)
  - GET `/` — flashcards by resource
  - GET `/{id}` — get flashcard set
  - POST `/` — create flashcard set (admin)
  - POST `/import` — import flashcards JSON (admin)
  - PATCH `/{id}` — update flashcard set (admin)
  - DELETE `/{id}` — delete flashcard set (admin)


**Primary Mongoose models (location: `hobbyroadmap/models/`)**

- `User` — `models/User.js`
  - Fields: `username`, `email`, `password` (hashed), `role` (`user|admin`), `savedRoadmaps` (ObjectId[]), `progress` (array of {roadmap, completedResources})
  - Hooks: password hashing before save
  - Methods: `comparePassword()`, `toJSON()` hides password

- `Category` — `models/Category.js`
  - Fields: `name`, `slug`, `description`, `icon`, `coverImage`, `createdBy`
  - Hook: slug auto-generation from `name`

- `Roadmap` — `models/Roadmap.js`
  - Fields: `title`, `slug`, `description`, `category` (ObjectId), `coverImage`, `difficulty`, `stages` (array), `estimatedTime`, `tags`, `isPublished`, `createdBy`, `enrolledCount`
  - Subdocument: `stage` schema with `title`, `description`, `order`, `resources` (ObjectId[])
  - Hook: slug auto-generation from `title`

- `Resource` — `models/Resource.js`
  - Fields: `title`, `description`, `type` (`youtube|pdf`), `url`, `youtubeId`, `duration`, `roadmap` (ObjectId), `order`, `stage`, `tags`, `createdBy`
  - Hook: extract `youtubeId` from YouTube URLs on save

- `Quiz` — `models/Quiz.js`
  - Fields: `title`, `description`, `resource` (ObjectId), `roadmap` (ObjectId), `questions` (array of question subdocs), `passingScore`, `createdBy`
  - Question subdoc: `question`, `options` (2-6), `correctOption` (index), `explanation`

- `QuizAttempt` — `models/QuizAttempt.js`
  - Fields: `user` (ObjectId), `quiz` (ObjectId), `answers` (array with questionIndex/selectedOption/isCorrect), `score` (percentage), `passed`, `completedAt`

- `FlashcardSet` — `models/FlashcardSet.js`
  - Fields: `title`, `description`, `resource` (ObjectId), `roadmap` (ObjectId), `cards` (array of `{front, back, hint}`), `createdBy`
  - Import format documented in model comment for JSON imports


**Swagger / docs**
- Single JSON spec: `hobbyroadmap/config/swagger.json` (Swagger UI mounted at `/api/docs`).
- The JSON includes the documented endpoints and request/response shapes (summary-level). If you update endpoints, keep `swagger.json` in sync.

**Where to look in code**
- Route definitions: `hobbyroadmap/routes/*.js` (each file maps handlers to HTTP methods)
- Request handlers: `hobbyroadmap/controllers/*.js`
- Models: `hobbyroadmap/models/*.js`
- App mounting and Swagger serving: `hobbyroadmap/index.js` and `hobbyroadmap/config/swagger.js` (now requires the JSON file)

**Notes & tips**
- Protected endpoints require the `protect` middleware (JWT). Admin-only endpoints also use `restrictTo('admin')`.
- Import endpoints (`/import`) expect JSON payloads matching the model-import formats described in model files (`FlashcardSet`, `Quiz`).
- If you add/remove endpoints, update `config/swagger.json` so `/api/docs` reflects changes.

If you want, I can also:
- Generate example request/response payloads for each endpoint and add them to this doc,
- Or produce a smaller machine-readable OpenAPI YAML converted from the JSON for CI/validation.

