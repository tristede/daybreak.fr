// Variables globales
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

// Éléments DOM
const widget = document.getElementById('server-status-widget');
const header = widget.querySelector('.widget-header');
const closeBtn = document.getElementById('close-widget');
const reopenBtn = document.getElementById('reopen-widget');

// ===== FONCTIONNALITÉ DE DÉPLACEMENT =====

header.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', stopDragging);

function startDragging(e) {
    // Ne pas démarrer le drag si on clique sur le bouton de fermeture
    if (e.target === closeBtn) return;
    
    isDragging = true;
    offsetX = e.clientX - widget.offsetLeft;
    offsetY = e.clientY - widget.offsetTop;
    widget.classList.add('dragging');
}

function drag(e) {
    if (!isDragging) return;
    
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    
    // Limites pour garder le widget dans la fenêtre
    const maxX = window.innerWidth - widget.offsetWidth;
    const maxY = window.innerHeight - widget.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    widget.style.left = newX + 'px';
    widget.style.top = newY + 'px';
    widget.style.right = 'auto';
    widget.style.bottom = 'auto';
    
    // Sauvegarder la position
    savePosition(newX, newY);
}

function stopDragging() {
    isDragging = false;
    widget.classList.remove('dragging');
}

// ===== FONCTIONNALITÉ DE FERMETURE/RÉOUVERTURE =====

closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeWidget();
});

closeBtn.addEventListener('mousedown', (e) => {
    e.stopPropagation();
});

reopenBtn.addEventListener('click', openWidget);

function closeWidget() {
    widget.classList.add('hidden');
    setTimeout(() => {
        widget.style.display = 'none';
        reopenBtn.style.display = 'block';
    }, 300);
    localStorage.setItem('widgetVisible', 'false');
}

function openWidget() {
    widget.style.display = 'block';
    setTimeout(() => {
        widget.classList.remove('hidden');
    }, 10);
    reopenBtn.style.display = 'none';
    localStorage.setItem('widgetVisible', 'true');
}

// ===== SAUVEGARDE ET RESTAURATION =====

function savePosition(x, y) {
    localStorage.setItem('widgetX', x);
    localStorage.setItem('widgetY', y);
}

function restorePosition() {
    const x = localStorage.getItem('widgetX');
    const y = localStorage.getItem('widgetY');
    
    if (x !== null && y !== null) {
        widget.style.left = x + 'px';
        widget.style.top = y + 'px';
        widget.style.right = 'auto';
    }
}

function restoreVisibility() {
    const isVisible = localStorage.getItem('widgetVisible');
    if (isVisible === 'false') {
        widget.style.display = 'none';
        widget.classList.add('hidden');
        reopenBtn.style.display = 'block';
    }
}

// ===== MISE À JOUR DU STATUT SERVEUR =====

// Fonction pour mettre à jour le statut (exemple)
function updateServerStatus() {
    // Remplacez ceci par votre vraie API de statut serveur
    // Exemple avec une API Minecraft
    /*
    fetch('https://api.mcsrvstat.us/2/votre-serveur.com')
        .then(response => response.json())
        .then(data => {
            const stateElement = document.getElementById('server-state');
            const playersElement = document.getElementById('player-count');
            
            if (data.online) {
                stateElement.textContent = 'En ligne';
                stateElement.className = 'status-online';
                playersElement.textContent = `${data.players.online}/${data.players.max}`;
            } else {
                stateElement.textContent = 'Hors ligne';
                stateElement.className = 'status-offline';
                playersElement.textContent = '0/0';
            }
        })
        .catch(error => {
            console.error('Erreur de récupération du statut:', error);
        });
    */
}

// ===== INITIALISATION =====

window.addEventListener('load', () => {
    restorePosition();
    restoreVisibility();
    updateServerStatus();
    
    // Mettre à jour le statut toutes les 30 secondes
    setInterval(updateServerStatus, 30000);
});

// Support tactile pour mobile
header.addEventListener('touchstart', (e) => {
    if (e.target === closeBtn) return;
    const touch = e.touches[0];
    offsetX = touch.clientX - widget.offsetLeft;
    offsetY = touch.clientY - widget.offsetTop;
    isDragging = true;
    widget.classList.add('dragging');
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    
    let newX = touch.clientX - offsetX;
    let newY = touch.clientY - offsetY;
    
    const maxX = window.innerWidth - widget.offsetWidth;
    const maxY = window.innerHeight - widget.offsetHeight;
    
    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));
    
    widget.style.left = newX + 'px';
    widget.style.top = newY + 'px';
    widget.style.right = 'auto';
    
    savePosition(newX, newY);
});

document.addEventListener('touchend', () => {
    isDragging = false;
    widget.classList.remove('dragging');
});
