(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  const player = document.querySelector(".sound-control");
  const lightbox = document.querySelector(".lightbox");
  const lightboxImage = lightbox.querySelector("img");
  const lightboxLabel = lightbox.querySelector("p");
  const handwrittenLines = lightbox.querySelector(".handwritten-lines");
  const audio = new Audio("./assets/music/obj_wo3DlMOGwrbDjj7DisKw_32743712864_3f09_5c7e_7a96_9c7cd9bf51fa18a6af1464f8c3b061a0.mp3");
  audio.loop = true;
  audio.preload = "metadata";
  audio.volume = .7;
  let writingTimeline = null;

  function setSound(playing) {
    player.setAttribute("aria-pressed", String(playing));
    player.setAttribute("aria-label", playing ? "暂停临时背景音乐" : "播放临时背景音乐");
    player.querySelector("b").textContent = playing ? "PAUSE" : "PLAY";
    if (gsap && !reduceMotion) gsap.to(".sound-disc", { rotation: playing ? "+=360" : 0, duration: playing ? 7 : .25, ease: "none", repeat: playing ? -1 : 0, overwrite: true });
  }

  player.addEventListener("click", async () => {
    const isPlaying = player.getAttribute("aria-pressed") === "true";
    if (isPlaying) {
      audio.pause();
      setSound(false);
      return;
    }
    try {
      await audio.play();
      setSound(true);
    } catch (error) {
      player.setAttribute("aria-label", "临时背景音乐无法播放");
      console.warn("Temporary BGM could not play.", error);
    }
  });

  audio.addEventListener("pause", () => { if (!audio.ended) setSound(false); });

  function writeLines(lines) {
    if (writingTimeline) writingTimeline.kill();
    handwrittenLines.replaceChildren();
    const lineElements = lines.map(() => {
      const element = document.createElement("p");
      handwrittenLines.append(element);
      return element;
    });
    if (reduceMotion || !gsap) {
      lineElements.forEach((element, index) => { element.textContent = lines[index]; });
      return;
    }
    writingTimeline = gsap.timeline();
    lines.forEach((line, index) => {
      const progress = { value: 0 };
      writingTimeline.to(progress, {
        value: line.length,
        duration: Math.max(.42, line.length * .09),
        ease: "none",
        onUpdate: () => { lineElements[index].textContent = line.slice(0, Math.ceil(progress.value)); }
      }, index ? "+=.18" : "+=.08");
    });
  }

  document.querySelectorAll(".poster-card").forEach((card) => {
    card.addEventListener("click", () => {
      lightboxImage.src = card.dataset.poster;
      lightboxImage.alt = card.querySelector("img").alt;
      lightboxLabel.textContent = card.dataset.label;
      lightbox.showModal();
      writeLines(card.dataset.lines.split("|"));
      if (gsap && !reduceMotion) gsap.fromTo(lightboxImage, { autoAlpha: 0, scale: .96 }, { autoAlpha: 1, scale: 1, duration: .32, ease: "power2.out" });
    });
  });
  lightbox.addEventListener("close", () => { if (writingTimeline) writingTimeline.kill(); });
  document.querySelector(".close-lightbox").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });

  if (gsap && !reduceMotion) {
    gsap.set([".masthead", ".hero > *", ".section-heading", ".poster-card", ".note"], { autoAlpha: 0 });
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
    timeline.to(".masthead", { autoAlpha: 1, duration: .35 })
      .to(".hero > *", { autoAlpha: 1, y: 0, duration: .5, stagger: .08 }, "-=.06")
      .to(".section-heading", { autoAlpha: 1, y: 0, duration: .45 }, "-=.05")
      .to(".poster-card", { autoAlpha: 1, y: 0, duration: .5, stagger: .1 }, "-=.12")
      .to(".note", { autoAlpha: 1, y: 0, duration: .4 }, "-=.15");
  }
})();
