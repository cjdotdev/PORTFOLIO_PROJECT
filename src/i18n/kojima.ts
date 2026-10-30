// ─── Satoshi Kojima, the story (/kojima) ───────────────────────────
// Five chapters told in beats, like a film: each beat is one screen. Facts follow his career record;
// the debut is July 16, 1991 (September 14 is his birthday). Photo captions give the real date and
// place of each picture, so a 2012 photo never stands in as 1999. Four beats are set in type on purpose
// (1970, "No. Yes.", the four days, the three crowns).

import type { KojimaPhotoId } from "../data/kojima";

export interface KojimaBeat {
  kanji: string;
  title: string;
  text: string;
  /** A photo fills the scene; without one, `display` is set in large type instead. */
  photo?: KojimaPhotoId;
  alt?: string;
  caption?: string;
  display?: string[];
}

export interface KojimaChapter {
  id: string;
  kanji: string;
  number: string;
  meta: string;
  title: string;
  subtitle: string;
  intro: string;
  beats: KojimaBeat[];
  close: string;
}

export interface KojimaCopy {
  cover: { kanji: string; reading: string; name: string; native: string; lede: string; begin: string; alt: string; chapters: string };
  chapters: KojimaChapter[];
  letter: { kanji: string; title: string; paragraphs: string[]; sign: string; orange: string; alt: string; caption: string };
  record: {
    title: string;
    titles: string;
    tripleCrown: string;
    iwgp: string;
    ghc: string;
    nwa: string;
    iwgpTag: string;
    g1: string;
    debut: string;
    debutDate: string;
    times: string;
    time: string;
  };
  thanks: { kanji: string; title: string; body: string; credits: string; photoBy: string };
  ui: { back: string; backHref: string; progress: string; top: string };
}

