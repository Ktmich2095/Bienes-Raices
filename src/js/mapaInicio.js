(function(){
    const lat =  20.67444163271174;// ?? se ejecuta cuando el primero es null o undefined
    const lng = -103.38739216304566;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 13);

    let markers = new L.FeatureGroup().addTo(mapa)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //JSON (javaScript object notation)

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades' 
            const respuesta = await fetch(url) 
            const propiedades = await respuesta.json()
            mostrarPropiedades(propiedades)
            
            console.log(propiedades)

        } catch (error) {
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {
        propiedades.forEach(propiedad => {
            if (propiedad.lat && propiedad.lng) {
                const marker = new L.marker([propiedad.lat, propiedad.lng], {
                    autoPan: true,
                })
                    .addTo(mapa)
                    .bindPopup('Información aquí');
    
                markers.addLayer(marker);
            } else {
                console.warn("Propiedad sin coordenadas:", propiedad);
            }
        });
    };
    
    obtenerPropiedades()


})()