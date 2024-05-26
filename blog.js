// blog.js

function initializeMap() {
    // Initialize the map
    var map = L.map('map').setView([41.6086, 21.7453], 8); // Centered on North Macedonia

    // Set up the OSM layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fetch air pollution data
    fetch('https://api.openweathermap.org/data/2.5/air_pollution?lat=41.6086&lon=21.7453&appid=653d83903a3e309ca4a5ccf76b0f81c7')
        .then(response => response.json())
        .then(data => {
            var pollutionData = data.list;
            
            pollutionData.forEach(point => {
                var lat = point.coord.lat;
                var lon = point.coord.lon;
                var aqi = point.main.aqi;
                var color;

                // Determine the color based on AQI value
                if (aqi === 1) color = 'green';
                else if (aqi === 2) color = 'yellow';
                else if (aqi === 3) color = 'orange';
                else if (aqi === 4) color = 'red';
                else color = 'purple';

                // Add a circle to the map
                L.circle([lat, lon], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.5,
                    radius: 5000
                }).addTo(map).bindPopup(`AQI: ${aqi}`);
            });
        })
        .catch(error => console.error('Error fetching the air pollution data:', error));

    // Custom control functions
    window.zoomIn = function() {
        map.zoomIn();
    };

    window.zoomOut = function() {
        map.zoomOut();
    };

    window.resetView = function() {
        map.setView([41.6086, 21.7453], 8);
    };

    // Optional: Add zoom control
    map.zoomControl.setPosition('topright');
}
