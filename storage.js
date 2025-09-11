// === Eventos de ciclo de vida (mantiene tus funciones si ya existen) ===
window.addEventListener('beforeunload', () => {
  try { if (typeof saveState === 'function') saveState(); } catch (_) {}
});

document.addEventListener('DOMContentLoaded', () => {
  try { if (typeof loadState === 'function') loadState(); } catch (_) {}

  // Registrar listeners del modal UNA sola vez
  const btnPrint = document.getElementById('btnPrint');
  if (btnPrint && !btnPrint.dataset.bound) {
    btnPrint.addEventListener('click', printInvoice);
    btnPrint.dataset.bound = 'true';
  }

  const btnClose = document.getElementById('btnClose');
  if (btnClose && !btnClose.dataset.bound) {
    btnClose.addEventListener('click', closeInvoice);
    btnClose.dataset.bound = 'true';
  }
});

// === Utilidades ===
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// Fallback si no tienes uno propio
function formatCurrency(n) {
  try {
    return (Number(n) || 0).toLocaleString('es-GT', { style: 'currency', currency: 'USD' });
  } catch {
    return `$${(Number(n) || 0).toFixed(2)}`;
  }
}

// === Generación de cotización e impresión ===
function generateInvoice() {
  // Lee valores desde el formulario (con fallback)
  const clientName   = (document.getElementById('clientName')?.value || 'Cliente').trim();
  const serviceType  = (document.getElementById('serviceType')?.value || 'Servicio de diseño').trim();
  const deliveryDate = (document.getElementById('deliveryDate')?.value || new Date().toISOString().split('T')[0]).trim();
  const productName  = (document.getElementById('productName')?.value || 'Producto o Servicio').trim();

  const projectHours   = parseFloat(document.getElementById('projectHours')?.value || 0) || 0;
  const hourlyRateText = document.getElementById('hourlyRate')?.textContent || '$0';
  const hourlyRateNum  = parseFloat(hourlyRateText.replace(/[^\d.\-]/g, '')) || 0;
  const selectedPrice  = document.getElementById('selectedPrice')?.textContent || '$0';

  const subtotal = projectHours * hourlyRateNum;

  // Rellena la vista previa (no tocar inputs)
  setText('invoiceProductName',  productName);
  setText('issueDate',           new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }));
  setText('invoiceClientName',   clientName);
  setText('invoiceServiceType',  serviceType);
  setText('invoiceDeliveryDate', deliveryDate);
  setText('invoiceHours',        `${projectHours} horas`);
  setText('invoiceHourlyRate',   hourlyRateText);
  setText('invoiceSubtotal',     formatCurrency(subtotal));
  setText('invoiceTotal',        selectedPrice);

  // Impuestos
  let taxBreakdownHTML = '';
  const region = document.getElementById('region')?.value;

  if (Array.isArray(window.customTaxes) && window.customTaxes.length > 0) {
    const taxList = window.customTaxes.map(t => `${t.name}: ${t.rate}%`).join('<br/>');
    const totalRate = window.customTaxes.reduce((sum, t) => sum + Number(t.rate || 0), 0);
    taxBreakdownHTML = `
      <div><strong>Impuestos personalizados aplicados:</strong></div>
      <div>${taxList}</div>
      <div><em>Total: ${totalRate.toFixed(1)}%</em></div>
    `;
  } else if (window.taxRates && region && window.taxRates[region]) {
    const taxInfo = window.taxRates[region];
    taxBreakdownHTML = `
      <div><strong>Información fiscal aplicada:</strong></div>
      <div>${taxInfo.breakdown || ''}</div>
      <div><em>Detalles:</em></div>
      <div>${taxInfo.details || ''}</div>
    `;
  }

  const taxDiv = document.getElementById('taxBreakdown');
  if (taxDiv) taxDiv.innerHTML = taxBreakdownHTML;

  // Muestra el modal de la cotización
  document.getElementById('invoiceModal')?.classList.remove('hidden');
}

function printInvoice() {
  window.print();
}

function closeInvoice() {
  document.getElementById('invoiceModal')?.classList.add('hidden');
}

// (Opcional) expone funciones si usas atributos HTML onClick
window.generateInvoice = generateInvoice;
window.printInvoice = printInvoice;
window.closeInvoice = closeInvoice;
