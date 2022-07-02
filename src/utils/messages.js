const genMessage = (DisplayName, text)=>{
    return {
        DisplayName,
        text,
        createdAt: new Date().getTime()
    }
}

const genLocMessage = (DisplayName, loctext)=>{
    return {
        DisplayName,
        loctext,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    genMessage,
    genLocMessage
}