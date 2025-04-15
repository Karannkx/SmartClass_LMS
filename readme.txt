# 📚 SmartClass_LMS

A full-featured Learning Management System built for the modern virtual classroom experience. 🚀

## ✨ Key Features

- 🧠 Dashboard with all recent activities
- 📄 Study material & notes sharing platform
- 📝 Task & assignment assign & submission platform
- 🧑‍💻 Online classes & group discussion (WebRTC)
- ❓ Doubt asking & solving section
- 🗓️ Up-to-date class schedule management

## 📦 Tech Stack

| Frontend     | Backend       | Realtime       | Database |
|--------------|---------------|----------------|----------|
| ⚛️ React      | 🟩 Node.js     | 🔌 WebRTC, 💬 Socket.io | 🍃 MongoDB |
| 🎨 SCSS       | 🚀 Express.js |                |          |

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/karannkx/SmartClass_LMS.git
cd SmartClass_LMS

# 2. Setup Client
cd client
npm install

# 👉 Create .env file inside /client folder with following content
REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
REACT_APP_CLOUDINARY_API_KEY=your_api_key
REACT_APP_CLOUDINARY_API_SECRET=your_api_secret
REACT_APP_API_URL=http://localhost:5000
REACT_APP_PROXY_URL=http://localhost:5000

# 3. Open a NEW terminal and setup Server
cd server
npm install
npm install jsonwebtoken multer

# 👉 Create .env file inside /server folder with following content
MONGO_URL=your_mongodb_url
JWT_SECRET_KEY=your_jwt_secret
CRYPTOJS_SECRET_KEY=your_crypto_key

# 4. Run the application

# In client terminal
npm start

# In server terminal
npm start




🔐 Admin Login
txt
Copy
Edit
Email:    admin123@gmail.com  
Password: admin@123
📁 Folder Structure
bash
Copy
Edit
SmartClass_LMS/
├── client/         # React Frontend
│   └── .env        # Client environment variables
├── server/         # Node.js Backend
│   └── .env        # Server environment variables
├── README.md
📃 License
Licensed under the MIT License.

Made with ❤️ by @karannkx
