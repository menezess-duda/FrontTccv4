document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const dataCards = document.querySelectorAll('.data-card');
    const btnPrimary = document.querySelector('.btn-primary');


    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
           
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                
                sidebar.classList.toggle('collapsed');
            }
        });
    }

 
    dataCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
           
            card.style.boxShadow = '0 0 20px var(--primary-color)';
        });
        card.addEventListener('mouseleave', () => {
           
            card.style.boxShadow = '0 4px 15px var(--shadow-color)';
        });
    });

 
    const body = document.body;
    body.style.setProperty('--scanline-opacity', '0.05');

    const style = document.createElement('style');
    style.innerHTML = `
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, var(--scanline-opacity)),
                rgba(0, 0, 0, var(--scanline-opacity)) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: -1;
            opacity: 0.5;
        }
    `;
    document.head.appendChild(style);

   
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        pageTitle.classList.add('glitch-text');
        setTimeout(() => {
            pageTitle.classList.remove('glitch-text');
        }, 5000);
    }

});