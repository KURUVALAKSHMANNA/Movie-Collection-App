const apiKey = "81776180";
const baseUrl = "https://www.omdbapi.com/";

// show register page
function showRegister() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("registerPage").style.display = "block";
    document.getElementById("loginError").textContent = "";
}

// show login page
function showLogin() {
    document.getElementById("registerPage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("registerMsg").textContent = "";
    document.getElementById("registerError").textContent = "";
}

// register user
async function registerUser() {
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    const registerMsg = document.getElementById("registerMsg");
    const registerError = document.getElementById("registerError");

    registerMsg.textContent = "";
    registerError.textContent = "";

    if (name === "" || email === "" || password === "") {
        registerError.textContent = "Please fill all fields";
        return;
    }

    try {
        const res = await fetch("users.json");
        const jsonUsers = await res.json();

        let localUsers = JSON.parse(localStorage.getItem("users")) || [];

        const allUsers = [...jsonUsers, ...localUsers];

        const existingUser = allUsers.find(function(user) {
            return user.email === email;
        });

        if (existingUser) {
            registerError.textContent = "Account already exists";
            return;
        }

        localUsers.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem("users", JSON.stringify(localUsers));

        registerMsg.textContent = "Account created successfully. Now login.";

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";
    } catch (error) {
        registerError.textContent = "Error creating account";
        console.error(error);
    }
}

// login
async function login() {
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();
    const loginError = document.getElementById("loginError");

    loginError.textContent = "";

    try {
        const res = await fetch("users.json");
        const jsonUsers = await res.json();

        const localUsers = JSON.parse(localStorage.getItem("users")) || [];
        const allUsers = [...jsonUsers, ...localUsers];

        const user = allUsers.find(function(u) {
            return u.email === email && u.password === password;
        });

        if (user) {
            document.getElementById("loginPage").style.display = "none";
            document.getElementById("registerPage").style.display = "none";
            document.getElementById("moviePage").style.display = "block";
        } else {
            loginError.textContent = "Invalid email or password";
        }
    } catch (err) {
        loginError.textContent = "Error loading users";
        console.error(err);
    }
}

// logout
function logout() {
    document.getElementById("moviePage").style.display = "none";
    document.getElementById("loginPage").style.display = "block";

    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("searchInput").value = "";
    document.getElementById("movieList").innerHTML = "";
    document.getElementById("loginError").textContent = "";
}

// search movies
async function searchMovies() {
    const searchTerm = document.getElementById("searchInput").value.trim();
    const movieList = document.getElementById("movieList");

    if (searchTerm === "") {
        movieList.innerHTML = "<p>Please enter a movie name</p>";
        return;
    }

    const apiUrl = `${baseUrl}?apikey=${apiKey}&s=${searchTerm}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        movieList.innerHTML = "";

        if (data.Response === "True") {
            data.Search.forEach(function(movie) {
                const li = document.createElement("li");
                li.classList.add("movie-card");

                li.innerHTML = `
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}" alt="${movie.Title}">
                    <h3>${movie.Title}</h3>
                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>Type:</strong> ${movie.Type}</p>
                `;

                movieList.appendChild(li);
            });
        } else {
            movieList.innerHTML = "<p style='color:red;'>Movie not found</p>";
        }
    } catch (error) {
        movieList.innerHTML = "<p style='color:red;'>Error fetching movies</p>";
        console.error(error);
    }
}