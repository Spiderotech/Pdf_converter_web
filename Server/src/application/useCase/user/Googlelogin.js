

const Googlelogin = async (email,repositories,authService) => {

    console.log(email);
    try {
        const user = await repositories.userexistemail(email);
        if (!user) {
            return { message: 'User email not found', status: false };
        } else {


            const isuser = { 
                userId:user._id,
                userName:user.name,
                userEmail:user.email,
              };
        
              const accessToken = await authService.generateAccessToken(isuser);

            return { message: 'Email found', status: true, isuser, accessToken };
        }
    } catch (error) {
        console.error("Error verifying email:", error);
        return { message: 'Error verifying email', status: false };
    }


}

export default Googlelogin
