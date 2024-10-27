import {check,validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js"

const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        pagina:'Iniciar Sesión'
    })
}

const formularioRegistro = (req, res) =>{
    res.render('auth/registro',{
        pagina:'Crear Cuenta' 
    })
}
const registrar = async (req,res) =>{

    //Validación
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un Email').run(req)
    await check('password').isLength({min:8}).withMessage('El password debe ser de al menos 8 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los Passwords no son iguales').run(req)
    
    let resultado = validationResult(req) 
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
    //ERRORES  
        return res.render('auth/registro',{
            pagina:'Crear Cuenta',
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

   

    const usuario = await Usuario.create(req.body)
    res.json(usuario)
   /* console.log(req.body) //para leer informacion en express de usa req.body*/
}

const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide_password',{
        pagina:'Recupera tu acceso a Bienes Raíces'
    })
}

export{formularioLogin,formularioRegistro,formularioOlvidePassword,registrar}