(function() {
    const lat = 20.67444163271174;
    const lng = -103.38739216304566;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker

    //  Utulizar provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //PIN
    marker = new L.marker([lat,lng],{
        draggable:true,//permite mover el pin
        autoPan:true//permite mover el mapa de acuerdo al pin
    })
    .addTo(mapa)

    //Detectar el movimiento del pin
    marker.on('moveend',function(e){
        marker = e.target
        const posicion=marker.getLatLng()
        console.log(posicion)
        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng))
        
        //Obtener información de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion,13).run(function(error,resultado){
            console.log(resultado)
            marker.bindPopup(resultado.address.LongLabel)
        })
    })



})()