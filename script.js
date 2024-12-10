document.addEventListener('DOMContentLoaded', () => {
    const projects = document.querySelectorAll('.project');

    projects.forEach(project => {
        project.addEventListener('mouseover', () => {
            project.style.backgroundColor = '#FFC80080';
        });

        project.addEventListener('mouseout', () => {
            project.style.backgroundColor = '#FFFFFF';
        });
    });

    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
});