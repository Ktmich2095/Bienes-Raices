
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
const registrar = (req,res) =>{
    console.log(req.body) //para leer informacion en express de usa req.body
}

const formularioOlvidePassword = (req, res) =>{
    res.render('auth/olvide_password',{
        pagina:'Recupera tu acceso a Bienes Raíces'
    })
}

export{formularioLogin,formularioRegistro,formularioOlvidePassword,registrar}