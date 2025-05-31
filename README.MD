# Property Listing System - Backend

## Overview

This backend service provides functionality for managing real estate property listings, supporting full CRUD operations, advanced filtering, user authentication, favorites management, and caching for optimal performance.

---
## 🌐 Live Deployment

✅ Deployed on **Render**  
🔗 **Live URL:**  
[https://property-listing-manager.onrender.com](https://property-listing-manager.onrender.com)

> 📌 **Base Path:** `/property-listing-system`  
> Example public endpoint:  
> [https://property-listing-manager.onrender.com/property-listing-system/property](https://property-listing-manager.onrender.com/property-listing-system/property)

---


## Features

### ✅ Property Management

* Import initial property data from CSV
* Full CRUD operations
* Ownership enforcement: only creators can update/delete their properties

### ⚖️ Advanced Filtering

* Query properties using more than 10 fields (e.g., location, price, bedrooms, etc.)
* Flexible filtering using query parameters

### 🔑 User Authentication

* Register/login via email and password
* Passwords hashed using bcrypt
* JWT-based authentication for protected routes

### ⭐ Favorites System

* Users can favorite/unfavorite properties
* Supports add/remove/list for user-specific favorites
* Only custom `id` field (e.g., `PROP100`) is stored and used

### 🌎 Caching with Redis

* Optimizes heavy read operations
* Reduces DB load for frequent queries (e.g., filtered listings)

### 🚀 Optional: Deployable to any Node.js compatible environment

---

## Tech Stack

* **Language:** TypeScript / Node.js
* **Database:** MongoDB
* **Cache:** Redis
* **Frameworks:** Express, Mongoose
* **Validation:** Joi
* **Security:** JWT, bcrypt

---

## Getting Started

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd propertylistingsystem
npm install
```

### 2. Environment Configuration

Create a `.env` file:

```env
APP_NAME=property-listing-system
PORT=3000
MONGO_DB_URL=mongodb://localhost:27017/property-listing
MONGO_DB_NAME=hypergro
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379

⚠️ Redis Setup Locally
If you want to use Redis caching locally, you must have Redis installed and running on your machine.
Install guide: https://redis.io/docs/getting-started/

If Redis is not available, caching is automatically disabled and the app works without it.
```

### 3. Run the Server

```bash
npm run dev     # For development (uses ts-node-dev)
npm start       # For production (after build)
```

---

## CSV Import

To import property dataset into MongoDB:

1. Download CSV:
   [CSV Link](https://cdn2.gro.care/db424fd9fb74_1748258398689.csv)

2. Use a custom script or MongoDB import tool:

```bash
mongoimport --uri <MONGODB_URI> --collection properties --type csv --headerline --file properties.csv
```

---

## API Overview

 . Base path for all routes: /property-listing-system (APP_NAME)

### Auth

* `POST /auth/register` - Register a new user
* `POST /auth/login` - Login and receive token

### Property

* `POST /properties` - Create (auth required)
* `GET /properties` - List with filters
* `GET /properties/:id` - Single property
* `PUT /properties/:id` - Update (only owner)
* `DELETE /properties/:id` - Delete (only owner)

### Favorites

* `POST /favorites/:propertyId` - Add to favorites
* `DELETE /favorites/:propertyId` - Remove from favorites
* `GET /favorites` - List user favorites
  
  🔐 Protected routes require JWT in the Authorization header:
      Authorization: Bearer <your_token>

---

## Developer Notes

### Scripts

```json
"scripts": {
  "start": "node dist/index.js",
  "dev": "ts-node-dev --respawn src/index.ts"
}
```

### Debugging

Configured via `launch.json` to run TypeScript with `ts-node/register` in VS Code.



## Author

**Raviteja**

---

## License

This project is licensed under the ISC License.

---

## TODO (Optional Enhancements)

* Add pagination for property listings
* Enable property image uploads (e.g., with AWS S3 or Cloudinary)
* Add deployment scripts (e.g., for Heroku, Render)
* Use rate limiting and helmet for improved security
