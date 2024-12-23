import {check,validationResult} from 'express-validator'
import Usuario from "../models/Usuario.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { generarId } from '../helpers/tokens.js' 
import { emailRegistro } from '../helpers/emails.js'
import { emailOlvidePassword } from '../helpers/emails.js'
import { generarJWT } from '../helpers/tokens.js'

const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        pagina:'Iniciar Sesión',
        csrfToken : req.csrfToken()
    })
}

const autenticar = async (req,res)=>{
    //Validación
    await check('email').isEmail().withMessage('El Email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)
    
    let resultado = validationResult(req) 
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
    //ERRORES  
        return res.render('auth/login',{
            pagina:'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
        })
    }
    const {email,password} = req.body
    //Comprobar si el usuario existe
    const usuario=await Usuario.findOne({where:{email}})
    if(!usuario){
        return res.render('auth/login',{
            pagina:'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg:'El usuario no existe'}],
        })
    }

    //Comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        return res.render('auth/login',{
            pagina:'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg:'Tu cuenta no ha sido confirmada'}],
        })
    }

    //Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina:'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: [{msg:'El password es incorrecto'}],
        })
    }
    
    /* JWT Json Web Token. estándar abierto que define un formato compacto y autónomo para transmitir 
    información de forma segura entre partes como un objeto JSON. Este token se 
    utiliza comúnmente en autenticación y autorización*/

    //Autenticar al usuario
    const token = generarJWT({id:usuario.id, nombre:usuario.nombre})
    
    console.log(token)

    //Almacenar en un cookie
    return res.cookie('_token',token,{
        httpsOnly:true,//evita que sea accesible 
       /* secure:true, //acepta cookies en conexiones seguras cuando se tiene cerrtificado SSL
        sameSite:true*/
    }).redirect('/mis-propiedades')
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

const comprobarToken = async(req,res) => {
    const { token } = req.params
    const usuario = await Usuario.findOne({where: {token}})
    if(!usuario){
            return res.render('auth/confirmar-cuenta',{
            pagina:'Reestablece tu password',
            mensaje:'Hubo un error al confrimar tu información. Intenta de nuevo',
            error:true
        })
    }

    //Mostrar formulario para validar el password
    res.render('auth/reset-password',{
        pagina:'Reestablece tu Password',
        csrfToken : req.csrfToken(),
    })
}
const nuevoPassword = async(req,res) =>{
    //Validar el password
    await check('password').isLength({min:8}).withMessage('El password debe ser de al menos 8 caracteres').run(req)
    let resultado = validationResult(req) 
    //Verificar que el resultado este vacio
    if(!resultado.isEmpty()){
    //ERRORES  
        return res.render('auth/reset-password',{
            pagina:'Reestablece tu password',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const{token} = req.params
    const{password}=req.body

    //Identificar quien hace el cambio
    const usuario = await Usuario.findOne({where:{token}})

    //Hashear el nuevo password
    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(usuario.password,salt)
    usuario.token = null;

    await usuario.save();
    res.render('auth/confirmar-cuenta',{
        pagina:'Password  reestablecido',
        mensaje:'Tu password se guardo correctamente'
    })
        

}

export{
    formularioLogin,
    autenticar,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
    }