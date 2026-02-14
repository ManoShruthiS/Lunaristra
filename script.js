const apiKey = "2780974096844eb3b3d121544261402";

function calculateLunarAge() {
    const today = new Date();
    const knownNewMoon = new Date("2000-01-06T18:14:00");
    const synodicMonth = 29.53058867;

    const daysSince = (today - knownNewMoon) / (1000 * 60 * 60 * 24);
    return (daysSince % synodicMonth).toFixed(1);
}

function fetchMoonData(lat, lon) {
    const today = new Date().toISOString().split("T")[0];

    fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lon}&dt=${today}`)
        .then(response => response.json())
        .then(data => {
            const astro = data.astronomy.astro;
            const lunarAge = calculateLunarAge();

            document.getElementById("output").innerHTML = `
                <p>Phase: ${astro.moon_phase}</p>
                <p>Illumination: ${astro.moon_illumination}%</p>
                <p>Lunar Age: ${lunarAge} days</p>
                <p>Moonrise: ${astro.moonrise}</p>
                <p>Moonset: ${astro.moonset}</p>
            `;
        })
        .catch(error => {
            document.getElementById("output").innerText =
                "Error fetching lunar data.";
            console.error(error);
        });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        fetchMoonData(position.coords.latitude, position.coords.longitude);
    }, () => {
        fetchMoonData("Chennai");
    });
} else {
    fetchMoonData("Chennai");
}
