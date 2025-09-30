import userController from "../../../../adapters/controllers/user/userController.js";
import userServiceImp from "../../../services/admin/userServiceImp.js";
import userServiceInt from "../../../../application/services/user/userServiceInt.js";
import userRepositoryInt from "../../../../application/repositories/user/userRepositoryInt.js";
import userRepositoryImp from "../../../database/mongodb/repositories/user/userRepositoryImp.js";
import multer from 'multer';

const authRouter=(express)=>{
    const router=express.Router()
    const controller=userController(userRepositoryInt,userRepositoryImp,userServiceInt,userServiceImp)
    const upload = multer({ dest: 'uploads/' });
    
    router.route('/createuser').post(controller.usercreation)
    router.route('/login').post(controller.login)
    router.route('/googlelogin').post(controller.googlelogin)
    router.route('/googlecreateuser').post(controller.usergoogle)
    router.route('/pdfconverter').post(upload.single('file'), controller.pdfconverter); // Handle file upload for PDF to Word conversion
    router.route('/wordconverter').post(upload.single('file'), controller.wordconverter); // Handle file upload for Word to PDF conversion


    return router;

}
export default authRouter ;