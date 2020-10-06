(function() {
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();
   
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value; // V :(
        const empresa = document.querySelector('#empresa').value;
       
        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('All fields are required ', 'error');
            return;
        }

        const cliente = { // Lo opuesto a destructuring
            nombre, // nombre : nombre,
            email,
            telefono,
            empresa
            // id = Date.now();
        }

        cliente.id = Date.now();

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite'); // Se conecta
        const objectStore = transaction.objectStore('crm'); // Indica que utilizará una transaccion

        objectStore.add(cliente);

        transaction.onerror = function(){
            // console.log('There was an error');
            imprimirAlerta('There was an error', 'error');
        }

        transaction.oncomplete = function(){
            // console.log('Added customer');
            imprimirAlerta('New customer added correctly');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }

})();


