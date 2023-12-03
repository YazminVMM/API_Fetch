console.log("JS07 - apiFetch");

//Boton de Carga
document
  .getElementById("loadingButton")
  .addEventListener("click", function (event) {
    // Prevent the default button click behavior
    event.preventDefault();

    var spinner = this.querySelector(".spinner-border");
    spinner.classList.remove("d-none");
    this.disabled = true;

    const urlFakeStore = "https://reqres.in/api/users?delay=3";

    const getProducts = (url) => {
      fetch(url)
        .then((response) => {
          console.log("status code: " + response.status); // 200
          return response.json();
        })
        .then((personas) => {
          sendLocalstorage(personas);
          imprimirEnDOM();
          // Esta función se ejecutará cada minuto
          const pasoAsincrono = () => {
            setTimeout(() => imprimirEnDOM(), 60000);
          };

          // Llamada inicial a la función para iniciar el intervalo
          pasoAsincrono();
          spinner.classList.add("d-none");
          this.disabled = false;
        })
        .catch((error) => {
          console.log("Error en la solicitud: ");
          console.warn(error);
          spinner.classList.add("d-none");
          this.disabled = false;
        });
    };

    getProducts(urlFakeStore);
  });

function sendLocalstorage(personas) {
  const arregloPersona = personas["data"]; // ingresar al objeto y en data esta el arreglo de personas
  //almacenamiento local se puede utilizar para conservar datos entre diferentes scripts.
  // Saving the object to localStorage
  localStorage.setItem("persona", JSON.stringify(arregloPersona));
  //console.table(arregloPersona);
}

function datesHours(){
  // Getting the current date and time
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  // Creating an object to store both personas and the current date and time
  const dataToStore = {
    date: dateStr,
    time: timeStr,
  };
  localStorage.setItem("dateHour", JSON.stringify(dataToStore));
}

function imprimirEnDOM() {
  datesHours();
  let dateHourString = localStorage.getItem("dateHour");
  console.log(dateHourString);
  const personasContainer = document.getElementById("date-hour");
  personasContainer.innerHTML = dateHourString.replace(/["{}]/g, "");

  //Extrae los datos de LocalStorage
  let storedData = localStorage.getItem("persona"); // esto devuelve un strig
  let personaJSON = JSON.parse(storedData); // convesion de string a JSON
  //console.log(typeof(personaJSON));
  console.table(personaJSON);
  if (storedData) {
    const personasContainer = document.getElementById("personas-container"); //toma el
    const persona = personaJSON.map(
      //conversion a arreglo e impromir de DOM
      (persona, index, array) => `
            <div class="card" style="width: 18rem; margin: 0.5rem;">
            <img src="${persona.avatar}" class="rounded-circle mx-auto d-block" style="width: 100px; height: 100px; margin: 1rem;" alt="Circular Image" alt="...">
            <div class="card-body">
            <h5 class="card-title">${persona.first_name} ${persona.last_name}</h5>
              <p class="card-text"> ID: ${persona.id} </p>
              <p class="card-text"> Email: ${persona.email} </p>
            </div>
          </div>
        `
    );
    personasContainer.innerHTML = persona.join(""); //imprime en el HTML, join quita las comas
  } else {
    console.log("Data not found.");
  }
}
