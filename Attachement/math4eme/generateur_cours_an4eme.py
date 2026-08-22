#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur du PDF : COURS — ACTIVITÉS NUMÉRIQUES — CLASSE DE 4ÈME
Sortie vectorielle (type SVG) : formules, figures, diagrammes.
Pages : 1 couverture · 2 programme · 3-10 chapitres 1 à 8.
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.patches import (FancyBboxPatch, Rectangle, Circle, Wedge,
                                Polygon, FancyArrowPatch, Arc)
from matplotlib.colors import to_rgb

MM = 1 / 25.4
W, H = 210, 297  # A4 en mm

# ---------------------------------------------------------------- palette
INK    = "#1E293B"
GREY   = "#64748B"
NAVY   = "#0E2A5A"
NAVY2  = "#123C82"
GOLD   = "#F2B705"
PAPER  = "#FFFFFF"
ACCENTS = ["#2563EB", "#0D9488", "#16A34A", "#B8860B",
           "#EA580C", "#DC2626", "#7C3AED", "#DB2777"]

plt.rcParams.update({
    "mathtext.fontset": "cm",
    "font.family": "DejaVu Sans",
    "pdf.fonttype": 42,
})

def tint(c, f):
    """f=0 -> couleur, f=1 -> blanc."""
    r, g, b = to_rgb(c)
    return (r + (1 - r) * f, g + (1 - g) * f, b + (1 - b) * f)

# ---------------------------------------------------------------- base
def new_page():
    fig = plt.figure(figsize=(W * MM, H * MM))
    ax = fig.add_axes([0, 0, 1, 1])
    ax.set_xlim(0, W); ax.set_ylim(0, H)
    ax.set_aspect("equal"); ax.axis("off")
    return fig, ax

def rbox(ax, x, y, w, h, fc, ec="none", lw=1.0, r=2.5, alpha=1.0, z=2):
    ax.add_patch(FancyBboxPatch((x + r, y + r), w - 2 * r, h - 2 * r,
                 boxstyle=f"round,pad={r},rounding_size={r}",
                 facecolor=fc, edgecolor=ec, linewidth=lw,
                 alpha=alpha, zorder=z))

def txt(ax, x, y, s, fs=11, color=INK, ha="left", va="center",
        weight="normal", style="normal", alpha=1.0, z=6, rot=0):
    ax.text(x, y, s, fontsize=fs, color=color, ha=ha, va=va, zorder=z,
            fontweight=weight, fontstyle=style, alpha=alpha, rotation=rot)

def est_w(s, fs, bold=False):
    """largeur approximative d'un texte en mm"""
    k = 0.64 if not bold else 0.70
    return len(s) * fs * k * 0.3528

def chip(ax, x, y, label, fc, tc="white", fs=9, pad=3.2, r=1.8, z=5, spaced=False):
    s = label if not spaced else "\u2009".join(list(label))
    w = est_w(s, fs, bold=True) + 2 * pad
    h = fs * 0.3528 + 3.0
    rbox(ax, x, y, w, h, fc, fc, r=r, z=z)
    txt(ax, x + w / 2, y + h / 2, s, fs=fs, color=tc,
        ha="center", weight="bold", z=z + 1)
    return w, h

def footer(ax, n, total=10, chap=None):
    ax.plot([14, 196], [12.5, 12.5], color=GREY, lw=0.5, alpha=0.45, zorder=3)
    g = "ACTIVITÉS NUMÉRIQUES — CLASSE DE 4ÈME"
    if chap:
        g = f"CHAPITRE {chap} · " + g
    txt(ax, 14, 8.6, g, fs=7, color=GREY)
    txt(ax, 196, 8.6, f"Page {n} / {total}", fs=7, color=GREY, ha="right")

