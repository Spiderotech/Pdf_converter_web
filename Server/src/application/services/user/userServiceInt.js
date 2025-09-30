

const userServiceInt = (repository) => {
    const bcryptpassword=(password)=>repository.bcryptpassword(password)
    const comparePassword=(password,hashPassword)=>repository.comparePassword(password,hashPassword)
    const generateAccessToken = (userId) => repository.generateAccessToken(userId);


    return{
        bcryptpassword,
        comparePassword,
        generateAccessToken,

    }
}

export default userServiceInt
