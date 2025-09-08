# KhanFlow - Advanced Meeting Scheduling Platform

KhanFlow is a modern, full-stack meeting scheduling application that allows users to create events, manage availability, and integrate with popular calendar and video conferencing platforms. Built with React, TypeScript, Node.js, and PostgreSQL.
<img width="1536" height="1024" alt="khanflow" src="https://github.com/user-attachments/assets/68da8775-f0d5-4870-afd5-7f18dd1b3a91" />

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure user registration and login with JWT tokens
- **Event Management**: Create, edit, and manage different types of meetings/events
- **Availability Settings**: Flexible availability scheduling with time slots and gaps
- **Meeting Booking**: Public booking pages for seamless scheduling
- **Dashboard**: Comprehensive dashboard for managing meetings and events

### Integrations
- **AI Assistant**: Slack and Google Tasks integration for automated scheduling and coordination
- **Google Calendar & Meet**: Sync events and generate Google Meet links
- **Microsoft Teams & Outlook**: Calendar integration and Teams meeting links
- **Zoom**: Video conferencing integration
- **Calendar Sync**: Two-way synchronization with external calendars

### Advanced Features
- **AI Assistant Integration**: Integrated AI assistant with Slack and Google Tasks, cutting manual scheduling and coordination time
- **Public Booking Pages**: Shareable links for external booking (e.g., `/:username/:event-slug`)
- **Time Zone Support**: Automatic time zone handling for global users
- **Responsive Design**: Modern UI built with Tailwind CSS and Shadcn/UI
- **Real-time Updates**: Live updates using React Query
- **Theme Support**: Light and dark mode support

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for development and building
- React Router v7 for routing
- Tailwind CSS + Shadcn/UI components
- React Query (TanStack) for state management
- React Hook Form with Zod validation
- Framer Motion for animations

**Backend:**
- Node.js with Express
- TypeScript
- TypeORM with PostgreSQL
- Passport.js for authentication
- JWT for session management
- CORS enabled for cross-origin requests

**Database:**
- PostgreSQL with TypeORM migrations
- Entities: Users, Events, Meetings, Availability, Integrations

### Project Structure

```
khanflow/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Routing configuration
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utilities and API clients
│   │   └── types/           # TypeScript type definitions
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── database/        # Entities, DTOs, migrations
│   │   ├── routes/          # API route definitions
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Helper utilities
├── availibility/            # Next.js availability demo
├── integrations/            # Next.js integrations demo
├── login/                   # Next.js login demo
├── meetings/                # Next.js meetings demo
└── modern-booking-cards/    # Next.js booking demo
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- pnpm (recommended) or npm

### Environment Variables

Create `.env` files in both `frontend` and `backend` directories:

**Backend (.env):**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/khanflow

# Server Configuration
PORT=8000
NODE_ENV=development
BASE_PATH=/api

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Frontend URLs
FRONTEND_ORIGIN=http://localhost:5173
FRONTEND_INTEGRATION_URL=http://localhost:5173/app/integrations

# Google OAuth (for Google Calendar/Meet integration)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/integration/google/callback

# Microsoft OAuth (for Teams/Outlook integration)
MS_CLIENT_ID=your-microsoft-client-id
MS_CLIENT_SECRET=your-microsoft-client-secret
MS_REDIRECT_URI=http://localhost:8000/api/integration/microsoft/callback

# Zoom OAuth (for Zoom integration)
ZOOM_CLIENT_ID=your-zoom-client-id
ZOOM_CLIENT_SECRET=your-zoom-client-secret
ZOOM_REDIRECT_URI=http://localhost:8000/api/integration/zoom/callback
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/khanflow.git
   cd khanflow
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup Database**
   ```bash
   # Create PostgreSQL database
   createdb khanflow
   
   # Run migrations
   cd ../backend
   npm run db:migrate
   ```

5. **Start Development Servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api

## 🔧 Development

### Available Scripts

**Backend:**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate new migration
- `npm run db:migrate` - Run pending migrations
- `npm run db:revert` - Revert last migration
- `npm run db:drop` - Drop database schema

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

**Events:**
- `GET /api/event` - Get user events
- `POST /api/event` - Create new event
- `PUT /api/event/:id` - Update event
- `DELETE /api/event/:id` - Delete event

**Availability:**
- `GET /api/availability` - Get user availability
- `POST /api/availability` - Create/update availability

**Meetings:**
- `GET /api/meeting` - Get user meetings
- `POST /api/meeting` - Create new meeting
- `PUT /api/meeting/:id` - Update meeting

**Integrations:**
- `GET /api/integration` - Get user integrations
- `GET /api/integration/google/auth` - Google OAuth
- `GET /api/integration/microsoft/auth` - Microsoft OAuth
- `GET /api/integration/zoom/auth` - Zoom OAuth

## 🌐 Deployment

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Environment Setup for Production

1. Set up PostgreSQL database
2. Configure environment variables for production
3. Set up OAuth applications for integrations
4. Deploy backend to your preferred platform (Heroku, DigitalOcean, AWS, etc.)
5. Deploy frontend to static hosting (Vercel, Netlify, etc.)

### Integration Setup

**Google Calendar/Meet:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API and Google Meet API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

**Microsoft Teams/Outlook:**
1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application in Azure AD
3. Configure API permissions for Calendar and Teams
4. Generate client secret

**Zoom:**
1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Create a new OAuth app
3. Configure scopes for meeting creation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add proper error handling
- Include proper TypeScript types
- Test new features thoroughly

### Adding New Features

1. **Backend Changes:**
   - Create new entities in `backend/src/database/entities/`
   - Add DTOs in `backend/src/database/dto/`
   - Implement services in `backend/src/services/`
   - Add controllers in `backend/src/controllers/`
   - Update routes in `backend/src/routes/`

2. **Frontend Changes:**
   - Add new pages in `frontend/src/pages/`
   - Create reusable components in `frontend/src/components/`
   - Update routing in `frontend/src/routes/`
   - Add types in `frontend/src/types/`

3. **Database Changes:**
   - Generate migrations: `npm run db:generate`
   - Review and run migrations: `npm run db:migrate`

## 🐛 Troubleshooting

### Common Issues

**Database Connection:**
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

**OAuth Issues:**
- Check client IDs and secrets
- Verify redirect URIs match exactly
- Ensure proper scopes are configured

**CORS Errors:**
- Verify FRONTEND_ORIGIN is set correctly
- Check API URLs in frontend

**Build Errors:**
- Clear node_modules and reinstall
- Check TypeScript errors
- Verify environment variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Node.js](https://nodejs.org/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database ORM with [TypeORM](https://typeorm.io/)

---

**Made with ❤️ by Khan**

For questions or support, please open an issue on GitHub.
