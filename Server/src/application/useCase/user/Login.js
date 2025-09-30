

const Login = async (email, password, dbrepository, authService) => {
  const isEmail = await dbrepository.userexistemail(email)
  console.log(isEmail, "login");
  if (isEmail != null && isEmail.password) {

    const isPassword = await authService.comparePassword(password, isEmail.password)

    if (isPassword) {



      const isuser = {
        userId:isEmail._id,
        userName:isEmail.name,
        userEmail:isEmail.email,
        
      };

      const accessToken = await authService.generateAccessToken(isuser);

      return { status: true, isuser, accessToken };

    } else {

      return ({ status: false })

    }



  } else {
    return ({ message: 'Invalid email or password', status: false })
  }


}
export default Login