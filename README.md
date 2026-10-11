<div align="center">

# 🎂 Cake Of The Day

### A Premium Online Cake Ordering Experience

A full-stack e-commerce platform built for an artisanal bakery, featuring custom cake ordering, dynamic pricing, secure checkout, and an administrative dashboard.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Website-000000?style=for-the-badge\&logo=vercel)](https://cakeoftheday.vercel.app/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge\&logo=github)](https://github.com/TarangGupta6446/cakeofthedayy)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge\&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge\&logo=stripe\&logoColor=white)](https://stripe.com/)

</div>

---

## 📸 Screenshots

<!-- Add your actual screenshots to docs/screenshots/ and uncomment the relevant lines below. -->

<!--
### Homepage
![Cake Of The Day Homepage](docs/screenshots/homepage.png)

### Cake Shop
![Cake Shop](docs/screenshots/shop.png)

### Custom Cake Ordering
![Custom Cake Order Form](docs/screenshots/custom-order.png)

### Shopping Cart and Checkout
![Shopping Cart and Checkout](docs/screenshots/cart-checkout.png)

### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)
-->

> **Tip:** Add screenshots of your actual website to make the repository more visually appealing. Start with the homepage, cake shop, and custom order page.

---

## 🌟 Features

### 🛒 Customer E-Commerce Experience

* **Interactive Cake Builder:** Customize cakes with available size, flavor, message, and add-on options.
* **Custom Cake Orders:** Submit personalized cake requests with inspiration image uploads.
* **Dynamic Pricing:** Update prices according to selected customization options.
* **Persistent Shopping Cart:** Maintain cart items using browser local storage.
* **Product Catalog:** Browse cakes with search, category filters, and sorting options.
* **Secure Checkout:** Integrate Stripe Checkout for payment processing.
* **User Authentication:** Support account registration, login, and authentication sessions.
* **Order Management:** Access order information and track order status.

### 🛡️ Administration and Management

* **Admin Dashboard:** Provide administrative tools for managing bakery operations.
* **Product Management:** Manage cake listings, pricing, categories, and product images.
* **Order Management:** View orders and update their status.
* **Inventory Management:** Manage product availability.
* **Role-Based Access:** Restrict administrative functionality to authorized users.
* **Database Security:** Use Supabase Row-Level Security (RLS) where configured.

### 🎨 User Interface

* Responsive layouts for mobile, tablet, and desktop.
* Modern bakery-inspired visual design.
* Reusable UI components.
* Smooth animations and interactive elements.
* Optimized navigation and shopping experience.

---

## 🛠️ Tech Stack

| Category       | Technologies            |
| -------------- | ----------------------- |
| Framework      | Next.js 15, App Router  |
| Language       | TypeScript              |
| UI Library     | React                   |
| Styling        | Tailwind CSS, shadcn/ui |
| Animations     | Framer Motion           |
| Database       | Supabase PostgreSQL     |
| Authentication | Supabase Auth           |
| File Storage   | Supabase Storage        |
| Payments       | Stripe API              |
| Deployment     | Vercel                  |

---

## 🏗️ Project Architecture

The application follows a modular architecture designed to separate page routing, reusable components, application logic, and data access.

```text
cakeofthedayy/
├── app/                  # Next.js App Router pages and routes
│   ├── (auth)/           # Authentication pages, if present
│   ├── (shop)/           # Storefront pages, if present
│   ├── admin/            # Administrative pages, if present
│   └── api/              # API routes, if present
├── components/           # Reusable React components
│   ├── ui/               # UI primitives
│   └── shop/             # Shopping-related components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and service integrations
├── types/                # Shared TypeScript definitions
├── public/               # Static assets
└── README.md             # Project documentation
```

*Note: The structure above is illustrative. Adjust it to match the actual folders and files in your repository.*

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

* Node.js compatible with the project's Next.js version.
* npm or another supported package manager.
* A Supabase project for backend features.
* Stripe developer credentials if payment functionality is enabled.

### 1. Clone the Repository

```bash
git clone https://github.com/TarangGupta6446/cakeofthedayy.git

cd cakeofthedayy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory.

Example configuration:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** These variable names are examples. Check the application source code for the exact names it expects.

Never commit `.env.local`, private API keys, database credentials, or service-role keys to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 🗄️ Database Design

The application uses Supabase PostgreSQL for data storage and management.

Depending on the implemented schema, the database may include the following entities:

| Table           | Purpose                                |
| --------------- | -------------------------------------- |
| `users`         | User profile information and roles     |
| `products`      | Cake details, prices, and availability |
| `categories`    | Product categorization                 |
| `orders`        | Customer order records                 |
| `order_items`   | Products associated with each order    |
| `custom_orders` | Personalized cake requests             |
| `addresses`     | Saved delivery addresses               |
| `reviews`       | Customer product reviews               |

Relationships, indexes, and Row-Level Security policies should be configured according to the actual database implementation.

---

## 🔐 Security Considerations

* Keep private API keys and service credentials on the server.
* Apply appropriate Supabase Row-Level Security policies.
* Validate user input on the server.
* Restrict administrative operations to authorized users.
* Verify Stripe webhook signatures before processing payment events.
* Avoid exposing sensitive customer or payment information.
* Use environment variables for deployment configuration.

---

## ☁️ Deployment

The project is deployed on Vercel.

**Live Website:** [cakeoftheday.vercel.app](https://cakeoftheday.vercel.app/)

For deployment:

1. Import the GitHub repository into Vercel.
2. Configure the required environment variables.
3. Verify Supabase authentication redirects and security policies.
4. Configure Stripe webhooks and payment credentials if applicable.
5. Deploy and test the website on desktop and mobile devices.

---

## 📷 Adding Screenshots

To display screenshots in this README:

1. Create a folder named `docs/screenshots/` in your repository.
2. Capture screenshots of your actual website.
3. Upload the images using these filenames:

```text
docs/
└── screenshots/
    ├── homepage.png
    ├── shop.png
    ├── custom-order.png
    ├── cart-checkout.png
    └── admin-dashboard.png
```

4. Uncomment the screenshot Markdown near the top of this README.
5. Commit your changes.

Use test data in screenshots of administrative pages. Never expose customer details, credentials, or payment information.

---

## 📄 License

This project is intended for the Cake Of The Day bakery website.

If you want to distribute the code under the MIT License, add a `LICENSE` file containing the appropriate MIT License text. Until then, do not assume the repository is licensed under MIT.

---

<div align="center">

**Built with ❤️ for Cake Of The Day**

[Visit Website](https://cakeoftheday.vercel.app/) · [GitHub Repository](https://github.com/TarangGupta6446/cakeofthedayy)

</div>