# ---------------------------------------------------------------- page 1 : couverture
def page_cover(pdf):
    fig, ax = new_page()

    # fond dégradé bleu nuit
    from matplotlib.colors import LinearSegmentedColormap
    grad = LinearSegmentedColormap.from_list("n", ["#061635", "#0B2B5E", "#0E3A7B"])
    arr = np.linspace(0, 1, 400).reshape(400, 1)
    ax.imshow(arr, extent=(0, W, 0, H), aspect="auto", origin="lower",
              cmap=grad, zorder=0)

    # papier millimétré discret
    for gx in range(0, W + 1, 10):
        ax.plot([gx, gx], [0, H], color="white", lw=0.4, alpha=0.045, zorder=1)
    for gy in range(0, H + 1, 10):
        ax.plot([0, W], [gy, gy], color="white", lw=0.4, alpha=0.045, zorder=1)

    # halo doré derrière l'emblème
    for r_, a_ in [(34, 0.05), (29, 0.07), (25, 0.10)]:
        ax.add_patch(Circle((105, 196), r_, facecolor=GOLD, alpha=a_, zorder=1.5,
                            edgecolor="none"))

    # symboles flottants
    sym = [(28, 240, r"$\pi$", 22), (176, 244, r"$\sum$", 24),
           (27, 178, r"$x^2$", 18), (182, 172, r"$\sqrt{2}$", 18),
           (28, 74, r"$\infty$", 18), (180, 76, r"$\div$", 18),
           (56, 216, r"$\frac{a}{b}$", 18), (154, 218, r"$x_1$", 16),
           (60, 176, r"$10^{n}$", 15), (150, 178, r"$\frac{3}{4}$", 15)]
    for sx, sy, s, fs in sym:
        txt(ax, sx, sy, s, fs=fs, color="white", ha="center", alpha=0.16, z=2)

    # équerre (bas-droite)
    ax.add_patch(Polygon([(138, 20), (192, 20), (192, 47)], closed=True,
                         facecolor="white", alpha=0.10, edgecolor=GOLD, lw=1.2, zorder=2))
    ax.add_patch(Polygon([(147, 24.5), (147, 35), (157.5, 24.5)], closed=True,
                         facecolor="#061635", alpha=0.5, edgecolor="none", zorder=2.1))
    txt(ax, 172, 24, "90°", fs=7, color="white", alpha=0.75, ha="center", z=3)

    # règle (bas-gauche)
    rbox(ax, 18, 20, 62, 9, "white", GOLD, lw=1.2, r=1.5, alpha=0.10, z=2)
    for i, rx in enumerate(range(22, 80, 2)):
        hh = 2.6 if i % 5 == 0 else 1.4
        ax.plot([rx, rx], [20.5, 20.5 + hh], color=GOLD, lw=0.7, alpha=0.8, zorder=2.5)

    # rapporteur (haut-droite)
    ax.add_patch(Wedge((172, 268), 17, 0, 180, width=0.01, facecolor="white",
                       alpha=0.08, edgecolor=GOLD, lw=1.1, zorder=2))
    for adeg in range(0, 181, 15):
        th = np.deg2rad(adeg)
        ax.plot([172 + 14.2 * np.cos(th), 172 + 16.6 * np.cos(th)],
                [268 + 14.2 * np.sin(th), 268 + 16.6 * np.sin(th)],
                color=GOLD, lw=0.6, alpha=0.55, zorder=2.5)

    # coins dorés
    for cx_, cy_ in [(8, 289), (202, 289), (8, 8), (202, 8)]:
        ax.add_patch(Rectangle((cx_ - 1.5, cy_ - 1.5), 3, 3, angle=45,
                               facecolor=GOLD, alpha=0.9, edgecolor="none", zorder=3))

    # emblème central
    ax.add_patch(Circle((105, 196), 22, facecolor="#0A2148", edgecolor=GOLD,
                        lw=2.4, zorder=4))
    ax.add_patch(Circle((105, 196), 18.4, facecolor="none", edgecolor=GOLD,
                        lw=0.7, alpha=0.6, zorder=4.2))
    txt(ax, 105, 200, "4", fs=25, color=GOLD, ha="center", weight="bold", z=5)
    txt(ax, 105, 189.5, "ÈME", fs=8.5, color="white", ha="center", z=5)
    txt(ax, 105, 183.5, "• • •", fs=7, color=GOLD, ha="center", z=5)

    # bandeau titre
    txt(ax, 105, 253, "M A T H É M A T I Q U E S   —   C O L L È G E",
        fs=9.5, color=GOLD, ha="center", alpha=0.95)

    pw = est_w("C\u2009O\u2009U\u2009R\u2009S", 11, bold=True) + 12
    rbox(ax, 105 - pw / 2, 143, pw, 10.5, GOLD, GOLD, r=2.2, z=4)
    txt(ax, 105, 148.3, "C\u2009O\u2009U\u2009R\u2009S", fs=11, color="#0A2148",
        ha="center", weight="bold", z=5)

    txt(ax, 105, 126, "ACTIVITÉS", fs=33, color="white", ha="center",
        weight="bold", z=5)
    txt(ax, 105, 106, "NUMÉRIQUES", fs=33, color=GOLD, ha="center",
        weight="bold", z=5)

    ax.plot([78, 132], [95.5, 95.5], color=GOLD, lw=1.1, alpha=0.85, zorder=4)
    ax.add_patch(Rectangle((103.9, 94.2), 2.2, 2.2, angle=45, facecolor=GOLD,
                           edgecolor="none", zorder=5))

    bw = est_w("CLASSE DE 4ÈME", 12.5, bold=True) + 18
    rbox(ax, 105 - bw / 2, 78, bw, 11.5, "white", "white", r=2.4, alpha=0.10, z=4)
    rbox(ax, 105 - bw / 2, 78, bw, 11.5, "none", GOLD, lw=1.0, r=2.4, z=4.1)
    txt(ax, 105, 83.8, "C L A S S E   D E   4 È M E", fs=12.5, color="white",
        ha="center", weight="bold", z=5)

    txt(ax, 105, 52, "Relatifs · Fractions · Puissances · Calcul littéral · Équations",
        fs=9, color="white", ha="center", alpha=0.8)
    txt(ax, 105, 45, "Ordre · Proportionnalité · Statistiques",
        fs=9, color="white", ha="center", alpha=0.8)

    txt(ax, 105, 33, "ANNÉE SCOLAIRE 2025 – 2026", fs=10.5, color=GOLD,
        ha="center", weight="bold")
    txt(ax, 105, 26, "Programme conforme à la répartition annuelle — Mathématiques 4ème",
        fs=7.5, color="white", alpha=0.6, ha="center")

    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- page 2 : programme
