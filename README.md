# SpaceManager API (Backend)

A RESTful API built with **NestJS**, **Prisma ORM**, and **PostgreSQL** to manage space rentals, booking logic, and authentication.

## 🛠 Prerequisites
- Node.js & npm
- PostgreSQL database (Local or Cloud)

## 🚀 How to Run (on your machine)

```bash
npm install

# Create a .env file in the root of the server folder
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/space_db?schema=public"
JWT_SECRET="your_secure_secret_key"

# Setup database
npx prisma migrate dev --name init
npx prisma studio  ( you will gave to populate the database yourself )

# Start server
npm run start:dev
