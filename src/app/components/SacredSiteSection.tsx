import { useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface SacredSiteSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  mythology?: string;
  imageGradient: string;
  rivers?: string[];
  elevation?: string;
}

export default function SacredSiteSection({
  title,
  subtitle,
  description,
  mythology,
  imageGradient,
  rivers,
  elevation,
}: SacredSiteSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center px-8 py-24 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.3 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Visual representation */}
        <motion.div
          className="relative aspect-square rounded-lg overflow-hidden"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isInView ? 1 : 0.8, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: imageGradient,
              filter: 'blur(0px)',
            }}
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Glowing effect */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(79, 195, 247, 0.4), transparent 70%)',
            }}
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Sacred geometry overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="30" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="50" r="40" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.3" fill="none" />
          </svg>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: isInView ? 0 : 50, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        >
          {subtitle && (
            <div className="text-[#4fc3f7] uppercase tracking-[0.3em] opacity-70">
              {subtitle}
            </div>
          )}

          <h2 className="text-6xl lg:text-7xl font-light tracking-tight text-white">
            {title}
          </h2>

          {elevation && (
            <div className="text-[#ffd89b] opacity-80 tracking-wider">
              {elevation}
            </div>
          )}

          <p className="text-lg text-white/70 leading-relaxed max-w-xl">
            {description}
          </p>

          {rivers && rivers.length > 0 && (
            <div className="space-y-2 pt-4">
              <div className="text-sm text-[#4fc3f7] uppercase tracking-widest opacity-60">
                Sacred Rivers
              </div>
              <div className="flex flex-wrap gap-3">
                {rivers.map((river, idx) => (
                  <motion.div
                    key={river}
                    className="px-4 py-2 rounded-full border border-[#4fc3f7]/30 bg-[#4fc3f7]/5 text-white/80"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 10 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    {river}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {mythology && (
            <motion.div
              className="pt-6 border-l-2 border-[#ffd89b]/30 pl-6 italic text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 0.8 }}
            >
              {mythology}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
