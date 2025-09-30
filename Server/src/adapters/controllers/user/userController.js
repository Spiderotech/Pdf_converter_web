import Login from "../../../application/useCase/user/Login.js"
import Createuser from "../../../application/useCase/user/Createuser.js"
import Googlelogin from "../../../application/useCase/user/Googlelogin.js"
import Createusergoogle from "../../../application/useCase/user/Createusergoogle.js"
import Pdf_to_wordconverter from "../../../application/useCase/user/Pdf_to_wordconverter.js"
import path from 'path';
import Word_to_pdfconverter from "../../../application/useCase/user/Word_to_pdfconverter.js"

const userController = (userauthRepositoryInf, userauthRepositoryImp, userauthServiceInt, userauthServiceImp) => {

    const dbrepository = userauthRepositoryInf(userauthRepositoryImp())
    const authService = userauthServiceInt(userauthServiceImp())


    const login = (req, res) => {
        const { email, password } = req.body
        Login(email, password, dbrepository, authService).then((response) => {
            console.log(response, "login");
            res.json(response)

        }).catch((err) => console.log(err))

    }

    const googlelogin = (req, res) => {
        const { email } = req.body
        Googlelogin(email, dbrepository, authService).then((response) => {
            res.json(response)

        }).catch((err) => console.log(err))

    }

    const usercreation = (req, res) => {

        const { name, email, password } = req.body


        Createuser(name, email, password, dbrepository, authService).then((response) => {
            console.log(response);
            res.json(response)

        }).catch((err) => console.log(err))




    }

    const usergoogle = (req, res) => {

        const { fullName, email } = req.body


        Createusergoogle(fullName, email, dbrepository, authService).then((response) => {
            console.log(response);
            res.json(response)

        }).catch((err) => console.log(err))




    }


    const pdfconverter = (req, res) => {
        const file = req.file;
    
        Pdf_to_wordconverter(file)
            .then((response) => {
                console.log(response);
                // Ensure the full path is used in res.download
                const fullFilePath = path.resolve(response.convertedFilePath);
                res.download(fullFilePath);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Conversion failed');
            });
    };
    

    const wordconverter = (req, res) => {

        const file = req.file;
    
        Word_to_pdfconverter(file)
            .then((response) => {
                console.log(response);
                // Ensure the full path is used in res.download
                const fullFilePath = path.resolve(response.convertedFilePath);
                res.download(fullFilePath);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Conversion failed');
            });

        


       




    }
 


    return {
       
        usercreation,
        login,
        googlelogin,
        usergoogle,
        pdfconverter,
        wordconverter

        

    }


}

export default userController