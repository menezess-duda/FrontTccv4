document.addEventListener('DOMContentLoaded', () => {

    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const introCard = document.querySelector('.intro-card');
    const enemCards = document.querySelectorAll('.enem-card');
    const buttons = document.querySelectorAll('.btn-secondary, .btn-secondary-full, .btn-primary-large');
    const notificationsIcon = document.querySelector('.notifications-icon');
    const pageTitle = document.querySelector('.page-title');

    /* ================= SIDEBAR ================= */

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && e.target !== menuToggle) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }

    /* ================= ANIMAÇÕES DE ENTRADA ================= */

    if (introCard) {
        introCard.style.animation = 'slideInDown 0.6s ease-out';
    }

    enemCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });

    /* ================= BOTÕES ================= */

    buttons.forEach(btn => {

        // Hover dinâmico
        btn.addEventListener('mouseenter', () => {
            btn.style.boxShadow = '0 6px 18px rgba(187, 134, 252, 0.25)';
            btn.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.boxShadow = '';
            btn.style.transform = '';
        });

        // Ripple + impedir clique no card
        btn.addEventListener('click', (e) => {

            e.stopPropagation(); // impede ativar clique do card

            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.position = 'absolute';
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.backgroundColor = 'rgba(255,255,255,0.4)';
            ripple.style.borderRadius = '50%';
            ripple.style.animation = 'ripple-animation 0.6s ease-out';
            ripple.style.pointerEvents = 'none';

            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });

    });

    /* ================= NOTIFICAÇÕES ================= */

    if (notificationsIcon) {
        notificationsIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            showNotificationPopup();
        });
    }

    /* ================= GLITCH ================= */

    if (pageTitle) {
        pageTitle.classList.add('glitch-text');
        setTimeout(() => {
            pageTitle.classList.remove('glitch-text');
        }, 5000);
    }

    injectAnimationStyles();
});


/* ================= ANIMAÇÕES ================= */

function injectAnimationStyles() {

    if (document.querySelector('style[data-animations]')) return;

    const style = document.createElement('style');
    style.setAttribute('data-animations', 'true');

    style.innerHTML = `
        @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ripple-animation {
            from { transform: scale(0); opacity: 1; }
            to { transform: scale(4); opacity: 0; }
        }

        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: repeating-linear-gradient(
                0deg,
                rgba(0,0,0,0.05),
                rgba(0,0,0,0.05) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: -1;
            opacity: 0.5;
        }
    `;

    document.head.appendChild(style);
}


/* ================= POPUP ================= */

function showNotificationPopup() {

    const notifications = [
        '✓ Novo tema de redação disponível',
        '✓ Simulado corrigido com sucesso',
        '✓ Cronograma ENEM atualizado'
    ];

    alert('📬 NOTIFICAÇÕES\n\n' + notifications.join('\n'));
}