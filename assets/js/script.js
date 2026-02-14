// -------------------------------------------
// Calculate lunar age
// -------------------------------------------
function calculateLunarAge() {

    const today = new Date();
    const knownNewMoon = new Date("2000-01-06T18:14:00");
    const synodicMonth = 29.53058867;

    const daysSince =
        (today - knownNewMoon) / (1000 * 60 * 60 * 24);

    return (daysSince % synodicMonth).toFixed(1);
}


// -------------------------------------------
// Fetch data from WeatherAPI
// -------------------------------------------
function fetchMoonData(lat, lon) {

    const today =
        new Date().toISOString().split("T")[0];

    fetch(
        `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${lat},${lon}&dt=${today}`
    )
        .then(response => response.json())
        .then(data => {

            const astro = data.astronomy.astro;

            const lunarAge =
                calculateLunarAge();

            const illumination =
                parseFloat(astro.moon_illumination);

            // -------------------------------
            // Update text info
            // -------------------------------
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


            // -------------------------------
            // Accurate Crescent Rendering
            // -------------------------------
            const maskCircle =
                document.getElementById("maskCircle");

            const illuminationFraction =
                illumination / 100;

            const lunarAgeValue =
                parseFloat(lunarAge);

            const synodicMonth =
                29.53058867;

            const isWaxing =
                lunarAgeValue <= synodicMonth / 2;

            const radius = 90;

            // Circle overlap math
            const offset =
                radius * 2 * illuminationFraction;

            if (isWaxing) {

                maskCircle.setAttribute(
                    "cx",
                    100 + (radius - offset)
                );

            } else {

                maskCircle.setAttribute(
                    "cx",
                    100 - (radius - offset)
                );
            }

        })
        .catch(error => {
            console.error(
                "Error fetching lunar data:",
                error
            );
        });
}


// -------------------------------------------
// Get user location
// -------------------------------------------
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
