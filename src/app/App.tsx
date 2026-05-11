import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import HimalayanScene from './components/HimalayanScene';
import SacredSiteSection from './components/SacredSiteSection';
import ConfluenceSection from './components/ConfluenceSection';
import TerrainMapSection from './components/TerrainMapSection';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);

  return (
    <div ref={containerRef} className="relative bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Fixed 3D Background Scene */}
      <div className="fixed inset-0 z-0">
        <HimalayanScene scrollProgress={scrollYProgress.get()} />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          className="h-screen flex items-center justify-center relative"
          style={{ opacity: heroOpacity, scale: heroScale }}
        >
          <div className="text-center space-y-8 px-8">
            <motion.div
              className="text-[#4fc3f7] uppercase tracking-[0.5em] text-sm opacity-70"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 1.5, delay: 0.5 }}
            >
              A Sacred Journey
            </motion.div>

            <motion.h1
              className="text-7xl md:text-9xl font-extralight tracking-tighter leading-none"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            >
              The Rivers
              <br />
              <span className="text-[#4fc3f7]">of Heaven</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ duration: 1.5, delay: 1.2 }}
            >
              Where the Himalayas meet the divine, sacred rivers carve paths through ancient stone
            </motion.p>

            <motion.div
              className="pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 2 }}
            >
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-white to-transparent mx-auto opacity-40" />
            </motion.div>
          </div>
        </motion.section>

        {/* 3D Terrain Map Section */}
        <TerrainMapSection />

        {/* Gangotri - Source of Ganga */}
        <SacredSiteSection
          title="Gangotri"
          subtitle="The Divine Source"
          elevation="3,100m above sea"
          description="At the foot of the Gangotri Glacier, the sacred Bhagirathi River emerges from the frozen heart of the Himalayas. This is where Ganga descended from heaven to earth, her waters purifying all they touch."
          mythology="King Bhagirath's penance brought Ganga from the heavens. Lord Shiva caught her in his locks to break her fall, saving the earth from her celestial force."
          rivers={['Bhagirathi']}
          imageGradient="linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
        />

        {/* Yamunotri - Source of Yamuna */}
        <SacredSiteSection
          title="Yamunotri"
          subtitle="Sister of Death"
          elevation="3,293m above sea"
          description="From the frozen peaks of Bandarpoonch, the Yamuna emerges as a crystal torrent. Daughter of the Sun God Surya and sister to Yama, the lord of death, her waters promise protection and salvation."
          mythology="Those who bathe in Yamuna's waters are promised freedom from untimely death. The goddess herself protects all who seek her blessing."
          rivers={['Yamuna']}
          imageGradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #fccb90 100%)"
        />

        {/* Kedarnath - The Mountain Temple */}
        <SacredSiteSection
          title="Kedarnath"
          subtitle="Where Gods Dwell"
          elevation="3,583m above sea"
          description="Surrounded by snow-capped peaks, the ancient temple of Lord Shiva stands eternal. The Mandakini River flows nearby, carrying the prayers of pilgrims across the mountains."
          mythology="After the great war of Kurukshetra, the Pandavas sought Lord Shiva here for absolution. The temple stands as one of the twelve Jyotirlingas, marking Shiva's cosmic presence."
          rivers={['Mandakini']}
          imageGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)"
        />

        {/* Panch Prayag - The Five Confluences */}
        <div className="py-32">
          <motion.div
            className="text-center mb-24 space-y-6 px-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 1.2 }}
          >
            <h2 className="text-8xl md:text-9xl font-light text-white tracking-tight">
              Panch Prayag
            </h2>
            <p className="text-xl text-[#4fc3f7] tracking-[0.3em] uppercase opacity-70">
              The Five Sacred Confluences
            </p>
            <p className="text-white/60 max-w-3xl mx-auto text-lg leading-relaxed">
              Five sacred meetings where rivers unite their waters and merge their divine energies,
              each confluence a gateway to spiritual transformation
            </p>
          </motion.div>

          {/* Vishnuprayag */}
          <ConfluenceSection
            name="Vishnuprayag"
            river1={{ name: 'Alaknanda', color: '#4fc3f7' }}
            river2={{ name: 'Dhauliganga', color: '#29b6f6' }}
            resultRiver={{ name: 'Alaknanda', color: '#03a9f4' }}
            location="1,372m • First Confluence"
            description="The first of the five sacred meetings, where the mighty Alaknanda receives the glacial waters of Dhauliganga near the ancient Vishnu temple."
            significance="Named after Lord Vishnu, this confluence marks the beginning of the Panch Prayag pilgrimage. The meeting waters create powerful whirlpools, symbolizing the cosmic dance of creation."
          />

          {/* Nandaprayag */}
          <ConfluenceSection
            name="Nandaprayag"
            river1={{ name: 'Alaknanda', color: '#03a9f4' }}
            river2={{ name: 'Nandakini', color: '#81d4fa' }}
            resultRiver={{ name: 'Alaknanda', color: '#0288d1' }}
            location="1,358m • Second Confluence"
            description="The Nandakini, descending from the Nanda Devi peaks, merges with Alaknanda in a graceful union of mountain streams."
            significance="Legend says King Nanda performed sacred rites here. The confluence is blessed by the presence of the eternal Himalayas' highest peaks watching over the sacred waters."
          />

          {/* Karnaprayag */}
          <ConfluenceSection
            name="Karnaprayag"
            river1={{ name: 'Alaknanda', color: '#0288d1' }}
            river2={{ name: 'Pindar', color: '#4dd0e1' }}
            resultRiver={{ name: 'Alaknanda', color: '#0277bd' }}
            location="1,451m • Third Confluence"
            description="The crystal Pindar River, flowing from the Pindar Glacier, joins the Alaknanda in a meeting of pristine mountain waters."
            significance="Named after Karna from the Mahabharata, who meditated here. The confluence is said to wash away the sins of those who bathe in its sacred waters during the holy months."
          />

          {/* Rudraprayag */}
          <ConfluenceSection
            name="Rudraprayag"
            river1={{ name: 'Alaknanda', color: '#0277bd' }}
            river2={{ name: 'Mandakini', color: '#4fc3f7' }}
            resultRiver={{ name: 'Alaknanda', color: '#01579b' }}
            location="895m • Fourth Confluence"
            description="The Mandakini, flowing from Kedarnath, brings the blessings of Lord Shiva to merge with Alaknanda at this powerful confluence."
            significance="Rudra, the fierce form of Shiva, is said to have performed intense meditation here. The swirling waters represent the cosmic tandava dance of creation and destruction."
          />

          {/* Devprayag - Most Sacred */}
          <div className="py-24">
            <ConfluenceSection
              name="Devprayag"
              river1={{ name: 'Alaknanda', color: '#01579b' }}
              river2={{ name: 'Bhagirathi', color: '#7c4dff' }}
              resultRiver={{ name: 'Ganga', color: '#ffd89b' }}
              location="830m • The Ultimate Union"
              description="The most sacred of all confluences. Here, the Alaknanda and Bhagirathi merge to form the holy Ganga. From this point onwards, the river carries the name of the goddess herself."
              significance="This is where Ganga truly begins her journey to the plains. The confluence is considered so holy that a single dip here is believed to cleanse countless lifetimes of karma."
            />
          </div>
        </div>

        {/* Badrinath - The Vishnu Temple */}
        <SacredSiteSection
          title="Badrinath"
          subtitle="Abode of Vishnu"
          elevation="3,300m above sea"
          description="Between the Nar and Narayan mountain ranges, the sacred temple of Lord Vishnu stands guard over the Alaknanda River. One of the Char Dham pilgrimage sites, Badrinath marks the spiritual pinnacle of the Himalayan journey."
          mythology="Lord Vishnu meditated here in the form of Badrinarayan. When the cold became unbearable, Goddess Lakshmi transformed into a Badri tree to shelter him from the elements."
          rivers={['Alaknanda']}
          imageGradient="linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)"
        />

        {/* Mana Village - Last Village */}
        <SacredSiteSection
          title="Mana"
          subtitle="India's Last Village"
          elevation="3,200m above sea"
          description="Just 3km from the Indo-Tibetan border, Mana village marks the edge of the known world. Here, the mythical Saraswati River emerges from a cave, flowing underground to join Ganga at the Triveni."
          mythology="The Pandavas walked through Mana on their final journey to heaven. The village still shows the stone bridge where Bhima, the strongest of the brothers, laid massive boulders across the river."
          rivers={['Saraswati (hidden)']}
          imageGradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ffecd2 100%)"
        />

        {/* Valley of Flowers */}
        <SacredSiteSection
          title="Valley of Flowers"
          subtitle="Nature's Cathedral"
          elevation="3,658m above sea"
          description="A UNESCO World Heritage Site, this hidden valley transforms into a carpet of wildflowers during monsoon. Fed by glacial streams, the valley represents the perfect harmony between water, earth, and life."
          mythology="Local legends say this is where the celestial beings come to gather divine flowers. Hanuman is believed to have searched for the Sanjeevani herb in these very meadows."
          rivers={['Pushpawati']}
          imageGradient="linear-gradient(135deg, #f6d365 0%, #fda085 50%, #a8edea 100%)"
        />

        {/* Hemkund Sahib */}
        <SacredSiteSection
          title="Hemkund Sahib"
          subtitle="The Glacial Lake"
          elevation="4,632m above sea"
          description="Surrounded by seven snow-capped peaks, this pristine glacial lake holds immense significance for Sikhs. The Hemkund glacier feeds the lake, which remains frozen for most of the year."
          mythology="Guru Gobind Singh meditated on the shores of this lake in his previous life. The ten petaled lotus on the lake's surface represents the ten Sikh gurus."
          imageGradient="linear-gradient(135deg, #2af598 0%, #009efd 50%, #c471f5 100%)"
        />

        {/* Hidden Saraswati */}
        <div className="min-h-screen flex items-center justify-center px-8 py-32 relative">
          <motion.div
            className="max-w-4xl text-center space-y-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 2 }}
          >
            <motion.div
              className="relative mx-auto w-64 h-64"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 2, delay: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 216, 155, 0.3), transparent)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl opacity-40">🌊</div>
              </div>
            </motion.div>

            <h2 className="text-6xl md:text-7xl font-light text-[#ffd89b]">
              The Hidden Saraswati
            </h2>

            <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
              The mythical third river flows underground, invisible to mortal eyes. At Mana village,
              she emerges briefly before disappearing again, only to meet Ganga and Yamuna at the
              sacred Triveni Sangam in Prayagraj, over a thousand kilometers away.
            </p>

            <p className="text-lg text-white/50 italic">
              "What the eyes cannot see, the heart can feel. Saraswati flows eternal, hidden in the
              depths, connecting the mountains to the plains, the visible to the invisible."
            </p>
          </motion.div>
        </div>

        {/* Final Convergence */}
        <div className="min-h-screen flex items-center justify-center px-8 py-32 relative">
          <motion.div
            className="max-w-5xl text-center space-y-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 2 }}
          >
            <div className="space-y-8">
              <h2 className="text-7xl md:text-8xl font-light tracking-tight">
                The Journey
                <br />
                <span className="text-[#4fc3f7]">Continues</span>
              </h2>

              <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                From the glaciers of Gangotri to the plains of India, these sacred rivers carry more
                than water. They carry prayers, memories, and the eternal connection between heaven
                and earth.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: { staggerChildren: 0.2 },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: false }}
            >
              {[
                { label: 'Sacred Sites', value: '18+' },
                { label: 'Rivers', value: '10+' },
                { label: 'Confluences', value: '5' },
                { label: 'Vertical Drop', value: '3000m' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="space-y-2"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <div className="text-5xl font-light text-[#4fc3f7]">{stat.value}</div>
                  <div className="text-sm text-white/50 uppercase tracking-widest">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="pt-16 space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 1, duration: 1.5 }}
            >
              <p className="text-white/40 text-sm tracking-wider">
                "In the Himalayas, every river is a goddess, every mountain a temple,
                <br />
                and every journey a pilgrimage to the divine."
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Footer spacer */}
        <div className="h-32" />
      </div>
    </div>
  );
}
