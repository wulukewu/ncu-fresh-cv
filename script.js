document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        project.addEventListener('mouseover', () => {
            project.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        });

        project.addEventListener('mouseout', () => {
            project.style.backgroundColor = '#000000';
        });
    });

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});