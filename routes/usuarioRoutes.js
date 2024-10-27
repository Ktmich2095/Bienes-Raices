import express from "express"
import { formularioLogin,formularioOlvidePassword,registrar,formularioRegistro } from "../controllers/usuarioController.js";

const router = express.Router();

//Routing
router.get('/login', formularioLogin);

router.get('/registro', formularioRegistro);
router.post('/registro', registrar);

router.get('/olvide_password', formularioOlvidePassword);

export default router