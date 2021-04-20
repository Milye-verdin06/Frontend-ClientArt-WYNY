/* angular.element(document).ready(function() {
    unidad();
});

function unidad() {
    console.log("hola");
} */


$('.openBtn').on('click', function() {
    $('.modal-body').load('content.html', function() {
        $('#mymodaleditarArt').modal({ show: true });
    })
});