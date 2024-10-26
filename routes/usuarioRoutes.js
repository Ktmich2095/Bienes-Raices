import express from "express"

const router = express.Router();

//Routing
router.get('/',(req,res) => {
    res.json({msg: 'Hola mundo en express'})
});

router.post('/',(req,res) => {
    res.json({msg:'Respuesta de tipo post'})
});


export default router