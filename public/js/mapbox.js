if(document.querySelector('.section-map')){

const locations = JSON.parse(document.getElementById('map').dataset.locations)


mapboxgl.accessToken = 'pk.eyJ1IjoicGF3ZWxiYSIsImEiOiJja2psZTR5enMzYXV3MzJzY2dqazBiOTdxIn0.FAfHj98iRB7ajRnjOMA0qg';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/pawelba/ckm6frlsibnd317qoeigqb61s',
scrollZoom: false
// center: [-118.11, 34.15],
// zoom: 6,
// interactive: false
});

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div')
    el.className = 'marker'

    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map)

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map)
    
    // Extend map bounds to include current location
    bounds.extend(loc.coordinates)
})

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
})
}
