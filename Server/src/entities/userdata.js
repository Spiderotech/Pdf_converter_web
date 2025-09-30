const userdata= (name,email,hashPassword) => {



    return{
        getemail:()=>email,
        getname:()=>name,
        getpassword:()=>hashPassword,

    }
 


}

export default userdata