(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const gsap = window.gsap;
  const player = document.querySelector(".sound-control");
  const previousTrack = document.querySelector(".previous-track");
  const nextTrack = document.querySelector(".next-track");
  const trackTicker = document.querySelector(".track-ticker");
  const trackName = document.querySelector(".track-name");
  const lightbox = document.querySelector(".lightbox");
  const photoStage = lightbox.querySelector(".photo-stage");
  const frontFace = lightbox.querySelector(".photo-front");
  const backFace = lightbox.querySelector(".photo-back");
  const frontImage = lightbox.querySelector(".lightbox-front-image");
  const backImage = lightbox.querySelector(".lightbox-back-image");
  const frontLabel = lightbox.querySelector(".photo-front-label");
  const backLabel = lightbox.querySelector(".photo-back-label");
  const handwrittenLines = lightbox.querySelector(".handwritten-lines");
  const modeGuide = lightbox.querySelector(".mode-guide");
  const playlist = [
    "./assets/music/I Will Follow You.mp3"
  ];
  const audio = new Audio();
  let currentTrackIndex = 0;
  audio.loop = false;
  audio.preload = "metadata";
  audio.volume = .7;
  let writingTimeline = null;
  let openTimeline = null;
  let flipTimeline = null;
  let guideTween = null;
  let currentLines = [];
  let showingBack = false;
  let flipLocked = false;

  function titleFromFilename(path) {
    const filename = decodeURIComponent(path.split("/").pop() || path);
    return filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
  }

  function updateTrackDisplay() {
    const title = titleFromFilename(playlist[currentTrackIndex]);
    trackName.textContent = title;
    trackTicker.setAttribute("aria-label", `当前歌曲：${title}`);
    trackTicker.title = title;
  }

  function selectTrack(index, shouldPlay = player.getAttribute("aria-pressed") === "true") {
    currentTrackIndex = (index + playlist.length) % playlist.length;
    audio.src = playlist[currentTrackIndex];
    audio.load();
    updateTrackDisplay();
    if (shouldPlay) {
      audio.play().catch((error) => {
        setSound(false);
        player.setAttribute("aria-label", "当前音乐无法播放");
        console.warn("Selected track could not play.", error);
      });
    }
  }

  function setSound(playing) {
    player.setAttribute("aria-pressed", String(playing));
    const title = titleFromFilename(playlist[currentTrackIndex]);
    player.setAttribute("aria-label", playing ? `暂停 ${title}` : `播放 ${title}`);
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
      player.setAttribute("aria-label", "当前音乐无法播放");
      console.warn("Current track could not play.", error);
    }
  });

  previousTrack.addEventListener("click", () => selectTrack(currentTrackIndex - 1));
  nextTrack.addEventListener("click", () => selectTrack(currentTrackIndex + 1));

  audio.addEventListener("play", () => setSound(true));
  audio.addEventListener("pause", () => { if (!audio.ended) setSound(false); });
  audio.addEventListener("ended", () => selectTrack(currentTrackIndex + 1, true));
  audio.addEventListener("error", () => {
    setSound(false);
    player.setAttribute("aria-label", "当前音乐无法加载");
  });

  selectTrack(0, false);

  function writeLines(lines) {
    if (writingTimeline) writingTimeline.kill();
    handwrittenLines.replaceChildren();
    const lineElements = lines.map(() => {
      const element = document.createElement("span");
      element.className = "handwritten-line";
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

  function updateModeGuide() {
    modeGuide.lastChild.textContent = showingBack ? "点击照片 · 返回大图" : "点击照片 · 翻到背面";
    photoStage.setAttribute("aria-pressed", String(showingBack));
    photoStage.setAttribute("aria-label", showingBack ? "返回照片大图展示" : "翻到照片背面并显示三行文字");
  }

  function startGuidePulse() {
    if (guideTween) guideTween.kill();
    if (!gsap || reduceMotion) return;
    guideTween = gsap.to(modeGuide, {
      autoAlpha: .42,
      scale: .985,
      duration: 1.15,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "50% 50%"
    });
  }

  function resetPhotoSide() {
    showingBack = false;
    flipLocked = false;
    currentLines = [];
    handwrittenLines.replaceChildren();
    if (writingTimeline) writingTimeline.kill();
    if (flipTimeline) flipTimeline.kill();
    frontFace.hidden = false;
    backFace.hidden = true;
    if (gsap) gsap.set([frontFace, backFace], { clearProps: "all" });
    updateModeGuide();
  }

  function togglePhotoSide() {
    if (flipLocked) return;
    flipLocked = true;
    showingBack = !showingBack;
    const turningToBack = showingBack;
    const outgoingFace = turningToBack ? frontFace : backFace;
    const incomingFace = turningToBack ? backFace : frontFace;
    const direction = turningToBack ? 1 : -1;
    updateModeGuide();
    if (writingTimeline) writingTimeline.kill();
    handwrittenLines.replaceChildren();

    if (!gsap || reduceMotion) {
      outgoingFace.hidden = true;
      incomingFace.hidden = false;
      flipLocked = false;
      if (turningToBack) writeLines(currentLines);
      return;
    }

    if (flipTimeline) flipTimeline.kill();
    incomingFace.hidden = false;
    gsap.set(incomingFace, { autoAlpha: 0, rotationY: direction * 72, scale: .96 });
    flipTimeline = gsap.timeline({
      onComplete: () => {
        flipLocked = false;
        if (turningToBack) writeLines(currentLines);
      }
    });
    flipTimeline
      .to(outgoingFace, { autoAlpha: 0, rotationY: direction * -72, scale: .96, duration: .28, ease: "power2.in" })
      .add(() => { outgoingFace.hidden = true; })
      .to(incomingFace, { autoAlpha: 1, rotationY: 0, scale: 1, duration: .38, ease: "power3.out" });
  }

  document.querySelectorAll(".poster-card").forEach((card) => {
    card.addEventListener("click", () => {
      const imageAlt = card.querySelector("img").alt;
      frontImage.src = card.dataset.poster;
      frontImage.alt = imageAlt;
      backImage.src = card.dataset.poster;
      backImage.alt = `${imageAlt}缩略图`;
      frontLabel.textContent = card.dataset.label;
      backLabel.textContent = card.dataset.label;
      resetPhotoSide();
      currentLines = card.dataset.lines.split("|");
      lightbox.showModal();
      if (gsap && !reduceMotion) {
        if (openTimeline) openTimeline.kill();
        openTimeline = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: startGuidePulse });
        openTimeline
          .fromTo(lightbox, { autoAlpha: 0, scale: .94 }, { autoAlpha: 1, scale: 1, duration: .32 })
          .fromTo(photoStage,
            { autoAlpha: 0, y: 42, scale: .76, rotation: -7, rotationX: -12 },
            { autoAlpha: 1, y: 0, scale: 1, rotation: 0, rotationX: 0, duration: .62, transformOrigin: "50% 100%" },
            0)
          .fromTo(modeGuide, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: .28 }, "-=.14");
      } else startGuidePulse();
    });
  });
  photoStage.addEventListener("click", togglePhotoSide);
  lightbox.addEventListener("close", () => {
    if (writingTimeline) writingTimeline.kill();
    if (openTimeline) openTimeline.kill();
    if (flipTimeline) flipTimeline.kill();
    if (guideTween) guideTween.kill();
    flipLocked = false;
    gsap?.set([lightbox, photoStage, modeGuide, frontFace, backFace], { clearProps: "all" });
  });
  document.querySelector(".close-lightbox").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });

  function setGalleryMotion() {
    const cards = Array.from(document.querySelectorAll(".poster-card"));
    if (reduceMotion || !gsap || !("IntersectionObserver" in window)) {
      cards.forEach((card) => { card.style.visibility = "visible"; card.style.opacity = "1"; });
      return;
    }

    const revealed = new WeakSet();
    gsap.set(cards, { autoAlpha: 0, y: 34, scale: .96, rotation: (index, card) => Number(card.dataset.tilt) });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target;
        if (entry.isIntersecting) {
          revealed.add(card);
          gsap.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: .58, ease: "power3.out", overwrite: "auto" });
          return;
        }
        if (revealed.has(card)) {
          const direction = entry.boundingClientRect.top < 0 ? -20 : 20;
          gsap.to(card, { autoAlpha: 0, y: direction, scale: .98, duration: .3, ease: "power1.in", overwrite: "auto" });
        }
      });
    }, { threshold: .2 });
    cards.forEach((card) => observer.observe(card));
  }

  if (gsap && !reduceMotion) {
    gsap.set([".masthead", ".hero > *", ".section-heading", ".note"], { autoAlpha: 0 });
    setGalleryMotion();
    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
    timeline.to(".masthead", { autoAlpha: 1, duration: .35 })
      .to(".hero > *", { autoAlpha: 1, y: 0, duration: .5, stagger: .08 }, "-=.06")
      .to(".section-heading", { autoAlpha: 1, y: 0, duration: .45 }, "-=.05")
      .to(".note", { autoAlpha: 1, y: 0, duration: .4 }, "-=.15");
  } else {
    setGalleryMotion();
  }
})();
