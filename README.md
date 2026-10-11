# 🎂 Cake Of The Day — E-Commerce Platform

A production-ready, full-stack e-commerce solution engineered for an artisanal bakery. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **Stripe**, featuring dynamic custom cake ordering, real-time inventory management, responsive animations, and an executive administration dashboard.

[![Live Demo](https://img.shields.io/badge/Live_Demo-cakeoftheday.vercel.app-000000?style=for-the-badge&logo=vercel)](https://cakeoftheday.vercel.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

---

## 🌟 Key Features

### 🛒 Customer E-Commerce Experience
* **Interactive Cake Builder:** Dynamic pricing updates based on size, flavor selections, custom messages, and add-ons.
* **Custom Order Request System:** Streamlined intake form supporting inspiration photo file streams directly to cloud storage.
* **Persistent Shopping Cart:** Local-storage backed reactive shopping cart with real-time tax, delivery, and promo code calculations.
* **Product Catalog & Search:** High-performance grid layout with instant filtering, category switching, and price/popularity sorting.
* **Seamless Checkout:** Fully integrated Stripe Checkout with webhook handlers for asynchronous transaction verification.

### 🛡️ Admin & Operational Architecture
* **Role-Based Control Panel:** Protected admin routes utilizing Supabase Row-Level Security (RLS).
* **Inventory & Order Management:** Real-time mutation of cake products, category tagging, and order status tracking.
* **User Accounts:** Auth session management with order history tracking, saved delivery addresses, and user profiles.

---

## 🛠️ Tech Stack & Architecture

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript (Strictly Typed)
* **Styling & UI:** Tailwind CSS, ShadCN UI, Framer Motion
* **Database & Auth:** Supabase PostgreSQL, Supabase Auth, Row-Level Security (RLS)
* **Storage Bucket:** Supabase Storage (Cake Inspiration & Product Asset Stream)
* **Payments:** Stripe API & Webhooks
* **Deployment & Edge:** Vercel, Cloudflare CDN Compatible

---

## 📂 Project Structure

```text
cakeoftheday/
├── app/                  # Next.js App Router Pages & API Routes
│   ├── (auth)/           # Login, Signup, Password Recovery
│   ├── (shop)/           # Shop, Product Detail Pages, Custom Orders
│   ├── admin/            # Role-Protected Management Dashboard
│   └── api/              # Stripe Webhooks & Server Actions
├── components/           # Reusable UI Components & Motion Controls
│   ├── ui/               # ShadCN Primitives (Buttons, Dialogs, Cards)
│   └── shop/             # Product Cards, Cart Drawer, Cake Customizer
├── hooks/                # Custom React Hooks (useCart, useAuth)
├── lib/                  # Utilities, Supabase Client, Stripe Integration
├── types/                # Database & TypeScript Interface Definitions
└── public/               # Static Brand Assets & Media
🚀 Getting Started
Prerequisites
Node.js: v18.0.0 or higher

npm or pnpm

Supabase Account & Stripe Developer Account

1. Clone the Repository
Bash
git clone [https://github.com/TarangGupta6446/cakeofthedayy.git](https://github.com/TarangGupta6446/cakeofthedayy.git)
cd cakeofthedayy
2. Install Dependencies
Bash
npm install
3. Configure Environment Variables
Create a .env.local file in the project root:

Code snippet
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=[https://your-supabase-project.supabase.co](https://your-supabase-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Stripe Payment Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
4. Run Development Server
Bash
npm run dev
Open http://localhost:3000 in your browser to view the application.

📊 Database Schema (Supabase PostgreSQL)
The backend utilizes PostgreSQL with Row-Level Security policies covering:

users — Extends Supabase auth.users with profile roles.

products — Cake inventory, pricing tiers, and assets.

categories — Product taxonomies.

orders & order_items — Relational transaction logs with Stripe payment IDs.

custom_orders — Bespoke order specifications and upload URLs.

📜 License
Distributed under the MIT License. See LICENSE for more information.
