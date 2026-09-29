// Les 30 mythes, extraits de l'ancienne base Neon (table `posts`) le 2026-09-29.
// Contenu statique : plus de base de données. Chiffres à re-vérifier au fil de l'eau.
import type { Mythe } from "./types";

export const MYTHES: Mythe[] = [
  {
    "slug": "le-nucleaire-est-plus-dangereux-pour-le-climat-que-le",
    "theme": "paix",
    "niveau": "intermediaire",
    "mythe": "Le nucléaire est plus dangereux pour le climat que le charbon",
    "realite": "C'est l'inverse. Sur son cycle de vie complet, le nucléaire émet environ 12g de CO2e/kWh, contre plus de 800g pour le charbon. C'est l'une des sources d'énergie les moins carbonées disponibles.",
    "resume": "Le nucléaire cause moins de morts par TWh que toutes les autres sources d'énergie, y compris le solaire.",
    "faits": [
      "0.03 morts/TWh pour le nucléaire",
      "24.6 morts/TWh pour le charbon",
      "4.6 morts/TWh pour le gaz"
    ],
    "sources": [
      {
        "nom": "Our World in Data",
        "url": "https://ourworldindata.org/safest-sources-of-energy"
      },
      {
        "nom": "Lancet 2007"
      }
    ],
    "en": {
      "mythe": "Nuclear energy is more dangerous for the climate than coal",
      "realite": "It's the opposite. Over its complete life cycle, nuclear emits about 12g CO2e/kWh, compared to over 800g for coal. It's one of the least carbon-intensive energy sources available."
    }
  },
  {
    "slug": "les-voitures-electriques-polluent-plus-que-les-voitures",
    "theme": "paix",
    "niveau": "debutant",
    "mythe": "Les voitures électriques polluent plus que les voitures thermiques à cause de leurs batteries",
    "realite": "Faux. Même en incluant la fabrication des batteries, une voiture électrique émet 2 à 3 fois moins de CO2 sur son cycle de vie qu'une voiture thermique équivalente. L'avantage augmente avec un mix électrique décarboné.",
    "faits": [],
    "sources": [
      {
        "nom": "ADEME, Transport & Environment studies 2020-2023"
      }
    ],
    "en": {
      "mythe": "Electric cars pollute more than thermal cars because of their batteries",
      "realite": "False. Even including battery manufacturing, an electric car emits 2 to 3 times less CO2 over its life cycle than an equivalent thermal car. The advantage increases with a low-carbon electricity mix."
    }
  },
  {
    "slug": "il-faut-choisir-entre-croissance-economique-et-protection",
    "theme": "justice-sociale",
    "niveau": "intermediaire",
    "mythe": "Il faut choisir entre croissance économique et protection de l'environnement",
    "realite": "C'est un faux dilemme. La transition écologique peut être un moteur de croissance durable. Les investissements dans les énergies renouvelables créent plus d'emplois par euro investi que les énergies fossiles.",
    "resume": "L'inaction climatique coûtera bien plus cher que la transition écologique.",
    "faits": [
      "Coût de l'inaction : 5-20% du PIB mondial",
      "Coût de la transition : 1-2% du PIB/an",
      "Création de millions d'emplois verts"
    ],
    "sources": [
      {
        "nom": "Rapport Stern 2006"
      },
      {
        "nom": "IRENA Jobs Review 2023"
      },
      {
        "nom": "GIEC AR6 WGIII"
      }
    ],
    "en": {
      "mythe": "We must choose between economic growth and environmental protection",
      "realite": "This is a false dilemma. The ecological transition can be a driver of sustainable growth. Investments in renewable energy create more jobs per euro invested than fossil fuels."
    }
  },
  {
    "slug": "le-rechauffement-climatique-s-est-arrete-depuis-1998",
    "theme": "climat",
    "niveau": "debutant",
    "mythe": "Le réchauffement climatique s'est arrêté depuis 1998",
    "realite": "Faux. 2023 a été l'année la plus chaude jamais enregistrée. Les 10 années les plus chaudes ont toutes eu lieu depuis 2010. Le réchauffement continue de manière constante et s'accélère.",
    "faits": [],
    "sources": [
      {
        "nom": "NASA GISS, NOAA, Copernicus Climate Change Service 2024"
      }
    ],
    "en": {
      "mythe": "Global warming stopped since 1998",
      "realite": "False. 2023 was the hottest year ever recorded. The 10 hottest years have all occurred since 2010. Warming continues consistently and is accelerating."
    }
  },
  {
    "slug": "le-co2-n-est-pas-un-polluant-c-est-de-la-nourriture-pour",
    "theme": "climat",
    "niveau": "intermediaire",
    "mythe": "Le CO2 n'est pas un polluant, c'est de la nourriture pour les plantes",
    "realite": "Certes, les plantes utilisent le CO2, mais l'augmentation de sa concentration dans l'atmosphère perturbe l'équilibre climatique. Au-delà d'un certain seuil, même les plantes souffrent de la chaleur et des sécheresses.",
    "resume": "L'excès de CO₂ réduit la valeur nutritive des plantes et augmente les sécheresses.",
    "faits": [
      "Rendements agricoles menacés par les sécheresses",
      "Baisse de la teneur en protéines des céréales",
      "Effet de fertilisation limité par l'eau et les nutriments"
    ],
    "sources": [
      {
        "nom": "Nature Climate Change",
        "url": "https://www.nature.com/nclimate/"
      },
      {
        "nom": "GIEC AR6 WGII Chap. 5"
      }
    ],
    "en": {
      "mythe": "CO2 is not a pollutant, it's plant food",
      "realite": "While plants do use CO2, increasing its concentration in the atmosphere disrupts climate balance. Beyond a certain threshold, even plants suffer from heat and droughts."
    }
  },
  {
    "slug": "les-eoliennes-tuent-plus-d-oiseaux-que-n-importe-quelle",
    "theme": "vivant",
    "niveau": "debutant",
    "mythe": "Les éoliennes tuent plus d'oiseaux que n'importe quelle autre cause",
    "realite": "Faux. Les éoliennes causent environ 0,3% de la mortalité aviaire. Les principales causes sont les collisions avec les bâtiments (58%), les chats domestiques (13%), et les lignes électriques (8%).",
    "resume": "Les chats tuent 1000 fois plus d'oiseaux que les éoliennes chaque année.",
    "faits": [
      "Chats : 1-4 milliards d'oiseaux/an (USA)",
      "Bâtiments : 600 millions/an",
      "Éoliennes : 140 000-500 000/an"
    ],
    "sources": [
      {
        "nom": "Audubon Society",
        "url": "https://www.audubon.org/news/will-wind-turbines-ever-be-safe-birds"
      },
      {
        "nom": "Loss et al. 2013, Nature Communications"
      }
    ],
    "en": {
      "mythe": "Wind turbines kill more birds than any other cause",
      "realite": "False. Wind turbines cause about 0.3% of bird mortality. The main causes are collisions with buildings (58%), domestic cats (13%), and power lines (8%)."
    }
  },
  {
    "slug": "il-faut-1000-ans-pour-recycler-une-bouteille-en-plastique",
    "theme": "vivant",
    "niveau": "debutant",
    "mythe": "Il faut 1000 ans pour recycler une bouteille en plastique",
    "realite": "C'est la durée de dégradation naturelle, pas de recyclage. En réalité, une bouteille PET se recycle en 2-4 semaines et peut devenir une nouvelle bouteille ou d'autres produits. Le problème est le taux de collecte insuffisant.",
    "faits": [],
    "sources": [
      {
        "nom": "PlasticsEurope, Ellen MacArthur Foundation"
      }
    ],
    "en": {
      "mythe": "It takes 1000 years to recycle a plastic bottle",
      "realite": "That's the natural degradation time, not recycling time. In reality, a PET bottle can be recycled in 2-4 weeks and become a new bottle or other products. The problem is insufficient collection rates."
    }
  },
  {
    "slug": "la-banquise-arctique-regagne-de-la-superficie-chaque-annee",
    "theme": "climat",
    "niveau": "debutant",
    "mythe": "La banquise arctique regagne de la superficie chaque année",
    "realite": "Faux. La banquise arctique perd environ 13% de sa superficie par décennie depuis 1979. Septembre 2023 a enregistré la 6e plus faible étendue depuis le début des mesures satellites.",
    "faits": [],
    "sources": [
      {
        "nom": "NSIDC (National Snow and Ice Data Center), NOAA Arctic Report Card"
      }
    ],
    "en": {
      "mythe": "Arctic sea ice is gaining area every year",
      "realite": "False. Arctic sea ice is losing about 13% of its area per decade since 1979. September 2023 recorded the 6th smallest extent since satellite measurements began."
    }
  },
  {
    "slug": "le-climat-a-toujours-change-c-est-naturel",
    "theme": "climat",
    "niveau": "intermediaire",
    "mythe": "Le climat a toujours changé, c'est naturel",
    "realite": "Le climat a effectivement varié naturellement, mais jamais à cette vitesse. Le réchauffement actuel est 10 fois plus rapide que la sortie du dernier âge glaciaire. Et surtout, les causes sont identifiées : 100% du réchauffement depuis 1950 est attribuable aux activités humaines.",
    "resume": "La vitesse actuelle du réchauffement est 10 fois plus rapide que les changements naturels passés.",
    "faits": [
      "Sortie d'ère glaciaire : +4°C en 10 000 ans",
      "Réchauffement actuel : +1.2°C en 150 ans",
      "Vitesse sans précédent depuis 65 millions d'années"
    ],
    "sources": [
      {
        "nom": "GIEC AR6 WG1",
        "url": "https://www.ipcc.ch/report/ar6/wg1/"
      },
      {
        "nom": "Marcott et al. 2013"
      }
    ],
    "en": {
      "mythe": "The climate has always changed, it's natural",
      "realite": "Climate has indeed varied naturally, but never at this speed. Current warming is 10 times faster than the exit from the last ice age. Most importantly, the causes are identified: 100% of warming since 1950 is attributable to human activities."
    }
  },
  {
    "slug": "les-scientifiques-ne-sont-pas-d-accord-entre-eux-sur-le",
    "theme": "climat",
    "niveau": "debutant",
    "mythe": "Les scientifiques ne sont pas d'accord entre eux sur le réchauffement climatique",
    "realite": "Faux. 97% des climatologues actifs s'accordent sur la réalité du réchauffement anthropique. Les études récentes montrent même un consensus proche de 99,9% dans les publications scientifiques. Le débat porte sur les détails, pas sur la réalité du phénomène.",
    "resume": "97% des climatologues s'accordent sur l'origine humaine du réchauffement climatique.",
    "faits": [
      "97% de consensus parmi les experts",
      "Plus de 11 000 études analysées",
      "Aucune académie des sciences ne conteste"
    ],
    "sources": [
      {
        "nom": "Cook et al. 2013",
        "url": "https://iopscience.iop.org/article/10.1088/1748-9326/8/2/024024"
      },
      {
        "nom": "NASA Scientific Consensus",
        "url": "https://climate.nasa.gov/scientific-consensus/"
      }
    ],
    "en": {
      "mythe": "Scientists don't agree on climate change",
      "realite": "False. 97% of active climate scientists agree on the reality of anthropogenic warming. Recent studies show consensus close to 99.9% in scientific publications. The debate is about details, not the reality of the phenomenon."
    }
  },
  {
    "slug": "c-est-le-soleil-qui-cause-le-rechauffement-climatique",
    "theme": "climat",
    "niveau": "intermediaire",
    "mythe": "C'est le soleil qui cause le réchauffement climatique",
    "realite": "L'activité solaire est stable ou en légère baisse depuis 1980, alors que les températures augmentent. Si le soleil était responsable, toute l'atmosphère se réchaufferait uniformément. Or, la stratosphère se refroidit tandis que la troposphère se réchauffe - signature typique de l'effet de serre.",
    "resume": "L'activité solaire est stable depuis 50 ans, elle ne peut pas expliquer le réchauffement actuel.",
    "faits": [
      "Irradiance solaire stable depuis 1950",
      "Réchauffement accéléré depuis 1980",
      "Corrélation parfaite avec hausse du CO₂"
    ],
    "sources": [
      {
        "nom": "NASA Solar Irradiance",
        "url": "https://climate.nasa.gov/causes/"
      },
      {
        "nom": "GIEC AR6 Chap. 7"
      }
    ],
    "en": {
      "mythe": "The sun is causing global warming",
      "realite": "Solar activity has been stable or slightly declining since 1980, while temperatures rise. If the sun were responsible, the entire atmosphere would warm uniformly. But the stratosphere is cooling while the troposphere warms - a typical greenhouse effect signature."
    }
  },
  {
    "slug": "la-france-ne-represente-que-1-des-emissions-mondiales-nos",
    "theme": "justice-sociale",
    "niveau": "intermediaire",
    "mythe": "La France ne représente que 1% des émissions mondiales, nos efforts sont inutiles",
    "realite": "La France est le 19e émetteur mondial. Si chaque pays en dessous de 3% des émissions ne faisait rien, 80% des émissions mondiales seraient ignorées. De plus, l'empreinte carbone réelle des Français (incluant les importations) est 2 fois plus élevée que les émissions territoriales.",
    "faits": [],
    "sources": [
      {
        "nom": "Global Carbon Project, Haut Conseil pour le Climat 2023"
      }
    ],
    "en": {
      "mythe": "France only represents 1% of global emissions, our efforts are useless",
      "realite": "France is the 19th largest emitter globally. If every country below 3% of emissions did nothing, 80% of global emissions would be ignored. Moreover, the real carbon footprint of French people (including imports) is 2 times higher than territorial emissions."
    }
  },
  {
    "slug": "les-modeles-climatiques-ne-sont-pas-fiables",
    "theme": "climat",
    "niveau": "avance",
    "mythe": "Les modèles climatiques ne sont pas fiables",
    "realite": "Les modèles climatiques des années 1970-90 ont prédit avec précision le réchauffement observé aujourd'hui. Le modèle de James Hansen en 1988 prévoyait +0,5°C d'ici 2020 - nous avons mesuré exactement cela. Les modèles actuels sont encore plus précis.",
    "resume": "Les modèles climatiques ont correctement prédit le réchauffement depuis 50 ans.",
    "faits": [
      "Prédictions de 1990 confirmées par observations",
      "Marge d'erreur de ±0.3°C sur 30 ans",
      "Physique des modèles basée sur lois connues"
    ],
    "sources": [
      {
        "nom": "Hausfather et al. 2020, Geophysical Research Letters"
      },
      {
        "nom": "GIEC AR6 WG1 Chap. 4"
      }
    ],
    "en": {
      "mythe": "Climate models are not reliable",
      "realite": "Climate models from the 1970s-90s accurately predicted the warming observed today. James Hansen's 1988 model predicted +0.5°C by 2020 - we measured exactly that. Current models are even more precise."
    }
  },
  {
    "slug": "le-rechauffement-climatique-c-est-juste-quelques-degres-de",
    "theme": "climat",
    "niveau": "intermediaire",
    "mythe": "Le réchauffement climatique, c'est juste quelques degrés de plus, pas grave",
    "realite": "Pendant l'âge glaciaire, la température moyenne n'était que 4-5°C plus basse qu'aujourd'hui, et des kilomètres de glace recouvraient l'Europe. Chaque degré compte énormément : +1,5°C = 70% des récifs coralliens morts, +2°C = 99% des récifs morts et 400 millions de personnes exposées à la pénurie d'eau.",
    "faits": [],
    "sources": [
      {
        "nom": "GIEC Rapport Spécial 1.5°C, World Meteorological Organization"
      }
    ],
    "en": {
      "mythe": "Global warming is just a few degrees more, no big deal",
      "realite": "During the ice age, average temperature was only 4-5°C lower than today, and kilometers of ice covered Europe. Every degree matters enormously: +1.5°C = 70% of coral reefs dead, +2°C = 99% of reefs dead and 400 million people exposed to water scarcity."
    }
  },
  {
    "slug": "les-pays-pauvres-doivent-d-abord-se-developper-avant-de",
    "theme": "justice-sociale",
    "niveau": "intermediaire",
    "mythe": "Les pays pauvres doivent d'abord se développer avant de penser au climat",
    "realite": "Les pays pauvres sont les premiers touchés par le changement climatique alors qu'ils en sont les moins responsables. Le Bangladesh subit les inondations, le Sahel la désertification. De plus, le développement via les énergies renouvelables est maintenant moins cher que via les fossiles.",
    "faits": [],
    "sources": [
      {
        "nom": "Banque Mondiale Climate Change, IRENA Renewable Cost Report 2023"
      }
    ],
    "en": {
      "mythe": "Poor countries must develop first before thinking about climate",
      "realite": "Poor countries are the first hit by climate change while being the least responsible. Bangladesh suffers floods, the Sahel desertification. Moreover, development through renewable energy is now cheaper than through fossil fuels."
    }
  },
  {
    "slug": "l-agriculture-biologique-ne-peut-pas-nourrir-le-monde",
    "theme": "vivant",
    "niveau": "intermediaire",
    "mythe": "L'agriculture biologique ne peut pas nourrir le monde",
    "realite": "Des études montrent qu'une agriculture mondiale agroécologique pourrait nourrir 9 milliards d'humains, à condition de réduire le gaspillage alimentaire (30% de la production actuelle) et la consommation de viande. Le problème n'est pas la production mais la distribution et nos modes de consommation.",
    "faits": [],
    "sources": [
      {
        "nom": "FAO Agroecology Report, IPES-Food 2016, Nature Plants 2017"
      }
    ],
    "en": {
      "mythe": "Organic farming cannot feed the world",
      "realite": "Studies show that worldwide agroecological farming could feed 9 billion humans, provided we reduce food waste (30% of current production) and meat consumption. The problem is not production but distribution and our consumption patterns."
    }
  },
  {
    "slug": "la-technologie-nous-sauvera-pas-besoin-de-changer-nos",
    "theme": "climat",
    "niveau": "intermediaire",
    "mythe": "La technologie nous sauvera, pas besoin de changer nos habitudes",
    "realite": "La technologie est nécessaire mais insuffisante. Même avec 100% d'électricité décarbonée, il faudrait encore réduire l'élevage, l'aviation, le béton, etc. Le GIEC est clair : sans sobriété énergétique ET technologies vertes, impossible de rester sous +2°C.",
    "faits": [],
    "sources": [
      {
        "nom": "GIEC AR6 WG3, Agence Internationale de l'Énergie Net Zero 2050"
      }
    ],
    "en": {
      "mythe": "Technology will save us, no need to change our habits",
      "realite": "Technology is necessary but insufficient. Even with 100% decarbonized electricity, we would still need to reduce livestock, aviation, concrete, etc. The IPCC is clear: without energy sobriety AND green technologies, staying below +2°C is impossible."
    }
  },
  {
    "slug": "le-groenland-etait-vert-a-l-epoque-des-vikings-preuve-que",
    "theme": "climat",
    "niveau": "avance",
    "mythe": "Le Groenland était vert à l'époque des Vikings, preuve que le climat était plus chaud",
    "realite": "Le nom 'Groenland' (Terre Verte) était du marketing d'Erik le Rouge pour attirer des colons. Les Vikings cultivaient quelques zones côtières très limitées. Aujourd'hui, la fonte actuelle du Groenland libère des sols qui n'avaient pas vu le jour depuis 400 000 ans.",
    "resume": "Le Groenland était vert il y a 400 000 ans, mais les conditions actuelles sont très différentes.",
    "faits": [
      "Vert il y a 400 000-800 000 ans",
      "Niveau mer 6-9m plus haut à l'époque",
      "Conditions climatiques incompatibles avec civilisation actuelle"
    ],
    "sources": [
      {
        "nom": "Christ et al. 2021, Science"
      },
      {
        "nom": "GIEC AR6 WG1 Chap. 9"
      }
    ],
    "en": {
      "mythe": "Greenland was green in Viking times, proof that climate was warmer",
      "realite": "The name 'Greenland' was marketing by Erik the Red to attract settlers. Vikings cultivated only very limited coastal areas. Today, Greenland's current melting is exposing soils that haven't seen daylight for 400,000 years."
    }
  },
  {
    "slug": "les-glaciers-fondent-a-cause-des-variations-naturelles-pas",
    "theme": "climat",
    "niveau": "debutant",
    "mythe": "Les glaciers fondent à cause des variations naturelles, pas du CO2",
    "realite": "Les glaciers du monde entier reculent de façon synchronisée depuis 1850, ce qui ne correspond à aucun cycle naturel connu. 90% des glaciers alpins ont reculé. Le glacier de la Mer de Glace à Chamonix a perdu 2,5 km depuis le début du XXe siècle.",
    "faits": [],
    "sources": [
      {
        "nom": "World Glacier Monitoring Service, CNRS Glaciologie"
      }
    ],
    "en": {
      "mythe": "Glaciers are melting due to natural variations, not CO2",
      "realite": "Glaciers worldwide are retreating synchronously since 1850, which doesn't match any known natural cycle. 90% of Alpine glaciers have retreated. The Mer de Glace glacier in Chamonix has lost 2.5 km since the early 20th century."
    }
  },
  {
    "slug": "le-methane-des-vaches-est-negligeable",
    "ancienSlug": "le-methane-des-vaches-est-negligeable",
    "theme": "vivant",
    "niveau": "debutant",
    "mythe": "Le méthane des vaches est négligeable",
    "realite": "L'élevage est responsable de 14,5% des émissions mondiales de gaz à effet de serre, dont une grande partie est du méthane. Le méthane a un pouvoir réchauffant 80 fois supérieur au CO₂ sur 20 ans. Réduire la consommation de viande est un levier climatique majeur.",
    "resume": "L'élevage émet 14,5% des GES mondiaux, dont beaucoup de méthane ultra-réchauffant.",
    "faits": [
      "14,5% des émissions mondiales",
      "Méthane : 80x plus réchauffant que CO₂ (sur 20 ans)",
      "1kg boeuf = 27kg CO₂eq"
    ],
    "sources": [
      {
        "nom": "FAO GLEAM",
        "url": "https://www.fao.org/gleam/en/"
      },
      {
        "nom": "GIEC AR6 WGIII Chap. 7"
      }
    ],
    "en": {
      "mythe": "Cattle methane emissions are negligible",
      "realite": "Livestock accounts for 14.5% of global greenhouse gas emissions, much of which is methane. Methane has 80 times the warming potential of CO₂ over 20 years. Reducing meat consumption is a major climate lever."
    }
  },
  {
    "slug": "les-energies-renouvelables-ne-sont-pas-fiables",
    "ancienSlug": "les-energies-renouvelables-ne-sont-pas-fiables",
    "theme": "paix",
    "niveau": "intermediaire",
    "mythe": "Les énergies renouvelables ne sont pas fiables",
    "realite": "Le réseau électrique gère déjà l'intermittence via le stockage, l'interconnexion et les smart grids. L'Allemagne, le Danemark et le Portugal ont régulièrement plus de 50% d'électricité renouvelable. Le problème est technique et résolu, pas fondamental.",
    "resume": "L'intermittence est un défi technique résolu par le stockage et les smart grids.",
    "faits": [
      "Danemark : 80% renouvelable en 2023",
      "Batteries : coût divisé par 10 en 10 ans",
      "Interconnexions européennes opérationnelles"
    ],
    "sources": [
      {
        "nom": "RTE Futurs énergétiques 2050"
      },
      {
        "nom": "IRENA Global Renewables Outlook"
      },
      {
        "nom": "IEA World Energy Outlook 2023"
      }
    ],
    "en": {
      "mythe": "Renewable energies are unreliable",
      "realite": "The power grid already manages intermittency through storage, interconnection and smart grids. Germany, Denmark and Portugal regularly have more than 50% renewable electricity. The problem is technical and solvable, not fundamental."
    }
  },
  {
    "slug": "le-rechauffement-s-est-arrete-depuis-15-ans",
    "ancienSlug": "le-rechauffement-s-est-arrete-depuis-15-ans",
    "theme": "climat",
    "niveau": "intermediaire",
    "mythe": "Le réchauffement s'est arrêté depuis 15 ans",
    "realite": "Les 8 dernières années sont les plus chaudes jamais enregistrées. Le prétendu 'hiatus' de 1998-2012 était dû à un El Niño exceptionnel en 1998 qui a créé une anomalie statistique. La tendance à long terme montre un réchauffement continu et accéléré.",
    "resume": "Les 8 dernières années sont les plus chaudes. Le 'hiatus' était une illusion statistique.",
    "faits": [
      "2023 : année la plus chaude de l'histoire",
      "El Niño 1998 : anomalie statistique",
      "Océans absorbent 90% de la chaleur excédentaire"
    ],
    "sources": [
      {
        "nom": "NASA GISS",
        "url": "https://climate.nasa.gov/vital-signs/global-temperature/"
      },
      {
        "nom": "NOAA Global Climate Report"
      }
    ],
    "en": {
      "mythe": "Global warming has stopped for 15 years",
      "realite": "The last 8 years are the warmest ever recorded. The alleged 'hiatus' from 1998-2012 was due to an exceptional El Niño in 1998 that created a statistical anomaly. The long-term trend shows continued and accelerating warming."
    }
  },
  {
    "slug": "planter-des-arbres-suffit-pour-compenser-nos-emissions",
    "ancienSlug": "planter-des-arbres-suffit-pour-compenser-nos-emissions",
    "theme": "vivant",
    "niveau": "intermediaire",
    "mythe": "Planter des arbres suffit pour compenser nos émissions",
    "realite": "Il faudrait planter une surface équivalente aux États-Unis chaque année pour compenser nos émissions. Les arbres mettent 20-50 ans à absorber le CO₂, et les incendies (plus fréquents) relâchent tout. La priorité est de réduire les émissions à la source.",
    "resume": "Il faudrait planter la superficie des USA chaque année. La vraie solution : réduire à la source.",
    "faits": [
      "36 Gt CO₂/an à absorber",
      "1 arbre = 25kg CO₂/an (mature)",
      "Incendies multipliés par 2 depuis 1980"
    ],
    "sources": [
      {
        "nom": "Bastin et al. 2019, Science"
      },
      {
        "nom": "Jancovici - Les puits de carbone"
      }
    ],
    "en": {
      "mythe": "Planting trees is enough to offset our emissions",
      "realite": "We would need to plant an area equivalent to the United States every year to offset our emissions. Trees take 20-50 years to absorb CO₂, and wildfires (more frequent) release it all. The priority is reducing emissions at source."
    }
  },
  {
    "slug": "les-panneaux-solaires-consomment-plus-d-energie-qu-ils-n-en",
    "ancienSlug": "les-panneaux-solaires-consomment-plus-d-energie-qu-ils-n-en-",
    "theme": "paix",
    "niveau": "debutant",
    "mythe": "Les panneaux solaires consomment plus d'énergie qu'ils n'en produisent",
    "realite": "Un panneau solaire rembourse son énergie de fabrication en 1-3 ans selon la région. Il produit ensuite de l'électricité propre pendant 25-30 ans. Le bilan énergétique est donc largement positif : 10 à 30 fois l'énergie investie.",
    "resume": "Remboursé en 1-3 ans, produit 25-30 ans : bilan 10-30x positif.",
    "faits": [
      "EROI solaire : 10-30x l'énergie investie",
      "Durée de vie : 25-30 ans",
      "Temps de retour : 1-3 ans"
    ],
    "sources": [
      {
        "nom": "Fraunhofer ISE PV Report"
      },
      {
        "nom": "NREL Life Cycle Assessment"
      }
    ],
    "en": {
      "mythe": "Solar panels consume more energy than they produce",
      "realite": "A solar panel pays back its manufacturing energy in 1-3 years depending on location. It then produces clean electricity for 25-30 years. The energy balance is therefore largely positive: 10 to 30 times the energy invested."
    }
  },
  {
    "slug": "l-hydrogene-est-la-solution-miracle",
    "ancienSlug": "l-hydrogene-est-la-solution-miracle",
    "theme": "paix",
    "niveau": "avance",
    "mythe": "L'hydrogène est la solution miracle",
    "realite": "L'hydrogène est utile pour décarboner l'industrie lourde (acier, chimie) et certains transports. Mais 95% de l'hydrogène actuel est produit à partir de gaz fossile. L'hydrogène vert (électrolyse) perd 30% d'énergie. Ce n'est pas une solution universelle.",
    "resume": "Utile pour l'industrie lourde, mais 95% vient du fossile et l'électrolyse perd 30% d'énergie.",
    "faits": [
      "95% hydrogène actuel = fossile (gris)",
      "Électrolyse : 30% pertes énergétiques",
      "Pertinent : sidérurgie, chimie, maritime"
    ],
    "sources": [
      {
        "nom": "IEA Hydrogen Report"
      },
      {
        "nom": "Jancovici - L'hydrogène",
        "url": "https://jancovici.com"
      },
      {
        "nom": "ADEME - Hydrogène"
      }
    ],
    "en": {
      "mythe": "Hydrogen is the miracle solution",
      "realite": "Hydrogen is useful for decarbonizing heavy industry (steel, chemicals) and some transport. But 95% of current hydrogen is produced from fossil gas. Green hydrogen (electrolysis) loses 30% of energy. It's not a universal solution."
    }
  },
  {
    "slug": "le-recyclage-resout-le-probleme-du-plastique",
    "ancienSlug": "le-recyclage-resout-le-probleme-du-plastique",
    "theme": "vivant",
    "niveau": "debutant",
    "mythe": "Le recyclage résout le problème du plastique",
    "realite": "Seulement 9% du plastique mondial est recyclé. Le reste finit en décharge, incinéré ou dans la nature. Chaque recyclage dégrade la qualité (downcycling). La vraie solution : réduire la production de plastique à la source et favoriser le réemploi.",
    "resume": "Seulement 9% recyclé. Le reste en décharge ou nature. Solution : réduire à la source.",
    "faits": [
      "9% recyclé mondialement",
      "91% en décharge, incinéré ou nature",
      "8 millions tonnes/an dans les océans"
    ],
    "sources": [
      {
        "nom": "OCDE Global Plastics Outlook 2022"
      },
      {
        "nom": "ONU Environnement"
      }
    ],
    "en": {
      "mythe": "Recycling solves the plastic problem",
      "realite": "Only 9% of global plastic is recycled. The rest ends up in landfills, incinerated or in nature. Each recycling degrades quality (downcycling). The real solution: reduce plastic production at source and promote reuse."
    }
  },
  {
    "slug": "les-oceans-absorbent-tout-le-co2-pas-de-souci",
    "ancienSlug": "les-oceans-absorbent-tout-le-co-pas-de-souci",
    "theme": "climat",
    "niveau": "intermediaire",
    "mythe": "Les océans absorbent tout le CO₂, pas de souci",
    "realite": "Les océans absorbent 25% de notre CO₂, ce qui cause leur acidification. Le pH a baissé de 30% depuis l'ère industrielle, menaçant coraux et coquillages. La capacité d'absorption diminue avec le réchauffement. C'est une bombe à retardement.",
    "resume": "Absorbent 25% du CO₂ mais s'acidifient (-30% pH). Coraux en danger. Capacité qui diminue.",
    "faits": [
      "25% du CO₂ absorbé par les océans",
      "pH : -30% depuis 1850 (acidification)",
      "50% des coraux déjà perdus"
    ],
    "sources": [
      {
        "nom": "GIEC SROCC (Océans et Cryosphère)"
      },
      {
        "nom": "NOAA Ocean Acidification",
        "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-acidification"
      }
    ],
    "en": {
      "mythe": "Oceans absorb all the CO₂, no worries",
      "realite": "Oceans absorb 25% of our CO₂, causing their acidification. pH has dropped 30% since the industrial era, threatening corals and shellfish. Absorption capacity decreases with warming. It's a time bomb."
    }
  },
  {
    "slug": "la-fonte-en-antarctique-est-naturelle-et-cyclique",
    "ancienSlug": "la-fonte-en-antarctique-est-naturelle-et-cyclique",
    "theme": "climat",
    "niveau": "avance",
    "mythe": "La fonte en Antarctique est naturelle et cyclique",
    "realite": "La perte de glace en Antarctique a été multipliée par 3 depuis 2012. La calotte ouest est instable et contient assez de glace pour élever la mer de 3 mètres. Les cycles naturels n'expliquent pas cette accélération brutale.",
    "resume": "Perte de glace x3 depuis 2012. Calotte ouest = +3m de mer potentiel. Accélération anormale.",
    "faits": [
      "Perte de glace x3 depuis 2012",
      "Calotte ouest : +3m de mer potentiel",
      "Accélération incompatible avec cycles naturels"
    ],
    "sources": [
      {
        "nom": "GIEC SROCC"
      },
      {
        "nom": "Shepherd et al. 2018, Nature"
      },
      {
        "nom": "NASA Ice Sheets",
        "url": "https://climate.nasa.gov/vital-signs/ice-sheets/"
      }
    ],
    "en": {
      "mythe": "Antarctic ice melt is natural and cyclical",
      "realite": "Ice loss in Antarctica has tripled since 2012. The West Antarctic ice sheet is unstable and contains enough ice to raise sea levels by 3 meters. Natural cycles don't explain this sudden acceleration."
    }
  },
  {
    "slug": "la-transition-ecologique-detruit-l-emploi",
    "ancienSlug": "la-transition-ecologique-detruit-l-emploi",
    "theme": "justice-sociale",
    "niveau": "debutant",
    "mythe": "La transition écologique détruit l'emploi",
    "realite": "La transition crée plus d'emplois qu'elle n'en détruit. Le secteur des énergies renouvelables emploie déjà 12 millions de personnes dans le monde. La rénovation thermique, l'économie circulaire et l'agriculture durable sont des gisements d'emplois locaux non délocalisables.",
    "resume": "Renouvelables = 12M emplois. Rénovation et économie circulaire = emplois locaux non délocalisables.",
    "faits": [
      "12 millions d'emplois dans les renouvelables",
      "Rénovation : 200 000 emplois potentiels/an (France)",
      "Emplois locaux, non délocalisables"
    ],
    "sources": [
      {
        "nom": "IRENA Renewable Energy Jobs 2023"
      },
      {
        "nom": "ADEME Emplois de la transition"
      }
    ],
    "en": {
      "mythe": "The ecological transition destroys jobs",
      "realite": "The transition creates more jobs than it destroys. The renewable energy sector already employs 12 million people worldwide. Thermal renovation, circular economy and sustainable agriculture are sources of local, non-relocatable jobs."
    }
  },
  {
    "slug": "la-chine-pollue-donc-nos-efforts-sont-inutiles",
    "ancienSlug": "la-chine-pollue-donc-nos-efforts-sont-inutiles",
    "theme": "justice-sociale",
    "niveau": "intermediaire",
    "mythe": "La Chine pollue, donc nos efforts sont inutiles",
    "realite": "La Chine émet 27% du CO₂ mondial mais produit 80% de nos panneaux solaires et est leader des batteries. Par habitant, un Américain émet 2x plus qu'un Chinois. Les émissions historiques (depuis 1850) sont dominées par l'Occident.",
    "resume": "Chine = 27% CO₂ mais leader climat. Par habitant, USA = 2x Chine. Historique : Occident responsable.",
    "faits": [
      "Chine : 27% émissions mais 80% panneaux solaires",
      "Par habitant : USA 15t, Chine 8t, France 5t",
      "Émissions historiques : 47% USA+Europe"
    ],
    "sources": [
      {
        "nom": "Global Carbon Project"
      },
      {
        "nom": "Our World in Data - CO₂ emissions",
        "url": "https://ourworldindata.org/co2-emissions"
      }
    ],
    "en": {
      "mythe": "China pollutes, so our efforts are useless",
      "realite": "China emits 27% of global CO₂ but produces 80% of our solar panels and leads in batteries. Per capita, an American emits 2x more than a Chinese person. Historical emissions (since 1850) are dominated by the West."
    }
  }
];
