import express from "express"
import { formularioLogin,formularioOlvidePassword,formularioRegistro } from "../controllers/usuarioController.js";

const router = express.Router();

//Routing
router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.get('/registro', formularioOlvidePassword);

export default router