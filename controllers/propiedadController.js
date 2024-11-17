import { validationResult } from "express-validator"
import {Precio,Categoria,Propiedad} from "../models/index.js"
import {unlink} from 'node:fs/promises'

const admin = async(req,res) =>{

    //leer querystring
    const { pagina:paginaActual } = req.query
    //^ tiene q iniciar con digito, $ debe finalizar con digito
    const expresion = /^[0-9]$/

    if(!expresion.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const {id}  = req.usuario

        //limites y offset para el paginador
        const limit= 10;
        const offset=((paginaActual * limit) - limit)

        const propiedades = await Propiedad.findAll({
            limit,
            offset,
            where:{
                usuarioId:id
            },
            include:[
                {model:Categoria,as:'categoria'},
                {model:Precio,as:'precio'}
            ]
        })
        res.render('propiedades/admin',{
            pagina:'Mis propiedades',
            propiedades,
            csrfToken:req.csrfToken(),
        })
    } catch (error) {
        console.log(error)
    }



    
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
            csrfToken:req.csrfToken(),
            categorias,
            precios,
            errores:resultado.array(),
            datos:req.body
        })
    }

    //Crear un registro

    const {titulo, descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio:precioId,categoria:categoriaId} = req.body

    const {id:usuarioId}=req.usuario
    try {
        const propiedadGuardada= await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen:'' 
        })
        const {id}=propiedadGuardada
        res.redirect(`/propiedades/agregar-imagen/${id}`)

    } catch (error) {
        console.log(error)
    }
}
const agregarImagen = async(req,res)=>{

    const {id} = req.params
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad pertenece a quuien visita la pagina
    
    if(req.usuario.id.toString()!== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }
   //recomendable .toString() ya que puede marcar falso cuando sea verdadero
    
    
    res.render('propiedades/agregar-imagen',{
        pagina:`Agregar imagen: ${propiedad.titulo}`,
        csrfToken:req.csrfToken(),
        propiedad
    })
}
const almacenarImagen = async (req,res,next)=>{

    const {id} = req.params
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    //validar que la propiedad pertenece a quuien visita la pagina
    
    if(req.usuario.id.toString()!== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }

    try {
        //console.log(req.file)
        //almacenar la imagen y publicar propiedad
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1 //cambiar el estado
        await propiedad.save()
        //res.redirect('mis-propiedades') no funciona ya que se esta ejecutando el js
        next()
    } catch (error) {
        console.log(error)
    }  
}

const editar = async (req,res)=>{

    const {id}=req.params
    //validar que la propiedad exista
    const propiedad=await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    
    //revisar que quien visita la URL es quien crean la propiedad
    if(propiedad.usuarioId.toString() != req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    const [categorias,precios] = await Promise.all([//ambos inician al mismo tiempo no dependen
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/editar',{
        pagina:`Editar propiedad: ${propiedad.titulo}`,
        csrfToken:req.csrfToken(),
        categorias,
        precios,
        datos:propiedad  
    })

}
const guardarCambios = async (req,res) =>{

    //validación
    let resultado = validationResult(req)
    if(!resultado.isEmpty()){
        const [categorias,precios] = await Promise.all([//ambos inician al mismo tiempo no dependen
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar',{
            pagina:'Editar propiedad',
            csrfToken:req.csrfToken(),
            categorias,
            precios,
            errores:resultado.array(),
            datos:req.body  
        })
    }


    const {id}=req.params
    //validar que la propiedad exista
    const propiedad=await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    
    //revisar que quien visita la URL es quien crean la propiedad
    if(propiedad.usuarioId.toString() != req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }


    //reescribir el objeto y actualizarlo
    try {
        const {titulo, descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio:precioId,categoria:categoriaId} = req.body
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })
        await propiedad.save()
        res.redirect("/mis-propiedades")
    } catch (error) {
        console.log(error)
    }
    
}

const eliminar = async (req,res) =>{
    const {id}=req.params
    //validar que la propiedad exista
    const propiedad=await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    
    //revisar que quien visita la URL es quien crean la propiedad
    if(propiedad.usuarioId.toString() != req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    //eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)
    console.log('se  elimino la imagen')

    //eliminar la propiedad
    await propiedad.destroy()
    res.redirect('/mis-propiedades')
}

//muestra una propiedad

const mostrarPropiedad = async (req,res)=>{
    const{id}=req.params

    //comprobar que la propiedad existe
    const propiedad = await Propiedad.findByPk(id,{
        include:[
            {model:Precio,as:'precio'},
            {model:Categoria,as:'categoria'},
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }


    res.render('propiedades/mostrar',{
        propiedad,
        pagina: propiedad.titulo,
        
    })
}
export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    eliminar,
    mostrarPropiedad
}