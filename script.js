document.addEventListener("DOMContentLoaded", () => {
  // Sound effects: Full Windows 98 sound set
  const startupSound = document.getElementById("startup-sound");
  const clickSound = document.getElementById("click-sound");
  const shutdownSound = document.getElementById("shutdown-sound");
  const errorSound = document.getElementById("error-sound");
  const dingSound = document.getElementById("ding-sound");
  const criticalStop = document.getElementById("critical-stop");
  startupSound.play();

  // System state: Sound toggle
  let isSoundOn = true;

  // Clock: Real-time display in the taskbar with tooltip
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", { hour12: false });
    const clock = document.getElementById("clock");
    clock.innerText = time;
    clock.title = `${time}\n${now.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Clock double-click for date/time
  document.getElementById("clock").addEventListener("dblclick", () => {
    if (isSoundOn) dingSound.play();
    alert(document.getElementById("clock").title);
  });

  // Start menu toggle
  const startButton = document.querySelector(".start-button");
  const startMenu = document.querySelector(".start-menu");
  startButton.addEventListener("click", () => {
    if (isSoundOn) clickSound.play();
    startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
  });

  // Start menu submenus: Hover to open
  document.querySelectorAll(".menu-item[data-sub]").forEach(item => {
    item.addEventListener("mouseenter", () => {
      const subId = item.getAttribute("data-sub");
      const submenu = document.getElementById(subId);
      submenu.style.display = "block";
    });
    item.addEventListener("mouseleave", () => {
      const subId = item.getAttribute("data-sub");
      const submenu = document.getElementById(subId);
      submenu.style.display = "none";
    });
  });

  // Desktop icons and menu clicks
  document.querySelectorAll(".desktop-icon, .menu-item").forEach(item => {
    item.addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      const app = item.getAttribute("data-app");
      const action = item.getAttribute("data-action");
      if (app) openWindow(app);
      if (action === "shutdown") shutdown();
      if (action === "run") openRunDialog();
      if (action === "help") openHelpDialog();
      if (action === "printers") openPrintersDialog();
      if (action === "taskbar") openTaskbarSettings();
      startMenu.style.display = "none";
    });
  });

  // Sound icon: Toggle sound on/off (logo only, no text)
  const soundIcon = document.querySelector(".sound-icon");
  soundIcon.addEventListener("click", () => {
    isSoundOn = !isSoundOn;
    soundIcon.src = isSoundOn ? "https://win98icons.alexmeub.com/icons/png/sound_card-3.png" : "https://win98icons.alexmeub.com/icons/png/sound_mute-3.png";
    if (isSoundOn) dingSound.play();
    else errorSound.play();
  });

  // Fatal error simulation (based on Windows 98)
  function showFatalError() {
    if (isSoundOn) criticalStop.play();
    const errorDiv = document.getElementById("fatal-error");
    errorDiv.style.display = "block";
    document.body.style.background = "#00008b"; /* Match Windows 98 blue background */
    document.getElementById("desktop").style.display = "none";
    document.getElementById("taskbar").style.display = "none";

    errorDiv.addEventListener("click", () => {
      errorDiv.style.display = "none";
      document.body.style.background = "url('./konachan.jpg') no-repeat center center fixed";
      document.body.style.backgroundSize = "cover";
      document.getElementById("desktop").style.display = "block";
      document.getElementById("taskbar").style.display = "flex";
      if (isSoundOn) dingSound.play();
    });
  }

  // Trigger fatal error on CTRL+ALT+DELETE (simulating Windows 98 crash)
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && e.key === "Delete") {
      showFatalError();
    }
  });

  // Run dialog: Windows 98’s Run feature
  function openRunDialog() {
    const runWindow = document.createElement("div");
    runWindow.className = "window";
    runWindow.style.width = "300px";
    runWindow.style.height = "150px";
    runWindow.style.left = "50%";
    runWindow.style.top = "50%";
    runWindow.style.transform = "translate(-50%, -50%)";
    runWindow.dataset.id = Date.now();
    runWindow.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">Run</div>
        <div class="title-bar-controls">
          <button class="minimize-btn">-</button>
          <button class="maximize-btn">□</button>
          <button class="close-btn">X</button>
        </div>
      </div>
      <div class="window-body">
        <p>Type the name of a program, folder, or document:</p>
        <input type="text" style="width: 90%; border: 2px inset #ffffff;">
        <button>OK</button>
        <button onclick="this.closest('.window').remove()">Cancel</button>
      </div>
      <div class="resize-handle"></div>`;
    document.getElementById("desktop").appendChild(runWindow);
    makeDraggable(runWindow);
    makeResizable(runWindow);
    runWindow.querySelector(".close-btn").addEventListener("click", () => runWindow.remove());
    runWindow.querySelector(".minimize-btn").addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      runWindow.classList.toggle("minimized");
      updateTask(runWindow);
    });
    runWindow.querySelector(".maximize-btn").addEventListener("click", () => maximizeWindow(runWindow));
  }

  // Help dialog: Windows 98’s Help feature
  function openHelpDialog() {
    const helpWindow = document.createElement("div");
    helpWindow.className = "window";
    helpWindow.style.width = "400px";
    helpWindow.style.height = "300px";
    helpWindow.style.left = "50%";
    helpWindow.style.top = "50%";
    helpWindow.style.transform = "translate(-50%, -50%)";
    helpWindow.dataset.id = Date.now();
    helpWindow.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">Windows Help</div>
        <div class="title-bar-controls">
          <button class="minimize-btn">-</button>
          <button class="maximize-btn">□</button>
          <button class="close-btn">X</button>
        </div>
      </div>
      <div class="window-body">
        <p>Welcome to Windows 98 Help!</p>
        <p>Search for topics or browse the index.</p>
      </div>
      <div class="resize-handle"></div>`;
    document.getElementById("desktop").appendChild(helpWindow);
    makeDraggable(helpWindow);
    makeResizable(helpWindow);
    helpWindow.querySelector(".close-btn").addEventListener("click", () => helpWindow.remove());
    helpWindow.querySelector(".minimize-btn").addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      helpWindow.classList.toggle("minimized");
      updateTask(helpWindow);
    });
    helpWindow.querySelector(".maximize-btn").addEventListener("click", () => maximizeWindow(helpWindow));
  }

  // Printers dialog: Windows 98’s Printers feature
  function openPrintersDialog() {
    const printersWindow = document.createElement("div");
    printersWindow.className = "window";
    printersWindow.style.width = "400px";
    printersWindow.style.height = "300px";
    printersWindow.style.left = "50%";
    printersWindow.style.top = "50%";
    printersWindow.style.transform = "translate(-50%, -50%)";
    printersWindow.dataset.id = Date.now();
    printersWindow.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">Printers</div>
        <div class="title-bar-controls">
          <button class="minimize-btn">-</button>
          <button class="maximize-btn">□</button>
          <button class="close-btn">X</button>
        </div>
      </div>
      <div class="window-body">
        <p>No printers installed.</p>
        <button>Add Printer</button>
      </div>
      <div class="resize-handle"></div>`;
    document.getElementById("desktop").appendChild(printersWindow);
    makeDraggable(printersWindow);
    makeResizable(printersWindow);
    printersWindow.querySelector(".close-btn").addEventListener("click", () => printersWindow.remove());
    printersWindow.querySelector(".minimize-btn").addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      printersWindow.classList.toggle("minimized");
      updateTask(printersWindow);
    });
    printersWindow.querySelector(".maximize-btn").addEventListener("click", () => maximizeWindow(printersWindow));
  }

  // Taskbar & Start Menu settings: Windows 98’s settings dialog
  function openTaskbarSettings() {
    const settingsWindow = document.createElement("div");
    settingsWindow.className = "window";
    settingsWindow.style.width = "400px";
    settingsWindow.style.height = "300px";
    settingsWindow.style.left = "50%";
    settingsWindow.style.top = "50%";
    settingsWindow.style.transform = "translate(-50%, -50%)";
    settingsWindow.dataset.id = Date.now();
    settingsWindow.innerHTML = `
      <div class="title-bar">
        <div class="title-bar-text">Taskbar & Start Menu Properties</div>
        <div class="title-bar-controls">
          <button class="minimize-btn">-</button>
          <button class="maximize-btn">□</button>
          <button class="close-btn">X</button>
        </div>
      </div>
      <div class="window-body">
        <p>Taskbar Options:</p>
        <input type="checkbox" id="autohide"> Auto-hide the taskbar<br>
        <input type="checkbox" id="alwaysontop"> Always on top<br>
        <button>Apply</button>
      </div>
      <div class="resize-handle"></div>`;
    document.getElementById("desktop").appendChild(settingsWindow);
    makeDraggable(settingsWindow);
    makeResizable(settingsWindow);
    settingsWindow.querySelector(".close-btn").addEventListener("click", () => settingsWindow.remove());
    settingsWindow.querySelector(".minimize-btn").addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      settingsWindow.classList.toggle("minimized");
      updateTask(settingsWindow);
    });
    settingsWindow.querySelector(".maximize-btn").addEventListener("click", () => maximizeWindow(settingsWindow));
  }

  // Window opening: Full Windows 98 application set, including DoomPDF
  function openWindow(type) {
    const windowDiv = document.createElement("div");
    windowDiv.className = "window";
    windowDiv.style.width = "400px";
    windowDiv.style.height = "300px";
    windowDiv.style.left = `${Math.random() * (window.innerWidth - 400)}px`;
    windowDiv.style.top = `${Math.random() * (window.innerHeight - 330)}px`;
    windowDiv.dataset.id = Date.now();

    let content = "";
    if (type === "mycomputer") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">My Computer</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <p>Local Drives:</p>
          <ul>
            <li><img src="https://win98icons.alexmeub.com/icons/png/drive_hard-0.png" style="image-rendering: pixelated;"> (C:) - 10 MB free</li>
            <li><img src="https://win98icons.alexmeub.com/icons/png/drive_cd-0.png" style="image-rendering: pixelated;"> (D:) - CD-ROM</li>
            <li><img src="https://win98icons.alexmeub.com/icons/png/drive_floppy-0.png" style="image-rendering: pixelated;"> (A:) - Floppy</li>
          </ul>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "recyclebin") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Recycle Bin</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <p>The Recycle Bin is currently empty.</p>
          <button onclick="document.getElementById('ding-sound').play()">Empty Recycle Bin</button>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "network") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Network Neighborhood</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <p>Network Resources:</p>
          <ul>
            <li><img src="https://win98icons.alexmeub.com/icons/png/network_connection-0.png" style="image-rendering: pixelated;"> Local Network</li>
          </ul>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "iexplore") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Internet Explorer</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <iframe src="https://www.google.com" style="width:100%; height:90%; border:2px inset #ffffff;" allow="camera; microphone; geolocation"></iframe>
          <p style="color: red; font-size: 12px;">Note: Internet Explorer may take a moment to load Google due to cross-origin policies. Ensure your browser allows third-party cookies, site data, and media permissions for this demo.</p>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "explorer") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Windows Explorer</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <p>C:\\</p>
          <ul>
            <li><img src="https://win98icons.alexmeub.com/icons/png/folder_closed-0.png" style="image-rendering: pixelated;"> Documents</li>
            <li><img src="https://win98icons.alexmeub.com/icons/png/file_lines-0.png" style="image-rendering: pixelated;"> Notes.txt</li>
            <li><img src="https://win98icons.alexmeub.com/icons/png/folder_open-0.png" style="image-rendering: pixelated;"> Windows</li>
          </ul>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "notepad") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Notepad</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <textarea placeholder="Type your notes here..."></textarea>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "paint") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Paint</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <canvas id="paint-canvas-${windowDiv.dataset.id}"></canvas>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "mediaplayer") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Windows Media Player</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <video controls style="width: 100%; height: 90%; border: 2px inset #ffffff;">
            <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" type="video/mp4">
          </video>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "control") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Control Panel</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <p>Display Settings:</p>
          <input type="file" id="wallpaper-input-${windowDiv.dataset.id}" accept="image/png,image/jpeg,image/gif" onchange="updateLogo(this, '${windowDiv.dataset.id}')">
          <p>System: Windows 98</p>
          <p>RAM: 64 MB</p>
          <p>Sound: <img src="https://win98icons.alexmeub.com/icons/png/sound_card-3.png" style="image-rendering: pixelated;"> ${isSoundOn ? "Enabled" : "Disabled"}</p>
          <p>Network: Connected</p>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "minesweeper") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Minesweeper</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <div class="minesweeper-grid" id="minesweeper-grid-${windowDiv.dataset.id}"></div>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "solitaire") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">Solitaire</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <p>Simple Solitaire Game (Demo):</p>
          <div style="display: flex; justify-content: space-around;">
            <div>♠ A</div>
            <div>♥ 2</div>
            <div>♦ 3</div>
          </div>
          <button onclick="newGame('${windowDiv.dataset.id}')">New Game</button>
        </div>
        <div class="resize-handle"></div>`;
    } else if (type === "doompdf") {
      content = `
        <div class="title-bar">
          <div class="title-bar-text">DoomPDF</div>
          <div class="title-bar-controls">
            <button class="minimize-btn">-</button>
            <button class="maximize-btn">□</button>
            <button class="close-btn">X</button>
          </div>
        </div>
        <div class="window-body">
          <canvas id="doompdf-canvas-${windowDiv.dataset.id}" width="800" height="600"></canvas>
          <p style="color: white; font-size: 12px;">Controls: WASD (move), Q (ascend), Z (enter), A (use), Space (fire), Shift + WASD (sprint), N (map), 1-7 (weapons). Upload custom WAD files at: <a href="https://doompdf.pages.dev/" target="_blank">https://doompdf.pages.dev/</a></p>
          <p style="color: red; font-size: 12px;">Note: This demo only works in Chromium-based browsers. Source code: <a href="https://github.com/ading2210/doompdf" target="_blank">https://github.com/ading2210/doompdf</a></p>
          <input type="file" id="wad-upload-${windowDiv.dataset.id}" accept=".wad" style="margin-top: 10px;" onchange="uploadWAD(this, '${windowDiv.dataset.id}')">
        </div>
        <div class="resize-handle"></div>`;
    }

    windowDiv.innerHTML = content;
    document.getElementById("desktop").appendChild(windowDiv);
    makeDraggable(windowDiv);
    makeResizable(windowDiv);
    addTask(type, windowDiv);

    // Window controls
    const minimizeBtn = windowDiv.querySelector(".minimize-btn");
    const maximizeBtn = windowDiv.querySelector(".maximize-btn");
    const closeBtn = windowDiv.querySelector(".close-btn");

    minimizeBtn.addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      windowDiv.classList.toggle("minimized");
      updateTask(windowDiv);
    });

    maximizeBtn.addEventListener("click", () => maximizeWindow(windowDiv));

    closeBtn.addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      windowDiv.remove();
      removeTask(windowDiv);
    });

    // Wallpaper upload as logo (Control Panel only)
    if (type === "control") {
      const wallpaperInput = windowDiv.querySelector(`#wallpaper-input-${windowDiv.dataset.id}`);
      wallpaperInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
        if (file && allowedTypes.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = () => {
            const desktopIcons = document.querySelectorAll(".desktop-icon img");
            desktopIcons.forEach(icon => icon.src = reader.result);
            const taskbarApps = document.querySelectorAll(".taskbar-app img, .pinned-app img");
            taskbarApps.forEach(app => app.src = reader.result);
            const startMenuItems = document.querySelectorAll(".start-menu li img, .submenu li img");
            startMenuItems.forEach(item => item.src = reader.result);
            document.body.style.background = `url('${reader.result}') no-repeat center center fixed`;
            document.body.style.backgroundSize = "cover";
            if (isSoundOn) dingSound.play();
          };
          reader.readAsDataURL(file);
        } else {
          if (isSoundOn) errorSound.play();
          alert("Only image (PNG, JPG, GIF) files are allowed as logos!");
        }
      });
    }

    // DoomPDF gameplay (simple canvas-based demo)
    if (type === "doompdf") {
      const canvas = windowDiv.querySelector(`#doompdf-canvas-${windowDiv.dataset.id}`);
      const ctx = canvas.getContext("2d");
      
      // Simple player object
      let player = { x: 400, y: 300, speed: 5, sprintSpeed: 10 };
      let keys = {};

      // Draw initial scene (simple Doom-like grid)
      function drawGame() {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 800, 600);

        ctx.fillStyle = "red";
        ctx.fillRect(player.x - 10, player.y - 10, 20, 20); // Player as red square

        ctx.fillStyle = "gray";
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            ctx.fillRect(i * 80, j * 60, 40, 40); // Simple grid for walls
          }
        }
      }

      // Handle keyboard controls
      document.addEventListener("keydown", (e) => {
        keys[e.key] = true;
        if (e.key === "Shift") keys["shift"] = true;
      });

      document.addEventListener("keyup", (e) => {
        keys[e.key] = false;
        if (e.key === "Shift") keys["shift"] = false;
      });

      // Move player
      function updatePlayer() {
        const speed = keys["shift"] ? player.sprintSpeed : player.speed;

        if (keys["w"]) player.y -= speed;
        if (keys["s"]) player.y += speed;
        if (keys["a"]) player.x -= speed;
        if (keys["d"]) player.x += speed;
        if (keys["q"]) player.y -= speed * 2; // Ascend
        if (keys["z"]) console.log("Enter pressed"); // Simulate enter
        if (keys["a"]) console.log("Use pressed"); // Simulate use
        if (keys[" "]) console.log("Fire pressed"); // Simulate fire
        if (keys["n"]) console.log("Map toggled"); // Simulate map
        if (keys["1"] || keys["2"] || keys["3"] || keys["4"] || keys["5"] || keys["6"] || keys["7"]) console.log(`Weapon ${e.key} selected`); // Simulate weapon selection

        // Keep player within bounds
        player.x = Math.max(10, Math.min(player.x, 790));
        player.y = Math.max(10, Math.min(player.y, 590));
      }

      // Game loop
      function gameLoop() {
        updatePlayer();
        drawGame();
        requestAnimationFrame(gameLoop);
      }

      gameLoop();

      // WAD file upload
      const wadUpload = windowDiv.querySelector(`#wad-upload-${windowDiv.dataset.id}`);
      wadUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith(".wad")) {
          if (isSoundOn) dingSound.play();
          alert("WAD file uploaded successfully! This demo simulates loading but requires a Chromium-based browser for full functionality: https://doompdf.pages.dev/");
        } else {
          if (isSoundOn) errorSound.play();
          alert("Please upload a .wad file only!");
        }
      });
    }

    // Paint: Basic drawing functionality
    if (type === "paint") {
      const canvas = windowDiv.querySelector(`#paint-canvas-${windowDiv.dataset.id}`);
      canvas.width = 350;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      let painting = false;

      canvas.addEventListener("mousedown", () => painting = true);
      canvas.addEventListener("mouseup", () => painting = false);
      canvas.addEventListener("mousemove", (e) => {
        if (painting) {
          ctx.fillStyle = "black";
          ctx.fillRect(e.offsetX, e.offsetY, 5, 5);
        }
      });
    }

    // Minesweeper: Simple grid (non-functional demo)
    if (type === "minesweeper") {
      const grid = windowDiv.querySelector(`#minesweeper-grid-${windowDiv.dataset.id}`);
      for (let i = 0; i < 81; i++) {
        const cell = document.createElement("div");
        cell.className = "minesweeper-cell";
        cell.addEventListener("click", () => {
          if (isSoundOn) clickSound.play();
          cell.style.background = "#bdbdbd";
          cell.style.border = "2px inset #ffffff";
        });
        grid.appendChild(cell);
      }
    }

    // Solitaire: Simple card game demo
    if (type === "solitaire") {
      const solitaireWindow = windowDiv.querySelector(".window-body");
      solitaireWindow.innerHTML = `
        <p>Simple Solitaire Game (Demo):</p>
        <div style="display: flex; justify-content: space-around;">
          <div>♠ A</div>
          <div>♥ 2</div>
          <div>♦ 3</div>
        </div>
        <button onclick="newGame('${windowDiv.dataset.id}')">New Game</button>
      `;
    }
  }

  // Dragging: Allow movement even when maximized
  function makeDraggable(element) {
    const titleBar = element.querySelector(".title-bar");
    let isDragging = false, currentX, currentY, initialX, initialY;

    titleBar.addEventListener("mousedown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      element.style.zIndex = Math.max(...Array.from(document.querySelectorAll(".window")).map(w => w.style.zIndex || 10)) + 1;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        // Allow dragging even when maximized, respecting screen bounds
        if (!element.classList.contains("maximized") || (element.classList.contains("maximized") && (currentX > 0 || currentY > 0))) {
          element.style.left = `${Math.max(0, Math.min(currentX, window.innerWidth - parseInt(element.style.width) || element.offsetWidth))}px`;
          element.style.top = `${Math.max(0, Math.min(currentY, window.innerHeight - parseInt(element.style.height) || element.offsetHeight - 30))}px`; // Account for taskbar
        }
      }
    });

    document.addEventListener("mouseup", () => isDragging = false);

    currentX = parseInt(element.style.left) || 0;
    currentY = parseInt(element.style.top) || 0;
  }

  // Mouse-based resizing
  function makeResizable(element) {
    const resizeHandle = element.querySelector(".resize-handle");
    let isResizing = false, startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener("mousedown", (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(element.style.width) || element.offsetWidth;
      startHeight = parseInt(element.style.height) || element.offsetHeight;
      element.style.zIndex = Math.max(...Array.from(document.querySelectorAll(".window")).map(w => w.style.zIndex || 10)) + 1;
    });

    document.addEventListener("mousemove", (e) => {
      if (isResizing) {
        e.preventDefault();
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        element.style.width = `${Math.max(200, startWidth + dx)}px`;
        element.style.height = `${Math.max(100, startHeight + dy)}px`;
      }
    });

    document.addEventListener("mouseup", () => isResizing = false);
  }

  // Maximize window function
  function maximizeWindow(element) {
    if (isSoundOn) clickSound.play();
    if (element.classList.contains("maximized")) {
      element.classList.remove("maximized");
      element.style.width = element.dataset.originalWidth || "400px";
      element.style.height = element.dataset.originalHeight || "300px";
      element.style.left = element.dataset.originalLeft || "0px";
      element.style.top = element.dataset.originalTop || "0px";
      element.style.resize = "both";
    } else {
      element.dataset.originalWidth = element.style.width;
      element.dataset.originalHeight = element.style.height;
      element.dataset.originalLeft = element.style.left;
      element.dataset.originalTop = element.style.top;
      element.classList.add("maximized");
      element.style.width = "100% !important";
      element.style.height = "calc(100% - 30px) !important";
      element.style.top = "0 !important";
      element.style.left = "0 !important";
      element.style.resize = "both"; // Allow resizing even when maximized
    }
  }

  // Add task to taskbar
  function addTask(type, windowDiv) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "taskbar-app active";
    taskDiv.innerHTML = `
      <img src="https://win98icons.alexmeub.com/icons/png/${type === "mycomputer" ? "computer_explorer-0" : type === "recyclebin" ? "recycle_bin_empty-4" : type === "network" ? "network_neighborhood-0" : type === "iexplore" ? "internet_explorer-0" : type === "explorer" ? "explorer-0" : type === "notepad" ? "notepad-0" : type === "paint" ? "paint-0" : type === "mediaplayer" ? "media_player-0" : type === "control" ? "control_panel-4" : type === "minesweeper" ? "minesweeper-0" : type === "solitaire" ? "solitaire-0" : "game-0"}.png" style="image-rendering: pixelated;">
      ${type === "mycomputer" ? "My Computer" : type === "recyclebin" ? "Recycle Bin" : type === "network" ? "Network Neighborhood" : type === "iexplore" ? "Internet Explorer" : type === "explorer" ? "Windows Explorer" : type === "notepad" ? "Notepad" : type === "paint" ? "Paint" : type === "mediaplayer" ? "Windows Media Player" : type === "control" ? "Control Panel" : type === "minesweeper" ? "Minesweeper" : type === "solitaire" ? "Solitaire" : "DoomPDF"}
    `;
    taskDiv.dataset.window = windowDiv.dataset.id;
    document.querySelector(".taskbar-apps").appendChild(taskDiv);

    taskDiv.addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      if (windowDiv.classList.contains("minimized")) {
        windowDiv.classList.remove("minimized");
        taskDiv.classList.add("active");
      }
    });
  }

  // Remove task from taskbar
  function removeTask(windowDiv) {
    const task = document.querySelector(`.taskbar-app[data-window="${windowDiv.dataset.id}"]`);
    if (task) task.remove();
  }

  // Update taskbar state
  function updateTask(windowDiv) {
    const task = document.querySelector(`.taskbar-app[data-window="${windowDiv.dataset.id}"]`);
    if (task) task.classList.toggle("active", !windowDiv.classList.contains("minimized"));
  }

  // Pin application to taskbar
  function pinApp(type) {
    const pinnedDiv = document.createElement("div");
    pinnedDiv.className = "pinned-app";
    pinnedDiv.innerHTML = `
      <img src="https://win98icons.alexmeub.com/icons/png/${type === "mycomputer" ? "computer_explorer-0" : type === "recyclebin" ? "recycle_bin_empty-4" : type === "network" ? "network_neighborhood-0" : type === "iexplore" ? "internet_explorer-0" : type === "explorer" ? "explorer-0" : type === "notepad" ? "notepad-0" : type === "paint" ? "paint-0" : type === "mediaplayer" ? "media_player-0" : type === "control" ? "control_panel-4" : type === "minesweeper" ? "minesweeper-0" : type === "solitaire" ? "solitaire-0" : "game-0"}.png" style="image-rendering: pixelated;">
    `;
    pinnedDiv.dataset.app = type;
    document.querySelector(".taskbar-pinned").appendChild(pinnedDiv);

    pinnedDiv.addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      openWindow(type);
    });
  }

  // Context menu: Full Windows 98 right-click functionality
  const contextMenu = document.getElementById("context-menu");
  let currentWindow = null;

  document.addEventListener("contextmenu", (e) => {
    if (e.target.closest(".window")) {
      e.preventDefault();
      currentWindow = e.target.closest(".window");
      contextMenu.style.display = "block";
      contextMenu.style.left = `${e.pageX}px`;
      contextMenu.style.top = `${e.pageY}px`;
    }
  });

  document.addEventListener("click", () => contextMenu.style.display = "none");

  contextMenu.querySelectorAll("li").forEach(item => {
    item.addEventListener("click", () => {
      if (isSoundOn) clickSound.play();
      const action = item.getAttribute("data-action");
      if (action === "maximize") maximizeWindow(currentWindow);
      else if (action === "minimize") {
        currentWindow.classList.add("minimized");
        updateTask(currentWindow);
      } else if (action === "restore" && currentWindow.classList.contains("maximized")) {
        currentWindow.classList.remove("maximized");
        currentWindow.style.width = currentWindow.dataset.originalWidth || "400px";
        currentWindow.style.height = currentWindow.dataset.originalHeight || "300px";
        currentWindow.style.left = currentWindow.dataset.originalLeft || "0px";
        currentWindow.style.top = currentWindow.dataset.originalTop || "0px";
        currentWindow.style.resize = "both";
      } else if (action === "move") {
        makeDraggable(currentWindow);
      } else if (action === "size") {
        currentWindow.style.resize = "both";
      } else if (action === "close") {
        currentWindow.remove();
        removeTask(currentWindow);
      } else if (action === "pin") {
        const type = currentWindow.querySelector(".title-bar-text").innerText.toLowerCase();
        pinApp(type);
      }
      contextMenu.style.display = "none";
    });
  });

  // Shutdown: Windows 98’s authentic shutdown screen
  function shutdown() {
    if (isSoundOn) shutdownSound.play();
    document.body.innerHTML = `
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; color: white; font-size: 20px; background: #000080; padding: 20px; border: 2px solid #808080;">
        <p>It is now safe to turn off your computer.</p>
      </div>`;
    setTimeout(() => document.body.style.background = "black", 2000);
  }

  // Update logo function for Control Panel
  function updateLogo(input, windowId) {
    const file = input.files[0];
    const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        const desktopIcons = document.querySelectorAll(".desktop-icon img");
        desktopIcons.forEach(icon => icon.src = reader.result);
        const taskbarApps = document.querySelectorAll(".taskbar-app img, .pinned-app img");
        taskbarApps.forEach(app => app.src = reader.result);
        const startMenuItems = document.querySelectorAll(".start-menu li img, .submenu li img");
        startMenuItems.forEach(item => item.src = reader.result);
        document.body.style.background = `url('${reader.result}') no-repeat center center fixed`;
        document.body.style.backgroundSize = "cover";
        if (isSoundOn) dingSound.play();
      };
      reader.readAsDataURL(file);
    } else {
      if (isSoundOn) errorSound.play();
      alert("Only image (PNG, JPG, GIF) files are allowed as logos!");
    }
  }

  // Upload WAD file for DoomPDF
  function uploadWAD(input, windowId) {
    const file = input.files[0];
    if (file && file.name.endsWith(".wad")) {
      if (isSoundOn) dingSound.play();
      alert("WAD file uploaded successfully! This demo simulates loading but requires a Chromium-based browser for full functionality: https://doompdf.pages.dev/");
    } else {
      if (isSoundOn) errorSound.play();
      alert("Please upload a .wad file only!");
    }
  }

  // New game for Solitaire (simple reset)
  function newGame(windowId) {
    if (isSoundOn) dingSound.play();
    const solitaireWindow = document.querySelector(`#${windowId} .window-body`);
    solitaireWindow.innerHTML = `
      <p>Simple Solitaire Game (Demo):</p>
      <div style="display: flex; justify-content: space-around;">
        <div>♠ A</div>
        <div>♥ 2</div>
        <div>♦ 3</div>
      </div>
      <button onclick="newGame('${windowId}')">New Game</button>
    `;
  }
});