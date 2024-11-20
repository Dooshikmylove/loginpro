import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB1kHMUfZ2LATZFzqOEKwSqzDuUYjQXTqk",
    authDomain: "crud-86d3a.firebaseapp.com",
    projectId: "crud-86d3a",
    storageBucket: "crud-86d3a.firebasestorage.app",
    messagingSenderId: "860812876735",
    appId: "1:860812876735:web:99fc2588cae0587869df0a",
    measurementId: "G-DJ341ZR426"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const moviesCollection = collection(db, "peliculas");

// Variables
const movieForm = document.getElementById("movieForm");
const movieTable = document.getElementById("movieTable");
let editingId = null;

// Función para cargar las películas
async function loadMovies() {
  movieTable.innerHTML = "";
  const querySnapshot = await getDocs(moviesCollection);
  querySnapshot.forEach((doc) => {
    const movie = doc.data();
    const row = `
      <tr>
        <td>${doc.id}</td>
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${movie.director}</td>
        <td>${movie.year}</td>
        <td>${movie.rating}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editMovie('${doc.id}', ${JSON.stringify(movie).replace(/"/g, '&quot;')})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteMovie('${doc.id}')">Eliminar</button>
        </td>
      </tr>`;
    movieTable.innerHTML += row;
  });
}

// Agregar o editar película
movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newMovie = {
    title: document.getElementById("title").value,
    genre: document.getElementById("genre").value,
    director: document.getElementById("director").value,
    year: document.getElementById("year").value,
    rating: document.getElementById("rating").value
  };

  if (editingId) {
    const movieRef = doc(db, "peliculas", editingId);
    await updateDoc(movieRef, newMovie);
    editingId = null;
  } else {
    await addDoc(moviesCollection, newMovie);
  }

  movieForm.reset();
  loadMovies();
  document.querySelector(".btn-close").click();
});

// Editar película
window.editMovie = (id, movie) => {
  editingId = id;
  document.getElementById("title").value = movie.title;
  document.getElementById("genre").value = movie.genre;
  document.getElementById("director").value = movie.director;
  document.getElementById("year").value = movie.year;
  document.getElementById("rating").value = movie.rating;
  new bootstrap.Modal(document.getElementById("movieModal")).show();
};

// Eliminar película
window.deleteMovie = async (id) => {
  await deleteDoc(doc(db, "peliculas", id));
  loadMovies();
};

// Cargar películas al iniciar
loadMovies();
