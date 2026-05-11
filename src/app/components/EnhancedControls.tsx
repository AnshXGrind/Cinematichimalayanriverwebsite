import { motion } from 'motion/react';
import { Camera } from 'lucide-react';
import { CameraPreset } from './UttarakhandTerrain';

interface EnhancedControlsProps {
  onPresetClick: (preset: CameraPreset) => void;
}

export default function EnhancedControls({ onPresetClick }: EnhancedControlsProps) {
  const cameraPresets: CameraPreset[] = [
    {
      name: 'Overview',
      position: [25, 15, 25],
      target: [0, 3, 0],
      icon: '🌍',
    },
    {
      name: 'Gangotri',
      position: [-8, 10, 20],
      target: [-8, 7, 15],
      icon: '⛰️',
    },
    {
      name: 'Badrinath',
      position: [15, 12, 22],
      target: [9, 7, 15],
      icon: '🛕',
    },
    {
      name: 'Devprayag',
      position: [5, 8, -5],
      target: [0, 2, -9],
      icon: '🌊',
    },
    {
      name: 'River Flow',
      position: [0, 20, 0],
      target: [0, 0, 0],
      icon: '🔝',
    },
  ];

  return (
    <motion.div
      className="absolute bottom-24 left-8 z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <div className="bg-black/60 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Camera className="w-4 h-4 text-[#4fc3f7]" />
          <h4 className="text-sm font-light text-white tracking-wide">Camera Views</h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cameraPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onPresetClick(preset)}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4fc3f7]/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{preset.icon}</span>
                <span className="text-xs text-white/70 group-hover:text-white/90">
                  {preset.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
