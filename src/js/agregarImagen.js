import { Dropzone } from 'dropzone';
 
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
  
};