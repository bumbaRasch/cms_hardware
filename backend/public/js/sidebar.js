document.addEventListener("DOMContentLoaded", () => {
    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const elements = [toggleId, navId, bodyId, headerId].map(id => document.getElementById(id));
        if (elements.some(el => !el)) return;

        const [toggle, nav, bodypd, headerpd] = elements;
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show-sidebar');
            toggle.classList.toggle('bx-x');
            bodypd.classList.toggle('body-pd');
            headerpd.classList.toggle('body-pd');
        });
    };

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header');
    document.querySelector('.nav_list')?.addEventListener('click', event => {
        if (event.target.classList.contains('nav_link')) {
            document.querySelectorAll('.nav_link').forEach(link => link.classList.remove('active'));
            event.target.classList.add('active');
        }
    });
});
