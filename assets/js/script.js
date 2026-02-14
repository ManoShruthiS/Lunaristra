// ======================================
// Lunaristra - Stable Crescent Rendering
// ======================================

const synodicMonth = 29.53058867;
const radius = 95;
const center = 110;


// Calculate lunar age
function calculateLunarAge() {

    const today = new Date();
    const knownNewMoon = new Date("2000-01-06T18:14:00");

    const daysSince =
        (today - knownNewMoon) / (1000 * 60 * 60 * 24);

    return daysSince % synodicMonth;
}


// Draw illuminated portion
function drawMoon(lunarAge) {

    const path = document.getElementById("illuminationPath");

    const phaseAngle =
        (2 * Math.PI * lunarAge) / synodicMonth;

    const k = (1 - Math.cos(phaseAngle)) / 2;

    const x = radius * (1 - 2 * k);

    const isWaxing =
        lunarAge <= synodicMonth / 2;

    const sweepFlag =
        isWaxing ? 1 : 0;

    const d = `
        M ${center} ${center - radius}
        A ${radius} ${radius} 0 1 1 ${center} ${center + radius}
        A ${Math.abs(x)} ${radius} 0 1 ${sweepFlag} ${center} ${center - radius}
        Z
    `;

    path.setAttribute("d", d);
}


// Fetch API data
function fetchMoonData(lat, lon) {

    const today =
        new Date().toISOString().split("T")[0];

    fetch(
        `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lon}&dt=${today}`
    )
        .then(res => res.json())
        .then(data => {

            const astro = data.astronomy.astro;

            const lunarAge = calculateLunarAge();

            const illumination =
                parseFloat(astro.moon_illumination);

            document.getElementById("phase").innerText =
                "Phase: " + astro.moon_phase;

            document.getElementById("illumination").innerText =
                "Illumination: " + illumination + "%";

            document.getElementById("age").innerText =
                "Lunar Age: " + lunarAge.toFixed(1) + " days";

            document.getElementById("rise").innerText =
                "Moonrise: " + astro.moonrise;

            document.getElementById("set").innerText =
                "Moonset: " + astro.moonset;

            drawMoon(lunarAge);

        })
        .catch(err =>
            console.error("API error:", err)
        );
}


// Get user location
if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
        pos => fetchMoonData(
            pos.coords.latitude,
            pos.coords.longitude
        ),
        () => fetchMoonData("Chennai")
    );

} else {

    fetchMoonData("Chennai");
}