def page_programme(pdf):
    fig, ax = new_page()

    # bandeau
    rbox(ax, 14, 262, 182, 22, NAVY, NAVY, r=3)
    ax.add_patch(Rectangle((14, 262), 182, 1.6, facecolor=GOLD, edgecolor="none", zorder=3))
    txt(ax, 24, 276.5, "PROGRAMME", fs=16, color="white", weight="bold", z=5)
    txt(ax, 24, 266.8, "Mathématiques — Classe de 4ème · Répartition annuelle",
        fs=8.5, color=tint(GOLD, 0.1), z=5)
    txt(ax, 196, 273, "8", fs=22, color=GOLD, ha="right", weight="bold", z=5)
    txt(ax, 196, 265.6, "CHAPITRES", fs=6.5, color="white", ha="right", z=5)

    rows = [
        (1, "Nombres relatifs en écriture décimale",
         "Somme, différence, produit, quotient · règle des signes"),
        (2, "Nombres relatifs en écriture fractionnaire",
         "Inverse d'un nombre · produit et quotient de fractions"),
        (3, "Puissances — puissances de 10",
         r"$a^n$ et ses formules · $10^n$ · écriture scientifique"),
        (4, "Calcul littéral",
         "Réduire · développer $k(a+b)$, $(a+b)(c+d)$ · factoriser"),
        (5, "Équations du premier degré",
         "Règles de l'égalité · résoudre · équation produit"),
        (6, "Ordre et opérations",
         "Comparaison · encadrement · inégalité et multiplication"),
        (7, "Proportionnalité — pourcentages",
         r"Quatrième proportionnelle · échelle · vitesse $v=\frac{d}{t}$"),
        (8, "Statistiques",
         "Effectifs, fréquences · moyenne pondérée · diagrammes"),
    ]

    x_no, x_ch = 23.5, 33
    y = 252
    rh = 14.6
    # entête
    rbox(ax, 14, y, 182, 8.2, tint(NAVY, 0.88), NAVY, lw=0.7, r=1.5)
    txt(ax, x_no, y + 4.1, "N°", fs=8, color="white", ha="center", weight="bold", z=5)
    txt(ax, x_ch, y + 4.1, "CHAPITRE  —  NOTIONS ESSENTIELLES", fs=8, color="white",
        weight="bold", z=5)
    txt(ax, 196, y + 4.1, "VOLET ACTIVITÉS NUMÉRIQUES", fs=6.6, color=tint(GOLD, 0.15),
        ha="right", weight="bold", z=5)
    y -= 0.4

    for i, (no, chap, notions) in enumerate(rows):
        acc = ACCENTS[i]
        if i % 2 == 0:
            rbox(ax, 14, y - rh + 0.6, 182, rh - 0.6, tint(NAVY, 0.955), "none", r=1.2)
        # pastille numéro
        rbox(ax, x_no - 4.4, y - rh + 3.4, 8.8, 8.8, acc, acc, r=2.0)
        txt(ax, x_no, y - rh + 7.8, str(no), fs=10, color="white", ha="center",
            weight="bold", z=6)
        txt(ax, x_ch, y - rh + 10.2, chap, fs=9.8, color=NAVY, weight="bold", z=6)
        txt(ax, x_ch + 2, y - rh + 3.6, notions, fs=8.6, color=GREY, z=6)
        y -= rh

    # autre volet
    y -= 4
    rbox(ax, 14, y - 31, 182, 31, tint("#EA580C", 0.93), "#EA580C", lw=1.0, r=2.5)
    txt(ax, 22, y - 6.5, "AUTRE VOLET DU PROGRAMME — ACTIVITÉS GÉOMÉTRIQUES",
        fs=8.5, color="#9A3412", weight="bold", z=6)
    txt(ax, 22, y - 13.5, "Droites remarquables du triangle · Triangle rectangle et cercle · "
        "Théorème des milieux · Théorème de Pythagore", fs=8.3, color=INK, z=6, style="italic")
    txt(ax, 22, y - 19.5, "Cosinus d'un angle aigu · Translation · Sphère et boule · "
        "Volumes (pyramide, cylindre)", fs=8.3, color=INK, z=6, style="italic")
    txt(ax, 22, y - 26.5,
        "Ce fascicule couvre le volet ACTIVITÉS NUMÉRIQUES (chapitres 1 à 8).",
        fs=8.3, color=GREY, z=6, style="italic")

    # méthode
    y -= 39
    rbox(ax, 14, y - 20, 182, 20, tint(GOLD, 0.87), GOLD, lw=1.0, r=2.5)
    txt(ax, 22, y - 6, "MÉTHODE DE CHAQUE CHAPITRE", fs=8.5, color="#8a6d00",
        weight="bold", z=6)
    txt(ax, 22, y - 13.5,
        "① Courtes définitions   →   ② Propriétés et formules à retenir   →   ③ Un exemple type résolu",
        fs=8.8, color=INK, z=6)

    footer(ax, 2)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- éléments de chapitre
def chap_header(ax, no, title, accent):
    y0 = 262
    rbox(ax, 14, y0, 182, 22, tint(accent, 0.90), accent, lw=1.3, r=3)
    rbox(ax, 18.5, y0 + 4.5, 13, 13, accent, accent, r=2.6)
    txt(ax, 25, y0 + 11, str(no), fs=13.5, color="white", ha="center",
        weight="bold", z=6)
    txt(ax, 36, y0 + 16.6, f"C H A P I T R E   {no}", fs=8, color=tint(accent, 0.25),
        weight="bold", z=6)
    txt(ax, 36, y0 + 7.6, title, fs=13.6, color=NAVY, weight="bold", z=6)
    ax.add_patch(Rectangle((14, y0), 182, 1.5, facecolor=accent, edgecolor="none", zorder=3))

def section_label(ax, x, y, label, accent):
    _, h = chip(ax, x, y, label, accent, fs=8.6, pad=3.0)
    return y - h  # y du dessous du chip

def defs_box(ax, x, w, y_top, lines, accent, fs=10.6):
    """lines : liste de strings (texte/math). Rend une carte définition."""
    lh = 8.6
    h = 5 + len(lines) * lh
    rbox(ax, x, y_top - h, w, h, tint(accent, 0.945), tint(accent, 0.55), lw=0.9, r=2.4)
    yy = y_top - 2.5 - lh / 2
    for s in lines:
        txt(ax, x + 5, yy, s, fs=fs, color=INK)
        yy -= lh
    return y_top - h

def prop_rows(ax, x, y_top, items, accent):
    """items : (formule, note ou '') ; rend formule + note éventuelle en dessous."""
    yy = y_top - 1.2
    for formula, note in items:
        tall = ("dfrac" in formula) or ("frac" in formula)
        step = 11.0 if tall else 8.2
        ax.add_patch(Circle((x + 2.6, yy), 0.95, facecolor=accent, edgecolor="none", zorder=5))
        txt(ax, x + 6, yy, formula, fs=11.8, color=NAVY, z=6)
        yy -= step
        if note:
            txt(ax, x + 6, yy + 1.0, note, fs=8.4, color=GREY, style="italic", z=6)
            yy -= 6.6 if tall else 5.2
    return yy

