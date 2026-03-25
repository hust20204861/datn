import { io } from "socket.io-client";

const socket = io("http://test.edu/manager_be");

export default socket;
