import React, { useState, useEffect, useMemo } from 'react';
import { Box, X, CheckCircle2, ShoppingCart, Heart, Scan } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useCart } from '../CartContext.jsx';
import { localizeProduct } from '../data/productI18n.js';
import ProductGlbViewer from './ProductGlbViewer.jsx';

export const products = [
  { 
    id: 1,
    name: "CONFIER FEED BITE™",
    subtitle: "Gut Probiotic",
    price: "Contact for Details",
    modelGlb: '/models/confier-feed-bite.glb',
    tagline: "Protects Shrimp Gut Health and Enhances Yield",
    benefits: [
      "Improves survival rate and growth.",
      "Promotes feed intake, size and growth rate of the shrimp.",
      "Stimulate the gastrointestinal enzyme activity.",
      "Improves the absorption of nutrients and the shrimp immunity system.",
      "Controls white feces and protects hepatopancreas.",
      "Repairs infected tissues and maintain healthy gut."
    ],
    composition: "Prebiotic Components, Peptides, Vitamins, and Fatty Acids",
    usage: {
      dosage: "10 ml/kg of feed for prevention\n20 ml/kg of feed for treatment",
      netContent: "2 Litres",
      caaNo: "CAA/OCT2022/FA/04248"
    }
  },
  { 
    id: 2,
    name: "CONFIER LIV™",
    subtitle: "Hepatopancreas Protect",
    price: "Contact for Details",
    modelGlb: '/models/confier-liv.glb',
    tagline: "Protecting Shrimp Liver, Ensuring Their Health",
    benefits: [
      "Helps in maintaining healthy hepatopancreas.",
      "Effectively helps to strengthen hepatopancreas function.",
      "Activates the growth of shrimp and absorption of nutrients.",
      "Control the harmful pathogenic bacteria in hepatopancreas",
      "Stimulates shrimp immune system and enhances shrimp growth",
      "Controls the various bacterial infections in acute and chronic stages"
    ],
    composition: "Mixture of fatty acids, inactivated yeast, yeast extracts and natural ingredients on a mineral carrier.",
    usage: {
      dosage: "5 g/kg of feed for acute stage (1 meal/day)\n10 g/kg of feed for chronic stage (2 meals/day)",
      netContent: "500 grams",
      caaNo: "CAA/OCT2022/FA/04246"
    }
  },
  { 
    id: 3, name: "CONFIER MIN Plus™", subtitle: "Essential Minerals", price: "Contact for Details",
    tagline: "Enhancing Shrimp Health and Pond Ecology",
    benefits: [
      "Regulates shrimp blood pH and osmoregulation.",
      "Regulates moulting cycles and prevents white muscle & body cramps.",
      "Highly soluble and bio-available macro and trace minerals.",
      "Improves the formation of exoskeleton.",
      "Improves the good plankton and stabilizes the bloom.",
      "Increase the growth rate and pond carrying capacity."
    ],
    composition: "Highly available mixture of macro and trace minerals, calcium, phosphorus, potassium, chloride, magnesium, cobalt, zinc, selenium and other nutrients.",
    usage: {
      dosage: "Pond Preparation: Apply 10 kg/acre\nDuring Culture: 5 kg/acre for every One Lakh Seed\nIn Feed: Mix 5 kg per ton of feed\nApplication: Dilute with water and apply evenly over the pond with aeration.",
      caaNo: "CAA/APRIL 2025/FA/07310"
    }
  },
  { 
    id: 4, name: "CONFIER PRO BIOS™", subtitle: "Water & Soil Probiotic", price: "Contact for Details",
    tagline: "Boost Pond Health, Protect Shrimp Life",
    benefits: [
      "Improves water, soil quality and pond colour.",
      "Improve the survival and health of shrimps by protecting them from stress, disease and environment.",
      "Suppress the growth of pathogenic vibrios.",
      "Decrease the pond pollution and accelerates sludge degradation.",
      "Probios can be applicable cloudy days also.",
      "Effective in wide range of salinities and pH.",
      "Reduces water exchange frequently.",
      "Its also increase survival and productivity."
    ],
    composition: "Formulated with selected blend of Bacillus species and mineral carrier",
    usage: {
      dosage: "Dosage and application: 1 Kg/ha (1 meter water depth)\nRegular dose: 500 grams/ha at 1 meter water depth, Probios mixed water and broadcast over the pond",
      netContent: "500 Grams",
      caaNo: "CAA/OCT2022/FA/04249"
    }
  },
  { 
    id: 5,
    name: "CONFIER MaZiK®",
    subtitle: "Liquid Mineral",
    price: "Contact for Details",
    modelGlb: '/models/confier-mazik.glb',
    tagline: "Healthier Shrimp, Faster Growth, and Higher Yield",
    benefits: [
      "It prompts moulting in shrimps fast and safer method",
      "It helps in growth performance, digestive enzyme activity and immune response in shrimp",
      "Resolves cramp and stress of shrimp muscle",
      "Reduces the mortality during moulting due to hard shell",
      "Acts as a key enzyme activator and supports muscle formation mechanisms",
      "Assists in improving growth rate and production while enhancing FCR",
      "Reduces stress in shrimp and prevents hard shell problems."
    ],
    composition: "Magnesium, Zinc, Potash and Micro Nutrients",
    usage: {
      dosage: "10 ml/kg of feed for prevention\n20 ml/kg of feed for treatment\nApplication: 2 litres/acre with water at 7-10 PM",
      netContent: "2 litres",
      caaNo: "CAA/OCT2022/FA/04243"
    }
  },
  { 
    id: 6,
    name: "CONFIER DETOX Plus®",
    subtitle: "Soil Probiotic",
    price: "Contact for Details",
    modelGlb: '/models/confier-detox.glb',
    tagline: "Purify Your Pond, Thrive Your Shrimp",
    benefits: [
      "Ingest large amounts of pollutants like organic matter, toxic compounds which deteriorate the pond bottom and pond water.",
      "Prevents the sludge formation and oxidizes the toxic gases like ammonia, H₂S and methane.",
      "Promote stress free environment and increase the production.",
      "Maintain stable pH and works in wide range of salinity.",
      "Minimizes the water exchanges and Reduces pond pollution.",
      "Enhances the DO levels of the pond water and reduces BOD, COD."
    ],
    composition: "Hydrogen sulfide oxidizing bacteria and multi strains of probiotic.",
    usage: {
      dosage: "Regular application: 3 litres/acre\nTreatment dose: 5 litres/acre with sand/water\nFeed Additive: 10-20 ml/kg of feed",
      netContent: "5 litres",
      caaNo: "CAA/APRIL 2025/FA/07309"
    }
  },
  { 
    id: 7,
    name: "CONFIER FLOC™",
    subtitle: "Plankton Pro Enzyme",
    price: "Contact for Details",
    modelGlb: '/models/confier-floc.glb',
    tagline: "Boost Plankton and Enhance Shrimp Growth",
    benefits: [
      "Floc improves the ideal pond conditions by maintaining good phyto and zooplankton populations.",
      "Absorbs unwanted microbes, suspended particles, and oxidizes organic matter.",
      "Facilitates nutrient absorption from sludge to support phytoplankton growth and maintain the good plankton.",
      "Maintains optimal water quality and soil parameters for better growth of shrimp.",
      "Influences the rate of organic decomposition.",
      "Powerful oxidizing agent for the pond bottom sediment."
    ],
    composition: "Enzymes, Beneficial Microorganisms, and Plant Extracts.",
    usage: {
      dosage: "Regular application: 2 Liters per acre.\nBooster dose: 1 Liter per acre mixed with water and broadcast over the pond.",
      netContent: "2 Liters",
      caaNo: "CAA/OCT2022/FA/04245"
    }
  },
  { 
    id: 8,
    name: "CONFIER K-PLUS™",
    subtitle: "Balance Minerals, Boost Shrimp Health",
    price: "Contact for Details",
    modelGlb: '/models/confier-k-plus.glb',
    tagline: "Plays an important role in shrimp moulting, osmoregulation, and regulation of blood pH.",
    benefits: [
      "Plays an important role in shrimp moulting, osmoregulation, and regulation of blood pH.",
      "Supports the control of the nervous system (sodium-potassium pump).",
      "Reduces shrimp body cramping and white muscle.",
      "Improves survival and enhances FCR.",
      "Maintains mineral availability in water and soil.",
      "Prevents loose shell and soft shell formation in shrimp due to nutritional deficiency."
    ],
    composition: "Formulated with Organic Potassium and macronutrients.",
    usage: {
      dosage: "Pond application: Mix 1 liter/acre in pond water and broadcast all over the pond.\nFeed Additive: 10-20 ml/kg of feed.",
      netContent: "2 Litres",
      caaNo: "CAA/NOV2023/FA/05318"
    }
  },
  { 
    id: 9,
    name: "CONFIER SOIL AFM™",
    subtitle: "The Scientific Solution for Ammonia & Nitrite",
    price: "Contact for Details",
    modelGlb: '/models/confier-soil-afm.glb',
    tagline: "Purifying Ponds, Enhancing Shrimp Growth",
    benefits: [
      "Absorbs toxic gases from the pond.",
      "Eliminates noxious odors and ammonia toxicity from the pond bottom and water.",
      "Prevents chemical oxygen demand and maintain oxygen levels.",
      "Promotes better respiratory health in shrimp.",
      "Optimizes feed conversion rates and growth.",
      "Prevents mortality due to ammonia and nitrite."
    ],
    composition: "Yucca Schidigera Glyco-Components: Scientifically proven to bind ammonia directly.\nEnzymes: Break down organic matter.",
    usage: {
      dosage: "Regular Application: 1 liter per acre.\nTreatment Dose: 2 liters per acre with sand/water.\nFeed Additive: 10-20 ml per kg of feed.",
      netContent: "2 Litres",
      caaNo: "CAA/OCT2024/FA/06425"
    }
  },
  { 
    id: 10, name: "CONFIER O2™", subtitle: "Oxygen Releasing Granules", price: "Contact for Details",
    tagline: "Boosting Oxygen, Enhancing Quality, Growing Shrimp",
    benefits: [
      "Increases dissolved oxygen in aquaculture ponds.",
      "Supports aerobic bacteria in reducing organic loads.",
      "Prevents the occurence of ammonia,sulfur dioxide, and hydrogen sulfide",
      "Maintains healthy pond bottoms and water quality.",
      "Promotes phytoplankton growth and stable blooms.",
      "Enhances shrimp growth and survival rates."
    ],
    composition: "Tetraacetylethylenediamine, Sodium Percarbonate, Adsorbents and Deodorizers.",
    usage: {
      dosage: "Dosage and application:\nRegular application: 1 kg/acre of pond water\nLow dissolved oxygen: 2-kg/acre of pond water",
      netContent: "2 KG",
      caaNo: "CAA/NOV2023/FA/05316"
    }
  },
  { 
    id: 11,
    name: "CONFIER GUTPRO Plus™",
    subtitle: "Gut Probiotic",
    price: "Contact for Details",
    modelGlb: '/models/confier-gutpro.glb',
    tagline: "Enhancing Shrimp Health, Growth, and Vitality",
    benefits: [
      "Improves shrimp digestion and resistance capacity.",
      "Maintain good health for shrimp and improve gut microflora.",
      "Helps better minerals, nutrient absorption and minimizes incidences of white gut.",
      "Improves immunity to fight against pathogens.",
      "Reduce mortality through improved immune response.",
      "Increase feed intake, growth and survival rate with better yield.",
      "Reduce FCR and Increase digestibility of feed."
    ],
    composition: "Consists of Digestive enzymes, nucleotides and Gut beneficial bacteria.",
    usage: {
      dosage: "5-10 gm/kg of feed( 1 meal/day)",
      netContent: "500 grams",
      caaNo: "CAA/APRIL 2025/FA/07312"
    }
  },
  { 
    id: 12, name: "CONFIER AQUA FUMIGATOR Plus™", subtitle: "Water Sanitizer", price: "Contact for Details",
    tagline: "Safe, Sustainable, and Effective Pathogen Protection",
    benefits: [
      "Effective against broad range of pathogens, without causing any stress to shrimp.",
      "Fumigator is biodegradable and eco-friendly to environment.",
      "Particularly destroy pathogenic vibrio.",
      "Fumigator does not cause any plankton crash on application.",
      "Improves water quality and works at wide range of pH and salinity.",
      "Eliminate viruses, bacteria and controls the microbial loads."
    ],
    composition: "A Unique combination of buffered acidifiers and organic acids.",
    usage: {
      dosage: "1 litre/acre of feed prvention\n2 litres/acre of feed for treatment",
      netContent: "2 Litres",
      caaNo: "CAA/APRIL 2025/FA/07311"
    }
  },
  { 
    id: 13, name: "CONFIER-C™", subtitle: "Complete Top Dressing", price: "Contact for Details",
    tagline: "Effective Care for Stronger, Healthier Shrimp",
    benefits: [
      "CONFIER-C is a complete top dressing for shrimp feeds and highly bioavailable form of Vitamin - C.",
      "Helps in quick recovery from wound healing and black spot.",
      "Reduces stress from temperature and pH fluctuations.",
      "Strengthens the natural defense system.",
      "It is effective for all species of farmed shrimp, from post-Larva until the final harvest stage.",
      "Controls stress due to chemical, biological and physical stresses."
    ],
    composition: "Vitamin-C, (L-ascorbyl-2-monophosphate) & Citric acid.",
    usage: {
      dosage: "Use 5 -10 grams per 1 kg of shrimp feed",
      netContent: "500 grams.",
      caaNo: "CAA/NOV2023/FA/05317"
    }
  },
  { 
    id: 14, name: "CONFIER YUCCA™", subtitle: "", price: "Contact for Details",
    tagline: "Enhancing Water Quality, Sustainable Harvests",
    benefits: [
      "Prevents the bottom from deterioration and pollution.",
      "Protect good water quality and keeps the pond environment healthy.",
      "Less frequent water exchange is required.",
      "Reduces the ammonia, nitrite, H₂S gases.",
      "Highly tolerance to pH and temperature.",
      "Improves the feeding rate and FCR.",
      "Neutralise the effects of the harmful gases."
    ],
    composition: "Dry natural extract from Yucca schidigera plant, rich in glyco-compounds.",
    usage: {
      dosage: "Dosage and application:\nRegular application : 500 grams/acre\nTreatment: 1kg/ acre mix with sand and broadcast all over the pond",
      netContent: "500 grams",
      caaNo: "CAA/OCT2022/FA/04244"
    }
  },
  { 
    id: 15,
    name: "CONFIER MICROMIN®",
    subtitle: "Chelated Trace Mineral",
    price: "Contact for Details",
    modelGlb: '/models/confier-micromin.glb',
    tagline: "Strengthening Shells, Boosting Shrimp Life",
    benefits: [
      "Helps in better shell formation and regular moulting.",
      "Increase the growth and survival rate.",
      "Promotes the calcium, phosphorous absorption and utilization.",
      "Improve feed conversion ratio and regulation of pH balance.",
      "Regulating osmo regulation and fast recovery after moulting.",
      "Prevents loose shell and soft shell formation in shrimps due to nutritional deficiency."
    ],
    composition: "Contains concentration of micro and macro minerals in chelated form and anti-cramping components.",
    usage: {
      dosage: "10 g/kg of feed for prevention\n20 g/kg of feed for treatment\nApplication: 1 kg of Micromin diluted in water during moulting around midnight.",
      netContent: "2 KG",
      caaNo: "CAA/OCT2022/FA/04247"
    }
  }
];

