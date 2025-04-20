import { io } from "socket.io-client";

const socket = io("http://localhost:2024");

export default socket;
