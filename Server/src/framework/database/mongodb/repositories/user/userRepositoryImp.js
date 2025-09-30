import User from "../../models/userModel.js";

const userRepositoryImp = () => {

  const userexistemail = (email) => User.findOne({ email: email });

  const create = (userDetails) => {
       
    const newuser = new User({
      name:userDetails?.getname(),
      email:userDetails?.getemail(),
      password:userDetails?.getpassword(),
      google:false
    

    })
    return newuser.save()

  }


  const creategoogle = (userDetails) => {
   
    const newuser = new User({
      name:userDetails?.getname(),
      email:userDetails?.getemail(),
      google:true
    

    })
    return newuser.save()

  }




  return {

    userexistemail,
    create,
    creategoogle,

  }
}

export default userRepositoryImp