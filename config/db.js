import Sequelize from 'sequelize'
import dotenv from 'dotenv'
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER,process.env.BD_PASS ?? '',{
    host:process.env.BD_HOST,
    port:3306,
    dialect:'mysql',
    define:{
        timestamps:true//genera automaticamente campos de primera vez y actualización
    },
    pool:{
        max:5,//conexiones a mantener
        min:0,
        acquire:30000,//tiempo antes de marcar un error
        idle:10000//al no tener movimiento finaliza la conexión
    },
    operatorAliases:false
})

export default db;