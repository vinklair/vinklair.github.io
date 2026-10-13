// Vinklair Apps: the only script on the site. The menu on small screens,
// the screenshot galleries, things fading in as they scroll into view,
// videos that play only while they are on screen, and the scroll story.
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Menu.
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".nav-links");
    if (toggle && links) {
        toggle.addEventListener("click", () => {
            const open = links.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
        });
        links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
            links.classList.remove("open");
            toggle.setAttribute("aria-expanded", "false");
        }));
    }

    // A line under the bar once the page has moved.
    const nav = document.querySelector(".nav");
    const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Fade in as it scrolls into view. Children of a [data-stagger] come one
    // after another.
    document.querySelectorAll("[data-stagger]").forEach((group) => {
        [...group.children].forEach((child, index) => {
            child.classList.add("reveal");
            child.style.setProperty("--delay", `${Math.min(index, 8) * 0.07}s`);
        });
    });
    const revealer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in");
                revealer.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach((node) => revealer.observe(node));

    // Videos: muted loops that play while on screen and stop when not, so a
    // page of them costs one or two at a time. With less motion asked for,
    // or when the browser will not autoplay, a play button appears instead.
    const playButton = '<button class="play" type="button" aria-label="Play"><svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="30" fill="rgba(0,0,0,.45)"/><path d="M26 20l20 12-20 12z" fill="#fff"/></svg></button>';
    const loops = [...document.querySelectorAll("video[data-loop]")];
    const offerPlay = (video) => {
        const host = video.parentElement;
        if (host.querySelector(".play")) { host.classList.add("needs-play"); return; }
        host.insertAdjacentHTML("beforeend", playButton);
        host.classList.add("needs-play");
        host.querySelector(".play").addEventListener("click", () => {
            video.dataset.chosen = "1";
            host.classList.remove("needs-play");
            video.play().catch(() => {});
        });
    };
    const start = (video) => {
        if (video.dataset.held) return;
        if (reduceMotion.matches && !video.dataset.chosen) { offerPlay(video); return; }
        if (video.preload === "none") video.preload = "auto";
        const playing = video.play();
        // A pause before playback began rejects too (AbortError); only a
        // refusal to autoplay calls for the button.
        if (playing) playing.catch((error) => { if (error.name === "NotAllowedError") offerPlay(video); });
    };
    const watcher = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting) start(video);
            else video.pause();
        });
    }, { threshold: 0.25 });
    loops.forEach((video) => {
        video.muted = true;
        video.playsInline = true;
        video.loop = true;
        watcher.observe(video);
    });

    // The scroll story: one phone beside the steps, showing the step in the
    // middle of the window.
    document.querySelectorAll("[data-story]").forEach((story) => {
        const steps = [...story.querySelectorAll(".story-step")];
        const screens = [...story.querySelectorAll(".story-stage video")];
        if (!steps.length || !screens.length) return;
        const show = (index) => {
            steps.forEach((step, i) => step.classList.toggle("active", i === index));
            screens.forEach((video, i) => {
                const on = i === index;
                video.classList.toggle("on", on);
                if (on) {
                    delete video.dataset.held;
                    video.currentTime = 0;
                    start(video);
                } else {
                    video.dataset.held = "1";
                    video.pause();
                }
            });
        };
        screens.forEach((video, i) => { if (i > 0) video.dataset.held = "1"; });
        const middle = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) show(steps.indexOf(entry.target));
            });
        }, { rootMargin: "-45% 0px -45% 0px" });
        steps.forEach((step) => middle.observe(step));
        show(0);
    });

    // A light that follows the pointer over feature cards.
    document.querySelectorAll(".feature").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            const box = card.getBoundingClientRect();
            card.style.setProperty("--mx", `${event.clientX - box.left}px`);
            card.style.setProperty("--my", `${event.clientY - box.top}px`);
        });
    });

    // Screenshot galleries: arrows page by whole screenshots, the bar shows
    // where you are, and an edge fades while there is more to see that way.
    document.querySelectorAll("[data-gallery]").forEach((galleryNav) => {
        const gallery = document.getElementById(galleryNav.dataset.gallery);
        if (!gallery) return;
        const [previous, next] = galleryNav.querySelectorAll("button");
        const thumb = galleryNav.querySelector(".gallery-progress span");

        const update = () => {
            const max = gallery.scrollWidth - gallery.clientWidth;
            const atStart = gallery.scrollLeft <= 1;
            const atEnd = gallery.scrollLeft >= max - 1;
            galleryNav.hidden = max <= 1;
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
