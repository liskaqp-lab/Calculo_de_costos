// Funciones para guardar y cargar el estado
// ... (your existing saveState, loadState, resetPage functions) ...

// Funciones para la cotización y la impresión
function generateInvoice() {
    // Fill the invoice content here
    const clientName = document.getElementById('clientName').value || 'Cliente';
    const serviceType = document.getElementById('serviceType').value || 'Servicio de diseño';
    const deliveryDate = document.getElementById('deliveryDate').value || new Date().toISOString().split('T')[0];
    const productName = document.getElementById('productName').value || 'Producto o Servicio';
    const projectHours = document.getElementById('projectHours').value;
    const hourlyRate = document.getElementById('hourlyRate').textContent;
    const selectedPrice = document.getElementById('selectedPrice').textContent;

    const hourlyRateNum = parseFloat(hourlyRate.replace(/[^\d.-]/g, '')) || 0;
    const subtotal = hourlyRateNum * parseFloat(projectHours);

    document.getElementById('invoiceHours').textContent = projectHours + ' horas';
    document.getElementById('invoiceHourlyRate').textContent = hourlyRate;
    document.getElementById('invoiceSubtotal').textContent = formatCurrency(subtotal);
    document.getElementById('invoiceTotal').textContent = selectedPrice;

    const today = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('issueDate').textContent = today;
    document.getElementById('clientName').value = clientName;
    document.getElementById('serviceType').value = serviceType;
    document.getElementById('deliveryDate').value = deliveryDate;
    document.getElementById('invoiceProductName').textContent = productName;

    let taxBreakdownHTML = '';
    if (customTaxes.length > 0) {
        const taxList = customTaxes.map(tax => `${tax.name}: ${tax.rate}%`).join('<br>');
        const totalRate = customTaxes.reduce((sum, tax) => sum + tax.rate, 0);
        taxBreakdownHTML = `
            <div class="mb-2">
                <p class="font-semibold text-gray-800 mb-2">Impuestos personalizados aplicados:</p>
                <div class="text-sm">${taxList}</div>
                <div class="text-sm font-medium mt-2">Total: ${totalRate.toFixed(1)}%</div>
            </div>
        `;
    } else {
        const region = document.getElementById('region').value;
        const taxInfo = taxRates[region];
        taxBreakdownHTML = `
            <div class="mb-2">
                <p class="font-semibold text-gray-800 mb-2">Información fiscal aplicada:</p>
                <p class="text-sm">${taxInfo.breakdown}</p>
            </div>
            <div class="text-xs text-gray-500 mt-2 border-t border-gray-200 pt-2">
                <p><strong>Detalles:</strong></p>
                <div class="mt-1">${taxInfo.details}</div>
            </div>
        `;
    }
    document.getElementById('taxBreakdown').innerHTML = taxBreakdownHTML;

    // Remove hidden class from the modal to make it visible
    document.getElementById('invoiceModal').classList.remove('hidden');
}

function printInvoice() {
    window.print();
}

function closeInvoice() {
    document.getElementById('invoiceModal').classList.add('hidden');
}

// Eventos
window.addEventListener('beforeunload', saveState);
document.addEventListener('DOMContentLoaded', loadState);
