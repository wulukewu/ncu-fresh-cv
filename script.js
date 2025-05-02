document.addEventListener("DOMContentLoaded", () => {
  // Remove the project hover effects since we're handling them with CSS

  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });

  // Enhanced Matrix rain effect
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");

  // Set canvas to full window size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Chinese and Japanese characters for more authentic Matrix look
  const matrixChars =
    "日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  // Matrix settings
  let settings = {
    fontSize: 16,
    speed: 35,
    density: 10,
    brightness: 0.5,
    glitchFrequency: 30,
    classicMode: false,
  };

  // Font size and columns
  let fontSize = settings.fontSize;
  let columns = Math.floor(canvas.width / fontSize) + 1;

  // Array to track the y position of each drop
  let drops = [];

  // Initialize drops at random positions
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor((Math.random() * canvas.height) / fontSize) * -1;
  }

  // Array to store the brightness of each column
  let brightness = [];
  for (let i = 0; i < columns; i++) {
    brightness[i] = Math.random() * 0.8 + 0.2; // Between 0.2 and 1.0
  }

  // Track mouse position for interactive effects
  let mouseX = 0;
  let mouseY = 0;

  // FPS tracking
  let fps = 0;
  let lastLoop = performance.now();
  let frameCount = 0;
  let lastFpsUpdate = 0;

  // Function to draw the Matrix rain
  function drawMatrix() {
    // Calculate FPS
    const thisLoop = performance.now();
    const delta = thisLoop - lastLoop;
    lastLoop = thisLoop;

    if (delta > 0) {
      fps = 1000 / delta;
    }

    frameCount++;

    if (thisLoop - lastFpsUpdate > 500) {
      // Update every 500ms
      document.getElementById("matrixStats").textContent = `FPS: ${Math.round(
        fps
      )} | Drops: ${drops.length}`;
      lastFpsUpdate = thisLoop;
    }

    // Semi-transparent black to create trail effect
    ctx.fillStyle = settings.classicMode
      ? "rgba(0, 0, 0, 0.05)"
      : "rgba(0, 10, 20, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // For each column
    for (let i = 0; i < drops.length; i++) {
      // Pick a random character
      const char = matrixChars.charAt(
        Math.floor(Math.random() * matrixChars.length)
      );

      // Calculate color based on position and brightness
      const green = Math.floor(brightness[i] * 255 * settings.brightness);
      const blue = settings.classicMode
        ? 0
        : Math.floor(brightness[i] * 100 * settings.brightness);

      // Head of the drop is brighter
      if (drops[i] > 0) {
        ctx.fillStyle = settings.classicMode
          ? `rgba(180, ${green}, 0, 1)`
          : `rgba(180, ${green}, ${blue}, 1)`;
        ctx.font = `bold ${fontSize}px monospace`;
      } else {
        // Trail is dimmer
        ctx.fillStyle = settings.classicMode
          ? `rgba(0, ${Math.floor(green * 0.8)}, 0, ${brightness[i]})`
          : `rgba(0, ${Math.floor(green * 0.8)}, ${Math.floor(blue * 0.5)}, ${
              brightness[i]
            })`;
        ctx.font = `${fontSize}px monospace`;
      }

      // Draw the character
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      // Move the drop down at variable speed
      drops[i] += 100 / settings.speed;

      // Randomly change brightness occasionally
      if (Math.random() > 0.98) {
        brightness[i] = Math.random() * 0.8 + 0.2;
      }

      // Reset when off the screen at random intervals
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = -1;
      }

      // Randomly reset some drops for varied effect
      if (Math.random() > 1 - (0.005 * settings.density) / 10) {
        drops[i] = -1;
      }

      // Interactive effect - drops respond to mouse proximity
      const dx = i * fontSize - mouseX;
      const dy = drops[i] * fontSize - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100 && drops[i] > 0) {
        // Accelerate drops near mouse
        drops[i] += 0.5;
        brightness[i] = Math.min(brightness[i] + 0.05, 1.0);
      }
    }
  }

  // Create occasional "glitch" effects
  function createGlitch() {
    if (Math.random() > 1 - settings.glitchFrequency / 1000) {
      ctx.fillStyle = "rgba(200, 220, 255, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (Math.random() > 1 - settings.glitchFrequency / 2000) {
      // Horizontal line glitch
      const y = Math.random() * canvas.height;
      const height = Math.random() * 5 + 1;
      ctx.fillStyle = settings.classicMode
        ? "rgba(0, 255, 0, 0.15)"
        : "rgba(150, 255, 170, 0.15)";
      ctx.fillRect(0, y, canvas.width, height);
    }

    // Random character displacement glitch
    if (Math.random() > 1 - settings.glitchFrequency / 3000) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const width = Math.random() * 100 + 50;
      const height = Math.random() * 10 + 5;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(Math.random() > 0.5 ? -1 : 1, 1);

      for (let i = 0; i < 10; i++) {
        const char = matrixChars.charAt(
          Math.floor(Math.random() * matrixChars.length)
        );
        ctx.fillStyle = settings.classicMode
          ? `rgba(0, 255, 0, ${Math.random() * 0.8 + 0.2})`
          : `rgba(0, ${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(
              Math.random() * 100
            )}, ${Math.random() * 0.8 + 0.2})`;
        ctx.font = `${Math.random() * 10 + fontSize}px monospace`;
        ctx.fillText(char, Math.random() * width, Math.random() * height);
      }

      ctx.restore();
    }
  }

  // Animation loop
  function animate() {
    drawMatrix();
    createGlitch();
    requestAnimationFrame(animate);
  }

  // Start the animation
  animate();

  // Resize canvas when window is resized
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Recalculate columns
    columns = Math.floor(canvas.width / fontSize) + 1;

    // Adjust drops array if needed
    if (columns > drops.length) {
      for (let i = drops.length; i < columns; i++) {
        drops[i] = Math.floor((Math.random() * canvas.height) / fontSize) * -1;
        brightness[i] = Math.random() * 0.8 + 0.2;
      }
    }
  });

  // Track mouse movement
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create a ripple effect around the mouse
    const column = Math.floor(mouseX / fontSize);

    // Create a ripple effect around the mouse
    for (
      let i = Math.max(0, column - 5);
      i < Math.min(drops.length, column + 5);
      i++
    ) {
      if (Math.random() > 0.7 && drops[i] > 5) {
        drops[i] = -1; // Reset some nearby drops
        brightness[i] = 1.0; // Make them bright
      }
    }

    // Move the glows to follow the mouse with some delay
    const glows = document.querySelectorAll(".glow");
    setTimeout(() => {
      glows[0].style.left = e.clientX - 150 + "px";
      glows[0].style.top = e.clientY - 150 + "px";
    }, 100);

    setTimeout(() => {
      glows[1].style.left = e.clientX - 150 + "px";
      glows[1].style.top = e.clientY - 150 + "px";
    }, 200);
  });

  // Matrix control panel toggle
  document.getElementById("panelToggle").addEventListener("click", () => {
    const panel = document.getElementById("matrixPanel");
    panel.classList.toggle("active");
  });

  // Matrix control panel sliders
  document.getElementById("rainSpeed").addEventListener("input", (e) => {
    settings.speed = parseInt(e.target.value);
  });

  document.getElementById("density").addEventListener("input", (e) => {
    settings.density = parseInt(e.target.value);
  });

  document.getElementById("brightness").addEventListener("input", (e) => {
    settings.brightness = parseInt(e.target.value) / 10;
  });

  document.getElementById("glitchFreq").addEventListener("input", (e) => {
    settings.glitchFrequency = parseInt(e.target.value);
  });

  // Reset button
  document.getElementById("resetMatrix").addEventListener("click", () => {
    settings = {
      fontSize: 16,
      speed: 35,
      density: 10,
      brightness: 0.5,
      glitchFrequency: 30,
      classicMode: settings.classicMode,
    };

    document.getElementById("rainSpeed").value = settings.speed;
    document.getElementById("density").value = settings.density;
    document.getElementById("brightness").value = settings.brightness * 10;
    document.getElementById("glitchFreq").value = settings.glitchFrequency;

    // Reset drops
    drops = [];
    brightness = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor((Math.random() * canvas.height) / fontSize) * -1;
      brightness[i] = Math.random() * 0.8 + 0.2;
    }
  });

  // Toggle classic Matrix mode
  document.getElementById("matrixMode").addEventListener("click", (e) => {
    settings.classicMode = !settings.classicMode;
    e.target.textContent = settings.classicMode
      ? "Modern Mode"
      : "Classic Mode";
  });

  // Interactive elements
  document.querySelectorAll(".interactive-element").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      // Create matrix rain effect from this element
      const rect = el.getBoundingClientRect();

      // Create a ripple of matrix rain below this element
      const startColumn = Math.floor((rect.left - 50) / fontSize);
      const endColumn = Math.floor((rect.right + 50) / fontSize);

      for (
        let i = Math.max(0, startColumn);
        i < Math.min(drops.length, endColumn);
        i++
      ) {
        if (drops[i] * fontSize < rect.bottom) {
          drops[i] = rect.bottom / fontSize;
          brightness[i] = 1.0;
        }
      }
    });
  });

  // Skill tag click effect
  document.querySelectorAll(".skill-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      const skill = tag.getAttribute("data-skill");

      // Highlight related skills in the document
      document.querySelectorAll(".skill-category").forEach((category) => {
        const text = category.textContent.toLowerCase();
        if (text.includes(skill.toLowerCase())) {
          category.style.borderLeftColor = "#00ff41";
          category.style.backgroundColor = "rgba(0, 255, 65, 0.05)";

          // Add a pulse animation
          category.classList.add("pulse");

          // Remove after animation
          setTimeout(() => {
            category.style.borderLeftColor = "";
            category.style.backgroundColor = "";
            category.classList.remove("pulse");
          }, 2000);
        }
      });

      // Create a burst of matrix characters from the tag
      const rect = tag.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Create 20 matrix characters that fly out in all directions
      for (let i = 0; i < 20; i++) {
        const char = document.createElement("div");
        char.textContent = matrixChars.charAt(
          Math.floor(Math.random() * matrixChars.length)
        );
        char.style.position = "fixed";
        char.style.left = centerX + "px";
        char.style.top = centerY + "px";
        char.style.color = "#00ff41";
        char.style.fontFamily = "monospace";
        char.style.fontSize = "16px";
        char.style.pointerEvents = "none";
        char.style.zIndex = "1000";
        char.style.opacity = "1";
        document.body.appendChild(char);

        // Random direction and speed
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 3;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;

        // Animate the character
        let x = centerX;
        let y = centerY;
        let opacity = 1;

        const animate = () => {
          x += dx;
          y += dy;
          opacity -= 0.02;

          char.style.left = x + "px";
          char.style.top = y + "px";
          char.style.opacity = opacity;

          if (opacity > 0) {
            requestAnimationFrame(animate);
          } else {
            document.body.removeChild(char);
          }
        };

        requestAnimationFrame(animate);
      }
    });
  });

  // Easter egg - Konami code
  let konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let konamiIndex = 0;

  document.addEventListener("keydown", (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        // Activate special effect
        document.body.style.transition = "all 1s ease";
        document.body.style.backgroundColor = "#000";

        // Create a massive matrix rain
        settings.density = 20;
        settings.speed = 10;
        settings.brightness = 1.0;
        settings.glitchFrequency = 100;

        // Update sliders
        document.getElementById("rainSpeed").value = settings.speed;
        document.getElementById("density").value = settings.density;
        document.getElementById("brightness").value = settings.brightness * 10;
        document.getElementById("glitchFreq").value = settings.glitchFrequency;

        // Show a message
        const message = document.createElement("div");
        message.textContent = "WAKE UP, NEO...";
        message.style.position = "fixed";
        message.style.top = "50%";
        message.style.left = "50%";
        message.style.transform = "translate(-50%, -50%)";
        message.style.color = "#00ff41";
        message.style.fontFamily = "monospace";
        message.style.fontSize = "3rem";
        message.style.fontWeight = "bold";
        message.style.textShadow = "0 0 10px #00ff41";
        message.style.zIndex = "1000";
        document.body.appendChild(message);

        // Remove after 3 seconds
        setTimeout(() => {
          document.body.removeChild(message);
          document.body.style.backgroundColor = "";

          // Reset settings
          settings = {
            fontSize: 16,
            speed: 35,
            density: 10,
            brightness: 0.5,
            glitchFrequency: 30,
            classicMode: settings.classicMode,
          };

          // Update sliders
          document.getElementById("rainSpeed").value = settings.speed;
          document.getElementById("density").value = settings.density;
          document.getElementById("brightness").value =
            settings.brightness * 10;
          document.getElementById("glitchFreq").value =
            settings.glitchFrequency;
        }, 3000);

        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  // Title effect
  const infoTitle = document.getElementById("infoTitle");
  infoTitle.addEventListener("click", () => {
    // Create a typewriter effect
    const originalText = infoTitle.textContent;
    infoTitle.textContent = "";

    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        infoTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      }
    };

    typeWriter();
  });
});
