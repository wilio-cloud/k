#!/usr/bin/env python3
"""
Kindle Calm Hub - Dossier Forense (Murdle-style Logic Mystery Generator & CSP Verifier)
Generates mathematically unique, zero-redundancy Catalan detective cases across 3 tiers:
  1. Iniciació (3x3): 3 suspects, 3 locations, 3 items — pure forensic clues
  2. Inspector (4x4): 4 suspects, 4 locations, 4 items — forensic + trait/disjunctive clues
  3. Comissari (Interrogatori): Statements where innocents tell the truth and the sole culprit lies!
"""

from __future__ import annotations

import itertools
import random
from typing import Callable, Dict, List, Optional, Tuple

# Rich catalog of Catalan mystery settings with grammatically exact forms
THEMES = [
    {
        "setting": "Gran Teatre del Liceu",
        "intro": "Durant l'entreacte de l'òpera d'hivern, les llums de gas han pampalluguejat i s'ha descobert un crim silenciós abans que s'aixequés el teló.",
        "suspects": [
            {"short": "Valls", "name": "Dra. Queralt Valls", "ref": "la Dra. Valls", "g": "F", "hand": "esquerrana", "bio": "Metgessa foniatra dels solistes"},
            {"short": "Bofill", "name": "Mestre Mateu Bofill", "ref": "el Mestre Bofill", "g": "M", "hand": "dretà", "bio": "Primer director d'orquestra"},
            {"short": "Mont", "name": "Clara Mont", "ref": "la soprano Clara Mont", "g": "F", "hand": "dretana", "bio": "Diva principal de la nit"},
            {"short": "Dalmau", "name": "Bernat Dalmau", "ref": "l'empresari Dalmau", "g": "M", "hand": "esquerrà", "bio": "Mecenas endeutat del teatre"},
        ],
        "locations": [
            {"short": "Llotja", "name": "Llotja Reial", "in": "a la Llotja Reial", "env": "interior"},
            {"short": "Camerino", "name": "Camerino Principal", "in": "al Camerino Principal", "env": "interior"},
            {"short": "Terrassa", "name": "Terrassa dels Miralls", "in": "a la Terrassa Exterior", "env": "exterior"},
            {"short": "Fossat", "name": "Fossat d'Orquestra", "in": "al Fossat d'Orquestra", "env": "interior"},
        ],
        "items": [
            {"short": "Cianur", "name": "Flascó de cianur", "obj": "el flascó de cianur", "w": "lleuger", "trace": "una olor subtil d'ametlla amarga"},
            {"short": "Canelobre", "name": "Canelobre de bronze", "obj": "el canelobre de bronze", "w": "pesat", "trace": "restes de cera verda i un cop sec"},
            {"short": "Estilet", "name": "Estilet d'atrezzo", "obj": "l'estilet d'atrezzo", "w": "lleuger", "trace": "una incisió neta i precisa"},
            {"short": "Contrapès", "name": "Contrapès de teló", "obj": "el contrapès de ferro", "w": "pesat", "trace": "pols d'òxid negre de la tramoia"},
        ],
    },
    {
        "setting": "Observatori Fabra",
        "intro": "En plena nit d'eclipsi sobre Barcelona, la cúpula astronòmica ha aparegut tancada per dins i un astrònom no ha tornat al seu lloc.",
        "suspects": [
            {"short": "Soler", "name": "Prof. Joana Soler", "ref": "la Prof. Soler", "g": "F", "hand": "esquerrana", "bio": "Catedràtica de mecànica celeste"},
            {"short": "Grau", "name": "Pere Grau", "ref": "el rellotger Grau", "g": "M", "hand": "dretà", "bio": " Conservador dels cronòmetres"},
            {"short": "Riba", "name": "Helena Riba", "ref": "la cartògrafa Riba", "g": "F", "hand": "dretana", "bio": "Especialista en cometes"},
            {"short": "Puig", "name": "Dr. Artur Puig", "ref": "el Dr. Puig", "g": "M", "hand": "esquerrà", "bio": "Meteoròleg de guàrdia"},
        ],
        "locations": [
            {"short": "Cúpula", "name": "Cúpula Gran", "in": "a la Cúpula Gran", "env": "interior"},
            {"short": "Mirador", "name": "Mirador del Vent", "in": "al Mirador del Vent", "env": "exterior"},
            {"short": "Arxiu", "name": "Arxiu de Plaques", "in": "a l'Arxiu de Plaques", "env": "interior"},
            {"short": "Jardí", "name": "Jardí dels Pins", "in": "al Jardí dels Pins", "env": "exterior"},
        ],
        "items": [
            {"short": "Sextant", "name": "Sextant de llautó", "obj": "el sextant de llautó", "w": "pesat", "trace": "marques angulars de metall daurat"},
            {"short": "Èter", "name": "Ampolla d'èter", "obj": "l'ampolla d'èter", "w": "lleuger", "trace": "vapors volàtils de laboratori"},
            {"short": "Lent", "name": "Prisma esmolat", "obj": "el prisma esmolat", "w": "lleuger", "trace": "fragments microscòpics de vidre òptic"},
            {"short": " Baròmetre", "name": "Baròmetre de mercuri", "obj": "el baròmetre de mercuri", "w": "pesat", "trace": "petites gotes platejades al terra"},
        ],
    },
    {
        "setting": "Monestir de Poblet",
        "intro": "Abans de matines, un col·leccionista que havia vingut a taxar un còdex medieval ha estat trobat sense sentit prop dels murs gòtics.",
        "suspects": [
            {"short": " Serra", "name": "Abat Oriol Serra", "ref": "l'Abat Serra", "g": "M", "hand": "dretà", "bio": "Custodi de la clau antiga"},
            {"short": "Pons", "name": "Mireia Pons", "ref": "la restauradora Pons", "g": "F", "hand": "esquerrana", "bio": "Experta en pergamins reials"},
            {"short": "Vidal", "name": "Llorenç Vidal", "ref": "el llibreter Vidal", "g": "M", "hand": "esquerrà", "bio": "Antiquari de manuscrits rars"},
            {"short": "Bosch", "name": "Marta Bosch", "ref": "la historiadora Bosch", "g": "F", "hand": "dretana", "bio": "Investigadora d'arxius"},
        ],
        "locations": [
            {"short": "Claustre", "name": "Claustre Major", "in": "al Claustre Major", "env": "exterior"},
            {"short": "Scriptori", "name": "Scriptorium", "in": "a l'Scriptorium", "env": "interior"},
            {"short": "Celler", "name": "Celler Gòtic", "in": "al Celler Gòtic", "env": "interior"},
            {"short": "Hort", "name": "Hort dels Xiprers", "in": "a l'Hort dels Xiprers", "env": "exterior"},
        ],
        "items": [
            {"short": " Calze", "name": "Calze d'argent", "obj": "el calze d'argent", "w": "pesat", "trace": "una abonyegadura amb relleus cisellats"},
            {"short": "Cicuta", "name": "Tintura de cicuta", "obj": "la tintura de cicuta", "w": "lleuger", "trace": "residu d'herbes amargues a la copa"},
            {"short": "Corda", "name": "Cordó de campana", "obj": "el cordó de campana", "w": "lleuger", "trace": "fibres aspres d'espart trenat"},
            {"short": "Faristol", "name": "Faristol de ferro", "obj": "el faristol de ferro", "w": "pesat", "trace": "marques negres de forja antiga"},
        ],
    },
    {
        "setting": "Far del Cap de Creus",
        "intro": "La tramuntana ha deixat quatre viatgers aïllats tota la nit al promontori rocós. A trenc d'alba, algú ha sabotat la llanterna i ha comès el crim.",
        "suspects": [
            {"short": "Roig", "name": "Capità Ferran Roig", "ref": "el Capità Roig", "g": "M", "hand": "dretà", "bio": "Antic patró de cabotatge"},
            {"short": "Camps", "name": "Agnès Camps", "ref": "la farera Camps", "g": "F", "hand": "esquerrana", "bio": "Encarregada del senyal marítim"},
            {"short": "Pla", "name": "Esteve Pla", "ref": "el pintor Pla", "g": "M", "hand": "esquerrà", "bio": "Paisatgista solitari"},
            {"short": "Mas", "name": "Júlia Mas", "ref": "la geòloga Mas", "g": "F", "hand": "dretana", "bio": "Estudiosa dels penya-segats"},
        ],
        "locations": [
            {"short": "Llanterna", "name": "Sala de la Llanterna", "in": "a la Sala de la Llanterna", "env": "interior"},
            {"short": "Moll", "name": "Moll de les Barques", "in": "al Moll de les Barques", "env": "exterior"},
            {"short": "Ràdio", "name": "Cabina de Ràdio", "in": "a la Cabina de Ràdio", "env": "interior"},
            {"short": " Cingle", "name": "Pas del Cingle", "in": "al Pas del Cingle", "env": "exterior"},
        ],
        "items": [
            {"short": "Arpó", "name": "Arpó rovellat", "obj": "l'arpó rovellat", "w": "pesat", "trace": "una ferida punxant amb salitre"},
            {"short": "Clau", "name": "Clau anglesa gran", "obj": "la clau anglesa", "w": "pesat", "trace": "greix negre de maquinària"},
            {"short": "Xarxa", "name": "Cap de niló", "obj": "el cap de niló mariner", "w": "lleuger", "trace": "marques fines de nus mariner"},
            {"short": "Làudam", "name": "Gotetes de làudam", "obj": "el flascó de làudam", "w": "lleuger", "trace": "un somni profund induït sense lluita"},
        ],
    },
    {
        "setting": "Balneari de Caldes",
        "intro": "Entre el baf de les aigües termals i el silenci de la galeria modernista, un banquer discret no ha acudit al sopar.",
        "suspects": [
            {"short": "Nadal", "name": "Comtessa Elvira Nadal", "ref": "la Comtessa Nadal", "g": "F", "hand": "dretana", "bio": "Clienta fixa de la suite reial"},
            {"short": " Prat", "name": "Dr. Miquel Prat", "ref": "el Dr. Prat", "g": "M", "hand": "esquerrà", "bio": "Director mèdic del balneari"},
            {"short": "Llor", "name": "Berta Llor", "ref": "la secretària Llor", "g": "F", "hand": "esquerrana", "bio": "Gestora del testament"},
            {"short": "Font", "name": "Ramon Font", "ref": "el majordom Font", "g": "M", "hand": "dretà", "bio": "Coneixedor de tots els passadissos"},
        ],
        "locations": [
            {"short": "Termes", "name": "Termes Romanes", "in": "a les Termes Romanes", "env": "interior"},
            {"short": "Hivern.", "name": "Hivernacle de Vidre", "in": "a l'Hivernacle", "env": "exterior"},
            {"short": "Saló", "name": "Saló dels Miralls", "in": "al Saló dels Miralls", "env": "interior"},
            {"short": "Pèrgola", "name": "Pèrgola del Parc", "in": "a la Pèrgola del Parc", "env": "exterior"},
        ],
        "items": [
            {"short": "Agulla", "name": "Agulla de barret", "obj": "l'agulla de barret", "w": "lleuger", "trace": "una punxada gairebé invisible"},
            {"short": "Bust", "name": "Bust de marbre", "obj": "el bust de marbre", "w": "pesat", "trace": "pols blanca de pedra polida"},
            {"short": "Digital", "name": "Infusió de digital", "obj": "la infusió de digital", "w": "lleuger", "trace": "pètals liles al fons de la tassa"},
            {"short": "Atiador", "name": "Atiador de llautó", "obj": "l'atiador de llautó", "w": "pesat", "trace": "sutge de la xemeneia"},
        ],
    },
    {
        "setting": "Refugi d'Ulldeter",
        "intro": "Una rufaga de neu ha tancat els camins del Pirineu. Dins del refugi de muntanya, les petjades humides delaten moviments nocturns.",
        "suspects": [
            {"short": " Tena", "name": "Arnau Tena", "ref": "el guia Arnau Tena", "g": "M", "hand": "esquerrà", "bio": "Alpinista veterà"},
            {"short": "Roca", "name": "Laia Roca", "ref": "la cartògrafa Roca", "g": "F", "hand": "dretana", "bio": "Topògrafa d'alta muntanya"},
            {"short": "Bru", "name": "Cesc Bru", "ref": "el guarda Cesc Bru", "g": "M", "hand": "dretà", "bio": "Responsable del refugi"},
            {"short": "Gelabert", "name": "Núria Gelabert", "ref": "la fotògrafa Gelabert", "g": "F", "hand": "esquerrana", "bio": "Reportera de natura"},
        ],
        "locations": [
            {"short": "Llar", "name": "Sala de la Llar", "in": "a la Sala de la Llar", "env": "interior"},
            {"short": "Porxo", "name": "Porxo de Neu", "in": "al Porxo de Neu", "env": "exterior"},
            {"short": "Guarda.", "name": "Cambra d'Esquís", "in": "a la Cambra d'Esquís", "env": "interior"},
            {"short": "Collada", "name": "Mirador de la Collada", "in": "al Mirador de la Collada", "env": "exterior"},
        ],
        "items": [
            {"short": "Piolet", "name": "Piolet d'escalada", "obj": "el piolet d'escalada", "w": "pesat", "trace": "un impacte sec d'acer temperat"},
            {"short": "Corda", "name": "Corda de ràpel", "obj": "la corda de ràpel", "w": "lleuger", "trace": "fibres vermelles de poliamida"},
            {"short": "Aconit", "name": "Licor amb tora blava", "obj": "el licor amb tora blava", "w": "lleuger", "trace": "restes d'arrel pirinenca tòxica"},
            {"short": "Grampons", "name": "Parell de grampons", "obj": "els grampons de ferro", "w": "pesat", "trace": "marques dentades molt característiques"},
        ],
    },
    {
        "setting": "Ateneu Vuitcentista",
        "intro": "Durant el torneig anual d'escacs per correspondència, s'ha produït una apagada de cinc minuts i el campió vigent ha caigut fulminat.",
        "suspects": [
            {"short": "Mora", "name": " Mercè Mora", "ref": "la mestra Mora", "g": "F", "hand": "esquerrana", "bio": " Gran mestra de finals de torre"},
            {"short": "Sala", "name": "Enric Sala", "ref": "el bibliotecari Sala", "g": "M", "hand": "dretà", "bio": " Zelador dels incunables"},
            {"short": "Torres", "name": "Víctor Torres", "ref": "el crític Torres", "g": "M", "hand": "esquerrà", "bio": "Columnista de passatemps"},
            {"short": "Vallès", "name": "Isona Vallès", "ref": "la matemàtica Vallès", "g": "F", "hand": "dretana", "bio": "Analista de probabilitats"},
        ],
        "locations": [
            {"short": "Bibliot.", "name": "Biblioteca Gran", "in": "a la Biblioteca Gran", "env": "interior"},
            {"short": "Jardí", "name": "Pati de les Palmeres", "in": "al Pati de les Palmeres", "env": "exterior"},
            {"short": "Hemerot.", "name": "Hemeroteca Fosca", "in": "a l'Hemeroteca", "env": "interior"},
            {"short": "Galeria", "name": "Galeria Oberta", "in": "a la Galeria Oberta", "env": "exterior"},
        ],
        "items": [
            {"short": "Trofeu", "name": "Trofeu d'ònix", "obj": "el trofeu d'ònix", "w": "pesat", "trace": "una estella de pedra negra brillant"},
            {"short": "Plegad.", "name": "Plegadora d'ivori", "obj": "la plegadora d'ivori", "w": "lleuger", "trace": "una fulla fina d'obrir cartes"},
            {"short": "Arsènic", "name": "Pols d'arsènic", "obj": "la pols d'arsènic", "w": "lleuger", "trace": "un pòsit blanquinós al got d'aigua"},
            {"short": "Rellotge", "name": "Rellotge de plom", "obj": "el rellotge d'escacs de plom", "w": "pesat", "trace": "una molla saltada a l'hora exacta"},
        ],
    },
    {
        "setting": "Celler del Priorat",
        "intro": "La nit del tast privat de la collita centenària, algú ha baixat a les voltes subterrànies i ha silenciat el comprador estranger.",
        "suspects": [
            {"short": " Caralt", "name": "Eulàlia Caralt", "ref": "l'enòloga Caralt", "g": "F", "hand": "dretana", "bio": "Creadora del vi reserva"},
            {"short": "Miró", "name": "Jaume Miró", "ref": "el boter Miró", "g": "M", "hand": "esquerrà", "bio": "Mestre artesà del roure"},
            {"short": "Lleó", "name": "Guillem Lleó", "ref": "el sommelier Lleó", "g": "M", "hand": "dretà", "bio": "Tastador de prestigi"},
            {"short": " Costa", "name": " Marina Costa", "ref": "l'hereva Costa", "g": "F", "hand": "esquerrana", "bio": "Copropietària de les vinyes"},
        ],
        "locations": [
            {"short": "Bótes", "name": "Sala de Bótes", "in": "a la Sala de Bótes", "env": "interior"},
            {"short": "Porxo", "name": "Porxo de Llicorella", "in": "al Porxo de Llicorella", "env": "exterior"},
            {"short": "Lab.", "name": "Laboratori de Tast", "in": "al Laboratori de Tast", "env": "interior"},
            {"short": "Era", "name": "Era Vella", "in": "a l'Era Vella", "env": "exterior"},
        ],
        "items": [
            {"short": " Maça", "name": "Maça de boter", "obj": "la maça de fusta de roure", "w": "pesat", "trace": "encenalls de roure torrat"},
            {"short": "Lleixiu", "name": "Reactiu sulfític", "obj": "el reactiu químic", "w": "lleuger", "trace": "una fortor punyent de sofre"},
            {"short": " Falçó", "name": "Falçó de verema", "obj": "el falçó de verema", "w": "lleuger", "trace": "un tall corbat característic"},
            {"short": "Premsa", "name": "Barra de premsa", "obj": "la barra de la premsa", "w": "pesat", "trace": "taques fosques de brisa de raïm"},
        ],
    },
]


