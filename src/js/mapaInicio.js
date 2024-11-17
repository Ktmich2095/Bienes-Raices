(function () {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 13);

    // Grupo de capas para los marcadores
    let markers = new L.FeatureGroup().addTo(mapa);

    // Almacenar las propiedades obtenidas
    let propiedades = [];

    // Filtros
    const filtros = {
        categoria: '',
        precio: ''
    };

    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');

    // Configuración de Leaflet
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Manejo de eventos de los filtros
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = +e.target.value;
        filtrarPropiedades();
    });

    preciosSelect.addEventListener('change', e => {
        filtros.precio = +e.target.value;
        filtrarPropiedades();
    });

    // Obtener las propiedades desde el backend
    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades';
            const respuesta = await fetch(url);
            propiedades = await respuesta.json();
            mostrarPropiedades(propiedades);
        } catch (error) {
            console.error("Error al obtener propiedades:", error);
        }
    };

    // Mostrar propiedades en el mapa
    const mostrarPropiedades = propiedades => {
        // Limpiar los marcadores previos
        console.log("Limpieza de markers...");
        markers.clearLayers();

        propiedades.forEach(propiedad => {
            if (propiedad.lat && propiedad.lng) {
                const marker = new L.marker([propiedad.lat, propiedad.lng], {
                    autoPan: true,
                })
                    .addTo(mapa)
                    .bindPopup(`
                        <p class="text-cyan-600 font-bold">${propiedad.categoria.nombre}</p>
                        <h1 class="text-xl font-extrabold uppercase my-3">${propiedad?.titulo}</h1>
                        <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                        <p class="text-gray-600 font-bold">${propiedad.precio.precio}</p>
                        <a href="/propiedad/${propiedad.id}" class="bg-cyan-600 block p-2 text-center font-bold uppercase">Ver propiedad</a>
                    `);

                // Agregar el marcador al grupo de capas
                markers.addLayer(marker);
            } else {
                console.warn("Propiedad sin coordenadas:", propiedad);
            }
        });
    };

    // Función para filtrar propiedades
    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio);
        console.log("Propiedades filtradas:", resultado);
        mostrarPropiedades(resultado);
    };

    // Funciones de filtrado
    const filtrarCategoria = propiedad =>
        filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;

    const filtrarPrecio = propiedad =>
        filtros.precio ? propiedad.precioId === filtros.precio : propiedad;

    // Inicializar
    obtenerPropiedades();
})();
