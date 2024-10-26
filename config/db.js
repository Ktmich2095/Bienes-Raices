import Sequelize from 'sequelize'

const db = new Sequelize('bienesraices_node_mvc','mich','2095',{
    host:'localhost',
    port:3306,
    dialect:'mysql',
    define:{
        timestamps:true
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