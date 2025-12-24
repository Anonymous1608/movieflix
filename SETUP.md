# Setup Guide

## Quick Start

1. **Install Dependencies**

   ```bash
   # Server
   cd server
   npm install
   
   # Client
   cd ../client
   npm install
   ```

2. **Configure Environment**

   Create `server/.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   BASE_URL=https://api.themoviedb.org/3
   API_KEY=your_tmdb_api_key_here
   MONGODB_URI=mongodb://localhost:27017/movieflix
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   CLIENT_URL=http://localhost:5173
   ```

3. **Start MongoDB**

   Local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas and update `MONGODB_URI`.

4. **Run Development Servers**

   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

5. **Access the Application**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## New Features Added

### Backend
- ✅ MongoDB database with Mongoose
- ✅ User authentication (JWT)
- ✅ User profiles with watchlist and favorites
- ✅ Reviews and ratings system
- ✅ Personalized recommendations
- ✅ Security middleware (Helmet, rate limiting)
- ✅ Input validation
- ✅ Error handling
- ✅ Environment validation

### Frontend
- ✅ Login/Register pages
- ✅ Protected routes
- ✅ User profile page
- ✅ Watchlist and favorites functionality
- ✅ Reviews and ratings UI
- ✅ Movie actions (add to watchlist/favorites)
- ✅ Updated API endpoints

## API Endpoints

All endpoints are prefixed with `/api`:

- **Auth**: `/api/auth/login`, `/api/auth/register`
- **Movies**: `/api/movies/*`
- **Users**: `/api/users/*` (protected)
- **Reviews**: `/api/reviews/*`
- **Recommendations**: `/api/recommendations/*`

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

### API Key Issues
- Get your TMDB API key from https://www.themoviedb.org/settings/api
- Ensure it's set in `server/.env`

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `CLIENT_URL` if needed

