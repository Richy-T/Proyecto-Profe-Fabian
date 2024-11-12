
// Espera que el contenido de la pagina se refresque o cargue para continuar su ejecucion
document.addEventListener("DOMContentLoaded", () => {

    // Obtiene la referencia al formulario y los botones en el DOM
    const form = document.getElementById("personaForm");
    // const updateBtn = document.getElementById("updateBtn");
    const tableBody = document.querySelector("#personaTable tbody");

    fetchPersonas();
    let isEditing = false;      // Variable para Saber cuando se actualiza un registro
    //viernes 1 
    let actualCedula = "null"; // Variable para guardar la cédula


    // Obtener la lista de registros de la tabla persona
    function fetchPersonas() {
        fetch("/api/obtener")
            .then((response) => response.json())
            .then((data) => renderPersonas(data.data))
            .catch((error) => console.log("Error en el fetching de personas", error));
    }

    // Renderizar la tabla de visualizacion de registros
    function renderPersonas(personas) {
        tableBody.innerHTML = ""; // Limpia la tabla antes de agregar los datos.
        personas.forEach((persona) => {
            // Crea una fila para cada persona.
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${persona.Cedula}</td>
            <td>${persona.Nombre}</td>
            <td>${persona.Edad}</td>
            <td>${persona.Profesion}</td>
            <td class="actions">
                <button class="button-edt" onclick="editPersona('${persona.Cedula}')">Editar</button>
                <button class="button-del" onclick="deletePersona('${persona.Cedula}')">Eliminar</button>
            </td>`;
            tableBody.appendChild(row); // Agrega la fila a la tabla.
        });
    }
                    //Viernes 1 de Noviembre
    // fetchPersonas();
    // manejo de los eventos del formulario
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        // Obtenemos los datos del formulario y guardamos en variables
        const Cedula = form.Cedula.value;
        const Nombre = form.Nombre.value;
        const Edad = form.Edad.value;
        const Profesion = form.Profesion.value;

        //Datos de la persona a registrar en la Tabla Persona
        const personaData = { Cedula, Nombre, Edad, Profesion };


        if(isEditing){
            //si se esta en mod de edicion de datos con la cedula actual de ese registro
            updatePersona(actualCedula, personaData);
        }
        else{
            // Si voy a realizar un nuevo registro
            createPersona(personaData);
        }
       
    });

    //Función para Agregar un nueo registro a persona.
    function createPersona(persona){
        fetch("/api/guardar", {    // Enviar los datos al API para crear una nueva persona
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(persona),
        })
            .then(fetchPersonas) //=> response.json()) Refresca la lista de registros mostrados  en la tala
            .catch((error) => console.error("Error creating persona:", error));
    }
// Función para editar una persona. Obtiene los datos de una persona usando 
    //su cédula y los muestra en el formulario.
    window.editPersona = (cedula) => {
        isEditing = true; // Cambia a modo edición.
        actualCedula = cedula; // Almacena la cédula de la persona que se está editando.

        // Solicita los datos de la persona usando la API.
        fetch(`/api/obtener/${cedula}`)
            .then(() => {
                const row = Array.from(document.querySelectorAll('#personaTable tbody tr'))
                    .find(tr => tr.cells[0].textContent === cedula);

                document.getElementById('cedula').value = row.cells[0].textContent;
                document.getElementById('nombre').value = row.cells[1].textContent;
                document.getElementById('edad').value = row.cells[2].textContent;
                document.getElementById('profesion').value = row.cells[3].textContent;

                actualCedula = cedula;  // Establece el cedula actual
                document.getElementById('submitBtn').style.display = 'inline';

            })
            .catch((error) => console.error("Error al obtener datos de la persona:", error))
    };


   // Función para actualizar una persona.
   function updatePersona(Cedula, updatedData) {
    isEditing = false;
    fetch(`/api/actualizar/${Cedula}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
    })
        .then(() => {  // Refresca la lista de registros mostrados en la tala
            fetchPersonas(); // Refresca la lista de personas.
            resetForm(); // Resetea el formulario.
        })
        .catch((error) => console.error("Error updating persona:", error));
       
    }
   
    window.deletePersona = (Cedula) => {
        fetch(`/api/eliminar/${Cedula}`, { method: "DELETE" })
            .then(fetchPersonas)
            .catch((error) => console.error("Error Al borrar el registro", error));
    };

    function resetForm() {
        form.reset();
        isEditing = false;
        actualCedula = null; // Reseteamos la cédula actual.
        // document.getElementById('submitBtn').style.display = 'none';
    }

});