# Smart Education Platform - Setup & Demo Guide

## Project Status

✅ **Code is production-ready**, but requires MongoDB to run the backend.

## Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Setup MongoDB

The project expects MongoDB to be running locally on the default port (27017).

**Option A: Local MongoDB Installation**
- Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start the MongoDB service:
  - **Windows:** MongoDB runs as a service (installed automatically) or run `mongod` in terminal
  - **Mac:** `brew services start mongodb-community`
  - **Linux:** `sudo systemctl start mongodb`

**Option B: MongoDB Atlas (Cloud Database)**
- Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/smart-education-platform`)
- Update `.env` in the server folder:
  ```
  MONGO_URI=mongodb+srv://your_user:your_password@your_cluster.mongodb.net/smart-education-platform
  ```

### 3. Environment Variables

**Server (`server/.env`):**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-education-platform
JWT_SECRET=your_jwt_secret_key_change_this
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_URL=http://localhost:5173
```

**Client (`client/.env`):**
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

### 5. Access the Application

Open your browser and go to: **`http://localhost:5173`**

## Demo Credentials

The platform has seed data prepared. You can:
1. **Register** a new account
2. **Login** with test credentials (if seed data is loaded)

## Features to Try

- 🏠 **Home Page** - Marketing landing page
- 🔐 **Auth** - Register and login
- 📊 **Dashboard** - User dashboard (protected)
- 🤖 **AI Assistant** - AI tutoring features (requires OpenAI API key)
- 👨‍🏫 **Mentor Directory** - Browse mentors
- 💬 **Community Forum** - Discussion boards
- 🧠 **Mental Health Support** - Counseling resources
- 💼 **Internship Board** - Browse internships
- 👤 **Profile** - User profile management
- ⚙️ **Admin Panel** - Admin only

## Troubleshooting

### MongoDB Connection Error
```
MongoDB connection error: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running. Use the setup instructions above.

### Port Already in Use
```
Error: Port 5000/5173 is already in use
```
**Solution:** Kill the process using that port or change the port in `.env`

### Module Not Found Errors
```
npm ERR! code ERESOLVE
```
**Solution:** Run `npm install` in both server and client directories

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure backend is running and `CLIENT_URL` in server `.env` matches your frontend URL

## Project Structure

```
smart-education-platform/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── routes/      # Routing setup
│   │   ├── services/    # API service
│   │   └── styles/      # CSS
│   └── package.json
│
├── server/              # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── models/      # Database schemas
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── middleware/  # Custom middleware
│   └── package.json
│
└── README.md
```

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/register` | Register new user |
| `POST /api/auth/login` | User login |
| `GET /api/auth/me` | Get current user |
| `GET /api/mentors` | List all mentors |
| `POST /api/mentorship/request` | Request mentorship |
| `GET /api/community/posts` | Get forum posts |
| `POST /api/community/posts` | Create new post |
| `GET /api/internships` | List internships |
| `POST /api/ai/chat` | Chat with AI tutor |

## Next Steps

1. ✅ Install MongoDB
2. ✅ Install dependencies in both folders
3. ✅ Start the server: `npm run dev` (in `server/` folder)
4. ✅ Start the client: `npm run dev` (in `client/` folder)
5. ✅ Open `http://localhost:5173` in your browser
6. ✅ Register a new account or login
7. 🔄 Explore the features

## Support

For issues or questions:
- Check the main README.md
- Ensure all prerequisites are installed
- Verify MongoDB is running
- Check browser console for frontend errors
- Check terminal output for backend errors

---

**Status:** Ready to deploy with proper configuration ✨
