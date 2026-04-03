document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const shadowModeToggle = document.querySelector('.shadow-mode-toggle');
    const body = document.body;
    const cards = document.querySelectorAll('.card');

    // 1. Funcionalidade de Navegação (Simulação de Ativação)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove a classe 'active' de todos os links
            navLinks.forEach(l => l.classList.remove('active'));

            // Adiciona a classe 'active' apenas ao link clicado
            link.classList.add('active');

            // Opcional: Adicionar lógica para carregar o conteúdo da página aqui
            console.log(`Navegando para: ${link.textContent.trim()}`);
        });
    });

    // 2. Funcionalidade "Shadow Mode" (Alternância de Classe)
    if (shadowModeToggle) {
        shadowModeToggle.addEventListener('click', () => {
            // Alterna a classe 'shadow-mode-active' no body
            body.classList.toggle('shadow-mode-active');

            // Atualiza o texto do botão
            if (body.classList.contains('shadow-mode-active')) {
                shadowModeToggle.textContent = 'Shadow Mode ON';
            } else {
                shadowModeToggle.textContent = 'Shadow Mode';
            }
        });
    }

    // 3. Animação de Fade-in dos Cards ao Carregar
    // O CSS já define opacity: 0 para os cards.
    // Este JS adiciona a classe 'loaded' para fazer o fade-in.
    cards.forEach((card, index) => {
        // Adiciona um pequeno delay para um efeito escalonado
        setTimeout(() => {
            card.style.opacity = 1;
        }, 100 * index);
    });
});