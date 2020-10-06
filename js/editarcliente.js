(function() {
    let DB;
    let idCliente;
    
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () =>{
        conectarDB();

        // Verifica el id desde la url
        const parametroURL = new URLSearchParams(window.location.search);
        idCliente = parametroURL.get('id');
        if(idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100)
        }
    })

    function actualizarCliente(e) {
        e.preventDefault();
        if(nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput === '' ) {
            imprimirAlerta('All fields are requiered', 'error');
            return;
        }
    
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            telefono: telefonoInput.value,
            id: Number(idCliente) // de String
        };
        
        // console.log(clienteActualizado)
        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm')

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){
            imprimirAlerta('Correctly edited');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };

        transaction.onerror = function(){
            imprimirAlerta('There was an error', 'error');
        }
    }

    function obtenerCliente(id) {
        // console.log(id);
        const transaction = DB.transaction(['crm'], 'readonly');
        const objectStore = transaction.objectStore('crm');

        // console.log(objectStore);
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor) {
                // console.log(cursor.value);
                if(cursor.value.id === Number(id)){
                    // console.log(cursor.value)
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        empresaInput.value = empresa;
        emailInput.value = email;
        telefonoInput.value = telefono;
    }

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1) // Si la BD no existe, la crea y si ya existe se conecta!

        abrirConexion.onerror = function() {
            console.log('There was an error');
        }

        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
        }
    }
})();