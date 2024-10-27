import {check,validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js"
import { generarId } from '../helpers/tokens.js' 
import { emailRegistro } from '../helpers/emails.js'
import { emailOlvidePassword } from '../helpers/emails.js'

const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        pagina:'Iniciar Sesión'
    })
}

const formularioRegistro = (req, res) =>{
    res.render('auth/registro',{
        pagina:'Crear Cuenta',
        csrfToken : req.csrfToken()
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
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //Extraer los datos
    const {nombre,email,password} = req.body


    //verificar que el usuario no este duplicado
    //await cuando tiene interacción en la bd 
    const existeUsuario = await Usuario.findOne({where:{email}})
    if(existeUsuario){
        return res.render('auth/registro',{
            pagina:'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: [{msg:'El usuario ya esta registrado'}],
            usuario:{
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    //Almacenar un usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envia email de confirmación
    emailRegistro({
        nombre:usuario.nombre,
        email:usuario.email,
        token:usuario.token
    })

    //Mostrar mensaje de confirmación
    res.render('templates/mensaje',{
        pagina:'Cuenta Creada Correctamente',
        mensaje:'Hemos enviado un Email de confirmación, presiona en el enlace'
    })

    //no se puede revetir una contraseña hasheada, pero existe una funcion para comparar 

    /*console.log(existeUsuario)
    return;

    const usuario = await Usuario.create(req.body)
    res.json(usuario)
    console.log(req.body) //para leer informacion en express de usa req.body*/
}

//Función que comprueba una cuenta
const confirmar = async (req,res)=>{
    const{token}=req.params

    //Verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario){
        return res.render('auth/confirmar-cuenta',{
            pagina:'Error al confirmar tu cuenta.',
            mensaje:'Hubo un error al confirmar tu cuenta. Intenta de nuevo',
            error:true
        })
    }
    //Confirmar la cuenta
    usuario.token=null;
    usuario.confirmado=true
    await usuario.save()
    res.render('auth/confirmar-cuenta',{
        pagina:'Cuenta confirmada',
        mensaje:'La cuenta se confirmo correctamente'
    })
    

    
}

const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide_password',{
        pagina:'Recupera tu acceso a Bienes Raíces',
        csrfToken : req.csrfToken()
    })
}


const resetPassword = async (req,res) =>{ //valida el email para identificar
    //Validación
    await check('email').isEmail().withMessage('Eso no parece un Email').run(req)
    
    let resultado = validationResult(req) 
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
    //ERRORES  
        return res.render('auth/olvide_password',{
            pagina:'Recupera tu acceso a Bienes Raíces',
            csrfToken : req.csrfToken(),
            errores:resultado.array()
        })
    }
    //Buscar el usuario
    const {email} =req.body
    const usuario = await Usuario.findOne({where:{email}})
    if(!usuario){
            return res.render('auth/olvide_password',{
            pagina:'Recupera tu acceso a Bienes Raíces',
            csrfToken : req.csrfToken(),
            errores:[{msg:'El Email no pertenece a ningún usuario'}]
        })
    }

    //Generar un token y enviar el email
    usuario.token = generarId();
    await usuario.save();
    
    //Enviar un email
    emailOlvidePassword({
        email:usuario.email,
        nombre: usuario.nombre,
        token:usuario.token
    })
    //Renderizar un mensaje
   //Mostrar mensaje de confirmación
   res.render('templates/mensaje',{
    pagina:'Reestablece tu Password',
    mensaje:'Hemos enviado un Email con las instrucciones'
})
}

const comprobarToken = async(res,req) => {
    
    
}
const nuevoPassword = (req,res) =>{

}

export{
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
    }