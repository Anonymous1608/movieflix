# 🎬 MOVIEFLIX - Production-Ready Movie Watching Web App

A modern, full-stack movie watching web application with user authentication, personalized recommendations, watchlists, favorites, and reviews.

## ✨ Features

### Core Features
- 🔍 **Advanced Movie Search** - Search movies with pagination and filters
- 🎲 **Random Movie Discovery** - Discover new movies randomly
- 📊 **Detailed Movie Information** - Comprehensive movie details, cast, and streaming availability
- 🔄 **Trending & Popular Movies** - Daily updated trending and popular movies
- 📺 **Streaming Integration** - View where movies are available to stream

### User Features
- 🔐 **Authentication System** - Secure JWT-based authentication with login/signup
- 👤 **User Profiles** - Personal profiles with watchlist and favorites tracking
- 📝 **Watchlist & Favorites** - Save movies to watch later or mark as favorites
- ⭐ **Reviews & Ratings** - Rate and review movies (1-10 scale)
- 🎯 **Personalized Recommendations** - Get movie recommendations based on your preferences
- 📈 **Activity Tracking** - View your review history and statistics

### Production Features
- 🛡️ **Security** - Helmet.js, rate limiting, input validation
- 🗄️ **Database** - MongoDB with Mongoose for data persistence
- 🔒 **Protected Routes** - Authentication middleware for protected endpoints
- 📝 **Error Handling** - Comprehensive error handling and logging
- ⚡ **Performance** - Optimized API calls and caching strategies
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- TMDB API Key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/movieflix.git
cd movieflix
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Configure environment variables**

Create a `.env` file in the `server/` directory:
```env
NODE_ENV=development
PORT=5000
BASE_URL=https://api.themoviedb.org/3
API_KEY=your_tmdb_api_key_here
MONGODB_URI=mongodb://localhost:27017/movieflix
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
CLIENT_URL=http://localhost:5173
```

5. **Start MongoDB**

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas and update `MONGODB_URI` in `.env`.

6. **Run the backend server**
```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

7. **Run the frontend**
```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

## 📁 Project Structure

```
movieflix/
├── server/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   │   ├── database.ts  # MongoDB connection
│   │   │   └── env.ts       # Environment validation
│   │   ├── models/          # Mongoose models
│   │   │   ├── User.ts      # User model
│   │   │   └── Review.ts    # Review model
│   │   ├── middleware/      # Express middleware
│   │   │   ├── auth.ts       # Authentication middleware
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validator.ts
│   │   ├── routes/          # API routes
│   │   │   ├── auth.ts       # Authentication routes
│   │   │   ├── users.ts      # User management routes
│   │   │   ├── movies.ts     # Movie API routes
│   │   │   ├── reviews.ts    # Review routes
│   │   │   └── recommendations.ts
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context (Auth)
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Movies
- `GET /api/movies/search?name={query}&page={page}` - Search movies
- `GET /api/movies/trending?page={page}` - Get trending movies
- `GET /api/movies/popular?page={page}` - Get popular movies
- `GET /api/movies/top-rated?page={page}` - Get top rated movies
- `GET /api/movies/:movieId` - Get movie details
- `GET /api/movies/random` - Get random movie
- `GET /api/movies/live` - Get movies with cast info

### User (Protected)
- `GET /api/users/profile` - Get user profile
- `POST /api/users/watchlist/:movieId` - Add to watchlist
- `DELETE /api/users/watchlist/:movieId` - Remove from watchlist
- `POST /api/users/favorites/:movieId` - Add to favorites
- `DELETE /api/users/favorites/:movieId` - Remove from favorites
- `PUT /api/users/preferences` - Update preferences

### Reviews
- `GET /api/reviews/:movieId` - Get reviews for a movie
- `POST /api/reviews/:movieId` - Create/update review (Protected)
- `DELETE /api/reviews/:movieId` - Delete review (Protected)

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `GET /api/recommendations/similar/:movieId` - Get similar movies

## 🛠️ Technologies Used

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation
- **Zod** - Environment validation
- **Morgan** - HTTP request logging

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- Environment variable validation

## 📝 Scripts

### Server
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Backend Deployment

1. Set environment variables in your hosting platform
2. Build the project: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment

1. Update API endpoints in production
2. Build the project: `npm run build`
3. Deploy the `dist/` folder to your hosting platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project however you want.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the movie API
- All the open-source libraries that made this project possible

---

Made with ❤️ by Aniket and probably while watching a movie.
