import userdata from "../../../entities/userdata.js";

const Createuser = async (name,email,password,repositories,authService) => {
    try {
      const hashPassword = await authService.bcryptpassword(password);
      const userDetails = userdata(name,email,hashPassword);
      const newuser = await repositories.create(userDetails);

      const Id=newuser._id
      const isuser = {
        userId:newuser._id,
        userName:newuser.name,
        userEmail:newuser.email,
      };
      console.log(isuser);
  
      const accessToken = await authService.generateAccessToken(isuser);
  
      return { status: true, isuser, accessToken };
    } catch (error) {
      console.error("Error creating new user:", error.message);
      return { status: false, message: error.message };
    }
  };
  
  export default Createuser;