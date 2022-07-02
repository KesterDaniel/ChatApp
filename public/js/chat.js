const socket = io()

let input = document.querySelector("input")
const form = document.querySelector("form")
const sendLoc = document.getElementById("send-location")
const sendBtn = form.querySelector("button")
const messages = document.querySelector("#messages")
const msgTemp = document.querySelector("#message-template").innerHTML
const loctemp = document.querySelector("#location-template").innerHTML
const sidebartemp = document.querySelector("#sidebar-template").innerHTML

const {DisplayName, Room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = ()=>{
    // get new message
    const newMsg = messages.lastElementChild

    //height of new message
    const newMsgStyles = getComputedStyle(newMsg)
    const newMsgMargin = parseInt(newMsgStyles.marginBottom)
    const newMsgHeight = newMsg.offsetHeight + newMsgMargin

    //visible height
    const visibleHeight = messages.offsetHeight

    //container height
    const containerHeight = messages.scrollHeight

    //how far down we are
    const scrollOffset = messages.scrollTop + visibleHeight

    if(containerHeight - newMsgHeight <= scrollOffset){
        messages.scrollTop = messages.scrollHeight
    }
}

socket.on("message", (message)=>{
    console.log(message)
    const html = Mustache.render(msgTemp, {
        DisplayName: message.DisplayName,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    // console.log(html)
    messages.insertAdjacentHTML("beforeend", html)
    autoScroll()
})



socket.on("Locmessage", (locmessage)=>{
    console.log(locmessage)
    const loclink = Mustache.render(loctemp, {
        DisplayName: locmessage.DisplayName,
        locurl:locmessage.loctext,
        createdAt: moment(locmessage.createdAt).format("h:mm a")
    })
    messages.insertAdjacentHTML("beforeend", loclink)
    autoScroll()
})

socket.on("roomData", ({room, users})=>{
    const html = Mustache.render(sidebartemp, {
        room,
        users
    })
    document.querySelector("#sidebar").innerHTML = html
})

form.addEventListener("submit", (e)=>{
    e.preventDefault()
    sendBtn.setAttribute("disabled", "disabled")

    let chat = e.target.elements.message.value
    socket.emit("newChat", chat, (error)=>{
        sendBtn.removeAttribute("disabled")
        input.value = ""
        input.focus()

        if(error){
            return console.log(error)
        }
        console.log("delivered")
    })
})

sendLoc.addEventListener("click", ()=>{
    if(!navigator.geolocation){
        return alert("You browser does not support geolocation")
    }

    sendLoc.setAttribute("disabled", "disabled")

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit("sendlocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        },()=>{
            sendLoc.removeAttribute("disabled")
            console.log("location delivered")
        })
    })
})


socket.emit("join", {DisplayName, Room}, (error)=>{
    if(error){
        alert(error)
        location.href = "/"
    }
})




