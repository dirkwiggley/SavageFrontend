import socketIO, { Socket, io } from "socket.io-client";
import { UserInterface } from "./types.js"
import { DefaultEventsMap } from "@socket.io/component-emitter";

class SocketController {
    // static socket: WebSocket | null = null;
    static socket: Socket<DefaultEventsMap, DefaultEventsMap>;
    static socketId: number | null = null;
    auth: UserInterface;

    constructor(auth: UserInterface) {
        this.auth = auth;
    }

    createWebSocket = () => {
        SocketController.socket = SocketController.socket;
        SocketController.socket = io("http://10.0.0.154:8082", {
            withCredentials: true,
            autoConnect: false, 
            reconnection: false,
            query: {
                data: this.auth
            },
            reconnectionDelayMax: 10000,
        });
        SocketController.socket.connect();
        SocketController.socket.emit("USER_INFO", this.auth);

        SocketController.socket.on("USER_INFO", (data) => {
            console.log(data, 2, null);
        });

        // const port = 8081;
        
        // if (!SocketController.socket) {
        //     const ws = new WebSocket(`ws://10.0.0.154:${port}`);
        //     SocketController.socket = ws;
        //     if (SocketController.socket === null) {
        //         console.error("Could not create a WebSocket");
        //         return;
        //     } else {
        //         SocketController.socket = ws;
        //         ws.onopen = (event) => {
        //             const openRequest = {"request":"OPEN", "data":auth};
        //             SocketController.socket?.send(JSON.stringify(openRequest));
        //         }
        //     }
        
        //     ws.onmessage = (event) => {
        //         const data = JSON.parse(event.data);
        //         if (data.response === "OPEN") {
        //             SocketController.socketId = data.id;
        //         } else if (data.response === "CREATE_COMBAT_TRACKER") { 
        //             console.log("CREATE_COMBAT_TRACKER");
        //         } else if (data.response === "GET_COMBAT_TRACKERS") {
        //             console.log("GET_COMBAT_TRACKERS");
        //         } else if (data.response === "JOIN_COMBAT_TRACKER") {
        //             console.log("JOIN_COMBAT_TRACKER");
        //         } else if (data.response === "REMOVE_USER_FROM_TRACKER") {
        //             console.log("REMOVE_USER_FROM_TRACKER");
        //         } else if (data.response === "GET_TRACKER_USERS") {
        //             console.log("GET_TRACKER_USERS");
        //         } else if (data.response === "DELETE_TRACKER") {
        //             console.log("DELETE_TRACKER");
        //         } else if (data.response === "SEND_MESSAGE") {
        //             console.log("SEND_MESSAGE");
        //         } else {
        //             console.log("UNKNOWN RESPONSE");
        //         }
                
        //         console.log(JSON.stringify(data, null, 2));
        //     }
        // }
    }
    
    createTracker = (data: any) => {
        const msg = { request: "CREATE_COMBAT_TRACKER", data: data };
        SocketController.socket?.send(JSON.stringify(msg));
    }

    deleteTracker = (trackerId: number) => {
        SocketController.socket?.send(JSON.stringify({"request":"DELETE_TRACKER", "id": trackerId}));
    }

    getTrackers = () => {
        const msg = { request: "GET_COMBAT_TRACKERS" };
        SocketController.socket?.send(JSON.stringify(msg));
    }

    joinTracker = (trackerId: number, userId: number, userName: string) => {
        const data = { tracker_id: trackerId, user_id: userId, user_name: userName };
        const msg = { request: "JOIN_COMBAT_TRACKER", data: data };
        SocketController.socket?.send(JSON.stringify(msg));
    }

    removeUserFromTracker = (trackerId: number, userId: number) => {
        const data = {tracker_id: trackerId, user_id: userId};
        const msg = { request: "REMOVE_USER_FROM_TRACKER", data: data };
        SocketController.socket?.send(JSON.stringify(msg));
    }

    getTrackerUsers = (trackerId: number) => {
        const msg = { request: "GET_TRACKER_USERS", data: trackerId }
        SocketController.socket?.send(JSON.stringify(msg));
    }
}

export default SocketController;