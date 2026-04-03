document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menu-toggle');
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

    // 2. Efeito de Brilho Neon (Hover) para Cards
    dataCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = '0 0 20px var(--primary-color)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.boxShadow = '0 4px 15px var(--shadow-color)';
        });
    });

    // 3. Animação de Glitch no Título da Página
    if (pageTitle) {
        pageTitle.classList.add('glitch-text');
        setTimeout(() => {
            pageTitle.classList.remove('glitch-text');
        }, 5000);
    }

    // 4. Animação de Fundo (Scanline) - Efeito Futurista
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

    // 5. Criar Gradiente para o SVG do Desempenho
    const performanceSvg = document.querySelector('.performance-svg');
    if (performanceSvg) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'performanceGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#BB86FC');

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#FF00FF');

        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        performanceSvg.insertBefore(defs, performanceSvg.firstChild);
    }

    // 6. Inicializar Gráficos com Chart.js
    initCharts();
});

// Função para inicializar os gráficos
function initCharts() {
    // Gráfico de Linha: Progressão Semanal
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Desempenho Semanal',
                    data: [72, 75, 78, 80, 82, 85, 82],
                    borderColor: '#BB86FC',
                    backgroundColor: 'rgba(187, 134, 252, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#FF00FF',
                    pointBorderColor: '#BB86FC',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#E0E0E0',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(187, 134, 252, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9E9E9E',
                            font: {
                                family: "'Poppins', sans-serif"
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9E9E9E',
                            font: {
                                family: "'Poppins', sans-serif"
                            }
                        }
                    }
                }
            }
        });
    }

    // Gráfico de Barras: Desempenho por Matéria
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['Matemática', 'Português', 'Geografia', 'História', 'Física', 'Química'],
                datasets: [{
                    label: 'Desempenho (%)',
                    data: [92, 78, 85, 72, 88, 68],
                    backgroundColor: [
                        'rgba(39, 194, 245)',
                        'rgba(245, 39, 39)',
                        'rgba(240, 114, 17)',
                        'rgba(255, 193, 7, 0.8)',
                        'rgba(0, 33, 194)',
                        'rgba(0, 171, 54)'
                    ],
                    borderColor: [
                        '#27C2F5', 
                        '#F52727',
                        '#F07211',
                        '#FFC107',
                        '#0021BF',
                        '#00AB36'
                    ],
                    borderWidth: 2,
                    borderRadius: 5,
                    hoverBackgroundColor: '#FF00FF'
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#E0E0E0',
                            font: {
                                family: "'Poppins', sans-serif",
                                size: 12
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(187, 134, 252, 0.1)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#9E9E9E',
                            font: {
                                family: "'Poppins', sans-serif"
                            }
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#9E9E9E',
                            font: {
                                family: "'Poppins', sans-serif"
                            }
                        }
                    }
                }
            }
        });
    }
}