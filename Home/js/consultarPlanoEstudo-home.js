document.addEventListener('DOMContentLoaded', function () {

    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const dashboardContent = document.querySelector('.dashboard-content');

    let isOpen = false;

    // Criando overlay via JS
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.backdropFilter = 'blur(4px)';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'opacity 0.4s ease';
    overlay.style.zIndex = '999';

    document.body.appendChild(overlay);

    // Easing suave
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateSidebar = (opening) => {
        let start = null;
        const duration = 400;

        function animation(currentTime) {
            if (!start) start = currentTime;
            const progress = currentTime - start;
            const percent = Math.min(progress / duration, 1);
            const eased = easeOutCubic(percent);

            const position = opening
                ? (-100 + eased * 100)
                : (eased * -100);

            sidebar.style.transform = `translateX(${position}%)`;

            if (progress < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    };

    /

    const animateMenuItems = (opening) => {
        const items = sidebar.querySelectorAll('li, a');

        items.forEach((item, index) => {
            item.style.transition = 'all 0.4s ease';
            item.style.transitionDelay = `${index * 0.05}s`;

            if (opening) {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
            }
        });
    };

    const openMenu = () => {
        sidebar.style.transform = 'translateX(-100%)';
        sidebar.style.display = 'block';

        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'all';

        dashboardContent.style.transition = 'filter 0.4s ease';
        dashboardContent.style.filter = 'blur(2px) brightness(0.8)';

        animateSidebar(true);
        animateMenuItems(true);

        isOpen = true;
    };

    const closeMenu = () => {
        animateSidebar(false);
        animateMenuItems(false);

        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';

        dashboardContent.style.filter = 'none';

        isOpen = false;
    };

    const toggleMenu = () => {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }

        // micro animação no botão
        menuToggle.animate([
            { transform: 'rotate(0deg) scale(1)' },
            { transform: 'rotate(90deg) scale(1.2)' },
            { transform: 'rotate(0deg) scale(1)' }
        ], {
            duration: 400,
            easing: 'ease'
        });
    };

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    overlay.addEventListener('click', closeMenu);

});