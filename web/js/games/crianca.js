// Joc 4: Créixer amb Calma (Simulador Interactiu de Criança Respectuosa, Vincle i Calma)
(function () {
  window.CalmGames = window.CalmGames || {};

  var STORAGE_KEY = "crianca_state_v1";

  var SCENES = [
    {
      id: "got_blau", stage: "1-3", stageLabel: "2 ANYS · AUTONOMIA",
      title: "El drama del got del color «equivocat»",
      body: "Li serveixes aigua al got verd que ell mateix havia demanat fa deu segons, però ara es tira a terra plorant desconsolat perquè volia el got blau.",
      opts: [
        {
          k: "A", t: "«Va, no ploris per aquesta bajanada, l'aigua té el mateix gust!»", s: "Racionalitzar en calent",
          vincle: -5, reg: -2, calma: -4,
          react: "Plora encara més fort perquè sent que ningú entén el seu disgust.",
          neuro: "Als 2 anys el cervell racional està desconnectat durant el plor. No plora pel got: descarrega cansament acumulat buscant un port segur.",
          phrase: "«Volies el got blau i t'ha sabut molt greu. Sóc aquí amb tu.»"
        },
        {
          k: "B", t: "Córrer de pressa a rentar el got blau perquè calli al moment", s: "Evitar la frustració cedint amb ansietat",
          vincle: +2, reg: -6, calma: -6,
          react: "Es calma uns segons, però demana canviar també el plat i la cullera.",
          neuro: "Si evitem qualsevol petita frustració per por al plor, li costa més descobrir que les emocions intenses vénen i marxen sense perill.",
          phrase: "«Entenc que volies el blau. Avui el blau és al rentaplats; vols beure del verd o d'aquesta tassa?»"
        },
        {
          k: "C", t: "Ajupir-te a la seva alçada, validar el disgust amb veu baixa i mantenir la calma", s: "Connexió emocional + límit serè",
          vincle: +10, reg: +9, calma: +2,
          react: "Plora un minut abraçat a tu, fa un sospir llarg i acaba bevent del got verd.",
          neuro: "Co-regulació pura: el teu sistema nerviós calmat li presta l'escorça prefrontal que el seu cervell encara està construint.",
          phrase: "«Estàs enfadat perquè volies el blau. T'entenc, carinyo. Quan estiguis a punt, l'aigua t'espera aquí.»"
        }
      ]
    },
    {
      id: "sabates_pluja", stage: "1-3", stageLabel: "3 ANYS · LÍMITS AMB PRESSA",
      title: "8:15 del matí: vol sortir amb sandàlies sota la pluja",
      body: "Arribeu justos de temps i s'entesta a posar-se les sandàlies d'estiu mentre fora plou i fa fred.",
      opts: [
        {
          k: "A", t: "Posar-li les botes a la força mentre es regira cridant", s: "Imposició física per pressa",
          vincle: -7, reg: -4, calma: -9,
          react: "Sortiu per la porta tots dos alterats i amb mal cos per començar el dia.",
          neuro: "Quan un infant sent que perd tot el control sobre el seu cos, s'activa la resposta instintiva de lluita o resistència.",
          phrase: "Oferir dues opcions vàlides satisfà la seva set d'autonomia sense cedir en la seguretat."
        },
        {
          k: "B", t: "«Plou i toca botes. Vols posar-te tu el peu dret o vols que fem una cursa de botes?»", s: "Límit ferm + joc i elecció acotada",
          vincle: +9, reg: +10, calma: +4,
          react: "Dubta un instant, riu quan fas veure que la bota parla i hi fica el peu tot orgullós.",
          neuro: "El joc segrega oxitocina i dopamina, desactivant el bloqueig opositor en segons sense perdre el límit.",
          phrase: "«Les sandàlies es queden cuidant la casa; avui tries tu: mitjons de ratlles o d'estrelles amb les botes?»"
        },
        {
          k: "C", t: "Deixar-lo sortir amb sandàlies sota l'aiguat sense dir res per cansament", s: "Permissivitat per esgotament",
          vincle: -2, reg: +1, calma: -5,
          react: "Als dos minuts té els peus xops i glaçats i heu de tornar a pujar a canviar-vos.",
          neuro: "Els límits de salut i seguretat ens corresponen als adults; sostenir-los amb suavitat dóna estructura i pau a l'infant.",
          phrase: "«La meva feina és cuidar que els teus peus estiguin secs i calentons.»"
        }
      ]
    },
    {
      id: "pegar_parc", stage: "1-3", stageLabel: "2-3 ANYS · IMPULSIVITAT",
      title: "Alça la mà per pegar quan li prenen la pala",
      body: "Al sorral del parc, un altre infant li agafa el cubell i el teu fill alça el braç furiós a punt de colpejar-lo.",
      opts: [
        {
          k: "A", t: "Aturar-li la mà amb suavitat i fermesa: «No deixem que et peguin ni peguem. Estàs molt enfadat!»", s: "Fermesa amable i contenció segura",
          vincle: +8, reg: +11, calma: +3,
          react: "Es posa a plorar d'impotència als teus braços en lloc de pegar, i després demaneu el cubell amb paraules.",
          neuro: "Separar l'emoció (totes són vàlides: té dret a enfadar-se) de la conducta (pegar no es permet) és la base de l'educació emocional.",
          phrase: "«T'aturo la mà per cuidar-vos. Pots estar molt enfadat, però no fem mal.»"
        },
        {
          k: "B", t: "Cridar-li davant de tothom: «Ets un nen dolent! Demana perdó ara mateix!»", s: "Etiqueta i vergonya pública",
          vincle: -10, reg: -6, calma: -8,
          react: "Baixa el cap humiliat o murmura un «perdó» robòtic sense entendre res.",
          neuro: "Les etiquetes («ets dolent/agressiu») es converteixen en profecies que l'infant interioritza, i la vergonya bloqueja l'empatia real.",
          phrase: "En comptes de forçar un perdó buit, modela l'empatia: «Mirem com està l'altre nen i com ho arreglem»."
        },
        {
          k: "C", t: "Mirar cap a una altra banda esperant que s'arreglin sols", s: "Manca de guia en edat immadura",
          vincle: -4, reg: -7, calma: -2,
          react: "El cop arriba, l'altre infant plora i es genera un conflicte més gran.",
          neuro: "Fins als 4-5 anys el fre inhibitori cerebral és molt immadur; necessiten que l'adult actuï com a fre extern tranquil.",
          phrase: "«Veig que tots dos voleu la mateixa pala. Fem torns!»"
        }
      ]
    },
    {
      id: "marxar_parc", stage: "4-6", stageLabel: "4 ANYS · TRANSICIONS",
      title: "«No vull marxar del parc, cinc minuts més!»",
      body: "Ja és fosc, toca bany i sopar, però cada vegada que dius de marxar s'amaga darrere el tobogan.",
      opts: [
        {
          k: "A", t: "Avisar 5 minuts abans, pactar «l'última baixada» i acomiadar els gronxadors junts", s: "Anticipació + ritual de tancament",
          vincle: +9, reg: +9, calma: +5,
          react: "Fa l'última tirada sentint-se respectat i et dóna la mà dient adéu al tobogan.",
          neuro: "Als infants els costa canviar d'activitat de cop quan estan en estat de flux. Anticipar prepara el cervell per a la transició.",
          phrase: "«Queden dues tirades: les tries al tobogan gran o als gronxadors abans de dir adéu al parc?»"
        },
        {
          k: "B", t: "Amenaçar: «Adéu, jo me'n vaig i et quedes aquí sol!»", s: "Por a l'abandonament per obediència ràpida",
          vincle: -14, reg: -5, calma: -4,
          react: "Ve corrent espantat i plorant, aferrant-se a la teva cama amb angúnia.",
          neuro: "Funciona a curt termini perquè activa el pànic primari d'abandonament, però erosiona profundament la seguretat d'aferrament.",
          phrase: "Mai condicionem la nostra presència: «És hora de marxar, anem de la mà o fent salts de granota?»"
        },
        {
          k: "C", t: "Dir «va, 5 minuts més» quatre vegades seguides fins perdre la paciència", s: "Límit difús que acaba en esclat",
          vincle: -4, reg: -6, calma: -10,
          react: "Aprèn que insistir estira el límit i acabeu discutint quan ja sou tardíssim.",
          neuro: "Els límits elàstics generen incertesa i conviden a provar fins on aguanta l'adult. Poques normes però clares i previsibles relaxen tothom.",
          phrase: "Avisar un cop i complir-ho amb dolçor i fermesa."
        }
      ]
    },
    {
      id: "gelosia_germa", stage: "4-6", stageLabel: "5 ANYS · GERMANS & VINCLE",
      title: "«Només fas cas al bebè, a mi ja no m'estimes!»",
      body: "Estàs donant el pit o el biberó al petit i el gran et llança un coixí des del sofà amb els ulls plens de llàgrimes.",
      opts: [
        {
          k: "A", t: "Renyar-lo: «Però si ets el gran! Has de donar exemple i no dir tonteries!»", s: "Invalidar el dol del destronament",
          vincle: -9, reg: -5, calma: -6,
          react: "S'enfonsa al sofà sentint que a més d'haver perdut exclusivitat és culpable per sentir gelosia.",
          neuro: "Exigir a un nen de 5 anys que «sigui gran» li roba la infància. La gelosia és amor que té por de perdre el seu lloc.",
          phrase: "«Encara que siguis el gran, segueixes sent el meu petit i et necessito a prop.»"
        },
        {
          k: "B", t: "Obrir el braç lliure: «Tens raó que avui m'has hagut d'esperar molt. Vine aquí amb mi!»", s: "Acollir la ferida + reservar 15 min exclusius",
          vincle: +13, reg: +8, calma: +4,
          react: "S'acosta a poc a poc, recolza el cap a la teva espatlla i es fon la tensió.",
          neuro: "15 minuts diaris d'atenció exclusiva 1-a-1 sense mòbil omplen el «dipòsit emocional» i redueixen dràsticament les crides d'atenció.",
          phrase: "«Quan acabi amb el germanet, tenim els nostres 15 minuts sagrats només tu i jo. A què voldràs jugar?»"
        },
        {
          k: "C", t: "Comprar-li una joguina nova per compensar la culpa", s: "Compensació material",
          vincle: +1, reg: -4, calma: -2,
          react: "Obre el paquet il·lusionat 5 minuts, però al vespre torna el malestar.",
          neuro: "Una necessitat de presència i pertinença no es calma amb objectes; només la mirada i el contacte l'omplen.",
          phrase: "Presència per sobre de regals."
        }
      ]
    },
    {
      id: "por_nit", stage: "4-6", stageLabel: "4-5 ANYS · SON & SEGURETAT",
      title: "23:30h: «Hi ha una ombra estranya a l'armari!»",
      body: "Et crida des del llit amb el cor accelerat. És la segona vegada que et lleves i estàs cansada.",
      opts: [
        {
          k: "A", t: "«Els monstres no existeixen, tanca els ulls i dorm d'una vegada!»", s: "Negar la por amb lògica adulta",
          vincle: -7, reg: -4, calma: -5,
          react: "Es queda sol al fosc amb la mateixa por i et torna a cridar deu minuts després.",
          neuro: "Entre els 4 i 6 anys la imaginació s'expandeix explosivament i el cervell encara barreja fantasia i perill real a les fosques.",
          phrase: "El monstre no és real, però la seva por sí que és 100% real."
        },
        {
          k: "B", t: "Abraçar-lo, respirar lentament junts 3 cops i inspeccionar l'ombra amb ell", s: "Seguretat física + respiració compartida",
          vincle: +11, reg: +9, calma: +3,
          react: "Descobreix que l'ombra és la jaqueta, nota el teu batec lent i s'adorm en pau en tres minuts.",
          neuro: "Sincronitzar la respiració adulta lenta amb la de l'infant activa el nervi vague i frena el cortisol nocturn.",
          phrase: "«La teva habitació és segura i jo sóc a l'habitació del costat cuidant el teu son.»"
        },
        {
          k: "C", t: "Encendre tots els llums i posar dibuixos animats perquè es distregui", s: "Sobreestimulació nocturna",
          vincle: +3, reg: -8, calma: -9,
          react: "Es desvetlla completament fins a la 1:30 de la matinada.",
          neuro: "La llum blava i l'acció ràpida suprimeixen la melatonina i trenquen l'arquitectura del son.",
          phrase: "Llum tènue càlida, veu xiuxiuejant i moviments lents."
        }
      ]
    },
    {
      id: "adult_perd_nervis", stage: "4-6", stageLabel: " TOTES LES EDATS · REPARACIÓ",
      title: "Avui has perdut els nervis i has cridat",
      body: "Portaves un dia esgotador, s'ha vessat tot el bol de llet a terra i has deixat anar un crit desproporcionat. Es queda glaçat mirant-te amb ulls tristos.",
      opts: [
        {
          k: "A", t: "Respirar fons, ajupir-te i demanar-li disculpes sinceres assumint la teva part", s: "Reparació honesta del vincle",
          vincle: +14, reg: +12, calma: +8,
          react: "T'abraça fort i diu «no passa res, anem a buscar el drap junts».",
          neuro: "La criança sana NO és perfecció (impossible!), sinó REPARACIÓ. Quan et veu demanar perdó, aprèn responsabilitat emocional i que l'amor és incondicional.",
          phrase: "«Perdona'm per haver cridat. Estava molt cansada i m'he desbordat, però no és culpa teva. Recollim-ho junts.»"
        },
        {
          k: "B", t: "Justificar el crit: «És que em fas enfadar perquè mai mires què fas!»", s: "Culpar l'infant del nostre desbordament",
          vincle: -11, reg: -7, calma: -6,
          react: "Calla i aprèn que ell és responsable de l'estat d'ànim dels adults.",
          neuro: "Fer l'infant responsable de la nostra regulació emocional és una càrrega massa pesada per a la seva edat.",
          phrase: "Els accidents passen; les nostres reaccions són responsabilitat nostra."
        },
        {
          k: "C", t: "No dir res, recollir en silenci tens i castigar-te per dins sentint-te mala mare/pare", s: "Culpa silenciosa sense tancament",
          vincle: -3, reg: -2, calma: -12,
          react: "L'ambient queda enrarit tota la nit i tu te'n vas a dormir amb un nus a l'estómac.",
          neuro: "La culpa paralitza i esgota; la responsabilitat amable repara en un minut i us allibera a tots dos.",
          phrase: "Sigues tan amable amb tu mateixa avui com voldries que ell ho sigui amb si mateix demà."
        }
      ]
    },
    {
      id: "soc_tonto", stage: "7-9", stageLabel: "7 ANYS · AUTOESTIMA & FRUSTRACIÓ",
      title: "Trenca el full: «Sóc tonto, a mi no em surt res bé!»",
      body: "Intentant fer un dibuix o uns exercicis, s'equivoca dues vegades, arruga el paper amb ràbia i es compara amb els altres.",
      opts: [
        {
          k: "A", t: "«No diguis això! Si ets el nen més llest del món, mira que bonic t'ha quedat!»", s: "Elogi exagerat que nega el que sent",
          vincle: +2, reg: -4, calma: 0,
          react: "No s'ho creu: pensa «ho dius només perquè ets la meva mare/pare» i segueix frustrat.",
          neuro: "Segons Carol Dweck, elogiar etiquetes fixes («ets molt llest») fa que tinguin pànic a equivocar-se per no perdre l'etiqueta.",
          phrase: "Valora el procés i normalitza l'error com a gimnàs del cervell."
        },
        {
          k: "B", t: "Validar la frustració, fer una pausa d'aigua i afegir la paraula màgica «ENCARA»", s: "Mentalitat de creixement + pausa reguladora",
          vincle: +10, reg: +13, calma: +4,
          react: "Respira, riu una mica i decideix provar una línia nova sense tanta pressió.",
          neuro: "Quan ens equivoquem i ho tornem a provar és literalment quan es creen més connexions sinàptiques noves!",
          phrase: "«Fa molta ràbia quan no surt a la primera. Encara no et surt, però el teu cervell ja està entrenant. Fem un glop d'aigua?»"
        },
        {
          k: "C", t: "Agafar-li el llapis i acabar-l'hi tu perquè quedi perfecte", s: "Sobreprotecció que roba competència",
          vincle: -1, reg: -9, calma: -2,
          react: "El treball queda polit, però el missatge intern que rep és «tu sol no pots».",
          phrase: "Mai facis de manera habitual per a un infant allò que ja pot intentar per si mateix amb acompanyament."
        }
      ]
    },
    {
      id: "pantalles_limit", stage: "7-9", stageLabel: "8 ANYS · PANTALLES & AVORRIMENT",
      title: "«S'ha acabat el temps de tauleta» i esclata la tempesta",
      body: "Havies deixat 25 minuts de dibuixos i en apagar la pantalla s'enfada moltíssim i diu que a casa tot és avorrit.",
      opts: [
        {
          k: "A", t: "Pactar abans quin capítol és l'últim, apagar ell mateix i sostenir l'avorriment inicial sense rescatar-lo", s: "Fermesa serena davant el baixó de dopamina",
          vincle: +8, reg: +12, calma: +4,
          react: "Rondina per passadís deu minuts, i al minut dotze el trobes construint una cabana amb coixins i llibres!",
          neuro: "Després d'una pantalla hi ha una caiguda brusca de dopamina que genera irritabilitat. Si sostenim 10 minuts d'avorriment, s'encén la creativitat pròpia.",
          phrase: "«Entenc que voldries seguir mirant. Avorrir-se una estona és l'avantsala de les teves millors idees.»"
        },
        {
          k: "B", t: "Tornar-l'hi a encendre 20 minuts més perquè deixi de rondinar", s: "Reforç intermitent del conflicte",
          vincle: -2, reg: -10, calma: -5,
          react: "Vint minuts després l'enuig per apagar-la és el doble d'intens.",
          neuro: "El reforç variable (a vegades cedeixo si protestes fort) és el mecanisme exacte que fa que la protesta es repeteixi sempre.",
          phrase: "El límit clar i previsible descansa la ment de tota la família."
        },
        {
          k: "C", t: "Cridar i prohibir pantalles per a tot el mes", s: "Càstig desproporcionat en calent",
          vincle: -8, reg: -5, calma: -8,
          react: "Sent ràbia i ressentiment, i a la setmana següent costa mantenir el càstig.",
          phrase: "Menys amenaces llargues i més rutines clares d'inici i final."
        }
      ]
    },
    {
      id: "sopar_verdura", stage: "4-6", stageLabel: "4-7 ANYS · TAULA SENSE GUERRES",
      title: "«Ecs, això verd no m'ho penso menjar!»",
      body: "Has cuinat amb carinyo després d'un dia llarg i només veure el plat aparta la cadira amb cara de fàstic.",
      opts: [
        {
          k: "A", t: "Obligar-lo a quedar-se assegut fins que s'acabi tot el plat", s: "Lluita de poder amb el menjar",
          vincle: -9, reg: -7, calma: -10,
          react: "El sopar es converteix en una hora de plors i associació negativa amb la verdura.",
          neuro: "Segons la Divisió de Responsabilitat d'Ellyn Satter: l'adult decideix QUÈ, QUAN i ON se serveix; l'infant decideix QUANT menja del que hi ha a taula.",
          phrase: "La pressió a taula tanca la gana i multiplica el rebuig als aliments nous."
        },
        {
          k: "B", t: "Treure pressió: posar una petita porció juntament amb algun aliment segur i xerrar del dia", s: "Ambient relaxat i exposició sense força",
          vincle: +9, reg: +10, calma: +6,
          react: "Menja l'arròs i l'ou, i en veure't gaudir sense pressionar-lo tasta un trosset per curiositat!",
          neuro: "Un infant necessita fins a 12–15 exposicions tranquil·les i sense pressió a un aliment abans d'acceptar-lo com a familiar.",
          phrase: "«No cal que t'ho mengis si avui no et ve de gust; a taula tenim això per sopar i gaudim d'estar junts.»"
        },
        {
          k: "C", t: "Aixecar-te corrents a fer-li un altre sopar a la carta cada nit", s: "Cuina d'hotel esgotadora",
          vincle: +2, reg: -6, calma: -8,
          react: "Sopa feliç macarrons per cinquè dia, però tu acabes rendida netejant dues cuines.",
          phrase: "Inclou sempre un acompanyament familiar al mateix menú comú de tota la família."
        }
      ]
    },
    {
      id: "mentida_gerro", stage: "7-9", stageLabel: "7-9 ANYS · CONFIANÇA & SINCERITAT",
      title: "Una taca sospitosa a la paret i «jo no he estat!»",
      body: "Trobes una ratlla de retolador al passadís i el teu fill, amb el cap dels dits tacat del mateix color, jura que no ha estat ell.",
      opts: [
        {
          k: "A", t: "Parar-li la trampa: «Segur que no has estat tu? Si em menteixes el càstig serà doble!»", s: "Interrogatori que empeny a mentir més",
          vincle: -8, reg: -6, calma: -5,
          react: "S'espanta i manté la mentida a capa i espasa per por al càstig doble.",
          neuro: "Els infants menteixen per por de perdre la nostra aprovació o per desig màgic que allò no hagi passat. No els fem preguntes-trampa quan ja sabem la resposta.",
          phrase: "Anar directament a la solució convida a dir sempre la veritat."
        },
        {
          k: "B", t: "Descriure sense jutjar i buscar reparació: «Veig una ratlla a la paret. Busquem una esponja màgica per deixar-la neta junts?»", s: "Focus en reparar sense humiliar",
          vincle: +12, reg: +11, calma: +5,
          react: "Suspira alleujat: «Se m'ha escapat provant el retolador... T'ajudo a fregar!»",
          neuro: "Quan casa és un lloc segur per reconèixer errors i reparar-los, a l'adolescència acudiran a tu quan tinguin un problema gran.",
          phrase: "«A casa els errors es reparen; gràcies per ajudar-me a deixar la paret neta.»"
        },
        {
          k: "C", t: "Netejar-ho tu sola remugant en veu alta que ningú cuida res", s: "Ressentiment passiu",
          vincle: -3, reg: -4, calma: -6,
          react: "S'esmuny a l'habitació sense aprendre a fer-se càrrec de les conseqüències naturals.",
          phrase: "Involucrar-los en reparar amb amabilitat construeix responsabilitat real."
        }
      ]
    },
    {
      id: "esgotament_vespre", stage: "1-3", stageLabel: "AUTOCURA · QUAN NO POTS MÉS",
      title: "20:15h: bateria materna/paterna al 4%",
      body: "Sents que estàs a un mil·límetre d'esclatar per qualsevol detall. Encara queda rentar dents i posar pijames.",
      opts: [
        {
          k: "A", t: "Dir en veu alta el que necessites: «Necessito dos minuts per respirar fons i ara vinc» (o demanar relleu a la parella)", s: "Modelar autoregulació real",
          vincle: +10, reg: +11, calma: +16,
          react: "Et veu cuidar-te sense fer mal a ningú, fas tres sospirs llargs i acabes la nit amb molta més dolçor.",
          neuro: "Ensenyar amb l'exemple com un adult detecta que s'està omplint i s'atura a respirar val més que cent llibres d'intel·ligència emocional.",
          phrase: "«La mare/el pare té la bateria baixeta i farà tres respiracions lentes per tornar amb calma.»"
        },
        {
          k: "B", t: "Simplificar la nit al mínim vital (bany ràpid o tovalloleta, conte curt al llit abraçats)", s: "Flexibilitat compassiva",
          vincle: +9, reg: +6, calma: +12,
          react: "Baixar l'autoexigència d'un vespre perfecte us regala un final de dia càlid i tranquil.",
          neuro: "Un adult calmat amb un sopar senzill nodreix molt més el cervell infantil que un menú gourmet servit amb tensió.",
          phrase: "Avui «prou bo» és perfecte."
        },
        {
          k: "C", t: "Forçar-te a fer tota la rutina al detall estant al límit fins petar", s: "Autoexigència rígida",
          vincle: -7, reg: -4, calma: -14,
          react: "Acabes cridant pel tap de la pasta de dents.",
          phrase: "Cuidar la teva calma és el primer acte d'amor cap als teus fills."
        }
      ]
    }
  ];

  // Minimalist E-Ink SVG illustrations & micro-practices for the Calm/Breath tab
  var PRACTICES = [
    {
      id: "sigh",
      name: "Sospir Fisiològic (30s · Anti-estrès immediat)",
      svg: '<svg viewBox="0 0 250 76" width="235" height="70" xmlns="http://www.w3.org/2000/svg"><path d="M16,56 Q52,18 82,26 Q104,8 126,10 Q176,14 234,56" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="82" cy="26" r="3.5" fill="currentColor"/><circle cx="126" cy="10" r="4" fill="currentColor"/><text x="48" y="70" text-anchor="middle" font-family="monospace" font-size="9.5" fill="currentColor">Inhala 1</text><text x="108" y="70" text-anchor="middle" font-family="monospace" font-size="9.5" fill="currentColor">+Inhala 2</text><text x="188" y="70" text-anchor="middle" font-family="monospace" font-size="9.5" fill="currentColor">Exhala llarg</text></svg>',
      steps: "1. Inspira pel nas omplint els pulmons.\n2. Sense treure l'aire, fes una segona petita inspiració curta pel nas.\n3. Exhala mooolt a poc a poc per la boca com si bufessis una espelma sense apagar-la. Repeteix 3 vegades."
    },
    {
      id: "balasana",
      name: "Postura de Repòs / Balasana Suau (Ioga Restauratiu)",
      svg: '<svg viewBox="0 0 220 74" width="210" height="70" xmlns="http://www.w3.org/2000/svg"><line x1="15" y1="60" x2="205" y2="60" stroke="currentColor" stroke-width="1.5"/><path d="M55,58 Q62,34 98,38 L142,52" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><circle cx="152" cy="51" r="8" fill="none" stroke="currentColor" stroke-width="2.4"/><line x1="145" y1="56" x2="188" y2="58" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M55,58 L95,58" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>',
      steps: "1. Seu sobre els talons (o recolza el front sobre els braços creuats en una taula).\n2. Deixa caure el pes de les espatlles i afluixa completament la mandíbula.\n3. Sent com l'esquena baixa s'eixampla a cada inspiració durant 5 respiracions profundes."
    },
    {
      id: "hand_heart",
      name: "Àncora d'Autocompassió (Mà al Pit i Abdomen)",
      svg: '<svg viewBox="0 0 220 74" width="210" height="70" xmlns="http://www.w3.org/2000/svg"><circle cx="110" cy="37" r="28" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4,3"/><circle cx="110" cy="37" r="16" fill="none" stroke="currentColor" stroke-width="2.4"/><circle cx="110" cy="37" r="4" fill="currentColor"/></svg>',
      steps: "1. Posa una mà al centre del pit i l'altra a l'abdomen, notant l'escalfor de les teves mans.\n2. Digues mentalment: «Aquest moment és intens. Ho estic fent tan bé com puc amb l'energia d'avui».\n3. Afluixa el front i les espatlles abans de tornar a l'escena."
    }
  ];

  var CHEATSHEET = [
    { sit: "Rebequeria intensa", say: "«Veig que estàs molt enfadat. Sóc aquí a prop per quan vulguis una abraçada.»" },
    { sit: "No es vol vestir / banyar", say: "«Toca bany! Prefereixes entrar caminant com un cranc o fent salts de cangur?»" },
    { sit: "Vol comprar-ho tot a la botiga", say: "«És xulíssim! Li fem una foto per a la llista de desitjos d'aniversari?»" },
    { sit: "Germans discutint per una joguina", say: "«Veig dos infants i un sol camió. Confio que trobareu una idea justa per fer torns!»" },
    { sit: "Quan tu has perdut la paciència", say: "«Perdona'm per haver alçat la veu. M'he atabalat, però t'estimo molt i tornem a començar.»" }
  ];

  function createInitialState() {
    return {
      vincle: 78,
      reg: 72,
      calma: 76,
      tab: "escenes", // escenes | respirar | frases
      stageFilter: "all", // all | 1-3 | 4-6 | 7-9
      sceneIdx: 0,
      practiceIdx: 0,
      lastFeedback: null,
      completedCount: 0
    };
  }

  function loadState() {
    var saved = window.CalmStorage.get(STORAGE_KEY, null);
    if (saved && typeof saved.vincle === "number") return saved;
    return createInitialState();
  }

  function saveState(st) {
    window.CalmStorage.set(STORAGE_KEY, st);
  }

  function filteredScenes(st) {
    if (st.stageFilter === "all") return SCENES;
    var out = [];
    for (var i = 0; i < SCENES.length; i++) {
      if (SCENES[i].stage === st.stageFilter) out.push(SCENES[i]);
    }
    return out.length ? out : SCENES;
  }

  function render(container) {
    var st = loadState();

    function redraw() {
      container.innerHTML = "";
      var wrap = document.createElement("div");
      wrap.className = "game-main";

      // 1. 3-Column Warm HUD
      var hud = document.createElement("div");
      hud.className = "hud-grid cols-3";
      hud.innerHTML =
        '<div class="hud-cell">' +
          '<div class="hud-label">♥ VINCLE & SEGURETAT</div>' +
          '<div class="hud-val">' + st.vincle + "/100</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.vincle + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell">' +
          '<div class="hud-label">✦ REGULACIÓ INFANTIL</div>' +
          '<div class="hud-val">' + st.reg + "/100</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.reg + '%"></div></div>' +
        "</div>" +
        '<div class="hud-cell' + (st.calma < 45 ? " invert" : "") + '">' +
          '<div class="hud-label">◯ LA TEVA CALMA</div>' +
          '<div class="hud-val">' + st.calma + "/100</div>" +
          '<div class="hud-bar"><div class="hud-bar-fill" style="width:' + st.calma + '%"></div></div>' +
        "</div>";
      wrap.appendChild(hud);

      // 2. Navigation Tabs
      var bar = document.createElement("div");
      bar.className = "toolbar-row";
      var tabs = document.createElement("div");
      tabs.className = "segmented";
      [
        { id: "escenes", label: "Escenes" },
        { id: "respirar", label: "◯ Pausa Calma" },
        { id: "frases", label: "Frases Clau" }
      ].forEach(function (tb) {
        var b = document.createElement("button");
        b.className = "btn-sm" + (st.tab === tb.id ? " active" : "");
        b.textContent = tb.label;
        b.onclick = function () {
          st.tab = tb.id;
          saveState(st);
          redraw();
        };
        tabs.appendChild(b);
      });
      bar.appendChild(tabs);

      // Stage Filter pill when in Escenes
      if (st.tab === "escenes") {
        var btnFilter = document.createElement("button");
        btnFilter.className = "btn-sm";
        var mapLbl = { "all": "Etapa: Totes", "1-3": "1–3 anys", "4-6": "4–6 anys", "7-9": "7–9 anys" };
        btnFilter.textContent = mapLbl[st.stageFilter] || "Totes";
        btnFilter.onclick = function () {
          var order = ["all", "1-3", "4-6", "7-9"];
          var next = order[(order.indexOf(st.stageFilter) + 1) % order.length];
          st.stageFilter = next;
          st.sceneIdx = 0;
          st.lastFeedback = null;
          saveState(st);
          redraw();
        };
        bar.appendChild(btnFilter);
      } else {
        var btnRes = document.createElement("button");
        btnRes.className = "btn-sm";
        btnRes.textContent = "← Escenes";
        btnRes.onclick = function () { st.tab = "escenes"; saveState(st); redraw(); };
        bar.appendChild(btnRes);
      }
      wrap.appendChild(bar);

      // 3A. TAB: PAUSA CALMA & IOGA SUAVE
      if (st.tab === "respirar") {
        var pr = PRACTICES[st.practiceIdx % PRACTICES.length];
        var pBox = document.createElement("div");
        pBox.className = "outcome-panel";
        var linesHtml = pr.steps.split("\n").map(function (ln) {
          return '<p class="scenario-body" style="margin:4px 0;">' + ln + "</p>";
        }).join("");

        pBox.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>REGULACIÓ I IOGA RESTAURATIU</span><span>PRÀCTICA ' + ((st.practiceIdx % PRACTICES.length) + 1) + "/3</span></div>" +
            '<h3 class="scenario-title" style="margin-top:6px;">' + pr.name + "</h3>" +
            '<div class="chart-box" style="margin:8px 0;">' + pr.svg + "</div>" +
            linesHtml +
          "</div>";

        var rowBtns = document.createElement("div");
        rowBtns.className = "toolbar-row";

        var bSwitch = document.createElement("button");
        bSwitch.className = "btn-lg";
        bSwitch.style.flex = "1";
        bSwitch.textContent = "↻ Altra pràctica";
        bSwitch.onclick = function () {
          st.practiceIdx = (st.practiceIdx + 1) % PRACTICES.length;
          saveState(st);
          redraw();
        };

        var bBreathe = document.createElement("button");
        bBreathe.className = "btn-lg active";
        bBreathe.style.flex = "1.4";
        bBreathe.textContent = "Ja he respirat (+18 Calma)";
        bBreathe.onclick = function () {
          st.calma = window.CalmUI.clamp(st.calma + 18, 0, 100);
          st.tab = "escenes";
          saveState(st);
          redraw();
        };

        rowBtns.appendChild(bSwitch);
        rowBtns.appendChild(bBreathe);
        pBox.appendChild(rowBtns);
        wrap.appendChild(pBox);
        container.appendChild(wrap);
        return;
      }

      // 3B. TAB: FRASES CLAU (Cheatsheet)
      if (st.tab === "frases") {
        var fHead = document.createElement("div");
        fHead.className = "scenario-card";
        fHead.innerHTML =
          '<div class="scenario-kicker"><span>MULETES DE CRIANÇA RESPECTUOSA</span><span>CONNEXIÓ + LÍMIT</span></div>' +
          '<p class="scenario-body">Frases curtes per recordar quan estem cansades i volem validar l\'emoció sense perdre el límit.</p>';
        wrap.appendChild(fHead);

        var cList = document.createElement("div");
        cList.className = "log-list";
        CHEATSHEET.forEach(function (item) {
          var d = document.createElement("div");
          d.className = "log-item";
          d.innerHTML = "<b>" + item.sit + ":</b> " + item.say;
          cList.appendChild(d);
        });
        wrap.appendChild(cList);
        container.appendChild(wrap);
        return;
      }

      // 3C. TAB: ESCENES (Feedback view or Active Scene)
      var list = filteredScenes(st);
      var sc = list[st.sceneIdx % list.length];

      if (st.lastFeedback) {
        var fb = st.lastFeedback;
        var out = document.createElement("div");
        out.className = "outcome-panel";
        out.innerHTML =
          "<div>" +
            '<div class="scenario-kicker"><span>QUÈ PASSA A L\'ESCENA</span><span>ESCENA COMPLETADA</span></div>' +
            '<p class="scenario-body" style="margin-top:6px;"><b>Reacció:</b> ' + fb.react + "</p>" +
            '<div class="insight-box" style="margin-top:7px;"><b>Sota l\'iceberg (Neurociència):</b> ' + fb.neuro + "</div>" +
            '<div class="scenario-quote" style="margin-top:8px;">' + fb.phrase + "</div>" +
          "</div>" +
          '<div class="delta-pills">' +
            '<span class="delta-pill strong">♥ Vincle ' + (fb.dv >= 0 ? "+" : "") + fb.dv + "</span>" +
            '<span class="delta-pill">✦ Regulació ' + (fb.dr >= 0 ? "+" : "") + fb.dr + "</span>" +
            '<span class="delta-pill">◯ Calma ' + (fb.dc >= 0 ? "+" : "") + fb.dc + "</span>" +
          "</div>";

        var bRow = document.createElement("div");
        bRow.className = "toolbar-row";

        var bRetry = document.createElement("button");
        bRetry.className = "btn-lg";
        bRetry.textContent = "↺ Provar altra resposta";
        bRetry.onclick = function () {
          st.lastFeedback = null;
          saveState(st);
          redraw();
        };

        var bNext = document.createElement("button");
        bNext.className = "btn-lg active";
        bNext.style.flex = "1";
        bNext.textContent = "Següent situació →";
        bNext.onclick = function () {
          st.lastFeedback = null;
          st.sceneIdx = (st.sceneIdx + 1) % list.length;
          saveState(st);
          redraw();
        };

        bRow.appendChild(bRetry);
        bRow.appendChild(bNext);
        out.appendChild(bRow);
        wrap.appendChild(out);
        container.appendChild(wrap);
        return;
      }

      var card = document.createElement("div");
      card.className = "scenario-card";
      card.innerHTML =
        '<div class="scenario-kicker"><span>' + sc.stageLabel + '</span><span>SITUACIÓ ' + ((st.sceneIdx % list.length) + 1) + "/" + list.length + "</span></div>" +
        '<h3 class="scenario-title">' + sc.title + "</h3>" +
        '<p class="scenario-body">' + sc.body + "</p>";
      wrap.appendChild(card);

      var stack = document.createElement("div");
      stack.className = "choice-stack";
      sc.opts.forEach(function (op) {
        var b = document.createElement("button");
        b.className = "choice-btn";
        b.innerHTML =
          '<span class="choice-key">' + op.k + "</span>" +
          '<div class="choice-content"><div class="choice-main">' + op.t + '</div><div class="choice-sub">' + op.s + "</div></div>";
        b.onclick = function () {
          st.vincle = window.CalmUI.clamp(st.vincle + op.vincle, 10, 100);
          st.reg = window.CalmUI.clamp(st.reg + op.reg, 10, 100);
          st.calma = window.CalmUI.clamp(st.calma + op.calma, 5, 100);
          st.completedCount = (st.completedCount || 0) + 1;
          st.lastFeedback = {
            react: op.react,
            neuro: op.neuro,
            phrase: op.phrase,
            dv: op.vincle,
            dr: op.reg,
            dc: op.calma
          };
          saveState(st);
          redraw();
        };
        stack.appendChild(b);
      });
      wrap.appendChild(stack);
      container.appendChild(wrap);
    }

    redraw();
  }

  function getBadge() {
    var st = loadState();
    return "♥ " + st.vincle + " · ◯ Calma " + st.calma;
  }

  window.CalmGames.crianca = {
    id: "crianca",
    title: "Créixer amb Calma",
    desc: "Situacions reals de criança respectuosa, gestió emocional, neurociència pràctica i pausa de respiració i ioga suau.",
    getBadge: getBadge,
    render: render,
    helpHtml:
      "<h2>Créixer amb Calma · Espai de Criança i Serenor</h2>" +
      "<ul>" +
      "<li>Explora situacions reals dels <b>1 als 9 anys</b> (rebequeries, límits amb pressa, gelosia, pors nocturnes, autoestima i reparació quan perdem els nervis).</li>" +
      "<li>Després de cada opció descobreixes què passa <b>sota l'iceberg del cervell infantil</b> i t'emportes una frase pràctica sense judicis ni culpa.</li>" +
      "<li>A la pestanya <b>◯ Pausa Calma</b> tens 3 micropràctiques il·lustrades de respiració i ioga restauratiu per recarregar energia en un minut.</li>" +
      "</ul>"
  };
})();
