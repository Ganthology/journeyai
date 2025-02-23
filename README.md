# JourneyAI - AI-Powered Personal Growth Assistant

## 🎥 Demo Video

[Watch Demo Video](your-video-link) - A 2-minute demonstration of JourneyAI's key features.

## 🌟 Project Overview

### Problem

People struggle to maintain consistent self-reflection and ideation practices, often lacking structured guidance and accountability in their personal growth journey.

### Solution

JourneyAI is an AI-powered conversational assistant that helps users:

- Conduct guided daily reflections focusing on gratitude, tensions, and wins
- Facilitate structured ideation sessions with actionable outcomes
- Track personal growth through organized notes
- Convert conversations into actionable insights and todos

## 👥 Team

- **Ray Gan**
  - Role: Dev + Product + Idea
  - Contributions:
    - Ideation
    - Architecture & System Design
    - Frontend Development (Next.js, React)
    - Backend Integration (Prisma, PostgreSQL)
    - ElevenLabs AI Integration

## 🛠 Technical Details

### Tech Stack

- **Frontend**

  - Next.js 14 (App Router)
  - React & React Query
  - TypeScript
  - TailwindCSS & shadcn/ui

- **Backend & Database**
  - PostgreSQL (hosted on Supabase)
  - Prisma ORM
  - ElevenLabs ConvAI API
  - Clerk Authentication

### Key Features

1. **Intelligent Conversations**

   - Two specialized AI agents:
     - Reflection Agent: Guides daily reflections
     - Ideation Agent: Facilitates brainstorming sessions
   - Real-time voice interactions
   - Natural conversation flow

2. **Smart Note Organization**

   - **Reflection Notes**

     - Structured format capturing gratitude, tensions, and wins
     - Automatic summarization

   - **Ideation Notes**
     - Session summary
     - Resource recommendations
     - Actionable todos with completion tracking

3. **User Experience**
   - Voice-first interaction
   - Visual feedback with animated orb
   - Clean, minimalist interface
   - Mobile-responsive design

### Getting Started

1. Clone the repository:

```bash
git clone https://github.com/ganthology/journeyai.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
REFLECTION_AGENT_ID=your_reflection_agent_id
IDEATION_AGENT_ID=your_ideation_agent_id
XI_API_KEY=your_elevenlabs_api_key

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Database
DATABASE_URL=your_database_url
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

### Database Schema

```prisma
model Note {
  id             String     @id @default(cuid())
  content        String     @db.Text
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  conversationId String     @unique
  resources      Resource[]
  todos          Todo[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt
}

model Resource {
  id        String   @id @default(cuid())
  title     String
  note      Note     @relation(fields: [noteId], references: [id])
  noteId    String
}

model Todo {
  id        String   @id @default(cuid())
  task      String
  completed Boolean  @default(false)
  note      Note     @relation(fields: [noteId], references: [id])
  noteId    String
}
```

## 🔗 Links

- [GitHub Repository](https://github.com/ganthology/journeyai)
- [Live Demo](https://journeyai-ten.vercel.app/)

## ✅ Compliance

This project was developed for the ElevenLabs x a16z WW Hackathon and complies with all hackathon rules and requirements.

## 📝 License

MIT License - see LICENSE file for details
