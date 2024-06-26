//array of users
const users=[]
// addUser
// removeUser
// getUser
// getUsersInRoom
const removeUser=(id)=>{
    const index=users.findIndex((user)=>
         user.id===id)
    //logic to remove that index from the array
    if(index!==-1){
        return users.splice(index,1)[0] // This line removes the user and returns it
    }
}
const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //validate the data
    if(!username||!room){
        return{
            error:"Username and room are required"
        }
    }

    // check for existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    //validate username
    if(existingUser){
        return {
            error:'Username is in use'
        }
    }

    //store user

    const user={id,username,room}
    users.push(user)
    return {user}
}

const getUser=(id)=>{
    return users.find((user)=>{
        return user.id===id
    })
}

const getUsersInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>{
        return user.room===room
    })
}
module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}