def example_box(ax, x, w, y_top, lines, accent, fs=11.6):
    lh = 9.0
    h = 5.5 + len(lines) * lh
    rbox(ax, x, y_top - h, w, h, "#F8FAFC", tint(accent, 0.4), lw=0.9, r=2.4)
    ax.add_patch(Rectangle((x + 1.2, y_top - h + 1.2), 1.6, h - 2.4,
                 facecolor=accent, edgecolor="none", zorder=5))
    yy = y_top - 4.3 - lh / 2 + 0.6
    for s in lines:
        txt(ax, x + 7.5, yy, s, fs=fs, color=INK)
        yy -= lh
    return y_top - h

def caption(ax, cx, y, s, fs=8.6):
    txt(ax, cx, y, s, fs=fs, color=GREY, ha="center", style="italic")

def numline(ax, x0, u, vmin, vmax, y, ticks=None, fs=8):
    ax.plot([x0 + vmin * u, x0 + vmax * u], [y, y], color=INK, lw=1.1, zorder=5)
    # flèche
    ax.add_patch(FancyArrowPatch((x0 + vmax * u - 0.01, y), (x0 + vmax * u + 4, y),
                 arrowstyle="-|>", mutation_scale=8, color=INK, lw=1.1, zorder=5))
    for v in (ticks if ticks is not None else range(vmin, vmax + 1)):
        xx = x0 + v * u
        ax.plot([xx, xx], [y - 1.4, y + 1.4], color=INK, lw=1.0, zorder=5)
        txt(ax, xx, y - 4.2, (f"$ {v} $" if v >= 0 else f"$ {v} $"), fs=fs,
            color=INK, ha="center", z=6)

