import {exit} from 'node:process'
import categorias from './categorias.js';
import db from '../config/db.js';
import precios from './precios.js';
import {Categoria, Precio} from '../models/index.js'


const importarDatos = async()=>{
    try{
        //autenticar
        await db.authenticate();

        //generar las columnas
        await db.sync()

        //Insertamos los datos
        await Promise.all([//se insertan al mismo tiempo si uno tiene error se pasa al catch
            Categoria.bulkCreate(categorias),//inserta todos los datos bulkcreate
            Precio.bulkCreate(precios)//si no dependen los querys usar promise.all
        ])
        console.log('Datos importados correctamente')
        exit()//0 si termino y correcto, 1 finalizo pero hay error

    }catch(error){
        console.log(error)
        exit(1)
    }
}

const eliminarDatos = async () =>{
    try{
        await db.sync({force:true})//preferible cuando hay varias tablas
        console.log('Datos eliminados correctamente')
        exit()

    }catch(error){
        console.log(error)
        exit(1)
    }

}

if(process.argv[2]==="-i"){//argumentos que se mandan desde el script
    importarDatos();
}

if(process.argv[2]==="-e"){
    eliminarDatos();
    }
