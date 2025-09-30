

const userRepositoryInt = (repository) => {

    const userexistemail=(email)=>repository.userexistemail(email);
    const create=(userDetails)=>repository.create(userDetails);
    const creategoogle=(userDetails)=>repository.creategoogle(userDetails);
   
    
   


    return{
        userexistemail,
        create,
        creategoogle,
       
        
    }



    
 
}

export default userRepositoryInt