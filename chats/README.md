
# 📱 Chatoos: Full-Stack Real-Time Chat & Video Calling App

Welcome to **Chatoos**, a feature-rich, real-time communication mobile application built from scratch using a modern full-stack technology stack. Chatoos supports real-time text chat, video/voice calling, user authentication, profile management, and more!

---

## 🚀 Project Journey: From Blueprint to Full-Featured App

Chatoos started as a blueprint — an idea to build a modern, scalable chat application. We tackled one feature at a time, learning and resolving real-world development challenges. From backend setup to building the frontend UI, every obstacle we faced helped shape Chatoos into the robust, reliable, and performant application it is today.

---

## 🧱 Tech Stack

| Area       | Technologies / Libraries                                                                 |
|------------|------------------------------------------------------------------------------------------|
| Backend    | Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT, bcryptjs, multer                   |
| Frontend   | React Native, Expo (Development Build), React Navigation, Axios, WebRTC, Expo Camera       |
| Tooling    | Android Studio, Visual Studio Code, Postman, Android Emulator                              |

---

## ✨ Features

- 🔐 **Secure User Authentication** (JWT-based)
- 💬 **Real-Time Text Chat** with Socket.IO
- 📜 **Conversation History** stored in MongoDB
- 📞 **Real-Time Voice & Video Calling** via WebRTC
- 🟢 **Online Status Indicators**
- 👤 **Profile Management** with photo upload
- 🔐 **Persistent Login Sessions**
- 📷 **Camera Access & Media Handling**

---

## ⚠️ Real Development Challenges We Overcame

### 🛢️ The Phantom Database  
Two MongoDB instances were running — one handled by the server, the other by the MongoDB Compass client. Resolved by syncing both to a single instance.

### 🔐 The "Invalid Password" Paradox  
Auto-capitalization and invisible spaces caused login failures. Solved with `.trim()` and `autoCapitalize="none"` on input fields.

### 📦 Native Module Nightmares  
Switching from Expo Go to Development Build was required for video calling. We resolved errors like:  
- Missing native WebRTC modules  
- `ANDROID_HOME` and `JAVA_HOME` not set  
- Corrupted NDK installation  
- Gradle build failures due to cache issues

### ♻️ The Infinite Loop  
React’s `useEffect` was misfiring on every state change. Solution: split logic across multiple hooks with correct dependency arrays.

### 🔄 The Stubborn Cache  
Metro bundler caching prevented UI updates. Fixed with a complete reset: clearing app data, uninstalling, cleaning Gradle, and running `--clear`.

---

## 🛠️ Getting Started

Follow the steps below to get Chatoos running on your Windows machine.

### ✅ Prerequisites

Install the following:

- [Node.js (LTS)](https://nodejs.org/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Android Studio](https://developer.android.com/studio)  
  - Install SDK, AVD, and NDK via SDK Manager
- [Git](https://git-scm.com/)

---

### ⚙️ Environment Variables

Set these system variables:

```bash
JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
ANDROID_HOME=C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

Update your `Path` variable:

```bash
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%JAVA_HOME%\bin
```

Restart your terminal or computer after making these changes.

---

### 🧑‍💻 Installation & Running

#### 🔹 1. Clone the Repository

```bash
git clone <repository_url>
cd chatoos
```

#### 🔹 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/chatoos_fresh_start
JWT_SECRET=this_is_a_very_secret_key_for_chatoos
```

Start the backend server:

```bash
npm start
```

The backend will run at: `http://localhost:5000`

---

#### 🔹 3. Setup Frontend

```bash
cd ../chats
npm install
```

**Update the IP address:**  
Open `chats/utils/api.js` and `chats/utils/socket.js` and replace `YOUR_COMPUTER_IP_ADDRESS` with your actual IPv4 (run `ipconfig` in CMD).

Build and run on Android emulator:

```bash
npx expo run:android
```

---

### 📱 Testing With Two Devices (Emulators)

1. Create a second emulator via:  
   Android Studio → Virtual Device Manager → Duplicate

2. Start both emulators.

3. Run the app on both devices:  
   ```bash
   npx expo run:android
   ```
   Then press **Shift + A** in the Expo terminal and select the second emulator.

4. Register two users and test calling, chat, and online status.

---

## 🏁 Final Notes

Chatoos represents a real-world journey through debugging, design, and development. Each challenge faced and solved is reflected in the reliability and depth of features in this application.

---

## 🧑‍💻 Contributors

Built by a passionate team of developers committed to mastering full-stack mobile development. 💻📱

---

## 📜 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🔗 Links

- [MongoDB Compass](https://www.mongodb.com/products/compass) – Download  
- [Expo Documentation](https://docs.expo.dev/) – Read More  
- [React Native WebRTC](https://github.com/react-native-webrtc/react-native-webrtc) – GitHub  

---

## 🙌 Thank You

Thank you for checking out Chatoos! We hope this helps you learn or build even better real-time communication apps. Happy coding!
