// Логика управления палитрой и переключением ДЕНЬ/НОЧЬ
const themeBtn = document.getElementById('theme-btn');
const htmlEl = document.documentElement;

function updateColors() {
    const accent = document.getElementById('accentPicker').value;
    const bg1 = document.getElementById('bg1Picker').value;
    const bg2 = document.getElementById('bg2Picker').value;
    
    htmlEl.style.setProperty('--accent-color', accent);
    htmlEl.style.setProperty('--bg-color-1', bg1);
    htmlEl.style.setProperty('--bg-color-2', bg2);
}

// Привязываем события изменений на палитры
document.getElementById('accentPicker').addEventListener('change', updateColors);
document.getElementById('bg1Picker').addEventListener('change', updateColors);
document.getElementById('bg2Picker').addEventListener('change', updateColors);

themeBtn.addEventListener('click', () => {
    const isLight = htmlEl.getAttribute('data-theme') === 'light';
    htmlEl.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeBtn.innerText = isLight ? "☀️ Светлая" : "🌙 Темная";
    
    if (!isLight) {
        document.getElementById('bg1Picker').value = "#e0eafc";
        document.getElementById('bg2Picker').value = "#cfdef3";
    } else {
        document.getElementById('bg1Picker').value = "#0f172a";
        document.getElementById('bg2Picker').value = "#1e1b4b";
    }
    updateColors();
});
