document.addEventListener('DOMContentLoaded', () => {
    // Form submission handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically send the form data to a server
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }
});