def clean_theme(raw: Dict) -> Dict:
    t = {
        "setting": raw["setting"].strip(),
        "intro": raw["intro"].strip(),
        "suspects": [],
        "locations": [],
        "items": [],
    }
    for s in raw["suspects"]:
        cs = {k: v.strip() for k, v in s.items()}
        cs["is_lefty"] = cs["hand"].startswith("esquerr")
        t["suspects"].append(cs)
    for l in raw["locations"]:
        t["locations"].append({k: v.strip() for k, v in l.items()})
    for it in raw["items"]:
        t["items"].append({k: v.strip() for k, v in it.items()})
    return t


CLEAN_THEMES = [clean_theme(x) for x in THEMES]

# State representation: (perm_loc, perm_item, culprit_idx)
# perm_loc[s] = location index of suspect s
# perm_item[s] = item index of suspect s
State = Tuple[Tuple[int, ...], Tuple[int, ...], int]


def all_states(n: int) -> List[State]:
    perms = list(itertools.permutations(range(n)))
    out: List[State] = []
    for pl in perms:
        for pi in perms:
            for c in range(n):
                out.append((pl, pi, c))
    return out


def generate_candidate_clues(
    n: int,
    suspects: List[Dict],
    locations: List[Dict],
    items: List[Dict],
    truth: State,
    allow_disjunction: bool,
) -> Tuple[List[Tuple[str, Callable[[State], bool]]], Tuple[str, Callable[[State], bool]]]:
    """
    Generates truthful forensic grid clues + a crime-identifying clue for `truth`.
    Each clue is (catalan_text, predicate(state) -> bool).
    """
    t_pl, t_pi, t_c = truth
    # Inverse maps in truth: loc -> suspect, item -> suspect
    loc_to_s = {t_pl[s]: s for s in range(n)}
    item_to_s = {t_pi[s]: s for s in range(n)}

    grid_clues: List[Tuple[str, Callable[[State], bool]]] = []

    # 1. Direct positive S-L, S-I, L-I facts
    for s in range(n):
        l_idx = t_pl[s]
        i_idx = t_pi[s]
        grid_clues.append((
            f"Es va veure {suspects[s]['ref']} {locations[l_idx]['in']}.",
            (lambda s_=s, l_=l_idx: lambda st: st[0][s_] == l_)(),
        ))
        grid_clues.append((
            f"Qui duia {items[i_idx]['obj']} era {suspects[s]['ref']}.",
            (lambda s_=s, i_=i_idx: lambda st: st[1][s_] == i_)(),
        ))
        grid_clues.append((
            f"S'ha confirmat que {items[i_idx]['obj']} es trobava {locations[l_idx]['in']}.",
            (lambda l_=l_idx, i_=i_idx: lambda st: any(st[0][k] == l_ and st[1][k] == i_ for k in range(n)))(),
        ))

    # 2. Direct negative S-L, S-I, L-I facts
    for s in range(n):
        for l_idx in range(n):
            if t_pl[s] != l_idx:
                grid_clues.append((
                    f"Consta que {suspects[s]['ref']} no va trepitjar el sector situat {locations[l_idx]['in']}.",
                    (lambda s_=s, l_=l_idx: lambda st: st[0][s_] != l_)(),
                ))
        for i_idx in range(n):
            if t_pi[s] != i_idx:
                grid_clues.append((
                    f"Les empremtes descarten que {suspects[s]['ref']} dugués {items[i_idx]['obj']}.",
                    (lambda s_=s, i_=i_idx: lambda st: st[1][s_] != i_)(),
                ))
    for l_idx in range(n):
        s_at_l = loc_to_s[l_idx]
        for i_idx in range(n):
            if t_pi[s_at_l] != i_idx:
                grid_clues.append((
                    f"L'escorcoll {locations[l_idx]['in']} demostra que allà no hi havia {items[i_idx]['obj']}.",
                    (lambda l_=l_idx, i_=i_idx: lambda st: not any(st[0][k] == l_ and st[1][k] == i_ for k in range(n)))(),
                ))

    # 3. Trait-based clues (handedness, interior/exterior, heavy/light)
    for s in range(n):
        l_idx = t_pl[s]
        i_idx = t_pi[s]
        is_left = suspects[s]["is_lefty"]
        env = locations[l_idx]["env"]
        w = items[i_idx]["w"]

        hand_word = "esquerrana" if is_left else "dretana"
        grid_clues.append((
            f"La persona que duia {items[i_idx]['obj']} era {hand_word}.",
            (lambda i_=i_idx, lf_=is_left: lambda st: any(st[1][k] == i_ and suspects[k]["is_lefty"] == lf_ for k in range(n)))(),
        ))
        grid_clues.append((
            f"Qui es trobava {locations[l_idx]['in']} portava un objecte {w}.",
            (lambda l_=l_idx, w_=w: lambda st: any(st[0][k] == l_ and items[st[1][k]]["w"] == w_ for k in range(n)))(),
        ))
        grid_clues.append((
            f"S'ha deduït que {suspects[s]['ref']} era en un espai {env}.",
            (lambda s_=s, env_=env: lambda st: locations[st[0][s_]]["env"] == env_)(),
        ))

    # 4. Disjunctive clues ("O bé A, o bé B") for Inspector 4x4 tier
    if allow_disjunction:
        for s1 in range(n):
            l1 = t_pl[s1]
            # Pair a TRUE statement with a FALSE statement to create a crisp logical fork
            s2 = (s1 + 1) % n
            wrong_i = (t_pi[s2] + 1) % n
            txt = f"O bé {suspects[s1]['ref']} era {locations[l1]['in']}, o bé {suspects[s2]['ref']} duia {items[wrong_i]['obj']}."
            pred = (
                lambda s1_=s1, l1_=l1, s2_=s2, wi_=wrong_i:
                lambda st: (st[0][s1_] == l1_) or (st[1][s2_] == wi_)
            )()
            grid_clues.append((txt, pred))

    # Crime-identifying clue (links culprit's weapon trace or crime scene!)
    crime_item = t_pi[t_c]
    crime_loc = t_pl[t_c]
    crime_env = locations[crime_loc]["env"]
    crime_options = [
        (
            f"PROVA FORENSE DEL CRIM: L'examen del cos ha detectat {items[crime_item]['trace']}.",
            (lambda ci_=crime_item: lambda st: st[1][st[2]] == ci_)(),
        ),
        (
            f"PROVA FORENSE DEL CRIM: El crim es va cometre {locations[crime_loc]['in']}.",
            (lambda cl_=crime_loc: lambda st: st[0][st[2]] == cl_)(),
        ),
    ]
    # Check if (env, weight) uniquely identifies the culprit in truth!
    cw = items[crime_item]["w"]
    matching_s = [
        k for k in range(n)
        if locations[t_pl[k]]["env"] == crime_env and items[t_pi[k]]["w"] == cw
    ]
    if len(matching_s) == 1 and matching_s[0] == t_c:
        crime_options.append((
            f"PROVA FORENSE DEL CRIM: L'atac va passar en un espai {crime_env} i amb un objecte {cw}.",
            (lambda env_=crime_env, w_=cw: lambda st: locations[st[0][st[2]]]["env"] == env_ and items[st[1][st[2]]]["w"] == w_)(),
        ))

    return grid_clues, crime_options[-1]


