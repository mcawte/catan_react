import { io } from "socket.io-client"

const socketUrl = process.env.SERVER || "mcawte.com"


const localToken = localStorage.getItem('token')

console.log("The locally stored token is: ", localToken)

export const socket = io(socketUrl, {auth: {token: localToken}})

socket.on("newToken", (token: any) => {
    console.log("saving new token to local stroage")
    localStorage.setItem('token', token)
})