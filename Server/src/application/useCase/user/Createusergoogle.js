import usergoogledata from "../../../entities/usergoogledata.js";

const Createusergoogle= async (fullName,email,repositories,authService) => {
    try {
      const userDetails = usergoogledata(fullName,email);
      const newuser = await repositories.creategoogle(userDetails);

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
  
  export default Createusergoogle;