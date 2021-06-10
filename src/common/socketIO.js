import io from "socket.io-client"

const socket_url = 'http://192.168.0.10:4000'

export const socketIO = io(socket_url);

