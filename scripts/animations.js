document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements as they enter the viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });

    document.querySelectorAll('section > *').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
});