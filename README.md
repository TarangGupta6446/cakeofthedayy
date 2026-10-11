# Cake Of The Day Collective

You are a senior full-stack engineer and UI/UX designer.

Build a COMPLETE production-ready cake business website with modern UI, strong security, mobile responsiveness, SEO optimization, and scalable architecture.

Tech Stack Requirements:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Framer Motion animations
- Supabase (database, authentication, storage)
- Stripe payment integration
- Vercel deployment ready
- Cloudflare-friendly
- Responsive design for mobile/tablet/desktop

Project Goal:
Create a premium modern cake shop website for a real business that customers can publicly access online to browse cakes, place orders, and contact the bakery.

The website must look professional, luxurious, modern, clean, and conversion-focused.

==================================================
CORE WEBSITE FEATURES
==================================================

1. Home Page
- Stunning hero section with premium cake visuals
- Animated CTA buttons
- Featured cakes section
- Best sellers carousel
- Testimonials
- Why choose us section
- Instagram gallery
- Newsletter signup
- Smooth scroll animations
- Mobile optimized

2. Cake Shop Page
- Grid layout of cakes
- Category filters
- Search functionality
- Sort by price/popularity
- Cake cards with:
  - image
  - name
  - description
  - price
  - rating
  - add to cart button

3. Cake Detail Page
- Multiple product images
- Image zoom
- Flavor options
- Size selector
- Quantity selector
- Custom message input
- Add-ons selection
- Dynamic pricing
- Add to cart
- Related products

4. Custom Cake Order Page
- Form for custom cake requests
- Upload inspiration image
- Event date picker
- Cake size selection
- Flavor selection
- Notes textarea
- Contact details
- Form validation
- Store data in Supabase

5. Shopping Cart
- Update quantity
- Remove items
- Promo code support
- Dynamic total calculation
- Persistent cart using local storage

6. Checkout System
- Stripe payment integration
- Shipping details
- Order summary
- Secure checkout flow
- Success and cancel pages

7. Authentication
- Supabase Auth
- Sign up
- Login
- Forgot password
- Protected admin routes

8. User Dashboard
- Order history
- Saved addresses
- Profile management

9. Admin Dashboard
- Secure admin login
- Manage products
- Manage orders
- Update order status
- Upload cake images
- Dashboard analytics cards

==================================================
DESIGN REQUIREMENTS
==================================================

Design Style:
- Elegant bakery aesthetic
- Soft pastel color palette
- Luxury dessert branding
- Rounded cards
- Glassmorphism where appropriate
- Beautiful typography
- Smooth animations
- High-end premium look

Use:
- Poppins font
- Playfair Display headings

UI Requirements:
- Fully responsive
- Smooth page transitions
- Loading skeletons
- Hover effects
- Accessible components
- Dark mode support

==================================================
SECURITY REQUIREMENTS
==================================================

Implement:
- Environment variable protection
- Secure API routes
- Input validation
- Rate limiting
- XSS protection
- CSRF protection
- SQL injection prevention
- Secure authentication
- Role-based admin access
- HTTPS-ready deployment
- Secure Stripe webhook handling

Never expose:
- API keys
- secrets
- database credentials

==================================================
SEO REQUIREMENTS
==================================================

Implement:
- Metadata for every page
- Open Graph tags
- Twitter cards
- Sitemap
- Robots.txt
- Schema markup for products
- Fast loading optimization
- Optimized images
- Lazy loading

==================================================
PERFORMANCE REQUIREMENTS
==================================================

Optimize:
- Lighthouse score
- Image optimization
- Code splitting
- Server-side rendering
- Static rendering where appropriate
- Fast page loads
- CDN-friendly assets

==================================================
DATABASE REQUIREMENTS
==================================================

Use Supabase PostgreSQL.

Create schema for:
- users
- products
- categories
- orders
- order_items
- reviews
- custom_orders
- addresses

Include:
- relationships
- indexes
- secure policies
- row level security

==================================================
PROJECT STRUCTURE
==================================================

Generate:
- Clean scalable architecture
- Reusable components
- Modular codebase
- Proper folder structure
- Type-safe APIs
- Custom hooks
- Utility functions

Use App Router structure:
- app/
- components/
- lib/
- hooks/
- actions/
- types/
- public/

==================================================
DELIVERABLES
==================================================

Generate:
1. Complete frontend
2. Backend integration
3. Supabase schema
4. Stripe integration
5. Authentication flow
6. Admin dashboard
7. Responsive layouts
8. Deployment instructions
9. Environment variables example
10. README documentation

==================================================
IMPORTANT
==================================================

- Write production-quality code only
- Use best practices
- Keep code scalable and maintainable
- Use modern UI/UX principles
- Add comments where necessary
- Avoid placeholder-quality design
- Make the website feel like a premium real-world bakery brand

Build everything step-by-step with complete code.

the buisness name is Cake Of The Day its a small local buisness so not much traffic need u to make to website reactive here is the logo

make the website modern with reactive components

**Live app**: https://cakeofthedayy.lovable.app

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