def build_forensic_case(
    case_num: int,
    tier: str,
    n: int,
    theme: Dict,
    rng: random.Random,
) -> Dict:
    universe = all_states(n)
    suspects = rng.sample(theme["suspects"], n)
    locations = rng.sample(theme["locations"], n)
    items = rng.sample(theme["items"], n)

    for _attempt in range(60):
        pl = list(range(n))
        pi = list(range(n))
        rng.shuffle(pl)
        rng.shuffle(pi)
        culprit = rng.randrange(n)
        truth: State = (tuple(pl), tuple(pi), culprit)

        pool, crime_clue = generate_candidate_clues(
            n, suspects, locations, items, truth, allow_disjunction=(tier == "inspector")
        )
        # Prefer indirect / negative / trait clues over giving away too many direct positives!
        direct_pos = [c for c in pool if c[0].startswith(("Es va veure", "Qui duia", "S'ha confirmat"))]
        rich_clues = [c for c in pool if c not in direct_pos]
        rng.shuffle(rich_clues)
        rng.shuffle(direct_pos)
        ordered_pool = rich_clues + direct_pos

        selected: List[Tuple[str, Callable[[State], bool]]] = [crime_clue]
        remaining = [st for st in universe if crime_clue[1](st)]

        for cand in ordered_pool:
            if len(remaining) == 1:
                break
            filtered = [st for st in remaining if cand[1](st)]
            # Keep clue only if it strictly narrows down the state space!
            if 1 <= len(filtered) < len(remaining):
                selected.append(cand)
                remaining = filtered

        if len(remaining) != 1 or remaining[0] != truth:
            continue

        # Minimal pruning: remove any clue whose removal still leaves unique solution == truth
        # Keep crime_clue at the end for dramatic clarity
        pruned = selected[:]
        idx = 0
        while idx < len(pruned):
            test_list = pruned[:idx] + pruned[idx + 1 :]
            surv = [st for st in universe if all(cl[1](st) for cl in test_list)]
            if len(surv) == 1 and surv[0] == truth:
                pruned = test_list
            else:
                idx += 1

        if 4 <= len(pruned) <= 8:
            # Put crime clue last
            non_crime = [c[0] for c in pruned if not c[0].startswith("PROVA FORENSE")]
            crime_txts = [c[0] for c in pruned if c[0].startswith("PROVA FORENSE")]
            clues_text = non_crime + crime_txts
            return format_case_dict(case_num, tier, n, theme, suspects, locations, items, truth, clues_text)

    raise RuntimeError("Failed to synthesize unique forensic case")


