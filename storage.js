// Utilidad para escribir texto de forma segura
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function generateInvoice() {
  // Lee valores de los inputs (con fallback)
  const clientName   = (document.getElementById('clientName')?.value || 'Cliente').trim();
  const serviceType  = (document.getElementById('serviceType')?.value || 'Servicio de diseño').trim();
  const deliveryDate = (document.getElementById('deliveryDate')?.value || new Date().toISOString().split('T')[0]).trim();
  const productName  = (document.getElementById('productName')?.value || 'Producto o Servicio').trim();

  const projectHours    = parseFloat(document.getElementById('projectHours')?.value || 0) || 0;
  const hourlyRateText  = document.getElementById('hourlyRate')?.textContent || '$0';
  const hourlyRateNum   = parseFloat(hourlyRateText.replace(/[^\d.\-]/g, '')) || 0;
  const selectedPrice   = document.getElementById('selectedPrice')?.textContent || '$0';

  const subtotal = projectHours * hourlyRateNum;

  // Llena la vista previa (NO los inputs)
  setText('invoiceProductName',   productName);
  setText('issueDate',            new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }));
  setText('invoiceClientName',    clientName);
  setText('invoiceServiceType',   serviceType);
  setText('invoiceDeliveryDate',  deliveryDate);
  setText('invoiceHours',         `${projectHours} horas`);
  setText('invoiceHourlyRate',    hourlyRateText);
  setText('invoiceSubtotal',      formatCurrency(subtotal));
  setText('invoiceTotal',         selectedPrice);

  // Impuestos
  let taxBreakdownHTML = '';
  if (customTaxes.length > 0) {
    const taxList  = customTaxes.map(tax => `${tax.name}: ${tax.rate}%`).join('\n');
    const totalRate = customTaxes.reduce((sum, tax) => sum + tax.rate, 0);
    taxBreakdownHTML = `
      <strong>Impuestos personalizados aplicados:</strong><br/>
      ${taxList.replaceAll('\n','<br/>')}<br/>
      <em>Total: ${totalRate.toFixed(1)}%</em>
    `;
  } else {
    const region  = document.getElementById('region')?.value;
    const taxInfo = taxRates[region];
    taxBreakdownHTML = `
      <strong>Información fiscal aplicada:</strong><br/>
      ${taxInfo.breakdown}<br/>
      <em>Detalles:</em><br/>
      ${taxInfo.details}
    `;
  }
  const taxDiv = document.getElementById('taxBreakdown');
  if (taxDiv) taxDiv.innerHTML = taxBreakdownHTML;

  // Muestra el modal
  document.getElementById('invoiceModal')?.classList.remove('hidden');
}
document.addEventListener('DOMContentLoaded', () => {
  // Guardado/carga de estado (ya los tienes)
  // window.addEventListener('beforeunload', saveState);
  // loadState();

  // Botones del modal (se registran UNA sola vez)
  document.getElementById('btnPrint')?.addEventListener('click', () => window.print());
  document.getElementById('btnClose')?.addEventListener('click', () => {
    document.getElementById('invoiceModal')?.classList.add('hidden');
  });
});
