import {DataTypes} from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull:false 
    },
    email:{
        type: DataTypes.STRING,
        allowNull:false
    },
    password:{
        type: DataTypes.STRING,
        allowNull:false
    },
    token:DataTypes.STRING,
    confirmado:DataTypes.BOOLEAN
},{
    hooks:{//funciones que se agregan a cierto modelo
        beforeCreate: async function(usuario){
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password,salt)
        }
    },
    scopes:{//eliminar ciertos campos cuando se hace la consulta a un modelo en especifico
        eliminarPassword:{
            attributes:{
                exclude:['password','token','confirmado','createdAt','updatedAt']
            }
        }
    }
})

//Métodos personalizados
//No se puede usar el this cuando se hace el =>
//PROTOTYPE contiene las funciones que puede realizar ese objeto
Usuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

export default Usuario