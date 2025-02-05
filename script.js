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

    // Run the animation for 5 seconds, then stop
    const intervalId = setInterval(draw, 33);
    setTimeout(() => {
        clearInterval(intervalId);
        let alpha = 1.0;
        const fadeOutInterval = setInterval(() => {
            alpha -= 0.02; // 调整步长以实现更平滑的淡出效果
            if (alpha <= 0) {
                clearInterval(fadeOutInterval);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }, 50); // 调整间隔时间以实现更平滑的淡出效果
    }, 5000);

    // Resize canvas on window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});