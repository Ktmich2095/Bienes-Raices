import express from "express"
import { formularioLogin,
    autenticar,
    formularioOlvidePassword,
    registrar,
    formularioRegistro,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
} from "../controllers/usuarioController.js";

const router = express.Router();

//Routing
router.get('/login', formularioLogin);
router.post('/login', autenticar);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/confirmar/:token', confirmar)

router.get('/olvide_password', formularioOlvidePassword);
router.post('/olvide_password', resetPassword);

//Almacena el nuevo password
router.get('/olvide_password/:token',comprobarToken)
router.post('/olvide_password/:token',nuevoPassword)


export default router