def build_liar_case(
    case_num: int,
    n: int,
    theme: Dict,
    rng: random.Random,
) -> Dict:
    """
    Comissari Tier: Each suspect makes 1 statement.
    Rule: All innocents tell the truth; the ONE culprit tells a lie!
    """
    universe = all_states(n)
    suspects = rng.sample(theme["suspects"], n)
    locations = rng.sample(theme["locations"], n)
    items = rng.sample(theme["items"], n)

    for _attempt in range(120):
        pl = list(range(n))
        pi = list(range(n))
        rng.shuffle(pl)
        rng.shuffle(pi)
        culprit = rng.randrange(n)
        truth: State = (tuple(pl), tuple(pi), culprit)

        # Build possible statements for each speaker `sp`
        # A statement is (quote_text, predicate(st) -> bool)
        statements_for_speaker: List[Tuple[str, Callable[[State], bool]]] = []
        ok_statements = True

        for sp in range(n):
            other = (sp + 1) % n
            true_opts = [
                (
                    f"«Jo era {locations[pl[sp]]['in']}.»",
                    (lambda s_=sp, l_=pl[sp]: lambda st: st[0][s_] == l_)(),
                ),
                (
                    f"«Jo no duia {items[pi[other]]['obj']}.»",
                    (lambda s_=sp, i_=pi[other]: lambda st: st[1][s_] != i_)(),
                ),
                (
                    f"«Vaig veure {suspects[other]['ref']} {locations[pl[other]]['in']}.»",
                    (lambda o_=other, l_=pl[other]: lambda st: st[0][o_] == l_)(),
                ),
                (
                    f"«{suspects[other]['ref'][0].upper() + suspects[other]['ref'][1:]} portava {items[pi[other]]['obj']}.»",
                    (lambda o_=other, i_=pi[other]: lambda st: st[1][o_] == i_)(),
                ),
            ]
            false_opts = [
                (
                    f"«Jo era {locations[pl[other]]['in']}.»",
                    (lambda s_=sp, l_=pl[other]: lambda st: st[0][s_] == l_)(),
                ),
                (
                    f"«Jo no era {locations[pl[sp]]['in']}.»",
                    (lambda s_=sp, l_=pl[sp]: lambda st: st[0][s_] != l_)(),
                ),
                (
                    f"«{suspects[other]['ref'][0].upper() + suspects[other]['ref'][1:]} era {locations[pl[sp]]['in']}.»",
                    (lambda o_=other, l_=pl[sp]: lambda st: st[0][o_] == l_)(),
                ),
                (
                    f"«Jo no tenia {items[pi[sp]]['obj']}.»",
                    (lambda s_=sp, i_=pi[sp]: lambda st: st[1][s_] != i_)(),
                ),
            ]
            if sp == culprit:
                pick = rng.choice(false_opts)
                assert not pick[1](truth)
            else:
                pick = rng.choice(true_opts)
                assert pick[1](truth)
            statements_for_speaker.append(pick)

        # Liar rule predicate on a candidate state `st = (cand_pl, cand_pi, cand_c)`:
        # Statement[k] must be False when k == cand_c, and True for all k != cand_c!
        def liar_rule_ok(st: State, stmts=statements_for_speaker) -> bool:
            cand_c = st[2]
            for k in range(n):
                val = stmts[k][1](st)
                if k == cand_c and val:
                    return False
                if k != cand_c and not val:
                    return False
            return True

        remaining = [st for st in universe if liar_rule_ok(st)]
        if truth not in remaining:
            continue

        # Add minimal objective forensic facts so `truth` is the UNIQUE full state
        pool, _ = generate_candidate_clues(n, suspects, locations, items, truth, allow_disjunction=False)
        rng.shuffle(pool)
        extra_facts: List[Tuple[str, Callable[[State], bool]]] = []

        for cand in pool:
            if len(remaining) == 1:
                break
            filtered = [st for st in remaining if cand[1](st)]
            if 1 <= len(filtered) < len(remaining):
                extra_facts.append(cand)
                remaining = filtered

        if len(remaining) != 1 or remaining[0] != truth:
            continue

        # Prune redundant extra facts
        idx = 0
        while idx < len(extra_facts):
            test_facts = extra_facts[:idx] + extra_facts[idx + 1 :]
            surv = [
                st for st in universe
                if liar_rule_ok(st) and all(f[1](st) for f in test_facts)
            ]
            if len(surv) == 1 and surv[0] == truth:
                extra_facts = test_facts
            else:
                idx += 1

        if 1 <= len(extra_facts) <= 4:
            clues_text = [
                f"{suspects[sp]['short']}: {statements_for_speaker[sp][0]}"
                for sp in range(n)
            ] + [f"PROVA: {f[0]}" for f in extra_facts]
            return format_case_dict(
                case_num, "comissari", n, theme, suspects, locations, items, truth, clues_text,
                liar_quote=statements_for_speaker[culprit][0],
            )

    raise RuntimeError("Failed to synthesize unique liar case")


