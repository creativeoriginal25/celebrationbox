# Celebration Box 🎉

> **Make Every Moment Special.**  
> Curated DIY Party & Celebration Kits founded by students in Bhimavaram, Andhra Pradesh, India.

---

## 🌟 Overview

**Celebration Box** is an emerging D2C brand making celebration styling effortless, aesthetic, and accessible for college students, hostels, and bedrooms. Instead of hunting through multiple local shops for mismatched supplies, customers get an all-in-one celebration kit packed with coordinated balloons, banners, candles, glue dots, arch strips, and beginner-friendly DIY instructions.

This repository contains the complete, production-quality, responsive MVP with an integrated **WhatsApp click-to-chat order flow**.

---

## 🎨 Brand Identity & Design System

- **Primary Pink**: `#E91E63` (Main CTAs, price highlights, energy)
- **Marigold Yellow**: `#FFB400` (Festive accents, badges, highlights)
- **Teal**: `#00A8A8` (Secondary accents, checks, details)
- **Dark Ink**: `#2B2B3A` (Headings, primary typography)
- **Warm Off-White**: `#FFF8F0` (Base background)
- **White**: `#FFFFFF` (Glass cards, elevated containers)

### Glassmorphism System
The interface uses frosted glass surfaces (`backdrop-blur-md`, `bg-white/80`, `border-white/80`, `shadow-glass`) combined with ambient pastel lighting orbs to achieve a modern, youthful yet premium aesthetic.

---

## 📦 Product Catalogue

Initially launches with **two approved products** in the **Pastel Pop** theme (peach, lilac, and cream):

1. **Mini Celebration Box — ₹249**
   - 12 latex balloons (4 Peach, 4 Lilac, 4 Cream)
   - 1 Happy Birthday banner
   - 1 Six-piece cake candle pack
   - 1 Metre balloon arch strip
   - 10 Balloon glue dots
   - 2 Metres curling ribbon
   - 1 DIY decoration instruction card
   - 1 Branded package sticker
   - *Note: Balloon pump, cake, and helium are not included.*

2. **Signature Celebration Box — ₹499**
   - 20 latex balloons (Pastel Pop coordinated)
   - 1 Happy Birthday banner
   - 1 Six-foot shimmer foil backdrop curtain
   - 1 18-inch metallic Happy Birthday foil balloon
   - 2 Metres balloon arch strip
   - 20 Balloon glue dots
   - 6 Themed photo booth props
   - 1 Manual balloon hand pump
   - 1 Six-piece cake candle pack
   - 3 Metres curling ribbon
   - 1 DIY instruction card
   - 1 Branded package sticker
   - *Note: Cake, helium, and professional decoration service are not included.*

---

## 📱 WhatsApp Ordering Integration

When a customer configures their kit and clicks **Send Order on WhatsApp**:
1. Form inputs are thoroughly validated (name, valid 10-digit Indian mobile, future celebration date, Bhimavaram address if delivery).
2. The subtotal is calculated in real time based on quantity and product.
3. Fulfillment notes are attached:
   - *College Pickup*: Free campus handover in Bhimavaram.
   - *Nearby Delivery*: Delivery charges confirmed transparently via WhatsApp.
4. An official click-to-chat link (`https://wa.me/{number}?text={encodedText}`) is generated.
5. If the number is not yet configured or popup is blocked, a **Copy Message Fallback** appears allowing the customer to copy the formatted text with one click.
6. The business owner can confirm stock, provide UPI QR details, and update the order manually.

---

## ⚙️ How to Configure the WhatsApp Number

1. Open `.env` (or copy `.env.example` to `.env`):
   ```env
   VITE_WHATSAPP_NUMBER=919876543210
   VITE_BUSINESS_NAME="Celebration Box"
   VITE_INSTAGRAM_URL="https://instagram.com/celebrationbox.in"
   VITE_CONTACT_EMAIL="hello@celebrationbox.in"
   VITE_CAMPUS_LOCATION="Bhimavaram, Andhra Pradesh"
   ```
2. Enter the 10-digit Indian mobile number prefixed with country code `91` (no `+`, dashes, or spaces).
3. If left as `91XXXXXXXXXX`, the website automatically flags the placeholder status and enables copy fallback mode with a live test input.

---

## 🖼️ How to Update Products & Replace Images

- **Product Configuration**: Modify `src/config/products.ts` to adjust prices, descriptions, inclusions, or add upcoming themes.
- **Product Images**: Place new PNG, SVG, or WebP files in `public/products/` and reference their file paths in `src/config/products.ts`.
- **Brand Logo**: The logo is located at `public/brand/logo.webp`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation & Running Locally
```bash
# 1. Clone repository or open project folder
cd "Celebration Box"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser (typically http://localhost:5173)
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
Celebration Box/
├── public/
│   ├── brand/
│   │   └── logo.webp              # Supplied brand logo asset
│   └── products/
│       ├── mini-box.svg           # Mini Celebration Box visual (₹249)
│       └── signature-box.svg      # Signature Celebration Box visual (₹499)
├── src/
│   ├── config/
│   │   ├── business.ts            # Business info, contact, & owner response templates
│   │   └── products.ts            # Admin-friendly product catalogue & themes
│   ├── services/
│   │   ├── orderService.ts        # Order draft calculation & history management
│   │   └── whatsappService.ts     # wa.me link generation & URL encoder
│   ├── utils/
│   │   ├── currency.ts            # INR currency formatting (₹)
│   │   └── validation.ts          # Phone, date, and form validation logic
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── components/
│   │   ├── Header.tsx             # Navbar with logo, links, & mobile menu
│   │   ├── Hero.tsx               # Hero showcase with glass cards & CTAs
│   │   ├── ProductCard.tsx        # High-res product cards (Mini & Signature)
│   │   ├── ProductModal.tsx       # Full inclusions & exclusions detail modal
│   │   ├── ProductComparison.tsx  # Side-by-side feature matrix
│   │   ├── HowItWorks.tsx         # 3-step DIY process
│   │   ├── WhyChooseUs.tsx        # 5 core brand differentiators
│   │   ├── FAQ.tsx                # Honest answers to 8 key customer questions
│   │   ├── AboutUs.tsx            # Student founder story & Bhimavaram vision
│   │   ├── OrderCustomizerModal.tsx # Live customizer, subtotal, & WhatsApp trigger
│   │   ├── WhatsAppFallbackModal.tsx # Copy-to-clipboard fallback & test helper
│   │   ├── AdminTemplatesModal.tsx   # 5 WhatsApp reply templates for founders
│   │   ├── PolicyModal.tsx        # Terms, Privacy, & Cancellation policies
│   │   └── Footer.tsx             # Configurable footer with quick navigation
│   ├── pages/
│   │   └── Home.tsx               # Primary page orchestrator
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                  # Tailwind styles & glassmorphism system
├── .env.example
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚢 Deployment

The project can be deployed seamlessly to **Vercel**, **Netlify**, or **Cloudflare Pages**:
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Environment variables**: Add `VITE_WHATSAPP_NUMBER` in the hosting dashboard.

