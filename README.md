# Postify

Postify is a full-stack photo-sharing social app. People sign up, share photo posts with captions, comment on each other's posts, and keep a personal profile with a photo grid of everything they've shared.

It's built as two separate projects in one repository:

- **Backend:** a RESTful ASP.NET Core Web API with JWT authentication, Entity Framework Core and SQL Server.
- **Frontend:** a standalone-components Angular single-page app that consumes that API.

### Tech stack

**Backend**

![.NET](https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core_Web_API-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Entity Framework Core](https://img.shields.io/badge/EF_Core_10-68217A?style=for-the-badge&logo=dotnet&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

**Frontend**

![Angular](https://img.shields.io/badge/Angular_22-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white)
![Sass](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)

---

## Table of contents

- [Features](#features)
- [Repository structure](#repository-structure)
- [Quick start](#quick-start)
- [Backend](#backend)
  - [Backend tech stack](#backend-tech-stack)
  - [Backend project structure](#backend-project-structure)
  - [Backend prerequisites](#backend-prerequisites)
  - [Backend configuration](#backend-configuration)
  - [Database setup](#database-setup)
  - [Running the API](#running-the-api)
  - [API reference](#api-reference)
  - [Validation rules](#validation-rules)
  - [Authentication](#authentication)
  - [Image uploads](#image-uploads)
- [Frontend](#frontend)
  - [Frontend tech stack](#frontend-tech-stack)
  - [Frontend project structure](#frontend-project-structure)
  - [Frontend prerequisites](#frontend-prerequisites)
  - [Frontend configuration](#frontend-configuration)
  - [Running the app](#running-the-app)
  - [Building and testing](#building-and-testing)
  - [Architecture notes](#architecture-notes)
- [Known limitations](#known-limitations)

---

## Features

- **Accounts:** register, sign in with email *or* username, and stay signed in across refreshes. The session ends automatically when the token expires.
- **Feed:** posts from everyone, newest first, with "Load more" pagination.
- **Posts:** create a photo post with an optional caption (drag-and-drop or file picker, with a preview), edit the caption, or delete the post.
- **Post details:** a full-size image with the author, the caption and a scrollable comment thread.
- **Comments:** add, edit and delete your own comments, with "Load more" for long threads.
- **Profiles:** your own profile and other users' profiles, each with a photo grid of their posts.
- **Edit profile:** change your name, bio and profile picture.
- **Ownership:** only the author sees the edit and delete actions, and the API enforces it with `403 Forbidden`.
- **Responsive UI:** a split layout on desktop, a bottom navigation bar and bottom-sheet modals on phones.

## Repository structure

```text
Postify/
├── Backend/
│   ├── Postify.slnx            # Solution file
│   └── Postify.Api/            # ASP.NET Core Web API
└── Frontend/                   # Angular app
```

## Quick start

You'll need the [backend prerequisites](#backend-prerequisites) and the [frontend prerequisites](#frontend-prerequisites) installed.

```bash
# 1. API: configure the JWT secret, create the database, run it on https://localhost:7042
cd Backend/Postify.Api
dotnet user-secrets set "Jwt:SecretKey" "<a random string of at least 32 characters>"
dotnet ef database update
dotnet run --launch-profile https

# 2. Frontend, in a second terminal: run it on http://localhost:4200
cd Frontend
npm install
npm start
```

Then open **http://localhost:4200** and create an account.

---

## Backend

A RESTful API that handles accounts, JWT authentication, posts, comments, profiles and image uploads.

### Backend tech stack

| Concern | Technology |
|---|---|
| Framework | ASP.NET Core Web API on **.NET 10** (C#, nullable reference types) |
| Data access | **Entity Framework Core 10** (code-first migrations) |
| Database | **SQL Server** |
| Authentication | **JWT Bearer** tokens (HMAC-SHA256) |
| API docs | **Swagger / OpenAPI** (Swashbuckle, Development only) |
| File storage | Local disk under `wwwroot/uploads`, served as static files |

### Backend project structure

```text
Backend/Postify.Api/
├── Controllers/      # Auth, Users, Profiles, Posts, Comments
├── Data/             # PostifyContext (EF Core) and Migrations/
├── Dtos/             # Request/response records, grouped by feature
├── Enums/            # ResultStatusEnum (Success, NotFound, Forbidden)
├── Extensions/       # Authentication, CORS, Swagger and service registration
├── Interfaces/       # Service contracts
├── Models/           # EF Core entities (ApplicationUser, Profile, Post, Comment)
├── Services/         # Business logic (auth, tokens, posts, comments, profiles, files)
├── wwwroot/uploads/  # Uploaded post images and profile pictures
└── Program.cs
```

### Backend prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- SQL Server: LocalDB, Express or Developer edition
- The EF Core CLI:

  ```bash
  dotnet tool install --global dotnet-ef
  ```

### Backend configuration

The settings live in `Backend/Postify.Api/appsettings.json`:

| Key | Purpose |
|---|---|
| `ConnectionStrings:DefaultConnection` | SQL Server connection string |
| `Jwt:Issuer` | Token issuer |
| `Jwt:Audience` | Token audience |
| `Jwt:SecretKey` | Token signing key. **Leave it empty in `appsettings.json`** and set it with user secrets. |

The API refuses to start if any `Jwt` value is missing. Keep the signing key out of source control by storing it with .NET user secrets. HMAC-SHA256 needs a key of at least 32 characters.

```bash
cd Backend/Postify.Api
dotnet user-secrets set "Jwt:SecretKey" "<a random string of at least 32 characters>"
```

**CORS:** the API only accepts browser requests from `http://localhost:4200`, the Angular dev server (see `Extensions/CorsExtension.cs`). Add your production origin there when you deploy.

### Database setup

Apply the migrations to create the database:

```bash
cd Backend/Postify.Api
dotnet ef database update
```

### Running the API

```bash
cd Backend/Postify.Api
dotnet run --launch-profile https
```

| URL | |
|---|---|
| `https://localhost:7042` | HTTPS (the frontend uses this one) |
| `http://localhost:5182` | HTTP |
| `https://localhost:7042/swagger` | Swagger UI (Development only) |

`Postify.Api.http` contains ready-made requests for testing the API from VS Code or Visual Studio.

### API reference

Every endpoint requires `Authorization: Bearer <token>` except **register** and **login**. JSON uses camelCase.

| Method | Endpoint | Body | Success |
|---|---|---|---|
| `POST` | `/api/Auth/register` | JSON `{ firstName, lastName, email, userName, password }` | `201` `{ success, message, user }` |
| `POST` | `/api/Auth/login` | JSON `{ emailOrUserName, password }` | `200` `{ success, message, accessToken }` |
| `GET` | `/api/Users/me` | — | `200` `{ id, userName, email, firstName, lastName }` |
| `GET` | `/api/Profiles/me` | — | `200` `UserProfileDto` |
| `GET` | `/api/Profiles/{userId}` | — | `200` `UserProfileDto` |
| `PUT` | `/api/Profiles/me` | multipart `FirstName`, `LastName`, `Bio?`, `ProfilePicture?` | `200` `{ success, message, updatedProfile }` |
| `GET` | `/api/Posts?pageNumber&pageSize` | — | `200` `Paginated<PostDto>` |
| `GET` | `/api/Posts/me?pageNumber&pageSize` | — | `200` `Paginated<PostDto>` |
| `GET` | `/api/Posts/user/{userId}?pageNumber&pageSize` | — | `200` `Paginated<PostDto>` |
| `GET` | `/api/Posts/{postId}` | — | `200` `PostDto` |
| `POST` | `/api/Posts` | multipart `PostImage`, `Caption?` | `201` `{ success, message, post }` |
| `PUT` | `/api/Posts/{postId}` | JSON `{ caption }` | `200` `{ status, message, post }` |
| `DELETE` | `/api/Posts/{postId}` | — | `200` `{ status, message }` |
| `GET` | `/api/Posts/{postId}/Comments?pageNumber&pageSize` | — | `200` `Paginated<CommentDto>` |
| `POST` | `/api/Posts/{postId}/Comments` | JSON `{ content }` | `201` `{ success, message, comment }` |
| `GET` | `/api/Comments/{commentId}` | — | `200` `CommentDto` |
| `PUT` | `/api/Comments/{commentId}` | JSON `{ content }` | `200` `{ status, message, comment }` |
| `DELETE` | `/api/Comments/{commentId}` | — | `200` `{ status, message }` |

**Response shapes**

```text
UserProfileDto   { userId, userName, firstName, lastName, bio, profilePicturePath }
PostDto          { id, postImagePath, caption, userId, userName, firstName, lastName, profilePicturePath, createdAt }
CommentDto       { id, content, userId, userName, firstName, lastName, profilePicturePath, postId, createdAt }
Paginated<T>     { items, pageNumber, pageSize, totalCount, totalPages, hasPreviousPage, hasNextPage }
```

**Notes**

- **Ordering:** lists are sorted newest first. `pageSize` can be at most **10**; a larger value returns `400`.
- **Status values:** `status` is numeric: `200` Success, `404` NotFound, `403` Forbidden. Editing or deleting something you don't own returns `403`.
- **Error formats:** errors come back as a plain string, as a `{ status, message }` object, or, for model-validation failures, as ProblemDetails with errors keyed by field.
- **Dates:** dates are stored in UTC but serialized without a trailing `Z`, so parse them as UTC.

### Validation rules

| Field | Rule |
|---|---|
| First / last name | required, max 50 characters |
| Email | required, valid email, max 254 characters |
| Username | required, max 20 characters, stored in lowercase |
| Password (register) | required, at least 8 characters |
| Bio | max 250 characters |
| Comment | required, max 250 characters |

### Authentication

- **Token:** login returns a JWT access token valid for **60 minutes**. There's no refresh token.
- **Claims:** the token carries the user id (`NameIdentifier`), the username (`Name`) and the email.
- **Current user:** login returns only the token, so call `GET /api/Users/me` afterwards to get the user.

### Image uploads

| | Post image | Profile picture |
|---|---|---|
| Types | `.jpg`, `.jpeg`, `.png` (any letter case) | same |
| Max size | 50 MB | 5 MB |
| Stored at | `wwwroot/uploads/posts/{guid}.ext` | `wwwroot/uploads/profiles/{guid}.ext` |

- **Paths:** the API returns **relative** paths such as `/uploads/posts/abc.jpg`. Prefix them with the API's base URL.
- **Bio:** `PUT /api/Profiles/me` replaces the bio with whatever is sent, so always send `Bio`. An empty value clears it.
- **Profile picture:** it can be replaced but not removed.

---

## Frontend

An Angular single-page app for the Postify API, built from a Figma design.

### Frontend tech stack

| Concern | Technology |
|---|---|
| Framework | **Angular 22**, using standalone components only (no NgModules) |
| Language | **TypeScript 6** (strict mode) |
| State | Angular **Signals** |
| Async / HTTP | `HttpClient` with **RxJS**, functional interceptors and guards |
| Forms | Reactive Forms |
| Styling | **SCSS**, with design tokens as CSS custom properties |
| Fonts | DM Sans (body), Manrope (headings) |
| Tests | **Vitest** via `ng test` |

### Frontend project structure

```text
Frontend/src/app/
├── core/
│   ├── guards/         # authGuard, guestGuard
│   ├── interceptors/   # Adds the Bearer token, logs out on 401
│   ├── models/         # Typed API models
│   ├── services/       # Auth, posts, comments, profiles, dialog state
│   └── utils/          # PagedList, API error helper, image validation, API URLs
├── layout/             # Shell (signed-in layout) and navbar
├── shared/             # Modal, confirm dialog, action menu, avatar, icon, logo, toast, time-ago pipe
└── features/
    ├── auth/           # Login, register
    ├── feed/           # Feed and post card
    ├── post-details/   # Post page, comments, edit-comment modal
    ├── posts/          # Create / edit / delete post dialogs
    └── profile/        # Profile page, edit-profile modal
```

### Frontend prerequisites

- **Node.js** `^22.22.3`, `^24.15.0` or `>=26` (the versions Angular 22 supports)
- **npm**

### Frontend configuration

The API base URL lives in the environment files:

| File | Used by | Value |
|---|---|---|
| `src/environments/environment.development.ts` | `ng serve` | `https://localhost:7042` |
| `src/environments/environment.ts` | production build | change this to your deployed API URL |

No secrets are stored in the frontend.

### Running the app

Start the [backend](#running-the-api) first, then:

```bash
cd Frontend
npm install
npm start          # same as: ng serve
```

Open **http://localhost:4200**. That's the only origin the API's CORS policy allows. No dev proxy is used.

### Building and testing

```bash
npm run build      # production build into dist/postify
npm test           # unit tests (Vitest)
```

### Architecture notes

- **Routing:**
  - Every route is lazy-loaded with `loadComponent`.
  - Signed-in pages are children of a `Shell` layout protected by `authGuard`; `/login` and `/register` use `guestGuard`.
  - Route params bind straight to component inputs (`withComponentInputBinding`).
- **Auth:**
  - The token is stored in `localStorage`, and its `exp` claim is checked before every request.
  - An app initializer restores the session on refresh.
  - The interceptor attaches the token to API requests only, and logs the user out on `401`, except on the auth endpoints.
- **Pagination:** `PagedList<T>` (`core/utils/paged-list.ts`) holds the shared "Load more" logic. It:
  - appends pages and skips items it already has
  - ignores repeat clicks while a request is running
  - keeps loaded items if a request fails
  - adjusts the next page after local deletions so nothing is skipped
- **App-wide dialogs:** the Create, Edit and Delete Post dialogs live in the shell. `PostService` emits `postCreated$`, `postUpdated$` and `postDeleted$` events, so the feed, the profile grid and the post page update without reloading.
- **Error handling:** one helper (`getApiErrorMessage`) turns the API's different error formats into a single readable message.
- **Uploads:** images are sent as `FormData` using the API's exact field names, previewed with object URLs, and those URLs are released when no longer needed.
- **Accessibility:**
  - Labeled form fields and inline field errors.
  - Modals close with Escape, keep keyboard focus inside while open, and return focus to the button that opened them.
  - Menus can be used with the keyboard.

---

## Known limitations

- **No real-time updates:** new posts and comments from other users appear after a refresh or a "Load more".
- **Tokens:** there's no refresh token, so you need to sign in again after 60 minutes.
- **Local image storage:** images are stored on the API server's disk, not in cloud storage.
- **Out of scope:** likes, follows, direct messages and notifications aren't part of this version.
