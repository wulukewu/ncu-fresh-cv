document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        project.addEventListener('mouseover', () => {
            project.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Highlight color on hover
        });

        project.addEventListener('mouseout', () => {
            project.style.backgroundColor = '#000000'; // Reset background color
        });
    });

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // Matrix Rain Animation
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const drops = Array.from({ length: columns }).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px arial`;

        drops.forEach((y, index) => {
            const text = letters[Math.floor(Math.random() * letters.length)];
            const x = index * fontSize;
            ctx.fillText(text, x, y * fontSize);

            if (y * fontSize > canvas.height && Math.random() > 0.975) {
                drops[index] = 0;
            }

            drops[index]++;
        });
    }

    // Run the animation continuously
    const intervalId = setInterval(draw, 33);

    // Hide loading screen on scroll
    const overlay = document.getElementById('loading-screen');
    const container = document.querySelector('.container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                container.classList.add('visible');
            }, 500); // Match this duration with the CSS transition duration
        }
    });

    // Show loading screen when scrolling to the top
    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.style.opacity = '1';
                container.classList.remove('visible');
            }, 10); // Small delay to ensure display change is applied
        }
    });

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});