export const kojimaEn: KojimaCopy = {
  cover: {
    kanji: "剛腕",
    reading: "Gōwan, the strong arm",
    name: "Satoshi Kojima",
    native: "小島 聡 · Tokyo, 1970",
    lede: "He loaded trucks outside the dojo until they let him in. Thirty-one years later he held all three of Japan's heavyweight crowns. The orange on this site comes from him.",
    begin: "Begin his story",
    alt: "Satoshi Kojima in his orange gear, arm stretched out along the ropes",
    chapters: "Chapters",
  },
  chapters: [
    {
      id: "young-lion",
      kanji: "夢",
      number: "Chapter I",
      meta: "Tokyo · 1970 to 1994",
      title: "The young lion",
      subtitle: "Outside the door",
      intro: "Before the belts and before the lariat, there was a young man from Kōtō who wanted in, and a door that stayed shut.",
      beats: [
        {
          kanji: "柔道",
          title: "Judo",
          text: "Like many Japanese wrestlers, he starts with judo. When he goes to college, he stops. Whatever he wants, it is not on a tatami.",
          display: ["1970", "Kōtō, Tokyo"],
        },
        {
          kanji: "トラック",
          title: "The trucks",
          text: "He takes a job loading trucks for New Japan Pro-Wrestling. Day after day he carries the gear of the company he wants to wrestle for, and asks the head trainer, Animal Hamaguchi, to take him into the dojo. For months the answer stays the same.",
          display: ["No.", "No.", "No.", "Yes."],
        },
        {
          kanji: "入門",
          title: "Into the dojo",
          text: "February 1991: Hamaguchi says yes. On July 16 Kojima wrestles his first match. Across the ring stands another young lion, Hiroyoshi Yamamoto, who will become Hiroyoshi Tenzan. Neither of them knows it yet.",
          photo: "hamaguchi",
          alt: "Animal Hamaguchi smiling and waving, in a yellow and blue outfit",
          caption: "Animal Hamaguchi, the trainer who let him in, February 2011",
        },
        {
          kanji: "ヤングライオン杯",
          title: "The Young Lion Cup",
          text: "In 1994 he beats Manabu Nakanishi in the final of the Young Lion Cup. At the end of the year he leaves for Europe, and comes back to New Japan in January 1996.",
          photo: "nakanishi",
          alt: "Manabu Nakanishi at ringside",
          caption: "Manabu Nakanishi, his opponent in the 1994 final, Kobe, September 2015",
        },
      ],
      close: "The first man he ever wrestled would become his partner for life.",
    },
    {
      id: "tencozy",
      kanji: "絆",
      number: "Chapter II",
      meta: "New Japan · 1996 to 2002",
      title: "TenCozy",
      subtitle: "Two names, one team",
      intro: "Some men find their best self alone. Kojima found his next to the man he debuted against.",
      beats: [
        {
          kanji: "初王座",
          title: "The first gold",
          text: "Back from Europe, he teams with Nakanishi as The Bull Powers. In May 1997 they beat Riki Choshu and Kensuke Sasaki for the IWGP Tag Team Championship.",
          photo: "choshu",
          alt: "Riki Choshu crouched in the ring",
          caption: "Riki Choshu, Korakuen Hall, January 2006",
        },
        {
          kanji: "nWo",
          title: "nWo Japan",
          text: "At the end of 1998 he joins nWo Japan, led by Keiji Mutoh. There, next to Hiroyoshi Tenzan, the team gets a name made from theirs: TenCozy.",
          photo: "tenzan",
          alt: "Hiroyoshi Tenzan in red trunks, shouting in the ring",
          caption: "Hiroyoshi Tenzan, Osaka, February 2014",
        },
        {
          kanji: "天コジ",
          title: "Tag team of the year",
          text: "Tenzan and Kojima win the IWGP tag titles twice in those years, take the 2001 G1 Tag League, and the Wrestling Observer names them Tag Team of the Year. Two big men who move as one.",
          photo: "tencozy-cutter",
          alt: "Tenzan and Kojima hit their double cutter on Manabu Nakanishi",
          caption: "The TenCozy Cutter on Manabu Nakanishi, Osaka, February 2016",
        },
      ],
      close: "Partners for life do not always stand on the same side. But they come back.",
    },
    {
      id: "all-japan",
      kanji: "決断",
      number: "Chapter III",
      meta: "All Japan · 2002 to 2010",
      title: "The leap",
      subtitle: "Everything on one jump",
      intro: "In 2002 he walks away from the company that raised him, to become the top man somewhere else.",
      beats: [
        {
          kanji: "離脱",
          title: "Leaving",
          text: "January 2002. Antonio Inoki is putting New Japan's top title on shoot-style fighters. Kojima will not follow. He leaves with his mentor, Keiji Mutoh, for All Japan Pro Wrestling, and there he finally gets the push of a main eventer.",
          photo: "mutoh",
          alt: "Keiji Mutoh in a white fur coat, pointing to the crowd at his entrance",
          caption: "Keiji Mutoh, his mentor, Taipei, November 2010",
        },
        {
          kanji: "四日",
          title: "Four days",
          text: "February 16, 2005: he beats Toshiaki Kawada for the Triple Crown, All Japan's top title. Four days later he beats his old partner Tenzan for New Japan's IWGP Heavyweight Championship. No one had ever held both at the same time.",
          display: ["16.02.2005", "20.02.2005"],
        },
        {
          kanji: "裏切り",
          title: "The turn",
          text: "July 2007. He betrays the All Japan army and joins the Voodoo Murders, as co-leader with TARU. A year later he leaves them, to stand with his sworn friend Tenzan.",
          photo: "voodoo",
          alt: "The Voodoo Murders lined up on stage in black",
          caption: "The Voodoo Murders, All Japan, Taipei, November 2010",
        },
        {
          kanji: "再び",
          title: "Again",
          text: "2008: Tenzan and Kojima become the first team to win the G1 Tag League and the World's Strongest Tag Determination League in the same year. September 2009, a few days after turning 39, he takes the Triple Crown back from Yoshihiro Takayama.",
          photo: "takayama",
          alt: "Yoshihiro Takayama, blond, walking to the ring",
          caption: "Yoshihiro Takayama, Taipei, November 2009",
        },
      ],
      close: "He left home to become a champion. Then he came home as one.",
    },
    {
      id: "return",
      kanji: "帰還",
      number: "Chapter IV",
      meta: "New Japan · 2010 to 2017",
      title: "The return",
      subtitle: "Home, and on top",
      intro: "An arm that needed surgery, a contract All Japan would not renew. He goes back to where it started.",
      beats: [
        {
          kanji: "優勝",
          title: "The G1 Climax",
          text: "August 2010. He returns to New Japan for the G1 Climax, wins his block with five wins from seven, and in the final on August 15 he beats Hiroshi Tanahashi. Kojima wins the G1 at 39.",
          photo: "g1",
          alt: "Kojima raises both arms in the ring",
          caption: "G1 Climax 21, Osaka, August 2011",
        },
        {
          kanji: "王者",
          title: "Champion again",
          text: "October 11, 2010: he beats Togi Makabe and the IWGP Heavyweight Championship is his again, eight years after he left.",
          photo: "iwgp",
          alt: "Kojima shouts, the IWGP Heavyweight belt around his waist",
          caption: "IWGP Heavyweight Champion, Osaka, December 2010",
        },
        {
          kanji: "剛腕",
          title: "The strong arm",
          text: "They call him Gōwan, the strong arm. The Machine Gun Chops in the corner, the Cozy Cutter, then the lariat that ends it.",
          photo: "lariat",
          alt: "Kojima swings his lariat at Yoshitatsu",
          caption: "Lariat on Yoshitatsu, Osaka, February 2017",
        },
        {
          kanji: "天コジ",
          title: "TenCozy, again",
          text: "January 4, 2012, at the Tokyo Dome: Tenzan and Kojima win the IWGP tag titles again. Between them they will hold those belts six times.",
          photo: "tencozy",
          alt: "Tenzan and Kojima shake hands, each with a tag title belt",
          caption: "IWGP tag team champions, Osaka, February 2012",
        },
        {
          kanji: "NWA",
          title: "The ten pounds of gold",
          text: "January 4, 2014, at Wrestle Kingdom 8, he beats Rob Conway for the NWA World Heavyweight Championship. In April he and Tenzan add the NWA World Tag Team titles.",
          photo: "nwa",
          alt: "Tenzan and Kojima raise their fists next to the referee",
          caption: "NWA world tag team champions, Osaka, June 2014",
        },
        {
          kanji: "友",
          title: "The friend",
          text: "In 2016 he gives up his own place in the G1 Climax so Tenzan can have one last run at it. The same year he wins the NEVER six-man titles with Ricochet and Matt Sydal, then wins them back with Ricochet and David Finlay.",
          photo: "never",
          alt: "Kojima, with David Finlay and Ricochet, holds the NEVER six-man belt",
          caption: "With David Finlay and Ricochet, Kobe, September 2016",
        },
      ],
      close: "Eight years away. He came back and took it all again.",
    },
    {
      id: "third-crown",
      kanji: "三冠",
      number: "Chapter V",
      meta: "NOAH · 2022 to today",
      title: "The third crown",
      subtitle: "At fifty-one",
      intro: "Most careers are over by the age he was when he won the one title he was missing.",
      beats: [
        {
          kanji: "挑戦",
          title: "The challenge",
          text: "April 30, 2022. At NOAH's Majestic he is revealed as Naomichi Marufuji's mystery partner. They win. That night he challenges the new GHC Heavyweight Champion, Go Shiozaki.",
          photo: "noah",
          alt: "Kojima in his orange robe, looking across the ring",
          caption: "Pro Wrestling NOAH, Yokohama Arena, January 2023",
        },
        {
          kanji: "達成",
          title: "All three",
          text: "June 12, 2022, CyberFight Festival: he beats Shiozaki for the GHC Heavyweight Championship. With the Triple Crown and the IWGP title behind him, he has now won all three of Japan's major heavyweight crowns. Only Keiji Mutoh, Kensuke Sasaki and Yoshihiro Takayama had done it before.",
          display: ["Triple Crown · 2005", "IWGP · 2005", "GHC · 2022"],
        },
        {
          kanji: "現役",
          title: "Still in the ring",
          text: "In his fifties he keeps wrestling: the GHC tag titles with Takashi Sugiura in 2022, the Ōdō Tournament in 2023, CM Punk at AEW Forbidden Door that June.",
          photo: "punk",
          alt: "Kojima and CM Punk in the ring, seen from the stands",
          caption: "Against CM Punk, AEW Forbidden Door, Toronto, June 2023",
        },
      ],
      close: "Thirty-one years after his debut, the crown he was missing.",
    },
  ],
  letter: {
    kanji: "君へ",
    title: "To you",
    paragraphs: [
      "He was told no before anyone told him yes. So he loaded the trucks, and he kept asking.",
      "He lost his belts and won them back. He left home to become a champion and came home to be one again. He lost to his best friend, then gave that friend his own place so he could try once more. At fifty-one he took the one crown he was missing.",
      "If you are loading trucks right now, outside the door of the thing you want, keep loading. Keep asking. The door opens for whoever is still standing in front of it.",
    ],
    sign: "Your friend, Joel",
    orange: "The orange on this site is his.",
    alt: "Kojima in an orange and black robe, leaning on the ropes",
    caption: "Destruction in Kobe, September 2015",
  },
  record: {
    title: "The record",
    titles: "championships",
    tripleCrown: "Triple Crown",
    iwgp: "IWGP Heavyweight",
    ghc: "GHC Heavyweight",
    nwa: "NWA World Heavyweight",
    iwgpTag: "IWGP Tag Team",
    g1: "G1 Climax winner",
    debut: "Debut",
    debutDate: "July 16, 1991",
    times: "times",
    time: "time",
  },
  thanks: {
    kanji: "感謝",
    title: "Thank you, Kojima",
    body: "A fan's tribute, with no commercial purpose. Not affiliated with New Japan Pro-Wrestling, All Japan Pro Wrestling or Pro Wrestling NOAH.",
    credits: "Photo credits",
    photoBy: "Photo",
  },
  ui: {
    back: "Back to home",
    backHref: "/#off-the-clock",
    progress: "Story progress",
    top: "Back to the start",
  },
};

