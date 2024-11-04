import { validationResult } from "express-validator"
import {Precio,Categoria,Propiedad} from "../models/index.js"

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

    //Crear un registro

    const {titulo, descripcion,habitaciones,estacionamiento,wc,calle,lag,lng,precio:precioId,categoria:categoriaId} = req.body

    try {
        const propiedadGuardada= await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lag,
            lng,
            precioId,
            categoriaId
        })

    } catch (error) {
        console.log(error)
    }
}

export {
    admin,
    crear,
    guardar
}