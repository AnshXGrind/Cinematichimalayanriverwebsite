import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface ConfluenceSectionProps {
  name: string;
  river1: { name: string; color: string };
  river2: { name: string; color: string };
  resultRiver?: { name: string; color: string };
  location: string;
  description: string;
  significance: string;
}

export default function ConfluenceSection({
  name,
  river1,
  river2,
  resultRiver,
  location,
  description,
  significance,
}: ConfluenceSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-150px" });

  return (
    <motion.div
      ref={ref}
      className="min-h-screen flex items-center justify-center px-8 py-24 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0.2 }}
      transition={{ duration: 1.5 }}
    >
      <div className="max-w-7xl w-full">
        {/* Title */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: isInView ? 0 : -30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h2 className="text-7xl lg:text-8xl font-light text-white tracking-tight">
            {name}
          </h2>
          <div className="text-[#4fc3f7] text-lg tracking-[0.3em] uppercase opacity-70">
            {location}
          </div>
        </motion.div>

        {/* Confluence visualization */}
        <div className="relative h-[500px] mb-16">
          {/* River 1 flowing from left */}
          <motion.div
            className="absolute left-0 top-1/2 w-2/5 h-2 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${river1.color})`,
              filter: 'blur(8px)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: isInView ? 1 : 0, opacity: isInView ? 0.8 : 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.div
            className="absolute left-0 top-1/2 w-2/5 h-1 rounded-full"
            style={{ backgroundColor: river1.color }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isInView ? 1 : 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          />

          {/* River 1 particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`r1-${i}`}
              className="absolute top-1/2 w-2 h-2 rounded-full"
              style={{ backgroundColor: river1.color, left: `${i * 3}%` }}
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: isInView ? [0, 1, 1, 0] : 0,
                x: isInView ? 150 : -50,
              }}
              transition={{
                duration: 3,
                delay: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}

          {/* River 2 flowing from top-right */}
          <motion.div
            className="absolute right-0 top-0 w-2 h-2/5 rounded-full origin-bottom"
            style={{
              background: `linear-gradient(to bottom, transparent, ${river2.color})`,
              filter: 'blur(8px)',
              transformOrigin: 'bottom center',
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: isInView ? 1 : 0, opacity: isInView ? 0.8 : 0 }}
            transition={{ duration: 2, delay: 0.7 }}
          />
          <motion.div
            className="absolute right-0 top-0 w-1 h-2/5 rounded-full"
            style={{ backgroundColor: river2.color }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isInView ? 1 : 0 }}
            transition={{ duration: 2, delay: 0.7 }}
          />

          {/* River 2 particles */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`r2-${i}`}
              className="absolute right-0 w-2 h-2 rounded-full"
              style={{ backgroundColor: river2.color, top: `${i * 4}%` }}
              initial={{ opacity: 0, y: -50 }}
              animate={{
                opacity: isInView ? [0, 1, 1, 0] : 0,
                y: isInView ? 200 : -50,
              }}
              transition={{
                duration: 3,
                delay: 0.7 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}

          {/* Confluence point - sacred center */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: isInView ? 1 : 0, opacity: isInView ? 1 : 0 }}
            transition={{ duration: 1.5, delay: 1.5 }}
          >
            {/* Glowing center */}
            <motion.div
              className="w-32 h-32 rounded-full"
              style={{
                background: `radial-gradient(circle, ${resultRiver?.color || '#ffd89b'}, transparent)`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Sacred symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-20 h-20" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke="#ffd89b"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  stroke="#ffd89b"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.6"
                />
                <circle cx="50" cy="50" r="3" fill="#ffd89b" opacity="0.9" />
              </svg>
            </div>
          </motion.div>

          {/* Result river flowing out */}
          {resultRiver && (
            <>
              <motion.div
                className="absolute left-1/2 top-1/2 w-2/5 h-2 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${resultRiver.color}, transparent)`,
                  filter: 'blur(8px)',
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: isInView ? 1 : 0, opacity: isInView ? 0.8 : 0 }}
                transition={{ duration: 2, delay: 2 }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 w-2/5 h-1 rounded-full"
                style={{ backgroundColor: resultRiver.color }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isInView ? 1 : 0 }}
                transition={{ duration: 2, delay: 2 }}
              />

              {/* Result river particles */}
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={`result-${i}`}
                  className="absolute top-1/2 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: resultRiver.color,
                    left: `${50 + i * 2.5}%`,
                  }}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{
                    opacity: isInView ? [0, 1, 1, 0] : 0,
                    x: isInView ? 150 : 0,
                  }}
                  transition={{
                    duration: 3.5,
                    delay: 2 + i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                  }}
                />
              ))}
            </>
          )}

          {/* River labels */}
          <motion.div
            className="absolute left-[15%] top-[45%] text-white/80 text-sm tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 1 }}
          >
            {river1.name}
          </motion.div>

          <motion.div
            className="absolute right-[5%] top-[15%] text-white/80 text-sm tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: isInView ? 1 : 0 }}
            transition={{ delay: 1.2 }}
          >
            {river2.name}
          </motion.div>

          {resultRiver && (
            <motion.div
              className="absolute left-[70%] top-[45%] text-white/80 text-sm tracking-wider"
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ delay: 2.5 }}
            >
              {resultRiver.name}
            </motion.div>
          )}
        </div>

        {/* Description */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: isInView ? 0 : 30, opacity: isInView ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 1 }}
        >
          <div className="space-y-4">
            <h3 className="text-2xl text-[#4fc3f7] font-light">The Meeting</h3>
            <p className="text-white/70 leading-relaxed">{description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl text-[#ffd89b] font-light">Sacred Significance</h3>
            <p className="text-white/60 leading-relaxed italic">{significance}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
