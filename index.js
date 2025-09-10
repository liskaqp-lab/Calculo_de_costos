
document.getElementById('btn-generar-cotizacion')?.addEventListener('click', () => {
  document.getElementById('fecha-emision').textContent = new Date().toLocaleDateString();
  document.getElementById('modal-cotizacion').hidden = false;
});

document.getElementById('btn-cerrar')?.addEventListener('click', () => {
  document.getElementById('modal-cotizacion').hidden = true;
});
document.getElementById('btn-cerrar-2')?.addEventListener('click', () => {
  document.getElementById('modal-cotizacion').hidden = true;
});

document.getElementById('btn-imprimir')?.addEventListener('click', () => {
  const modalBody = document.querySelector('#modal-cotizacion .modal-body');
  const prev = { overflow: modalBody.style.overflow, maxHeight: modalBody.style.maxHeight };
  modalBody.style.overflow = 'visible';
  modalBody.style.maxHeight = 'none';
  setTimeout(() => {
    window.print();
    setTimeout(() => {
      modalBody.style.overflow = prev.overflow;
      modalBody.style.maxHeight = prev.maxHeight;
    }, 150);
  }, 30);
});
