document.addEventListener("DOMContentLoaded", function () {
  /* SMOOTH SCROLL for "LEARN MORE" */
  const learnMoreBtn = document.querySelector(".btn");
  learnMoreBtn.addEventListener("click", function (event) {
    // Only handle the LEARN MORE button (ignore if id is "generate-quote")
    if (this.id !== "generate-quote") {
      event.preventDefault();
      learnMoreBtn.classList.add("clicked");
      setTimeout(() => {
        learnMoreBtn.classList.remove("clicked");
        document.getElementById("about").scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  });

  /* THEME SWITCHING */
  const themeTexts = {
    heaven: {
      title: "WELCOME TO HEAVEN",
      subtitle: "Where the skies are limitless.",
      quote: "Life is a canvas, paint it with your dreams."
    },
    earth: {
      title: "WELCOME TO EARTH",
      subtitle: "Grounded in creativity and life.",
      quote: "In every grain of earth, there's a story of resilience."
    },
    hell: {
      title: "WELCOME TO THE UNDERWORLD",
      subtitle: "Embrace the pixel flames of design and code.",
      quote: "Out of the flames, true strength is forged."
    }
  };

  const themeButtons = document.querySelectorAll(".theme-btn");
  themeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedTheme = this.getAttribute("data-theme");
      document.body.classList.remove("theme-heaven", "theme-earth", "theme-hell");
      document.body.classList.add("theme-" + selectedTheme);

      // Update hero text to match selected theme
      document.getElementById("hero-title").innerText = themeTexts[selectedTheme].title;
      document.getElementById("hero-subtitle").innerText = themeTexts[selectedTheme].subtitle;
      document.getElementById("hero-quote").innerText = themeTexts[selectedTheme].quote;
    });
  });

  /* QUOTE GENERATOR WITH THEME-DEPENDENT QUOTES */
  const generateQuoteBtn = document.getElementById("generate-quote");
  const generatedQuoteEl = document.getElementById("generated-quote");
  const quoteInstructions = document.getElementById("quote-instructions");

  const quotesByTheme = {
    heaven: [
      "Heavenly light guides us through every storm.",
      "In the silence of the skies, hope takes flight.",
      "Angels sing in the whispers of the wind.",
      "The beauty of heaven promises eternal peace."
    ],
    earth: [
      "The earth nurtures every soul with its enduring embrace.",
      "Grounded in nature, every moment is a testament to life.",
      "In the soil of existence, every seed grows a story.",
      "The earth speaks in whispers of ancient wisdom."
    ],
    hell: [
      "From the ashes, the inferno of passion ignites.",
      "In the heart of darkness, true strength is forged.",
      "The flames of hell reveal the soul's raw power.",
      "Embrace the chaos, for it is the forge of rebirth."
    ]
  };

  generateQuoteBtn.addEventListener("click", function () {
    let currentTheme = "heaven"; // default
    if (document.body.classList.contains("theme-heaven")) currentTheme = "heaven";
    else if (document.body.classList.contains("theme-earth")) currentTheme = "earth";
    else if (document.body.classList.contains("theme-hell")) currentTheme = "hell";

    const quotes = quotesByTheme[currentTheme];
    const randomIndex = Math.floor(Math.random() * quotes.length);
    generatedQuoteEl.innerText = quotes[randomIndex];

    // Hide instructions text after generating a quote
    if (quoteInstructions) {
      quoteInstructions.style.display = "none";
    }
  });

  /* MOUSE FOLLOWER (using clientX/clientY for exact positioning) */
  const follower = document.getElementById("mouse-follower");
  document.addEventListener("mousemove", function (e) {
    follower.style.left = e.clientX + "px";
    follower.style.top = e.clientY + "px";
  });

  /* TEXT SPLITTING & EXPLODING EFFECT (exclude navbar) */
  const textElements = Array.from(document.querySelectorAll("h1, h2, h3, p, li, a")).filter(
    (el) => !el.closest(".navbar")
  );
  textElements.forEach(el => {
    if (!el.classList.contains("split")) {
      const text = el.innerText;
      el.innerHTML = "";
      for (const char of text) {
        const span = document.createElement("span");
        span.classList.add("letter");
        span.innerText = char;
        el.appendChild(span);
      }
      el.classList.add("split");

      // Add explosion effect on hover
      el.addEventListener("mouseenter", function () {
        const letters = el.querySelectorAll(".letter");
        letters.forEach(letter => {
          const randomX = Math.floor(Math.random() * 60) - 30;
          const randomY = Math.floor(Math.random() * 60) - 30;
          const randomRot = Math.floor(Math.random() * 60) - 30;
          letter.style.transition = "transform 0.3s ease";
          letter.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRot}deg)`;
        });
      });
      el.addEventListener("mouseleave", function () {
        setTimeout(() => {
          const letters = el.querySelectorAll(".letter");
          letters.forEach(letter => {
            letter.style.transform = "none";
          });
        }, 3000);
      });
    }
  });

  /* CUSTOM PIXEL AUDIO PLAYER LOGIC */
  const djAudio = document.getElementById("dj-audio");
  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const progressBar = document.getElementById("progress-bar");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");

  // Attempt autoplay on load
  djAudio.play().catch(() => {
    // Some browsers block autoplay; user must interact
    // We could handle that gracefully or just ignore
  });

  // Play button
  playBtn.addEventListener("click", () => {
    djAudio.play();
  });

  // Pause button
  pauseBtn.addEventListener("click", () => {
    djAudio.pause();
  });

  // Update progress bar
  djAudio.addEventListener("timeupdate", () => {
    const progress = (djAudio.currentTime / djAudio.duration) * 100;
    progressBar.value = progress || 0; // avoid NaN if no metadata
    currentTimeEl.innerText = formatTime(djAudio.currentTime);
  });

  // Once we know the duration, display it
  djAudio.addEventListener("loadedmetadata", () => {
    durationEl.innerText = formatTime(djAudio.duration);
  });

  // Seek when user drags progress bar
  progressBar.addEventListener("input", () => {
    const newTime = (progressBar.value / 100) * djAudio.duration;
    djAudio.currentTime = newTime;
  });

  // Helper to format seconds -> M:SS
  function formatTime(timeInSeconds) {
    if (!timeInSeconds || isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    let seconds = Math.floor(timeInSeconds % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return `${minutes}:${seconds}`;
  }
});
