const apiKey = "2780974096844eb3b3d121544261402";

// Calculate lunar age manually
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
            const illumination = parseFloat(astro.moon_illumination);

            // Update text fields
            document.getElementById("phase").innerText =
                "Phase: " + astro.moon_phase;

            document.getElementById("illumination").innerText =
                "Illumination: " + illumination + "%";

            document.getElementById("age").innerText =
                "Lunar Age: " + lunarAge + " days";

            document.getElementById("rise").innerText =
                "Moonrise: " + astro.moonrise;

            document.getElementById("set").innerText =
                "Moonset: " + astro.moonset;

            //  Visual Moon Rendering
            const shadow = document.getElementById("shadow");

            // Convert illumination to movement
            const percentage = illumination / 100;

            // Move shadow across moon
            shadow.style.transform =
                `translateX(${percentage * 180 - 90}px)`;
        })
        .catch(error => {
            console.error("Error fetching lunar data:", error);
        });
}

// Get user location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            fetchMoonData(
                position.coords.latitude,
                position.coords.longitude
            );
        },
        () => {
            fetchMoonData("Chennai");
        }
    );
} else {
    fetchMoonData("Chennai");
}
