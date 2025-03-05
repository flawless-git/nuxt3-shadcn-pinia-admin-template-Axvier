# Axvier - Modern Blog Platform

A modern blog platform built with Nuxt 3, Vue 3, TypeScript, Prisma, and Tailwind CSS.

## Features

- 🚀 Full-stack TypeScript application
- 🔐 User authentication and authorization
- 📝 Blog post creation and management
- 🎨 Modern UI with Shadcn Vue components
- 🌙 Dark/Light mode support
- 📱 Responsive design
- 🔍 Search functionality
- 🗄️ PostgreSQL database with Prisma ORM

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, Tailwind CSS, Shadcn Vue
- **Backend**: Nuxt Nitro server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Custom JWT authentication
- **Styling**: Tailwind CSS with Shadcn Vue components

## Project Structure

```
├── components/          # Vue components
│   ├── ui/             # Shadcn Vue components
│   └── ...             # Custom components
├── composables/        # Vue composables
├── lib/                # Utility functions and shared code
├── layouts/            # Page layouts
├── pages/             # File-based routing
├── prisma/            # Database schema and migrations
├── public/            # Static assets
├── server/            # API routes
│   └── api/           # API endpoints
├── stores/            # Pinia stores
└── types/             # TypeScript types
```

## API Routes

```
# Authentication Routes
POST    /api/auth/login         # Login user
POST    /api/auth/logout        # Logout user
GET     /api/auth/me            # Get current user

# User Routes
GET     /api/users             # Get all users
POST    /api/users             # Create user
GET     /api/users/:id         # Get user by ID
PUT     /api/users/:id         # Update user
DELETE  /api/users/:id         # Delete user

# User Avatar Routes
POST    /api/users/avatar/:userId    # Upload user avatar
DELETE  /api/users/avatar/:userId    # Delete user avatar
GET     /api/users/avatar/:userId    # Get user avatar

# Post Routes
GET     /api/posts             # Get all posts
POST    /api/posts             # Create post
GET     /api/posts/:id         # Get post by ID
PUT     /api/posts/:id         # Update post
DELETE  /api/posts/:id         # Delete post
GET     /api/posts/search      # Search posts
GET     /api/posts/published   # Get published posts
```

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/axvier"
NUXT_PUBLIC_API_BASE="http://localhost:3000"
```

## Database Setup

```bash
bun x prisma generate
bun x prisma migrate dev --name dev
bun x prisma db seed
```

## Default User

After running database seeds, you can login with these credentials:

```bash
# Admin User
Username: admin
Password: admin123

# Regular User
Username: user
Password: user123
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) for more information on Nuxt features and API.
