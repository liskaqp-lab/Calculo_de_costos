// Función para guardar los datos
function saveState() {
    // Los datos complejos como objetos y arrays deben convertirse a JSON string
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

// Función para cargar los datos
function loadState() {
    const savedData = localStorage.getItem('freelanceCalculatorData');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Asignar los valores guardados a las variables y elementos de la página
        expenses = data.expenses || {};
        customCategories = data.customCategories || {};
        customTaxes = data.customTaxes || [];
        selectedPriceType = data.selectedPriceType || 'minimum';
        
        document.getElementById('region').value = data.region || 'guatemala';
        document.getElementById('productName').value = data.productName || '';
        document.getElementById('hoursPerDay').value = data.hoursPerDay || '8';
        document.getElementById('daysPerMonth').value = data.daysPerMonth || '22';
        document.getElementById('projectHours').value = data.projectHours || '40';

        // Recrear las categorías personalizadas en la interfaz
        for (const key in customCategories) {
            if (customCategories.hasOwnProperty(key)) {
                createCategoryCard(key, customCategories[key].name, customCategories[key].emoji);
                // También agregarlas al dropdown
                const dropdown = document.getElementById('expenseCategory');
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${customCategories[key].emoji} ${customCategories[key].name}`;
                const otrosOption = dropdown.querySelector('option[value="otros"]');
                dropdown.insertBefore(option, otrosOption);
            }
        }
        
        // Actualizar todos los elementos de la interfaz con los datos cargados
        updateRegion();
        updateCustomTaxesDisplay();
        Object.keys(expenses).forEach(category => {
            updateCategoryDisplay(category);
        });
        updateAllTotals();
        calculateHourlyRate();
        selectPrice(selectedPriceType);

        console.log('Datos cargados desde localStorage.');
        // ... (tu código actual de storage.js)

function resetPage() {
    // 1. Preguntar al usuario si está seguro
    if (confirm("¿Estás seguro de que quieres restablecer la calculadora? Se perderán todos los datos guardados.")) {
        
        // 2. Borrar todos los datos de localStorage
        localStorage.removeItem('freelanceCalculatorData');
        
        // 3. Recargar la página para que se cargue con los valores por defecto
        window.location.reload();
    }
}

// ... (resto de tu código de storage.js)
    }
}

// Eventos para guardar los datos automáticamente al salir o cambiar
window.addEventListener('beforeunload', saveState);

// Evento para cargar los datos al iniciar la página
document.addEventListener('DOMContentLoaded', loadState);
