# Jaan Group — Ration Distribution App

A transparent, full-stack web application for **Jaan Group Karachi** to manage Zakat, Fitra, and Sadaqah donations and distribute ration packages to deserving families with verified proof.

## Features

- **Donor Portal**: Register, donate funds, select ration items (flour, dal, ghee, rice, etc.)
- **Ration Packages**: Pre-built packages (Basic, Standard, Ramadan Special) or custom item selection
- **Distribution Tracking**: Donors see photo proof, voice dua recordings, and item lists for each delivery
- **Admin Panel**: Add/verify beneficiaries, assign donations, upload distribution proof
- **AI Chatbot**: OpenAI-powered assistant answers donor queries about their donations
- **Vector Search**: Qdrant-based semantic search for beneficiaries
- **Google Sheets Sync**: All records auto-backed up for transparency
- **Hugging Face**: Text embeddings for beneficiary similarity search

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Backend | Next.js API Routes (serverless) |
| Chatbot | OpenAI API (gpt-4o-mini) |
| Vector DB | Qdrant (free tier) |
| Embeddings | Hugging Face Inference API |
| Sheets | Google Sheets API |
| Storage | Local uploads (dev) / S3 or Firebase (prod) |
| Deployment | Vercel |

## Folder Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with Header, Footer, ChatBot
│   ├── page.tsx                # Home / landing page
│   ├── globals.css             # Tailwind + custom styles
│   ├── donate/page.tsx         # Donation form with ration selector
│   ├── track/page.tsx          # Distribution tracking for donors
│   ├── login/page.tsx          # Donor login
│   ├── register/page.tsx       # Donor registration
│   ├── admin/
│   │   ├── page.tsx            # Admin dashboard
│   │   ├── beneficiaries/page.tsx  # Manage beneficiaries
│   │   └── distributions/page.tsx  # Manage distributions + proof upload
│   └── api/
│       ├── donors/route.ts     # Donor CRUD
│       ├── donations/route.ts  # Donation CRUD
│       ├── beneficiaries/route.ts  # Beneficiary CRUD
│       ├── distributions/
│       │   ├── route.ts        # Distribution list + create
│       │   └── [id]/route.ts   # Update single distribution
│       ├── chatbot/route.ts    # OpenAI chat endpoint
│       ├── upload/route.ts     # File upload (image/audio)
│       └── sheets/route.ts     # Google Sheets read/init
├── components/
│   ├── Header.tsx              # Navigation bar
│   ├── Footer.tsx              # Site footer
│   ├── ChatBot.tsx             # Floating AI chatbot widget
│   ├── DonationForm.tsx        # Full donation form
│   ├── RationSelector.tsx      # Item/package picker
│   ├── DistributionCard.tsx    # Distribution proof card
│   ├── BeneficiaryForm.tsx     # Add beneficiary form
│   └── ProofUploader.tsx       # Image/audio proof upload
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   ├── store.ts                # In-memory data store (dev)
│   ├── openai.ts               # OpenAI integration
│   ├── qdrant.ts               # Qdrant vector DB integration
│   ├── huggingface.ts          # HF embeddings
│   ├── sheets.ts               # Google Sheets API
│   └── storage.ts              # File storage utility
└── data/
    └── ration-items.ts         # Ration items + packages catalog
```

## Quick Start

### 1. Install dependencies

```bash
cd ration_distribution_app
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | For chatbot | Your OpenAI API key |
| `QDRANT_URL` | For vector search | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | For vector search | Qdrant API key |
| `HUGGINGFACE_API_KEY` | For embeddings | Hugging Face token |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | For Sheets | Google service account email |
| `GOOGLE_PRIVATE_KEY` | For Sheets | Service account private key |
| `GOOGLE_SHEET_ID` | For Sheets | Target Google Sheet ID |

> **Note**: The app runs without any API keys — the chatbot shows a fallback message, and Sheets sync silently skips. You can add integrations incrementally.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Integration Setup

### OpenAI Chatbot

1. Get an API key from [platform.openai.com](https://platform.openai.com)
2. Set `OPENAI_API_KEY` in `.env.local`
3. The chatbot uses `gpt-4o-mini` by default (cost-effective). Change to `gpt-4o` in `src/lib/openai.ts` if needed.

### Qdrant Vector Search

1. Create a free cluster at [cloud.qdrant.io](https://cloud.qdrant.io)
2. Set `QDRANT_URL` and `QDRANT_API_KEY` in `.env.local`
3. The collection is auto-created on first use (384-dim vectors, Cosine distance)

### Hugging Face Embeddings

1. Get a token from [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Set `HUGGINGFACE_API_KEY` in `.env.local`
3. Uses `sentence-transformers/all-MiniLM-L6-v2` for 384-dim embeddings

### Google Sheets Backup

1. Create a Google Cloud project and enable the Sheets API
2. Create a service account and download the JSON key
3. Create a Google Sheet with tabs: `Donors`, `Donations`, `Beneficiaries`, `Distributions`
4. Share the sheet with the service account email (Editor access)
5. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, and `GOOGLE_SHEET_ID`
6. Call `POST /api/sheets` once to initialize headers

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Jaan Group Ration Distribution App"
git remote add origin https://github.com/your-username/jaan-group-ration-app.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Add all environment variables from `.env.local` to Vercel's Environment Variables settings
3. Deploy — Vercel auto-detects Next.js

### 3. Production considerations

- **Storage**: Replace local file uploads with S3, Firebase Storage, or Cloudinary. Update `src/lib/storage.ts`.
- **Database**: Replace the in-memory store (`src/lib/store.ts`) with PostgreSQL (via Prisma), MongoDB, or Supabase.
- **Authentication**: Add NextAuth.js for proper donor/admin authentication with sessions and roles.
- **File uploads on Vercel**: Vercel's serverless functions have a read-only filesystem. Use an external storage service for uploads.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donors` | List all donors |
| POST | `/api/donors` | Register a donor |
| GET | `/api/donations` | List donations (optional `?donorId=`) |
| POST | `/api/donations` | Create a donation |
| GET | `/api/beneficiaries` | List beneficiaries |
| POST | `/api/beneficiaries` | Add a beneficiary |
| GET | `/api/distributions` | List distributions (optional `?donationId=`) |
| POST | `/api/distributions` | Create a distribution |
| GET | `/api/distributions/[id]` | Get single distribution |
| PATCH | `/api/distributions/[id]` | Update status/proof |
| POST | `/api/chatbot` | Chat with AI assistant |
| POST | `/api/upload` | Upload image/audio file |
| GET | `/api/sheets?tab=Donors` | Read Google Sheet tab |
| POST | `/api/sheets` | Initialize sheet headers |

## License

Built for Jaan Group Karachi. Open for community use.
