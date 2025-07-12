import Swal from 'sweetalert2';

export function mostrarAlertaExito(){
  Swal.fire({
    title: '¡Reserva confirmada!',
    text: 'Tu cancha ha sido reservada exitosamente.',
    icon: 'success',
    confirmButtonText: 'Aceptar',
  });
};

export function mostrarAlertaError(mensaje: string){
  Swal.fire({
    title: 'Error',
    text: mensaje,
    icon: 'error',
    confirmButtonText: 'Aceptar',
  });
};