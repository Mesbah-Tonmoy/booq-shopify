# Booq Shopify App

Booq is a booking management system for Shopify stores, allowing merchants to manage services, staff, locations, and schedules seamlessly within their Shopify Admin.

## Features

- **Service Management**: Create and configure regular, full-day, or multi-day services.
- **Staff & Locations**: Assign staff to specific locations and manage their availability.
- **Slot Configuration**: Flexible slot timing and capacity management.
- **Customizable Notifications**: Configure customer and owner notification settings with JSON-based templates.
- **App Extension**: Integrated star rating and review blocks for storefronts.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v20.19.0 or higher)
- [npm](https://www.npmjs.com/)
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli/installation)
- A Shopify Partner account and a development store.
- MySQL database server.

## Getting Started

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Mesbah-Tonmoy/booq-shopify.git
cd booq-shopify
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Configuration

You need to set up the Shopify app configuration:

- Run `npm run config:link` to connect with your existing app or to create a new one.
- After running the command, a `.toml` file (e.g., `shopify.app.toml`) will be generated.
- Keep the generated `client_id`, `name`, and `handle` from that file.
- Replace the rest of the generated code with the content from `shopify.app.toml.example`.

### 4. Database Setup

This project uses **Prisma** with **MySQL**.

- Ensure your MySQL server is running and you have a database named `booq` (or as per your preference).
- Create a `.env` file in the root directory and add your database URL:
  ```env
  DATABASE_URL="mysql://root:password@localhost:3306/booq"
  ```
  *(Replace `root`, `password`, and `booq` with your actual MySQL credentials)*

- After adding the `DATABASE_URL` to your `.env` file, ensure your `prisma/schema.prisma` file is using the environment variable for the datasource:
  ```prisma
  datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
  }
  ```

- Generate Prisma client and run migrations:
  ```bash
  npx prisma generate
  npx prisma migrate dev --name init
  ```

### 5. Running the App

Start the development server:

```bash
npm run dev
```

This command will:
1. Connect your local project to your Shopify Partner account.
2. Create a tunnel for your local server.
3. Update your app's URLs in the Partner Dashboard.
4. Allow you to install the app on your development store.

## Build and Deploy

To build the app for production:

```bash
npm run build
```

To deploy the app to Shopify:

```bash
npm run deploy
```

## Folder Structure

- `/app`: Main Remix application code.
- `/app/components`: Reusable UI components.
- `/app/routes`: Application routes and API endpoints.
- `/extensions`: Shopify App Extensions (Theme blocks, etc.).
- `/prisma`: Database schema and migrations.

## License

This project is private and intended for use by the owner.
