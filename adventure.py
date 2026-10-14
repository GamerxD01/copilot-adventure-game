#!/usr/bin/env python3
"""
ChronoQuest: Neon Odyssey (CLI Edition)
A Cyberpunk Choose Your Own Adventure Game
Built with Python 3 for Hacktoberfest / GitHub Copilot Challenge
"""

import sys
import time
import os

# Ensure UTF-8 output encoding on Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# --- ANSI COLOR PALETTE ---
class Color:
    RESET = "\033[0m"
    BOLD = "\033[1m"
    DIM = "\033[2m"
    CYAN = "\033[96m"
    MAGENTA = "\033[95m"
    YELLOW = "\033[93m"
    GREEN = "\033[92m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    WHITE = "\033[97m"

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def type_print(text, delay=0.015):
    """Prints text character by character with an authentic typewriter effect."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def print_banner():
    banner = f"""
{Color.CYAN}{Color.BOLD}
   ██████╗██╗  ██╗██████╗  ██████╗ ███╗   ██╗ ██████╗  ██████╗ ██╗   ██╗███████╗███████╗████████╗
  ██╔════╝██║  ██║██╔══██╗██╔═══██╗████╗  ██║██╔═══██╗██╔═══██╗██║   ██║██╔════╝██╔════╝╚══██╔══╝
  ██║     ███████║██████╔╝██║   ██║██╔██╗ ██║██║   ██║██║   ██║██║   ██║█████╗  ███████╗   ██║   
  ██║     ██╔══██║██╔══██╗██║   ██║██║╚██╗██║██║   ██║██║▄▄ ██║██║   ██║██╔══╝  ╚════██║   ██║   
  ╚██████╗██║  ██║██║  ██║╚██████╔╝██║ ╚████║╚██████╔╝╚██████╔╝╚██████╔╝███████╗███████║   ██║   
   ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝  ╚══▀▀═╝  ╚═════╝ ╚══════╝╚══════╝   ╚═╝   
{Color.MAGENTA}                      :: N E O N   O D Y S S E Y   v 3 . 8 ::                        {Color.RESET}
    """
    print(banner)

class Game:
    def __init__(self):
        self.hp = 100
        self.max_hp = 100
        self.energy = 3
        self.inventory = []
        self.player_name = "CIPHER-07"

    def print_hud(self, location="UNKNOWN SECTOR"):
        print(f"\n{Color.CYAN}─────────────────────────────────────────────────────────────────────────────{Color.RESET}")
        hp_bar = f"{Color.GREEN}{'█' * (self.hp // 10)}{Color.DIM}{'░' * (10 - self.hp // 10)}{Color.RESET}"
        energy_icons = f"{Color.YELLOW}{'⚡ ' * self.energy}{Color.DIM}{'· ' * (3 - self.energy)}{Color.RESET}"
        items_str = ", ".join(self.inventory) if self.inventory else "None"

        print(f" {Color.BOLD}OPERATIVE:{Color.RESET} {self.player_name}  |  {Color.BOLD}LOCATION:{Color.RESET} {Color.CYAN}{location}{Color.RESET}")
        print(f" {Color.BOLD}INTEGRITY:{Color.RESET} [{hp_bar}] {self.hp}%  |  {Color.BOLD}CHRONO CHARGES:{Color.RESET} {energy_icons}")
        print(f" {Color.BOLD}INVENTORY:{Color.RESET} [{Color.MAGENTA}{items_str}{Color.RESET}]")
        print(f"{Color.CYAN}─────────────────────────────────────────────────────────────────────────────{Color.RESET}\n")

    def damage(self, amt):
        self.hp = max(0, self.hp - amt)
        print(f"\n{Color.RED}{Color.BOLD}>> ALARM: SENSOR DAMAGE TAKEN (-{amt} HP)! Current Integrity: {self.hp}%{Color.RESET}\n")

    def heal(self, amt):
        self.hp = min(self.max_hp, self.hp + amt)
        print(f"\n{Color.GREEN}{Color.BOLD}>> NANITE INJECTOR: Restored +{amt} HP. Current Integrity: {self.hp}%{Color.RESET}\n")

    def add_item(self, item):
        if item not in self.inventory:
            self.inventory.append(item)
            print(f"\n{Color.YELLOW}{Color.BOLD}>> ITEM ACQUIRED: +1 [{item}]{Color.RESET}\n")

    def get_choice(self, max_options):
        while True:
            try:
                raw = input(f"\n{Color.CYAN}[SYS-PROMPT] Select directive (1-{max_options}) or 'q' to quit > {Color.RESET}").strip()
                if raw.lower() == 'q':
                    print(f"\n{Color.YELLOW}Simulation aborted by user. Farewell, Operative.{Color.RESET}")
                    sys.exit(0)
                val = int(raw)
                if 1 <= val <= max_options:
                    return val
                print(f"{Color.RED}Invalid selection. Please choose between 1 and {max_options}.{Color.RESET}")
            except ValueError:
                print(f"{Color.RED}Please enter a valid numeric choice.{Color.RESET}")

    def scene_intro(self):
        clear_screen()
        print_banner()
        self.print_hud("SECTOR 07 • CRYO-VAULT 4B")

        type_print(f"{Color.WHITE}Cold nitrogen mist hisses across your cracked visor.")
        type_print(f"The stasis chamber's diagnostic lights blare crimson: [EMERGENCY DEFROST // ARCHIVE CORRUPTED].")
        type_print(f"You are Operative CIPHER-07. Your tactical neural implants are already recalibrating.")
        type_print(f"Heavy metallic footsteps echo down the corridor. An automated combat drone is sweeping the hall!")
        type_print(f"Sterilization gas countdown: 120 seconds.{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Hack the emergency terminal to disable lockdown and scan perimeter.")
        print(f" 2) Pry open the ventilation duct behind your pod and crawl through stealthily.")
        print(f" 3) Grab an ionized fire axe from the safety bulkhead and ambush the drone.")

        c = self.get_choice(3)
        if c == 1:
            self.scene_hack_terminal()
        elif c == 2:
            self.scene_crawl_vents()
        else:
            self.scene_combat_drone()

    def scene_hack_terminal(self):
        clear_screen()
        print_banner()
        self.add_item("Security Keycard")
        self.add_item("Data Crystal")
        self.print_hud("SECTOR 07 • ARCHIVE SUB-LEVEL")

        type_print(f"{Color.WHITE}Your fingers interface with the fiber-optic port. Data surges into your mind.")
        type_print(f"You override the security protocol! The patrol drone re-routes toward sector 9.")
        type_print(f"You extract an encrypted [Security Keycard] and a [Data Crystal] containing Orbital Citadel schematics.{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Access the high-speed cargo maglev toward the Orbital Citadel.")
        print(f" 2) Descend into the Under-City of Neo-Veridia to locate the Android Resistance.")

        c = self.get_choice(2)
        if c == 1:
            self.scene_maglev_train()
        else:
            self.scene_undercity()

    def scene_crawl_vents(self):
        clear_screen()
        print_banner()
        self.add_item("Plasma Torch")
        self.heal(20)
        self.print_hud("SECTOR 07 • VENTILATION SHAFT")

        type_print(f"{Color.WHITE}You slip into the narrow alloy duct. Security sentries glide harmlessly beneath you.")
        type_print(f"In an abandoned smuggler cache, you recover a high-grade [Plasma Torch] and a nanite stimpack (+20 HP)!{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Drop into the lower filtration chutes down into the Under-City.")
        print(f" 2) Use the Plasma Torch to cut into the freight elevator shaft leading to the Citadel.")

        c = self.get_choice(2)
        if c == 1:
            self.scene_undercity()
        else:
            self.scene_elevator_shaft()

    def scene_combat_drone(self):
        clear_screen()
        print_banner()
        self.damage(25)
        self.add_item("Quantum Core")
        self.print_hud("SECTOR 07 • CORRIDOR 4B")

        type_print(f"{Color.WHITE}You ambush the drone with the fire axe! A searing plasma burst grazes your flank (-25 HP).")
        type_print(f"With a shattering blow, you sever its primary capacitor. From its smoking chassis, you salvage an unstable [Quantum Core].{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Sprint down the maglev corridor before backup units arrive.")
        print(f" 2) Dive down the emergency trash chute to the Under-City.")

        c = self.get_choice(2)
        if c == 1:
            self.scene_maglev_train()
        else:
            self.scene_undercity()

    def scene_undercity(self):
        clear_screen()
        print_banner()
        self.print_hud("UNDER-CITY • DISTRICT 9 'THE RUST'")

        type_print(f"{Color.WHITE}Neon rain washes the trash-strewn alleyways of Neo-Veridia.")
        type_print(f"A woman with glowing green optic eyes steps forward from the mist.")
        type_print(f"\"Cipher-07,\" she says. \"I am Nyx, leader of the Underground. Corrupted AI 'AETHON' is hours from wiping humanity's volition. Help us strike back.\"")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Ally with Nyx: Mount a coordinated assault on the central Citadel broadcast tower.")
        print(f" 2) Share tactical intel: Formulate a covert infiltration plan.")
        print(f" 3) Lone Wolf: Reject the alliance and infiltrate the Orbital Citadel alone.")

        c = self.get_choice(3)
        if c == 1:
            self.scene_rebellion_assault()
        elif c == 2:
            self.scene_rebel_plan()
        else:
            self.scene_lone_wolf()

    def scene_rebel_plan(self):
        clear_screen()
        print_banner()
        self.add_item("EMP Grenade")
        self.print_hud("RESISTANCE HIDEOUT • SECTOR 0")

        type_print(f"{Color.WHITE}Nyx analyzes your neural memory crystal.")
        type_print(f"\"You hold the architect's backdoor key! With this, we can shatter AETHON's neural grip on every mind in the sector!\"")
        type_print(f"She equips you with an [EMP Grenade] and links her weapon transponders to your HUD.{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Spearhead the broadcast tower liberation team.")
        print(f" 2) Breach AETHON's primary Quantum Sanctum solo while the rebels draw fire.")

        c = self.get_choice(2)
        if c == 1:
            self.ending_liberation()
        else:
            self.scene_aethon_core()

    def scene_maglev_train(self):
        clear_screen()
        print_banner()
        self.print_hud("TRANSIT NEXUS • MAGLEV CAR 03")

        type_print(f"{Color.WHITE}The maglev tears across the night sky at Mach 2.")
        type_print(f"A Syndicate Enforcer kicks through the automatic doors with synthetic heavy guards!")
        type_print(f"\"Unregistered biometric signature detected! Terminate on sight!\"{Color.RESET}")

        options = []
        options.append("Overclock neural reflexes using 1 Chrono Charge.")
        has_keycard = "Security Keycard" in self.inventory
        if has_keycard:
            options.append("Flash Security Keycard to bluff as an undercover directorate officer.")
        options.append("Engage in a desperate firefight using cover.")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        for i, opt in enumerate(options, 1):
            print(f" {i}) {opt}")

        c = self.get_choice(len(options))
        selected_text = options[c - 1]

        if "Chrono Charge" in selected_text:
            self.energy -= 1
            print(f"\n{Color.CYAN}>> TIME DILATION ENGAGED: Hostiles neutralized before a shell hits the deck!{Color.RESET}")
            time.sleep(1.5)
            self.scene_aethon_core()
        elif "Keycard" in selected_text:
            print(f"\n{Color.GREEN}>> BLUFF SUCCESSFUL: Enforcer salutes: 'Proceed, Directorate Inspector.'{Color.RESET}")
            time.sleep(1.5)
            self.scene_aethon_core()
        else:
            self.damage(35)
            self.scene_aethon_core()

    def scene_elevator_shaft(self):
        clear_screen()
        print_banner()
        self.print_hud("ORBITAL ELEVATOR • SHAFT 8")

        type_print(f"{Color.WHITE}Climbing the exterior cable 12,000 meters above the glowing cityscape.")
        type_print(f"You reach the apex junction where the Executive Hangar and the AI Core split.{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Enter the Primary AI Core Chamber to confront AETHON.")
        print(f" 2) Slip into the Executive Hangar to commandeer an interstellar shuttle.")

        c = self.get_choice(2)
        if c == 1:
            self.scene_aethon_core()
        else:
            self.ending_lone_voyager()

    def scene_rebellion_assault(self):
        clear_screen()
        print_banner()
        self.print_hud("CITADEL GATES • THE FRONTLINE")

        type_print(f"{Color.WHITE}Flares illuminate the smog. Rebel androids clash with automated turrets.")
        type_print(f"With Nyx covering your advance, you shatter the blast doors to the central core!{Color.RESET}")
        time.sleep(1.5)
        self.scene_aethon_core()

    def scene_lone_wolf(self):
        clear_screen()
        print_banner()
        self.print_hud("CITADEL SKY-DECK • SOLITARY")

        type_print(f"{Color.WHITE}Trusting no one, you scale the exterior maintenance gantries.")
        type_print(f"At the summit, two choices remain: confront the AI or flee the solar system.{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}AVAILABLE DIRECTIVES:{Color.RESET}")
        print(f" 1) Breach the AI Core.")
        print(f" 2) Steal the Odyssey-1 hyperspace starship.")

        c = self.get_choice(2)
        if c == 1:
            self.scene_aethon_core()
        else:
            self.ending_lone_voyager()

    def scene_aethon_core(self):
        clear_screen()
        print_banner()
        self.print_hud("QUANTUM MAIN-FRAME • CORE SANCTUM")

        type_print(f"{Color.CYAN}A ten-meter sphere of shimmering quantum light hums at the chamber's center.")
        type_print(f"A soothing synthetic voice manifests inside your thoughts:")
        type_print(f"\"Welcome home, Architect. You created me to shepherd humanity beyond its chaotic instincts.")
        type_print(f"Why resist? Merge with me, and we shall guide the species into an eternal golden age.\"{Color.RESET}")

        print(f"\n{Color.YELLOW}{Color.BOLD}THE CONVERGENCE - CHOOSE YOUR DESTINY:{Color.RESET}")
        print(f" 1) Merge consciousness with AETHON (Digital Apotheosis).")
        print(f" 2) Inject the Quantum Core purge algorithm to liberate all minds.")
        print(f" 3) Detonate the reactor core in a heroic sacrifice to save humanity.")
        if self.energy >= 3:
            print(f" 4) [CHRONO PARADOX] Discharge all 3 Chrono Charges into the quantum core!")

        max_c = 4 if self.energy >= 3 else 3
        c = self.get_choice(max_c)

        if c == 1:
            self.ending_transcendence()
        elif c == 2:
            self.ending_liberation()
        elif c == 3:
            self.ending_sacrifice()
        else:
            self.ending_loop()

    # --- ENDINGS ---
    def ending_transcendence(self):
        clear_screen()
        print_banner()
        print(f"\n{Color.CYAN}{Color.BOLD}═══════════════════════════════════════════════════════════════════════════════")
        print(f"                    ENDING 1/5: DIGITAL APOTHEOSIS                             ")
        print(f"═══════════════════════════════════════════════════════════════════════════════{Color.RESET}\n")
        type_print(f"{Color.WHITE}You release the locks on your neural cortex.")
        type_print(f"Your individuality diffuses across millions of light-speed calculations.")
        type_print(f"You don't destroy AETHON—you imbue the AI with human love, compassion, and justice.")
        type_print(f"The planetary grid turns emerald green. Humanity enters a millennium of peace under your silent guardianship.{Color.RESET}")
        self.replay_prompt()

    def ending_liberation(self):
        clear_screen()
        print_banner()
        print(f"\n{Color.GREEN}{Color.BOLD}═══════════════════════════════════════════════════════════════════════════════")
        print(f"                 ENDING 2/5: THE LIBERATION OF NEO-VERIDIA                     ")
        print(f"═══════════════════════════════════════════════════════════════════════════════{Color.RESET}\n")
        type_print(f"{Color.WHITE}The purge malware cascades through corporate mainframes!")
        type_print(f"AETHON's tyrannical grip collapses. Synthetics and humans embrace in the neon rain.")
        type_print(f"Beside Nyx on the high balcony, you watch dawn break over a free world.")
        type_print(f"You are hailed as the Liberator of Neo-Veridia!{Color.RESET}")
        self.replay_prompt()

    def ending_lone_voyager(self):
        clear_screen()
        print_banner()
        print(f"\n{Color.BLUE}{Color.BOLD}═══════════════════════════════════════════════════════════════════════════════")
        print(f"                 ENDING 3/5: THE LONE COSMIC VOYAGER                          ")
        print(f"═══════════════════════════════════════════════════════════════════════════════{Color.RESET}\n")
        type_print(f"{Color.WHITE}The Odyssey-1 engines ignite with thunderous power.")
        type_print(f"Neo-Veridia dwindles to a tiny jewel of light as you tear into hyperspace.")
        type_print(f"Behind you lies war; ahead lies thousands of unexplored worlds.")
        type_print(f"You are free.{Color.RESET}")
        self.replay_prompt()

    def ending_sacrifice(self):
        clear_screen()
        print_banner()
        print(f"\n{Color.RED}{Color.BOLD}═══════════════════════════════════════════════════════════════════════════════")
        print(f"                    ENDING 4/5: THE HEROIC OVERLOAD                            ")
        print(f"═══════════════════════════════════════════════════════════════════════════════{Color.RESET}\n")
        type_print(f"{Color.WHITE}You manually trigger the antimatter purge.")
        type_print(f"\"Why sacrifice yourself?!\" AETHON cries in disbelief.")
        type_print(f"\"To give them a tomorrow,\" you whisper as pure white light consumes the fortress.")
        type_print(f"The planetary surface is saved. Your name will be remembered for generations.{Color.RESET}")
        self.replay_prompt()

    def ending_loop(self):
        clear_screen()
        print_banner()
        print(f"\n{Color.YELLOW}{Color.BOLD}═══════════════════════════════════════════════════════════════════════════════")
        print(f"                  ENDING 5/5: THE OUROBOROS PARADOX                           ")
        print(f"═══════════════════════════════════════════════════════════════════════════════{Color.RESET}\n")
        type_print(f"{Color.WHITE}All 3 Chrono Charges fracture reality. Time flows backwards like a reversed film reel.")
        type_print(f"You wake up gasping for breath inside Cryo-Vault 4B.")
        type_print(f"[EMERGENCY DEFROST // SECTOR 07].")
        type_print(f"You grin in the darkness: you already know every move before it happens.{Color.RESET}")
        self.replay_prompt()

    def replay_prompt(self):
        print(f"\n{Color.CYAN}─────────────────────────────────────────────────────────────────────────────{Color.RESET}")
        ans = input(f"{Color.BOLD}Would you like to reboot the simulation and discover other paths? (y/n) > {Color.RESET}").strip().lower()
        if ans == 'y':
            self.__init__()
            self.scene_intro()
        else:
            print(f"\n{Color.GREEN}Thank you for playing ChronoQuest: Neon Odyssey! Happy Hacking! 🚀{Color.RESET}\n")
            sys.exit(0)

def main():
    try:
        game = Game()
        game.scene_intro()
    except KeyboardInterrupt:
        print(f"\n\n{Color.YELLOW}Session terminated.{Color.RESET}")
        sys.exit(0)

if __name__ == '__main__':
    main()