# ---------------------------------------------------------------- CH 1
def page_ch1(pdf):
    fig, ax = new_page()
    a = ACCENTS[0]
    chap_header(ax, 1, "NOMBRES RELATIFS EN ÉCRITURE DÉCIMALE", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        "Un nombre relatif = un signe ( + ou − ) et une distance à zéro (partie numérique).",
        "Exemples : $+3{,}5$ ; $-7$ ; $-4{,}8$.   Opposé de $a$ : $-a$.",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS — RÈGLES", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$(-a)+(-b)=-(a+b)$   ;   $(+a)+(+b)=+(a+b)$",
         "Même signe : on ajoute les distances à zéro, on garde le signe."),
        (r"$(+a)+(-b)$ : signes contraires → on soustrait les distances à zéro",
         "et on garde le signe de la plus grande distance à zéro."),
        (r"$a-b=a+(-b)$",
         "Soustraire un nombre = ajouter son opposé."),
        (r"$(+)\times(+)=+\quad;\quad (-)\times(-)=+\quad;\quad (+)\times(-)=-$",
         "Règle des signes (valable aussi pour le quotient ÷)."),
        (r"$(-a)^n$ : signe $+$ si $n$ est pair, signe $-$ si $n$ est impair",
         "Produit de plusieurs facteurs : on compte les facteurs négatifs."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"$A=(-7)+(+3)=-4$",
        r"$B=(-2)-(-8)=(-2)+(+8)=+6$",
        r"$C=(-3)\times(-5)=+15$",
        r"$D=24\div(-6)=-4$",
        r"$E=(-2)^3=(-2)\times(-2)\times(-2)=-8$",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE", a)
    yn = y - 16
    x0 = 32 + 8 * 10.4          # position du zéro
    numline(ax, x0, 10.4, -8, 3, yn, ticks=[-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3])
    ax.add_patch(FancyArrowPatch((x0 - 7 * 10.4, yn + 4.5), (x0 - 4 * 10.4, yn + 4.5),
                 arrowstyle="-|>", mutation_scale=11, color=a, lw=1.8,
                 connectionstyle="arc3,rad=-0.22", zorder=6))
    txt(ax, x0 - 5.5 * 10.4, yn + 12.5, "$+3$", fs=10, color=a, ha="center", weight="bold")
    caption(ax, 105, yn - 10, "Sur la droite graduée : partir de $-7$ puis avancer de $3$ → on arrive à $-4$.")

    footer(ax, 3, chap=1)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- CH 2
def page_ch2(pdf):
    fig, ax = new_page()
    a = ACCENTS[1]
    chap_header(ax, 2, "NOMBRES RELATIFS EN ÉCRITURE FRACTIONNAIRE", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        r"Inverse de $\frac{a}{b}$ :  $\frac{b}{a}$   (avec $a\neq 0$ et $b\neq 0$).",
        r"Deux nombres sont inverses si leur produit est égal à $1$.",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS — FORMULES", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$\dfrac{a}{b}\times\dfrac{c}{d}=\dfrac{a\times c}{b\times d}$",
         "Produit : numérateurs entre eux, dénominateurs entre eux."),
        (r"$\dfrac{a}{b}\div\dfrac{c}{d}=\dfrac{a}{b}\times\dfrac{d}{c}$",
         "Diviser = multiplier par l'inverse ($c\neq 0$)."),
        (r"$\dfrac{ka}{kb}=\dfrac{a}{b}$",
         "Simplification : numérateur et dénominateur par un même nombre $k\neq 0$."),
        ("La règle des signes s'applique aux fractions.",
         "Signe du produit/quotient : comme au chapitre 1."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"$A=\left(-\dfrac{3}{4}\right)\times\dfrac{8}{9}=\dfrac{-3\times 8}{4\times 9}=-\dfrac{24}{36}=-\dfrac{2}{3}$",
        r"$B=\left(-\dfrac{5}{7}\right)\div\dfrac{10}{21}=\left(-\dfrac{5}{7}\right)\times\dfrac{21}{10}=-\dfrac{105}{70}=-\dfrac{3}{2}$",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE", a)
    yn = y - 16
    u = 27
    x0 = 47
    ax.plot([x0 - 1.2 * u, x0 + 3.9 * u], [yn, yn], color=INK, lw=1.1, zorder=5)
    ax.add_patch(FancyArrowPatch((x0 + 3.9 * u, yn), (x0 + 3.9 * u + 4, yn),
                 arrowstyle="-|>", mutation_scale=8, color=INK, lw=1.1, zorder=5))
    for v, lab in [(0, "$0$"), (1/3, r"$\frac{1}{3}$"), (1, "$1$"), (3, "$3$")]:
        xx = x0 + v * u
        ax.plot([xx, xx], [yn - 1.4, yn + 1.4], color=INK, lw=1.1, zorder=5)
        txt(ax, xx, yn - 5.0, lab, fs=9, color=INK, ha="center", z=6)
    ax.add_patch(FancyArrowPatch((x0 + 3 * u, yn + 4.5), (x0 + 1 * u, yn + 4.5),
                 arrowstyle="-|>", mutation_scale=11, color=a, lw=1.8,
                 connectionstyle="arc3,rad=0.28", zorder=6))
    ax.add_patch(FancyArrowPatch((x0 + 1/3 * u, yn + 4.5), (x0 + 1 * u, yn + 4.5),
                 arrowstyle="-|>", mutation_scale=11, color=GOLD, lw=1.8,
                 connectionstyle="arc3,rad=-0.28", zorder=6))
    caption(ax, 105, yn - 12.5,
            r"$3$ et $\frac{1}{3}$ sont inverses :  $3\times\frac{1}{3}=1$.   De même $\frac{3}{4}\times\frac{4}{3}=1$.")

    footer(ax, 4, chap=2)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- CH 3
def page_ch3(pdf):
    fig, ax = new_page()
    a = ACCENTS[2]
    chap_header(ax, 3, "PUISSANCES — PUISSANCES DE 10", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        r"$a^n=a\times a\times\ldots\times a$  ($n$ facteurs égaux à $a$,  $n$ entier $>1$)",
        r"$a^0=1$ ($a\neq0$)   ;   $a^1=a$   ;   $10^n$ = 1 suivi de $n$ zéros",
        r"Écriture scientifique :  $N=a\times 10^n$  avec  $1\leq a<10$",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS — FORMULES", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$a^n\times a^m=a^{n+m}$", "Même base : on additionne les exposants."),
        (r"$\dfrac{a^n}{a^m}=a^{n-m}$", "Même base : on soustrait les exposants."),
        (r"$(a^n)^m=a^{n\times m}$", "On multiplie les exposants."),
        (r"$(a\times b)^n=a^n\times b^n$   ;   $\left(\dfrac{a}{b}\right)^n=\dfrac{a^n}{b^n}$",
         "Puissance d'un produit, d'un quotient."),
        (r"$10^{-n}=0{,}00\ldots 01$  ($n$ zéros avant le 1)", "Exposant négatif → inverse."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"$2^3\times 2^5=2^{3+5}=2^8=256$",
        r"$(-3)^2=+9$   mais   $-3^2=-9$   (attention aux parenthèses !)",
        r"$34\,500=3{,}45\times 10^{4}$   ;   $0{,}0027=2{,}7\times 10^{-3}$",
        r"$\dfrac{7^{5}}{7^{3}}=7^{5-3}=7^{2}=49$",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE", a)
    cy = y - 14
    s = 2.1
    gx, gy = 96 - 10 * s / 1, cy - 10 * s
    for i in range(10):
        for j in range(10):
            ax.add_patch(Rectangle((gx + i * s, gy + j * s), s * 0.86, s * 0.86,
                         facecolor=a, alpha=0.42, edgecolor="none", zorder=5))
    ax.add_patch(Rectangle((gx, gy), 10 * s, 10 * s, facecolor="none",
                 edgecolor=INK, lw=1.0, zorder=6))
    txt(ax, gx + 5 * s, gy - 4.5, "$10$ colonnes", fs=8.5, color=INK, ha="center")
    txt(ax, gx - 5.5, gy + 5 * s, "$10$ lignes", fs=8.5, color=INK, ha="center", rot=90)
    txt(ax, gx + 5 * s + 22, gy + 5 * s,
        r"$10\times 10=10^{2}=100$", fs=13, color=NAVY, ha="center", weight="bold")
    caption(ax, 105, gy - 11, "Un carré de 10 sur 10 contient $10^2$ petits carrés.")

    footer(ax, 5, chap=3)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- CH 4
def page_ch4(pdf):
    fig, ax = new_page()
    a = ACCENTS[3]
    chap_header(ax, 4, "CALCUL LITTÉRAL", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        "Expression littérale : expression où des nombres sont désignés par des lettres.",
        r"Réduire = regrouper les termes de même partie littérale :  $3x^2+5x-2x^2+x=x^2+6x$",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS — FORMULES", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$k(a+b)=ka+kb$   ;   $k(a-b)=ka-kb$", "Simple distributivité."),
        (r"$(a+b)(c+d)=ac+ad+bc+bd$", "Double distributivité."),
        (r"$ka+kb=k(a+b)$", "Factorisation : $k$ est le facteur commun."),
        ("Développer ⇋ Factoriser : opérations inverses.",
         "Développé : somme · Factorisé : produit."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"$A=3x(2x-5)=6x^2-15x$",
        r"$B=(x+3)(2x-1)=2x^2-x+6x-3=2x^2+5x-3$",
        r"$C=12x^2+8x=4x(3x+2)$",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE", a)
    cy = y - 13
    k, la, lb = 16, 40, 26
    x0 = 105 - (la + lb) / 2
    ax.add_patch(Rectangle((x0, cy), la, k, facecolor=tint(a, 0.55), edgecolor=INK, lw=1.1, zorder=5))
    ax.add_patch(Rectangle((x0 + la, cy), lb, k, facecolor=tint(a, 0.78), edgecolor=INK, lw=1.1, zorder=5))
    txt(ax, x0 + la / 2, cy + k / 2, r"$ka$", fs=12, color=NAVY, ha="center", z=6)
    txt(ax, x0 + la + lb / 2, cy + k / 2, r"$kb$", fs=12, color=NAVY, ha="center", z=6)
    txt(ax, x0 - 4.5, cy + k / 2, "$k$", fs=12, color=INK, ha="center", z=6)
    txt(ax, x0 + la / 2, cy - 4.5, "$a$", fs=11, color=INK, ha="center", z=6)
    txt(ax, x0 + la + lb / 2, cy - 4.5, "$b$", fs=11, color=INK, ha="center", z=6)
    txt(ax, 105, cy + k + 9, r" aire $=k(a+b)=ka+kb$", fs=13, color=NAVY,
        ha="center", weight="bold", z=6)
    caption(ax, 105, cy - 11.5, "La distributivité : l'aire du grand rectangle est la somme des deux aires.")

    footer(ax, 6, chap=4)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- CH 5
def page_ch5(pdf):
    fig, ax = new_page()
    a = ACCENTS[4]
    chap_header(ax, 5, "ÉQUATIONS DU PREMIER DEGRÉ", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        "Équation : égalité contenant une inconnue (souvent $x$).",
        "Résoudre : trouver toutes les valeurs de $x$ qui rendent l'égalité vraie.",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS — RÈGLES DE L'ÉGALITÉ", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$a=b \Longleftrightarrow a+c=b+c$",
         "On ajoute (ou retranche) un même nombre aux deux membres."),
        (r"$a=b \Longleftrightarrow a\times c=b\times c$   ($c\neq 0$)",
         "On multiplie (ou divise) les deux membres par un même nombre non nul."),
        (r"$A\times B=0 \Longleftrightarrow A=0 \ \mathrm{ou} \ B=0$", "Équation produit."),
        (r"$ax+b=c \ \Rightarrow\ x=\dfrac{c-b}{a}$", "Forme générale ($a\neq 0$)."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"$5x-7=2x+8$",
        r"$5x-2x=8+7 \ \Rightarrow\ 3x=15$",
        r"$x=\dfrac{15}{3} \ \Rightarrow\ x=5$",
        r"Vérification : $5\times 5-7=18$  et  $2\times 5+8=18$  $\checkmark$",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE — LA BALANCE", a)
    cy = y - 12
    cx = 105
    ax.add_patch(Polygon([(cx - 5, cy - 11), (cx + 5, cy - 11), (cx, cy - 3)],
                 facecolor=tint(a, 0.6), edgecolor=INK, lw=1.0, zorder=5))
    ax.plot([cx, cx], [cy - 3, cy], color=INK, lw=1.6, zorder=5)
    ax.plot([cx - 40, cx + 40], [cy, cy], color=INK, lw=2.0, zorder=5)
    for sx in (-40, 40):
        ax.plot([cx + sx, cx + sx - 7], [cy, cy - 8], color=INK, lw=0.8, zorder=5)
        ax.plot([cx + sx, cx + sx + 7], [cy, cy - 8], color=INK, lw=0.8, zorder=5)
        ax.add_patch(Wedge((cx + sx, cy - 8.5), 11, 180, 360, width=0.6,
                     facecolor="none", edgecolor=INK, lw=1.4, zorder=5))
    txt(ax, cx - 40, cy - 16, r"$5x-7$", fs=11.5, color=NAVY, ha="center", weight="bold")
    txt(ax, cx + 40, cy - 16, r"$2x+8$", fs=11.5, color=NAVY, ha="center", weight="bold")
    txt(ax, cx, cy + 3.2, r"$5x-7=2x+8$", fs=11, color=a, ha="center", weight="bold")
    caption(ax, cx, cy - 24,
            "L'égalité est en équilibre : toute opération faite à gauche doit être faite à droite.")

    footer(ax, 7, chap=5)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- CH 6
def page_ch6(pdf):
    fig, ax = new_page()
    a = ACCENTS[5]
    chap_header(ax, 6, "ORDRE ET OPÉRATIONS", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        r"$a<b$ : $a$ est strictement inférieur à $b$  ($b-a>0$).",
        r"Encadrement :  $3<x<5$ signifie  $3<x$  et  $x<5$.",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$a<b \Longleftrightarrow a+c<b+c$",
         "On peut ajouter (ou retrancher) un même nombre aux deux membres."),
        (r"$a<b$  et  $c>0 \ \Rightarrow\ ac<bc$", "Multiplier par un nombre positif : l'ordre est conservé."),
        (r"$a<b$  et  $c<0 \ \Rightarrow\ ac>bc$", "Multiplier par un nombre négatif : l'ordre est inversé !"),
        (r"$3<x<5 \ \Rightarrow\ 5<x+2<7$  et  $6<2x<10$", "Exemple d'encadrement."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"$5>3$  et  $(-2)<0$",
        r"donc  $5\times(-2) < 3\times(-2)$   c'est-à-dire   $-10<-6$",
        r"Remarque : $a<b \Rightarrow -a>-b$  (les opposés sont dans l'ordre contraire)",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE", a)
    yn = y - 12
    # ligne 1 : ordre conservé (c > 0)
    ax.plot([48, 162], [yn, yn], color=INK, lw=1.1, zorder=5)
    for xv, lab in [(60, "$a$"), (140, "$b$")]:
        ax.plot([xv, xv], [yn - 1.3, yn + 1.3], color=INK, lw=1.2, zorder=5)
        txt(ax, xv, yn - 4.4, lab, fs=9.5, color=INK, ha="center")
    txt(ax, 60, yn + 5.6, "$ac$", fs=9.5, color=a, ha="center", weight="bold")
    txt(ax, 140, yn + 5.6, "$bc$", fs=9.5, color=a, ha="center", weight="bold")
    ax.add_patch(FancyArrowPatch((66, yn + 2.2), (134, yn + 2.2), arrowstyle="-|>",
                 mutation_scale=10, color=a, lw=1.6, zorder=6))
    txt(ax, 175, yn + 3.4, r"$c>0$", fs=9.5, color=a, ha="center", weight="bold")
    # ligne 2 : ordre inversé (c < 0) — les produits basculent
    yn2 = yn - 26
    ax.plot([48, 162], [yn2, yn2], color=INK, lw=1.1, zorder=5)
    for xv, lab in [(60, "$bc$"), (140, "$ac$")]:
        ax.plot([xv, xv], [yn2 - 1.3, yn2 + 1.3], color=INK, lw=1.2, zorder=5)
        txt(ax, xv, yn2 - 4.4, lab, fs=9.5, color=INK, ha="center")
    ax.add_patch(FancyArrowPatch((134, yn2 + 6.5), (66, yn2 + 6.5), arrowstyle="-|>",
                 mutation_scale=10, color="#DC2626", lw=1.6,
                 connectionstyle="arc3,rad=0.22", zorder=6))
    txt(ax, 100, yn2 + 13.5, r"$ac>bc$ : les produits basculent !", fs=9.5,
        color="#DC2626", ha="center", weight="bold")
    txt(ax, 175, yn2 + 3.4, r"$c<0$", fs=9.5, color="#DC2626", ha="center", weight="bold")
    caption(ax, 105, yn2 - 12,
            r"Par un positif $c$, l'ordre est conservé ; par un négatif, $a$ et $b$ basculent : $ac>bc$.")

    footer(ax, 8, chap=6)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- CH 7
def page_ch7(pdf):
    fig, ax = new_page()
    a = ACCENTS[6]
    chap_header(ax, 7, "PROPORTIONNALITÉ — POURCENTAGES", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        "Proportionnalité : deux grandeurs sont proportionnelles si on passe de l'une à l'autre",
        r"en multipliant par un même coefficient.   Échelle :  $e=\dfrac{d_{\mathrm{plan}}}{d_{\mathrm{r}\acute{\mathrm{e}}\mathrm{elle}}}$",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS — FORMULES", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$\dfrac{a}{b}=\dfrac{c}{d}\ \Longleftrightarrow\ a\times d=b\times c$",
         "Produit en croix → quatrième proportionnelle."),
        (r"$v=\dfrac{d}{t}$   ;   $d=v\times t$   ;   $t=\dfrac{d}{v}$",
         "Mouvement uniforme (v en km/h, d en km, t en h)."),
        (r"$p\%\ \mathrm{de}\ x=x\times\dfrac{p}{100}$",
         "Prendre un pourcentage."),
        (r"augmenter : $x\left(1+\dfrac{p}{100}\right)$   ;   réduire : $x\left(1-\dfrac{p}{100}\right)$",
         "Coefficients multiplicateurs."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"$4$ kg de riz coûtent $6\,000$ Ar ; prix de $7$ kg ?",
        r"$x=\dfrac{6\,000\times 7}{4}=10\,500$ Ar",
        r"Une voiture parcourt $240$ km en $3$ h :  $v=\dfrac{240}{3}=80$ km/h",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE", a)
    cy = y - 10
    # tableau de proportionnalité
    tx, ty, cw, ch = 55, cy - 18, 24, 8.2
    cells = [("Poids (kg)", "4", "7"), ("Prix (Ar)", "6 000", "x")]
    for j in range(3):
        ax.add_patch(Rectangle((tx + j * cw, ty + ch), cw, ch, facecolor=tint(NAVY, 0.9),
                     edgecolor="white", lw=1.0, zorder=5))
        ax.add_patch(Rectangle((tx + j * cw, ty), cw, ch, facecolor="white",
                     edgecolor=tint(NAVY, 0.5), lw=0.8, zorder=5))
        ax.add_patch(Rectangle((tx + j * cw, ty - ch), cw, ch, facecolor="white",
                     edgecolor=tint(NAVY, 0.5), lw=0.8, zorder=5))
    txt(ax, tx + cw / 2, ty + ch / 2, cells[0][0], fs=8, color="white", ha="center", weight="bold", z=6)
    txt(ax, tx + cw * 1.5, ty + ch / 2, cells[1][0], fs=8, color="white", ha="center", weight="bold", z=6)
    txt(ax, tx + cw / 2, ty - ch / 2, "4", fs=10, color=INK, ha="center", z=6)
    txt(ax, tx + cw * 1.5, ty - ch / 2, "7", fs=10, color=INK, ha="center", z=6)
    txt(ax, tx + cw / 2, ty - ch * 1.5, "6 000", fs=10, color=INK, ha="center", z=6)
    txt(ax, tx + cw * 1.5, ty - ch * 1.5, "x", fs=10, color=a, ha="center", weight="bold", z=6)
    # produit en croix
    ax.add_patch(FancyArrowPatch((tx + cw * 0.8, ty - ch * 0.75), (tx + cw * 1.2, ty - ch * 1.3),
                 arrowstyle="-|>", mutation_scale=10, color=a, lw=1.5, zorder=7))
    ax.add_patch(FancyArrowPatch((tx + cw * 1.7, ty - ch * 0.75), (tx + cw * 1.3, ty - ch * 1.3),
                 arrowstyle="-|>", mutation_scale=10, color=a, lw=1.5, zorder=7))
    txt(ax, 118, ty - 4, r"$x\times 4=6\,000\times 7$", fs=12, color=NAVY, weight="bold")
    txt(ax, 118, ty - 13, r"$x=\dfrac{6\,000\times 7}{4}=10\,500$ Ar", fs=12, color=NAVY)
    caption(ax, 105, ty - 24, "Tableau de proportionnalité et produit en croix.")

    footer(ax, 9, chap=7)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- CH 8
def page_ch8(pdf):
    fig, ax = new_page()
    a = ACCENTS[7]
    chap_header(ax, 8, "STATISTIQUES", a)

    y = section_label(ax, 16, 256, "DÉFINITIONS", a)
    y = defs_box(ax, 16, 178, y, [
        "Population : l'ensemble étudié · Caractère : ce que l'on mesure.",
        r"Effectif $n_i$ : nombre de fois que la valeur $x_i$ apparaît · $N$ : effectif total.",
        r"Fréquence :  $f_i=\dfrac{n_i}{N}$  (souvent en % : $f_i=\dfrac{n_i}{N}\times 100$)",
    ], a)

    y -= 6
    y = section_label(ax, 16, y, "PROPRIÉTÉS — FORMULES", a)
    y = prop_rows(ax, 18, y + 1, [
        (r"$f_1+f_2+\ldots+f_p=1$   (ou $100\%$)", "La somme des fréquences vaut 1."),
        (r"$\bar{x}=\dfrac{n_1x_1+n_2x_2+\ldots+n_px_p}{N}$", "Moyenne pondérée des valeurs."),
        (r"$\mathrm{angle}=f_i\times 360^{\circ}$", "Diagramme circulaire (camembert)."),
        ("Diagrammes : bâtons, barres, circulaire.", "Un axe = valeur, hauteur = effectif."),
    ], a)

    y -= 7
    y = section_label(ax, 16, y, "EXEMPLE TYPE", a)
    y = example_box(ax, 16, 178, y, [
        r"Notes de Sariaka : $10$ ; $12$ ; $12$ ; $16$   ($N=4$)",
        r"Moyenne : $\bar{x}=\dfrac{10+12+12+16}{4}=\dfrac{50}{4}=12{,}5$",
        r"Fréquence de $12$ :  $f=\dfrac{2}{4}=0{,}5=50\%$   ;   angle $=360^{\circ}\times 0{,}5=180^{\circ}$",
    ], a)

    y -= 8
    y = section_label(ax, 16, y, "FIGURE", a)
    cy = y - 12
    # diagramme en bâtons
    bx, bby = 52, cy - 16
    bw2, umm = 7, 7.5
    data = {10: 1, 12: 2, 16: 1}
    ax.plot([bx - 6, bx + 52], [bby, bby], color=INK, lw=1.1, zorder=5)
    ax.plot([bx - 6, bx - 6], [bby, bby + 3 * umm + 3], color=INK, lw=1.1, zorder=5)
    for i, (v, n) in enumerate(data.items()):
        xx = bx + i * 17
        ax.add_patch(Rectangle((xx, bby), bw2, n * umm, facecolor=tint(a, 0.45),
                     edgecolor=INK, lw=0.9, zorder=5))
        txt(ax, xx + bw2 / 2, bby + n * umm + 1.8, f"{n}", fs=8.5, color=INK, ha="center")
        txt(ax, xx + bw2 / 2, bby - 4, f"{v}", fs=8.5, color=INK, ha="center")
    txt(ax, bx + 24, bby + 3 * umm + 9, "Effectifs", fs=8.6, color=GREY, ha="center", style="italic")
    txt(ax, bx + 24, bby - 10, "Notes", fs=8.6, color=GREY, ha="center", style="italic")
    # circulaire
    pcy = cy - 8
    pcx = 148
    rr = 13.5
    start = 90
    cols = [tint(a, 0.35), a, tint(a, 0.65)]
    labs = [("10", "25%"), ("12", "50%"), ("16", "25%")]
    for (v, n), cc, (lv, fp) in zip(data.items(), cols, labs):
        ang = 360 * n / 4
        ax.add_patch(Wedge((pcx, pcy), rr, start, start - ang, facecolor=cc,
                     edgecolor="white", lw=1.2, zorder=5))
        mid = np.deg2rad(start - ang / 2)
        txt(ax, pcx + (rr + 6.5) * np.cos(mid), pcy + (rr + 6.5) * np.sin(mid),
            f"{lv} · {fp}", fs=8.5, color=INK, ha="center")
        start -= ang
    txt(ax, pcx, pcy - rr - 11, "Fréquences", fs=8.6, color=GREY, ha="center", style="italic")

    footer(ax, 10, chap=8)
    pdf.savefig(fig); plt.close(fig)

# ---------------------------------------------------------------- MAIN
def main():
    out = "/home/user/Cours_Activites_Numeriques_4eme.pdf"
    meta = {
        "Title": "Cours — Activités Numériques — Classe de 4ème",
        "Author": "Mathématiques 4ème",
        "Subject": "Cours de mathématiques : Activités numériques (4ème)",
        "Creator": "Générateur vectoriel matplotlib",
    }
    pages = [page_cover, page_programme, page_ch1, page_ch2, page_ch3,
             page_ch4, page_ch5, page_ch6, page_ch7, page_ch8]
    with PdfPages(out, metadata=meta) as pdf:
        for i, fn in enumerate(pages, 1):
            try:
                fn(pdf)
                print(f"page {i:02d} : OK  ({fn.__name__})")
            except Exception as e:
                print(f"page {i:02d} : ERREUR {fn.__name__} -> {type(e).__name__}: {e}")
                raise
        d = pdf.infodict()
    print("PDF écrit :", out)

if __name__ == "__main__":
    main()
