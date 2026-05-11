import { motion } from 'motion/react';
import UttarakhandTerrain from './UttarakhandTerrain';

export default function TerrainMapSection() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* Section Header */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 pt-24 pb-12 text-center pointer-events-none"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1.2 }}
      >
        <div className="space-y-4">
          <div className="text-[#4fc3f7] uppercase tracking-[0.5em] text-sm opacity-70">
            Interactive 3D Map
          </div>
          <h2 className="text-6xl md:text-7xl font-light text-white tracking-tight">
            Sacred Geography
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto px-8">
            Explore the Uttarakhand Himalayas in three dimensions. Watch the sacred rivers flow from
            glacier sources to their divine confluences.
          </p>
        </div>
      </motion.div>

      {/* 3D Terrain */}
      <UttarakhandTerrain className="w-full h-screen" />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent pointer-events-none z-10" />
    </div>
  );
}
