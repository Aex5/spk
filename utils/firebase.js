import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8CaaUHAkwjJyuCOSljjKFFku9xXuMDL8",
  authDomain: "aerojs.firebaseapp.com",
  projectId: "aerojs",
  storageBucket: "aerojs.appspot.com",
  messagingSenderId: "823148732155",
  appId: "1:823148732155:web:5221d74646ca4fc3789a5e",
  measurementId: "G-2VV9WY128Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Kondisi khusus: Firebase Analytics hanya diinisialisasi di client-side
if (typeof window !== "undefined" && firebaseConfig.measurementId) {
  import("firebase/analytics").then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export { app, storage };
