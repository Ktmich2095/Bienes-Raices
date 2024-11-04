import Precio from "../models/Precio.js"
import { validationResult } from "express-validator"
import Categoria from "../models/Categoria.js"

const admin = (req,res) =>{
    res.render('propiedades/admin',{
        pagina:'Mis propiedades',
        barra:true
    })
}

//Formulario para crear una nueva propiedad
const crear = async(req,res) =>{
    //Consultar modelo de precio y categorias
    const [categorias,precios] = await Promise.all([//ambos inician al mismo tiempo no dependen
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/crear',{
        pagina:'Crear propiedad',
        barra:true,
        csrfToken:req.csrfToken(),
        categorias,
        precios,
        datos:{}
    })
}

const guardar = async(req,res) =>{
    //validación
    let resultado = validationResult(req)
    if(!resultado.isEmpty()){
        const [categorias,precios] = await Promise.all([//ambos inician al mismo tiempo no dependen
            Categoria.findAll(),
            Precio.findAll()
        ])
    
        return res.render('propiedades/crear',{
            pagina:'Crear propiedad',
            barra:true,
            csrfToken:req.csrfToken(),
            categorias,
            precios,
            errores:resultado.array(),
            datos:req.body
        })
    }
}

export {
    admin,
    crear,
    guardar
}