def format_case_dict(
    case_num: int,
    tier: str,
    n: int,
    theme: Dict,
    suspects: List[Dict],
    locations: List[Dict],
    items: List[Dict],
    truth: State,
    clues: List[str],
    liar_quote: Optional[str] = None,
) -> Dict:
    pl, pi, c = truth
    c_susp = suspects[c]
    c_loc = locations[pl[c]]
    c_item = items[pi[c]]

    if tier == "comissari" and liar_quote:
        epilogue = (
            f"Cas tancat! {c_susp['name']} s'ha contradit en afirmar {liar_quote} "
            f"En realitat es trobava {c_loc['in']} i duia {c_item['obj']}, "
            f"deixant {c_item['trace']}."
        )
    else:
        epilogue = (
            f"Cas tancat! Les proves situen sense cap dubte {c_susp['ref']} "
            f"{c_loc['in']} amb {c_item['obj']} ({c_item['trace']})."
        )

    tier_labels = {
        "iniciacio": "Iniciació 3×3",
        "inspector": "Inspector 4×4",
        "comissari": "Interrogatori (1 mentider)",
    }

    return {
        "id": case_num,
        "tier": tier,
        "tierLabel": tier_labels[tier],
        "n": n,
        "title": f"Cas #{case_num:02d} · {theme['setting']}",
        "setting": theme["setting"],
        "intro": theme["intro"],
        "isLiarMode": tier == "comissari",
        "suspects": [
            {"short": s["short"], "name": s["name"], "trait": s["hand"], "bio": s["bio"]}
            for s in suspects
        ],
        "locations": [
            {"short": l["short"], "name": l["name"], "trait": l["env"]}
            for l in locations
        ],
        "items": [
            {"short": it["short"], "name": it["name"], "trait": it["w"]}
            for it in items
        ],
        "clues": clues,
        "solution": {
            "permLoc": list(pl),
            "permItem": list(pi),
            "culprit": c,
            "loc": pl[c],
            "item": pi[c],
        },
        "epilogue": epilogue,
    }


