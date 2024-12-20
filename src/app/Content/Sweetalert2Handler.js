function sawl(message, icon, type) {
    Swal.fire({
        icon: type,
        title: message,
    })
}

function showDialog_swal(title = 'Oops...', message = something_went_wrong_msg, icon= 'info') {
    Swal.fire({
        icon: icon,
        title: title,
        html: message,
    })
}



//FUNCION QUE MUESTRA EL MENSAJE DE DIALOG
function showDialog_Mensaje(Title, html) {
    Swal.fire({
        title: Title,
        html: html,
        allowOutsideClick: false
    });
}

//FUNCTION QUE MOSTRARA EL CARGANDO
function Loading_Mostrar(TextTit, TextMes) {
    Swal.fire({
        title: TextTit,
        html: TextMes,
        didOpen: () => {
            Swal.showLoading();
            Swal.stopTimer()
        },
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

//FUNCION QUE CERRARA EL CARGANDO
function Loading_Close() {
    Swal.close();
}
