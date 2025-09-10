import { io } from 'socket.io-client';

// IMPORTANT: Replace with your computer's local IP address
// This must be the same IP address you used in utils/api.js
const SOCKET_URL = 'http://10.185.199.89:5000';

const socket = io(SOCKET_URL, {
  autoConnect: false, // We will connect manually when the user is logged in
});

export default socket;