
import path from 'path'

export default {
    mode:'development',
    entry:{
        //archivo original
        mapa:'./src/js/mapa.js'
    },
    output:{
        //donde quiere que se proyecte
        filename:'[name].js',
        path: path.resolve('public/js')
    }
}