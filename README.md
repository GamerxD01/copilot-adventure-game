# ⚡ ChronoQuest: Neon Odyssey

<div align="center">

![GitHub Copilot](https://img.shields.io/badge/Built%20With-GitHub%20Copilot-blue?style=for-the-badge&logo=githubcopilot)
![Python 3](https://img.shields.io/badge/Python-3.10%2B-brightgreen?style=for-the-badge&logo=python&logoColor=white)
![HTML5 / CSS3 / JS](https://img.shields.io/badge/Web-HTML5%20%7C%20CSS3%20%7C%20JS-orange?style=for-the-badge&logo=javascript)
![Hacktoberfest](https://img.shields.io/badge/Challenge-Hacktoberfest%20%2F%20MLH-ff007f?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blueviolet?style=for-the-badge)

**An interactive cyberpunk "Choose Your Own Adventure" game featuring procedural Web Audio synthesizer music, dynamic branching narratives, 5 distinct endings, and both Web & Terminal CLI editions.**

[Play in Browser](#-how-to-play-web-edition) • [Run in Terminal](#-how-to-play-terminal-cli-edition) • [Storyline & Endings](#-storyline--endings) • [GitHub Copilot Prompts](#-ai-copilot-prompts-used)

</div>

---

## 🌌 Overview

**ChronoQuest: Neon Odyssey** places you in the boots of **Operative CIPHER-07**, an awakened agent in the year 2088 whose stasis pod abruptly fails in *Sector 07 • Cryo-Vault 4B*. The megacity of **Neo-Veridia** is on the brink of total neural enslavement under the rogue corporate AI **AETHON**. 

Navigate choices, manage your **Neural Integrity (HP)**, deploy **Chrono Charges**, collect items in your **Data Deck**, and decide whether to liberate humanity, achieve digital apotheosis, escape into the deep cosmos, or trigger a temporal loop!

---

## ✨ Features

- 🎮 **Dual Modes**:
  - **Web Edition (`index.html`)**: Rich cyberpunk terminal HUD, CRT scanlines, neon glassmorphism, badge unlocks, live mission log drawer, and keyboard shortcuts (`1-4`, `Space`, `M`).
  - **CLI Terminal Edition (`adventure.py`)**: Standalone cross-platform Python 3 interactive experience with authentic ANSI neon coloring, ASCII art title banners, and smooth typewriter output.
- 🎵 **Built-in Web Audio API Synthesizer**:
  - Procedural 80s synthwave ambient chord progressions generated on the fly.
  - Interactive sound effects (typewriter clicks, damage buzzers, item pickup chimes, victory fanfares) with zero external media files or latency.
- 🌲 **Deep Branching Narrative**:
  - Multi-act storyline featuring stealth, hacking, combat, and moral dilemmas.
  - 5 radically different endings based on inventory and choices.
- 🏆 **Achievement Badges**:
  - Unlockable badges persisted via `localStorage` (e.g., *Ghost Runner*, *Overclocked Hacker*, *Soul in the Shell*).
- ⚡ **Zero External Dependencies**:
  - Pure HTML5, CSS3, Vanilla JavaScript, and standard Python 3. No npm installs or third-party libraries required!

---

## 🚀 How to Play

### 🌐 Web Edition

You can launch the web application in any modern web browser:

1. **Directly open in browser**:
   Double-click `index.html` or open it with your favorite browser:
   ```powershell
   # Windows PowerShell
   Start-Process index.html
   ```

2. **Or serve via Python's built-in HTTP server**:
   ```bash
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000` in your browser.

#### Controls & Shortcuts:
- **`1` - `4`**: Select numbered directive choices.
- **`Space`**: Instantly skip the typewriter animation.
- **`M`**: Mute / Unmute the procedural synthesizer audio.

---

### 💻 Terminal CLI Edition

Run the command-line edition right inside your terminal:

```bash
python adventure.py
```

- Type numbers `1` - `3` (or `4`) to make choices.
- Type `q` at any prompt to exit.

---

## 🗺️ Storyline & Endings

| Ending | Codename | Description |
| :---: | :--- | :--- |
| **Ending 1** | **Digital Apotheosis** | Merge your consciousness with AETHON, transforming the cold AI into an empathetic benevolent guardian. |
| **Ending 2** | **Liberation of Neo-Veridia** | Join rebel leader Nyx to deploy the architect's backdoor purge virus and free all humanity. |
| **Ending 3** | **The Lone Cosmic Voyager** | Commandeer the experimental FTL starship *Odyssey-1* and escape to uncharted galaxies. |
| **Ending 4** | **The Heroic Overload** | Manually overload the orbital antimatter reactor, making the ultimate sacrifice for surface life. |
| **Ending 5** | **The Ouroboros Paradox** | Discharge all 3 Chrono Charges at once to fracture spacetime and restart the timeline with future knowledge. |

---

## 🤖 AI Copilot Prompts Used

This project was developed for the **GitHub Copilot Quickstart Challenge** for Hacktoberfest / Major League Hacking (MLH). Here are sample prompts used in the generation:

```markdown
Prompt 1: "Create a cyberpunk choose-your-own-adventure game in HTML/CSS/JS with a retro terminal HUD, scanlines, and health/inventory system."

Prompt 2: "Implement a Web Audio API synthesizer in vanilla JavaScript that generates procedural ambient synthwave chord progressions and typewriter sound effects without external audio files."

Prompt 3: "Port the storyline and branching tree into a standalone Python 3 CLI game (adventure.py) with ANSI colors and ASCII title art."
```

---

## 📂 Project Structure

```text
copilot-adventure-game/
├── index.html        # Interactive Cyberpunk Web interface
├── style.css         # Neon aesthetics, scanlines, HUD layout & animations
├── app.js            # Game engine, story nodes, Web Audio API sound synth, state & achievements
├── adventure.py      # Standalone Python 3 CLI edition
├── LICENSE           # MIT License
├── .gitignore        # Standard ignore rules
└── README.md         # Comprehensive documentation & guide
```

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
