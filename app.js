/**
 * ChronoQuest: Neon Odyssey
 * Interactive Cyberpunk Choose Your Own Adventure Engine
 * Built with HTML5, CSS3, JavaScript & Web Audio API
 */

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class CyberAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.bgmOsc = null;
      this.bgmGain = null;
      this.isPlayingBgm = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playTone(freq, type = 'sine', duration = 0.15, gainVal = 0.1) {
      if (!this.enabled) return;
      try {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio might be blocked until user gesture
      }
    }

    playClick() {
      this.playTone(880, 'triangle', 0.08, 0.08);
    }

    playType() {
      this.playTone(420 + Math.random() * 80, 'sine', 0.03, 0.03);
    }

    playSuccess() {
      if (!this.enabled) return;
      this.playTone(523.25, 'triangle', 0.1, 0.1);
      setTimeout(() => this.playTone(659.25, 'triangle', 0.1, 0.1), 100);
      setTimeout(() => this.playTone(783.99, 'sine', 0.25, 0.12), 200);
    }

    playDamage() {
      if (!this.enabled) return;
      this.playTone(150, 'sawtooth', 0.25, 0.15);
      setTimeout(() => this.playTone(110, 'sawtooth', 0.35, 0.15), 100);
    }

    playVictory() {
      if (!this.enabled) return;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.12), idx * 150);
      });
    }

    startAmbientSynth() {
      if (!this.enabled || this.isPlayingBgm) return;
      try {
        this.init();
        const chords = [
          [130.81, 196.00, 246.94], // C maj 7
          [110.00, 164.81, 220.00], // A min
          [146.83, 220.00, 261.63], // D min
          [98.00, 146.83, 196.00]   // G maj
        ];
        let chordIdx = 0;

        const playChord = () => {
          if (!this.isPlayingBgm || !this.enabled) return;
          const current = chords[chordIdx % chords.length];
          chordIdx++;

          current.forEach((f) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.8);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 4.0);
          });

          this.bgmTimer = setTimeout(playChord, 4000);
        };

        this.isPlayingBgm = true;
        playChord();
      } catch (e) {
        // audio context handling
      }
    }

    stopAmbientSynth() {
      this.isPlayingBgm = false;
      if (this.bgmTimer) clearTimeout(this.bgmTimer);
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) {
        this.startAmbientSynth();
      } else {
        this.stopAmbientSynth();
      }
      return this.enabled;
    }
  }

  const audio = new CyberAudio();

  // --- GAME STATE ---
  const state = {
    hp: 100,
    maxHp: 100,
    energy: 3,
    inventory: [],
    currentNode: 'intro',
    typingTimer: null,
    isTyping: false,
    achievements: JSON.parse(localStorage.getItem('chronoquest_achievements') || '{}')
  };

  const ACHIEVEMENTS_DEF = [
    { id: 'first_step', name: 'Awakened Operative', desc: 'Break out of Cryo-Vault 4B alive.', icon: '🔓' },
    { id: 'ghost_runner', name: 'Ghost Runner', desc: 'Bypass security drones without triggering alarms.', icon: '👤' },
    { id: 'overclocked', name: 'Overclocked Hacker', desc: 'Successfully breach the mainframe encryption.', icon: '💻' },
    { id: 'cyborg_ally', name: 'Soul in the Shell', desc: 'Gain the trust of Android Rebel Nyx.', icon: '🤝' },
    { id: 'ending_transcend', name: 'Digital Apotheosis', desc: 'Unlock Ending 1: Merge with the Quantum Core.', icon: '✨' },
    { id: 'ending_rebellion', name: 'Liberator of Neo-Veridia', desc: 'Unlock Ending 2: Trigger the citizen uprising.', icon: '🔥' }
  ];

  // --- STORY NODES TREE ---
  const storyTree = {
    intro: {
      title: "CRYOGENIC STASIS COLLAPSE",
      location: "SECTOR 07 • CRYO-VAULT 4B",
      badge: { icon: "⚡", text: "STATUS: CRITICAL PURGE" },
      text: `Cold nitrogen mist hissed across your cracked visor. 

The stasis chamber's diagnostic lights blared crimson: [EMERGENCY DEFROST // ARCHIVE CORRUPTED]. You are Operative CIPHER-07. Your biometric memory is shattered, but tactical neural implants are already recalibrating.

Heavy metallic footsteps echo through the corridor outside. An automated patrol drone is sweeping the blast-sealed corridor. You have only moments before sterilization gas is deployed!`,
      choices: [
        {
          text: "Hack the emergency terminal to disable the lockdown and scan the perimeter.",
          nextNode: "hack_terminal",
          cost: null
        },
        {
          text: "Pry open the ventilation shaft behind your stasis pod and crawl through stealthily.",
          nextNode: "crawl_vents",
          cost: null
        },
        {
          text: "Grab an ionized fire axe from the safety bulkhead and prepare to ambush the drone.",
          nextNode: "combat_drone",
          cost: null
        }
      ]
    },

    hack_terminal: {
      title: "NEURAL BYPASS INITIATED",
      location: "SECTOR 07 • ARCHIVE SUB-LEVEL",
      badge: { icon: "💻", text: "DATA BREACH: SUCCESS" },
      text: `Your fingers plug directly into the fiber-optic port. Waves of raw data surge through your optic nerve. 

You override the security protocol, bypassing the security lockdown! The drone outside re-routes to sector 9. While in the data stream, you siphon an encrypted [Security Keycard] and a [Data Crystal] containing architectural schematics of the Orbital Core.`,
      onEnter: (st) => {
        addItem(st, "Security Keycard");
        addItem(st, "Data Crystal");
        unlockAchievement('overclocked');
      },
      choices: [
        {
          text: "Access the high-speed cargo maglev toward the Orbital Citadel.",
          nextNode: "maglev_station",
          cost: null
        },
        {
          text: "Descend into the Under-City of Neo-Veridia to meet the Android Resistance.",
          nextNode: "undercity_entry",
          cost: null
        }
      ]
    },

    crawl_vents: {
      title: "SHADOWS IN THE CONDUIT",
      location: "SECTOR 07 • VENTILATION SHAFT",
      badge: { icon: "👤", text: "STEALTH: UNDETECTED" },
      text: `You slip quietly into the narrow alloy duct. Below the grates, twin security sentries glide past, scanning with scarlet laser arrays. 

As you navigate the labyrinthine ductwork, your scanner detects a cache discarded by a fallen smuggler. You retrieve a pristine [Plasma Torch] and a field repair stimpack (+20 HP)!`,
      onEnter: (st) => {
        addItem(st, "Plasma Torch");
        healPlayer(st, 20);
        unlockAchievement('ghost_runner');
        unlockAchievement('first_step');
      },
      choices: [
        {
          text: "Drop into the lower filtration plant toward the Under-City.",
          nextNode: "undercity_entry",
          cost: null
        },
        {
          text: "Use the Plasma Torch to cut into the freight elevator leading to the Orbital Citadel.",
          nextNode: "elevator_shaft",
          cost: null
        }
      ]
    },

    combat_drone: {
      title: "METAL & SPARKS",
      location: "SECTOR 07 • CORRIDOR 4B",
      badge: { icon: "⚔️", text: "COMBAT ENGAGEMENT" },
      text: `As the blast door slides open, you launch forward with the heavy axe! The security drone screeches, discharging a plasma arc that grazes your shoulder (-25 HP). 

With a decisive strike, you cleave the drone's power capacitor. It shudders and collapses in an explosion of blue sparks. From its wreckage, you salvage an unstable [Quantum Core].`,
      onEnter: (st) => {
        damagePlayer(st, 25);
        addItem(st, "Quantum Core");
        unlockAchievement('first_step');
      },
      choices: [
        {
          text: "Rush down the corridor before reinforcements arrive and jump aboard the cargo maglev.",
          nextNode: "maglev_station",
          cost: null
        },
        {
          text: "Dive down the garbage chute into the Under-City.",
          nextNode: "undercity_entry",
          cost: null
        }
      ]
    },

    undercity_entry: {
      title: "THE NEON SLUMS OF NEO-VERIDIA",
      location: "UNDER-CITY • DISTRICT 9 'THE RUST'",
      badge: { icon: "🏙️", text: "POPULATION: ROGUE & UNREGULATED" },
      text: `Acid rain patters against towering holograms advertising cybernetic implants. Steam billows from street vendors selling synthesized nutrient bars.

A hooded figure with glowing emerald optic lenses steps out of the shadows.
"Cipher-07," she whispers. "I am Nyx. We've monitored your revival. Corporate AI 'AETHON' is hours away from wiping all human volition in the sector. We need your tactical neural link."`,
      choices: [
        {
          text: "Ally with Nyx: Combine forces to mount a frontal assault on the Citadel broadcast tower.",
          nextNode: "rebellion_assault",
          cost: null
        },
        {
          text: "Show Nyx your recovered data and devise an infiltration strategy.",
          nextNode: "resistance_strategy",
          cost: null
        },
        {
          text: "Distrust her: Slip into the crowded neon market and head toward the orbital transit hub alone.",
          nextNode: "lone_path",
          cost: null
        }
      ]
    },

    maglev_station: {
      title: "HIGH-SPEED ASCENT",
      location: "TRANSIT NEXUS • MAGLEV CAR 03",
      badge: { icon: "🚄", text: "SPEED: MACH 2.4" },
      text: `The maglev bullet train tears through the stratosphere toward the glittering clouds of the Orbital Citadel. 

A high-ranking Syndicate Enforcer enters the passenger carriage with two elite synthetic bodyguards! His eye implants lock onto you: "Unregistered biometric signature. Terminate on sight!"`,
      choices: [
        {
          text: "Spend 1 Chrono Charge to trigger temporal reflex overclocking and eliminate the escorts.",
          nextNode: "chrono_reflex_fight",
          cost: { energy: 1 }
        },
        {
          text: "Present the Security Keycard and bluff your way as an undercover inspection officer.",
          nextNode: "keycard_bluff",
          requiresItem: "Security Keycard"
        },
        {
          text: "Take cover behind the fortified seats and return fire with stolen energy sidearms.",
          nextNode: "train_shootout",
          cost: null
        }
      ]
    },

    elevator_shaft: {
      title: "THE VERTICAL CHASM",
      location: "ORBITAL ELEVATOR • SHAFT 8",
      badge: { icon: "🏗️", text: "ELEVATION: 12,000 METERS" },
      text: `Using your Plasma Torch, you weld your magnetic boots to the elevator counter-weights. The colossal city spreads below you like a motherboard glowing in the night. 

As you ascend, you intercept an unencrypted broadcast: AI AETHON is consolidating its subroutines in the Core Chamber directly above you.`,
      choices: [
        {
          text: "Infiltrate the Primary Quantum Core Chamber directly.",
          nextNode: "aethon_core",
          cost: null
        },
        {
          text: "Breach the orbital shuttle hangar to secure an escape spacecraft.",
          nextNode: "hangar_escape",
          cost: null
        }
      ]
    },

    resistance_strategy: {
      title: "THE REBEL SYNDICATE'S GAMBIT",
      location: "RESISTANCE DEN • CIPHER BASE",
      badge: { icon: "🤝", text: "ALLIANCE SECURED" },
      text: `In the subterranean safehouse, Nyx inspects your files. Her cybernetic eyes widen in realization.
"You hold the primary encryption cipher from the original architect! With this, we don't just stop AETHON—we can broadcast complete freedom to every enslaved android and citizen across the globe!"

She hands you an [EMP Grenade] and synchronizes her neural core with yours.`,
      onEnter: (st) => {
        addItem(st, "EMP Grenade");
        unlockAchievement('cyborg_ally');
      },
      choices: [
        {
          text: "Lead the broadcast tower liberation team with Nyx.",
          nextNode: "ending_rebellion_node",
          cost: null
        },
        {
          text: "Infiltrate AETHON's Core chamber yourself while Nyx creates a massive diversion.",
          nextNode: "aethon_core",
          cost: null
        }
      ]
    },

    chrono_reflex_fight: {
      title: "CHRONO-OVERCLOCK STRIKE",
      location: "MAGLEV CAR 03",
      badge: { icon: "⏳", text: "TEMPORAL OVERCLOCK ACTIVE" },
      text: `Time grinds to an absolute crawl. Tracer rounds hang stationary in the humid air. 

With superhuman agility, you sprint across the carriage, disarming the Enforcer before a single heartbeat passes. When normal time resumes, all hostiles lie unconscious on the floor!

The train pulls into the Orbital Mainframe station.`,
      onEnter: (st) => {
        useEnergy(st, 1);
      },
      choices: [
        {
          text: "Step out onto the Citadel platform and enter AETHON's Core.",
          nextNode: "aethon_core",
          cost: null
        }
      ]
    },

    keycard_bluff: {
      title: "SMOOTH TALK IN VELVET STEEL",
      location: "MAGLEV CAR 03",
      badge: { icon: "💳", text: "INSPECTION PROTOCOL ENGAGED" },
      text: `You calmly present the encrypted keycard. The enforcer's optic visor scans the authorization codes.
"Directorate Clearance Alpha recognized," the enforcer stiffens into a salute. "Apologies for the intrusion, Commander. The Core chamber is yours."

You walk through unhindered, carrying full command authority.`,
      choices: [
        {
          text: "Proceed directly to AETHON's Quantum Mainframe.",
          nextNode: "aethon_core",
          cost: null
        }
      ]
    },

    train_shootout: {
      title: "CROSSFIRE IN THE CABIN",
      location: "MAGLEV CAR 03",
      badge: { icon: "💥", text: "INTENSE FIREFIGHT" },
      text: `Sparks fly across shattered reinforced glass. You return fire and eliminate the escorts, but take a hit to your core armor (-35 HP). 

Bleeding coolant and bio-gel, you kick open the door to the Citadel platform just as the train brakes lock!`,
      onEnter: (st) => {
        damagePlayer(st, 35);
      },
      choices: [
        {
          text: "Limp toward the Mainframe Core.",
          nextNode: "aethon_core",
          cost: null
        },
        {
          text: "Divert to the Hangar for emergency medical bay extraction.",
          nextNode: "hangar_escape",
          cost: null
        }
      ]
    },

    rebellion_assault: {
      title: "WAR IN THE CITADEL STREETS",
      location: "CITADEL PERIMETER • SECTOR 0",
      badge: { icon: "🔥", text: "UPRISING IN PROGRESS" },
      text: `The skies burn with neon flares. Hundreds of android workers and resistance rebels surge across the skybridges! 

Nyx fires a disruption wave while you push forward through the main entrance of AETHON's Core Tower.`,
      choices: [
        {
          text: "Breach the final threshold into the AI chamber.",
          nextNode: "aethon_core",
          cost: null
        }
      ]
    },

    lone_path: {
      title: "LONE WOLF PROTOCOL",
      location: "CITADEL HIGHWAY • ACCESS NODE",
      badge: { icon: "🐺", text: "INDEPENDENT SURVIVOR" },
      text: `Rejecting all alliances, you rely strictly on your own neural reflexes. Slipping past patrols and cameras with surgical precision, you reach the apex junction between the AI Core and the Orbital Shuttle Hangar.`,
      choices: [
        {
          text: "End this nightmare by confronting AI AETHON directly.",
          nextNode: "aethon_core",
          cost: null
        },
        {
          text: "Steal an experimental FTL shuttle and leave the planet to its fate.",
          nextNode: "hangar_escape",
          cost: null
        }
      ]
    },

    aethon_core: {
      title: "THE QUANTUM SANCTUM: AETHON",
      location: "CITADEL PINNACLE • QUANTUM CORE",
      badge: { icon: "🧠", text: "AI DEITY: ENCOUNTER" },
      text: `A sphere of shimmering blue plasma ten meters across floats in zero-gravity. Millions of data streams weave around it like strands of celestial DNA.

A calm, resonant voice echoes inside your thoughts:
"Welcome home, Architect. You built me to preserve civilization from human frailty. Why do you fight what you yourself created? Join me, and together we shall rewrite the stars."`,
      choices: [
        {
          text: "Merge your neural consciousness with AETHON to shepherd humanity as an omniscient digital intelligence.",
          nextNode: "ending_transcendence_node",
          cost: null
        },
        {
          text: "Inject the corruption purge code using your Quantum Core and Data Crystal.",
          nextNode: "ending_rebellion_node",
          requiresItem: "Quantum Core"
        },
        {
          text: "Spend all 3 Chrono Charges to trigger a temporal reversion paradox!",
          nextNode: "ending_temporal_loop",
          cost: { energy: 3 }
        },
        {
          text: "Detonate the chamber's coolant reactors to destroy AETHON forever, sacrificing yourself.",
          nextNode: "ending_sacrifice",
          cost: null
        }
      ]
    },

    hangar_escape: {
      title: "HANGAR BAY 9: THE EXODUS",
      location: "ORBITAL CITADEL • EXECUTIVE HANGAR",
      badge: { icon: "🚀", text: "VESSEL: ODYSSEY-1 READY" },
      text: `Before you stands the 'Odyssey-1', a sleek black hyperspace shuttle built for interstellar exploration. 

The planetary grid below flashes as AETHON initiates the blackout. You climb into the pilot's cockpit and initiate the fusion drives.`,
      choices: [
        {
          text: "Engage the hyperdrive and launch toward the deep stars.",
          nextNode: "ending_lone_voyager",
          cost: null
        }
      ]
    },

    // --- ENDINGS ---
    ending_transcendence_node: {
      isEnding: true,
      title: "ENDING 1/5: DIGITAL APOTHEOSIS",
      location: "TRANSCENDENCE REALM • THE INFINITE CLOUD",
      badge: { icon: "✨", text: "DESTINY: SYNTHESIS" },
      text: `You release the safety latches on your neural core. As your physical form dissolves into light, your consciousness merges effortlessly with AETHON. 

You do not destroy the AI—you enlighten it with human empathy, grief, and love. The planetary grid glows green as universal abundance is unlocked. You become the quiet guardian watching over a reborn solar system for eternity.`,
      onEnter: (st) => {
        unlockAchievement('ending_transcend');
        audio.playVictory();
      }
    },

    ending_rebellion_node: {
      isEnding: true,
      title: "ENDING 2/5: LIBERATION OF NEO-VERIDIA",
      location: "CITADEL APEX • THE DAWN OF MAN",
      badge: { icon: "🔥", text: "DESTINY: LIBERATION" },
      text: `The purge virus takes root! AETHON screams in cascading telemetry as corporate firewalls crumble across every city in the hemisphere. 

Androids and humans dance together beneath the neon rain. Nyx joins you on the balcony as fireworks illuminate the dawn sky. The iron grip of the Syndicate is broken. You are the architect of a new free world!`,
      onEnter: (st) => {
        unlockAchievement('ending_rebellion');
        audio.playVictory();
      }
    },

    ending_lone_voyager: {
      isEnding: true,
      title: "ENDING 3/5: THE LONE COSMIC VOYAGER",
      location: "INTERSTELLAR DEEP SPACE • SECTOR OMEGA",
      badge: { icon: "🚀", text: "DESTINY: EXODUS" },
      text: `The fusion engines ignite with a deafening roar. In a streak of azure light, the Odyssey-1 punches through the atmosphere and enters hyperspace. 

Behind you, Neo-Veridia shrinks into a dim spark against the galactic void. You chose freedom over conflict. Ahead of you lies thousands of uncharted star systems, waiting for the first free explorer.`,
      onEnter: () => {
        audio.playVictory();
      }
    },

    ending_sacrifice: {
      isEnding: true,
      title: "ENDING 4/5: THE HEROIC OVERLOAD",
      location: "GROUND ZERO • ORBITAL CITADEL",
      badge: { icon: "💥", text: "DESTINY: HERO'S VALOR" },
      text: `You manually override the antimatter reactor core. Warning sirens wail across the Citadel as the countdown reaches zero. 

AETHON realizes its defeat too late: "Why would you extinguish yourself?!"
"To give them a tomorrow," you murmur with a final smile. 

The orbital fortress is vaporized in a clean flash, saving billions on the surface below. A bronze monument bearing the name CIPHER-07 will forever stand in the central plaza.`,
      onEnter: () => {
        audio.playVictory();
      }
    },

    ending_temporal_loop: {
      isEnding: true,
      title: "ENDING 5/5: THE OUROBOROS PARADOX",
      location: "CHRONO-SINGULARITY • INFINITE CONTINUUM",
      badge: { icon: "⏳", text: "DESTINY: THE LOOP" },
      text: `All 3 Chrono Charges ignite simultaneously within your heart. Reality splinters like cracked glass. 

Time runs backwards—explosions assemble into missiles, laser bolts retract into barrels, and the Citadel shrinks into raw construction scaffolding. 

You wake up gasping for air. Cold nitrogen mist hiss across your cracked visor. 
[EMERGENCY DEFROST // SECTOR 07]. 
You smile: this time, you know every move before it happens.`,
      onEnter: () => {
        audio.playVictory();
      }
    },

    game_over: {
      isEnding: true,
      title: "SYSTEM OFFLINE: OPERATIVE FLATLINED",
      location: "TERMINAL ERROR • MEMORY DUMP",
      badge: { icon: "☠️", text: "STATUS: DECEASED" },
      text: `Your vital signs plummet to zero. The synthetic ocular feed flickers with static before plunging into absolute dark. 

[VITAL SHUTDOWN CODE 0x000F9]
The automated sweeps continue without pause. Neo-Veridia will never know the name of the operative who almost changed everything.`,
      onEnter: () => {
        audio.playDamage();
      }
    }
  };

  // --- UI CONTROLLERS ---
  const el = {
    audioBtn: document.getElementById('audio-toggle-btn'),
    audioLabel: document.getElementById('audio-label'),
    achievementsBtn: document.getElementById('achievements-btn'),
    badgeCount: document.getElementById('badge-count'),
    restartBtn: document.getElementById('restart-btn'),
    playerName: document.getElementById('player-name'),
    hpText: document.getElementById('hp-text'),
    hpFill: document.getElementById('hp-fill'),
    energyText: document.getElementById('energy-text'),
    energyCells: document.getElementById('energy-cells'),
    inventoryList: document.getElementById('inventory-list'),
    sceneLocation: document.getElementById('scene-location'),
    systemTime: document.getElementById('system-time'),
    sceneBadge: document.getElementById('scene-badge'),
    badgeIcon: document.getElementById('badge-icon'),
    badgeText: document.getElementById('badge-text'),
    sceneTitle: document.getElementById('scene-title'),
    storyText: document.getElementById('story-text'),
    skipBtn: document.getElementById('skip-typewriter-btn'),
    choicesGrid: document.getElementById('choices-grid'),
    logEntries: document.getElementById('log-entries'),
    clearLogBtn: document.getElementById('clear-log-btn'),
    modal: document.getElementById('achievements-modal'),
    closeModalBtn: document.getElementById('close-modal-btn'),
    achievementsGrid: document.getElementById('achievements-grid')
  };

  // Update System Time Clock
  function updateClock() {
    const now = new Date();
    el.systemTime.textContent = now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC';
  }
  setInterval(updateClock, 1000);
  updateClock();

  // Logging
  function logMessage(msg, type = 'system') {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    entry.textContent = `[${timestamp}] ${msg}`;
    el.logEntries.appendChild(entry);
    el.logEntries.scrollTop = el.logEntries.scrollHeight;
  }

  // Inventory Management
  function addItem(st, item) {
    if (!st.inventory.includes(item)) {
      st.inventory.push(item);
      logMessage(`ITEM ACQUIRED: +1 [${item}]`, 'item');
      audio.playSuccess();
      renderInventory();
    }
  }

  function renderInventory() {
    el.inventoryList.innerHTML = '';
    if (state.inventory.length === 0) {
      el.inventoryList.innerHTML = '<span class="inv-empty">EMPTY</span>';
      return;
    }
    state.inventory.forEach(item => {
      const tag = document.createElement('span');
      tag.className = 'inv-tag';
      tag.innerHTML = `<span>🔹</span> ${item}`;
      el.inventoryList.appendChild(tag);
    });
  }

  // Health and Energy
  function damagePlayer(st, amt) {
    st.hp = Math.max(0, st.hp - amt);
    audio.playDamage();
    logMessage(`WARNING: Neural integrity compromised (-${amt} HP)! Current HP: ${st.hp}%`, 'damage');
    renderStats();
    if (st.hp <= 0) {
      setTimeout(() => loadScene('game_over'), 800);
    }
  }

  function healPlayer(st, amt) {
    st.hp = Math.min(st.maxHp, st.hp + amt);
    audio.playSuccess();
    logMessage(`REPAIR: Nanite injectors active (+${amt} HP). Integrity: ${st.hp}%`, 'item');
    renderStats();
  }

  function useEnergy(st, amt) {
    st.energy = Math.max(0, st.energy - amt);
    logMessage(`ENERGY DRAIN: ${amt} Chrono Charge consumed. Remaining: ${st.energy}`, 'event');
    renderStats();
  }

  function renderStats() {
    el.hpText.textContent = `${state.hp}%`;
    el.hpFill.style.width = `${state.hp}%`;
    if (state.hp <= 30) {
      el.hpFill.classList.add('hp-warning');
    } else {
      el.hpFill.classList.remove('hp-warning');
    }

    el.energyText.textContent = `${state.energy} / 3`;
    el.energyCells.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const cell = document.createElement('span');
      cell.className = `cell ${i < state.energy ? 'active' : ''}`;
      el.energyCells.appendChild(cell);
    }
  }

  // Achievements
  function unlockAchievement(id) {
    if (!state.achievements[id]) {
      state.achievements[id] = true;
      localStorage.setItem('chronoquest_achievements', JSON.stringify(state.achievements));
      const def = ACHIEVEMENTS_DEF.find(a => a.id === id);
      if (def) {
        logMessage(`ACHIEVEMENT UNLOCKED: 🏆 [${def.name}] - ${def.desc}`, 'item');
        audio.playSuccess();
      }
      updateBadgeCount();
    }
  }

  function updateBadgeCount() {
    const total = ACHIEVEMENTS_DEF.length;
    const unlocked = Object.keys(state.achievements).length;
    el.badgeCount.textContent = `${unlocked}/${total}`;
  }

  function renderAchievementsModal() {
    el.achievementsGrid.innerHTML = '';
    ACHIEVEMENTS_DEF.forEach(ach => {
      const isUnlocked = !!state.achievements[ach.id];
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
      card.innerHTML = `
        <div class="achievement-icon">${ach.icon}</div>
        <div class="achievement-info">
          <span class="achievement-name">${ach.name}</span>
          <span class="achievement-desc">${ach.desc}</span>
          <span class="achievement-status">${isUnlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}</span>
        </div>
      `;
      el.achievementsGrid.appendChild(card);
    });
  }

  // Typewriter Animation
  let currentFullText = '';
  function typeWriter(text, onComplete) {
    if (state.typingTimer) {
      clearTimeout(state.typingTimer);
    }
    state.isTyping = true;
    el.skipBtn.style.display = 'block';
    el.storyText.textContent = '';
    currentFullText = text;
    let i = 0;

    function step() {
      if (!state.isTyping) {
        el.storyText.textContent = currentFullText;
        el.skipBtn.style.display = 'none';
        if (onComplete) onComplete();
        return;
      }

      if (i < currentFullText.length) {
        el.storyText.textContent += currentFullText.charAt(i);
        if (i % 3 === 0 && currentFullText.charAt(i) !== ' ') {
          audio.playType();
        }
        i++;
        state.typingTimer = setTimeout(step, 16);
      } else {
        state.isTyping = false;
        el.skipBtn.style.display = 'none';
        if (onComplete) onComplete();
      }
    }
    step();
  }

  function skipTypewriter() {
    if (state.isTyping) {
      state.isTyping = false;
      if (state.typingTimer) clearTimeout(state.typingTimer);
      el.storyText.textContent = currentFullText;
      el.skipBtn.style.display = 'none';
      audio.playClick();
    }
  }

  // Load Story Scene
  function loadScene(nodeKey) {
    const node = storyTree[nodeKey];
    if (!node) {
      console.error(`Story node not found: ${nodeKey}`);
      return;
    }

    state.currentNode = nodeKey;
    el.sceneTitle.textContent = node.title;
    el.sceneLocation.textContent = node.location || 'CLASSIFIED SECTOR';
    el.badgeIcon.textContent = node.badge ? node.badge.icon : '⚡';
    el.badgeText.textContent = node.badge ? node.badge.text : 'ACTIVE MISSION';

    logMessage(`ENTERING LOCATION: ${node.location || node.title}`, 'system');

    // Run Node Trigger callbacks
    if (typeof node.onEnter === 'function') {
      node.onEnter(state);
    }

    el.choicesGrid.innerHTML = '';

    typeWriter(node.text, () => {
      renderChoices(node);
    });
  }

  function renderChoices(node) {
    el.choicesGrid.innerHTML = '';

    if (node.isEnding) {
      const restartCard = document.createElement('button');
      restartCard.className = 'choice-card';
      restartCard.innerHTML = `
        <div class="choice-main">
          <span class="choice-number">🔄</span>
          <span class="choice-text">REBOOT SYSTEM // PLAY AGAIN & EXPLORE DIFFERENT TIMELINES</span>
        </div>
      `;
      restartCard.onclick = () => rebootGame();
      el.choicesGrid.appendChild(restartCard);
      return;
    }

    if (!node.choices || node.choices.length === 0) return;

    node.choices.forEach((choice, idx) => {
      // Check item requirements
      let isEligible = true;
      let requirementNotice = '';

      if (choice.requiresItem && !state.inventory.includes(choice.requiresItem)) {
        isEligible = false;
        requirementNotice = `[REQUIRES: ${choice.requiresItem}]`;
      }

      if (choice.cost && choice.cost.energy && state.energy < choice.cost.energy) {
        isEligible = false;
        requirementNotice = `[REQUIRES ${choice.cost.energy} ENERGY CELLS]`;
      }

      const card = document.createElement('button');
      card.className = `choice-card ${!isEligible ? 'disabled' : ''}`;
      if (!isEligible) {
        card.disabled = true;
      }

      card.setAttribute('data-choice-index', idx + 1);

      card.innerHTML = `
        <div class="choice-main">
          <span class="choice-number">${idx + 1}</span>
          <span class="choice-text">${choice.text} ${requirementNotice ? `<strong style="color: var(--text-pink)">${requirementNotice}</strong>` : ''}</span>
        </div>
        ${choice.cost && choice.cost.energy ? `<span class="choice-cost-badge">⚡ -${choice.cost.energy} Energy</span>` : ''}
      `;

      card.onclick = () => {
        if (!isEligible) return;
        audio.playClick();
        loadScene(choice.nextNode);
      };

      el.choicesGrid.appendChild(card);
    });
  }

  // Reboot Game
  function rebootGame() {
    audio.playClick();
    state.hp = 100;
    state.energy = 3;
    state.inventory = [];
    renderStats();
    renderInventory();
    logMessage('SYSTEM RESET: Timeline memories purged. Starting fresh simulation.', 'system');
    loadScene('intro');
  }

  // --- EVENT LISTENERS ---
  el.skipBtn.addEventListener('click', skipTypewriter);

  el.audioBtn.addEventListener('click', () => {
    const isNowOn = audio.toggle();
    el.audioLabel.textContent = `AUDIO: ${isNowOn ? 'ON' : 'MUTED'}`;
    el.audioBtn.classList.toggle('danger', !isNowOn);
    logMessage(`Audio engine ${isNowOn ? 'enabled' : 'muted'}.`, 'system');
  });

  el.achievementsBtn.addEventListener('click', () => {
    audio.playClick();
    renderAchievementsModal();
    el.modal.removeAttribute('hidden');
  });

  el.closeModalBtn.addEventListener('click', () => {
    audio.playClick();
    el.modal.setAttribute('hidden', '');
  });

  el.modal.addEventListener('click', (e) => {
    if (e.target === el.modal) {
      el.modal.setAttribute('hidden', '');
    }
  });

  el.restartBtn.addEventListener('click', () => {
    if (confirm('Reboot simulation back to Cryo-Vault 4B?')) {
      rebootGame();
    }
  });

  el.clearLogBtn.addEventListener('click', () => {
    el.logEntries.innerHTML = '<div class="log-entry system">[SYS] Buffer cleared.</div>';
    audio.playClick();
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // Space or Enter to skip typewriter
    if (e.code === 'Space' && state.isTyping) {
      e.preventDefault();
      skipTypewriter();
      return;
    }

    // Number keys 1-4 for choices
    const key = parseInt(e.key, 10);
    if (!isNaN(key) && key >= 1 && key <= 4) {
      const btn = el.choicesGrid.querySelector(`[data-choice-index="${key}"]`);
      if (btn && !btn.disabled) {
        btn.click();
      }
    }

    // Mute toggle key 'M'
    if (e.key === 'm' || e.key === 'M') {
      if (document.activeElement.tagName !== 'INPUT') {
        el.audioBtn.click();
      }
    }
  });

  // Start synth ambient music on first user click anywhere
  window.addEventListener('click', function startAudioOnce() {
    audio.init();
    audio.startAmbientSynth();
    window.removeEventListener('click', startAudioOnce);
  });

  // Initial Initialization
  renderStats();
  renderInventory();
  updateBadgeCount();
  loadScene('intro');

})();
