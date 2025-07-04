import { db } from '../src/server/db';
import { mapPoints } from '../src/server/db/schema';

async function testPremiumMap() {
  console.log('🗺️ Test de la fonctionnalité premium de la carte...');
  
  try {
    // Vérifier combien de points sont dans la base de données
    const allPoints = await db.query.mapPoints.findMany();
    console.log(`📍 Total des points dans la base : ${allPoints.length}`);
    
    if (allPoints.length === 0) {
      console.log('⚠️ Aucun point trouvé. Ajout de points de test...');
      
      // Ajouter quelques points de test
      await db.insert(mapPoints).values([
        {
          lat: 48.8566,
          lng: 2.3522,
          name_en: "Paris Climate Impact",
          name_fr: "Impact Climatique à Paris",
          impact_en: "Heat waves increasing in frequency and intensity.",
          impact_fr: "Vagues de chaleur de plus en plus fréquentes et intenses.",
          category: "heatwave",
          image_url: null
        },
        {
          lat: 40.7128,
          lng: -74.0060,
          name_en: "New York Sea Level Rise",
          name_fr: "Montée des Eaux à New York",
          impact_en: "Sea level rising threatening coastal areas.",
          impact_fr: "Montée du niveau de la mer menaçant les zones côtières.",
          category: "sea-level",
          image_url: null
        },
        {
          lat: -23.5505,
          lng: -46.6333,
          name_en: "São Paulo Drought",
          name_fr: "Sécheresse à São Paulo",
          impact_en: "Extended drought periods affecting water supply.",
          impact_fr: "Périodes de sécheresse prolongées affectant l'approvisionnement en eau.",
          category: "drought",
          image_url: null
        },
        {
          lat: 37.7749,
          lng: -122.4194,
          name_en: "San Francisco Wildfires",
          name_fr: "Incendies à San Francisco",
          impact_en: "Increased wildfire risks due to dry conditions.",
          impact_fr: "Risques d'incendies accrus dus aux conditions sèches.",
          category: "fire",
          image_url: null
        },
        {
          lat: 51.5074,
          lng: -0.1278,
          name_en: "London Flooding",
          name_fr: "Inondations à Londres",
          impact_en: "Increased flooding risks during storm season.",
          impact_fr: "Risques d'inondation accrus pendant la saison des tempêtes.",
          category: "storm",
          image_url: null
        },
        {
          lat: 35.6762,
          lng: 139.6503,
          name_en: "Tokyo Heat Island",
          name_fr: "Îlot de Chaleur à Tokyo",
          impact_en: "Urban heat island effect intensifying.",
          impact_fr: "Effet d'îlot de chaleur urbain qui s'intensifie.",
          category: "heatwave",
          image_url: null
        },
        {
          lat: -33.8688,
          lng: 151.2093,
          name_en: "Sydney Biodiversity Loss",
          name_fr: "Perte de Biodiversité à Sydney",
          impact_en: "Marine ecosystem changes affecting local species.",
          impact_fr: "Changements de l'écosystème marin affectant les espèces locales.",
          category: "biodiversity",
          image_url: null
        },
        {
          lat: 55.7558,
          lng: 37.6176,
          name_en: "Moscow Extreme Weather",
          name_fr: "Temps Extrême à Moscou",
          impact_en: "More frequent extreme weather events.",
          impact_fr: "Événements climatiques extrêmes plus fréquents.",
          category: "other",
          image_url: null
        }
      ]);
      
      console.log('✅ 8 points de test ajoutés à la base de données');
    }
    
    // Tester la logique premium (simulation)
    console.log('\n📊 Test de la logique premium :');
    console.log('👤 Utilisateur non-premium : affichage de 5 points maximum');
    console.log('💎 Utilisateur premium : affichage de tous les points');
    console.log('🔑 Utilisateur admin : affichage de tous les points');
    
    // Vérifier les points finaux
    const finalPoints = await db.query.mapPoints.findMany();
    console.log(`\n🎯 Total final de points : ${finalPoints.length}`);
    
    if (finalPoints.length >= 5) {
      console.log('✅ Assez de points pour tester la limitation premium (minimum 5 requis)');
    } else {
      console.log('⚠️ Pas assez de points pour une démonstration efficace de la limitation');
    }
    
    console.log('\n🚀 Fonctionnalité premium prête à être testée !');
    console.log('📱 Accédez à /map pour voir la limitation en action');
    
  } catch (error) {
    console.error('❌ Erreur lors du test :', error);
  }
}

testPremiumMap().catch(console.error); 