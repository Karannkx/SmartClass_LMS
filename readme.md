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

| **Frontend** | **Backend**   | **Realtime**         | **Database** |
|--------------|---------------|----------------------|--------------|
| ⚛️ React     | 🟩 Node.js    | 🔌 WebRTC, 💬 Socket.io | 🍃 MongoDB   |
| 🎨 SCSS      | 🚀 Express.js |                      |              |

## ⚙️ Setup Instructions

### Prerequisites
- Node.js and npm installed
- MongoDB instance (local or cloud)
- Cloudinary account for file uploads

### Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/karannkx/SmartClass_LMS.git
   cd SmartClass_LMS
   ```

2. **Setup Client**:
   ```bash
   cd client
   npm install
   ```
   - Create a `.env` file inside `/client` folder with the following content:
     ```env
     REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
     REACT_APP_CLOUDINARY_API_KEY=your_api_key
     REACT_APP_CLOUDINARY_API_SECRET=your_api_secret
     REACT_APP_API_URL=http://localhost:5000
     REACT_APP_PROXY_URL=http://localhost:5000
     ```

3. **Setup Server**:
   - Open a **new terminal** and navigate to the server directory:
     ```bash
     cd server
     npm install
     npm install jsonwebtoken multer
     ```
   - Create a `.env` file inside `/server` folder with the following content:
     ```env
     MONGO_URL=your_mongodb_url
     JWT_SECRET_KEY=your_jwt_secret
     CRYPTOJS_SECRET_KEY=your_crypto_key
     ```

4. **Run the Application**:
   - In the **client** terminal:
     ```bash
     npm start
     ```
   - In the **server** terminal:
     ```bash
     npm start
     ```

### 🔐 Admin Login
- **Email**: admin123@gmail.com
- **Password**: admin@123

## 📁 Folder Structure

```
SmartClass_LMS/
├── client/         # React Frontend
│   └── .env        # Client environment variables
├── server/         # Node.js Backend
│   └── .env        # Server environment variables
├── README.md
```

## 📃 License

Licensed under the MIT License.

---

Made with ❤️ by @karannkx
```
