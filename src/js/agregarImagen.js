import { Dropzone } from 'dropzone';

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
  dictDefaultMessage: 'Sube tus imágenes aqui',
  acceptedFiles: '.png,.jpg,.jpeg,.webp',
  maxFilesize:5,
  mazFiles:1,
  paralleUploads:1,
  autoProcessQueue:false,
  addRemoveLinks:true,
  dictDefaultFile:'Borrar archivo',
  dictMaxFilesExceeded:'El límite es 1 archivo',
  headers:{
    'CSRF-Token':token//generando y leyendo para comunicaar libreria con package
  },
  paramName:'imagen'
} 