def build_all_dossier_cases(rng: random.Random) -> Tuple[List[Dict], List[Dict]]:
    """
    Returns:
      - web_cases: 24 cases (8 iniciacio 3x3, 8 inspector 4x4, 8 comissari 3x3)
      - epub_cases: 15 disjoint cases (5 iniciacio, 5 inspector, 5 comissari) for offline EPUB Vol. 2
    """
    web_cases: List[Dict] = []
    cid = 1
    for i in range(8):
        th = CLEAN_THEMES[i % len(CLEAN_THEMES)]
        web_cases.append(build_forensic_case(cid, "iniciacio", 3, th, rng))
        cid += 1
    for i in range(8):
        th = CLEAN_THEMES[(i + 3) % len(CLEAN_THEMES)]
        web_cases.append(build_forensic_case(cid, "inspector", 4, th, rng))
        cid += 1
    for i in range(8):
        th = CLEAN_THEMES[(i + 5) % len(CLEAN_THEMES)]
        web_cases.append(build_liar_case(cid, 3, th, rng))
        cid += 1

    epub_cases: List[Dict] = []
    ecid = 1
    for i in range(5):
        th = CLEAN_THEMES[(i + 1) % len(CLEAN_THEMES)]
        epub_cases.append(build_forensic_case(ecid, "iniciacio", 3, th, rng))
        ecid += 1
    for i in range(5):
        th = CLEAN_THEMES[(i + 4) % len(CLEAN_THEMES)]
        epub_cases.append(build_forensic_case(ecid, "inspector", 4, th, rng))
        ecid += 1
    for i in range(5):
        th = CLEAN_THEMES[(i + 6) % len(CLEAN_THEMES)]
        epub_cases.append(build_liar_case(ecid, 3, th, rng))
        ecid += 1

    return web_cases, epub_cases


if __name__ == "__main__":
    r = random.Random(20261031)
    wc, ec = build_all_dossier_cases(r)
    print(f"Generated {len(wc)} Web cases and {len(ec)} EPUB cases.")
    print("Sample Case #1:", wc[0]["title"], "Clues:", wc[0]["clues"])
    print("Sample Liar Case #17:", wc[16]["title"], "Clues:", wc[16]["clues"])
