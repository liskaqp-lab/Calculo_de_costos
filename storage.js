// Funciones para guardar y cargar el estado
function saveState() {
    const dataToSave = {
        expenses: expenses,
        customCategories: customCategories,
        customTaxes: customTaxes,
        selectedPriceType: selectedPriceType,
        region: document.getElementById('region').value,
        productName: document.getElementById('productName').value,
        hoursPerDay: document.getElementById('hoursPerDay').value,
        daysPerMonth: document.getElementById('daysPerMonth').value,
        projectHours: document.getElementById('projectHours').value
    };
    
    localStorage.setItem('freelanceCalculatorData', JSON.stringify(dataToSave));
    console.log('Datos guardados en localStorage.');
}

function loadState() {
    const savedData = localStorage.getItem('freelanceCalculatorData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        expenses = data.expenses || {};
        customCategories = data.customCategories || {};
        customTaxes = data.customTaxes || [];
        selectedPriceType = data.selectedPriceType || 'minimum';
        
        document.getElementById('region').value = data.region || 'guatemala';
        document.getElementById('productName').value = data.productName || '';
        document.getElementById('hoursPerDay').value = data.hoursPerDay || '8';
        document.getElementById('daysPerMonth').value = data.daysPerMonth || '22';
        document.getElementById('projectHours').value = data.projectHours || '40';

        for (const key in customCategories) {
            if (customCategories.hasOwnProperty(key)) {
                createCategoryCard(key, customCategories[key].name, customCategories[key].emoji);
                const dropdown = document.getElementById('expenseCategory');
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${customCategories[key].emoji} ${customCategories[key].name}`;
                const otrosOption = dropdown.querySelector('option[value="otros"]');
                dropdown.insertBefore(option, otrosOption);
            }
        }
        
        updateRegion();
        updateCustomTaxesDisplay();
        Object.keys(expenses).forEach(category => {
            updateCategoryDisplay(category);
        });
        updateAllTotals();
        calculateHourlyRate();
        selectPrice(selectedPriceType);

        console.log('Datos cargados desde localStorage.');
    }
}

function resetPage() {
    if (confirm("¿Estás seguro de que quieres restablecer la calculadora? Se perderán todos los datos guardados.")) {
        localStorage.removeItem('freelanceCalculatorData');
        window.location.reload();
    }
}

// Funciones para la cotización y la impresión
function generateInvoice() {
    document.body.classList.add('print-mode');
    document.getElementById('invoiceModal').classList.remove('hidden');
}

function printInvoice() {
    window.print();
}

function closeInvoice() {
    document.getElementById('invoiceModal').classList.add('hidden');
    document.body.classList.remove('print-mode');
}

// Eventos
window.addEventListener('beforeunload', saveState);
document.addEventListener('DOMContentLoaded', loadState);
