const API_URL = "/api";


// ===============================
// LOAD SHOWS
// ===============================

async function loadShows() {

    const container = document.getElementById("showsContainer");

    container.innerHTML = `
        <p class="loading">Loading shows...</p>
    `;

    try {

        const response = await fetch(`${API_URL}/shows`);

        if (!response.ok) {
            throw new Error("Failed to load shows");
        }

        const shows = await response.json();

        displayShows(shows);

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <p>
                Unable to load shows.
                Make sure the Spring Boot server is running.
            </p>
        `;
    }
}


// ===============================
// DISPLAY SHOWS
// ===============================

function displayShows(shows) {

    const container = document.getElementById("showsContainer");

    if (shows.length === 0) {

        container.innerHTML = `
            <p class="loading">
                No shows available.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    shows.forEach(show => {

        const card = document.createElement("div");

        card.className = "show-card";

        card.innerHTML = `

            <h3>${show.title}</h3>

            <p>
                📅 ${formatDate(show.showTime)}
            </p>

            <p class="seats">
                🎟 Total Seats: ${show.totalSeats}
            </p>

            <button onclick="viewSeats(${show.id})">
                Check Seats
            </button>

            <p id="seat-${show.id}"></p>

        `;

        container.appendChild(card);

    });
}


// ===============================
// CHECK SEATS
// ===============================

async function viewSeats(id) {

    const seatElement =
        document.getElementById(`seat-${id}`);

    seatElement.innerText = "Checking seats...";


    try {

        const response =
            await fetch(`${API_URL}/shows/${id}/seats`);


        if (!response.ok) {
            throw new Error("Unable to check seats");
        }


        const data = await response.json();


        seatElement.innerText =
            `Available Seats: ${data.availableSeats}`;

    } catch (error) {

        console.error(error);

        seatElement.innerText =
            "Unable to get seat availability.";
    }
}


// ===============================
// CREATE SHOW
// ===============================

document
    .getElementById("showForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        const title =
            document.getElementById("title").value;

        const showTime =
            document.getElementById("showTime").value;

        const totalSeats =
            Number(
                document.getElementById("totalSeats").value
            );


        const message =
            document.getElementById("message");


        const showData = {

            title: title,

            showTime: showTime,

            totalSeats: totalSeats

        };


        try {

            const response = await fetch(
                `${API_URL}/shows`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(showData)
                }
            );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(errorText);
            }


            const createdShow =
                await response.json();


            message.style.color = "green";

            message.innerText =
                "Show created successfully!";


            document
                .getElementById("showForm")
                .reset();


            loadShows();


        } catch (error) {

            console.error(error);

            message.style.color = "red";

            message.innerText =
                "Failed to create show.";
        }

    });


// ===============================
// FORMAT DATE
// ===============================

function formatDate(dateString) {

    const date = new Date(dateString);

    return date.toLocaleString();
}