export const kojimaFr: KojimaCopy = {
  cover: {
    kanji: "剛腕",
    reading: "Gōwan, le bras puissant",
    name: "Satoshi Kojima",
    native: "小島 聡 · Tokyo, 1970",
    lede: "Il a chargé des camions devant le dojo jusqu'à ce qu'on le laisse entrer. Trente et un ans plus tard, il avait remporté les trois grandes couronnes poids lourds du Japon. L'orange de ce site vient de lui.",
    begin: "Commencer son histoire",
    alt: "Satoshi Kojima dans sa tenue orange, le bras tendu le long des cordes",
    chapters: "Chapitres",
  },
  chapters: [
    {
      id: "young-lion",
      kanji: "夢",
      number: "Chapitre I",
      meta: "Tokyo · 1970 à 1994",
      title: "Le jeune lion",
      subtitle: "Devant la porte",
      intro: "Avant les ceintures et avant la lariat, il y avait un jeune homme de Kōtō qui voulait entrer, et une porte qui restait fermée.",
      beats: [
        {
          kanji: "柔道",
          title: "Le judo",
          text: "Comme beaucoup de catcheurs japonais, il commence par le judo. Quand il entre à l'université, il arrête. Ce qu'il cherche ne se trouve pas sur un tatami.",
          display: ["1970", "Kōtō, Tokyo"],
        },
        {
          kanji: "トラック",
          title: "Les camions",
          text: "Il trouve un emploi à charger les camions de la New Japan Pro-Wrestling. Jour après jour, il porte le matériel de la compagnie pour laquelle il rêve de combattre, et demande à l'entraîneur en chef, Animal Hamaguchi, de le prendre au dojo. Pendant des mois, la réponse ne change pas.",
          display: ["Non.", "Non.", "Non.", "Oui."],
        },
        {
          kanji: "入門",
          title: "L'entrée au dojo",
          text: "Février 1991 : Hamaguchi dit oui. Le 16 juillet, Kojima dispute son premier match. En face de lui, un autre jeune lion, Hiroyoshi Yamamoto, qui deviendra Hiroyoshi Tenzan. Aucun des deux ne le sait encore.",
          photo: "hamaguchi",
          alt: "Animal Hamaguchi souriant, la main levée, en tenue jaune et bleue",
          caption: "Animal Hamaguchi, l'entraîneur qui l'a laissé entrer, février 2011",
        },
        {
          kanji: "ヤングライオン杯",
          title: "La Young Lion Cup",
          text: "En 1994, il bat Manabu Nakanishi en finale de la Young Lion Cup. À la fin de l'année, il part en Europe, et revient à la New Japan en janvier 1996.",
          photo: "nakanishi",
          alt: "Manabu Nakanishi au bord du ring",
          caption: "Manabu Nakanishi, son adversaire en finale en 1994, Kobe, septembre 2015",
        },
      ],
      close: "Le premier homme qu'il a affronté deviendra son partenaire pour la vie.",
    },
    {
      id: "tencozy",
      kanji: "絆",
      number: "Chapitre II",
      meta: "New Japan · 1996 à 2002",
      title: "TenCozy",
      subtitle: "Deux noms, une équipe",
      intro: "Certains donnent le meilleur d'eux-mêmes seuls. Kojima l'a trouvé à côté de l'homme contre qui il avait débuté.",
      beats: [
        {
          kanji: "初王座",
          title: "Le premier titre",
          text: "De retour d'Europe, il fait équipe avec Nakanishi sous le nom de The Bull Powers. En mai 1997, ils battent Riki Choshu et Kensuke Sasaki et remportent l'IWGP Tag Team Championship.",
          photo: "choshu",
          alt: "Riki Choshu accroupi sur le ring",
          caption: "Riki Choshu, Korakuen Hall, janvier 2006",
        },
        {
          kanji: "nWo",
          title: "nWo Japan",
          text: "Fin 1998, il rejoint la nWo Japan, menée par Keiji Mutoh. Là, aux côtés de Hiroyoshi Tenzan, l'équipe reçoit un nom fait des leurs : TenCozy.",
          photo: "tenzan",
          alt: "Hiroyoshi Tenzan en short rouge, criant sur le ring",
          caption: "Hiroyoshi Tenzan, Osaka, février 2014",
        },
        {
          kanji: "天コジ",
          title: "Équipe de l'année",
          text: "Tenzan et Kojima remportent deux fois les titres par équipe IWGP pendant ces années, gagnent la G1 Tag League 2001, et le Wrestling Observer les élit équipe de l'année. Deux colosses qui bougent comme un seul homme.",
          photo: "tencozy-cutter",
          alt: "Tenzan et Kojima portent leur cutter en duo sur Manabu Nakanishi",
          caption: "Le TenCozy Cutter sur Manabu Nakanishi, Osaka, février 2016",
        },
      ],
      close: "Les partenaires pour la vie ne sont pas toujours du même côté. Mais ils reviennent.",
    },
    {
      id: "all-japan",
      kanji: "決断",
      number: "Chapitre III",
      meta: "All Japan · 2002 à 2010",
      title: "Le grand saut",
      subtitle: "Tout sur un seul pari",
      intro: "En 2002, il quitte la compagnie qui l'a formé, pour devenir la tête d'affiche ailleurs.",
      beats: [
        {
          kanji: "離脱",
          title: "Le départ",
          text: "Janvier 2002. Antonio Inoki confie le titre majeur de la New Japan à des combattants de style shoot. Kojima refuse de suivre. Il part avec son mentor, Keiji Mutoh, pour l'All Japan Pro Wrestling, où il est enfin poussé comme tête d'affiche.",
          photo: "mutoh",
          alt: "Keiji Mutoh en manteau de fourrure blanc, désignant la foule à son entrée",
          caption: "Keiji Mutoh, son mentor, Taipei, novembre 2010",
        },
        {
          kanji: "四日",
          title: "Quatre jours",
          text: "16 février 2005 : il bat Toshiaki Kawada et remporte la Triple Crown, le titre majeur de l'All Japan. Quatre jours plus tard, il bat son ancien partenaire Tenzan pour l'IWGP Heavyweight Championship de la New Japan. Personne n'avait jamais tenu les deux en même temps.",
          display: ["16.02.2005", "20.02.2005"],
        },
        {
          kanji: "裏切り",
          title: "La trahison",
          text: "Juillet 2007. Il trahit l'armée de l'All Japan et rejoint les Voodoo Murders, comme co-leader avec TARU. Un an plus tard, il les quitte pour se tenir aux côtés de son ami juré, Tenzan.",
          photo: "voodoo",
          alt: "Les Voodoo Murders alignés sur scène, en noir",
          caption: "Les Voodoo Murders, All Japan, Taipei, novembre 2010",
        },
        {
          kanji: "再び",
          title: "Encore",
          text: "2008 : Tenzan et Kojima deviennent la première équipe à gagner la G1 Tag League et la World's Strongest Tag Determination League la même année. Septembre 2009, quelques jours après ses 39 ans, il reprend la Triple Crown à Yoshihiro Takayama.",
          photo: "takayama",
          alt: "Yoshihiro Takayama, blond, en route vers le ring",
          caption: "Yoshihiro Takayama, Taipei, novembre 2009",
        },
      ],
      close: "Il est parti pour devenir champion. Puis il est rentré en champion.",
    },
    {
      id: "return",
      kanji: "帰還",
      number: "Chapitre IV",
      meta: "New Japan · 2010 à 2017",
      title: "Le retour",
      subtitle: "À la maison, et au sommet",
      intro: "Un bras à opérer, un contrat que l'All Japan refuse de renouveler. Il retourne là où tout a commencé.",
      beats: [
        {
          kanji: "優勝",
          title: "Le G1 Climax",
          text: "Août 2010. Il revient à la New Japan pour le G1 Climax, gagne son groupe avec cinq victoires sur sept, et bat Hiroshi Tanahashi en finale le 15 août. Kojima remporte le G1 à 39 ans.",
          photo: "g1",
          alt: "Kojima lève les deux bras sur le ring",
          caption: "G1 Climax 21, Osaka, août 2011",
        },
        {
          kanji: "王者",
          title: "Champion, encore",
          text: "11 octobre 2010 : il bat Togi Makabe et l'IWGP Heavyweight Championship est de nouveau à lui, huit ans après son départ.",
          photo: "iwgp",
          alt: "Kojima crie, la ceinture IWGP Heavyweight autour de la taille",
          caption: "Champion IWGP Heavyweight, Osaka, décembre 2010",
        },
        {
          kanji: "剛腕",
          title: "Le bras puissant",
          text: "On l'appelle Gōwan, le bras puissant. Les Machine Gun Chops dans le coin, le Cozy Cutter, puis la lariat qui met fin au match.",
          photo: "lariat",
          alt: "Kojima envoie sa lariat sur Yoshitatsu",
          caption: "Lariat sur Yoshitatsu, Osaka, février 2017",
        },
        {
          kanji: "天コジ",
          title: "TenCozy, encore",
          text: "4 janvier 2012, au Tokyo Dome : Tenzan et Kojima reprennent les titres par équipe IWGP. Ensemble, ils tiendront ces ceintures six fois.",
          photo: "tencozy",
          alt: "Tenzan et Kojima se serrent la main, chacun avec une ceinture par équipe",
          caption: "Champions par équipe IWGP, Osaka, février 2012",
        },
        {
          kanji: "NWA",
          title: "L'or de la NWA",
          text: "4 janvier 2014, à Wrestle Kingdom 8, il bat Rob Conway pour le NWA World Heavyweight Championship. En avril, Tenzan et lui ajoutent les titres NWA World Tag Team.",
          photo: "nwa",
          alt: "Tenzan et Kojima lèvent le poing à côté de l'arbitre",
          caption: "Champions du monde par équipe NWA, Osaka, juin 2014",
        },
        {
          kanji: "友",
          title: "L'ami",
          text: "En 2016, il cède sa propre place au G1 Climax pour offrir à Tenzan une dernière chance de le gagner. La même année, il remporte les titres NEVER à six avec Ricochet et Matt Sydal, puis les reprend avec Ricochet et David Finlay.",
          photo: "never",
          alt: "Kojima, avec David Finlay et Ricochet, tient la ceinture NEVER à six",
          caption: "Avec David Finlay et Ricochet, Kobe, septembre 2016",
        },
      ],
      close: "Huit ans d'absence. Il est revenu et a tout repris.",
    },
    {
      id: "third-crown",
      kanji: "三冠",
      number: "Chapitre V",
      meta: "NOAH · 2022 à aujourd'hui",
      title: "La troisième couronne",
      subtitle: "À cinquante et un ans",
      intro: "La plupart des carrières sont terminées à l'âge qu'il avait quand il a remporté le seul titre qui lui manquait.",
      beats: [
        {
          kanji: "挑戦",
          title: "Le défi",
          text: "30 avril 2022. À Majestic, l'événement de la NOAH, il est le partenaire mystère de Naomichi Marufuji. Ils gagnent. Le soir même, il défie le nouveau champion GHC Heavyweight, Go Shiozaki.",
          photo: "noah",
          alt: "Kojima dans son peignoir orange, le regard au-dessus du ring",
          caption: "Pro Wrestling NOAH, Yokohama Arena, janvier 2023",
        },
        {
          kanji: "達成",
          title: "Les trois",
          text: "12 juin 2022, CyberFight Festival : il bat Shiozaki et remporte le GHC Heavyweight Championship. Avec la Triple Crown et le titre IWGP, il a désormais gagné les trois grandes couronnes poids lourds du Japon. Avant lui, seuls Keiji Mutoh, Kensuke Sasaki et Yoshihiro Takayama y étaient parvenus.",
          display: ["Triple Crown · 2005", "IWGP · 2005", "GHC · 2022"],
        },
        {
          kanji: "現役",
          title: "Toujours sur le ring",
          text: "À plus de cinquante ans, il continue : les titres par équipe GHC avec Takashi Sugiura en 2022, le tournoi Ōdō en 2023, CM Punk à AEW Forbidden Door en juin de la même année.",
          photo: "punk",
          alt: "Kojima et CM Punk sur le ring, vus depuis les tribunes",
          caption: "Contre CM Punk, AEW Forbidden Door, Toronto, juin 2023",
        },
      ],
      close: "Trente et un ans après ses débuts, la couronne qui lui manquait.",
    },
  ],
  letter: {
    kanji: "君へ",
    title: "Pour toi",
    paragraphs: [
      "On lui a dit non avant qu'on lui dise oui. Alors il a chargé les camions, et il a continué à demander.",
      "Il a perdu ses ceintures et les a reprises. Il a quitté la maison pour devenir champion et il est rentré pour l'être encore. Il a perdu contre son meilleur ami, puis il lui a cédé sa place pour qu'il tente sa chance une dernière fois. À cinquante et un ans, il a pris la seule couronne qui lui manquait.",
      "Si tu charges des camions en ce moment, devant la porte de ce que tu veux, continue de charger. Continue de demander. La porte s'ouvre pour celui qui est encore debout devant elle.",
    ],
    sign: "Ton ami, Joel",
    orange: "L'orange de ce site, c'est le sien.",
    alt: "Kojima dans un peignoir orange et noir, appuyé sur les cordes",
    caption: "Destruction in Kobe, septembre 2015",
  },
  record: {
    title: "Le palmarès",
    titles: "titres",
    tripleCrown: "Triple Crown",
    iwgp: "IWGP Heavyweight",
    ghc: "GHC Heavyweight",
    nwa: "NWA World Heavyweight",
    iwgpTag: "IWGP Tag Team",
    g1: "Vainqueur du G1 Climax",
    debut: "Débuts",
    debutDate: "16 juillet 1991",
    times: "fois",
    time: "fois",
  },
  thanks: {
    kanji: "感謝",
    title: "Merci, Kojima",
    body: "L'hommage d'un fan, sans but commercial. Sans lien avec la New Japan Pro-Wrestling, l'All Japan Pro Wrestling ou la Pro Wrestling NOAH.",
    credits: "Crédits photo",
    photoBy: "Photo",
  },
  ui: {
    back: "Retour à l'accueil",
    backHref: "/fr/#off-the-clock",
    progress: "Progression de l'histoire",
    top: "Revenir au début",
  },
};
