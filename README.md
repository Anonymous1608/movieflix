# 🎬 MOVIEFLIX

Born from movie nights and laptop struggles - a simple solution to find where to watch your favorite films. Because sometimes, you just need to escape into a good movie without the endless search.

## ✨ Why This Exists

Ever felt overwhelmed trying to find where to watch something? Same here. I built this because:
- I was tired of jumping between different streaming sites
- Movies are my escape when things get tough
- Wanted something simple that just works on laptops
- I didn't want to deal with signing up or entering personal information just to watch a movie
- Thought others might find it useful too

## 🎯 Features

- 🔍 Easy movie search across platforms
- 🎲 Random movie picker when you can't decide
- 📊 Detailed movie info and ratings
- 📺 Streaming availability
- 🔄 Daily updated trending movies

## ⚠️ About Ads

This app uses the VidSrc API, which means:
- Yes, there are some ads
- No, I don't make money from them
- They're from the API, not my choice
- Feel free to use an ad blocker

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/movieflix.git
cd movieflix
```

#### 2. Install dependencies

```sh
cd client
npm install
cd ../server
npm install
```

#### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```
BASE_URL=https://api.themoviedb.org/3
PORT=5000
API_KEY=YOUR_TMDB_API_KEY
```

Replace `YOUR_TMDB_API_KEY` with your TMDb API key.

#### 4. Run the backend server

```sh
npm run dev
```

#### 5. Run the frontend

```sh
cd ../client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run lint` – Run ESLint
- `npm run preview` – Preview production build

## Technologies

- React, TypeScript, Vite
- Tailwind CSS
- Express.js
- TMDb API



## 👥 Want to Help?

Please do! This project is open source and needs people like you. Whether you're:
- A developer who can code
- A designer with an eye for UI
- Someone who's good at documentation
- Just a movie buff with ideas

All contributions are welcome! Here's how:
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

No contribution is too small. Even fixing a typo helps!

## ❤️ Support

If you like this project:
- Star it on GitHub
- Share it with friends
- Submit issues or ideas
- Contribute if you can

## 📝 License

MIT - Feel free to use this however you want. Just be cool about it.

---

**Note:** This project is for educational purposes and uses TMDb API. Please comply with TMDb’s terms of use.

Made with ❤️ and probably while watching a movie.
