import { validationResult } from "express-validator"
import {Precio,Categoria,Propiedad} from "../models/index.js"

const admin = (req,res) =>{
    res.render('propiedades/admin',{
        pagina:'Mis propiedades'
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
export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}