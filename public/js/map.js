const markerElement = document.createElement('div');
markerElement.innerHTML = '<i class="fa-regular fa-compass"></i>';
markerElement.style.fontSize = "24px"; // Adjust size if needed
markerElement.style.color = "red"; // Set color

    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12',
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 12 // starting zoom
    });

const marker= new mapboxgl.Marker({ color: 'red',element:markerElement})
        .setLngLat(listing.geometry.coordinates)//Listing.geometry.coordinates
        .setPopup(new mapboxgl.Popup({offset:25})
        .setHTML(`<h4>${listing.title}</h4><p>Exact location will be provided after booking.</p>`))
        .addTo(map);
