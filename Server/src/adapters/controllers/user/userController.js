import Login from "../../../application/useCase/user/Login.js"
import Createuser from "../../../application/useCase/user/Createuser.js"
import Googlelogin from "../../../application/useCase/user/Googlelogin.js"
import Createusergoogle from "../../../application/useCase/user/Createusergoogle.js"
import Pdf_to_wordconverter from "../../../application/useCase/user/Pdf_to_wordconverter.js"
import path from 'path';
import Word_to_pdfconverter from "../../../application/useCase/user/Word_to_pdfconverter.js"
import Office_to_pdfconverter from "../../../application/useCase/user/Office_to_pdfconverter.js";
import Protect_pdf from "../../../application/useCase/user/Protect_pdf.js";
import Unlock_pdf from "../../../application/useCase/user/Unlock_pdf.js";
import Compress_pdf from "../../../application/useCase/user/Compress_pdf.js";

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

    const pptxtopdfconverter = (req, res) => {
        const file = req.file;

        Office_to_pdfconverter(file)
            .then((response) => {
                const fullFilePath = path.resolve(response.convertedFilePath);
                res.download(fullFilePath);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('PPTX to PDF conversion failed');
            });
    }

    const exceltopdfconverter = (req, res) => {
        const file = req.file;

        Office_to_pdfconverter(file)
            .then((response) => {
                const fullFilePath = path.resolve(response.convertedFilePath);
                res.download(fullFilePath);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('Excel to PDF conversion failed');
            });
    }

    const protectpdf = (req, res) => {
        const file = req.file;
        const { password } = req.body;

        Protect_pdf(file, password)
            .then((response) => {
                const fullFilePath = path.resolve(response.convertedFilePath);
                res.download(fullFilePath);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('PDF protection failed');
            });
    }

    const unlockpdf = (req, res) => {
        const file = req.file;
        const { password } = req.body;

        Unlock_pdf(file, password)
            .then((response) => {
                const fullFilePath = path.resolve(response.convertedFilePath);
                res.download(fullFilePath);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('PDF unlock failed');
            });
    }

    const compresspdf = (req, res) => {
        const file = req.file;
        const { quality } = req.body;

        Compress_pdf(file, quality)
            .then((response) => {
                const fullFilePath = path.resolve(response.convertedFilePath);
                res.download(fullFilePath);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send('PDF compression failed');
            });
    }
 


    return {
       
        usercreation,
        login,
        googlelogin,
        usergoogle,
        pdfconverter,
        wordconverter,
        pptxtopdfconverter,
        exceltopdfconverter,
        protectpdf,
        unlockpdf,
        compresspdf

        

    }


}

export default userController
