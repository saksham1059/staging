function getLocation() {
    var ipAddress = document.getElementById('ipAddress').value;

    // Construct the API request URL
    var api_endpoint = 'https://get.geojs.io/v1/ip/geo/' + ipAddress + '.json';

    fetch(api_endpoint)
        .then(response => response.json())
        .then(data => {
            var locationInfo = document.getElementById('locationInfo');
            locationInfo.innerHTML = `
                <p>Country: ${data.country}</p>
                <p>Region: ${data.region}</p>
                <p>City: ${data.city}</p>
                <p>Latitude: ${data.latitude}</p>
                <p>Longitude: ${data.longitude}</p>
            `;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}