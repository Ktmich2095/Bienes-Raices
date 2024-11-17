import {Propiedad,Precio,Categoria} from '../models/index.js'

const propiedades = async (req, res) => {
    try {
        const propiedades = await Propiedad.findAll({
            include: [
                { model: Precio, as: "precio" },
                { model: Categoria, as: "categoria" },
            ],
        });

        // Asegúrate de devolver los datos
        res.json(propiedades);
    } catch (error) {
        console.error("Error al obtener propiedades:", error);
        res.status(500).json({ error: "Error al obtener propiedades" });
    }
};

export { propiedades };
