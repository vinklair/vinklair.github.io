// Vinklair Apps: the only script on the site. Menu toggle on small
// screens and the controls of the screenshot galleries.
document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
        toggle.addEventListener("click", () => {
            const open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });
    }

    // Screenshot galleries: arrows page by whole screenshots, the bar shows
    // where you are, and an edge fades while there is more to see that way.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.querySelectorAll("[data-gallery]").forEach((nav) => {
        const gallery = document.getElementById(nav.dataset.gallery);
        if (!gallery) return;
        const [previous, next] = nav.querySelectorAll("button");
        const thumb = nav.querySelector(".gallery-progress span");

        const update = () => {
            const max = gallery.scrollWidth - gallery.clientWidth;
            const atStart = gallery.scrollLeft <= 1;
            const atEnd = gallery.scrollLeft >= max - 1;
            nav.hidden = max <= 1;
            previous.disabled = atStart;
            next.disabled = atEnd;
            gallery.classList.toggle("fade-start", !atStart);
            gallery.classList.toggle("fade-end", !atEnd);
            thumb.style.width = `${(gallery.clientWidth / gallery.scrollWidth) * 100}%`;
            thumb.style.left = `${(gallery.scrollLeft / gallery.scrollWidth) * 100}%`;
        };

        const page = (direction) => {
            const style = getComputedStyle(gallery);
            const gap = parseFloat(style.columnGap) || 0;
            const visible = gallery.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            const shot = gallery.querySelector(".shot");
            const pitch = shot ? shot.offsetWidth + gap : visible;
            const step = Math.max(1, Math.floor((visible + gap) / pitch)) * pitch;
            gallery.scrollBy({ left: step * direction, behavior: reduceMotion.matches ? "auto" : "smooth" });
        };

        previous.addEventListener("click", () => page(-1));
        next.addEventListener("click", () => page(1));
        gallery.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
    });

    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = String(new Date().getFullYear());
    });
});
