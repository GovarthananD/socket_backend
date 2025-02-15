import express from "express";
import http from "http";
import {Server} from "socket.io";
import {v4} from "uuid";

const app = express();
const server = http.createServer(app);

const socketIO = new Server(server, {
    cors:{
        origin:"http://127.0.0.1:5500",
        methods:["GET", "POST"],
        credentials:true,
    },
});

const todoListNameSpace = socketIO.of('/todo');
todoListNameSpace.on("connection", (socket) => {
    console.log("New Connection Established");

    socket.emit("update", todoList);

    socket.on("newItem", (item) => {
        const todoItem = {id: v4(), value:item};
        todoList.push(todoItem);
        todoListNameSpace.emit("update", todoList);
    });

    socket.on("updateItem", (itemObj) => {
        const index = todoList.findIndex((item) => item.id === itemObj.id);
        if(index !== -1) {
            todoList[index].value = itemObj.value;
            todoListNameSpace.emit("update", todoList);
        }
    });

    socket.on("deleteItem", (id) => {
        todoList = todoList.filter(x => x.id!==id);
        todoListNameSpace.emit("update", todoList);
    });

    socket.on("disconnect", () => {
        console.log("Client Disconnected");
    });
})

let todoList = [];

server.listen(3000, () => {
    console.log("Server running on PORT 3000");
})
