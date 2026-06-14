(function () {
  window.BP = window.BP || {};

  var FALLBACK = 'nl';
  var LANGS = [
    { code: 'nl', label: 'Nederlands', short: 'NL' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Français', short: 'FR' },
    { code: 'es', label: 'Español', short: 'ES' },
    { code: 'tl', label: 'Tagalog', short: 'TL' }
  ];

  var UI = {
    guestMode: { nl: 'Gastmodus', en: 'Guest mode', fr: 'Mode invité', es: 'Modo invitado', tl: 'Guest mode' },
    language: { nl: 'Taal', en: 'Language', fr: 'Langue', es: 'Idioma', tl: 'Wika' },
    chooseLanguage: { nl: 'Kies taal', en: 'Choose language', fr: 'Choisir la langue', es: 'Elige idioma', tl: 'Pumili ng wika' },
    close: { nl: 'Sluiten', en: 'Close', fr: 'Fermer', es: 'Cerrar', tl: 'Isara' },
    appTitle: { nl: 'BubblePop<br>Wiskunde', en: 'BubblePop<br>Math', fr: 'BubblePop<br>Maths', es: 'BubblePop<br>Mate', tl: 'BubblePop<br>Math' },
    homeSubtitle: { nl: 'Korte rondes. Grote bubbles. Direct spelen.', en: 'Short rounds. Big bubbles. Play right away.', fr: 'Rondes courtes. Grosses bulles. On joue tout de suite.', es: 'Rondas cortas. Burbujas grandes. Juega al instante.', tl: 'Maiikling round. Malalaking bubble. Laro agad.' },
    continueTitle: { nl: 'Speel verder', en: 'Continue', fr: 'Continuer', es: 'Continuar', tl: 'Magpatuloy' },
    continueButton: { nl: '▶ Speel verder', en: '▶ Continue', fr: '▶ Continuer', es: '▶ Continuar', tl: '▶ Magpatuloy' },
    skills: { nl: 'Skills', en: 'Skills', fr: 'Compétences', es: 'Habilidades', tl: 'Mga skill' },
    reset: { nl: 'Reset', en: 'Reset', fr: 'Réinitialiser', es: 'Reiniciar', tl: 'I-reset' },
    open: { nl: 'open', en: 'open', fr: 'ouverts', es: 'abiertos', tl: 'bukas' },
    stars: { nl: 'sterren', en: 'stars', fr: 'étoiles', es: 'estrellas', tl: 'bituin' },
    chooseSkillTitle: { nl: 'Kies<br>je skill', en: 'Choose<br>your skill', fr: 'Choisis<br>ta compétence', es: 'Elige<br>tu habilidad', tl: 'Pumili<br>ng skill' },
    chooseSkillSubtitle: { nl: 'Geen grote wereldkaart meer: direct naar wat je wil trainen.', en: 'No big world map for now: go straight to what you want to practise.', fr: 'Pas de grande carte pour l’instant : va directement à ce que tu veux entraîner.', es: 'Sin gran mapa por ahora: ve directo a lo que quieres practicar.', tl: 'Wala munang malaking mapa: diretso sa gusto mong sanayin.' },
    locked: { nl: 'Vergrendeld', en: 'Locked', fr: 'Verrouillé', es: 'Bloqueado', tl: 'Naka-lock' },
    levels: { nl: 'Levels', en: 'Levels', fr: 'Niveaux', es: 'Niveles', tl: 'Mga level' },
    levelSubtitle: { nl: 'Korte levels. Eén duidelijke actie per ronde.', en: 'Short levels. One clear action each round.', fr: 'Niveaux courts. Une action claire par ronde.', es: 'Niveles cortos. Una acción clara por ronda.', tl: 'Maiikling level. Isang malinaw na kilos bawat round.' },
    playPrevious: { nl: 'Speel eerst level {n} uit.', en: 'Finish level {n} first.', fr: 'Termine d’abord le niveau {n}.', es: 'Termina primero el nivel {n}.', tl: 'Tapusin muna ang level {n}.' },
    unavailable: { nl: 'Level niet beschikbaar', en: 'Level unavailable', fr: 'Niveau indisponible', es: 'Nivel no disponible', tl: 'Hindi available ang level' },
    back: { nl: 'Terug', en: 'Back', fr: 'Retour', es: 'Atrás', tl: 'Bumalik' },
    technicalError: { nl: 'Technische fout', en: 'Technical error', fr: 'Erreur technique', es: 'Error técnico', tl: 'Teknikal na error' },
    mechanicNotLoaded: { nl: 'Mechanic niet geladen', en: 'Mechanic not loaded', fr: 'Mécanique non chargée', es: 'Mecánica no cargada', tl: 'Hindi na-load ang mechanic' },
    mechanicMissing: { nl: 'Deze level vraagt om: {name}', en: 'This level needs: {name}', fr: 'Ce niveau demande : {name}', es: 'Este nivel necesita: {name}', tl: 'Kailangan ng level na ito: {name}' },
    checkScript: { nl: 'Controleer of het juiste script in index.html staat.', en: 'Check that the right script is in index.html.', fr: 'Vérifie que le bon script est dans index.html.', es: 'Comprueba que el script correcto esté en index.html.', tl: 'Tingnan kung nasa index.html ang tamang script.' },
    score: { nl: 'Score', en: 'Score', fr: 'Score', es: 'Puntuación', tl: 'Score' },
    streak: { nl: 'Streak', en: 'Streak', fr: 'Série', es: 'Racha', tl: 'Streak' },
    home: { nl: 'Home', en: 'Home', fr: 'Accueil', es: 'Inicio', tl: 'Home' },
    undo: { nl: '↶ Ongedaan', en: '↶ Undo', fr: '↶ Annuler', es: '↶ Deshacer', tl: '↶ I-undo' },
    noResult: { nl: 'Nog geen resultaat', en: 'No result yet', fr: 'Pas encore de résultat', es: 'Aún no hay resultado', tl: 'Wala pang resulta' },
    result: { nl: 'Resultaat', en: 'Result', fr: 'Résultat', es: 'Resultado', tl: 'Resulta' },
    nextLevel: { nl: '▶ Volgende level', en: '▶ Next level', fr: '▶ Niveau suivant', es: '▶ Siguiente nivel', tl: '▶ Susunod na level' },
    anotherRound: { nl: '▶ Nog een ronde', en: '▶ Another round', fr: '▶ Encore une ronde', es: '▶ Otra ronda', tl: '▶ Isa pang round' },
    resultNextHelp: { nl: 'Klaar? Ga door naar: {title}', en: 'Ready? Continue to: {title}', fr: 'Prêt ? Continue vers : {title}', es: '¿Listo? Continúa con: {title}', tl: 'Handa? Magpatuloy sa: {title}' },
    resultEndHelp: { nl: 'Je zit aan het einde van de huidige reeks.', en: 'You are at the end of the current set.', fr: 'Tu es à la fin de la série actuelle.', es: 'Estás al final de la serie actual.', tl: 'Nasa dulo ka na ng kasalukuyang set.' },
    bestStreak: { nl: 'beste streak', en: 'best streak', fr: 'meilleure série', es: 'mejor racha', tl: 'pinakamahusay na streak' },
    secondsShort: { nl: 's', en: 's', fr: 's', es: 's', tl: 's' },
    playAgain: { nl: 'Speel opnieuw', en: 'Play again', fr: 'Rejouer', es: 'Jugar otra vez', tl: 'Laruin muli' },
    chooseLevel: { nl: 'Kies level', en: 'Choose level', fr: 'Choisir un niveau', es: 'Elegir nivel', tl: 'Pumili ng level' },
    targetBubble: { nl: 'Doelbubble', en: 'Target bubble', fr: 'Bulle cible', es: 'Burbuja objetivo', tl: 'Target bubble' },
    of: { nl: 'van', en: 'of', fr: 'de', es: 'de', tl: 'ng' },
    part: { nl: 'deel', en: 'part', fr: 'partie', es: 'parte', tl: 'bahagi' },
    parts: { nl: 'delen', en: 'parts', fr: 'parties', es: 'partes', tl: 'bahagi' }
  };

  var TEXT = {
    'Breukenzee': { en: 'Fraction Sea', fr: 'Mer des fractions', es: 'Mar de fracciones', tl: 'Dagat ng mga Praksiyon' },
    'Maak breuken door bubbles te combineren.': { en: 'Make fractions by combining bubbles.', fr: 'Construis des fractions en combinant des bulles.', es: 'Forma fracciones combinando burbujas.', tl: 'Bumuo ng mga praksyon sa pagsasama ng mga bubble.' },
    'Verhoudingen': { en: 'Ratios', fr: 'Rapports', es: 'Razones', tl: 'Mga ratio' },
    'Komt later als content pack.': { en: 'Coming later as a content pack.', fr: 'Arrive plus tard comme pack de contenu.', es: 'Llegará después como paquete de contenido.', tl: 'Darating mamaya bilang content pack.' },
    'Procenten': { en: 'Percentages', fr: 'Pourcentages', es: 'Porcentajes', tl: 'Mga porsiyento' },
    'Zie de breuk': { en: 'See the fraction', fr: 'Vois la fraction', es: 'Mira la fracción', tl: 'Tingnan ang praksyon' },
    'Kijk naar de bubble en kies de breuk.': { en: 'Look at the bubble and choose the fraction.', fr: 'Regarde la bulle et choisis la fraction.', es: 'Mira la burbuja y elige la fracción.', tl: 'Tingnan ang bubble at piliin ang praksyon.' },
    'Welke breuk zie je?': { en: 'Which fraction do you see?', fr: 'Quelle fraction vois-tu ?', es: '¿Qué fracción ves?', tl: 'Anong praksyon ang nakikita mo?' },
    'Maak de breuk': { en: 'Make the fraction', fr: 'Construis la fraction', es: 'Forma la fracción', tl: 'Buuin ang praksyon' },
    'Kleur de juiste delen in de bubble.': { en: 'Light up the right parts in the bubble.', fr: 'Allume les bonnes parties dans la bulle.', es: 'Ilumina las partes correctas de la burbuja.', tl: 'Sindihan ang tamang mga bahagi sa bubble.' },
    'Maak': { en: 'Make', fr: 'Fais', es: 'Forma', tl: 'Buuin' },
    'Teller en noemer': { en: 'Numerator and denominator', fr: 'Numérateur et dénominateur', es: 'Numerador y denominador', tl: 'Numerator at denominator' },
    'Ontdek totaal aantal delen en gekleurde delen.': { en: 'Find the total parts and the coloured parts.', fr: 'Trouve le total des parties et les parties colorées.', es: 'Encuentra el total de partes y las partes coloreadas.', tl: 'Hanapin ang kabuuang bahagi at ang may kulay na bahagi.' },
    'Wat is de noemer?': { en: 'What is the denominator?', fr: 'Quel est le dénominateur ?', es: '¿Cuál es el denominador?', tl: 'Ano ang denominator?' },
    'Wat is de teller?': { en: 'What is the numerator?', fr: 'Quel est le numérateur ?', es: '¿Cuál es el numerador?', tl: 'Ano ang numerator?' },
    'Zelfde waarde': { en: 'Same value', fr: 'Même valeur', es: 'Mismo valor', tl: 'Parehong halaga' },
    'Kies de bubble die evenveel toont.': { en: 'Choose the bubble that shows the same amount.', fr: 'Choisis la bulle qui montre la même quantité.', es: 'Elige la burbuja que muestra la misma cantidad.', tl: 'Piliin ang bubble na nagpapakita ng parehong dami.' },
    'Welke bubble toont evenveel?': { en: 'Which bubble shows the same amount?', fr: 'Quelle bulle montre la même quantité ?', es: '¿Qué burbuja muestra la misma cantidad?', tl: 'Aling bubble ang nagpapakita ng parehong dami?' },
    'Op de lijn': { en: 'On the line', fr: 'Sur la droite', es: 'En la recta', tl: 'Sa linya' },
    'Sleep één breukbubble letterlijk op de getallenas.': { en: 'Drag one fraction bubble onto the number line.', fr: 'Glisse une bulle de fraction sur la droite graduée.', es: 'Arrastra una burbuja de fracción a la recta numérica.', tl: 'I-drag ang isang fraction bubble sa number line.' },
    'Plaats': { en: 'Place', fr: 'Place', es: 'Coloca', tl: 'Ilagay' },
    'Bubbles op de lijn': { en: 'Bubbles on the line', fr: 'Bulles sur la droite', es: 'Burbujas en la recta', tl: 'Mga bubble sa linya' },
    'Sleep meerdere breukbubbles naar hun plaats.': { en: 'Drag several fraction bubbles to their places.', fr: 'Glisse plusieurs bulles de fraction à leur place.', es: 'Arrastra varias burbujas de fracción a su lugar.', tl: 'I-drag ang ilang fraction bubble sa tamang puwesto.' },
    'Plaats de bubbles': { en: 'Place the bubbles', fr: 'Place les bulles', es: 'Coloca las burbujas', tl: 'Ilagay ang mga bubble' },
    'Maak samen': { en: 'Make together', fr: 'Fais ensemble', es: 'Forma juntos', tl: 'Buuin nang sama-sama' },
    'Maak de doelbreuk door gelijknamige breukbubbles te versmelten.': { en: 'Make the target fraction by fusing fraction bubbles with the same denominator.', fr: 'Fais la fraction cible en fusionnant des bulles au même dénominateur.', es: 'Forma la fracción objetivo fusionando burbujas con el mismo denominador.', tl: 'Buuin ang target na praksyon sa pagsasanib ng mga bubble na may parehong denominator.' },
    'Neem weg': { en: 'Take away', fr: 'Enlève', es: 'Quita', tl: 'Bawasan' },
    'Maak de doelbreuk door een wegneembubble op een gewone bubble te slepen.': { en: 'Make the target fraction by dragging a take-away bubble onto a normal bubble.', fr: 'Fais la fraction cible en glissant une bulle à enlever sur une bulle normale.', es: 'Forma la fracción objetivo arrastrando una burbuja de quitar sobre una normal.', tl: 'Buuin ang target na praksyon sa pag-drag ng bawas-bubble sa normal na bubble.' },
    'Andere stukjes': { en: 'Different pieces', fr: 'Morceaux différents', es: 'Partes diferentes', tl: 'Ibang bahagi' },
    'Maak de doelbreuk met bubbles die nog niet dezelfde noemer hebben.': { en: 'Make the target fraction with bubbles that do not yet have the same denominator.', fr: 'Fais la fraction cible avec des bulles qui n’ont pas encore le même dénominateur.', es: 'Forma la fracción objetivo con burbujas que aún no tienen el mismo denominador.', tl: 'Buuin ang target na praksyon gamit ang mga bubble na hindi pa pareho ang denominator.' },
    'Anders weg': { en: 'Take away differently', fr: 'Enlève autrement', es: 'Quita de otra forma', tl: 'Bawasan sa ibang paraan' },
    'Neem weg met andere stukjes. Het spel maakt de stukjes kort gelijk.': { en: 'Take away with different pieces. The game briefly makes the pieces match.', fr: 'Enlève avec des morceaux différents. Le jeu les rend brièvement compatibles.', es: 'Quita con partes diferentes. El juego las iguala brevemente.', tl: 'Magbawas gamit ang ibang bahagi. Sandaling pinapapareho ng laro ang mga bahagi.' },
    'Meer dan één': { en: 'More than one', fr: 'Plus qu’un', es: 'Más de uno', tl: 'Higit sa isa' },
    'Maak een breuk groter dan 1 door gewone bubbles en min-bubbles te versmelten.': { en: 'Make a fraction greater than 1 by fusing normal bubbles and minus bubbles.', fr: 'Fais une fraction plus grande que 1 en fusionnant des bulles normales et des bulles moins.', es: 'Forma una fracción mayor que 1 fusionando burbujas normales y burbujas de resta.', tl: 'Bumuo ng praksyong higit sa 1 sa pagsasanib ng normal na bubbles at minus-bubbles.' },
    'Van een hoeveelheid': { en: 'Of a quantity', fr: 'D’une quantité', es: 'De una cantidad', tl: 'Ng isang dami' },
    'Pak een breuk van losse bubbles.': { en: 'Take a fraction of loose bubbles.', fr: 'Prends une fraction des bulles libres.', es: 'Toma una fracción de burbujas sueltas.', tl: 'Kumuha ng praksyon ng mga hiwa-hiwalay na bubble.' },
    'Pak': { en: 'Take', fr: 'Prends', es: 'Toma', tl: 'Kumuha' },
    'Keer nemen': { en: 'Multiply', fr: 'Multiplier', es: 'Multiplicar', tl: 'Paramihin' },
    'Sleep een maalbubble op een breukbubble.': { en: 'Drag a multiply bubble onto a fraction bubble.', fr: 'Glisse une bulle multiplier sur une bulle de fraction.', es: 'Arrastra una burbuja de multiplicar sobre una burbuja de fracción.', tl: 'I-drag ang multiply bubble sa fraction bubble.' },
    'Breuk keer': { en: 'Fraction times', fr: 'Fraction fois', es: 'Fracción por', tl: 'Praksyon beses' },
    'Sleep een breuk-maalbubble op een gewone breukbubble.': { en: 'Drag a fraction-times bubble onto a normal fraction bubble.', fr: 'Glisse une bulle fraction-fois sur une bulle de fraction normale.', es: 'Arrastra una burbuja fracción-por sobre una burbuja de fracción normal.', tl: 'I-drag ang fraction-times bubble sa normal na fraction bubble.' },
    'Deel eerlijk': { en: 'Divide fairly', fr: 'Diviser équitablement', es: 'Dividir justamente', tl: 'Hatiin nang patas' },
    'Sleep een deelbubble op een breukbubble.': { en: 'Drag a divide bubble onto a fraction bubble.', fr: 'Glisse une bulle diviser sur une bulle de fraction.', es: 'Arrastra una burbuja de dividir sobre una burbuja de fracción.', tl: 'I-drag ang divide bubble sa fraction bubble.' },
    'Deel door stukjes': { en: 'Divide by pieces', fr: 'Diviser par morceaux', es: 'Dividir por partes', tl: 'Hatiin sa mga bahagi' },
    'Sleep een breuk-deelbubble op een gewone breukbubble.': { en: 'Drag a fraction-divide bubble onto a normal fraction bubble.', fr: 'Glisse une bulle fraction-diviser sur une bulle de fraction normale.', es: 'Arrastra una burbuja fracción-dividir sobre una burbuja de fracción normal.', tl: 'I-drag ang fraction-divide bubble sa normal na fraction bubble.' },
    'Kies slim': { en: 'Choose smartly', fr: 'Choisis intelligemment', es: 'Elige con inteligencia', tl: 'Pumili nang matalino' },
    'Gebruik de juiste bubble-actie: samen, min, maal of deel.': { en: 'Use the right bubble action: combine, minus, multiply or divide.', fr: 'Utilise la bonne action : combiner, moins, multiplier ou diviser.', es: 'Usa la acción correcta: combinar, restar, multiplicar o dividir.', tl: 'Gamitin ang tamang bubble action: pagsamahin, bawas, multiply o divide.' },
    'Andere vormen': { en: 'Other forms', fr: 'Autres formes', es: 'Otras formas', tl: 'Ibang anyo' },
    'Maak procenten en kommagetallen door breukbubbles in elkaar te slepen.': { en: 'Make percentages and decimals by dragging fraction bubbles into each other.', fr: 'Fais des pourcentages et des décimaux en fusionnant des bulles de fraction.', es: 'Forma porcentajes y decimales arrastrando burbujas de fracción entre sí.', tl: 'Bumuo ng porsiyento at decimal sa pagsasanib ng fraction bubbles.' },
    'Procent van hoeveelheid': { en: 'Percent of a quantity', fr: 'Pourcentage d’une quantité', es: 'Porcentaje de una cantidad', tl: 'Porsiyento ng dami' },
    'Pak een procent of kommagetal van losse bubbles.': { en: 'Take a percent or decimal of loose bubbles.', fr: 'Prends un pourcentage ou un décimal de bulles libres.', es: 'Toma un porcentaje o decimal de burbujas sueltas.', tl: 'Kumuha ng porsiyento o decimal ng mga hiwa-hiwalay na bubble.' },
    'Eindbaas': { en: 'Final boss', fr: 'Boss final', es: 'Jefe final', tl: 'Final boss' },
    'Mix van breuken, procenten, kommagetallen en operatorbubbles.': { en: 'Mix of fractions, percentages, decimals and operator bubbles.', fr: 'Mélange de fractions, pourcentages, décimaux et bulles opérateurs.', es: 'Mezcla de fracciones, porcentajes, decimales y burbujas de operadores.', tl: 'Halo ng fractions, porsiyento, decimal at operator bubbles.' },
    'Pop de breukbubble die erbij past.': { en: 'Pop the fraction bubble that matches.', fr: 'Éclate la bulle de fraction qui correspond.', es: 'Revienta la burbuja de fracción que corresponde.', tl: 'I-pop ang fraction bubble na tugma.' },
    'Plop!': { en: 'Plop!', fr: 'Plop !', es: '¡Plop!', tl: 'Plop!' },
    'Nog niet. Kijk naar gekleurd tegenover totaal.': { en: 'Not yet. Compare coloured parts with the total.', fr: 'Pas encore. Compare les parties colorées avec le total.', es: 'Todavía no. Compara lo coloreado con el total.', tl: 'Hindi pa. Ihambing ang may kulay sa kabuuan.' },
    'Pop het juiste getal.': { en: 'Pop the right number.', fr: 'Éclate le bon nombre.', es: 'Revienta el número correcto.', tl: 'I-pop ang tamang numero.' },
    'Nog niet. Teller = gekleurd, noemer = totaal.': { en: 'Not yet. Numerator = coloured, denominator = total.', fr: 'Pas encore. Numérateur = coloré, dénominateur = total.', es: 'Todavía no. Numerador = coloreado, denominador = total.', tl: 'Hindi pa. Numerator = may kulay, denominator = kabuuan.' },
    'Pop de bubble met dezelfde waarde.': { en: 'Pop the bubble with the same value.', fr: 'Éclate la bulle de même valeur.', es: 'Revienta la burbuja con el mismo valor.', tl: 'I-pop ang bubble na may parehong halaga.' },
    'Plop! Zelfde waarde.': { en: 'Plop! Same value.', fr: 'Plop ! Même valeur.', es: '¡Plop! Mismo valor.', tl: 'Plop! Parehong halaga.' },
    'Nog niet. Vergelijk hoeveel gevuld is.': { en: 'Not yet. Compare how much is filled.', fr: 'Pas encore. Compare la quantité remplie.', es: 'Todavía no. Compara cuánto está lleno.', tl: 'Hindi pa. Ihambing kung gaano karami ang napuno.' },
    'Tik de delen die moeten oplichten.': { en: 'Tap the parts that should light up.', fr: 'Touche les parties qui doivent s’allumer.', es: 'Toca las partes que deben iluminarse.', tl: 'I-tap ang mga bahaging dapat umilaw.' },
    'Probeer opnieuw.': { en: 'Try again.', fr: 'Réessaie.', es: 'Inténtalo de nuevo.', tl: 'Subukan muli.' },
    'Mooi!': { en: 'Nice!', fr: 'Bien !', es: '¡Bien!', tl: 'Maganda!' },
    'Versmelt bubbles. Als de stukjes anders zijn, splitst het spel ze vanzelf even gelijk.': { en: 'Fuse bubbles. If the pieces differ, the game briefly splits them equally.', fr: 'Fusionne les bulles. Si les morceaux diffèrent, le jeu les égalise brièvement.', es: 'Fusiona burbujas. Si las partes son distintas, el juego las iguala brevemente.', tl: 'Pagsanibin ang bubbles. Kung iba ang mga bahagi, sandaling papantayin ng laro ang mga ito.' },
    'Versmelt bubbles tot je de doelbreuk maakt. Tikken mag ook: kies eerst de ene, dan de andere.': { en: 'Fuse bubbles until you make the target fraction. You may also tap: choose one, then the other.', fr: 'Fusionne les bulles jusqu’à faire la fraction cible. Tu peux aussi toucher : choisis l’une puis l’autre.', es: 'Fusiona burbujas hasta formar la fracción objetivo. También puedes tocar: elige una y luego otra.', tl: 'Pagsanibin ang bubbles hanggang mabuo ang target na praksyon. Pwede ring i-tap: piliin muna ang isa, tapos ang isa pa.' },
    'Kies nu de tweede bubble om te versmelten.': { en: 'Now choose the second bubble to fuse.', fr: 'Choisis maintenant la deuxième bulle à fusionner.', es: 'Ahora elige la segunda burbuja para fusionar.', tl: 'Piliin ngayon ang ikalawang bubble na isasanib.' },
    'Selectie gewist. Kies twee verschillende bubbles.': { en: 'Selection cleared. Choose two different bubbles.', fr: 'Sélection effacée. Choisis deux bulles différentes.', es: 'Selección borrada. Elige dos burbujas diferentes.', tl: 'Nabura ang seleksyon. Pumili ng dalawang magkaibang bubble.' },
    'Laat een bubble los boven een andere bubble.': { en: 'Drop one bubble on top of another bubble.', fr: 'Lâche une bulle sur une autre bulle.', es: 'Suelta una burbuja encima de otra.', tl: 'Bitawan ang isang bubble sa ibabaw ng isa pa.' },
    'Plop! Je maakte de doelbreuk.': { en: 'Plop! You made the target fraction.', fr: 'Plop ! Tu as fait la fraction cible.', es: '¡Plop! Formaste la fracción objetivo.', tl: 'Plop! Nabuo mo ang target na praksyon.' },
    'Te groot. Tik ↶ om die versmelting terug te nemen.': { en: 'Too big. Tap ↶ to undo that fusion.', fr: 'Trop grand. Touche ↶ pour annuler cette fusion.', es: 'Demasiado grande. Toca ↶ para deshacer esa fusión.', tl: 'Masyadong malaki. I-tap ang ↶ para i-undo ang pagsasanib.' },
    'Zet ongedaan. Probeer een andere versmelting.': { en: 'Undone. Try another fusion.', fr: 'Annulé. Essaie une autre fusion.', es: 'Deshecho. Prueba otra fusión.', tl: 'Na-undo. Subukan ang ibang pagsasanib.' },
    'Sleep een wegneembubble op de grote bubble. Als de stukjes anders zijn, maakt het spel ze kort gelijk.': { en: 'Drag a take-away bubble onto the big bubble. If the pieces differ, the game briefly makes them match.', fr: 'Glisse une bulle à enlever sur la grande bulle. Si les morceaux diffèrent, le jeu les rend brièvement compatibles.', es: 'Arrastra una burbuja de quitar sobre la burbuja grande. Si las partes son distintas, el juego las iguala brevemente.', tl: 'I-drag ang bawas-bubble sa malaking bubble. Kung iba ang mga bahagi, sandaling papantayin ng laro.' },
    'Sleep een wegneembubble op de grote bubble. Tikken mag ook.': { en: 'Drag a take-away bubble onto the big bubble. Tapping also works.', fr: 'Glisse une bulle à enlever sur la grande bulle. Toucher fonctionne aussi.', es: 'Arrastra una burbuja de quitar sobre la burbuja grande. También puedes tocar.', tl: 'I-drag ang bawas-bubble sa malaking bubble. Pwede ring i-tap.' },
    'Laat de wegneembubble los boven de grote bubble.': { en: 'Drop the take-away bubble on the big bubble.', fr: 'Lâche la bulle à enlever sur la grande bulle.', es: 'Suelta la burbuja de quitar sobre la burbuja grande.', tl: 'Bitawan ang bawas-bubble sa ibabaw ng malaking bubble.' },
    'Te klein. Tik ↶ om die wegneemactie terug te nemen.': { en: 'Too small. Tap ↶ to undo that take-away action.', fr: 'Trop petit. Touche ↶ pour annuler cette action.', es: 'Demasiado pequeño. Toca ↶ para deshacer esa acción.', tl: 'Masyadong maliit. I-tap ang ↶ para i-undo ang pagbawas.' },
    'Nog niet: in deze level trek je alleen weg met dezelfde noemer.': { en: 'Not yet: in this level you only subtract with the same denominator.', fr: 'Pas encore : dans ce niveau, tu soustrais seulement avec le même dénominateur.', es: 'Todavía no: en este nivel solo restas con el mismo denominador.', tl: 'Hindi pa: sa level na ito, pareho lang ang denominator kapag nagbabawas.' },
    'Dat is te veel weggenomen.': { en: 'That is too much taken away.', fr: 'Tu en as enlevé trop.', es: 'Quitaste demasiado.', tl: 'Sobra ang nabawas.' },
    'Deze bubbles passen niet goed samen.': { en: 'These bubbles do not fit well together.', fr: 'Ces bulles ne vont pas bien ensemble.', es: 'Estas burbujas no encajan bien.', tl: 'Hindi tugma ang mga bubble na ito.' },
    'Kies nu de bubble waarmee je wil versmelten.': { en: 'Now choose the bubble you want to fuse with.', fr: 'Choisis maintenant la bulle avec laquelle fusionner.', es: 'Ahora elige la burbuja con la que quieres fusionar.', tl: 'Piliin ngayon ang bubble na isasama.' },
    'Gebruik één maalbubble en één breukbubble.': { en: 'Use one multiply bubble and one fraction bubble.', fr: 'Utilise une bulle multiplier et une bulle de fraction.', es: 'Usa una burbuja de multiplicar y una burbuja de fracción.', tl: 'Gumamit ng isang multiply bubble at isang fraction bubble.' },
    'Nog niet de doelbreuk. Gebruik ↶ of probeer verder.': { en: 'Not the target fraction yet. Use ↶ or keep trying.', fr: 'Pas encore la fraction cible. Utilise ↶ ou continue.', es: 'Aún no es la fracción objetivo. Usa ↶ o sigue intentando.', tl: 'Hindi pa target na praksyon. Gamitin ang ↶ o subukan pa.' },
    'Zet ongedaan. Probeer een andere maalbubble.': { en: 'Undone. Try another multiply bubble.', fr: 'Annulé. Essaie une autre bulle multiplier.', es: 'Deshecho. Prueba otra burbuja de multiplicar.', tl: 'Na-undo. Subukan ang ibang multiply bubble.' },
    'Kies nu de bubble waarmee je wil delen.': { en: 'Now choose the bubble you want to divide with.', fr: 'Choisis maintenant la bulle par laquelle diviser.', es: 'Ahora elige la burbuja con la que quieres dividir.', tl: 'Piliin ngayon ang bubble na paghahati.' },
    'Gebruik één deelbubble en één breukbubble.': { en: 'Use one divide bubble and one fraction bubble.', fr: 'Utilise une bulle diviser et une bulle de fraction.', es: 'Usa una burbuja de dividir y una burbuja de fracción.', tl: 'Gumamit ng isang divide bubble at isang fraction bubble.' },
    'Zet ongedaan. Probeer een andere deelbubble.': { en: 'Undone. Try another divide bubble.', fr: 'Annulé. Essaie une autre bulle diviser.', es: 'Deshecho. Prueba otra burbuja de dividir.', tl: 'Na-undo. Subukan ang ibang divide bubble.' },
    'Kies nu een tweede bubble.': { en: 'Now choose a second bubble.', fr: 'Choisis maintenant une deuxième bulle.', es: 'Ahora elige una segunda burbuja.', tl: 'Pumili ngayon ng ikalawang bubble.' },
    'Die combinatie kan hier niet.': { en: 'That combination does not work here.', fr: 'Cette combinaison ne marche pas ici.', es: 'Esa combinación no funciona aquí.', tl: 'Hindi puwede rito ang kombinasyong iyon.' },
    'Gebruik een operatorbubble samen met een breukbubble.': { en: 'Use an operator bubble together with a fraction bubble.', fr: 'Utilise une bulle opérateur avec une bulle de fraction.', es: 'Usa una burbuja de operador junto con una burbuja de fracción.', tl: 'Gumamit ng operator bubble kasama ng fraction bubble.' },
    'Dat gaat onder nul. Kies een andere bubble.': { en: 'That goes below zero. Choose another bubble.', fr: 'Cela descend sous zéro. Choisis une autre bulle.', es: 'Eso baja de cero. Elige otra burbuja.', tl: 'Bababa iyon sa zero. Pumili ng ibang bubble.' },
    'Delen door nul kan niet.': { en: 'You cannot divide by zero.', fr: 'On ne peut pas diviser par zéro.', es: 'No se puede dividir entre cero.', tl: 'Hindi puwedeng mag-divide sa zero.' },
    'Deze operator ken ik nog niet.': { en: 'I do not know this operator yet.', fr: 'Je ne connais pas encore cet opérateur.', es: 'Todavía no conozco este operador.', tl: 'Hindi ko pa kilala ang operator na ito.' },
    'Zet ongedaan. Kies een andere actie.': { en: 'Undone. Choose another action.', fr: 'Annulé. Choisis une autre action.', es: 'Deshecho. Elige otra acción.', tl: 'Na-undo. Pumili ng ibang aksyon.' },
    'Sleep de bubbles van klein naar groot op de as.': { en: 'Drag the bubbles from small to large on the axis.', fr: 'Glisse les bulles de la plus petite à la plus grande sur l’axe.', es: 'Arrastra las burbujas de menor a mayor en el eje.', tl: 'I-drag ang bubbles mula maliit hanggang malaki sa axis.' },
    'Sleep elke bubble van boven naar haar plaats op de as.': { en: 'Drag each bubble from above to its place on the axis.', fr: 'Glisse chaque bulle d’en haut vers sa place sur l’axe.', es: 'Arrastra cada burbuja desde arriba a su lugar en el eje.', tl: 'I-drag ang bawat bubble mula sa itaas patungo sa puwesto nito sa axis.' },
    'Sleep de bubble van boven naar de as.': { en: 'Drag the bubble from above to the axis.', fr: 'Glisse la bulle d’en haut vers l’axe.', es: 'Arrastra la burbuja desde arriba al eje.', tl: 'I-drag ang bubble mula sa itaas papunta sa axis.' },
    'Plop! Juist op de lijn.': { en: 'Plop! Right on the line.', fr: 'Plop ! Bien sur la droite.', es: '¡Plop! Correcto en la recta.', tl: 'Plop! Tama sa linya.' },
    'Nog niet. Probeer opnieuw.': { en: 'Not yet. Try again.', fr: 'Pas encore. Réessaie.', es: 'Todavía no. Inténtalo de nuevo.', tl: 'Hindi pa. Subukan muli.' },
    'De bubbles starten boven de as. Sleep ze in de juiste volgorde op de lijn.': { en: 'The bubbles start above the axis. Drag them onto the line in the right order.', fr: 'Les bulles commencent au-dessus de l’axe. Glisse-les sur la ligne dans le bon ordre.', es: 'Las burbujas empiezan encima del eje. Arrástralas a la recta en el orden correcto.', tl: 'Nagsisimula ang bubbles sa itaas ng axis. I-drag sila sa linya sa tamang pagkakasunod.' },
    'De bubbles starten boven de as. Sleep ze op de juiste plek.': { en: 'The bubbles start above the axis. Drag them to the right place.', fr: 'Les bulles commencent au-dessus de l’axe. Glisse-les au bon endroit.', es: 'Las burbujas empiezan encima del eje. Arrástralas al lugar correcto.', tl: 'Nagsisimula ang bubbles sa itaas ng axis. I-drag sa tamang puwesto.' },
    'De bubble start boven de as. Sleep ze op de juiste plek.': { en: 'The bubble starts above the axis. Drag it to the right place.', fr: 'La bulle commence au-dessus de l’axe. Glisse-la au bon endroit.', es: 'La burbuja empieza encima del eje. Arrástrala al lugar correcto.', tl: 'Nagsisimula ang bubble sa itaas ng axis. I-drag sa tamang puwesto.' },
    'Plop! Nu de volgende bubble.': { en: 'Plop! Now the next bubble.', fr: 'Plop ! Maintenant la bulle suivante.', es: '¡Plop! Ahora la siguiente burbuja.', tl: 'Plop! Susunod na bubble naman.' },
    'Plop! Die bubble ligt juist.': { en: 'Plop! That bubble is correct.', fr: 'Plop ! Cette bulle est bien placée.', es: '¡Plop! Esa burbuja está bien.', tl: 'Plop! Tama ang bubble na iyon.' },
    'Laat de bubble op de as los.': { en: 'Drop the bubble on the axis.', fr: 'Lâche la bulle sur l’axe.', es: 'Suelta la burbuja en el eje.', tl: 'Bitawan ang bubble sa axis.' },
    'Sleep de bubble naar de lijn.': { en: 'Drag the bubble to the line.', fr: 'Glisse la bulle vers la droite.', es: 'Arrastra la burbuja a la recta.', tl: 'I-drag ang bubble papunta sa linya.' },
    'Nog niet. Iets meer naar rechts.': { en: 'Not yet. A little more to the right.', fr: 'Pas encore. Un peu plus à droite.', es: 'Todavía no. Un poco más a la derecha.', tl: 'Hindi pa. Kaunti pa sa kanan.' },
    'Nog niet. Iets meer naar links.': { en: 'Not yet. A little more to the left.', fr: 'Pas encore. Un peu plus à gauche.', es: 'Todavía no. Un poco más a la izquierda.', tl: 'Hindi pa. Kaunti pa sa kaliwa.' },
    'Kies nu een tweede bubble om te versmelten.': { en: 'Now choose a second bubble to fuse.', fr: 'Choisis maintenant une deuxième bulle à fusionner.', es: 'Ahora elige una segunda burbuja para fusionar.', tl: 'Pumili ngayon ng ikalawang bubble na isasanib.' },
    'Plop! Je maakte meer dan één.': { en: 'Plop! You made more than one.', fr: 'Plop ! Tu as fait plus qu’un.', es: '¡Plop! Formaste más de uno.', tl: 'Plop! Nakagawa ka ng higit sa isa.' },
    'stukjes gelijk': { en: 'pieces matched', fr: 'morceaux alignés', es: 'partes igualadas', tl: 'pinantay ang bahagi' },
    'Zet ongedaan. Kies opnieuw.': { en: 'Undone. Choose again.', fr: 'Annulé. Choisis à nouveau.', es: 'Deshecho. Elige de nuevo.', tl: 'Na-undo. Pumili muli.' },
    'Nog te weinig.': { en: 'Not enough yet.', fr: 'Pas encore assez.', es: 'Aún falta.', tl: 'Kulang pa.' },
    'Te veel. Tik terug of gebruik ↶.': { en: 'Too many. Tap back or use ↶.', fr: 'Trop. Retouche ou utilise ↶.', es: 'Demasiado. Toca para quitar o usa ↶.', tl: 'Sobra. I-tap pabalik o gamitin ang ↶.' },
    'Pop hoeveel jij denkt. Tik daarna op de doelbubble.': { en: 'Pop how many you think. Then tap the target bubble.', fr: 'Éclate le nombre que tu penses. Puis touche la bulle cible.', es: 'Revienta las que crees. Luego toca la burbuja objetivo.', tl: 'I-pop kung ilan ang tingin mo. Pagkatapos i-tap ang target bubble.' },
    'Klaar? Tik op de grote doelbubble.': { en: 'Ready? Tap the big target bubble.', fr: 'Prêt ? Touche la grande bulle cible.', es: '¿Listo? Toca la gran burbuja objetivo.', tl: 'Handa? I-tap ang malaking target bubble.' },
    'Pop losse bubbles. Tik daarna op de grote doelbubble.': { en: 'Pop loose bubbles. Then tap the big target bubble.', fr: 'Éclate des bulles libres. Puis touche la grande bulle cible.', es: 'Revienta burbujas sueltas. Luego toca la gran burbuja objetivo.', tl: 'I-pop ang mga hiwa-hiwalay na bubble. Pagkatapos i-tap ang malaking target bubble.' }
,
    'Scherm niet gevonden': { en: 'Screen not found', fr: 'Écran introuvable', es: 'Pantalla no encontrada', tl: 'Hindi makita ang screen' },
    'Tik precies {n} {part}. Geen controleknop nodig.': { en: 'Tap exactly {n} {part}. No check button needed.', fr: 'Touche exactement {n} {part}. Pas besoin de bouton de contrôle.', es: 'Toca exactamente {n} {part}. No hace falta botón de comprobar.', tl: 'I-tap nang eksakto ang {n} {part}. Walang check button na kailangan.' },
    'Nog {n} {part} tikken.': { en: 'Tap {n} more {part}.', fr: 'Touche encore {n} {part}.', es: 'Toca {n} {part} más.', tl: 'I-tap pa ang {n} {part}.' },
    'Nieuwe bubble: {value}. Maak verder of gebruik ↶.': { en: 'New bubble: {value}. Keep going or use ↶.', fr: 'Nouvelle bulle : {value}. Continue ou utilise ↶.', es: 'Nueva burbuja: {value}. Sigue o usa ↶.', tl: 'Bagong bubble: {value}. Magpatuloy o gamitin ang ↶.' },
    'Nu heb je {value}. Neem nog iets weg of gebruik ↶.': { en: 'Now you have {value}. Take away more or use ↶.', fr: 'Tu as maintenant {value}. Enlève encore quelque chose ou utilise ↶.', es: 'Ahora tienes {value}. Quita algo más o usa ↶.', tl: 'Ngayon mayroon kang {value}. Magbawas pa o gamitin ang ↶.' },
    'Sleep een deelbubble op een breukbubble. Tikken mag ook: kies twee bubbles.': { en: 'Drag a divide bubble onto a fraction bubble. Tapping also works: choose two bubbles.', fr: 'Glisse une bulle diviser sur une bulle de fraction. Toucher fonctionne aussi : choisis deux bulles.', es: 'Arrastra una burbuja de dividir sobre una fracción. También puedes tocar: elige dos burbujas.', tl: 'I-drag ang divide bubble sa fraction bubble. Pwede ring i-tap: pumili ng dalawang bubble.' },
    'Sleep een maalbubble op een breukbubble. Tikken mag ook: kies twee bubbles.': { en: 'Drag a multiply bubble onto a fraction bubble. Tapping also works: choose two bubbles.', fr: 'Glisse une bulle multiplier sur une bulle de fraction. Toucher fonctionne aussi : choisis deux bulles.', es: 'Arrastra una burbuja de multiplicar sobre una fracción. También puedes tocar: elige dos burbujas.', tl: 'I-drag ang multiply bubble sa fraction bubble. Pwede ring i-tap: pumili ng dalawang bubble.' },
    'Kies slim: versmelt twee breukbubbles, of sleep een operatorbubble op een breukbubble.': { en: 'Choose smartly: fuse two fraction bubbles, or drag an operator bubble onto a fraction bubble.', fr: 'Choisis intelligemment : fusionne deux bulles de fraction, ou glisse une bulle opérateur sur une bulle de fraction.', es: 'Elige con inteligencia: fusiona dos burbujas de fracción o arrastra una burbuja operador sobre una fracción.', tl: 'Pumili nang matalino: pagsanibin ang dalawang fraction bubble, o i-drag ang operator bubble sa fraction bubble.' },
    'Versmelt bubbles. Min-bubbles nemen een stukje weg.': { en: 'Fuse bubbles. Minus bubbles take a piece away.', fr: 'Fusionne les bulles. Les bulles moins enlèvent un morceau.', es: 'Fusiona burbujas. Las burbujas menos quitan una parte.', tl: 'Pagsanibin ang bubbles. Ang minus-bubbles ay nagbabawas ng bahagi.' },
    'bevestig je gekozen bubbles': { en: 'confirm your chosen bubbles', fr: 'confirme tes bulles choisies', es: 'confirma tus burbujas elegidas', tl: 'kumpirmahin ang piniling bubbles' },
    'Dat kan hier nog niet.': { en: 'That does not work here yet.', fr: 'Ça ne marche pas encore ici.', es: 'Eso todavía no funciona aquí.', tl: 'Hindi pa puwede iyan dito.' }

  };

  BP.I18n = {
    langs: LANGS,
    get: getLang,
    set: setLang,
    t: t,
    text: text,
    format: format,
    short: short,
    localize: localize,
    escape: escapeHtml
  };

  function getLang() {
    var state = BP.Store && BP.Store.get ? BP.Store.get() : null;
    var lang = state && state.settings && state.settings.language;
    return LANGS.some(function (item) { return item.code === lang; }) ? lang : FALLBACK;
  }

  function setLang(lang) {
    var valid = LANGS.some(function (item) { return item.code === lang; });
    if (!valid) lang = FALLBACK;
    BP.Store.update(function (state) {
      state.settings = state.settings || {};
      state.settings.language = lang;
    });
    document.documentElement.lang = lang;
    return lang;
  }

  function short() {
    var lang = getLang();
    var item = LANGS.find(function (entry) { return entry.code === lang; });
    return item ? item.short : 'NL';
  }

  function t(key, params) {
    var record = UI[key];
    var value = record ? (record[getLang()] || record[FALLBACK] || key) : key;
    return params ? format(value, params) : value;
  }

  function text(value, params) {
    if (value == null) return '';
    if (typeof value === 'object') {
      var objValue = value[getLang()] || value[FALLBACK] || value.nl || '';
      return params ? format(objValue, params) : objValue;
    }
    var str = String(value);
    var record = TEXT[str];
    var out = record ? (record[getLang()] || record[FALLBACK] || str) : str;
    return params ? format(out, params) : out;
  }

  function localize(item, field) {
    return text(item && item[field]);
  }

  function format(template, params) {
    return String(template).replace(/\{([a-zA-Z0-9_]+)\}/g, function (_, key) {
      return params && params[key] != null ? params[key] : '';
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
