// ================================
// Lunaristra - Correct Crescent Rendering
// ================================

const synodicMonth = 29.53058867;
const radius = 95;
const center = 110;


// --------------------------------
// Calculate lunar age
// --------------------------------
function calculateLunarAge() {

    const today = new Date();
    const knownNewMoon = new Date("2000-01-06T18:14:00Z");

    const daysSince =
        (today - knownNewMoon) / (1000 * 60 * 60 * 24);

    return daysSince % synodicMonth;
}


// --------------------------------
// Draw moon using correct geometry
// --------------------------------
function drawMoon(illuminationFraction, lunarAge) {

    const path = document.getElementById("illuminationPath");

    const r = radius;
    const c = center;

    const isWaxing =
        lunarAge <= synodicMonth / 2;

    // Correct mathematical offset
    const offset =
        r * (1 - 2 * illuminationFraction);

    const x =
        isWaxing ? offset : -offset;

    const d = `
        M ${c} ${c - r}
        A ${r} ${r} 0 1 1 ${c} ${c + r}
        A ${Math.abs(x)} ${r} 0 1 1 ${c} ${c - r}
        Z
    `;

    path.setAttribute("d", d);
}


// --------------------------------
// Fetch moon data
// --------------------------------
function fetchMoonData(lat, lon) {

    const today =
        new Date().toISOString().split("T")[0];

    fetch(`https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lon}&dt=${today}`)
        .then(res => res.json())
        .then(data => {

            const astro = data.astronomy.astro;

            const lunarAge = calculateLunarAge();

            const illumination =
                parseFloat(astro.moon_illumination);

            const illuminationFraction =
                illumination / 100;

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

            drawMoon(illuminationFraction, lunarAge);

        })
        .catch(err =>
            console.error("API error:", err)
        );
}


// --------------------------------
// Get user location
// --------------------------------
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
