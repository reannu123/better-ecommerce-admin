# Better Ecommerce Admin

Admin dashboard for managing ecommerce stores, billboards, categories, products,
variants, orders, and sales metrics.

## Screenshots

![Dashboard](docs/screenshots/dashboard.png)
![Products](docs/screenshots/products.png)
![Orders](docs/screenshots/orders.png)

## Stack

- Next.js 14 App Router, React 18, and TypeScript
- Tailwind CSS and shadcn/ui components
- Clerk authentication
- Prisma ORM with MySQL
- Cloudinary image uploads
- PayMongo checkout integration
- Docker and Docker Compose for local development

## Prerequisites

- Docker with Docker Compose
- A Clerk development application
- Optional: Cloudinary account for image uploads
- Optional: PayMongo test account for checkout

## Clerk Setup

Clerk is required because stores are owned by Clerk user IDs and all dashboard
routes are protected.

1. Create a development application in the Clerk dashboard.
2. Open **API Keys** and copy the publishable and secret keys.
3. Put them in `.env` as `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and
   `CLERK_SECRET_KEY`.
4. Keep the included `/sign-in` and `/sign-up` URLs. Clerk development
   instances support localhost.

## Run With Docker

```bash
cp .env.example .env
```

Fill in the two required Clerk keys, then run:

```bash
docker compose up --build
```

If Docker reports permission denied for `/var/run/docker.sock`, add your user to
the Docker group, then log out and back in:

```bash
sudo usermod -aG docker "$USER"
```

Open <http://localhost:3000>. Sign up or sign in, then create your first store
when prompted.

The Compose stack starts:

- Admin app: <http://localhost:3000>
- MySQL: `localhost:3306`

Prisma migrations run automatically when the app container starts.

Stop the stack with:

```bash
docker compose down
```

To also remove local database data:

```bash
docker compose down -v
```

## Optional Demo Data

The app does not require seed data; after signing in, it can create an empty
store through the UI. For a populated local dashboard:

1. Sign in and create a store.
2. Run:

```bash
docker compose run --rm app npm run db:seed
```

The seed uses the first existing store by default. Set `SEED_CLERK_USER_ID` to
target a specific user's store. It is idempotent and creates demo catalog data
plus six months of paid orders for the revenue graph.

## Run Without the App Container

Use Node.js 20. Start only MySQL with Docker:

```bash
cp .env.example .env
docker compose up -d db
npm ci
npm run db:generate
npm run db:deploy
npm run dev
```

Open <http://localhost:3000>.

## Environment Variables

Required:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser key |
| `CLERK_SECRET_KEY` | Clerk server key |
| `DATABASE_URL` | MySQL connection used outside Compose |

Optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset |
| `PAYMONGO_SECRET_KEY` | PayMongo test secret key |
| `PAYMENT_REDIRECT_SUCCESS` | Successful checkout redirect |
| `PAYMENT_REDIRECT_CANCELED` | Canceled checkout redirect |
| `SEED_CLERK_USER_ID` | Owner of optional demo data |

See `.env.example` for the complete local configuration.

## Database Commands

```bash
npm run db:generate
npm run db:migrate -- --name migration_name
npm run db:deploy
npm run db:seed
npm run db:studio
```

## Known Limitations

- Clerk keys are required even for local development.
- Image upload is disabled until Cloudinary is configured. Products and
  billboards can still be created without images for local development.
- Checkout is unavailable until PayMongo is configured.
- The PayMongo webhook endpoint does not yet verify webhook signatures.
