const users = []

const addUser = ({ id, DisplayName, Room })=>{
    DisplayName = DisplayName.trim().toLowerCase()
    // Room = Room.trim().toLowerCase()

    if(!DisplayName || !Room){
        return {
            error : "DisplayName and Room is required"
        }
    }

    const existingUser = users.find((user)=>{
        return user.DisplayName === DisplayName && user.Room === Room
    })

    if(existingUser){
        return {
            error: "DisplayName already in use"
        }
    }

    const user = { id, DisplayName, Room }
    users.push(user)
    return {user}
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id)=>{
    const user = users.find((user)=>user.id === id)

    if(!user){
        return {
            error: "No user found"
        }
    }

    return user
}

const getUsersInRoom = (Room)=>{
    const roommates = users.filter((user) => user.Room === Room)

    if(!roommates){
        return {
            error: "No users found"
        }
    }

    return roommates
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

























