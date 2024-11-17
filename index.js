import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'



//Crear la app
const app = express()


//Habilitar lectura de datos de formulario
app.use(express.urlencoded({extended:true})) //recibe los req

//Habilitar Cookie Parser
app.use(cookieParser())

//Habilitar CSRF

app.use(csrf({ cookie: true }));

//Routing
app.use('/',appRoutes)
app.use('/auth',usuarioRoutes)
app.use('/',propiedadesRoutes)
app.use('/api',apiRoutes)

//Conexión a la base de datos
try{
    await db.authenticate();
    db.sync()
    console.log('Conexión correcta a la base de datos')
}catch(error){
    console.log(error)
}

//Habilitar pug
app.set('view engine','pug')
app.set('views','./views')

//Carpeta publica
app.use(express.static('public'))

//Definir un puerto y arrancar el proyecto
const port = process.env.PORT || 2095;
app.listen(port,  () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});