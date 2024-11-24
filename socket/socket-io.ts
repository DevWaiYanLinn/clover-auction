import { io } from "socket.io-client";
const URL = process.env.NEXT_PUBLIC_SOCKET_URL;

const socketSingleton = () => {
    return io(URL, { autoConnect: true });
};

declare const globalThis: {
    socketGlobal: ReturnType<typeof socketSingleton>;
} & typeof global;

const socket = globalThis.socketGlobal ?? socketSingleton();

if (process.env.NODE_ENV !== "production") globalThis.socketGlobal = socket;

export { socket };
