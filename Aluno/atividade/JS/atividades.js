document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menu-toggle');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const activityCards = document.querySelectorAll('.activity-card');
    const dataCards = document.querySelectorAll('.data-card');
    const pageTitle = document.querySelector('.page-title');

    // 1. Funcionalidade de Colapsar/Expandir Sidebar
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }

    // 2. Funcionalidade de Filtro de Atividades
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove a classe 'active' de todos os botões
            filterBtns.forEach(b => b.classList.remove('active'));
            // Adiciona a classe 'active' ao botão clicado
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            // Filtra os cards de atividades
            activityCards.forEach(card => {
                const status = card.getAttribute('data-status');

                if (filterValue === 'all') {
                    // Mostra todos os cards
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else if (filterValue === status) {
                    // Mostra apenas os cards que correspondem ao filtro
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    // Esconde os cards que não correspondem
                    card.style.display = 'none';
                }
            });
        });
    });

    // 3. Efeito de Brilho Neon (Hover) para Cards
    dataCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 0 20px var(--primary-color)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 4px 15px var(--shadow-color)';
        });
    });

    // 4. Animação de Glitch no Título da Página
    if (pageTitle) {
        pageTitle.classList.add('glitch-text');
        setTimeout(() => {
            pageTitle.classList.remove('glitch-text');
        }, 5000);
    }

    // 5. Animação de Fundo (Scanline) - Efeito Futurista
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

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // 6. Animação do Círculo de Progresso (SVG)
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        // Cria um gradiente dinâmico para o SVG
        const svg = document.querySelector('.progress-svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'gradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#BB86FC'); // Primary color

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#FF00FF'); // Secondary color

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }

});