export default function Products() {
  const [activeProduct, setActiveProduct] = useState(null);
  const { t, lang } = useLanguage();
  const { addToCart, addToWishlist, isInWishlist } = useCart();

  useEffect(() => {
    const handleOpenProduct = (e) => {
      const productId = e.detail;
      const product = products.find(p => p.id === productId);
      if (product) {
        setActiveProduct(product);
        setTimeout(() => {
          document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    window.addEventListener('open-product', handleOpenProduct);
    return () => window.removeEventListener('open-product', handleOpenProduct);
  }, []);

  /** Interactive 3D first, placeholder cards after (stable by id within each band). */
  const displayProducts = useMemo(
    () =>
      [...products].sort((a, b) => {
        const a3 = Boolean(a.modelGlb);
        const b3 = Boolean(b.modelGlb);
        if (a3 !== b3) return a3 ? -1 : 1;
        return a.id - b.id;
      }),
    []
  );

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section id="products" className="section" style={{ background: 'linear-gradient(180deg, #edf7fa 0%, #f8fcfd 100%)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '2.5rem' : '4rem' }}>
          <span className="section-tag">{t('prod.tag')}</span>
          <h2 className="text-title" style={{ fontSize: isMobile ? '2rem' : undefined, marginBottom: '0.75rem' }}>{t('prod.title')}</h2>
          <p className="text-subtitle" style={{ margin: '0 auto', fontSize: isMobile ? '0.9rem' : undefined }}>
            {t('prod.desc')}
          </p>
        </div>
        
        {isMobile && (
          <style>{`
            .mobile-carousel::-webkit-scrollbar { display: none; }
          `}</style>
        )}

        <div className={isMobile ? "mobile-carousel" : ""} style={{ 
          display: isMobile ? 'flex' : 'grid', 
          gridTemplateColumns: isMobile ? 'none' : 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: isMobile ? '1rem' : '2rem',
          overflowX: isMobile ? 'auto' : 'visible',
          scrollSnapType: isMobile ? 'x mandatory' : 'none',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: isMobile ? '1rem' : '0',
          scrollbarWidth: 'none' // Firefox fallback
        }}>
          {displayProducts.map((product, index) => {
            const p = localizeProduct(lang, product);
            const prev = displayProducts[index - 1];
            const bandBreak =
              !isMobile &&
              index > 0 &&
              Boolean(prev?.modelGlb) &&
              !product.modelGlb;
            return (
            <React.Fragment key={product.id}>
              {bandBreak && (
                <div
                  role="presentation"
                  style={{
                    gridColumn: '1 / -1',
                    margin: '0.25rem 0 1rem',
                    borderTop: '1px solid var(--clr-border)'
                  }}
                />
              )}
            <div 
              className="card-hover" 
              style={{ 
                cursor: 'pointer', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: isMobile ? '20px' : '24px',
                overflow: 'hidden',
                flex: isMobile ? '0 0 85%' : 'unset',
                scrollSnapAlign: isMobile ? 'center' : 'none',
                background: 'rgba(255,255,255,0.9)'
              }}
              onClick={() => setActiveProduct(product)}
            >
              {/* Product 3D area: GLB when available, else placeholder */}
              <div style={{ 
                height: isMobile ? '160px' : '240px', 
                background: p.modelGlb ? '#0a3d45' : 'linear-gradient(135deg, var(--clr-teal-light), var(--clr-bg-surface))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                overflow: 'hidden'
              }}>
                {p.modelGlb ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      height: '100%',
                      padding: '0.75rem',
                      pointerEvents: 'none',
                      textAlign: 'center'
                    }}
                  >
                    <Scan size={isMobile ? 38 : 56} strokeWidth={1.15} color="rgba(255,255,255,0.92)" />
                    <span
                      style={{
                        fontSize: isMobile ? '0.68rem' : '0.78rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        letterSpacing: '0.04em',
                        maxWidth: '12rem',
                        lineHeight: 1.35
                      }}
                    >
                      {t('prod.card3dTeaser')}
                    </span>
                  </div>
                ) : (
                  <div className="animate-float" style={{ color: 'var(--clr-teal-dark)' }}>
                    <Box size={isMobile ? 40 : 80} strokeWidth={1} />
                  </div>
                )}
                {!isMobile && (
                  <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: p.modelGlb ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 600, color: p.modelGlb ? 'rgba(255,255,255,0.85)' : 'var(--clr-text-muted)' }}>
                    {t('prod.interact')}
                  </div>
                )}
              </div>
              
              <div style={{ padding: isMobile ? '1rem' : '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: 'var(--clr-orange)', fontSize: isMobile ? '0.65rem' : '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  {p.subtitle}
                </div>
                <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: isMobile ? '1.15rem' : '1.5rem', fontWeight: 700, color: 'var(--clr-teal-dark)', marginBottom: '0.45rem', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  {product.name}
                </h3>
                {!isMobile && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-muted)', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                    {p.benefits[0]}
                  </p>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--clr-border)', paddingTop: isMobile ? '0.5rem' : '1rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--clr-teal-dark)', fontSize: isMobile ? '0.8rem' : '1rem' }}>{t('prod.price.contact')}</span>
                  {!isMobile && <span style={{ fontSize: '0.85rem', color: 'var(--clr-orange)', fontWeight: 600 }}>{t('prod.details')} →</span>}
                </div>
              </div>
            </div>
            </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ----------- MODAL OVERLAY ----------- */}
      {activeProduct && (() => {
        const ap = localizeProduct(lang, activeProduct);
        return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(1rem, env(safe-area-inset-top)) 1rem 1rem'
        }} onClick={() => setActiveProduct(null)}>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.96)', width: '100%', maxWidth: '860px', borderRadius: '24px', 
            overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Top: 3D viewer — GLB when product.modelGlb is set */}
            <div style={{ 
              height: ap.modelGlb ? (isMobile ? 'min(52vh, 320px)' : 'min(48vh, 420px)') : (isMobile ? '220px' : '300px'),
              minHeight: ap.modelGlb ? (isMobile ? 260 : 360) : undefined,
              background: ap.modelGlb ? '#062a32' : 'linear-gradient(135deg, var(--clr-teal-dark), var(--clr-ocean))',
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              overflow: 'hidden'
            }}>
              <button 
                onClick={() => setActiveProduct(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 2, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={20} />
              </button>
              
              <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 2, background: 'rgba(0,0,0,0.35)', padding: '6px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                {t('prod.modal.rotate3d')}
              </div>

              {ap.modelGlb ? (
                <div style={{ position: 'absolute', inset: 0, paddingTop: 8 }}>
                  <ProductGlbViewer src={ap.modelGlb} alt={activeProduct.name} />
                </div>
              ) : (
                <div style={{ animation: 'float 6s infinite', transformStyle: 'preserve-3d', cursor: 'grab' }}>
                  <Box size={120} strokeWidth={0.5} />
                </div>
              )}
            </div>

            {/* Bottom: Clean Data */}
            <div style={{ padding: isMobile ? '1rem' : '2rem', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', flexDirection: isMobile ? 'column' : 'row', marginBottom: '1rem', gap: '0.6rem' }}>
                <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: isMobile ? '1.6rem' : '2.25rem', fontWeight: 700, color: 'var(--clr-teal-dark)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                  {activeProduct.name}
                </h2>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '1rem' : '1.5rem', color: 'var(--clr-orange-warm)', fontWeight: 700 }}>
                  {t('prod.price.contact')}
                </div>
              </div>
              
              {ap.tagline && (
                <p style={{ fontSize: '1.05rem', color: 'var(--clr-teal-dark)', lineHeight: 1.6, marginBottom: '2rem', fontStyle: 'italic', fontWeight: 600, paddingLeft: '1rem', borderLeft: '3px solid var(--clr-orange)' }}>
                  &ldquo;{ap.tagline}&rdquo;
                </p>
              )}

              <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--clr-bg-surface)', borderRadius: '12px', border: '1px solid var(--clr-border)' }}>
                <h4 style={{ color: 'var(--clr-teal-dark)', fontWeight: 800, marginBottom: '1.5rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('prod.modal.verifiedBenefits')}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {ap.benefits.map((benefit, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', color: 'var(--clr-text-main)', lineHeight: 1.5 }}>
                      <CheckCircle2 size={18} color="var(--clr-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {(ap.composition || ap.usage) && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {ap.composition && (
                    <div style={{ padding: '1.5rem', background: 'var(--clr-bg-surface)', borderRadius: '12px', border: '1px solid var(--clr-border)' }}>
                       <h4 style={{ color: 'var(--clr-teal-dark)', fontWeight: 800, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('prod.modal.composition')}</h4>
                       <p style={{ fontSize: '0.9rem', color: 'var(--clr-text-main)', lineHeight: 1.6, margin: 0 }}>{ap.composition}</p>
                    </div>
                  )}

                  {ap.usage && (
                    <div style={{ padding: '1.5rem', background: 'var(--clr-bg-surface)', borderRadius: '12px', border: '1px solid var(--clr-border)' }}>
                       <h4 style={{ color: 'var(--clr-teal-dark)', fontWeight: 800, marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('prod.modal.instructions')}</h4>
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {ap.usage.dosage && (
                            <div>
                               <strong style={{ fontSize: '0.85rem', color: 'var(--clr-teal-dark)' }}>{t('prod.modal.dosage')}:</strong>
                               <pre style={{ margin: '0.25rem 0 0 0', fontFamily: 'inherit', fontSize: '0.85rem', color: 'var(--clr-text-main)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{ap.usage.dosage}</pre>
                            </div>
                          )}
                          {ap.usage.netContent && (
                            <div>
                               <strong style={{ fontSize: '0.85rem', color: 'var(--clr-teal-dark)' }}>{t('prod.modal.netContent')}:</strong>
                               <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-main)', marginLeft: '0.5rem' }}>{ap.usage.netContent}</span>
                            </div>
                          )}
                          {ap.usage.caaNo && (
                            <div>
                               <strong style={{ fontSize: '0.85rem', color: 'var(--clr-teal-dark)' }}>{t('prod.modal.caaNo')}:</strong>
                               <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-main)', marginLeft: '0.5rem' }}>{ap.usage.caaNo}</span>
                            </div>
                          )}
                       </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginTop: '2.2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', flex: 1 }}>
                  {t('prod.modal.bulkNote')}
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => addToWishlist(activeProduct)}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--clr-border)', background: isInWishlist(activeProduct.id) ? 'var(--clr-teal-light)' : '#fff', color: isInWishlist(activeProduct.id) ? 'var(--clr-teal-dark)' : 'var(--clr-text-main)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                  >
                    <Heart size={18} fill={isInWishlist(activeProduct.id) ? 'currentColor' : 'none'} />
                    {isInWishlist(activeProduct.id) ? t('prod.saved') : t('prod.wishlist')}
                  </button>
                  <button 
                    onClick={() => {
                      addToCart(activeProduct, 1);
                      setActiveProduct(null);
                    }}
                    className="btn-primary"
                    style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <ShoppingCart size={18} />
                    {t('prod.addToCart')}
                  </button>
                  <button 
                    onClick={() => setActiveProduct(null)}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--clr-border)', background: '#fff', color: 'var(--clr-text-main)', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {t('prod.modal.close')}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
        );
      })()}
    </section>
  );
}
