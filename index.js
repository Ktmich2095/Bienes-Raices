const express = require('express')

//Crear la app
const app = express()

//Routing
app.get('/', function(req,res){
    res.json({msg: 'Hola mundo en express'})
});

app.get('/nosotros', function(req,res){
    res.send(`Información de nosotros`)
});

//Definir un puerto y arrancar el proyecto
const port = 2095;
app.listen(port,  () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`)
});