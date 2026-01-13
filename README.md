# 🛒 QuickBasket - E-commerce Platform

A modern, full-stack e-commerce application built with Next.js 15, MongoDB, and Stripe.

![Next.js](https://img.shields.io/badge/Next.js-15.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF)

## ✨ Features

- **🔐 Authentication** - Custom JWT-based auth with role-based access (User/Staff)
- **🛍️ Product Catalog** - Browse products with advanced search and filtering
- **🔍 Smart Search** - Full-text search with category, price, rating filters
- **🛒 Shopping Cart** - Persistent cart with real-time updates
- **💳 Stripe Payments** - Secure checkout with Stripe integration
- **📦 Order Management** - Track orders and order history
- **📱 Fully Responsive** - Mobile-first design that works on all devices
- **🎨 Modern UI** - Beautiful interface with Tailwind CSS

## 🚀 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB with Prisma ORM
- **Authentication:** JWT with httpOnly cookies
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, Lucide Icons

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (or local MongoDB)
- Stripe account for payments

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quickbasket.git
   cd quickbasket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your values:
   - `DATABASE_URL` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string (32+ characters)
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
   - `NEXT_PUBLIC_APP_URL` - Your app URL (for Stripe redirects)

4. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub

2. Import project in [Vercel](https://vercel.com/new)

3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel deployment URL)

4. Deploy!

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
quickbasket/
├── prisma/
│   └── schema.prisma      # Database schema
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── _components/   # Shared components
│   │   ├── _context/      # React contexts
│   │   ├── (auth)/        # Auth pages
│   │   ├── cart/          # Cart page
│   │   ├── checkout/      # Checkout & success pages
│   │   ├── orders/        # Order history
│   │   ├── product-info/  # Product details
│   │   └── search/        # Search page
│   ├── components/ui/     # UI components
│   ├── db/                # Database client
│   ├── lib/               # Utilities
│   └── services/          # Business logic
├── public/                # Static assets
└── generated/             # Prisma client (gitignored)
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB connection string | ✅ |
| `JWT_SECRET` | Secret for JWT signing (32+ chars) | ✅ |
| `STRIPE_SECRET_KEY` | Stripe secret API key | ✅ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | ✅ |
| `NEXT_PUBLIC_APP_URL` | App URL for redirects | ✅ |
| `NODE_ENV` | Environment (development/production) | Optional |

## 🔒 Security Notes

- Never commit `.env` files
- Use strong, unique `JWT_SECRET` in production
- Use Stripe's live keys only in production
- All API routes are protected with authentication middleware
- Passwords are hashed with bcrypt

## 📝 API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sign-up` | User registration |
| POST | `/api/login` | User login |
| GET | `/api/product` | Get all products |
| GET | `/api/product/[id]` | Get product by ID |
| GET | `/api/search` | Search products |
| GET/POST | `/api/cart` | Get/Add cart items |
| DELETE | `/api/cart/delete` | Remove cart item |
| POST | `/api/payment/create-checkout-session` | Create Stripe session |
| POST | `/api/payment/verify` | Verify payment |
| GET | `/api/orders` | Get user orders |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Next.js and deployed on Vercel
