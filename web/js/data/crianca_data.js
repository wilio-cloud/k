// Joc 4: Créixer amb Calma — Base de Dades v6 (Criança 0-12a, Ioga Restauratiu, Jocs i Frases Pont)
(function () {
  window.CalmData = window.CalmData || {};

  var STAGES = [
    { id: "all", label: "Totes", fullLabel: "Camí Evolutiu (0–12a)" },
    { id: "0-1", label: "0–1a", fullLabel: "0–1 anys · Nadó, Descans i Equip" },
    { id: "1-3", label: "1–3a", fullLabel: "1–3 anys · Autonomia i Paciència" },
    { id: "4-6", label: "4–6a", fullLabel: "4–6 anys · Imaginació i Germans" },
    { id: "7-9", label: "7–9a", fullLabel: "7–9 anys · Autoestima i Escola" },
    { id: "10-12", label: "10–12a", fullLabel: "10–12 anys · Preadolescència" }
  ];

  var SCENES = [
    // ==================== ETAPA 0-1 ANYS (17 ESCENES) ====================
    {
      id: "01_vespre_inquiet", stage: "0-1", stageLabel: "0-1 ANYS · CAPVESPRE",
      title: "Inquietud del capvespre després d'un dia llarg",
      body: "Són les vuit del vespre. El nadó ja ha menjat i està net, però remuga neguitós i li costa relaxar-se després d'un dia amb molts estímuls.",
      opts: [
        {
          k: "A", t: "Abaixar els llums, bressolar-lo amb moviment rítmic suau i cantar fluixet", s: "Reducció sensorial i calma rítmica",
          vincle: +11, reg: +10, calma: +5,
          react: "A poc a poc afluixa els punys, recolza el cap i respira més a compassat amb tu.",
          neuro: "Segons Dan Siegel, el sistema nerviós immadur del nadó s'atabala al final del dia i es regula a través del ritme, la veu greu o suau i la penombra.",
          phrase: "«Ja s'acaba el dia, petit. Baixem la llum i descansem junts.»"
        },
        {
          k: "B", t: "Encendre joguines musicals amb llums de colors per distreure'l", s: "Afegir més estímuls visuals i sonors",
          vincle: +1, reg: -7, calma: -6,
          react: "Mira les llums uns segons, però de seguida aparta la vista encara més cansat.",
          neuro: "Quan el cervell del nadó ja està saturat d'informació, afegir soroll i llum augmenta el cortisol i retarda el son.",
          phrase: "Al capvespre, menys estímuls equivalen a més serenor per a tota la llar."
        },
        {
          k: "C", t: "Passar-lo de braços en braços ràpidament provant deu coses en dos minuts", s: "Canvis ràpids amb neguit adult",
          vincle: +2, reg: -5, calma: -8,
          react: "Nota la pressa de l'ambient i li costa més trobar el punt de repòs.",
          neuro: "Els nadons capten el to muscular i el ritme cardíac de qui els sosté; mantenir una sola acció pausada durant uns minuts l'ajuda a aterrar.",
          phrase: "«Respirem a poc a poc; no hi ha cap pressa per adormir-se.»"
        }
      ]
    },
    {
      id: "01_opinions_visita", stage: "0-1", stageLabel: "0-1 ANYS · ENTORN FAMILIAR",
      title: "«Si l'agafes tan sovint s'hi acostumarà malament»",
      body: "En un dinar familiar, aculls el nadó quan et busca amb la mirada i un familiar et comenta amb bona intenció que l'estàs malacostumant als braços.",
      opts: [
        {
          k: "A", t: "Deixar-lo al cotxet tot i que et demana contacte per no sentir comentaris", s: "Cedir a la pressió externa",
          vincle: -7, reg: -5, calma: -7,
          react: "El nadó reclama més fort i tu passes el dinar incòmoda i dividida per dins.",
          neuro: "La teoria de l'aferrament de Bowlby i Ainsworth demostra que atendre la necessitat de contacte al primer any construeix més autonomia futura, no pas menys.",
          phrase: "Escoltar el vostre instint cuidador us dóna coherència i pau."
        },
        {
          k: "B", t: "Respondre amb un somriure serè i breu: «Ara toca recarregar bateria de mimitos» i canviar de tema", s: "Límit amable sense entrar en debat",
          vincle: +10, reg: +8, calma: +9,
          react: "El comentari s'esvaeix sense tensió, el nadó es relaxa i tu conserves l'energia.",
          neuro: "Protegir l'espai de cria amb humor i fermesa suau evita discussions estèrils que esgoten els pares.",
          phrase: "«Ens encanta gaudir d'aquesta etapa tan curta. Em passes l'amanida, si us plau?»"
        },
        {
          k: "C", t: "Entrar en una discussió llarga i tensa a taula citant estudis científics", s: "Desgast dialèctic en públic",
          vincle: +3, reg: +1, calma: -9,
          react: "L'ambient a taula es refreda i acabes el dinar esgotada d'haver-te de justificar.",
          neuro: "No cal convèncer tothom de les vostres decisions familiars; la seguretat tranquil·la comunica molt més que mil arguments.",
          phrase: "«A casa ens funciona molt bé així, gràcies per l'interès.»"
        }
      ]
    },
    {
      id: "01_equip_nit", stage: "0-1", stageLabel: "0-1 ANYS · EQUIP DE PARELLA",
      title: "Cansament acumulat i conversa de matinada",
      body: "Fa dies que dormiu a trossos curts. Al matí sentiu que us responeu més secs del compte per petits detalls domèstics.",
      opts: [
        {
          k: "A", t: "Guardar-te el malestar en silenci esperant que l'altre endevini què necessites", s: "Acumular càrrega sense expressar-la",
          vincle: -4, reg: -2, calma: -9,
          react: "La distància creix durant el dia i qualsevol oblit sembla molt més greu.",
          neuro: "La manca de son redueix la capacitat de llegir senyals subtils; demanar ajuda concreta amb claredat protegeix el vincle de parella.",
          phrase: "Parlar des del «necessito» uneix molt més que parlar des del «tu mai fas»."
        },
        {
          k: "B", t: "Fer recompte de qui ha dormit menys minuts per veure qui té més raó", s: "Competició d'esgotament",
          vincle: -6, reg: -3, calma: -8,
          react: "Tots dos us sentiu poc valorats malgrat l'esforç enorme que esteu fent.",
          neuro: "Quan dos adults cansats competeixen pel cansament, el cervell entra en mode defensiu. Sou el mateix equip davant una etapa exigent.",
          phrase: "«El cansament és l'adversari, no pas nosaltres.»"
        },
        {
          k: "C", t: "Demanar un relleu concret de 40 minuts i recordar-vos que sou del mateix equip", s: "Cura mútua i torns clars",
          vincle: +11, reg: +7, calma: +12,
          react: "Pacteu un torn clar de descans avui per a cadascú i torna la complicitat amb una abraçada.",
          neuro: "Jesper Juul recorda que cuidar l'equip d'adults és la base invisible sobre la qual descansa el benestar de l'infant.",
          phrase: "«Avui anem curts de son tots dos. Fem un torn de mitja hora de descans cadascú aquesta tarda?»"
        }
      ]
    },
    {
      id: "01_primers_aliments", stage: "0-1", stageLabel: "6-9 MESOS · ALIMENTACIÓ",
      title: "Explorant el bròquil i la cullera per primer cop",
      body: "Als set mesos oferiu trossets tous o crema de verdures. El nadó ho aixafa amb els dits, fa ganyotes divertides i gairebé tot acaba a la safata.",
      opts: [
        {
          k: "A", t: "Insistir acostant-li la cullera de pressa aprofitant quan bada la boca", s: "Pressió perquè s'acabi la ració",
          vincle: -6, reg: -7, calma: -6,
          react: "Gira el cap i tanca els llavis amb força cada cop que veu acostar-se la cullera.",
          neuro: "Segons Ellyn Satter, respectar els senyals de sacietat i curiositat des de l'inici preserva l'autoregulació innata de la gana.",
          phrase: "Fins a l'any l'alimentació és sobretot aprenentatge sensorial i familiar."
        },
        {
          k: "B", t: "Deixar-lo tocar, olorar i tastar al seu ritme mentre mengeu junts amb tranquil·litat", s: "Exploració sensorial i modelatge a taula",
          vincle: +10, reg: +11, calma: +6,
          react: "Observa com mastegues, xafa el bròquil curiós i acaba portant-se'n un trosset a la boca tot content.",
          neuro: "Les neurones mirall fan que el nadó aprengui a estimar el menjar veient els adults gaudir a taula sense pressió.",
          phrase: "«Quina textura més curiosa té avui la carbassa, oi? Mengem plegats.»"
        },
        {
          k: "C", t: "Retirar el plat de seguida pensant que aquesta verdura no li agradarà mai", s: "Conclusió precipitada",
          vincle: 0, reg: -3, calma: -2,
          react: "Perd l'oportunitat de familiaritzar-se amb el gust nou a través del joc.",
          neuro: "La ganyota inicial davant un gust nou és un reflex natural davant la novetat, no pas un rebuig definitiu.",
          phrase: "Tornar-ho a oferir amb calma més endavant obre el paladar sense pressa."
        }
      ]
    },
    {
      id: "01_mirada_mobil", stage: "0-1", stageLabel: "0-1 ANYS · PRESÈNCIA",
      title: "Balbotejos a l'estora mentre mires un missatge",
      body: "Estàs asseguda a l'estora amb el nadó. Et fa un somriure sonor mostrant-te un sonall just quan t'arriba una notificació al telèfon.",
      opts: [
        {
          k: "A", t: "Mirar la pantalla cinc minuts seguits amb cara neutra i sense parlar-li", s: "Desconnexió prolongada en ple intercanvi",
          vincle: -6, reg: -4, calma: -3,
          react: "Insisteix amb dos grunys més i després deixa anar el sonall una mica confós.",
          neuro: "Els estudis d'Ed Tronick ('Still Face') mostren que no cal estar connectats el 100% del temps, però sí reparar i avisar amb la veu quan apartem la mirada.",
          phrase: "Avisar amb la veu manté el fil de connexió mentre atens un assumpte breu."
        },
        {
          k: "B", t: "Sentir-te culpable per haver agafat el mòbil i prometre't no mirar-lo mai més", s: "Autoexigència irreal",
          vincle: +2, reg: 0, calma: -9,
          react: "Jugues amb ell però amb el cap ple de retrets cap a tu mateixa.",
          neuro: "Tronick va demostrar que les famílies amb aferrament segur només estan en sintonia perfecta un 30-40% del temps; la clau és tornar a connectar amb naturalitat.",
          phrase: "No necessites una presència perfecta, sinó estones reals de qualitat."
        },
        {
          k: "C", t: "Deixar el telèfon cap per avall deu minuts i respondre al seu balboteig com una conversa", s: "Intercanvi «servei i retorn»",
          vincle: +11, reg: +9, calma: +6,
          react: "S'il·lumina d'alegria i encadeneu quatre torns de sons i rialles còmplices.",
          neuro: "El Centre del Nen en Desenvolupament de Harvard anomena 'serve and return' aquest ping-pong de mirades i sons que teixeix l'arquitectura del llenguatge.",
          phrase: "«Ah sí? M'ensenyes aquest sonall de fusta? Quin so més bonic que fa!»"
        }
      ]
    },
    {
      id: "01_vuit_mesos_estrany", stage: "0-1", stageLabel: "8-10 MESOS · AFERRAMENT",
      title: "S'amaga al teu coll quan s'acosta un veí simpàtic",
      body: "Fins fa un mes somreia a tothom, però ara als nou mesos gira la cara i s'aferra a la teva samarreta quan el veí el saluda efusivament.",
      opts: [
        {
          k: "A", t: "Respectar el seu ritme: «Ara necessita observar des dels meus braços, hola bon dia!»", s: "Base segura per explorar l'entorn",
          vincle: +12, reg: +9, calma: +5,
          react: "Des de la seguretat de la teva espatlla, al cap d'un minut treu el caparró i dedica un mig somriure al veí.",
          neuro: "Cap als 8-9 mesos apareix la permanència de l'objecte i la prudència davant desconeguts: és una fita madurativa saludable que indica un bon vincle.",
          phrase: "«Pots mirar des d'aquí tan tranquil; quan et vingui de gust ja saludaràs.»"
        },
        {
          k: "B", t: "Passar-l'hi als braços del veí perquè «s'espavili i perdi la vergonya»", s: "Forçar la separació sense escalfament",
          vincle: -9, reg: -7, calma: -5,
          react: "S'angoixa i allarga els bracets cap a tu buscant tornar immediatament.",
          neuro: "La confiança social floreix quan l'infant comprova que els seus pares són un port segur on tornar sempre que ho necessita.",
          phrase: "Respectar la seva prudència avui construeix la seva seguretat social demà."
        },
        {
          k: "C", t: "Disculpar-te repetidament dient que s'ha tornat molt esquerp", s: "Posar una etiqueta davant d'altres",
          vincle: -2, reg: -2, calma: -4,
          react: "El veí li dóna més importància i tu et sents jutjada sense motiu.",
          neuro: "Normalitzar les etapes evolutives amb naturalitat educa també les persones del voltant.",
          phrase: "«Està en plena etapa d'observar primer des de prop.»"
        }
      ]
    },
    {
      id: "01_bany_massatge", stage: "0-1", stageLabel: "0-1 ANYS · RITUAL NOCTURN",
      title: "Sortir de la banyera quan fa fresca",
      body: "En treure el nadó de l'aigua tèbia per posar-li el bolquer i el pijama, es queixa incòmode pel canvi de temperatura.",
      opts: [
        {
          k: "A", t: "Vestir-lo a tota velocitat en silenci com una cursa d'obstacles", s: "Pressa mecànica",
          vincle: 0, reg: -3, calma: -5,
          react: "Els moviments ràpids el sorprenen i acaba el canvi tens.",
          neuro: "Per al nadó les cures quotidianes no són tràmits entre jocs: són el cor mateix del vincle (enfocament Emmi Pikler).",
          phrase: "Fer les mans lentes transforma la rutina en un massatge."
        },
        {
          k: "B", t: "Embolcallar-lo amb tovallola calenta i anticipar amb veu dolça cada màniga que poses", s: "Cura conscient i anticipació verbal",
          vincle: +11, reg: +10, calma: +6,
          react: "Escolta la teva veu cantarina, estira el bracet quan li ho anuncies i es relaxa per dormir.",
          neuro: "Emmi Pikler ensenya que parlar al nadó explicant què farem amb el seu cos fomenta la cooperació primerenca i el sentiment de dignitat.",
          phrase: "«Ara escalfem els peus i passem la mà dreta per la màniga suau... molt bé!»"
        },
        {
          k: "C", t: "Posar un vídeo al mòbil sobre el canviador perquè no es mogui", s: "Distracció amb pantalla abans de dormir",
          vincle: -4, reg: -8, calma: -3,
          react: "Es queda immòbil hipnotitzat, però la llum de prop el desvetlla just abans del llit.",
          neuro: "Abans dels 2 anys l'Organització Mundial de la Salut recomana zero pantalles, especialment en la finestra prèvia al son.",
          phrase: "El teu rostre i una cançoneta són el millor espectacle per a ell."
        }
      ]
    },
    {
      id: "01_cotxet_passeig", stage: "0-1", stageLabel: "0-1 ANYS · PASSEIG",
      title: "A mig passeig vol sortir del cotxet i veure món",
      body: "Sou a dos carrers de casa i el nadó comença a arquejar-se al cotxet perquè vol mirar els arbres i les façanes des de dalt.",
      opts: [
        {
          k: "A", t: "Accelerar el pas mirant el rellotge amb tensió pensant que tothom et mira", s: "Angoixa per la mirada aliena",
          vincle: -2, reg: -4, calma: -9,
          react: "Arribes a casa suada i amb el cor accelerat.",
          neuro: "La majoria de vianants o bé empatitzen perquè hi han passat o bé van immersos en els seus assumptes; alliberar-nos del públic imaginari baixa l'estrès.",
          phrase: "Respira fons: no està passant cap emergència, només té ganes de braços."
        },
        {
          k: "B", t: "Renunciar a sortir a passejar durant tota la setmana per por que es repeteixi", s: "Evitació que aïlla a casa",
          vincle: 0, reg: -2, calma: -7,
          react: "Passar molts dies tancats a casa redueix la llum solar i l'ànim adult.",
          neuro: "La llum natural matinal regula el ritme circadià tant del nadó com dels pares.",
          phrase: "Sortir preparats amb una motxilla ergonòmica al cistell dóna llibertat total."
        },
        {
          k: "C", t: "Aturar-te en un banc, passar-lo al portanadons ben a prop i tornar xino-xano mirant fulles", s: "Adaptació pràctica i contacte",
          vincle: +11, reg: +9, calma: +7,
          react: "En un minut observa els arbres encantat i acaba fent una becaina enganxat al teu pit.",
          neuro: "El porteig ergonòmic recrea el moviment del caminar i ofereix seguretat vestibular mentre t'allibera les mans.",
          phrase: "«Vine aquí a prop, mirem junts com es mouen les fulles amb el vent.»"
        }
      ]
    },
    {
      id: "01_comparacions_fites", stage: "0-1", stageLabel: "0-1 ANYS · DESENVOLUPAMENT",
      title: "«El fill de la meva amiga ja gateja des dels set mesos!»",
      body: "Al parc sents parlar d'altres nadons de la mateixa edat que ja fan coses diferents i t'entra el dubte de si el teu va al ritme que toca.",
      opts: [
        {
          k: "A", t: "Confiar en el moviment lliure a l'estora i recordar que cada infant té un calendari propi", s: "Respecte al ritme maduratiu",
          vincle: +9, reg: +9, calma: +10,
          react: "Gaudeixes veient com practica girar-se amb mestria i sense pressa.",
          neuro: "Les finestres motores saludables són amplíssimes; el moviment lliure al terra enforteix la musculatura profunda i la confiança corporal.",
          phrase: "Créixer no és una cursa: cada fita arriba quan el cos i el cervell estan a punt."
        },
        {
          k: "B", t: "Col·locar-lo en posicions que encara no assoleix per si sol durant hores per entrenar-lo", s: "Forçar postures abans d'hora",
          vincle: -2, reg: -5, calma: -6,
          react: "Es cansa de mantenir l'equilibri artificialment i es mostra frustrat a l'estora.",
          neuro: "Quan l'infant conquista una postura per iniciativa pròpia, sap tant entrar-hi com sortir-ne amb seguretat i harmonia.",
          phrase: "Oferir sòl ferm, roba còmoda i mirada confiada és el millor gimnàs."
        },
        {
          k: "C", t: "Passar una hora buscant fòrums a internet a mitjanit comparant taules", s: "Espiral de dubtes nocturns",
          vincle: 0, reg: 0, calma: -11,
          react: "Perds una hora valuosa de son per una variació totalment normal.",
          neuro: "Si tens un dubte concret, apunta'l per a la revisió de pediatria i regala't descans avui.",
          phrase: "Tanco el cercador i miro el meu fill real: està despert, curiós i connectat."
        }
      ]
    },
    {
      id: "01_casa_desendreçada", stage: "0-1", stageLabel: "0-1 ANYS · PRIORITATS",
      title: "Migdia amb roba per plegar i el nadó dormint",
      body: "El nadó acaba d'adormir-se per fer una migdiada de quaranta minuts. Al sofà hi ha una muntanya de roba neta i tu tens els ulls pesants.",
      opts: [
        {
          k: "A", t: "Posar-te a fregar i plegar a tota pressa sense seure ni un segon", s: "Prioritzar la casa perfecta al descans",
          vincle: 0, reg: 0, calma: -10,
          react: "Quan es desperta, la cuina brilla però tu estàs esgotada per a tota la tarda.",
          neuro: "La privació de descans redueix la finestra de tolerància emocional de l'adult molt més que veure tres samarretes sense plegar.",
          phrase: "Una casa viscuda amb adults descansats és molt més amable que una revista amb adults al límit."
        },
        {
          k: "B", t: "Estirar-te vint minuts amb una infusió o tancar els ulls mentre dorm", s: "Autocura bàsica prioritària",
          vincle: +6, reg: +5, calma: +14,
          react: "Aquesta petita pausa et renova l'energia i el reps amb un gran somriure quan es desperta.",
          neuro: "Vint minuts de repòs horitzontal redueixen el to simpàtic i restauren la capacitat d'atenció serena.",
          phrase: "«La roba pot esperar; la meva energia per a aquesta tarda és prioritària.»"
        },
        {
          k: "C", t: "Quedar-te dreta al mig del passadís sense descansar ni recollir, atabalada per tot el que falta", s: "Bloqueig per llista mental",
          vincle: 0, reg: -1, calma: -8,
          react: "Passa l'estona sense ni haver descansat ni haver avançat res.",
          neuro: "Escollir conscientment descansar treu el pes de la indecisió i converteix la pausa en reparadora.",
          phrase: "Trio descansar vint minuts sense cap recança."
        }
      ]
    },
    {
      id: "01_primer_refredat", stage: "0-1", stageLabel: "0-1 ANYS · CURA I CALMA",
      title: "Primera nit amb mocs i son lleuger",
      body: "Té el nasset tapat i es desperta sovint incòmode perquè li costa respirar estirat del tot.",
      opts: [
        {
          k: "A", t: "Mantenir l'ambient tranquil, netejar amb sèrum amb dolçor i incorporar-lo als braços una estona", s: "Cura calmada i consol físic",
          vincle: +11, reg: +9, calma: +5,
          react: "Nota la teva calma, respira millor una mica incorporat i torna a agafar el son.",
          neuro: "Quan un nadó es troba moix, la calma dels pares actua com a termòstat emocional que redueix la seva incomoditat.",
          phrase: "«Ja està, carinyo, respirem a poc a poc aquí juntets.»"
        },
        {
          k: "B", t: "Transmetre molta alarma amb moviments bruscos i llums forts a cada esternut", s: "Contagi de neguit nocturn",
          vincle: +2, reg: -6, calma: -10,
          react: "S'espanta per l'enrenou i es desvetlla del tot durant una hora.",
          neuro: "La «referència social» fa que el nadó miri la cara de l'adult per saber si el que sent és perillós o assumible.",
          phrase: "Moviments suaus, llum tènue i veu confiada."
        },
        {
          k: "C", t: "Enfadar-se amb la nit perquè demà teníeu plans matinals", s: "Resistència al canvi de plans",
          vincle: -3, reg: -3, calma: -8,
          react: "La frustració pel pla perdut fa que la nit es faci el doble de llarga.",
          neuro: "Acceptar d'entrada que demà serà un dia lent de manta i sofà allibera d'una gran part de la tensió.",
          phrase: "«Demà simplificarem l'agenda i ens cuidarem a ritme lent.»"
        }
      ]
    },
    {
      id: "01_joc_terra_lliure", stage: "0-1", stageLabel: "6-11 MESOS · CONCENTRACIÓ",
      title: "Concentrat deu minuts amb una cullera de fusta i un bol",
      body: "El nadó està fascinat picant i girant una cullera de fusta dins d'un bol metàl·lic. Està en silenci total, molt concentrat.",
      opts: [
        {
          k: "A", t: "Interrompre'l per ensenyar-li tres joguines noves més vistoses", s: "Trencar l'atenció sostinguda",
          vincle: +1, reg: -6, calma: 0,
          react: "Perd el fil del que investigava i dispersa la mirada entre massa objectes.",
          neuro: "Maria Montessori i Emmi Pikler destaquen que l'atenció profunda neix en aquests moments d'exploració lliure; protegir-los sense interrompre és un regal.",
          phrase: "Quan un infant està concentrat explorant, el millor acompanyament és una presència silenciosa."
        },
        {
          k: "B", t: "Observar en silenci amb un somriure tranquil mentre tu prens un te a prop", s: "Presència serena que respecta el flux",
          vincle: +9, reg: +12, calma: +10,
          react: "Investiga sons i pesos durant un quart d'hora, et mira un segon per compartir-ho i continua jugant.",
          neuro: "Sentir-se acompanyat sense ser dirigit alimenta la motivació intrínseca i la capacitat de concentració futura.",
          phrase: "(Una mirada càlida d'aprovació silenciosa quan et busca amb els ulls)."
        },
        {
          k: "C", t: "Agafar-li la cullera per demostrar-li «com s'ha de fer bé»", s: "Dirigir el joc lliure",
          vincle: -1, reg: -5, calma: -1,
          react: "Deixa d'interessar-li l'objecte perquè ja no n'és el protagonista.",
          neuro: "Per al cervell infantil, descobrir la causa-efecte per si mateix val molt més que imitar una demostració adulta.",
          phrase: "Deixem que les seves mans facin les seves pròpies descobertes."
        }
      ]
    },
    {
      id: "01_cotxe_viatge", stage: "0-1", stageLabel: "0-1 ANYS · DESPLAÇAMENTS",
      title: "Trajecte en cotxe quan s'avorreix a la cadireta",
      body: "Queden deu minuts per arribar a casa i el nadó comença a queixar-se a la cadireta de seguretat perquè ja està cansat d'anar lligat.",
      opts: [
        {
          k: "A", t: "Conduir amb pressa o estrès mirant tota l'estona pel retrovisor", s: "Tensió al volant",
          vincle: -1, reg: -4, calma: -10,
          react: "Augmenta l'estrès a l'habitacle i els deu minuts semblen eterns.",
          neuro: "La seguretat viària i la teva respiració pausada són el primer: la veu és un pont real quan les mans són al volant.",
          phrase: "Primer la seguretat i la veu tranquil·la."
        },
        {
          k: "B", t: "Cantar la seva cançó preferida amb ritme suau i parlar-li explicant que ja arribeu", s: "Pont sonor d'acompanyament",
          vincle: +9, reg: +8, calma: +6,
          react: "Reconeix la melodia familiar, fa pauses per escoltar-te i arribeu a casa molt més serens.",
          neuro: "El cervell auditiu reconeix la prosòdia materna i paterna com a senyal de proximitat física encara que no hi hagi contacte directe.",
          phrase: "«Sóc aquí davant amb tu, amor; cantem la cançó del sol mentre arribem a casa.»"
        },
        {
          k: "C", t: "Cridar des del seient de davant perquè calli", s: "Augmentar el volum de tensió",
          vincle: -8, reg: -6, calma: -9,
          react: "S'altera molt més en sentir un to fort sense veure't la cara.",
          neuro: "Un to greu, rítmic i previsible disminueix la freqüència cardíaca a tots dos costats del cotxe.",
          phrase: "Baixar el volum de la nostra veu convida a la calma."
        }
      ]
    },
    {
      id: "01_comiat_escoleta", stage: "0-1", stageLabel: "9-12 MESOS · ADAPTACIÓ",
      title: "Primeres setmanes de comiat amb l'educadora o els avis",
      body: "Arriba el moment de dir adéu una estona al matí. Quan veu que li dones la bossa a l'educadora o a l'àvia, allarga els braços cap a tu.",
      opts: [
        {
          k: "A", t: "Marxar d'amagat aprofitant que mira una joguina sense dir adéu", s: "Escapada silenciosa",
          vincle: -10, reg: -7, calma: -4,
          react: "Quan es gira i no et veu, es queda molt intranquil i l'endemà vigila cada segon que no desapareguis.",
          neuro: "Marxar sense acomiadar-se genera hipervigilància perquè l'infant no sap quan pot desaparèixer la seva figura de referència.",
          phrase: "Un comiat clar i afectuós construeix predictibilitat i confiança."
        },
        {
          k: "B", t: "Quedar-te vint minuts a la porta dubtant amb cara d'angúnia, entrant i sortint tres cops", s: "Comiat ambivalent que transmet inseguretat",
          vincle: +1, reg: -6, calma: -9,
          react: "Llegeix a la teva cara que potser aquell lloc no és segur i costa molt més fer el pas.",
          neuro: "Quan l'adult transmet confiança sincera cap al cuidador que el rep, l'infant agafa prestada aquesta confiança.",
          phrase: "Comiat breu, càlid, segur i sempre previsible."
        },
        {
          k: "C", t: "Fer un ritual curt de petó, lliurar-lo a braços coneguts amb somriure serè i dir que tornaràs després de dinar", s: "Ritual previsible i vincle pont",
          vincle: +11, reg: +10, calma: +6,
          react: "Protesta un minutet als braços de qui el cuida, però es calma aviat confiant en el teu retorn.",
          neuro: "Els rituals curts i idèntics cada dia ajuden el cervell infantil a anticipar tant el comiat com el retrobament segur.",
          phrase: "«Et quedes ben cuidat jugant aquí i després de dinar vinc a buscar-te. Un petó gran!»"
        }
      ]
    },
    {
      id: "01_despertar_matiner", stage: "0-1", stageLabel: "0-1 ANYS · MATINS LENTS",
      title: "6:10 del matí: desperta xerrant feliç i ple d'energia",
      body: "Fora tot just clareja i el nadó ja fa palmes i xerra animadament al llitet mentre tu encara voldries mitja hora més de manta.",
      opts: [
        {
          k: "A", t: "Mantenir llum tènue, portar-lo a prop amb una joguina tova segura i fer un despertar lent horitzontal", s: "Transició suau per a tots dos",
          vincle: +9, reg: +7, calma: +10,
          react: "Juga tranquil·lament amb el drapet al teu costat durant vint minuts mentre acabes de despertar el cos.",
          neuro: "Mantenir una atmosfera tranquil·la a primera hora regala un inici del dia sense pics bruscos de cortisol.",
          phrase: "«Bon dia, matiner! Ens desperezarem a poquet a poc abans d'esmorzar.»"
        },
        {
          k: "B", t: "Aixecar-te d'un salt de mal humor encenent tots els llums i resopegant", s: "Inici brusc i irritat",
          vincle: -3, reg: -2, calma: -8,
          react: "Comences el matí ja tensa abans ni de fer el cafè.",
          neuro: "Els primers deu minuts del matí marquen sovint el to del sistema nerviós de les hores següents.",
          phrase: "Moviments lents fins que l'esmorzar sigui a punt."
        },
        {
          k: "C", t: "Posar vídeos ràpids per guanyar mitja hora", s: "Pantalla matinal primerenca",
          vincle: -3, reg: -7, calma: -2,
          react: "Després costa molt arrencar el joc tranquil del matí.",
          neuro: "Un cistellet amb tres objectes quotidians segurs entretén la curiositat matinal de forma orgànica.",
          phrase: "El cistell dels tresors matinal és l'aliat dels matins primerencs."
        }
      ]
    },
    {
      id: "01_tallar_ungles_cura", stage: "0-1", stageLabel: "0-1 ANYS · HIGIENE TRANQUIL·LA",
      title: " Posar el jersei pel cap sense que li molesti",
      body: "Cada vegada que li passes una samarreta tancada pel cap, el nadó s'inquieta perquè deixa de veure-hi un instant i li estreny les orelles.",
      opts: [
        {
          k: "A", t: "Fer-ho d'una estrebada ràpida sense avisar perquè passi de pressa", s: "Sorpresa incòmoda",
          vincle: -4, reg: -4, calma: -3,
          react: "S'espanta cada vegada que veu acostar-se una samarreta.",
          neuro: "L'associació repetida d'una rutina amb sorpresa brusca crea resistència anticipada als 1-2 anys.",
          phrase: "Convertir el gest en joc previsible canvia tota l'experiència."
        },
        {
          k: "B", t: "Eixamplar bé el coll amb les teves mans i fer «cu-cut, on és?» en sortir la carona", s: "Cura amable i joc de «cu-cut»",
          vincle: +10, reg: +9, calma: +6,
          react: "Riu cada cop que reapareixes fent «cu-cut!» i el moment de vestir-se es torna alegre.",
          neuro: "El joc del cu-cut transforma una breu pèrdua visual en plaer d'anticipació i seguretat.",
          phrase: "«Obro bé la finestra del jersei... un, dos i... cu-cut, ja ets aquí!»"
        },
        {
          k: "C", t: "Enfadar-te perquè mou el cap i els braços", s: "Exigir quietud d'adult a un nadó",
          vincle: -6, reg: -4, calma: -6,
          react: "Tots dos acabeu incòmodes abans de sortir al carrer.",
          neuro: "El moviment constant és la manera natural d'estar al món d'un nadó sa.",
          phrase: "Mans àmplies, veu juganera i roba còmoda."
        }
      ]
    },
    {
      id: "01_espai_propi_mare", stage: "0-1", stageLabel: "0-1 ANYS · AUTOCURA ADULTA",
      title: "Sortir una hora a fer ioga o passejar tota sola",
      body: "La teva parella es queda encantada amb el nadó perquè vagis una hora a estirar l'esquena o fer un te tranquil·la, però a la porta et ve una punxada de dubte.",
      opts: [
        {
          k: "A", t: "Quedar-te a casa pensant que si marxes una hora no ets prou dedicada", s: "Renúncia sistemàtica per autoexigència",
          vincle: 0, reg: -1, calma: -11,
          react: "Perds l'espai d'oxigenació i al final de la setmana notes les espatlles molt carregades.",
          neuro: "Cuidar la cuidadora no resta res al nadó; al contrari, permet tornar amb presència fresca i també enforteix el vincle exclusiu de l'altre progenitor.",
          phrase: "Regalar espai a l'altre adult també és fer créixer la família."
        },
        {
          k: "B", t: "Sortir però escriure deu missatges cada cinc minuts donant instruccions de tot", s: "Control remot sense desconnectar",
          vincle: +1, reg: 0, calma: -6,
          react: "Ni tu desconnectes de debò ni la parella sent confiança per trobar la seva pròpia manera de calmar-lo.",
          neuro: "Cada figura d'aferrament construeix el seu propi ball i codi de calma amb el nadó quan té espai i confiança.",
          phrase: "Confio plenament en el nostre equip i desconnecto aquesta estona."
        },
        {
          k: "C", t: "Acomiadar-te amb afecte, gaudir plenament de la teva hora de calma i tornar renovada", s: "Confiança d'equip i recàrrega real",
          vincle: +10, reg: +8, calma: +16,
          react: "Tornes amb l'esquena lleugera i un somriure autèntic, i els trobes ben compenetrats.",
          neuro: "El benestar matern i patern és el predictor més directe d'una llar serena i responsiva.",
          phrase: "«Gaudiu molt de la vostra estona junts! Torno d'aquí a una horeta ben renovada.»"
        }
      ]
    },

    // ==================== ETAPA 1-3 ANYS (17 ESCENES) ====================
    {
      id: "13_got_blau", stage: "1-3", stageLabel: "2 ANYS · EMOCIONS GRANS",
      title: "El drama del got del color «equivocat»",
      body: "Li serveixes aigua al got verd que ell mateix havia demanat fa deu segons, però ara s'asseu a terra desconsolat perquè volia el got blau.",
      opts: [
        {
          k: "A", t: "«Va, no t'enfadis per aquesta fotesa, l'aigua té el mateix gust!»", s: "Racionalitzar en ple desbordament",
          vincle: -5, reg: -3, calma: -4,
          react: "Protesta encara més fort perquè sent que ningú entén el seu disgust.",
          neuro: "Als 2 anys el cervell racional es desconnecta durant una emoció forta. Sovint el got només és l'espurna per descarregar el cansament del dia.",
          phrase: "Primer connectem amb el sentiment, després ja vindrà la raó."
        },
        {
          k: "B", t: "Córrer amb neguit a fregar el got blau perquè calli a l'instant", s: "Evitar qualsevol petita frustració",
          vincle: +2, reg: -6, calma: -6,
          react: "Es calma tres segons, però tot seguit demana canviar també el plat i el pitet.",
          neuro: "Acompanyar petites frustracions quotidianes amb tendresa li ensenya que el malestar ve, s'escolta i passa sense perill.",
          phrase: "Podem validar el desig sense haver de canviar tota la cuina."
        },
        {
          k: "C", t: "Ajupir-te a la seva alçada, posar paraules al disgust amb veu suau i mantenir la calma", s: "Connexió empàtica i límit serè",
          vincle: +11, reg: +10, calma: +4,
          react: "S'abraça a tu uns segons, fa un sospir llarg i acaba bevent un glop del got verd.",
          neuro: "Co-regulació (Dan Siegel): el teu sistema nerviós tranquil li presta la calma que la seva escorça prefrontal encara està construint.",
          phrase: "«Volies el got blau i t'ha sabut greu. Soc aquí amb tu; quan vulguis, l'aigua t'espera.»"
        }
      ]
    },
    {
      id: "13_sabates_pluja", stage: "1-3", stageLabel: "3 ANYS · PRESSA DEL MATÍ",
      title: "8:15 del matí: vol sortir amb sandàlies sota la pluja",
      body: "Arribeu justos de temps i s'entesta a posar-se les sandàlies d'estiu mentre a fora plou i fa fresca.",
      opts: [
        {
          k: "A", t: "«Plou i toca botes. Vols posar-te tu el peu dret o fem que les botes parlin com granotes?»", s: "Límit clar amb joc i elecció acotada",
          vincle: +10, reg: +11, calma: +5,
          react: "Riu quan fas veure que la bota fa 'croac' i hi fica el peu tot orgullós.",
          neuro: "El joc segrega oxitocina i dopamina, desactivant la resistència en segons sense cedir en el límit de cura.",
          phrase: "«Les sandàlies es queden guardant l'habitació; tries mitjons de ratlles o d'estrelles per a les botes?»"
        },
        {
          k: "B", t: "Calçar-lo amb presses i males cares mentre s'esmuny pel passadís", s: "Estira-i-arronsa matinal",
          vincle: -7, reg: -4, calma: -9,
          react: "Sortiu per la porta tots dos accelerats i amb sensació de batalla matinal.",
          neuro: "Entre l'any i els tres anys la necessitat d'autonomia és intensa; donar micro-eleccions dins del límit li retorna sensació d'agència.",
          phrase: "Dues opcions vàlides transformen el «no!» en col·laboració."
        },
        {
          k: "C", t: "Deixar-lo sortir amb sandàlies sota l'aiguat per cansament", s: "Cedir en salut per evitar el moment",
          vincle: -2, reg: -2, calma: -6,
          react: "Al cap d'una cantonada té els peus molls i freds i heu de recular cap a casa.",
          neuro: "Els límits de salut i seguretat corresponen als adults; sostenir-los amb bon humor dóna seguretat a l'infant.",
          phrase: "«La meva feina és cuidar que els teus peus vagin secs i calentons.»"
        }
      ]
    },
    {
      id: "13_jo_sol_jaqueta", stage: "1-3", stageLabel: "2-3 ANYS · AUTONOMIA",
      title: "«Jo sol, jo sol!» amb la cremallera difícil",
      body: "Intenta cordar-se la cremallera de l'abric tot sol. No encaixa la peça metàl·lica, s'enfada, però s'aparta si intentes fer-ho per ell.",
      opts: [
        {
          k: "A", t: "Agafar-li l'abric i cordar-l'hi ràpid dient que ja fem tard", s: "Substituir el seu intent",
          vincle: -5, reg: -5, calma: -5,
          react: "Es treu l'abric enfadat per tornar a començar des de zero i perdeu més temps.",
          neuro: "Interrompre el desig de «jo sol» frustra l'impuls natural de competència; bastir una petita ajuda li permet reeixir.",
          phrase: "Un petit truc compartit estalvia deu minuts de lluita."
        },
        {
          k: "B", t: "Oferir-li la bastida justa: «Jo enganxo el trenet de baix i tu el fas pujar fins a dalt del tot!»", s: " Bastida evolutiva (Vygotsky)",
          vincle: +10, reg: +11, calma: +6,
          react: "Accepta el tracte encantat, estira la cremallera fins al coll i exclama: «Ho he fet!».",
          neuro: "La 'zona de desenvolupament proper' consisteix a facilitar només el mil·límetre que encara no pot fer perquè l'èxit final sigui seu.",
          phrase: "«Equip de dos: jo preparo l'inici de la via i tu condueixes el tren cap amunt!»"
        },
        {
          k: "C", t: "Quedar-te mirant el rellotge sospirant fort mentre s'encalla una vegada i una altra", s: "Impaciència silenciosa sense guia",
          vincle: -3, reg: -4, calma: -6,
          react: "Nota la teva pressa, es posa més nerviós i acaba llançant la jaqueta.",
          neuro: "La motricitat fina sota pressió es bloqueja; un to tranquil i dividir la tasca en dos passos l'allibera.",
          phrase: "Dividir un repte gran en un pas fàcil li dóna confiança."
        }
      ]
    },
    {
      id: "13_passadis_super", stage: "1-3", stageLabel: "2 ANYS · BOTIGUES I DESIG",
      title: "Al supermercat vol tres caixes de galetes amb dibuixos",
      body: "Passant pel passadís, veu una caixa amb el seu personatge favorit i no la vol deixar anar de cap manera.",
      opts: [
        {
          k: "A", t: "Renyar-lo en veu alta preocupada pel que pensaran els altres compradors", s: "Tensió per la mirada externa",
          vincle: -7, reg: -5, calma: -9,
          react: "L'escena es fa més sorollosa i acabes la compra amb malestar.",
          neuro: "Els envasos infantils estan dissenyats per captar l'atenció impulsiva d'un cervell de 2 anys; el seu desig és completament normal.",
          phrase: "Oblida el públic del passadís i centra't només en el teu petit."
        },
        {
          k: "B", t: "Validar que el dibuix és preciós, fer-li dir adéu a la caixa i donar-li la missió de triar les pomes", s: "Validar el desig en fantasia i donar rol actiu",
          vincle: +10, reg: +10, calma: +6,
          react: "Saluda el personatge de la caixa i s'engresca buscant les quatre pomes més vermelles per posar a la bossa.",
          neuro: "Adele Faber explica que reconèixer el desig amb entusiasme ('Que xulo aquest dibuix!') calma la meitat de la frustració sense necessitat de comprar-ho.",
          phrase: "«Ooh, quin gatet més simpàtic té aquesta caixa! Diguem-li adéu i ajuda'm a triar les millors pomes!»"
        },
        {
          k: "C", t: "Posar la caixa al carro avui «només per tenir pau» tot i haver dit que no tres vegades", s: "Cedir després d'haver dit que no",
          vincle: 0, reg: -8, calma: -4,
          react: "Aprèn que un «no» es converteix en «sí» si insisteix prou fort al supermercat.",
          neuro: "Si vols dir que sí algun dia, digues-ho d'entrada; si dius que no, mantén-ho amb dolçor i coherència.",
          phrase: "Coherència tranquil·la avui és serenor en totes les compres futures."
        }
      ]
    },
    {
      id: "13_joguina_parc", stage: "1-3", stageLabel: "2 ANYS · COMPARTIR",
      title: "«És meva!» amb la seva galleda al sorral",
      body: "Un altre infant s'acosta per agafar la galleda que el teu fill acaba de portar de casa i ell l'abraça fort dient «meva!».",
      opts: [
        {
          k: "A", t: "Obligar-lo a donar-la al moment: «Sigues bon nen i deixa-li ara mateix!»", s: "Forçar a compartir abans de madurar",
          vincle: -7, reg: -5, calma: -4,
          react: "Se sent desprotegit i agafa aversió a portar res al parc.",
          neuro: "Als 2 anys estan construint la noció del 'jo' i del 'meu'; compartir de debò neix cap als 4 anys quan senten que el seu dret d'ús és respectat.",
          phrase: "Respectar els torns llargs ensenya molta més generositat que forçar a cedir."
        },
        {
          k: "B", t: "Traduir l'escena amb calma: «Ara la fa servir ell; quan acabi d'omplir aquest pastís et fem un torn o mirem aquesta pala»", s: "Protegir el torn i oferir alternativa",
          vincle: +10, reg: +10, calma: +6,
          react: "En veure que no l'hi prenen a la força, relaxa els braços i dos minuts després ofereix ell mateix un motlle!",
          neuro: "Quan un infant sent que l'adult garanteix el seu torn sense pressió, baixa la defensa i s'obre espontàniament a l'altre.",
          phrase: "«Ara acabes el teu castell i tot seguit farem un torn. Mirem quines petxines hi ha aquí!»"
        },
        {
          k: "C", t: "Marxar del sorral enfadada dient que no sap jugar amb altres nens", s: "Retirada i etiqueta",
          vincle: -6, reg: -5, calma: -6,
          react: "Perd l'ocasió de practicar la convivència guiada amb altres infants.",
          neuro: "El joc en paral·lel (jugar al costat sense compartir encara) és l'etapa evolutiva pròpia dels 18 als 30 mesos.",
          phrase: "A aquesta edat som els seus intèrprets socials amables."
        }
      ]
    },
    {
      id: "13_cullera_terra", stage: "1-3", stageLabel: "18 MESOS · GRAVETAT I LÍMITS",
      title: "Deixa caure els macarrons a terra mirant-te fixament",
      body: "Ja ha menjat la meitat del plat i ara agafa un macarró, estira el braç fora de la trona i el deixa caure mirant què passa.",
      opts: [
        {
          k: "A", t: "Llegir el senyal que ja està tip: retirar el plat amb serenor dient «Veig que ja no tens més gana, baixem a jugar»", s: "Límit pràctic sense teatre emocional",
          vincle: +9, reg: +11, calma: +7,
          react: "Baixa de la trona content d'anar a jugar amb cubs a l'estora i s'acaba el llançament.",
          neuro: "Als 18 mesos un infant que ja s'ha saciat passa a fer física experimental amb el menjar; tancar l'àpat amb naturalitat posa el límit sense càstig.",
          phrase: "«El menjar és per a la panxa o es queda al plat. Com que ja has acabat, anem a fer torres amb fustes!»"
        },
        {
          k: "B", t: "Fer una gran exclamació dramàtica cada cop que cau un macarró", s: "Convertir-ho involuntàriament en joc de reacció",
          vincle: +1, reg: -7, calma: -7,
          react: "Li fa molta gràcia la teva cara de sorpresa i en tira quatre més seguits.",
          neuro: "Per a un cervell curiós d'un any i mig, una reacció intensa de l'adult és un espectacle fascinant de causa i efecte.",
          phrase: "Resposta neutra, breu i acció tranquil·la."
        },
        {
          k: "C", t: "Renyar-lo dient que és un malbaratador", s: "Sermó moral incomprensible a l'any i mig",
          vincle: -5, reg: -3, calma: -6,
          react: "No entén el discurs abstracte i s'inquieta pel teu to sever.",
          neuro: "En lloc de discursos llargs, als 1-2 anys funcionen frases curtes en positiu i accions serenes.",
          phrase: "Poques paraules i gestos tranquils."
        }
      ]
    },
    {
      id: "13_bolquer_ritme", stage: "1-3", stageLabel: "2-3 ANYS · MADURESA",
      title: "Comentaris sobre treure el bolquer perquè «arriba el bon temps»",
      body: "Comença a fer calor i et pregunten si ja li trauràs el bolquer, però observes que encara no avisa ni mostra interès per l'orinal.",
      opts: [
        {
          k: "A", t: "Treure-l'hi demà mateix asseient-lo cada vint minuts amb rellotge encara que s'hi resisteixi", s: "Entrenament dirigit sense senyals de maduresa",
          vincle: -5, reg: -6, calma: -10,
          react: "Passeu dies de tensió mirant el terra i ell agafa rebuig a seure a l'orinal.",
          neuro: "El control d'esfínters depèn de la mielinització neurològica, no de l'estació de l'any ni de l'entrenament forçat.",
          phrase: "El control d'esfínters no s'ensenya: s'acompanya quan madura."
        },
        {
          k: "B", t: "Deixar l'orinal accessible i contes a la vista, i esperar un parell de mesos fins a veure senyals clars d'interès", s: "Observació respectuosa de la maduresa",
          vincle: +10, reg: +10, calma: +9,
          react: "Quan el seu cos està preparat unes setmanes després, el procés flueix en pocs dies amb orgull i sense lluites.",
          neuro: "Respectar els senyals fisiològics i emocionals protegeix l'autoestima corporal i evita retencions per estrès.",
          phrase: "«Quan el seu cos estigui a punt farem el pas amb tota la confiança.»"
        },
        {
          k: "C", t: "Comparar-lo davant seu amb el cosinet que ja no en porta", s: "Comparació que genera inseguretat",
          vincle: -7, reg: -5, calma: -4,
          react: "Se sent menys vàlid per una funció biològica que encara no controla voluntàriament.",
          neuro: "Les comparacions mai acceleren la maduració nerviosa; només afegeixen pressió emocional.",
          phrase: "Cada infant fa el seu propi camí al seu temps."
        }
      ]
    },
    {
      id: "13_conte_repetit", stage: "1-3", stageLabel: "2-3 ANYS · HORA D'ANAR A DORMIR",
      title: "«Una altra vegada el mateix conte, sisplau!»",
      body: "És la dotzena nit seguida que tria exactament el mateix llibre d'animals i quan l'acabes demana repetir-lo.",
      opts: [
        {
          k: "A", t: "Pactar abans d'obrir-lo: «El llegim dues vegades ben arraulits i després apaguem el llumet»", s: "Ritual previsible amb límit acordat",
          vincle: +10, reg: +10, calma: +6,
          react: "Completa ell mateix l'última paraula de cada pàgina encantat i tanca ell el llibre al final de la segona lectura.",
          neuro: "La repetició del mateix conte dóna al cervell de 2-3 anys una sensació profunda d'ordre, domini del llenguatge i seguretat abans del son.",
          phrase: "«Aquest conte ens encanta! Fem la segona volta xiuxiuejant fluixet i després a dormir.»"
        },
        {
          k: "B", t: "Amagar el conte perquè ja n'estàs tipa i imposar-ne un altre a última hora", s: "Canvi inesperat del ritual nocturn",
          vincle: -5, reg: -5, calma: -5,
          react: "Es desvetlla reclamant el seu conte conegut i costa molt més tancar el dia.",
          neuro: "Al vespre els infants busquen allò familiar i previsible; deixa els llibres nous per a les tardes despertes.",
          phrase: "La predictibilitat nocturna és el millor pont cap al son."
        },
        {
          k: "C", t: "Llegir-lo sis vegades seguides fins que tu t'enfades i tanques el llibre de cop", s: "Manca de límit clar d'entrada",
          vincle: -4, reg: -5, calma: -8,
          react: "Un moment preciós de lectura acaba amb mal regust per no haver marcat el marc abans.",
          neuro: "Anticipar quantes lectures farem abans de començar evita negociacions quan tots dos ja teniu son.",
          phrase: "Acordar el marc amb dolçor des del principi cuida el final del dia."
        }
      ]
    },
    {
      id: "13_rentar_dents", stage: "1-3", stageLabel: "2 ANYS · JOC I SALUT",
      title: "Tanca la boca ben forta davant el raspall de dents",
      body: "Toca rentar les dents després de sopar, però prem els llavis i mou el cap dient que no amb un somriure murri.",
      opts: [
        {
          k: "A", t: "Deixar-ho córrer tota la setmana per no tenir discussió", s: "Abandonar l'hàbit de salut",
          vincle: 0, reg: -4, calma: -2,
          react: "Es perd la rutina diària i després costa més reprendre-la.",
          neuro: "Els hàbits de salut es consoliden quan són constants però viscuts amb calidesa i joc.",
          phrase: "Constància amable cada vespre."
        },
        {
          k: "B", t: "Forçar l'obertura amb tensió i pressa", s: "Associació incòmoda amb la higiene",
          vincle: -8, reg: -5, calma: -7,
          react: "L'endemà només veure el raspall ja marxa corrents del bany.",
          neuro: "La zona oral és molt sensible; el joc cooperatiu evita resistències defensives.",
          phrase: "Quan el joc entra al bany, la tensió surt per la porta."
        },
        {
          k: "C", t: "Jugar a buscar «on s'han amagat els trossets de truita» o deixar que ell et raspalli primer a tu", s: "Cooperació lúdica i reciprocitat",
          vincle: +11, reg: +10, calma: +6,
          react: "Obre una boca gegant de lleó rient perquè busquis per les dents de dalt i de baix!",
          neuro: "Lawrence Cohen ('Playful Parenting') mostra que invertir rols dos segons o afegir fantasia converteix la rutina en connexió.",
          phrase: "«A veure si veig aquell macarró amagat darrere el queixal... uau, quina boca de lleó més neta!»"
        }
      ]
    },
    {
      id: "13_torre_cau", stage: "1-3", stageLabel: "2-3 ANYS · FRUSTRACIÓ EN EL JOC",
      title: "La torre de fusta cau quan posava l'última peça",
      body: "Estava construint una torre altíssima amb molta il·lusió, tremola la darrera fusta, cau tot i es posa a rondinar molt frustrat.",
      opts: [
        {
          k: "A", t: "Construir-li tu ràpidament una torre encara més alta perquè no s'enfadi", s: "Resoldre el repte per ell",
          vincle: +1, reg: -6, calma: 0,
          react: "Mira la teva torre sense gaire entusiasme perquè volia haver-la aixecat ell.",
          neuro: "Quan rescatem massa de pressa, interrompem el cicle d'assaig, frustració tolerable i superació personal.",
          phrase: "Acompanyar sense envair fa créixer la confiança."
        },
        {
          k: "B", t: " Reflectir l'emoció amb empatia: «Ostres, era altíssima i ha caigut de cop! Quina ràbia fa quan passa!»", s: "Mirall emocional que valida l'esforç",
          vincle: +10, reg: +11, calma: +5,
          react: "Assenteix amb el cap, bufa fort i torna a agafar la base gran per començar de nou.",
          neuro: "Posar nom a l'emoció ('Name it to tame it', Dan Siegel) redueix l'activació emocional i allibera energia per tornar-ho a intentar.",
          phrase: "«Ha fet un bon estrèpit! Vols que aguantem junts la primera pedra ben ampla?»"
        },
        {
          k: "C", t: "Dir-li: «Ja t'havia dit que posessis les peces grans a sota!»", s: "Lliçó teòrica en ple disgust",
          vincle: -5, reg: -4, calma: -3,
          react: "Deixa les fustes de banda i ja no vol continuar jugant.",
          neuro: "El «ja t'ho deia jo» tanca la curiositat; una pregunta oberta quan ja s'ha calmat l'obre.",
          phrase: "Primer empatia; els trucs d'arquitectura vénen després jugant."
        }
      ]
    },
    {
      id: "13_aigua_banyera", stage: "1-3", stageLabel: "2 ANYS · EXPLORACIÓ I LÍMITS",
      title: "Xipolleig alegre que comença a mullar tot el bany",
      body: "S'ho passa d'allò més bé abocant gots d'aigua, però ara comença a llançar aigua fora de la banyera amb molta energia.",
      opts: [
        {
          k: "A", t: "Treure'l de cop de la banyera enfadada sense cap avís previ", s: "Tall brusc sense oportunitat d'ajust",
          vincle: -5, reg: -4, calma: -6,
          react: "Plora desconcertat amb sabó als cabells i el bany queda igualment moll.",
          neuro: "Un avís clar en positiu li dóna l'oportunitat d'aprendre on és la frontera abans d'acabar l'activitat.",
          phrase: "Dir on SÍ que va l'aigua orienta el cervell infantil."
        },
        {
          k: "B", t: "Deixar que inundi mig passadís sense dir res per no tallar-li el joc", s: "Absència de límit pràctic",
          vincle: +1, reg: -6, calma: -9,
          react: "Després et toca eixugar amb tres tovalloles quan ja estaves cansada.",
          neuro: "Els límits clars cuiden també l'energia dels adults i eviten el ressentiment posterior.",
          phrase: "Cuidar l'espai comú fa el joc sostenible."
        },
        {
          k: "C", t: "Indicar en positiu: «L'aigua viu dins de la banyera! Fem pluja a sobre del vaixell o de les teves cames?»", s: "Redirecció positiva de l'impuls",
          vincle: +10, reg: +10, calma: +6,
          react: "Dirigeix la pluja del got cap al vaixell de goma ben content i el terra es manté sec.",
          neuro: "Al cervell petit li costa processar el 'NO tiris' (veu la imatge de tirar); dir-li què SÍ pot fer redirigeix l'acció immediatament.",
          phrase: "«Dins la banyera tanta cascada com vulguis; fora, sec com el desert!»"
        }
      ]
    },
    {
      id: "13_canvi_activitat", stage: "1-3", stageLabel: "3 ANYS · ANTICIPACIÓ",
      title: "Toca recollir les peces per anar a sopar",
      body: "Té tots els animals de fusta escampats fent una granja i el sopar ja és calent a taula.",
      opts: [
        {
          k: "A", t: "Avisar dos minuts abans i proposar «portar els animals a dormir al cistell» plegats", s: "Transició lúdica compartida",
          vincle: +10, reg: +10, calma: +6,
          react: " Posa les vaques i els cavalls al cistell fent veure que badallen i ve content a rentar mans.",
          neuro: "Als 3 anys recollir tota una habitació sol aclapara la memòria de treball; fer-ho en equip i amb fil narratiu ho fa assequible.",
          phrase: "«Els cavalls ja tenen gana i son: tu guardes els grans o els petits al seu estable?»"
        },
        {
          k: "B", t: "Cridar des de la cuina quatre vegades: «Recull ja i vine a sopar!»", s: "Ordres a distància",
          vincle: -3, reg: -5, calma: -7,
          react: "Continua jugant com si no et sentís i el sopar es refreda.",
          neuro: "Quan un infant està immers en el joc simbòlic, les veus llunyanes queden com a soroll de fons; apropar-s'hi i tocar-li l'espatlla suaument connecta l'atenció.",
          phrase: "Apropar-se físicament estalvia cridar des de lluny."
        },
        {
          k: "C", t: "Amenaçar de llençar les joguines que quedin a terra", s: "Amenaça desproporcionada",
          vincle: -10, reg: -6, calma: -5,
          react: "S'angoixa pels seus tresors i recull amb por en lloc de cooperació.",
          neuro: "La cooperació nascuda de la confiança perdura; la que neix del neguit genera resistència.",
          phrase: "Treballem en equip per cuidar les nostres coses."
        }
      ]
    },
    {
      id: "13_caminar_lent", stage: "1-3", stageLabel: "2 ANYS · RITME LENT",
      title: "S'atura a mirar cada formiga i cada pedreta de la vorera",
      body: "Torneu de comprar sense pressa real, però per costum camines a pas d'adult mentre ell s'ajup fascinant-se per una fulla seca.",
      opts: [
        {
          k: "A", t: "Estirar-lo de la mà dient «va, camina, que això només és una fulla vella!»", s: "Inèrcia de pressa automàtica",
          vincle: -4, reg: -2, calma: -4,
          react: "Arrossega els peus i perd l'espurna de curiositat que tenia fa un segon.",
          neuro: "Moltes vegades tenim pressa per pur hàbit mental encara que no ens esperi ningú.",
          phrase: "Preguntar-nos «tinc pressa de debò ara mateix?» ens regala moments d'or."
        },
        {
          k: "B", t: "Ajupir-te dos minuts al seu costat i observar la formiga amb ulls de descoberta", s: "Meravella compartida (Mindfulness quotidià)",
          vincle: +12, reg: +8, calma: +11,
          react: "Et mira amb ulls brillants, t'explica cap on va la formiga i després et dóna la mà feliç.",
          neuro: "Els infants petits viuen en atenció plena natural; deixar-nos contagiar dos minuts pel seu ritme calma també la nostra ment adulta.",
          phrase: "«Mira quina fulla tan gran que porta aquesta formiga! Sembla ben forta!»"
        },
        {
          k: "C", t: "Mirar el telèfon dreta mentre ell parla sol amb la pedreta", s: "Espera passiva desconnectada",
          vincle: 0, reg: 0, calma: +1,
          react: "T'estira els pantalons per ensenyar-t'ho i et costa tornar a la conversa.",
          neuro: "Compartir el focus d'atenció ('joint attention') és un dels motors més potents del vocabulari entre els 1 i 3 anys.",
          phrase: "Dos minuts de mirada compartida omplen tota la tarda."
        }
      ]
    },
    {
      id: "13_esgotament_vespre", stage: "1-3", stageLabel: "1-3 ANYS · BATERIA ADULTA",
      title: "20:15h: bateria adulta baixeta abans del pijama",
      body: "Notes les espatlles tenses després d'un dia llarg de feina i encàrrecs, i encara queda posar el pijama i recollir la cuina.",
      opts: [
        {
          k: "A", t: "Forçar-te a fer tota la rutina al detall estant al límit fins a perdre la paciència", s: "Autoexigència rígida",
          vincle: -7, reg: -4, calma: -13,
          react: "Acabes parlant sec pel tap de la pasta de dents i et sap greu.",
          neuro: "Ignorar els nostres propis senyals de saturació ens deixa sense marge davant qualsevol imprevist infantil.",
          phrase: "Cuidar la nostra calma és cuidar tota la família."
        },
        {
          k: "B", t: "Comunicar en veu alta: «Faig tres respiracions lentes per recuperar calma i venim a posar el pijama»", s: "Modelar autoregulació honesta",
          vincle: +10, reg: +11, calma: +14,
          react: "T'imita bufant a poc a poc com un vent suau i acabeu el vespre en sintonia i tendresa.",
          neuro: "Veure com un adult detecta el seu cansament i respira sense culpar ningú és la millor escola d'educació emocional.",
          phrase: "«Tinc la bateria una mica fluixa; fem tres sospirs llargs junts i ens posem el pijama calentó.»"
        },
        {
          k: "C", t: "Renyar per avançat perquè no facin soroll", s: "Tensió preventiva",
          vincle: -5, reg: -3, calma: -6,
          react: "Els infants noten la tensió i es mostren encara més moguts.",
          neuro: "La calma es contagia, i la tensió preventiva també; un minut de respiració canvia el rumb del vespre.",
          phrase: "Un minut de pausa ens estalvia mitja hora de desgast."
        }
      ]
    },
    {
      id: "13_visita_casa_amics", stage: "1-3", stageLabel: "2-3 ANYS · ENTORN NOU",
      title: "Casa d'uns amics plena d'objectes delicats a l'abast",
      body: "Sou a casa d'uns amics sense fills i a la tauleta baixa hi ha figuretes de ceràmica que criden tota l'atenció del teu petit.",
      opts: [
        {
          k: "A", t: "Passar dues hores dient «no toquis això, no toquis allò» des del sofà", s: "Prohibició verbal constant sense adaptar l'espai",
          vincle: -4, reg: -6, calma: -10,
          react: "Acabes esgotada i l'infant frustrat perquè tot el que veu està prohibit.",
          neuro: "Als 2 anys l'impuls d'explorar amb les mans supera el fre verbal; adaptar l'entorn és molt més savi que repetir cinquanta 'no'.",
          phrase: "Adaptar l'espai estalvia el 80% dels conflictes amb infants petits."
        },
        {
          k: "B", t: "Enfadar-te amb ell per tenir curiositat per les figures", s: "Demanar autocontrol d'adult",
          vincle: -7, reg: -5, calma: -7,
          react: "Es posa trist i ningú gaudeix de la trobada.",
          neuro: "La curiositat tàctil és el motor d'aprenentatge natural d'aquesta etapa.",
          phrase: "Protegim els objectes delicats i oferim objectes segurs."
        },
        {
          k: "C", t: "Demanar amablement als amfitrions pujar un moment les dues figures i treure un parell de contes i cotxes", s: "Prevenció pràctica i entorn segur",
          vincle: +9, reg: +9, calma: +11,
          react: "Els amics ho entenen encantats, l'infant juga tranquil a la catifa i podeu conversar a gust.",
          neuro: "Preparar un espai del «sí» permet que tant l'infant com els adults es relaxin de debò.",
          phrase: "«Posem aquestes dues peces maques aquí dalt una estona i així estem tots ben tranquils!»"
        }
      ]
    },
    {
      id: "13_vocabulari_emocions", stage: "1-3", stageLabel: "2-3 ANYS · EXPRESSIÓ",
      title: "Assenyala l'armari gemegant perquè encara no li surt la paraula",
      body: "Vol una cosa concreta de la prestatgeria, fa sons frustrats i tu encara no saps si demana les pintures, la plastilina o el trencaclosques.",
      opts: [
        {
          k: "A", t: "Dir-li: «Fins que no ho demanis parlant bé no t'ho dono»", s: "Exigència lingüística que bloqueja més",
          vincle: -7, reg: -6, calma: -5,
          react: "S'atabala més perquè si pogués dir la paraula exacta ja ho estaria fent.",
          neuro: "Quan la frustració puja, l'accés al lèxic nou encara és més difícil; oferir calma i modelar la paraula sense exigir repetició desbloqueja la parla.",
          phrase: "Modelar la paraula amb naturalitat nodreix el llenguatge sense pressió."
        },
        {
          k: "B", t: "Agafar-lo en braços fins a l'alçada del prestatge perquè ho assenyali de prop i posar-hi tu la paraula clara", s: "Facilitar comunicació i enriquir vocabulari",
          vincle: +11, reg: +10, calma: +6,
          react: "Toca la caixa content i repeteix suau: «Pas-ti-li-na!» amb cara d'alleujament.",
          neuro: "Sentir-se comprès redueix la frustració comunicativa i associa parlar amb èxit i plaer.",
          phrase: "«Mirem-ho de prop! Ah, volies la plastilina blava! Aquí tens la plastilina.»"
        },
        {
          k: "C", t: "Donar-li tres coses a l'atzar sense mirar-lo mentre fas una altra feina", s: "Resposta automàtica sense connexió",
          vincle: -2, reg: -3, calma: -4,
          react: "Rebutja totes tres coses més neguitós.",
          neuro: "Deu segons d'atenció plena resolen sovint el que deu minuts a mitges compliquen.",
          phrase: "Miro als ulls, m'hi acosto i desxifrem plegats què vol dir-me."
        }
      ]
    },
    {
      id: "13_migdiada_salta", stage: "1-3", stageLabel: "3 ANYS · TRANSICIÓ DE SON",
      title: "«Avui no tinc son!» a l'hora de la migdiada",
      body: "Als tres anys hi ha dies que ja no s'adorm al migdia, però si no descansa gens arriba a les set de la tarda molt irritable.",
      opts: [
        {
          k: "A", t: "Instaurar «l'estona de repòs tranquil» amb contes o àudio suau al llit sense obligar-lo a adormir-se", s: "Pausa sensorial sense pressió de son",
          vincle: +10, reg: +11, calma: +10,
          react: "Mira contes ben relaxat mitja hora (i alguns dies s'adorm sol sense lluita!).",
          neuro: "El son no es pot forçar voluntàriament, però el repòs tranquil baixa l'activació cerebral i recarrega energia per a la tarda.",
          phrase: "«No cal dormir si avui no tens son; fem mitja horeta de coixins i contes tranquils per descansar el cos.»"
        },
        {
          k: "B", t: "Enfadar-te cada cinc minuts perquè encara té els ulls oberts", s: "Lluita per controlar una funció involuntària",
          vincle: -6, reg: -5, calma: -9,
          react: "La tensió activa l'adrenalina i fa impossible qualsevol descans.",
          neuro: "Dormir requereix sentir-se segur i sense pressió; la pressió activa la vigília.",
          phrase: "Oferim les condicions de calma; el cos fa la resta."
        },
        {
          k: "C", t: "Omplir la tarda d'encàrrecs i soroll per compensar que no ha dormit", s: "Sobreestimular un cervell ja cansat",
          vincle: -1, reg: -7, calma: -8,
          react: "A les sis de la tarda qualsevol petit detall es converteix en una muntanya.",
          neuro: "Els dies sense migdiada demanen tardes més suaus i avançar vint minuts el sopar i la nit.",
          phrase: "Dia sense migdiada = vespre suau i sopar d'hora."
        }
      ]
    },

    // ==================== ETAPA 4-6 ANYS (17 ESCENES) ====================
    {
      id: "46_marxar_parc", stage: "4-6", stageLabel: "4 ANYS · TRANSICIONS",
      title: "«No vull marxar del parc, cinc minuts més!»",
      body: "Ja comença a fosquejar i toca tornar a casa per sopar, però està en ple joc imaginari dalt del vaixell de fusta.",
      opts: [
        {
          k: "A", t: "Avisar 5 minuts abans, pactar «l'última missió del vaixell» i acomiadar el parc junts", s: "Anticipació + tancament simbòlic",
          vincle: +10, reg: +10, calma: +6,
          react: "Fa arribar el vaixell imaginari a port sentint-se respectat i et dóna la mà content.",
          neuro: "Als infants els costa tallar en sec quan estan en estat de flux creatiu. Anticipar prepara l'escorça prefrontal per al canvi d'activitat.",
          phrase: "«Capità, queden cinc minuts perquè el vaixell arribi a port abans d'anar a sopar!»"
        },
        {
          k: "B", t: "Dir: «Doncs adéu, jo me'n vaig i ja vindràs!»", s: "Fingir que marxes sol",
          vincle: -12, reg: -6, calma: -4,
          react: "Baixa corrents inquiet, però la confiança es ressent per la por de quedar-se enrere.",
          neuro: "La seguretat d'aferrament es basa en saber que els pares mai condicionen la seva presència i protecció.",
          phrase: "«És hora de tornar junts: anem caminant normal o fent passes de gegant?»"
        },
        {
          k: "C", t: "Dir «va, cinc minuts més» quatre vegades seguides fins a enfadar-te", s: "Límit elàstic que acaba en desgast",
          vincle: -4, reg: -6, calma: -9,
          react: "Aprèn que insistint el límit s'estira sempre i acabeu marxant tard i cansats.",
          neuro: "Un sol avís amable seguit d'acció coherent dóna molta més pau que negociar quatre pròrrogues.",
          phrase: "Avisar un cop amb afecte i complir-ho amb serenor."
        }
      ]
    },
    {
      id: "46_atencio_germa", stage: "4-6", stageLabel: "5 ANYS · GERMANS I PERTINENÇA",
      title: "«Sempre estàs ocupada amb el petit, i jo què?»",
      body: "Estàs atenent el germanet petit i el gran s'acosta amb cara llarga dient que abans jugàveu molt més junts.",
      opts: [
        {
          k: "A", t: "«No diguis això, ja ets gran i has d'entendre que ell et necessita més!»", s: "Exigir maduresa negant l'enyorança",
          vincle: -8, reg: -5, calma: -5,
          react: "S'allunya capcot sentint que el seu enyor no té espai.",
          neuro: "Un infant de 5 anys continua sent petit encara que tingui un germà menor; validar la seva enyorança desfà la rivalitat.",
          phrase: "Acollir la gelosia com una petició d'amor transforma el clima entre germans."
        },
        {
          k: "B", t: "Obrir el braç lliure: «Tens raó que m'has hagut d'esperar força avui. Vine aquí a prop i guardem els nostres 15 minuts exclusius!»", s: "Validar i reservar temps 1-a-1 diari",
          vincle: +13, reg: +9, calma: +6,
          react: "S'arraulix al teu costat somrient i comença a pensar quin joc triarà per a la vostra estona especial.",
          neuro: "Quinze minuts diaris d'atenció exclusiva ('Special Time') omplen el dipòsit de pertinença i redueixen la competència fraterna.",
          phrase: "«Ets importantíssim per a mi. A les set tenim els nostres quinze minuts només tu i jo!»"
        },
        {
          k: "C", t: "Prometre-li un regal material per compensar", s: "Substituir presència per objectes",
          vincle: +1, reg: -4, calma: -2,
          react: "S'il·lusiona un moment pel regal, però l'endemà torna la mateixa sensació.",
          neuro: "La set de connexió afectiva només es calma amb mirada, escolta i temps compartit.",
          phrase: "La millor medicina és un quart d'hora de presència plena."
        }
      ]
    },
    {
      id: "46_ombres_habitacio", stage: "4-6", stageLabel: "4-5 ANYS · IMAGINACIÓ NOCTURNA",
      title: "«L'abric de la cadira sembla un drac a les fosques!»",
      body: "Et crida des del llit perquè amb el llum apagat l'ombra de la cadira li fa respecte.",
      opts: [
        {
          k: "A", t: "Dir-li des de la porta: «Els dracs no existeixen, tanca els ulls i dorm!»", s: "Lògica freda des de lluny",
          vincle: -6, reg: -4, calma: -4,
          react: "Es queda sol mirant la mateixa ombra i et torna a cridar al cap de cinc minuts.",
          neuro: "Entre els 4 i 6 anys la imaginació creix de forma esplèndida i a la penombra costa separar fantasia i percepció visual.",
          phrase: "El drac és imaginari, però la seva emoció necessita calma real."
        },
        {
          k: "B", t: "Encendre tots els llums blancs i posar vídeos alegres per distreure'l", s: "Desvetllar el cicle de melatonina",
          vincle: +2, reg: -8, calma: -8,
          react: "Se li passa la son completament i costa una hora tornar a dormir.",
          neuro: "La llum blanca intensa frena la melatonina; una llumeta càlida i la veu suau mantenen l'estat de son.",
          phrase: "Llum càlida tènue i respiració pausada."
        },
        {
          k: "C", t: "Moure plegats l'abric dins l'armari, fer 3 respiracions lentes de mà a mà i deixar un punt de llum càlida", s: "Seguretat pràctica i co-regulació",
          vincle: +11, reg: +10, calma: +5,
          react: "Comprova tranquil que l'ombra ja no hi és, respira al teu ritme i s'adorm serè.",
          neuro: "Donar-li una acció concreta (guardar l'abric) més el ritme respiratori lent activa el sistema parasimpàtic.",
          phrase: "«Ja hem guardat l'abric i l'habitació descansa tranquil·la. Soc ben a prop teu.»"
        }
      ]
    },
    {
      id: "46_reparacio_veu_alta", stage: "4-6", stageLabel: "4-6 ANYS · ART DE REPARAR",
      title: "S'ha vessat el got de llet i has respost amb un to brusc",
      body: "Anaves carregada de coses, ha caigut el got per accident a la taula i t'ha sortit un retret massa fort. Ell et mira en silenci amb ulls entristits.",
      opts: [
        {
          k: "A", t: "Respirar fons, ajupir-te i disculpar-te honestament assumint la teva reacció", s: "Reparació sincera del vincle",
          vincle: +14, reg: +12, calma: +9,
          react: "S'il·lumina alleujat, et fa una abraçada i va a buscar el drap de cuina amb tu.",
          neuro: "Dan Siegel i Tina Payne Bryson subratllen que reparar després d'un desajust enforteix la confiança i modela humilitat i responsabilitat.",
          phrase: "«Perdona'm per haver parlat tan fort. Ha estat un accident i jo estava cansada. Netegem-ho junts.»"
        },
        {
          k: "B", t: "Justificar-ho: «És que si anessis més amb compte jo no m'enfadaria!»", s: "Atribuir la pròpia reacció a l'infant",
          vincle: -10, reg: -7, calma: -5,
          react: "Aprèn a tenir por d'equivocar-se a casa en lloc d'aprendre a recollir un vessament.",
          neuro: "Els gots es vessen per aprenentatge motor; la nostra resposta emocional ens pertany als adults.",
          phrase: "Assumir la nostra part amb naturalitat allibera tota la tensió."
        },
        {
          k: "C", t: "Netejar en silenci donant voltes a la culpa durant hores sense parlar-ne", s: "Culpa interna sense reparació explícita",
          vincle: -2, reg: -2, calma: -11,
          react: "L'ambient queda estrany i tu arrossegues malestar tot el vespre.",
          neuro: "Una disculpa clara de trenta segons tanca la ferida emocional i retorna la lleugeresa a tots dos.",
          phrase: "Reparar és el superpoder real de les famílies sanes."
        }
      ]
    },
    {
      id: "46_saludar_adults", stage: "4-6", stageLabel: "4-6 ANYS · RESPECTE I AUTONOMIA",
      title: "«No vull fer un petó ara mateix» en arribar a una trobada",
      body: "Arribeu a una festa i un conegut li demana un petó, però el teu fill es queda darrere teu una mica tímid.",
      opts: [
        {
          k: "A", t: "Insistir-li: «Va, no siguis maleducat, fes-li un petó que s'enfadarà!»", s: "Pressionar l'afecte físic per cortesia",
          vincle: -8, reg: -5, calma: -4,
          react: "Se sent incòmode i s'amaga encara més darrere les teves cames.",
          neuro: "Educar en l'amabilitat és compatible al 100% amb respectar el propi espai: pot saludar amb la mà, amb la veu o xocant el puny quan vulgui.",
          phrase: "Cortesia sí; forçar mostres d'afecte físic, no cal."
        },
        {
          k: "B", t: "Oferir alternatives de cortesia amable: «Pots dir hola amb la mà, xocar els cinc o saludar quan estiguis a punt»", s: "Amabilitat respectant el seu espai",
          vincle: +12, reg: +10, calma: +6,
          react: "Fa un «hola!» alegre movent la mà des del teu costat i al cap de deu minuts ja xerra tranquil.",
          neuro: "Sentir que els pares respecten el seu temps d'escalfament social reforça l'autoconfiança i el respecte mutu.",
          phrase: "«Acabem d'arribar i fem un hola amb la mà! Bon dia!»"
        },
        {
          k: "C", t: "Parlar d'ell en tercera persona dient «és que és molt vergonyós»", s: "Etiqueta limitant davant seu",
          vincle: -4, reg: -3, calma: -2,
          react: "Interioritza el paper de «nen vergonyós» cada cop que arriba a un lloc nou.",
          neuro: "Adele Faber recomana evitar etiquetes: dir «necessita uns minuts per observar primer» descriu un procés sa sense encasellar-lo.",
          phrase: "Descrivim el moment sense posar etiquetes fixes."
        }
      ]
    },
    {
      id: "46_perdre_oca", stage: "4-6", stageLabel: "5 ANYS · JOCS DE TAULA",
      title: "S'enfada moltíssim quan perd al joc de l'oca",
      body: "Jugueu una partida familiar al saló. Quan tu arribes abans a la casella final, ell creua els braços i diu que aquest joc no li agrada gens.",
      opts: [
        {
          k: "A", t: "Deixar-te perdre expressament a totes les partides perquè mai es frustri", s: "Victòria artificial permanent",
          vincle: +1, reg: -7, calma: 0,
          react: "El dia que juga amb amics de la seva edat ho passa molt malament perquè no està acostumat a perdre.",
          neuro: "El joc de taula a casa és el laboratori segur ideal per entrenar petites dosis de frustració amb acompanyament afectuós.",
          phrase: "A casa és on és més segur aprendre tant a guanyar com a perdre."
        },
        {
          k: "B", t: "Fer-li un sermó: «Si t'enfades per perdre no jugarem mai més amb tu!»", s: "Amenaça que talla l'aprenentatge",
          vincle: -7, reg: -5, calma: -5,
          react: "Marxa enfadat al sofà i s'espatlla la tarda de jocs.",
          neuro: "Als 5 anys tolerar l'atzar d'un dau encara és difícil; validar el disgust sense retrets l'ajuda a pair-ho.",
          phrase: "Acompanyar la decepció ensenya esportivitat a mitjà termini."
        },
        {
          k: "C", t: "Validar amb naturalitat: «Fa ràbia quan et faltaven tan poques caselles! Xoquem mans per la partida i en fem una de cooperativa o la revenja?»", s: "Normalitzar la frustració i celebrar el procés",
          vincle: +10, reg: +11, calma: +6,
          react: "Bufa, et xoca la mà a poc a poc i demana tornar a tirar els daus.",
          neuro: "Posar el focus en la diversió compartida i normalitzar que a vegades es guanya i a vegades s'aprèn construeix resiliència lúdica.",
          phrase: "«Ha estat molt emocionant fins a l'última tirada! Gràcies per jugar amb mi.»"
        }
      ]
    },
    {
      id: "46_sopar_verdura", stage: "4-6", stageLabel: "4-6 ANYS · TAULA AMABLE",
      title: "«Aquests pèsols verds no em venen gens de gust avui!»",
      body: "Has preparat el sopar amb estima i només seure a taula aparta la part verda del plat.",
      opts: [
        {
          k: "A", t: "Aplicar la calma a taula: servir una culleradeta petita sense pressió al costat d'arròs o truita i xerrar del millor moment del dia", s: "Divisió de responsabilitat d'Ellyn Satter",
          vincle: +10, reg: +11, calma: +7,
          react: "L'ambient es relaxa, menja a gust i a mitja conversa tasta dos pèsols tot sol sense que ningú li digui res!",
          neuro: "Segons Ellyn Satter, l'adult tria què i quan s'ofereix i l'infant decideix quant menja; zero pressió multiplica l'acceptació futura.",
          phrase: "«No cal que els mengis si avui no et venen de gust; a taula gaudim del sopar i de la conversa.»"
        },
        {
          k: "B", t: "Obligar-lo a quedar-se assegut fins que es mengi fins a l'últim pèsol", s: "Pressió a taula",
          vincle: -9, reg: -7, calma: -9,
          react: "El sopar s'allarga amb tensió i agafa encara més mania als pèsols.",
          neuro: "L'estrès activa el sistema simpàtic, que literalment tanca la sensació fisiològica de gana.",
          phrase: "La bona sintonia a taula és el millor condiment nutricional."
        },
        {
          k: "C", t: "Aixecar-te corrents a cuinar un menú diferent per a cada membre de casa", s: "Cuina a la carta esgotadora",
          vincle: +1, reg: -6, calma: -8,
          react: "Acabes el vespre rendida netejant tres cassoles diferents.",
          neuro: "Cuinar menús a la carta redueix l'oportunitat de familiaritzar-se amb els aliments comuns de la taula familiar.",
          phrase: "Un mateix sopar familiar que inclogui sempre un aliment conegut cuida tothom."
        }
      ]
    },
    {
      id: "46_historia_fantasia", stage: "4-6", stageLabel: "4 ANYS · MÓN MÀGIC",
      title: "Assegura convençut que un follet ha desordenat els colors",
      body: "Totes les ceres són fora de la capsa i et diu amb cara seriosa que ha entrat un follet pel balcó i les ha mogut totes.",
      opts: [
        {
          k: "A", t: "Enfadar-te molt pensant que t'està enganyant amb mala fe", s: "Jutjar fantasia de 4 anys com a engany adult",
          vincle: -7, reg: -5, calma: -6,
          react: "S'espanta de la teva reacció severa i es tanca en banda.",
          neuro: "Als 4 anys la frontera entre desig màgic ('tant de bo hagués estat un follet') i realitat encara és porosa.",
          phrase: "Entrar al pont lúdic permet recollir sense convertir-ho en un judici."
        },
        {
          k: "B", t: "Seguir el joc amb un somriure còmplice: «Caram amb aquest follet! Ensenyem-li que a casa cada color dorm a la seva capsa?»", s: "Humor màgic orientat a l'acció",
          vincle: +11, reg: +10, calma: +8,
          react: "Riu amb complicitat i guarda tots els colors per categories en dos minuts.",
          neuro: "Quan no se sent acorralat, coopera amb gust i a poc a poc madura la distinció entre conte i realitat.",
          phrase: "«Doncs deixarem la capsa tan ben endreçada que el follet quedarà bocabadat!»"
        },
        {
          k: "C", t: "Recollir-les tu sola sospirant", s: "Fer la tasca sense implicar-lo",
          vincle: 0, reg: -4, calma: -4,
          react: "Les ceres queden guardades però ell no participa en la cura del material.",
          neuro: "Fer-lo partícip de guardar el material amb bon humor crea hàbit sense tensió.",
          phrase: "Guardar junts amb alegria tanca el cercle del dibuix."
        }
      ]
    },
    {
      id: "46_vestir_creatiu", stage: "4-6", stageLabel: "5 ANYS · IDENTITAT I GUST",
      title: " Diumenge al matí vol combinar ratlles, quadres i caputxa",
      body: "Per anar a esmorzar al barri ha triat una combinació de colors ben singular però adequada per a la temperatura que fa.",
      opts: [
        {
          k: "A", t: "Fer-lo canviar tota la roba perquè no combina segons el teu criteri estètic", s: "Controlar una decisió inofensiva",
          vincle: -5, reg: -3, calma: -6,
          react: "Perdeu vint minuts discutint per una samarreta en un matí lliure.",
          neuro: "Reservar els nostres límits per al que importa de debò (seguretat, salut, respecte) i deixar marge creatiu en la resta fomenta el criteri propi.",
          phrase: "Triar quines batalles no cal lluitar regala diumenges serens."
        },
        {
          k: "B", t: "Burlar-te del seu conjunt fent brometa irònica", s: "Ironia que cohibeix la iniciativa",
          vincle: -8, reg: -4, calma: -3,
          react: "Se sent insegur sobre les seves pròpies tries.",
          neuro: "Els infants menors de 7 anys entenen la ironia de forma literal i poden sentir-se ridiculitzats.",
          phrase: "Cuidem la seva iniciativa amb respecte."
        },
        {
          k: "C", t: "Celebrar la seva autonomia: com que va ben abrigat i còmode, sortir a passejar ben contents", s: "Fomentar autonomia i criteri propi",
          vincle: +10, reg: +9, calma: +9,
          react: "Surt caminant ufanós perquè s'ha vestit tot sol de cap a peus.",
          neuro: "Prendre petites decisions quotidianes entrena les funcions executives d'elecció i autoafirmació.",
          phrase: "«Ja estàs a punt i ben calentó! Quina energia més alegre porta aquest jersei avui!»"
        }
      ]
    },
    {
      id: "46_compartir_germans", stage: "4-6", stageLabel: "4-6 ANYS · CONVIVÈNCIA",
      title: "Dos germans estiren el mateix coixí del sofà per fer una cabana",
      body: "Tots dos volen el coixí gran alhora per al seu racó i comencen a alçar la veu cridant-te com a jutge.",
      opts: [
        {
          k: "A", t: "Descriure el repte sense prendre partit: «Veig dos arquitectes i un sol coixí gran. Quines idees se us acudeixen perquè funcioni per a tots dos?»", s: "Mediació que entrena resolució conjunta",
          vincle: +10, reg: +12, calma: +7,
          react: "S'aturen a pensar i decideixen unir les dues cabanes en un sol castell gran amb el coixí de sostre!",
          neuro: "Adele Faber i Elaine Mazlish mostren que fer de mediador neutral en lloc de jutge evita el rol de favorit/culpable i entrena la negociació.",
          phrase: "«Confio que trobareu un acord creatiu: feu una sola cabana gran o fem torns amb rellotge de sorra?»"
        },
        {
          k: "B", t: "Preguntar «qui el tenia primer?» i entrar a jutjar un judici impossible", s: "Rol de tribunal que alimenta greuges",
          vincle: -4, reg: -5, calma: -8,
          react: "Tots dos donen versions oposades i un dels dos se sent injustament tractat.",
          neuro: "Quan els pares fem de jutges, els germans competeixen per demostrar que l'altre és el culpable en comptes de buscar solucions.",
          phrase: "Menys buscar culpables i més buscar solucions d'equip."
        },
        {
          k: "C", t: "Confiscar tots els coixins enfadada i prohibir fer cabanes", s: "Tancar el joc per a tothom",
          vincle: -6, reg: -4, calma: -5,
          react: "Es queden sense joc i continuen enfadats l'un amb l'altre.",
          neuro: "Eliminar el material atura el soroll al moment, però no els entrena a pactar torns ni solucions compartides.",
          phrase: "Cada petit desacord entre germans és una classe pràctica de convivència."
        }
      ]
    },
    {
      id: "46_preguntes_perque", stage: "4-6", stageLabel: "4-5 ANYS · CURIOSITAT INFINITA",
      title: "Vint-i-cinc «per què?» seguits de camí cap a casa",
      body: "Et pregunta per què els núvols es mouen, per què no cauen, per què la lluna surt de dia i per què l'aigua mulla.",
      opts: [
        {
          k: "A", t: "Tallar-lo sec: «Calla una mica que em tens el cap com un timbal!»", s: "Apagar la set de saber amb brusquedat",
          vincle: -7, reg: -3, calma: -3,
          react: "Es queda callat de cop amb la sensació que fer preguntes molesta.",
          neuro: "L'edat dels «per què» és el despertar del pensament causal i científic.",
          phrase: "Si estàs cansada, pots passar-li la pregunta amb afecte!"
        },
        {
          k: "B", t: "Tornar-li algunes preguntes amb curiositat: «Quina bona pregunta! Tu què penses que deu fer moure els núvols?»", s: "Diàleg socràtic que estimula el pensament",
          vincle: +11, reg: +9, calma: +8,
          react: "S'inventa una teoria enginyosa sobre el vent i gaudiu d'una conversa deliciosa i descansada.",
          neuro: "Convidar l'infant a formular les seves pròpies hipòtesis exercita el raonament molt més que rebre respostes tancades d'enciclopèdia.",
          phrase: "«Ostres, quina pregunta més interessant! Tu com t'ho imagines? Ho podem mirar al llibre d'estrelles a casa!»"
        },
        {
          k: "C", t: "Respondre amb monosil·labs automàtics sense escoltar què diu", s: "Desconnexió en pilot automàtic",
          vincle: -2, reg: -1, calma: -2,
          react: "Nota que no l'escoltes i repeteix la mateixa pregunta cada cop més alt.",
          neuro: "Quan sent que l'escoltem de debò durant dos minuts, ja no necessita repetir la pregunta deu vegades.",
          phrase: "Escoltar i preguntar-li la seva opinió descansa la veu i encén la seva ment."
        }
      ]
    },
    {
      id: "46_dibuix_regal", stage: "4-6", stageLabel: "5 ANYS · CREATIVITAT",
      title: "«Mira quin dibuix he fet! T'agrada?»",
      body: "Ve corrents amb un full ple d'espirals taronges i blaves i espera la teva reacció amb els ulls ben oberts.",
      opts: [
        {
          k: "A", t: "Dir sense gairebé mirar el full: «Molt maco, carinyo!» i seguir amb el que feies", s: "Elogi automàtic genèric",
          vincle: 0, reg: 0, calma: 0,
          react: "Nota que gairebé no l'has mirat i marxa sense comentar res més.",
          neuro: "Els elogis automàtics buits ('molt bé' per inèrcia) aporten poca connexió; l'observació descriptiva fa que se senti vist de veritat.",
          phrase: "Descriure el que veus val més que deu 'molt bé' automàtics."
        },
        {
          k: "B", t: "Corregir-lo: «El sol es pinta groc i les cases tenen finestres quadrades, no així»", s: "Dirigisme que talla l'expressió lliure",
          vincle: -7, reg: -5, calma: -2,
          react: "Perd les ganes de pintar lliurement i a partir d'aleshores demana sempre que li facis tu el dibuix.",
          neuro: "L'art lliure als 4-6 anys és expressió emocional i motriu, no pas còpia fotogràfica.",
          phrase: "Protegim la llibertat creativa del seu traç."
        },
        {
          k: "C", t: "Observar amb interès concret: «Veig espirals blaves molt grans i un taronja ple d'energia! Explica'm com l'has fet!»", s: "Mirada descriptiva que convida a expressar-se",
          vincle: +11, reg: +9, calma: +5,
          react: "T'explica tota la història d'un remolí marí amb un orgull immens als ulls.",
          neuro: "Quan descrivim el procés i els detalls reals, l'infant desenvolupa autovaloració interna en lloc de dependència d'aprovació externa.",
          phrase: "«Quina combinació de blau i taronja tan viva! Quina part t'ha agradat més pintar?»"
        }
      ]
    },
    {
      id: "46_primer_dia_curs", stage: "4-6", stageLabel: "4-6 ANYS · INICI D'ESCOLA",
      title: "Papallones a la panxa el matí de començar curs nou",
      body: "Esmorza poquet i et diu fluixet que té una sensació estranya a la panxa pensant en l'aula nova.",
      opts: [
        {
          k: "A", t: "Normalitzar les papallones, explicar que a tu també et passa en començar coses noves i dibuixar-vos un petit cor al canell per connectar", s: "Pont afectiu tangible i validació",
          vincle: +13, reg: +11, calma: +6,
          react: "Es mira el petit cor dibuixat amb un somriure valent i entra a l'escola agafat de la teva mà amb serenor.",
          neuro: "Els objectes transicionals simbòlics mantenen viva la representació interna del vincle segur durant les hores d'escola.",
          phrase: "«És ben normal notar papallones quan estrenem classe. Cada cop que miris aquest puntet al canell recorda que penso en tu!»"
        },
        {
          k: "B", t: "Dir-li: «Però si no passa res, no tinguis por que ja ets gran!»", s: "Minimitzar l'emoció d'incertesa",
          vincle: -5, reg: -4, calma: -3,
          react: "Es guarda els nervis per dins sense saber com gestionar-los.",
          neuro: "La valentia no és absència de nervis, sinó avançar sentint-se acompanyat i comprès.",
          phrase: "Acollim els nervis com un senyal normal davant les novetats."
        },
        {
          k: "C", t: "Fer-li vint preguntes ansioses sobre tot el que podria anar malament", s: "Amplificar la preocupació",
          vincle: +1, reg: -7, calma: -7,
          react: "Ara té més dubtes dels que tenia abans d'esmorzar.",
          neuro: "Escoltem amb calma i transmetem confiança sòlida en la seva capacitat d'adaptació.",
          phrase: "Escolta càlida + confiança serena en els seus recursos."
        }
      ]
    },
    {
      id: "46_soroll_pluja_casa", stage: "4-6", stageLabel: "4-6 ANYS · ENERGIA FÍSICA",
      title: "Tarda de pluja i salts d'energia per tot el passadís",
      body: "Fa dos dies que plou, no heu pogut anar al parc i salta d'una punta a l'altra del saló com una molla.",
      opts: [
        {
          k: "A", t: "Demanar-li que segui quiet dues hores seguides pintant fitxes en silenci", s: "Demanar immobilitat quan el cos demana moviment",
          vincle: -4, reg: -6, calma: -7,
          react: "Als tres minuts cau de la cadira movent cames i braços perquè té energia acumulada.",
          neuro: "La necessitat proprioceptiva i de moviment als 4-6 anys és biològica; canalitzar-la de forma segura apaga després la inquietud.",
          phrase: "Primer movem el cos amb intenció, després arriba la calma."
        },
        {
          k: "B", t: "Muntar un circuit casolà amb cinta de pintor a terra, coixins i «el terra és lava» durant quinze minuts", s: "Canalitzar l'energia motriu amb estructura",
          vincle: +11, reg: +11, calma: +7,
          react: "Crema l'energia acumulada rient i fent equilibris, i després seu ben a gust a escoltar un conte.",
          neuro: "El treball d'equilibri i força corporal regula el sistema vestibular i prepara el cervell per a activitats tranquil·les posteriors.",
          phrase: "«Fem un circuit d'equilibristes amb tres coixins i després berenem tranquils!»"
        },
        {
          k: "C", t: "Enfadar-te perquè té massa corda avui", s: "Confondre vitalitat infantil amb mala conducta",
          vincle: -6, reg: -4, calma: -6,
          react: "L'ambient es carrega i ningú passa una bona tarda.",
          neuro: "La vitalitat corporal no és desobediència: és salut demanant espai de joc.",
          phrase: "Donem llera segura a l'energia del cos."
        }
      ]
    },
    {
      id: "46_ajudar_cuina", stage: "4-6", stageLabel: "5 ANYS · CONTRIBUCIÓ",
      title: "«Puc ajudar-te a fer l'amanida i parar taula?»",
      body: "S'acosta amb un tamboret ple d'il·lusió per tallar tomàquets tous o barrejar, tot i que saps que aniràs una mica més lenta.",
      opts: [
        {
          k: "A", t: "Dir sempre «surt de la cuina que jo sola acabo més ràpid»", s: "Prioritzar rapidesa apagant les ganes de col·laborar",
          vincle: -4, reg: -4, calma: 0,
          react: "Marxa al sofà i uns anys més tard ens preguntem per què ja no s'ofereix a parar taula.",
          neuro: "Als 4-6 anys els infants senten un desig genuí de contribuir a la tribu familiar (Rudolf Dreikurs); cultivar-lo ara sembra hàbits per a tota la vida.",
          phrase: "Si avui els deixem participar encara que vagi lent, demà sentiran la llar com a seva."
        },
        {
          k: "B", t: "Deixar-lo ajudar però corregint cada gest amb tensió perquè quedi simètric", s: "Microgestió perfeccionista",
          vincle: -3, reg: -3, calma: -5,
          react: "Perd la il·lusió perquè sent que res del que fa està prou bé.",
          neuro: "El sentiment de competència creix quan celebrem la contribució real més enllà de la simetria dels tovallons.",
          phrase: "Valorem la col·laboració per sobre de la perfecció estètica."
        },
        {
          k: "C", t: "Assignar-li tasques segures a la seva mida (rentar fulles, posar tovallons, remenar) i agrair l'equip", s: "Pertinença i habilitats de vida",
          vincle: +11, reg: +10, calma: +6,
          react: "Serveix l'amanida a taula radiant dient «avui l'he preparada jo!» i fins i tot en menja amb més ganes.",
          neuro: "Participar en preparar el menjar augmenta el sentiment d'utilitat i també l'obertura a tastar allò que han cuinat.",
          phrase: "«Quin ajudant de cuina més apanyat! Tu rentes l'enciam i poses els tovallons!»"
        }
      ]
    },
    {
      id: "46_amic_parc_disgust", stage: "4-6", stageLabel: "5-6 ANYS · AMISTATS",
      title: "«En Roc ha dit que avui vol jugar a córrer i no a construccions!»",
      body: "Ve cap al banc disgustat perquè el seu amic del parc avui prefereix un joc diferent del que ell volia proposar.",
      opts: [
        {
          k: "A", t: "Anar a dir a l'altre nen que ha de jugar al que vol el teu fill", s: "Intervenció excessiva en acords entre iguals",
          vincle: +1, reg: -6, calma: -3,
          react: "Els infants se senten incòmodes i el joc queda forçat.",
          neuro: "A partir dels 5 anys, acompanyar des de la banda perquè ells mateixos proposin acords enforteix les seves habilitats socials.",
          phrase: "Acompanyem com a entrenadors, no pas jugant el partit per ells."
        },
        {
          k: "B", t: "Escoltar el disgust i ajudar-lo a pensar una proposta pont: «Primer deu minuts de córrer i després construccions, o buscar un joc que barregi tots dos?»", s: "Entrenament social i flexibilitat",
          vincle: +10, reg: +11, calma: +6,
          react: "Torna corrents a proposar «portar maons corrents per fer un fort» i tots dos riuen encantats!",
          neuro: "La flexibilitat cognitiva s'entrena buscant terceres vies on totes dues parts guanyen.",
          phrase: "«Entenc que tenies moltes ganes de construir. Quina idea li pots proposar que combini córrer i fer una base?»"
        },
        {
          k: "C", t: "Dir-li: «Doncs no hi juguis més mai amb ell!»", s: "Resposta absolutista davant un matís normal",
          vincle: -3, reg: -6, calma: -3,
          react: "Es queda sol al banc per una diferència petita i fàcil de pactar.",
          neuro: "Aprendre que dos amics poden voler coses diferents i arribar a un pacte és un aprenentatge relacional clau.",
          phrase: "Els bons amics també aprenen a pactar torns."
        }
      ]
    },
    {
      id: "46_ordenar_motxilla", stage: "4-6", stageLabel: "6 ANYS · HÀBITS TRANQUILS",
      title: "Preparar la roba i la motxilla el vespre abans",
      body: "Els matins entre setmana solen anar accelerats perquè a última hora sempre falta un mitjó o la carmanyola.",
      opts: [
        {
          k: "A", t: "Convertir en un petit ritual tranquil del vespre deixar junts la roba i la motxilla a punt a la cadira", s: "Disseny d'hàbit que regala matins calmats",
          vincle: +9, reg: +11, calma: +12,
          react: "Ell tria la samarreta al vespre sense pressa i l'endemà al matí tot flueix amb harmonia.",
          neuro: "Externalitzar la preparació quan el cervell no té pressa redueix dràsticament la càrrega executiva dels matins.",
          phrase: "«Deixem l'equipació d'explorador preparada aquesta nit i demà esmorzem amb tota la calma!»"
        },
        {
          k: "B", t: "Deixar-ho tot per a les 8:05 del matí i córrer buscant sabates sota el sofà", s: "Improvisació matinal estressant",
          vincle: -3, reg: -4, calma: -10,
          react: "Comenceu cada dia suant i amb pressa.",
          neuro: "Les rutines vespertines curtes són el millor protector de la serenor matinal.",
          phrase: "Cinc minuts al vespre regalen vint minuts de pau al matí."
        },
        {
          k: "C", t: "Preparar-ho sempre tot d'amagat sense que ell sàpiga ni què porta a la motxilla", s: "Fer-ho tot sense donar-li autonomia",
          vincle: +1, reg: -3, calma: +1,
          react: "A l'escola no sap on té el jersei o l'esmorzar perquè no ha participat a guardar-ho.",
          neuro: "Fer-ho plegats ara és el pas previ perquè als 8-9 anys ho faci amb plena autonomia.",
          phrase: "Primer junts, demà amb autonomia confiada."
        }
      ]
    },

    // ==================== ETAPA 7-9 ANYS (17 ESCENES) ====================
    {
      id: "79_no_em_surt", stage: "7-9", stageLabel: "7 ANYS · MENTALITAT DE CREIXEMENT",
      title: "Aparta la llibreta frustrat: «A mi això no se'm dóna bé!»",
      body: "Practicant un repte nou d'escola o un dibuix, s'equivoca dues vegades seguides, bufa amb ràbia i vol deixar-ho estar.",
      opts: [
        {
          k: "A", t: "«No diguis això! Si ets el més llest de la classe, mira que fàcil és!»", s: "Elogi d'etiqueta fixa i minimització",
          vincle: +1, reg: -5, calma: 0,
          react: "Sospira perquè per a ell ara mateix NO li sembla fàcil i tem decebre l'etiqueta de «llest».",
          neuro: "Carol Dweck va demostrar que elogiar el talent fix genera aversió als reptes per por d'equivocar-se; valorar l'estratègia i el procés dóna ales.",
          phrase: "Canviem el «ets molt llest» pel «m'encanta com busques maneres noves de provar-ho»."
        },
        {
          k: "B", t: "Validar la frustració, fer un glop d'aigua i afegir la paraula clau «ENCARA»", s: "Pausa reguladora + mentalitat de creixement",
          vincle: +11, reg: +13, calma: +6,
          react: "Respira fons, beu aigua i s'anima a provar només el primer pas d'una altra manera.",
          neuro: "Cada cop que detectem un error i provem una via nova és quan el cervell mielenitza connexions sinàptiques més fortes.",
          phrase: "«Fa ràbia quan s'encalla. ENCARA no surt, però el teu cervell ja està entrenant. Mirem només el primer trosset?»"
        },
        {
          k: "C", t: "Agafar el llapis i resoldre-l'hi tu perquè acabi ràpid", s: "Sobreprotecció que resta competència",
          vincle: -2, reg: -9, calma: -2,
          react: "L'exercici queda fet, però es queda amb la idea interna que ell sol no en sap.",
          neuro: "El sentiment d'autoeficàcia d'Albert Bandura es construeix superant obstacles assequibles amb acompanyament, no veient com ens ho fan.",
          phrase: "Acompanyo al teu costat, però el llapis és teu."
        }
      ]
    },
    {
      id: "79_pantalles_avorriment", stage: "7-9", stageLabel: "8 ANYS · PANTALLES I CREATIVITAT",
      title: "«S'ha acabat el temps de pantalla» i diu que tot és avorrit",
      body: "S'acaben els 25 minuts pactats de dibuixos o joc i quan apagues s'estira a la catifa dient que no hi ha res divertit a fer a casa.",
      opts: [
        {
          k: "A", t: "Pactar abans el final de capítol, que apagui ell mateix i sostenir amb calma 10 minuts d'avorriment sense rescatar-lo", s: "Marc clar + confiança en l'avorriment creatiu",
          vincle: +9, reg: +12, calma: +6,
          react: "Rondina vuit minuts a la catifa, i al minut dotze ja està inventant un còmic o un invent amb cartró!",
          neuro: "Després d'una pantalla hi ha un contrast dopaminèrgic passatger; passats deu minuts de transició s'activa la xarxa neuronal per defecte (la de la imaginació!).",
          phrase: "«Entenc que voldries continuar. Avorrir-se una estoneta és el trampolí d'on surten les teves millors idees.»"
        },
        {
          k: "B", t: "Tornar-la a encendre vint minuts més perquè deixi de queixar-se", s: "Reforç intermitent de la queixa",
          vincle: -2, reg: -10, calma: -5,
          react: "Al cap de vint minuts la protesta per apagar-la és encara més intensa.",
          neuro: "El reforç variable fa que el cervell insisteixi sempre per comprovar si avui també s'allarga el límit.",
          phrase: "Els acords clars i estables fan la convivència digital molt més lleugera."
        },
        {
          k: "C", t: "Enfadar-te i dir que retires les pantalles durant dos mesos", s: "Amenaça llarga fruit del moment",
          vincle: -7, reg: -4, calma: -7,
          react: "Es genera ressentiment i al cap de quatre dies costa complir una sanció tan llarga.",
          neuro: "Funcionen molt millor rutines clares i breus que grans sancions dites en calent.",
          phrase: "Acords clars abans d'encendre i calma quan s'apaga."
        }
      ]
    },
    {
      id: "79_pati_escola", stage: "7-9", stageLabel: "8 ANYS · PERTINENÇA SOCIAL",
      title: "«Avui al pati no m'han deixat jugar al partit»",
      body: "Al vespre, sopant o al llit, t'explica amb veu baixeta que avui al pati s'ha sentit apartat pel seu grup habitual.",
      opts: [
        {
          k: "A", t: "Minimitzar-ho ràpid: «Bah, no els facis cas, demà ja se'ls haurà passat!»", s: "Tancar el tema per evitar la tristesa",
          vincle: -6, reg: -4, calma: -2,
          react: "Canvia de tema i aprèn a guardar-se per a ell sol el que li passa a l'escola.",
          neuro: "Quan un infant de 8 anys obre el cor al vespre, el primer que necessita és sentir que l'escoltem sense pressa per arreglar-ho tot en un segon.",
          phrase: "L'escolta empàtica és el port on sempre voldrà tornar a explicar-nos el seu dia."
        },
        {
          k: "B", t: "Criticar durament els seus amics dient que no valen res", s: "Judici intens que posa l'infant a la defensiva",
          vincle: -2, reg: -4, calma: -6,
          react: "Curiosament passa a defensar els amics i deixa d'explicar-te detalls.",
          neuro: "A aquesta edat les dinàmiques de pati canvien d'un dia per l'altre; escoltar amb serenor ens permet distingir un mal dia puntual d'un patró repetit.",
          phrase: "Escoltem amb calma per comprendre tota la fotografia."
        },
        {
          k: "C", t: "Escoltar amb presència plena: «Ostres, t'ha d'haver sabut molt greu quedar-te fora. Què has fet llavors i com t'has sentit?»", s: "Escolta activa i acompanyament emocional",
          vincle: +13, reg: +10, calma: +6,
          react: "Es desfoga tranquil, explica que ha jugat amb una altra companya molt maca i s'adorm sentint-se comprès.",
          neuro: "Sentir-se escoltat sense judici processa l'emoció social a l'hipocamp i reforça la confiança per buscar bons aliats al grup.",
          phrase: "«Gràcies per explicar-m'ho, carinyo. És normal que faci mal quan passa això; parlem-ne tant com vulguis.»"
        }
      ]
    },
    {
      id: "79_ratlla_paret_sinceritat", stage: "7-9", stageLabel: "7-9 ANYS · HONESTEDAT SEGURA",
      title: "Una taca de retolador a la taula i «jo no sé com s'ha fet!»",
      body: "Veus una taca blava acabada de fer a la fusta i ell, amb la tapa del retolador blau a la mà, diu que ja hi era abans.",
      opts: [
        {
          k: "A", t: "Descriure el fet i passar a reparar: «Veig una taca de retolador. Agafem alcohol i un drap per deixar la taula neta junts?»", s: "Focus en la reparació sense acorralar",
          vincle: +12, reg: +11, calma: +7,
          react: "Suspira tranquil·litzat: «S'ha traspassat el full sense voler... T'ajudo a netejar-ho i posaré un cartró a sota!»",
          neuro: "Quan la llar premia l'honestedat i se centra a reparar solucions, els fills no necessiten amagar els seus errors.",
          phrase: "«A casa els descuits es reparen; gràcies per ajudar-me a netejar-ho i posar un protector.»"
        },
        {
          k: "B", t: "Fer preguntes-trampa: «Segur que no has estat tu? Si descobreixo que menteixes serà molt pitjor!»", s: "Interrogatori que empeny a defensar-se",
          vincle: -8, reg: -6, calma: -6,
          react: "Per por a la reacció s'aferra encara més a negar-ho.",
          neuro: "Quan ja sabem què ha passat, les preguntes-trampa conviden a l'autodefensa en lloc de la responsabilitat.",
          phrase: "Anem directes al que cal fer per arreglar-ho."
        },
        {
          k: "C", t: "Fregar-ho tu sola remugant en veu alta que ningú valora res", s: "Queixa indirecta sense aprenentatge",
          vincle: -4, reg: -4, calma: -6,
          react: "Marxa a la seva habitació incòmode però sense aprendre a netejar la superfície.",
          neuro: "Implicar-los amablement en la reparació pràctica construeix cura real per l'espai comú.",
          phrase: "Reparar amb les pròpies mans ensenya cura genuïna."
        }
      ]
    },
    {
      id: "79_comparar_germans", stage: "7-9", stageLabel: "7-9 ANYS · SINGULARITAT",
      title: "Tentació de dir: «Mira que ràpid s'ha vestit la teva germana!»",
      body: "Un dels germans ja té la motxilla a punt a l'entrada mentre l'altre encara contempla un mitjó assegut al llit somiant despert.",
      opts: [
        {
          k: "A", t: "Deixar anar la comparació perquè s'afanyi per picabaralla", s: "Comparació que alimenta rivalitat entre germans",
          vincle: -7, reg: -5, calma: -4,
          react: "Es vesteix de mal humor i fa una ganyota d'enuig a la seva germana.",
          neuro: "Adele Faber i Elaine Mazlish expliquen a 'Germans, no rivals' que comparar un fill amb l'altre crea ressentiments i encasella cadascú en un rol rígid.",
          phrase: "Parlem sempre a cada fill sobre el que li toca fer, sense passar per la comparació amb l'altre."
        },
        {
          k: "B", t: "Adreçar-te només al que falta amb una pista concreta: «Falten cinc minuts per sortir: et queda el mitjó esquerre i les vambes!»", s: "Descripció objectiva centrada en la tasca",
          vincle: +10, reg: +10, calma: +6,
          react: "Aterra dels seus pensaments sense sentir-se jutjat, es calça i surt de bon humor amb la germana.",
          neuro: "Els cervells més somiadors es beneficien d'indicacions curtes, concretes i amables sobre quin és el següent pas físic.",
          phrase: "«Bon dia, somiador! Següent pas: mitjó esquerre i sabatilles!»"
        },
        {
          k: "C", t: "Posar-li tu els mitjons i les sabates als 8 anys", s: "Substituir l'autonomia ja assolida",
          vincle: +1, reg: -6, calma: -3,
          react: "S'acostuma que si bada algú altre el vesteix.",
          neuro: "Mantenir l'autonomia amb un recordatori amable respecta les seves capacitats.",
          phrase: "Recordatori concret i confiança en les seves mans."
        }
      ]
    },
    {
      id: "79_primera_paga", stage: "7-9", stageLabel: "8-9 ANYS · CRITERI I AUTONOMIA",
      title: "Vol gastar tota la seva petita paga en un objecte fràgil",
      body: "Ha estalviat unes monedes a la guardiola i vol comprar una joguina petita de plàstic que intueixes que li durarà ben poc.",
      opts: [
        {
          k: "A", t: "Prohibir-l'hi taxativament dient «són els teus diners però només compres el que jo aprovi»", s: "Falsa autonomia que impedeix aprendre",
          vincle: -5, reg: -5, calma: -3,
          react: "Sent que la seva guardiola en realitat no li permet decidir res.",
          neuro: "L'objectiu d'una petita paga educativa és precisament poder equivocar-se amb 3 euros als 8 anys per tenir criteri amb 300 euros als 18.",
          phrase: "Els petits errors amb poques monedes són grans lliçons pràctiques."
        },
        {
          k: "B", t: "Fer una pregunta reflexiva («Vols decidir-ho avui o pensar-ho fins demà?»), respectar la seva tria i no dir «ja t'ho deia jo» si s'espatlla", s: "Guia reflexiva i respecte a l'experiència",
          vincle: +10, reg: +12, calma: +7,
          react: "Reflexiona, decideix provar-ho (o guardar-ho per a un llibre millor) i extrau ell mateix un gran aprenentatge real.",
          neuro: "L'aprenentatge experiencial sense retrets consolida la planificació i la demora de la gratificació.",
          phrase: "«És la teva guardiola i tu decideixes. Vols mirar bé el material abans de triar?»"
        },
        {
          k: "C", t: "Si se li espatlla l'endemà, comprar-l'hi un altre amb els teus diners perquè no sàpiga greu", s: "Esborrar la conseqüència natural",
          vincle: +1, reg: -7, calma: -2,
          react: "No arriba a connectar la qualitat de l'objecte amb el valor de l'estalvi.",
          neuro: "Empatitzar amb la decepció sense substituir l'objecte permet que la conseqüència natural faci la seva feina educativa.",
          phrase: "Empatia càlida quan alguna cosa no surt com esperava, sense rescatar l'aprenentatge."
        }
      ]
    },
    {
      id: "79_deures_tarda", stage: "7-9", stageLabel: "7-9 ANYS · TARDA I ENERGIA",
      title: "Arriba d'escola cansat i es bloqueja davant la motxilla",
      body: "Són les cinc de la tarda, acaba d'arribar amb gana i cansament mental, i només sentir la paraula «deures» rondina al sofà.",
      opts: [
        {
          k: "A", t: "Obligar-lo a seure a l'escriptori al minut u d'entrar per la porta abans de berenar", s: "Exigir esforç cognitiu amb glucosa i energia baixes",
          vincle: -6, reg: -6, calma: -7,
          react: "Tarda el triple d'estona, s'equivoca per cansament i la tarda es fa pesada.",
          neuro: "Després de sis hores d'atenció escolar, l'escorça prefrontal necessita berenar, hidratar-se i vint minuts de moviment o descans abans de reprendre cap tasca.",
          phrase: "Primer cuidem el cos i desconnectem una estona; després el cap rendeix el doble."
        },
        {
          k: "B", t: "Fer-li tu el resum o els càlculs mentre ell mira cap al sostre", s: "Assumir la seva responsabilitat escolar",
          vincle: 0, reg: -8, calma: -4,
          react: "No consolida l'aprenentatge i el mestre no pot saber què necessita reforçar a l'aula.",
          neuro: "Els deures són entre l'alumne i l'escola; el paper familiar és oferir un espai tranquil, berenar i disponibilitat puntual si s'encalla.",
          phrase: "Ofereixo bon ambient i suport puntual, no pas fer la seva feina."
        },
        {
          k: "C", t: "Berenar tranquils xerrant d'altres coses, 20 minuts d'aire i pactar ell mateix per quin bloc curt vol començar", s: "Pausa restauradora + planificació autònoma",
          vincle: +10, reg: +12, calma: +8,
          react: "Amb l'estómac ple i el cap fresc, ho enllesteix en mitja hora amb bon humor.",
          neuro: "Triar l'ordre de les tasques activa el control executiu i redueix la resistència inicial.",
          phrase: "«Primer berenem a gust i estirem les cames; després tu tries per quina part vols començar!»"
        }
      ]
    },
    {
      id: "79_oblit_flauta", stage: "7-9", stageLabel: "8-9 ANYS · RESPONSABILITAT",
      title: "S'ha deixat la carpeta de música a casa per segon cop",
      body: "Truca des de recepció o te n'adones a mig matí que la carpeta d'avui ha quedat sobre el sofà.",
      opts: [
        {
          k: "A", t: "Deixar la feina cada setmana per córrer a portar-l'hi sempre a l'instant", s: "Rescat sistemàtic que impedeix recordar-ho",
          vincle: +1, reg: -7, calma: -8,
          react: "Com que la carpeta sempre apareix màgicament, el seu cervell no necessita crear cap sistema de repàs.",
          neuro: "Viure una petita conseqüència benigna a primària (explicar al mestre que se l'ha oblidada) és el que activa la memòria prospectiva real.",
          phrase: "Un petit oblit assumible avui entrena l'organització de demà."
        },
        {
          k: "B", t: "A la tarda, sense sermó, dissenyar junts una petita llista visual a la porta per als dimecres", s: "Eina executiva sense retrets",
          vincle: +10, reg: +12, calma: +7,
          react: "Dibuixa ell mateix una nota musical en un post-it prop del penjador i el dimecres següent se'n recorda tot sol!",
          neuro: "Substituir els retrets per eines d'organització externa ensenya habilitats executives per a tota la vida.",
          phrase: "«Ostres, s'ha quedat al sofà! Quin truc visual ens podem inventar a l'entrada perquè dimecres vinent vingui amb tu?»"
        },
        {
          k: "C", t: "Dir-li que és un desastre i que té el cap ple de pardals", s: "Etiqueta que debilita l'autoconcepte",
          vincle: -8, reg: -5, calma: -4,
          react: "Assumeix que «és desmemoriat de mena» i encara s'esforça menys a revisar la motxilla.",
          neuro: "Les paraules que fem servir per descriure'ls acaben convertint-se en la seva veu interior.",
          phrase: "Canviem les etiquetes per eines pràctiques i confiança."
        }
      ]
    },
    {
      id: "79_partit_esport", stage: "7-9", stageLabel: "8 ANYS · ESPORT I GAUDIR",
      title: "De tornada del partit o l'exhibició de dissabte",
      body: "Pugeu al cotxe després de l'activitat esportiva del dissabte al matí. Ha suat molt, ha fallat algun llançament i espera què li diràs.",
      opts: [
        {
          k: "A", t: "Dir amb un somriure càlid: «M'ha encantat veure't jugar i passar-t'ho bé! Tens gana?»", s: "Amor incondicional aliè al marcador",
          vincle: +13, reg: +10, calma: +8,
          react: "Respira feliç al seient del darrere i és ell mateix qui es posa a explicar-te les jugades amb il·lusió.",
          neuro: "Estudis amb joves esportistes mostren que la frase que més els fa estimar l'esport i confiar en els pares després d'un partit és simplement: «M'ha encantat veure't jugar».",
          phrase: "«M'ha fet molt feliç veure't gaudir amb l'equip avui!»"
        },
        {
          k: "B", t: "Passar tot el trajecte analitzant les errades tècniques que ha fet", s: " convertir el cotxe en una roda de premsa",
          vincle: -7, reg: -5, calma: -5,
          react: "Mira per la finestra en silenci i perd a poc a poc l'alegria d'anar a entrenar.",
          neuro: "Les correccions tècniques corresponen a l'entrenador durant la setmana; el cotxe familiar és territori de suport i refugi.",
          phrase: "Sigues la seva família, no el seu segon entrenador."
        },
        {
          k: "C", t: "Comparar quants punts ha fet respecte d'un altre company d'equip", s: "Fomentar comparació social constant",
          vincle: -8, reg: -6, calma: -4,
          react: "Juga tens pensant en les estadístiques en lloc de gaudir del moviment i dels amics.",
          neuro: "Als 7-9 anys l'objectiu central de l'esport és la salut, el treball en equip i el plaer de moure el cos.",
          phrase: "L'èxit a aquesta edat és sortir suat, somrient i amb ganes de tornar dimarts."
        }
      ]
    },
    {
      id: "79_lectura_plaer", stage: "7-9", stageLabel: "7-9 ANYS · AMOR PER LLEGIR",
      title: "Vol llegir còmics d'humor en lloc de la novel·la llarga",
      body: "A la biblioteca tria amb passió uns còmics il·lustrats molt divertits, però dubtes si hauria d'agafar un llibre amb lletra més petita i sense dibuixos.",
      opts: [
        {
          k: "A", t: "Dir-li que els còmics no compten com a lectura de veritat i imposar un altre llibre", s: "Desvalorar el seu gust lector",
          vincle: -5, reg: -4, calma: -3,
          react: "Agafa el llibre imposat sense ganes i associa llegir amb una obligació avorrida.",
          neuro: "La recerca lectora confirma que els còmics i la novel·la gràfica desenvolupen vocabulari ric, inferència visual i sobretot l'hàbit de llegir per plaer.",
          phrase: "El millor llibre és aquell que obre amb ganes abans de dormir."
        },
        {
          k: "B", t: "Celebrar la seva tria, endur-vos els còmics i llegir també una estona junts al sofà o al llit", s: "Alimentar el plaer lector compartit",
          vincle: +11, reg: +9, calma: +7,
          react: "Riu a cor què vols llegint a la manta i ell sol demana tornar a la biblioteca la setmana vinent!",
          neuro: "Quan el cervell associa lectura amb llibertat d'elecció, humor i calidesa familiar, neix un lector per a tota la vida.",
          phrase: "«Aquest còmic fa molt bona pinta! Llegim una estona cadascú al sofà amb una manta?»"
        },
        {
          k: "C", t: "Cronometrar-lo obligant-lo a llegir en veu alta corregint cada síl·laba amb tensió", s: "Convertir l'oci lector en examen",
          vincle: -6, reg: -5, calma: -6,
          react: "Es posa rígid i mira quantes línies falten per acabar la pàgina.",
          neuro: "Alternar una pàgina l'adult i una vinyeta l'infant manté el ritme de la història sense esgotar la memòria fonològica.",
          phrase: "Llegir a duo treu el cansament i multiplica la màgia."
        }
      ]
    },
    {
      id: "79_enfadament_porta", stage: "7-9", stageLabel: "8-9 ANYS · PAUSA D'AUTOREGULACIÓ",
      title: "Marxa a la seva habitació dient «ara vull estar sol!»",
      body: "Després d'un desacord per una norma de casa, se'n va a la seva habitació enfadat dient que necessita estar tranquil uns minuts.",
      opts: [
        {
          k: "A", t: "Anar darrere seu obrint la porta per continuar donant arguments en calent", s: "Perseguir per tancar el debat quan hi ha emoció alta",
          vincle: -6, reg: -7, calma: -8,
          react: "Tots dos esteu alterats i la conversa puja de to sense arribar a cap bon port.",
          neuro: "Quan un infant de 8-9 anys demana espai per baixar revolucions, està aplicant una excel·lent estratègia d'autoregulació!",
          phrase: "Respectar cinc minuts de refredament permet parlar després amb el cervell serè."
        },
        {
          k: "B", t: "Fer-li el buit fred durant tota la resta de la tarda com a càstig", s: "Retirada afectiva prolongada",
          vincle: -9, reg: -5, calma: -4,
          react: "Sent que enfadar-se posa en risc l'estima a casa.",
          neuro: "Una cosa és respectar cinc minuts d'espai i una altra ben diferent és retirar la calidesa; el pont sempre ha de quedar obert.",
          phrase: "Espai per calmar-se sí; fredor afectiva, mai."
        },
        {
          k: "C", t: "Respectar el seu espai dient amb calma: «Em sembla bona idea respirar una estona; soc a la cuina quan estiguis a punt per parlar»", s: "Honorar l'autoregulació i deixar la porta oberta",
          vincle: +12, reg: +12, calma: +8,
          react: "Deu minuts després surt molt més tranquil, s'acosta a la cuina i podeu parlar de debò amb serenor.",
          neuro: "Dan Siegel anomena 'time-in' o pausa escollida aquesta capacitat de calmar l'amígdala abans de dialogar.",
          phrase: "«Prens una bona decisió prenent-te uns minuts. Quan vulguis parlem tranquil·lament.»"
        }
      ]
    },
    {
      id: "79_preguntes_grans", stage: "7-9", stageLabel: "7-9 ANYS · CONVERSES PROFUNDES",
      title: "Pregunta filosòfica inesperada just abans d'apagar el llum",
      body: "Amb el pijama posat i tot en silenci, et fa una pregunta profunda sobre el pas del temps, la natura o com creix la gent gran.",
      opts: [
        {
          k: "A", t: "Respondre amb honestedat serena, paraules senzilles adaptades a la seva edat i escoltant què en pensa ell", s: "Veritat amable i seguretat afectiva",
          vincle: +13, reg: +10, calma: +6,
          react: "T'escolta molt atent, et fa una abraçada fonda i s'adorm amb pau al cor.",
          neuro: "Entre els 7 i 9 anys es desperta la consciència existencial; respondre amb naturalitat i calidesa li ensenya que cap pregunta és tabú a casa.",
          phrase: "«Quina pregunta tan bonica i profunda. Parlem-ne tranquil·lament: què t'ha fet pensar en això avui?»"
        },
        {
          k: "B", t: "Canviar de tema bruscament dient «no pensis en aquestes coses i dorm!»", s: "Esquivar la pregunta per incomoditat adulta",
          vincle: -5, reg: -4, calma: -3,
          react: "Es queda donant-hi voltes tot sol a les fosques sense poder-ho compartir.",
          neuro: "El que es pot parlar amb els pares es torna digerible; el que es silencia pesa més a la imaginació.",
          phrase: "Una resposta curta, honesta i càlida tranquil·litza molt més que el silenci."
        },
        {
          k: "C", t: "Donar una conferència llarguíssima i complexa de quaranta minuts que l'aclapara", s: "Excés d'informació abstracta",
          vincle: +2, reg: -3, calma: -4,
          react: "S'atabala amb tants detalls que no havia preguntat.",
          neuro: "En converses profundes funciona la regla d'or: respon exactament el que pregunta amb senzillesa i deixa que ell marqui si vol saber més.",
          phrase: "Senzillesa, veritat serena i molta escolta."
        }
      ]
    },
    {
      id: "79_habitacio_ordre", stage: "7-9", stageLabel: "8 ANYS · ORDRE I COL·LABORACIÓ",
      title: "Dissabte al matí i l'escriptori ple de papers, peces i llibres",
      body: "Voleu endreçar una mica l'habitació el dissabte al matí, però davant el desordre acumulat es deixa caure al llit dient que és massa feina.",
      opts: [
        {
          k: "A", t: "Entrar amb una bossa amenaçant de llençar tot el que hi ha a la taula", s: "Amenaça que genera pànic i conflicte",
          vincle: -10, reg: -6, calma: -7,
          react: "Es genera un disgust enorme i cap aprenentatge d'organització.",
          neuro: "L'ordre sostenible s'aprèn categoritzant pas a pas, no sota estrès de perdre objectes estimats.",
          phrase: "Dividir la muntanya en tres petits passos fa fàcil qualsevol ordre."
        },
        {
          k: "B", t: "Posar dues cançons alegres i dividir en 3 missions clares: 1) llibres al prestatge, 2) llapis al pot, 3) papers de reciclatge", s: "Estructura executiva + música i energia",
          vincle: +10, reg: +11, calma: +8,
          react: "Amb la música i missions concretes, en deu minuts l'escriptori llueix endreçat i en sent orgull!",
          neuro: "La instrucció genèrica «endreça l'habitació» bloqueja els 7-9 anys; segmentar per categories concretes activa l'execució immediata.",
          phrase: "«Posem la teva cançó preferida! Primera missió de dos minuts: només els contes cap a la prestatgeria!»"
        },
        {
          k: "C", t: "Endreçar-li-ho tot mentre és fora sense que hi participi mai", s: "Fer-ho tot sense transmetre l'habilitat",
          vincle: +1, reg: -5, calma: -3,
          react: "Diumenge a la tarda torna a estar exactament igual perquè no ha après on va cada cosa.",
          neuro: "Endreçar en companyia alegre ensenya classificació espacial i cura de l'entorn propi.",
          phrase: "Missions petites, bona música i orgull compartit."
        }
      ]
    },
    {
      id: "79_cuinar_esmorzar", stage: "7-9", stageLabel: "9 ANYS · COMPETÈNCIA REAL",
      title: "Diumenge vol preparar ell les torrades i la fruita per a tothom",
      body: "S'ofereix amb entusiasme a preparar la safata de l'esmorzar familiar amb fruita tallada i torrades.",
      opts: [
        {
          k: "A", t: "Ensenyar-li les normes bàsiques de seguretat, quedar-te a prop xerrant tranquil·la i gaudir del seu esmorzar", s: "Confiança supervisada que dóna ales",
          vincle: +12, reg: +11, calma: +8,
          react: "Porta el plat a taula amb un somriure d'orella a orella i se sent capaç i valuós.",
          neuro: "Jesper Juul explica que sentir-se genuïnament útil per a la família transforma l'autoestima superficial en autoestima d'arrel.",
          phrase: "«Quin luxe d'esmorzar que ens has preparat avui! Moltes gràcies, xef!»"
        },
        {
          k: "B", t: "Dir-li que no perquè farà engrunes al marbre", s: "Prioritzar la neteja immediata a l'autonomia",
          vincle: -5, reg: -5, calma: 0,
          react: "Torna al sofà decebut i perd l'empenta d'iniciativa domèstica.",
          neuro: "Quatre engrunes es recullen en vint segons; la il·lusió de sentir-se capaç dura anys.",
          phrase: "Incloem passar el drap al final com a part natural de cuinar."
        },
        {
          k: "C", t: "Treure-li l'estri de les mans a mitja preparació perquè talla els trossos desiguals", s: "Impaciència estètica",
          vincle: -6, reg: -4, calma: -3,
          react: "Deixa el davantal dient «ja ho fas tu, doncs».",
          neuro: "Els trossos de poma irregulars fets per un fill tenen el millor gust del món.",
          phrase: "Celebrem les mans que aprenen fent."
        }
      ]
    },
    {
      id: "79_regal_aniversari_amic", stage: "7-9", stageLabel: "7-9 ANYS · EMPATIA I GENEROSITAT",
      title: "Triant un detall per a l'aniversari d'un amic de classe",
      body: "Sou a la papereria per triar un llibre o joc per a l'amic, però el teu fill només mira el que li agrada a ell mateix i en vol un d'igual.",
      opts: [
        {
          k: "A", t: "Enfadar-te dient que és un egoista i sortir de la botiga sense res", s: "Judici moral en comptes de guia empàtica",
          vincle: -7, reg: -4, calma: -6,
          react: "Se sent avergonyit per un impuls que és molt freqüent als 7-8 anys.",
          neuro: "Posar-se als gustos d'una altra persona requereix descentrament cognitiu (teoria de la ment), una habilitat que madura amb pràctica guiada.",
          phrase: "Entrenem l'empatia amb preguntes curioses, no pas amb retrets."
        },
        {
          k: "B", t: "Convidar-lo a fer de «detectiu dels gustos de l'amic» i preparar a casa una targeta dibuixada per ell", s: "Entrenar la mirada cap a l'altre",
          vincle: +11, reg: +10, calma: +7,
          react: "S'il·lusiona recordant que a l'amic li encanten els dinosaures i li dibuixa una postal preciosa!",
          neuro: "Fer l'exercici conscient de pensar què farà feliç l'amic activa els circuits d'altruisme i alegria prosocial.",
          phrase: "«Avui fem d'investigadors secrets: quina és la cosa que més il·lusió li farà obrir al teu amic?»"
        },
        {
          k: "C", t: "Comprar sempre un regal idèntic per a ell a cada aniversari aliè", s: "Evitar diferenciar qui celebra avui",
          vincle: 0, reg: -6, calma: -2,
          react: "Li costa més entendre el valor d'homenatjar el dia especial d'una altra persona.",
          neuro: "Aprendre a alegrar-se pel torn d'un amic tot sabent que el seu propi dia també arribarà dóna serenor emocional.",
          phrase: "Avui celebrem l'amic; i podem apuntar idees per quan arribi el teu dia."
        }
      ]
    },
    {
      id: "79_nervis_exposicio", stage: "7-9", stageLabel: "9 ANYS · CONFIANÇA ESCOLAR",
      title: "Demà ha d'explicar el seu projecte davant la classe",
      body: "Ha preparat una cartolina sobre els planetes, però al vespre et diu que li fa impressió parlar davant de tots els companys.",
      opts: [
        {
          k: "A", t: "Assajar-ho un cop al saló amb peluixos de públic amable i ensenyar-li a fer 2 respiracions lentes abans de començar", s: "Preparació pràctica + eina corporal",
          vincle: +12, reg: +12, calma: +7,
          react: "Riu veient l'ós de peluix assegut a primera fila, agafa seguretat amb el guió i l'endemà torna feliç!",
          neuro: "Combinar preparació en entorn segur amb exhalació lenta transforma l'activació nerviosa en confiança alerta.",
          phrase: "«T'ho saps molt bé! Practiquem-ho un cop davant del sofà i demà busca la mirada d'un bon amic a primera fila.»"
        },
        {
          k: "B", t: "Dir-li: «A veure si no t'equivoques i ho dius ben alt i perfecte!»", s: "Afegir pressió de perfecció",
          vincle: -5, reg: -6, calma: -5,
          react: "Ara encara té més por d'oblidar una paraula en públic.",
          neuro: "Posar el focus a «compartir una cosa interessant» en lloc de «no equivocar-se» baixa dràsticament l'ansietat escènica.",
          phrase: "No és un examen de perfecció, és compartir el que has descobert."
        },
        {
          k: "C", t: "Oferir-li quedar-se a casa demà per estalviar-li el moment", s: "Evitació que engrandeix el temor",
          vincle: +1, reg: -8, calma: -2,
          react: "Sent alleujament un matí, però la propera exposició li fa el doble de respecte.",
          neuro: "Acompanyar a travessar reptes assumibles construeix la convicció interna de «puc amb això».",
          phrase: "Camino al teu costat perquè descobreixis que n'ets capaç."
        }
      ]
    },
    {
      id: "79_vespre_gratitud", stage: "7-9", stageLabel: "7-9 ANYS · TANCAMENT DEL DIA",
      title: "Un dia intens on sembla que tot ha anat a contrapèl",
      body: "Ha plogut, hi ha hagut presses i al llit sent que avui ha estat «un mal dia on tot m'ha sortit al revés».",
      opts: [
        {
          k: "A", t: "Fer un repàs de tot el que s'hauria d'haver fet millor avui", s: "Tancar el dia revisant errades",
          vincle: -6, reg: -4, calma: -6,
          react: "S'adorm amb sensació de pesadesa.",
          neuro: "El cervell té un 'biaix de negativitat' evolutiu (Rick Hanson) que s'enganxa com el velcro als entrebancs i deixa escapar els bons moments.",
          phrase: "L'hora d'anar a dormir és temps de recer, no d'avaluació."
        },
        {
          k: "B", t: "Jugar al «Tresor i Espina del dia»: compartir una cosa difícil i tres petites coses boniques que sí que han passat avui", s: "Integració emocional i atenció agraïda",
          vincle: +12, reg: +11, calma: +9,
          react: "Primer nomena l'espina i després recorda el conte divertit, els macarrons i una rialla al pati, adormint-se amb un somriure.",
          neuro: "Integrar tant el que ha costat com tres detalls agradables equilibra els dos hemisferis cerebrals abans del son REM.",
          phrase: "«Avui ha estat un dia intens! Quina ha estat l'espina del dia i quins tres petits tresors hi hem trobat?»"
        },
        {
          k: "C", t: "Negar el seu malestar dient «no diguis ximpleries, ha estat un dia fantàstic!»", s: "Positivitat forçada que no escolta",
          vincle: -4, reg: -3, calma: -2,
          react: "Sent que no pot expressar quan un dia se li ha fet feixuc.",
          neuro: "Validar primer l'espina fa que buscar després els tresors sigui autèntic i reparador.",
          phrase: "Escoltem el núvol i també recordem on ha brillat el sol."
        }
      ]
    },

    // ==================== ETAPA 10-12 ANYS (17 ESCENES) ====================
    {
      id: "1012_porta_tancada", stage: "10-12", stageLabel: "10-12 ANYS · INTIMITAT SANA",
      title: "Comença a tancar la porta de l'habitació per escoltar música",
      body: "Fins fa poc jugava sempre al mig del saló, i ara als onze anys tanca la porta de la seva habitació per llegir o escoltar música al seu aire.",
      opts: [
        {
          k: "A", t: "Entrar sense trucar obrint de bat a bat i prenent-ho com un rebuig a la família", s: "Envair l'espai naixent d'intimitat",
          vincle: -8, reg: -4, calma: -5,
          react: "Se sent envaït i s'allunya encara més de les estones comunes.",
          neuro: "A la preadolescència el cervell necessita un espai propi d'intimitat per començar a construir la identitat individual; trucar abans d'entrar modela respecte mutu.",
          phrase: "Trucar a la porta abans d'entrar manté oberta la porta de la confiança."
        },
        {
          k: "B", t: "Trucar suaument abans d'entrar i combinar respecte pel seu espai amb àpats familiars acollidors sense pantalles", s: "Equilibri entre espai propi i ritual familiar",
          vincle: +12, reg: +10, calma: +8,
          react: "Agraeix el teu respecte i surt de bon grat a sopar i xerrar amb vosaltres a la cuina.",
          neuro: "Segons Jesper Juul, quan respectem la seva nova necessitat de privacitat sense dramatitzar, ells mateixos tornen a buscar la calidesa del saló.",
          phrase: "«Toc-toc! Quan acabis aquesta cançó tenim el berenar a punt a la cuina si et ve de gust.»"
        },
        {
          k: "C", t: "Desentendre't del tot i deixar de proposar mai cap pla compartit", s: " confondre autonomia amb distància afectiva",
          vincle: -6, reg: -3, calma: -2,
          react: "Encara que demani espai, en el fons troba a faltar saber que continues disponible i interessada.",
          neuro: "Els preadolescents necessiten com mai «fars tranquils»: adults propers, disponibles i gens invasius.",
          phrase: "Respecto el teu racó i sempre tens lloc al nostre costat."
        }
      ]
    },
    {
      id: "1012_ulls_en_blanc", stage: "10-12", stageLabel: "11 ANYS · AUTOREGULACIÓ ADULTA",
      title: "Fa un sospir llarg i posa els ulls en blanc quan li recordes la dutxa",
      body: "Li recordes amablement que toca dutxar-se abans de sopar i respon amb un «ja vaaaig, quina pesadesa!» bufant cap al sostre.",
      opts: [
        {
          k: "A", t: "No prendre-s'ho com un atac personal, mantenir la calma i dir amb serenor: «T'agraeixo un to amable; el bany queda lliure ara mateix»", s: "Fermesa serena sense entrar al cos a cos",
          vincle: +11, reg: +11, calma: +9,
          react: "En no trobar front de batalla, baixa el to: «Val, hi vaig d'aquí a dos minuts» i es dutxa sense discussió.",
          neuro: "A la preadolescència hi ha una remodelació sinàptica intensa i canvis hormonals; com recorda Lisa Damour, no hem de pujar a totes les muntanyes russes emocionals.",
          phrase: "«Jo et parlo amb respecte i m'agrada que ens parlem bé. Tens la tovallola neta a punt.»"
        },
        {
          k: "B", t: "Entrar al xoc cridant més fort que ell durant mitja hora", s: "Escalada simètrica",
          vincle: -9, reg: -6, calma: -11,
          react: "S'oblida el tema de la dutxa i acabeu en una discussió esgotadora.",
          neuro: "Quan l'adult reacciona com un altre preadolescent, es perd l'àncora reguladora de la casa.",
          phrase: "Un de nosaltres dos ha de conservar la calma adulta, i ens toca a nosaltres."
        },
        {
          k: "C", t: "Fer comentaris sarcàstics sobre «l'edat del pavo» davant de tota la família", s: "Sarcasme que fereix la dignitat",
          vincle: -10, reg: -5, calma: -4,
          react: "Se sent ridiculitzat i tanca la comunicació amb tu.",
          neuro: "En aquesta etapa la sensibilitat a la dignitat social és màxima; el respecte ferm sense ironia preserva el pont.",
          phrase: "Límit clar al to, zero sarcasme amb la persona."
        }
      ]
    },
    {
      id: "1012_pressio_mobil", stage: "10-12", stageLabel: "10-12 ANYS · TECNOLOGIA AMB CRITERI",
      title: "«Tothom de la classe ja té mòbil propi menys jo!»",
      body: "Torna de l'escola dient que uns quants companys ja tenen telèfon amb xarxes i insisteix que serà l'únic que no en té.",
      opts: [
        {
          k: "A", t: "Comprar-li demà un telèfon sense límits per por que es queixi", s: "Cedir sense criteri ni acompanyament",
          vincle: +1, reg: -9, calma: -6,
          react: "Rep un accés obert abans de tenir maduresa d'autoregulació i s'escurcen les hores de son i lectura.",
          neuro: "El còrtex d'autocontrol davant algoritmes infinits encara està en construcció als 10-12 anys; l'entrada gradual i pactada protegeix el descans i l'atenció.",
          phrase: "Acompanyar pas a pas l'educació digital és cuidar la seva salut mental."
        },
        {
          k: "B", t: "Escoltar la seva necessitat de connectar amb els amics, validar-la i oferir vies saludables (quedar en persona, trucar des del telèfon familiar, acord d'etapes)", s: "Empatia social + criteri familiar clar",
          vincle: +11, reg: +11, calma: +8,
          react: "Tot i que preferiria tenir-lo ja, se sent escoltat i s'anima a convidar dos amics a berenar divendres a casa!",
          neuro: "Sota el «vull mòbil» hi ha la necessitat sana de pertànyer al grup d'amics; facilitar trobades reals en persona nodreix aquesta amistat sense pantalles.",
          phrase: "«Entenc que vols estar connectat amb la colla. A casa farem el pas més endavant, però divendres podem convidar els amics a berenar!»"
        },
        {
          k: "C", t: "Dir-li que les coses que li interessen són absurdes i tancar la conversa de cop", s: "Desqualificar el seu món social",
          vincle: -8, reg: -4, calma: -4,
          react: "Pensa «els meus pares no entenen res del meu món» i deixa de consultar-te.",
          neuro: "Podem mantenir un «encara no» ferm mentre mostrem respecte genuí pel que és important per a ell.",
          phrase: "Un «encara no» dit amb afecte i escolta es digereix amb respecte."
        }
      ]
    },
    {
      id: "1012_conversa_cotxe_nit", stage: "10-12", stageLabel: "11-12 ANYS · ESCOLTA SENSE INTERROGATORI",
      title: "Quan li preguntes «com ha anat l'escola?» al migdia només diu «bé»",
      body: "A l'hora de dinar fas cinc preguntes seguides sobre l'escola i només reps monosil·labs: «bé», «normal», «no ho sé».",
      opts: [
        {
          k: "A", t: "Insistir amb deu preguntes més com un interrogatori fins que s'atabali", s: "Pressió comunicativa en el moment equivocat",
          vincle: -6, reg: -3, calma: -6,
          react: "Es tanca encara més perquè sent la conversa com un examen diari.",
          neuro: "Als 10-12 anys les converses cara a cara acabats de sortir de classe cansen; sovint s'obren molt més caminant de costat, cuinant o a les fosques abans de dormir.",
          phrase: "Menys interrogatori al migdia i més disponibilitat tranquil·la al capvespre."
        },
        {
          k: "B", t: "Deixar d'interessar-te pel seu dia pensant que ja no vol parlar mai", s: "Retirada per desencís",
          vincle: -5, reg: -2, calma: -2,
          react: "Es perden aquells moments màgics en què sí que hauria volgut xerrar.",
          neuro: "La clau és estar a prop fent una activitat suau compartida sense exigir que parli en un minut concret.",
          phrase: "Presència relaxada que obre espai quan ell estigui a punt."
        },
        {
          k: "C", t: "Respectar el silenci del migdia i aprofitar estones de costat (passejant, parant taula o al vespre) explicant tu una anècdota breu i escoltant sense jutjar", s: "Conversa «espatlla amb espatlla»",
          vincle: +13, reg: +10, calma: +8,
          react: "Mentre talleu fruita al vespre, es posa ell sol a explicar-te tota una història divertidíssima del pati i els professors!",
          neuro: "La conversa en paral·lel (sense mirada fixa directa) rebaixa la pressió social al cervell preadolescent i facilita que s'obrin amb naturalitat.",
          phrase: "«Avui m'ha passat una cosa ben curiosa tornant de la feina...» (i deixar espai obert amb calma)."
        }
      ]
    },
    {
      id: "1012_canvis_imatge", stage: "10-12", stageLabel: "10-12 ANYS · AUTOIMATGE SANA",
      title: "Es mira molta estona al mirall dubtant de com li queda el cabell o la roba",
      body: "Abans de sortir de casa es canvia dues vegades de dessuadora i comenta que no s'acaba de veure bé amb res avui.",
      opts: [
        {
          k: "A", t: "Escoltar sense burlar-te, validar que créixer porta canvis i posar sempre el focus en la salut, la comoditat i les fortaleses del que fa el cos", s: "Respecte i autoimatge funcional",
          vincle: +12, reg: +10, calma: +7,
          react: "Se sent comprès sense ser jutjat, tria la dessuadora més còmoda i surt amb el cap ben alt.",
          neuro: "Com parlem a casa sobre el nostre propi cos i el dels altres és el mirall on els preadolescents construeixen la seva relació amable amb ells mateixos.",
          phrase: "«És normal que canviïn els teus gustos a mesura que creixes; tria allò amb què et sentis ben còmode i tu mateix.»"
        },
        {
          k: "B", t: "Riure-te'n dient: «Quanta presumidoria que tens ara de cop!»", s: "Broma que fereix en una etapa sensible",
          vincle: -9, reg: -5, calma: -3,
          react: "Tanca la porta del bany incòmode i no torna a compartir com se sent.",
          neuro: "L'autoconsciència social es multiplica a partir dels 10 anys; la delicadesa verbal a casa és un bàlsam essencial.",
          phrase: "Tractem la seva sensibilitat naixent amb delicadesa."
        },
        {
          k: "C", t: "Fer comentaris crítics sobre l'aspecte propi o aliè davant seu", s: "Modelar autocrítica estètica",
          vincle: -5, reg: -6, calma: -5,
          react: "Absorbeix un estàndard exigent sobre l'aparença.",
          neuro: "Parlar amb gratitud de la força, l'energia i la salut del cos protegeix l'autoestima preadolescent.",
          phrase: "A casa parlem dels cossos amb gratitud i amabilitat."
        }
      ]
    },
    {
      id: "1012_organitzar_examen", stage: "10-12", stageLabel: "11 ANYS · PLANIFICACIÓ",
      title: "Té un projecte gran per a divendres i dimarts encara no l'ha començat",
      body: "Saps que divendres ha de lliurar un treball important i dimarts a la tarda el veus tranquil sense saber per on començar.",
      opts: [
        {
          k: "A", t: "Fer-li un discurs catastrofista dient que suspendrà tot el curs si segueix així", s: "Alarma que paralitza l'acció",
          vincle: -7, reg: -6, calma: -7,
          react: "S'angoixa tant per la muntanya sencera que procrastina encara més.",
          neuro: "La procrastinació no és mandra: és regulació emocional davant d'una tasca que es percep massa gran i difusa.",
          phrase: "Trossejar el projecte desbloqueja l'acció; espantar-lo la congela."
        },
        {
          k: "B", t: "Fer-li tu la portada i buscar-li tota la informació dimarts a la nit", s: "Substituir l'autonomia a cicle superior",
          vincle: 0, reg: -9, calma: -6,
          react: "Arriba a secundària sense haver après a planificar-se una setmana.",
          neuro: "Entre els 10 i 12 anys és l'etapa clau per passar del control extern a l'autogestió guiada.",
          phrase: "T'ensenyo a fer el mapa, però el viatge el camines tu."
        },
        {
          k: "C", t: "Seure cinc minuts amb un full en blanc perquè ell mateix divideixi el treball en 3 trossos (dimarts, dimecres, dijous)", s: "Entrenament de planificació executiva",
          vincle: +11, reg: +13, calma: +8,
          react: "En veure-ho dividit en tres passos curts, es relaxa i fa el primer apartat avui mateix amb autonomia.",
          neuro: "Ensenyar a dividir un objectiu gran en fites diàries concretes entrena el lòbul frontal per a secundària i la vida adulta.",
          phrase: "«Mirem el calendari cinc minuts: com et va millor repartir els tres apartats entre avui i dijous?»"
        }
      ]
    },
    {
      id: "1012_confidencia_amic", stage: "10-12", stageLabel: "11-12 ANYS · LLEIALTAT I SUPORT",
      title: "Et demana consell sobre un malentès que ha tingut al seu grup d'amics",
      body: "Sopar acabat, recollit tot, es queda recolzat al marc de la cuina i t'explica un embolic de missatges o comentaris entre dos amics seus.",
      opts: [
        {
          k: "A", t: "Deixar el drap de cuina, escoltar sense interrompre i preguntar: «Vols que només t'escolti o vols que pensem opcions junts?»", s: "Pregunta d'or de comunicació amb grans",
          vincle: +14, reg: +12, calma: +8,
          react: "Et mira agraït: «Primer que m'escoltis i després pensem què puc dir demà!» i s'obre amb plena confiança.",
          neuro: "Preguntar si busca desfogament o consell respecta la seva agència i evita que se senti dirigit quan només volia ser escoltat.",
          phrase: "«Soc tota orelles. Prefereixes desfogar-te tranquil o que fem pluja d'idees plegats?»"
        },
        {
          k: "B", t: "Dir-li que ara mateix escriuràs als pares dels altres nens per arreglar-ho tu", s: "Intervenció immediata que li fa témer explicar coses",
          vincle: -8, reg: -6, calma: -5,
          react: "S'espanta («No, sisplau, no diguis res!») i el proper cop dubta si explicar-te'n res.",
          neuro: "Llevat de situacions greus on calgui protecció adulta, als 11-12 anys volen pensar estratègies amb tu per resoldre-ho ells mateixos.",
          phrase: "Pensem plegats com ho pots expressar tu demà amb calma."
        },
        {
          k: "C", t: "Jutjar-lo a ell a la primera frase dient «segur que tu també deus haver dit alguna cosa!»", s: "Judici precipitat que tanca la confidència",
          vincle: -9, reg: -5, calma: -4,
          react: "S'arronsa d'espatlles dient «deixa-ho córrer, és igual» i marxa al passadís.",
          neuro: "Quan escoltem fins al final amb curiositat serena, ells sols arriben també a fer autocrítica constructiva.",
          phrase: "Primer escolta segura fins al final; la reflexió neix quan no hi ha judici."
        }
      ]
    },
    {
      id: "1012_opinio_diferent", stage: "10-12", stageLabel: "10-12 ANYS · PENSAMENT CRÍTIC",
      title: "A taula defensa amb passió una opinió diferent de la teva",
      body: "Parlant d'un tema d'actualitat, música o ecologia durant el sopar, argumenta un punt de vista diferent del teu amb molta energia.",
      opts: [
        {
          k: "A", t: "Tallar-lo dient: «Quan siguis gran ja opinaràs, aquí tinc raó jo!»", s: "Autoritarisme que apaga el criteri propi",
          vincle: -9, reg: -5, calma: -4,
          react: "Calla a taula però desconnecta de les converses familiars.",
          neuro: "Si volem joves que sàpiguen dir «no» a la pressió del grup a fora, necessiten poder practicar a argumentar amb respecte dins de casa.",
          phrase: "Una taula on es pot debatre amb respecte entrena joves amb criteri propi."
        },
        {
          k: "B", t: "Escoltar el seu argument amb interès genuí: «És molt interessant com ho planteges, no ho havia mirat des d'aquest angle!»", s: "Validar el pensament propi i el debat sa",
          vincle: +12, reg: +11, calma: +8,
          react: "Se li il·luminen els ulls i escolta també amb molt més respecte el teu matís.",
          neuro: " cap als 11 anys desperta el pensament formal (Piaget): debatre idees amb els pares en un clima càlid afila l'empatia intel·lectual.",
          phrase: "«M'encanta sentir com raones les teves idees. Què t'ha fet arribar a aquesta conclusió?»"
        },
        {
          k: "C", t: "Burlar-te dels seus arguments per guanyar el debat ràpidament", s: "Victòria dialèctica a costa del vincle",
          vincle: -8, reg: -4, calma: -3,
          react: "Se sent petit davant la teva retòrica adulta i deixa de compartir idees.",
          neuro: " amb els fills no debatem per guanyar-los, sinó per ajudar-los a desplegar les ales del pensament.",
          phrase: "Curiositat genuïna per la ment que s'està desplegant."
        }
      ]
    },
    {
      id: "1012_son_nit_lectura", stage: "10-12", stageLabel: "11-12 ANYS · DESCANS I RITMES",
      title: "22:15h: vol quedar-se despert fins molt tard entre setmana",
      body: "A mesura que es fa gran el rellotge biològic es desplaça una mica més tard, però demà s'ha de llevar a les 7:15h i després li costa molt.",
      opts: [
        {
          k: "A", t: "Deixar tots els dispositius dins l'habitació tota la nit confiant que apagarà a les deu", s: "Deixar una temptació massa difícil de gestionar",
          vincle: 0, reg: -10, calma: -5,
          react: "Acaba mirant coses fins tard i l'endemà s'aixeca esgotat i de mal humor.",
          neuro: "Tots els dispositius de la família (adults inclosos!) carregant fora de les habitacions a la nit és l'hàbit més protector del son juvenil.",
          phrase: "A la nit les pantalles dormen al saló perquè els cervells descansin a l'habitació."
        },
        {
          k: "B", t: "Acordar que tots els aparells carreguen fora a les 21h i deixar 25 minuts de lectura en paper o música suau amb llum càlida", s: "Higiene del son amb marge d'autonomia lectora",
          vincle: +11, reg: +12, calma: +9,
          react: "Llegeix unes pàgines del seu llibre o revista al seu ritme fins que li ve la son naturalment.",
          neuro: "El paper amb llum càlida permet la secreció de melatonina mentre respecta la sensació preadolescent de gestionar la seva estona abans de dormir.",
          phrase: "«Deixem aparells carregant a fora i tens la teva mitja horeta tranquil·la de llibre abans d'apagar.»"
        },
        {
          k: "C", t: "Entrar cada cinc minuts cridant «dorm ja!» amb tensió", s: "Control tens que activa l'estat d'alerta",
          vincle: -6, reg: -5, calma: -7,
          react: "Es desvetlla per la discussió i encara triga més a agafar el son.",
          neuro: "Crear l'ambient propici (silenci, llum càlida, llibre) convida al son sense batalles.",
          phrase: "Cuidem l'ambient de calma nocturna per a tota la casa."
        }
      ]
    },
    {
      id: "1012_abandonar_activitat", stage: "10-12", stageLabel: "10-12 ANYS · CONSTÀNCIA I ESCOLTA",
      title: "«Vull deixar l'extraescolar avui mateix perquè avui m'ha costat!»",
      body: "A mitja tardor ha tingut una sessió més exigent a música o esport i arriba dient que ho vol deixar immediatament.",
      opts: [
        {
          k: "A", t: "Apuntar-lo i desapuntar-lo l'endemà mateix a cada petita dificultat puntual", s: "Abandonament impulsiu en calent",
          vincle: +1, reg: -7, calma: -2,
          react: "Dues setmanes després troba a faltar el grup i es perd descobrir que el sotrac es podia superar.",
          neuro: "Tota habilitat nova té una 'vall d'aprenentatge' on sembla que costa més abans de fer el salt següent.",
          phrase: "No prenem decisions definitives en una tarda de cansament."
        },
        {
          k: "B", t: "Negar-te a escoltar cap motiu dient «t'aguantes els propers cinc anys t'agradi o no!»", s: "Rigidesa sense escoltar què passa de fons",
          vincle: -7, reg: -4, calma: -5,
          react: "No pots saber si només era cansament puntual o si hi havia algun malestar real a revisar.",
          neuro: "Escoltar primer a fons permet distingir una frustració passatgera d'un canvi d'etapa genuí.",
          phrase: "Primer escoltem què hi ha darrere les ganes de deixar-ho."
        },
        {
          k: "C", t: "Escoltar què l'ha incomodat avui i acordar acabar el trimestre amb tranquil·litat i valorar-ho plegats al final", s: "Escolta + compromís acotat i revisable",
          vincle: +11, reg: +12, calma: +7,
          react: "Se sent escoltat sense pressió eterna; dues setmanes després li surt la peça o la jugada i vol continuar encantat!",
          neuro: "Angela Duckworth ('Grit') proposa pactar compromisos acotats (acabar el trimestre) i decidir en fred al final del període.",
          phrase: "«Explica'm què s'ha fet feixuc avui. Acabem el trimestre tranquils i al desembre decidim junts amb calma.»"
        }
      ]
    },
    {
      id: "1012_cuinar_sopar_equip", stage: "10-12", stageLabel: "11 ANYS · RESPONSABILITAT COMPARTIDA",
      title: "Encarregar-se un dia a la setmana de triar i cuinar el sopar",
      body: "Ja té onze anys i us plantegeu com fer-lo partícip real del funcionament quotidià de casa sense que tot siguin recordatoris.",
      opts: [
        {
          k: "A", t: "Proposar que els dijous siguin «la nit del xef júnior»: ell tria el plat saludable i el cuineu amb ell al capdavant", s: "Autonomia real amb gaudi compartit",
          vincle: +13, reg: +11, calma: +9,
          react: "S'ho pren amb molt d'orgull, busca receptes de fajites o truites variades i entén tot l'esforç que hi ha darrere cada àpat!",
          neuro: "Tenir una responsabilitat autèntica i visible dins la família satisfà la necessitat de significació i competència de la preadolescència.",
          phrase: "«Els dijous tu ets el cap de cuina i jo la teva ajudant! Quin menú prepararàs aquesta setmana?»"
        },
        {
          k: "B", t: "Queixar-te cada vespre que «a aquesta casa ningú ajuda mai en res»", s: "Queixa generalitzada que desmotiva",
          vincle: -7, reg: -4, calma: -7,
          react: "Tothom desconnecta de la queixa difusa i res no canvia.",
          neuro: "Els acords concrets amb dia i rol fix funcionen infinitament millor que els retrets generals.",
          phrase: "Un acord concret i engrescador transforma la convivència."
        },
        {
          k: "C", t: "Continuar servint-li-ho absolutament tot al sofà com quan tenia 3 anys", s: "Tractar un preadolescent com un infant petit",
          vincle: 0, reg: -7, calma: -4,
          react: "Perd l'oportunitat de guanyar habilitats vitals i autonomia pràctica.",
          neuro: "Créixer en drets i autonomia va de bracet amb créixer en participació a la llar.",
          phrase: "Com més confiem en les seves mans, més creix la seva maduresa."
        }
      ]
    },
    {
      id: "1012_nota_examen", stage: "10-12", stageLabel: "10-12 ANYS · APRENDRE DELS ERRORS",
      title: "Arriba capcot perquè li ha sortit malament una prova que havia estudiat",
      body: "T'ensenya una nota més baixa del que esperava. Està decebut amb ell mateix perquè sí que hi havia dedicat estona.",
      opts: [
        {
          k: "A", t: "Renyar-lo damunt del seu propi desencís: «És que no t'hi deus haver fixat gens!»", s: "Afegir retret quan ja està dolgut",
          vincle: -9, reg: -6, calma: -5,
          react: "El proper cop li fa por ensenyar-te una nota quan no és alta.",
          neuro: "Quan l'infant ja sent decepció pròpia, afegir reny extern apaga l'autocrítica sana i genera ocultació.",
          phrase: "Que sàpiga que pot portar qualsevol resultat a casa amb confiança."
        },
        {
          k: "B", t: "Fer una abraçada, reconèixer l'esforç fet i mirar junts demà quina estratègia d'estudi pot funcionar millor", s: "Suport incondicional + revisió d'estratègia",
          vincle: +13, reg: +12, calma: +7,
          react: "Respira alleujat i l'endemà descobriu que fer-se esquemes amb les seves paraules li funciona molt millor que rellegir!",
          neuro: "A cicle superior molts infants passen de memoritzar literalment a necessitar esquemes actius; revisar el 'com estudiem' ho canvia tot.",
          phrase: "«Sé que t'hi has esforçat i entenc que et sàpiga greu. Una nota és només una foto d'avui; demà mirem quin truc d'esquemes t'ajuda més.»"
        },
        {
          k: "C", t: "Culpar el professor dient que segur que la prova estava mal feta", s: "Externalitzar tota responsabilitat",
          vincle: +1, reg: -7, calma: -3,
          react: "Sent que no té cap marge personal per millorar la seva tècnica d'estudi.",
          neuro: "Posar el focus en allò que sí que depèn de nosaltres (com practicar o preguntar dubtes a classe) li retorna poder d'acció.",
          phrase: "Mirem què podem ajustar nosaltres per al proper repte."
        }
      ]
    },
    {
      id: "1012_humor_complicitat", stage: "10-12", stageLabel: "11-12 ANYS · HUMOR I VINCLE",
      title: "Et vol ensenyar una cançó nova o un acudit del seu món",
      body: "S'acosta amb ganes d'ensenyar-te una cançó o un joc de paraules que li fa molta gràcia amb els seus amics.",
      opts: [
        {
          k: "A", t: "Dir-li: «Quina música més estranya escolteu avui dia, això no val res!»", s: "Tancar la porta al seu univers cultural",
          vincle: -8, reg: -3, calma: -2,
          react: "Es posa els auriculars i deixa de compartir els seus descobriments amb tu.",
          neuro: "Cada vegada que un preadolescent ens convida al seu món de gustos ens està estenent un pont d'or de connexió.",
          phrase: "Cuidar els petits ponts d'avui manté l'autopista oberta als 15 anys."
        },
        {
          k: "B", t: "Ignorar-lo dient que tens coses més serioses al cap", s: "Rebutjar una «oferta de connexió»",
          vincle: -6, reg: -2, calma: -2,
          react: "Marxa pensant que les seves il·lusions són poc importants.",
          neuro: "John Gottman anomena 'bids for connection' aquestes petites invitacions quotidianes: acceptar-les tres minuts enforteix enormement la relació.",
          phrase: "Tres minuts d'interès avui valen hores de confiança demà."
        },
        {
          k: "C", t: "Escoltar-la amb curiositat oberta, preguntar què és el que més li agrada del ritme i compartir una rialla", s: "Acollir la seva oferta de connexió",
          vincle: +13, reg: +9, calma: +8,
          react: "Riu encantat compartint el seu món i després et pregunta quina música escoltaves tu a la seva edat!",
          neuro: "Compartir música i humor genera sincronia emocional i manté viva la complicitat intergeneracional.",
          phrase: "«A veure, posa-la que l'escolti! Té un ritme molt viu; com l'heu descoberta?»"
        }
      ]
    },
    {
      id: "1012_sortir_pa_autonomia", stage: "10-12", stageLabel: "10-12 ANYS · CONFIANÇA GRADUAL",
      title: "Demana anar sol a buscar el pa a la fleca de la cantonada",
      body: "La fleca és a cent metres per una vorera tranquil·la i coneguda del barri, i et demana anar-hi ell sol amb la bossa de roba.",
      opts: [
        {
          k: "A", t: "Repassar junts el camí i el pas de vianants, donar-li confiança i celebrar quan torna amb la barra calenta", s: "Autonomia progressiva i confiança real",
          vincle: +11, reg: +13, calma: +7,
          react: "Torna cinc minuts després alt com un sant Pau amb el pa i el canvi exacte, radiant d'autoeficàcia!",
          neuro: "Francesco Tonucci i Peter Gray recorden que petites dosis graduades d'autonomia real al barri redueixen l'ansietat infantil i construeixen maduresa.",
          phrase: "«Confio en tu! Mirem bé abans de creuar el pas i aquí t'espero per preparar els entrepans.»"
        },
        {
          k: "B", t: "Dir-li que fins als setze anys no pot fer ni cent metres sense tu", s: "Sobreprotecció que alimenta inseguretat",
          vincle: -4, reg: -8, calma: -3,
          react: "Sent que el món exterior és massa difícil per a ell.",
          neuro: "La seguretat futura es construeix donant responsabilitats progressives adequades a cada edat i entorn.",
          phrase: "Donem arrels fortes i també espai progressiu per volar a prop."
        },
        {
          k: "C", t: "Deixar-lo anar però seguir-lo amagada darrere els arbres espiant-lo", s: "Missatge contradictori de desconfiança",
          vincle: -6, reg: -4, calma: -7,
          react: "Et veu pel vidre de la fleca i sent que la teva paraula de confiança no era sincera.",
          neuro: "Si encara vols fer el pas previ, és molt més honest anar junts fins a la cantonada i que entri ell sol a comprar.",
          phrase: "Honestedat i passos graduals que donin pau a tots dos."
        }
      ]
    },
    {
      id: "1012_temps_familia_cap_setmana", stage: "10-12", stageLabel: "11-12 ANYS · PLANS DE FAMÍLIA",
      title: "Rondina quan proposeu una excursió familiar de diumenge",
      body: "Proposes anar a caminar a la natura diumenge al matí i d'entrada diu que li fa mandra aixecar-se del sofà.",
      opts: [
        {
          k: "A", t: "Cancel·lar totes les sortides familiars per sempre més a la primera queixa", s: "Renunciar als rituals compartits",
          vincle: -5, reg: -4, calma: -3,
          react: "Passeu tot el diumenge tancats i a la tarda tothom està més ensopit.",
          neuro: "Tot i la mandra inicial, el contacte amb el bosc i el moviment familiar un cop ja sou en marxa regala benestar real.",
          phrase: "La petita mandra inicial sovint es desfà als deu minuts de caminar."
        },
        {
          k: "B", t: "Implicar-lo en el pla: que ell triï la ruta al mapa, la música del cotxe o on fareu l'esmorzar de forquilla o pícnic", s: "Co-dissenyar el pla donant-li veu",
          vincle: +12, reg: +10, calma: +8,
          react: "Tria un camí amb riera, prepara la llista de cançons del viatge i passeu un matí esplèndid plegats!",
          neuro: "A partir dels 10 anys passar de ser 'passatger passiu' a 'co-organitzador' desperta la motivació i el compromís.",
          phrase: "«Diumenge respirem aire pur! Vols triar tu la ruta del riu o la del mirador, i fas de DJ del trajecte?»"
        },
        {
          k: "C", t: "Enfadar-te dient que és un desagraït per tenir mandra un diumenge", s: "Convertir la proposta d'oci en retret",
          vincle: -7, reg: -4, calma: -6,
          react: "Sortiu de casa amb cares llargues abans ni de començar la caminada.",
          neuro: "Escoltar el badall amb bon humor i donar-li protagonisme en la ruta suavitza la sortida.",
          phrase: "Bon humor, bon pícnic i ruta compartida."
        }
      ]
    },
    {
      id: "1012_demanar_ajuda_adult", stage: "10-12", stageLabel: "10-12 ANYS · MODELATGE EMOCIONAL",
      title: "Et nota preocupada per un assumpte de feina i et pregunta si estàs bé",
      body: "Als onze anys ja capta molt fi el teu llenguatge no verbal i et pregunta amb afecte si avui estàs cansada o preocupada.",
      opts: [
        {
          k: "A", t: "Negar l'evidència amb un somriure rígid: «No em passa absolutament res, tot és perfecte!»", s: "Incongruència entre el que sent i el que dius",
          vincle: -3, reg: -4, calma: -4,
          react: "Es queda confós perquè la seva intuïció li deia una cosa i les teves paraules la contrària (o pensa que és per ell).",
          neuro: "Quan neguem l'evident, els infants dubten del seu radar empàtic o pensen que ells en tenen la culpa.",
          phrase: "L'autenticitat mesurada valida la seva empatia i el tranquil·litza."
        },
        {
          k: "B", t: "Descarregar-li tots els detalls complexos d'adults com si fos el teu terapeuta", s: "Sobrecarregar un fill amb pes adult",
          vincle: -4, reg: -7, calma: -5,
          react: "Es preocupa per assumptes que no li corresponen resoldre.",
          neuro: "Compartim l'emoció bàsica amb serenor deixant sempre clar que els adults ja ens n'ocupem.",
          phrase: "Honestedat emocional sí, càrrega adulta mai."
        },
        {
          k: "C", t: "Agrair la seva sensibilitat amb honestedat serena: «Quina bona observació! Avui tinc un dia de feina intens, però ja ho estic encarrilant; un passeig o estirament m'anirà genial»", s: "Autenticitat tranquil·litzadora i modelatge",
          vincle: +13, reg: +11, calma: +10,
          react: "Somriu alleujat sabent que no és res amb ell, et fa una abraçada espontània i confia en el seu bon ull empàtic.",
          neuro: "Brené Brown i Jesper Juul destaquen que l'honestedat serena i acotada ('estic cansada i em cuidaré una estona') ensenya salut emocional real.",
          phrase: "«Gràcies per preguntar-ho, tens molt bon ull! Avui estic una mica cansada de la feina, res relacionat amb tu. Una abraçada em recarrega!»"
        }
      ]
    },
    {
      id: "1012_celebrar_cami", stage: "10-12", stageLabel: "12 ANYS · GRATITUD I CAMÍ",
      title: "Mirant fotos antigues plegats una tarda tranquil·la al sofà",
      body: "Trobeu fotos de quan era molt petit i s'adona de com ha crescut i canviat al llarg d'aquests anys.",
      opts: [
        {
          k: "A", t: "Dir amb nostàlgia trista: «Quina llàstima que ja hagis crescut, abans eres molt més maco!»", s: "Enyor que desllueix el present",
          vincle: -5, reg: -2, calma: -2,
          react: "Sent com si fer-se gran fos una pèrdua per a tu.",
          neuro: "Celebrar la persona que és AVUI —amb la seva veu, humor i idees noves— li dóna permís per créixer amb il·lusió.",
          phrase: "Cada etapa té la seva bellesa única; gaudim la d'avui!"
        },
        {
          k: "B", t: "Gaudir dels records junts i dir-li de cor com t'agrada la persona en qui s'està convertint avui", s: "Beneir el creixement i l'estima present",
          vincle: +15, reg: +10, calma: +11,
          react: "Tot i fer-se una mica l'interessant, li brilla un somriure profund que guarda com un tresor a dins.",
          neuro: "Sentir que els pares gaudeixen de cada nova etapa seva és la benedicció afectiva més sòlida per entrar a l'adolescència amb arrels segures.",
          phrase: "«M'encantava acompanyar-te quan eres menut, i encara m'agrada més conversar i descobrir qui ets avui!»"
        },
        {
          k: "C", t: "Aprofitar les fotos per recordar-li totes les trapelleries que feia", s: "Centrar el record en retrets antics",
          vincle: -6, reg: -3, calma: -3,
          react: "Tanca l'àlbum aviat i canvia d'habitació.",
          neuro: "La memòria autobiogràfica familiar és el relat des d'on es mira a si mateix: teixim-lo amb tendresa i humor amable.",
          phrase: "Guardem a la memòria compartida la tendresa del camí recorregut."
        }
      ]
    }
  ];

  // ==================== ESTUDI DE IOGA RESTAURATIU & PRANAYAMA (18 POSTURES SVG) ====================
  var YOGA_MOODS = [
    { id: "esquena", label: "Esquena i espatlles", sub: "Descarregar trapezi, cervicals i zona lumbar" },
    { id: "ment", label: "Ment en calma", sub: "Abaixar revolucions i ordenar pensaments" },
    { id: "vespre", label: "Descans nocturn", sub: "Preparar un son reparador i profund" },
    { id: "mati", label: "Despertar suau", sub: "Mobilitzar el cos amb dolçor i energia amable" },
    { id: "flex", label: "Flexibilitat amable", sub: "Donar espai a costelles, esquena i cames" },
    { id: "express", label: "Pausa en 2 minuts", sub: "Recàrrega immediata sense estora" }
  ];

  var YOGA_LENGTHS = [
    { id: 3, label: "Curta · 3 postures", shortLabel: "3 postures", calmaBonus: 14 },
    { id: 5, label: "Mitjana · 5 postures", shortLabel: "5 postures", calmaBonus: 22 },
    { id: 8, label: "Llarga · 8 postures", shortLabel: "8 postures", calmaBonus: 30 }
  ];

  var ASANAS = [
    {
      id: "balasana",
      sanskrit: "Balasana",
      name: "Postura de Repòs amb Coixí",
      breaths: "8 respiracions lentes cap a l'esquena",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="18" y1="74" x2="242" y2="74" stroke="currentColor" stroke-width="1.5"/><rect x="128" y="56" width="58" height="16" rx="8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3,2"/><path d="M62,72 L106,72" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M62,71 Q68,42 110,45 L146,56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="157" cy="54" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M150,60 L196,68" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Repòs lumbar · Front recolzat</text></svg>',
      steps: [
        "1. Seu sobre els talons amb els genolls separats a una amplada còmoda.",
        "2. Inclina el tronc endavant deixant descansar el front i els braços al terra o sobre un coixí gran.",
        "3. Nota com les costelles posteriors s'eixamplen suaument a cada inspiració."
      ],
      comfort: "Variant amable: col·loca un coixí llarg sota el pit i un altre entre talons i cuixes."
    },
    {
      id: "marjaryasana",
      sanskrit: "Marjaryasana-Bitilasana",
      name: "Ona Suau d'Esquena (Gat i Vaca)",
      breaths: "6 cicles lents al ritme de l'aire",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="18" y1="74" x2="242" y2="74" stroke="currentColor" stroke-width="1.5"/><path d="M78,74 L78,44 M158,74 L158,44" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M78,44 Q118,22 158,44" fill="none" stroke="currentColor" stroke-width="2.8"/><path d="M78,46 Q118,60 158,44" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4,3"/><circle cx="171" cy="39" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Inhala obre pit · Exhala arrodoneix</text></svg>',
      steps: [
        "1. Col·loca mans sota espatlles i genolls sota malucs (o fes el moviment asseguda en cadira).",
        "2. En inspirar, obre suaument l'estern cap endavant allargant el coll sense tensar.",
        "3. En exhalar llarg, arrodoneix l'esquena deixant caure el cap i destensant els omòplats."
      ],
      comfort: "Variant amable: posa una manta plegada sota els genolls o fes l'ona asseguda al sofà."
    },
    {
      id: "viparita",
      sanskrit: "Viparita Karani",
      name: "Cames en Repòs a la Paret",
      breaths: "10 respiracions tranquil·les i fondes",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="22" y1="72" x2="220" y2="72" stroke="currentColor" stroke-width="1.5"/><line x1="196" y1="14" x2="196" y2="72" stroke="currentColor" stroke-width="2.2"/><rect x="158" y="64" width="32" height="7" rx="3" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="76" cy="63" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><line x1="86" y1="66" x2="184" y2="64" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><line x1="186" y1="64" x2="191" y2="20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Retorn venós · Sistema nerviós en pau</text></svg>',
      steps: [
        "1. Estira't d'esquena a prop d'una paret (o amb els panxells reposant damunt del sofà).",
        "2. Eleva les cames amb els genolls relaxats i deixa els braços oberts amb palmells amunt.",
        "3. Sent com es descarreguen els peus, les cames i tota la columna lumbar."
      ],
      comfort: "Variant amable: deixa 15 cm de marge amb la paret o recolza els panxells sobre dos coixins alts."
    },
    {
      id: "supta_baddha",
      sanskrit: "Supta Baddha Konasana",
      name: "Obertura Restaurativa sobre Coixins",
      breaths: "8 respiracions amples al pit i l'abdomen",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="18" y1="74" x2="242" y2="74" stroke="currentColor" stroke-width="1.5"/><path d="M52,73 L126,52 L126,73 Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,2"/><circle cx="64" cy="46" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><line x1="73" y1="51" x2="136" y2="68" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M136,68 Q168,52 198,70" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><rect x="156" y="64" width="24" height="9" rx="4" fill="none" stroke="currentColor" stroke-width="1.3"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Pit obert · Espatlles sostingudes</text></svg>',
      steps: [
        "1. Col·loca un o dos coixins al llarg per recolzar-hi l'esquena i el cap còmodament inclinats.",
        "2. Pots ajuntar les plantes dels peus amb un coixí sota cada genoll o estirar les cames.",
        "3. Deixa que les clavícules s'obrin sense cap esforç mentre l'aire entra amb llibertat."
      ],
      comfort: "Variant amable: posa sempre un suport tou sota les cuixes perquè no hi hagi gens de tirantor."
    },
    {
      id: "setu_bandha",
      sanskrit: "Setu Bandha Restauratiu",
      name: "Pont Suau amb Suport",
      breaths: "7 respiracions calmades i regulars",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="18" y1="74" x2="242" y2="74" stroke="currentColor" stroke-width="1.5"/><circle cx="64" cy="65" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M74,68 L142,48 L178,44 L202,73" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="132" y="51" width="22" height="22" rx="3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="3,2"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Suport sota el sacre · Coll llarg</text></svg>',
      steps: [
        "1. Estirada d'esquena amb els peus plans al terra a l'amplada dels malucs.",
        "2. Aixeca un instant la pelvis per lliscar un coixí ferm o una manta plegada sota el sacre.",
        "3. Deixa descansar tot el pes sobre el suport, afluixant glutis, espatlles i gola."
      ],
      comfort: "Variant amable: utilitza una manta baixa plegada en lloc d'un coixí alt per a màxima suavitat."
    },
    {
      id: "ardha_matsyendra",
      sanskrit: "Supta Matsyendrasana",
      name: "Torsió Suau al Terra",
      breaths: "5 respiracions per cada costat",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><circle cx="130" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><line x1="70" y1="38" x2="190" y2="38" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><line x1="130" y1="32" x2="130" y2="56" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M130,56 L174,58 L164,74" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="166" y="60" width="24" height="12" rx="5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="3,2"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Espatlles al terra · Torsió amable</text></svg>',
      steps: [
        "1. Estirada d'esquena, obre els braços en creu i apropa suaument els genolls cap al pit.",
        "2. Deixa caure tots dos genolls junts cap al costat dret sobre un coixí, mantenint les espatlles estables.",
        "3. Respira cap al costat esquerre de les costelles i després repeteix a l'altre cantó."
      ],
      comfort: "Variant amable: posa un coixí entre els genolls perquè la zona lumbar giri sense cap esforç."
    },
    {
      id: "uttanasana",
      sanskrit: "Uttanasana Flexionada",
      name: "Cascada d'Esquena amb Genolls Tous",
      breaths: "6 exhalacions deixant anar el pes del cap",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="36" y1="74" x2="224" y2="74" stroke="currentColor" stroke-width="1.5"/><path d="M114,74 L122,48 L112,26" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M112,26 Q142,24 148,52" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="149" cy="61" r="7.5" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M144,48 L142,68" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Genolls flexionats · Coll lliure</text></svg>',
      steps: [
        "1. Dreta amb els peus a l'amplada dels malucs i els genolls generosament flexionats.",
        "2. Deixa plegar el tronc damunt les cuixes agafant els colzes contraris amb les mans.",
        "3. Digues que sí i que no molt suau amb el cap per alliberar tota la tensió cervical."
      ],
      comfort: "Variant amable: recolza els avantbraços sobre el seient d'una cadira o el respatller del sofà."
    },
    {
      id: "apanasana",
      sanskrit: "Apanasana",
      name: "Abraçada de Genolls i Balancí Lumbar",
      breaths: "6 respiracions amb micro-balancí lateral",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="26" y1="72" x2="234" y2="72" stroke="currentColor" stroke-width="1.5"/><circle cx="78" cy="62" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><line x1="88" y1="68" x2="156" y2="68" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M156,68 L134,42 L166,46" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M108,64 L138,44" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Massatge suau del sacre i l\'esquena</text></svg>',
      steps: [
        "1. Estirada d'esquena sobre estora o catifa, porta els genolls cap a tu i sostingues-los amb les mans.",
        "2. Fes un balanceig petitíssim de dreta a esquerra donant un massatge suau a la zona lumbar.",
        "3. En inspirar allunya un centímetre els genolls; en exhalar acosta'ls sense tensar les espatlles."
      ],
      comfort: "Variant amable: posa una tovallola plegada sota el clatell perquè la barbeta quedi relaxada."
    },
    {
      id: "sukhasana_lat",
      sanskrit: "Parsva Sukhasana",
      name: "Obertura Lateral de Costelles",
      breaths: "4 respiracions profundes a cada costat",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="40" y1="74" x2="220" y2="74" stroke="currentColor" stroke-width="1.5"/><ellipse cx="130" cy="70" rx="34" ry="5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M130,66 Q128,44 142,32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="146" cy="24" r="7.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M132,44 L168,72" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M128,42 Q138,10 166,14" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Espai intercostal · Respiració àmplia</text></svg>',
      steps: [
        "1. Asseguda còmodament damunt d'un coixí o una cadira amb la columna llarga.",
        "2. Recolza la mà dreta al costat i eleva el braç esquerre formant un arc suau per sobre el cap.",
        "3. Sent com s'obre tot el lateral com un acordió ple d'aire fresc i canvia de costat."
      ],
      comfort: "Variant amable: mira cap avall o recte si el coll està carregat, sense forçar el gir cervical."
    },
    {
      id: "garudasana_arms",
      sanskrit: "Garudasana de Braços",
      name: "Alliberament d'Omòplats i Trapezi",
      breaths: "5 respiracions amples entre els omòplats",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><circle cx="130" cy="22" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M98,68 L104,42 L156,42 L162,68" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M116,44 Q130,54 134,26 M144,44 Q130,54 126,26" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M80,44 Q72,44 76,38 M180,44 Q188,44 184,38" fill="none" stroke="currentColor" stroke-width="1.4"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Destensar espatlles de carregar pes</text></svg>',
      steps: [
        "1. Asseguda o dreta, creua el braç dret sobre l'esquerre (o abraça't tocant els omòplats amb les mans).",
        "2. Baixa les espatlles lluny de les orelles mentre separes un pèl els colzes del pit.",
        "3. Respira sentint com es fon la càrrega acumulada a la part alta de l'esquena i canvia l'encreuament."
      ],
      comfort: "Variant amable: abraçar-te les espatlles directament és igual d'efectiu i molt més còmode."
    },
    {
      id: "cervical_release",
      sanskrit: "Griva Sanchalana",
      name: "Desbloqueig de Cervical i Mandíbula",
      breaths: "4 respiracions lentes per cada inclinació",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><path d="M94,72 Q130,58 166,72" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="130" y1="64" x2="138" y2="42" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="144" cy="30" r="11" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M108,28 Q130,12 154,18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3,3"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Llengua i mandíbula ben fluixes</text></svg>',
      steps: [
        "1. Seu amb les espatlles pesants i separa un mil·límetre les dents de dalt de les de baix.",
        "2. Deixa caure suaument l'orella dreta cap a l'espatlla dreta sense aixecar l'espatlla contrària.",
        "3. Fes mig cercle molt lent pel davant cap a l'altre costat tot exhalant un sospir silenciós."
      ],
      comfort: "Variant amable: mai portis el cap cap enrere; dibuixa només mitges llunes suaus pel davant."
    },
    {
      id: "heart_opener",
      sanskrit: "Anahata Mudra",
      name: "Obertura Suau de Pit i Clavícules",
      breaths: "6 inspiracions lluminoses i tranquil·les",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><circle cx="130" cy="24" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><line x1="130" y1="32" x2="130" y2="68" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M130,40 Q94,38 74,56 M130,40 Q166,38 186,56" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><circle cx="130" cy="44" r="14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3,3"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Contrarestar la postura encorbada</text></svg>',
      steps: [
        "1. Entrellaça els dits darrere l'esquena (o agafa els costats del respatller de la cadira).",
        "2. Roda suaument les espatlles cap enrere i cap avall obrint l'espai del pit.",
        "3. Inspira ampliant les clavícules i exhala mantenint les costelles baixes relaxades."
      ],
      comfort: "Variant amable: subjecta una tovallola petita entre totes dues mans darrere l'esquena per donar amplada."
    },
    {
      id: "savasana",
      sanskrit: "Savasana Conscient",
      name: "Descans Reparador amb Manta",
      breaths: "10 respiracions naturals sense cap esforç",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><line x1="20" y1="70" x2="240" y2="70" stroke="currentColor" stroke-width="1.5"/><circle cx="58" cy="61" r="8" fill="none" stroke="currentColor" stroke-width="2.3"/><path d="M68,65 L146,65 L168,57 L206,68" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><rect x="156" y="61" width="24" height="8" rx="4" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3,2"/><path d="M90,42 Q130,34 170,42" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="2,4"/><text x="130" y="90" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Integració profunda · Pes entregat al terra</text></svg>',
      steps: [
        "1. Estira't d'esquena (o de costat) ben abrigada amb una manta lleugera i un coixí sota els genolls.",
        "2. Recorre mentalment front, parpelles, espatlles, mans i peus deixant que pesin del tot.",
        "3. Descansa uns instants sense haver de fer ni resoldre absolutament res."
      ],
      comfort: "Variant amable: estirar-te de costat amb un coixí entre els genolls és igualment restaurador."
    },
    {
      id: "sigh_breath",
      sanskrit: "Pranayama Express",
      name: "Sospir Fisiològic Doble",
      breaths: "4 repeticions completes (1 minut)",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><path d="M22,66 Q56,28 86,34 Q108,12 130,14 Q182,18 238,66" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="86" cy="34" r="3.8" fill="currentColor"/><circle cx="130" cy="14" r="4.2" fill="currentColor"/><text x="52" y="86" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Inhala 1</text><text x="114" y="86" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">+Inhala 2</text><text x="194" y="86" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Exhala llarg</text></svg>',
      steps: [
        "1. Inspira pel nas omplint còmodament els pulmons.",
        "2. Sense treure l'aire, afegeix una segona petita inspiració curta pel nas.",
        "3. Exhala mooolt llarg i suau per la boca com si bufessis un plomall, buidant tota la pressa."
      ],
      comfort: "Ideal dreta a la cuina, al passadís o asseguda un minut abans d'entrar a casa."
    },
    {
      id: "breath_478",
      sanskrit: "Pranayama Nocturn",
      name: "Respiració Calmada 4–7–8",
      breaths: "4 cicles suaus i sense forçar",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><path d="M24,64 L78,24 L152,24 L236,64" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><line x1="78" y1="24" x2="78" y2="68" stroke="currentColor" stroke-width="1" stroke-dasharray="2,3"/><line x1="152" y1="24" x2="152" y2="68" stroke="currentColor" stroke-width="1" stroke-dasharray="2,3"/><text x="50" y="86" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Inspira 4</text><text x="115" y="86" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Pausa 7</text><text x="196" y="86" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Exhala 8</text></svg>',
      steps: [
        "1. Inspira silenciosament pel nas comptant a un ritme còmode fins a 4.",
        "2. Sostingues l'aire amb suavitat (sense estrènyer el coll) comptant fins a 7.",
        "3. Exhala lentament comptant fins a 8 i activant el fre parasimpàtic del descans."
      ],
      comfort: "Variant amable: si 4-7-8 et resulta llarg avui, fes el mateix patró suau en proporció 3-4-6."
    },
    {
      id: "nadi_shodhana",
      sanskrit: "Nadi Shodhana Suau",
      name: "Respiració Alterna Equilibrant",
      breaths: "5 rondes lentes i silencioses",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><path d="M56,64 C56,16 130,16 130,44 C130,70 204,70 204,22" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M56,22 C56,70 130,70 130,44 C130,16 204,16 204,64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray="4,3"/><circle cx="130" cy="44" r="4" fill="currentColor"/><text x="130" y="88" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Equilibri dels dos hemisferis</text></svg>',
      steps: [
        "1. Asseguda còmoda, tanca suaument la fossa dreta amb el polze i inspira lent per l'esquerra.",
        "2. Tanca l'esquerra amb l'anular, obre la dreta i exhala sense pressa; tot seguit inspira per la dreta.",
        "3. Canvia i exhala per l'esquerra completant una ronda que centra i serena l'atenció."
      ],
      comfort: "Variant amable: si tens el nas carregat, visualitza mentalment l'aire alternant cada costat sense tapar."
    },
    {
      id: "coherent_55",
      sanskrit: "Samavritti Suau",
      name: "Respiració Coherent 5–5",
      breaths: "8 onades iguals d'anada i tornada",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><path d="M20,46 Q48,14 76,46 T132,46 T188,46 T244,46" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><line x1="20" y1="46" x2="244" y2="46" stroke="currentColor" stroke-width="1" stroke-dasharray="3,3"/><text x="130" y="88" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">5s inspira pel nas · 5s exhala pel nas</text></svg>',
      steps: [
        "1. Inspira pel nas de forma contínua i rodona durant uns 5 segons.",
        "2. Sense pausa brusca, exhala pel nas amb la mateixa suavitat durant 5 segons més.",
        "3. Imagina una onada tranquil·la a la platja que puja i baixa harmonitzant el ritme cardíac."
      ],
      comfort: "Pots fer-la amb els ulls oberts mirant per la finestra o tancats amb una mà a l'abdomen."
    },
    {
      id: "bhramari_maitri",
      sanskrit: "Bhramari & Maitri",
      name: "Brunzit Calmant i Mà al Cor",
      breaths: "5 respiracions amb vibració suau",
      svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 95" width="100%" height="92"><circle cx="130" cy="43" r="30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,3"/><circle cx="130" cy="43" r="19" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="130" cy="43" r="5" fill="currentColor"/><text x="130" y="89" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor">Vibració vagal · Autocompassió serena</text></svg>',
      steps: [
        "1. Posa una mà al centre del pit i l'altra a l'abdomen, notant l'escalfor de les teves mans.",
        "2. Inspira pel nas i exhala fent un suau so «mmmm» amb els llavis tancats notant la vibració calmant.",
        "3. Digues-te amb amabilitat: «Ho estic fent amb estima; em dono permís per anar a poc a poc»."
      ],
      comfort: "Variant silenciosa: si hi ha algú dormint a prop, fes només l'exhalació nasal sentint l'escalfor de les mans."
    }
  ];

  // Seqüències harmòniques d'estudi per a cada estat d'ànim i durada (3, 5 o 8 passos)
  var YOGA_SEQUENCES = {
    esquena: {
      3: ["cervical_release", "garudasana_arms", "balasana"],
      5: ["cervical_release", "marjaryasana", "garudasana_arms", "apanasana", "balasana"],
      8: ["cervical_release", "heart_opener", "garudasana_arms", "marjaryasana", "uttanasana", "apanasana", "ardha_matsyendra", "savasana"]
    },
    ment: {
      3: ["sigh_breath", "nadi_shodhana", "bhramari_maitri"],
      5: ["sigh_breath", "cervical_release", "uttanasana", "nadi_shodhana", "bhramari_maitri"],
      8: ["sigh_breath", "cervical_release", "sukhasana_lat", "uttanasana", "balasana", "viparita", "nadi_shodhana", "savasana"]
    },
    vespre: {
      3: ["viparita", "breath_478", "savasana"],
      5: ["apanasana", "ardha_matsyendra", "viparita", "breath_478", "savasana"],
      8: ["cervical_release", "balasana", "apanasana", "ardha_matsyendra", "setu_bandha", "supta_baddha", "breath_478", "savasana"]
    },
    mati: {
      3: ["marjaryasana", "sukhasana_lat", "coherent_55"],
      5: ["cervical_release", "marjaryasana", "sukhasana_lat", "heart_opener", "coherent_55"],
      8: ["apanasana", "marjaryasana", "uttanasana", "sukhasana_lat", "garudasana_arms", "heart_opener", "coherent_55", "bhramari_maitri"]
    },
    flex: {
      3: ["sukhasana_lat", "marjaryasana", "ardha_matsyendra"],
      5: ["sukhasana_lat", "marjaryasana", "uttanasana", "ardha_matsyendra", "supta_baddha"],
      8: ["cervical_release", "sukhasana_lat", "heart_opener", "marjaryasana", "uttanasana", "apanasana", "ardha_matsyendra", "supta_baddha"]
    },
    express: {
      3: ["sigh_breath", "cervical_release", "bhramari_maitri"],
      5: ["sigh_breath", "cervical_release", "garudasana_arms", "heart_opener", "bhramari_maitri"],
      8: ["sigh_breath", "cervical_release", "garudasana_arms", "sukhasana_lat", "heart_opener", "uttanasana", "coherent_55", "bhramari_maitri"]
    }
  };

  // ==================== 34 IDEES DE JOC I CONNEXIÓ SENSE PANTALLES ====================
  var PLAY_CATS = [
    { id: "all", label: "Tots" },
    { id: "sofa", label: "Sofà · Energia Mínima" },
    { id: "casa", label: "Tarda a Casa" },
    { id: "riure", label: "10 Min de Riure" },
    { id: "vespre", label: "Calma de Vespre" }
  ];

  var PLAY_IDEAS = [
    // --- Sofà · Energia Mínima (9) ---
    { id: "p_pizzeria", cat: "sofa", age: "2–8a", title: "La Pizzeria a l'Esquena", desc: "Estira't panxa avall al sofà: tu ets la massa de pizza i l'infant amassa, posa tomàquet, orenga i «enforna» amb les mans." },
    { id: "p_autopista", cat: "sofa", age: "1–6a", title: "Autopista de Cotxets Humana", desc: "Estirada amb una samarreta vella, les teves cames i esquena són muntanyes i túnels per on fa circular cotxets de fusta." },
    { id: "p_endevina_lletra", cat: "sofa", age: "5–12a", title: "Pissarra Màgica a l'Esquena", desc: "Tu descanses amb els ulls tancats i ell et dibuixa amb el dit una lletra, un número o una forma perquè l'endevinis." },
    { id: "p_hotel_cinc", cat: "sofa", age: "3–9a", title: "L'Hotel de les Mantes", desc: "Ets un hoste molt cansat que arriba a un hotel d'estrelles: et tapen amb mantes, et porten coixins al cap i et llegeixen el menú." },
    { id: "p_estatuas_sofa", cat: "sofa", age: "3–8a", title: "Jutge d'Estàtues des del Coixí", desc: "Tu cantes uns segons estirada al sofà i quan calles s'ha de quedar congelat en una postura ben divertida." },
    { id: "p_veterinari", cat: "sofa", age: "2–7a", title: "Consulta de Peluixos i Cures", desc: "Tu ets un gat o ós adormit al sofà que necessita que li escoltin el cor, li pentinin els cabells i el tapin bé." },
    { id: "p_fred_calent", cat: "sofa", age: "3–10a", title: "Tresor Amagat amb «Fred o Calent»", desc: "Amaga un petit objecte prop del saló abans de seure i guia'l només amb la veu («tebi, calent, cremant!») sense aixecar-te." },
    { id: "p_endevina_so", cat: "sofa", age: "2–9a", title: "Detectiu de Sons amb Ulls Tancats", desc: "Tanques els ulls al sofà i ell fa sonar tres objectes quotidians de casa d'un en un perquè endevinis què són." },
    { id: "p_conte_tres_paraules", cat: "sofa", age: "5–12a", title: "Història Boja a Torns", desc: "Estirats de costat, cadascú afegeix una frase a un conte inventat incloent tres paraules que tria l'altre." },

    // --- Tarda a Casa (9) ---
    { id: "p_cabana", cat: "casa", age: "1–10a", title: "Arquitectes de Cabanes", desc: "Dues cadires, un llençol gran, pinces d'estendre i llibres a dins per crear el refugi de lectura més acollidor." },
    { id: "p_circuit_cinta", cat: "casa", age: "2–8a", title: "Passarel·la de Cinta de Pintor", desc: "Enganxa tres línies de cinta de paper al passadís (recta, ziga-zaga i salt) per caminar d'equilibristes sense sortir-ne." },
    { id: "p_correus", cat: "casa", age: "3–9a", title: "Carteria Domèstica", desc: " Amb sobres reciclats i gomets, dibuixeu postals i repartiu cartes per les bústies de cada porta de casa." },
    { id: "p_museu_fira", cat: "casa", age: "4–11a", title: "Exposició de Museu al Saló", desc: " Tria les seves creacions, pedres o construccions, fa entrades de paper i et fa una visita guiada com a comissari." },
    { id: "p_ombres_paret", cat: "casa", age: "2–10a", title: "Teatre d'Ombres amb Llanterna", desc: "Baixeu les persianes i amb una petita llanterna feu ocells, conills i perfils gegants projectats a la paret blanca." },
    { id: "p_botiga_llegums", cat: "casa", age: "1–5a", title: "Transvasaments de Cuina", desc: "Una safata de forn amb cigrons secs (per a +3a) o aigua i embuts, cullerots i pots de plàstic de diferents mides." },
    { id: "p_avio_paper", cat: "casa", age: "4–12a", title: "Campionat d'Avions Planadors", desc: "Plegueu tres models diferents d'avió de paper reciclat i proveu quin planeja més suau i més lluny pel passadís." },
    { id: "p_cerca_colors", cat: "casa", age: "2–7a", title: "Safata de l'Arc de Sant Martí", desc: "Missió d'exploració: trobar per casa un objecte petit i segur de cadascun dels sis colors de l'arc de Sant Martí." },
    { id: "p_comic_plegat", cat: "casa", age: "6–12a", title: "El Cadàver Exquisit Dibuixat", desc: "Plegueu un foli en tres parts: un dibuixa el cap, plega, l'altre el tronc i l'últim les cames; en obrir-lo és hilarant!" },

    // --- 10 Min de Riure (8) ---
    { id: "p_mitjons_basquet", cat: "riure", age: "2–11a", title: "Encistellar Mitjons al Cistell", desc: "Feu boletes amb els mitjons nets acabats de plegar i proveu tirs des de tres distàncies diferents dins el cistell." },
    { id: "p_mirall_mico", cat: "riure", age: "1–9a", title: "El Mirall Esbojarrat", desc: "Poseu-vos cara a cara: durant dos minuts tu has d'imitar exactament cada moviment lent o ganyota que faci ell!" },
    { id: "p_globus_aire", cat: "riure", age: "3–12a", title: "El Globus No Toca Terra", desc: "Un sol globus inflat i un repte cooperatiu d'equip: quants tocs seguits fem entre tots sense que toqui la catifa?" },
    { id: "p_cambrer_equilibri", cat: "riure", age: "3–9a", title: "Cursa de Tortugues en Càmera Lenta", desc: "Guanya qui arriba ÚLTIM d'una punta a l'altra del passadís sense aturar-se del tot, movent-se a càmera superlenta!" },
    { id: "p_endevina_animal", cat: "riure", age: "2–10a", title: "Mímica d'Animals i Oficis", desc: "Representar sense paraules com camina un pingüí, un astronauta o un gat estirant-se fins que l'altre ho encerti." },
    { id: "p_coixi_cap", cat: "riure", age: "3–10a", title: "Desfilada amb Coixí al Cap", desc: "Caminar amb un coixinet petit al cap mantenint l'esquena dreta; si cau et quedes congelat fins que l'altre et toca el colze." },
    { id: "p_sopa_riure", cat: "riure", age: "5–12a", title: "Aguantar el Riure Mirant-se", desc: "Seu l'un davant de l'altre intentant mantenir cara seriosa: el primer que somriu li fa xocar les dues mans a l'altre." },
    { id: "p_ball_pausa", cat: "riure", age: "1–10a", title: "Dues Cançons de Ball Lliure", desc: "Posar dues cançons alegres per sacsejar braços, espatlles i cames i deixar anar tota la tensió escolar del dia." },

    // --- Calma de Vespre (8) ---
    { id: "p_vaixell_panxa", cat: "vespre", age: "2–9a", title: "El Vaixell de Paper a la Panxa", desc: "Estirats d'esquena amb un peluix petit a l'abdomen, feu pujar i baixar el vaixell amb respiracions molt lentes." },
    { id: "p_tres_tresors", cat: "vespre", age: "4–12a", title: "Els Tres Petits Tresors del Dia", desc: "Amb la llum tènue, cadascú comparteix tres petits moments bonics o divertits que hagin passat avui." },
    { id: "p_massatge_pluja", cat: "vespre", age: "1–11a", title: "El Temps Meteorològic a l'Esquena", desc: "Dibuixa amb els palmells sol càlid (cercles), plugim fi (puntets dels dits), vent suau i finalment nit serena." },
    { id: "p_ioga_arbre_gat", cat: "vespre", age: "2–10a", title: "Ioga de Bosc abans del Pijama", desc: "Fer junts tres postures d'animals tranquils: el gat que s'estira, la papallona asseguda i la pedra que dorm." },
    { id: "p_audioconte_manta", cat: "vespre", age: "3–12a", title: "Lectura a Duo Sota la Manta", desc: "Llegir en veu suau un capítol per capítol (o vinyeta per vinyeta) arraulits amb llum groga càlida." },
    { id: "p_pot_calma", cat: "vespre", age: "2–9a", title: "Observar l'Aigua en Calma", desc: "Mirar caure lentament la sorra d'un rellotge de sorra o purpurina en aigua mentre respireu en silenci fins que reposa." },
    { id: "p_escaner_manta", cat: "vespre", age: "4–12a", title: "Bona Nit a Cada Part del Cos", desc: "Des dels dits dels peus fins a les celles, aneu donant mentalment les «bones nits» a cames, panxa, mans i pensaments." },
    { id: "p_musica_dibuix", cat: "vespre", age: "5–12a", title: "Mandales o Traços Lents amb Piano", desc: "Deu minuts de música instrumental suau pintant cercles o sanefes amb llapis de fusta sense cap pressa." }
  ];

  // ==================== 38 FRASES PONT PER TEMÀTICA ====================
  var PHRASE_CATS = [
    { id: "all", label: "Totes" },
    { id: "emocions", label: "Emocions Intenses" },
    { id: "rutines", label: "Rutines i Pressa" },
    { id: "germans", label: "Germans i Convivència" },
    { id: "autoestima", label: "Autoestima" },
    { id: "reparacio", label: "Reparació i Autocura" }
  ];

  var CHEATSHEET = [
    // --- Emocions Intenses (8) ---
    { id: "f1", cat: "emocions", sit: "Desbordament intens", say: "«Veig que estàs molt enfadat ara mateix. Soc aquí a prop per quan vulguis una abraçada.»" },
    { id: "f2", cat: "emocions", sit: "Quan tot li sembla malament", say: "«Avui tens la bateria baixeta i tot es fa costa amunt. Anem a poc a poc junts.»" },
    { id: "f3", cat: "emocions", sit: "Desig que no pot ser avui", say: "«T'encantaria quedar-nos més estona, oi? Costa molt acomiadar-se quan t'ho passes tan bé.»" },
    { id: "f4", cat: "emocions", sit: "Separar emoció d'acció", say: "«Tens tot el dret d'estar enfadat, i alhora ens cuidem les mans i ens parlem amb respecte.»" },
    { id: "f5", cat: "emocions", sit: "Por nocturna o inseguretat", say: "«La teva habitació és ben segura i jo soc aquí al costat; fem tres respiracions llargues junts.»" },
    { id: "f6", cat: "emocions", sit: "Decepció quan es canvia un pla", say: "«Fa ràbia que la pluja canviï l'excursió. Pensem quin pla especial podem muntar a casa!»" },
    { id: "f7", cat: "emocions", sit: "Quan vol comprar-ho tot a la botiga", say: "«Quina joguina més xula! L'apuntem a la nostra llista d'idees per a l'aniversari?»" },
    { id: "f8", cat: "emocions", sit: "Quan es tanca i no vol parlar encara", say: "«Veig que ara necessites el teu espai. Soc a la cuina per quan et vingui de gust xerrar.»" },

    // --- Rutines i Pressa (8) ---
    { id: "f9", cat: "rutines", sit: "Resistència a entrar al bany", say: "«Toca banyera! Prefereixes anar-hi caminant com un cranc o fent salts de granota?»" },
    { id: "f10", cat: "rutines", sit: "Vestir-se al matí sense lluita", say: "«Avui fa fresca i toca jersei: tries el blau marí o el de ratlles verdes?»" },
    { id: "f11", cat: "rutines", sit: "Anticipar marxar del parc", say: "«Queden cinc minuts: vols fer les dues últimes baixades al tobogan o als gronxadors?»" },
    { id: "f12", cat: "rutines", sit: "Recollir joguines abans de sopar", say: "«Fem equip de dos minuts amb música: tu guardes els cotxes o les peces de fusta?»" },
    { id: "f13", cat: "rutines", sit: "Verdura o menjar nou a taula", say: "«No cal que t'ho mengis si avui no et ve de gust; ho deixem al plat i gaudim del sopar plegats.»" },
    { id: "f14", cat: "rutines", sit: "Apagar pantalles segons l'acord", say: "«Quan acabi aquesta escena prems tu el botó d'apagar i em dius què ha passat al capítol!»" },
    { id: "f15", cat: "rutines", sit: "Pista curta quan es distreu", say: "«Veig una vamba posada i l'altra esperant el peu dret a l'entrada!»" },
    { id: "f16", cat: "rutines", sit: "Rentar dents amb joc", say: "«Obre boca de lleó a veure si trobo on s'ha amagat el trosset de truita d'avui!»" },

    // --- Germans i Convivència (7) ---
    { id: "f17", cat: "germans", sit: "Disputa per una mateixa joguina", say: "«Veig dos germans i un sol camió. Quina idea justa se us acudeix perquè funcioni per a tots dos?»" },
    { id: "f18", cat: "germans", sit: "Gelosia i necessitat d'exclusivitat", say: "«M'has hagut d'esperar força estona avui. A les set tenim els nostres quinze minuts només tu i jo!»" },
    { id: "f19", cat: "germans", sit: "Evitar comparar un amb l'altre", say: "«Cadascú de vosaltres té el seu propi ritme; a tu ara et falta guardar l'estoig a la motxilla.»" },
    { id: "f20", cat: "germans", sit: "Torns al sorral o al parc", say: "«Ara ell està omplint aquesta galleda; quan l'acabi d'abocar serà el teu torn!»" },
    { id: "f21", cat: "germans", sit: "Quan s'interrompen parlant a taula", say: "«Tinc ganes d'escoltar-vos a tots dos sencers: acaba la idea ell i tot seguit t'escolto a tu.»" },
    { id: "f22", cat: "germans", sit: "Respectar salutacions sense forçar petons", say: "«Pots saludar com et sentis més còmode: dient hola, amb la mà o xocant els cinc.»" },
    { id: "f23", cat: "germans", sit: "Acompanyar un petit accident a casa", say: "«S'ha vessat l'aigua sense voler! Cap problema, agafem un drap cadascú i queda sec en un moment.»" },

    // --- Autoestima i Preadolescència (8) ---
    { id: "f24", cat: "autoestima", sit: "«A mi això no em surt mai!»", say: "«ENCARA no et surt, però cada vegada que ho proves el teu cervell es fa més hàbil.»" },
    { id: "f25", cat: "autoestima", sit: "Valorar un dibuix o projecte", say: "«Quina combinació de colors i detalls tan viva! Quina part has gaudit més fent?»" },
    { id: "f26", cat: "autoestima", sit: "Tornant d'un partit o activitat", say: "«M'ha encantat veure't jugar i passar-t'ho tan bé amb l'equip avui!»" },
    { id: "f27", cat: "autoestima", sit: "Quan un preadolescent s'obre a parlar", say: "«Gràcies per explicar-m'ho. Vols que només t'escolti o vols que pensem opcions junts?»" },
    { id: "f28", cat: "autoestima", sit: "Davant una nota baixa després d'esforçar-se", say: "«Una nota és només una foto d'avui; valoro molt el teu esforç i demà mirarem nous trucs d'estudi.»" },
    { id: "f29", cat: "autoestima", sit: "Contestació brusca als 10–12 anys", say: "«Jo et parlo amb bon to i m'agrada que ens tractem amb respecte. Parlem quan estiguis més tranquil.»" },
    { id: "f30", cat: "autoestima", sit: "Respectar la porta tancada", say: "«Toc-toc! Respecto la teva estona tranquil·la; quan vulguis tenim fruita tallada a la cuina.»" },
    { id: "f31", cat: "autoestima", sit: "Beneir que es facin grans", say: "«M'encantava quan eres menut, i encara m'agrada més conversar i descobrir qui ets avui!»" },

    // --- Reparació i Autocura (7) ---
    { id: "f32", cat: "reparacio", sit: "Disculpar-se després d'alçar la veu", say: "«Perdona'm per haver parlat tan fort. Estava molt cansada i m'he desbordat; no és culpa teva.»" },
    { id: "f33", cat: "reparacio", sit: "Avisar abans de perdre la paciència", say: "«Noto que m'estic atabalant; faig tres respiracions lentes a la finestra per parlar-te amb calma.»" },
    { id: "f34", cat: "reparacio", sit: "Demanar relleu clar a la parella", say: "«Amor, tinc la bateria molt justa ara mateix: pots agafar tu el relleu del bany vint minuts?»" },
    { id: "f35", cat: "reparacio", sit: "Mantra intern per deixar anar la culpa", say: "«La criança sana no és perfecció impossible: és presència real i saber reparar amb amor.»" },
    { id: "f36", cat: "reparacio", sit: "Simplificar un vespre d'esgotament", say: "«Avui un sopar senzill i un conte arraulits en calma és el millor pla del món.»" },
    { id: "f37", cat: "reparacio", sit: "Posar un límit serè a comentaris externs", say: "«Gràcies per l'interès; a casa ens funciona molt bé fer-ho a aquest ritme.»" },
    { id: "f38", cat: "reparacio", sit: "Tancar el dia amb autocompassió", say: "«Avui he acompanyat, he cuidat i he estimat amb l'energia que tenia. Ara em toca descansar.»" }
  ];

  // ==================== FITES D'ACOMPANYAMENT ====================
  var BADGES = [
    { id: "port_segur", title: "♥ Port Segur", desc: "Completar les primeres 10 situacions familiars" },
    { id: "cami_complet", title: "✦ Mirada 0–12 Anys", desc: "Explorar almenys 3 escenes de cadascuna de les 5 etapes" },
    { id: "estudi_calma", title: "◯ Estudi en Calma", desc: "Completar 3 sessions de ioga restauratiu i respiració" },
    { id: "joc_viu", title: "☆ Connexió en Joc", desc: "Marcar 5 idees de joc sense pantalles per fer a casa" },
    { id: "paraula_pont", title: "❝ Paraules Pont", desc: "Desar 5 frases clau preferides al teu recull" },
    { id: "mestre_calma", title: "☀ Far Serè (40+)", desc: "Viure 40 o més situacions al llarg de les etapes" }
  ];

  window.CalmData.crianca = {
    STAGES: STAGES,
    SCENES: SCENES,
    YOGA_MOODS: YOGA_MOODS,
    YOGA_LENGTHS: YOGA_LENGTHS,
    ASANAS: ASANAS,
    YOGA_SEQUENCES: YOGA_SEQUENCES,
    PLAY_CATS: PLAY_CATS,
    PLAY_IDEAS: PLAY_IDEAS,
    PHRASE_CATS: PHRASE_CATS,
    CHEATSHEET: CHEATSHEET,
    BADGES: BADGES
  };
})();
