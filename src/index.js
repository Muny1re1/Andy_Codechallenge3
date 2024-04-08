document.addEventListener("DOMContentLoaded", function () {
    fetchFilms();
});//adding an event listener that calls the fetchFilms function once DOM content is loaded.
function fetchFilms() {
    fetch("http://localhost:3000/films")//using fetch() to send  a GET request to our json server.
        .then(response => response.json())
        .then(data => {//calling on multiple functions after the dom content loads.
            displayFirstMovieInformation(data);
            menuOnLeft(data);
            updateTicketNumbers(data);
        })
        .catch(error => console.log(error));//adding a catch error for handling any other errors that might occur
}
//Creating a function to display the first movie's information.
function displayFirstMovieInformation(data) {
    const poster = document.getElementById("poster");
    if (!data) {
        alert("Error occurred while fetching")
    }
    if (data.length > 0) {
        poster.src = data[0].poster
    }
    const title = document.getElementById("title")
    title.innerHTML = data[0].title;

    const runtime = document.getElementById("runtime");
    runtime.innerHTML = data[0].runtime + " minutes";

    const film_info = document.getElementById("film-info");
    film_info.innerHTML = data[0].description;

    const showtime = document.getElementById("showtime");
    showtime.innerHTML = data[0].showtime;

    const ticketsRemaining = document.getElementById("ticket-num");
    ticketsRemaining.innerHTML = (data[0].capacity) - (data[0].tickets_sold)
}
//Creating a functio  to display the movies on the side menu, send a delete request to the server and handle updating of ticketnumbers.
function menuOnLeft(data) {
    const list = document.getElementsByTagName("ul");

    for (let key in data) {
        const film = data[key];
        const li = document.createElement("li");
        li.innerHTML = film.title;
        list[0].appendChild(li);

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "Delete";
        deleteButton.style.backgroundColor = "rgb(215, 215, 215)"
        li.appendChild(deleteButton);
        deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:3000/films/${film.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        alert(response.statusText);
                    }
                    return response.json()
                })
                .then(() => {
                    fetchFilms();
                })
                .catch(error => console.log(error));
        });

        li.addEventListener("click", () => {
            const title = document.getElementById("title");
            title.innerHTML = film.title;
            const runtime = document.getElementById("runtime");
            runtime.innerHTML = film.runtime + " minutes";
            const film_info = document.getElementById("film-info");
            film_info.innerHTML = film.description;
            const showtime = document.getElementById("showtime");
            showtime.innerHTML = film.showtime;
            const ticketsRemaining = document.getElementById("ticket-num");
            ticketsRemaining.innerHTML = film.capacity - film.tickets_sold;
            const poster = document.getElementById("poster");
            poster.src = film.poster;

            const buyTickets = document.getElementById("buy-ticket");
            buyTickets.innerHTML = film.tickets_sold >= film.capacity ? "TICKETS SOLD OUT!" : "BUY TICKETS";
            if (film.tickets_sold >= film.capacity) {
                li.classList.add("tickets-sold-out");
            } else {
                li.classList.remove("tickets-sold-out");
            }

            buyTickets.onclick = () => {
                if (film.tickets_sold < film.capacity) {
                    film.tickets_sold++;
                    ticketsRemaining.textContent = film.capacity - film.tickets_sold;
                }

                if (film.tickets_sold >= film.capacity) {
                    buyTickets.innerHTML = "TICKETS SOLD OUT!";
                    li.classList.add("tickets-sold-out");
                }
            };
        });
    }
}
    

//Creating a separate function to update the ticket numbers of the initially displayed movie

function updateTicketNumbers(data) {
    const buyTickets = document.getElementById("buy-ticket");
    const ticketsRemaining = document.getElementById("ticket-num");

    if (!data || data.length === 0) {
        console.log("Error occurred while updating ticket numbers");
        return;
    }

    buyTickets.onclick = () => {
        const movie = data[0]; 
        const newTickets = movie.tickets_sold + 1; 
        movie.tickets_sold = newTickets; 
        ticketsRemaining.textContent = movie.capacity - newTickets; 

        if (newTickets === movie.capacity || (movie.capacity - newTickets) < 0) {
            ticketsRemaining.textContent = "No more";
            buyTickets.textContent = "SOLD OUT";
        }
        if (newTickets > movie.capacity){
            buyTickets.disabled = true;
        }
    };
}
