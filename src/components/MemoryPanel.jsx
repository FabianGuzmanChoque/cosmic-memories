import { motion, AnimatePresence } from 'framer-motion';
import { X, Pencil, Trash2, Share2 } from 'lucide-react';

export default function MemoryPanel({ memory, onClose, onEdit, onDelete, onExport, isSharedView = false }) {
  if (!memory) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="glass-panel max-w-lg w-full mx-4 p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>

          <div className="space-y-4">
            {memory.image && (
              <div className="relative rounded-xl overflow-hidden aspect-video">
                <img
                  src={memory.image}
                  alt={memory.title || 'Memory'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            )}

            {memory.title && (
              <h2 className="text-2xl font-light text-white">{memory.title}</h2>
            )}

            {memory.date && (
              <p className="text-sm text-white/50">{memory.date}</p>
            )}

            {memory.message && (
              <p className="text-white/80 leading-relaxed font-light">
                {memory.message}
              </p>
            )}

            {!isSharedView && (
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
                <button
                  onClick={() => onEdit && onEdit(memory)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => onDelete && onDelete(memory.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
                <button
                  onClick={() => onExport && onExport(memory)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 text-sm transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Compartir
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-white/10">
              <p className="text-xs text-white/30 italic">
                {isSharedView ? 'Un universo que alguien quiso compartir contigo' : 'Un recuerdo orbitando en tu universo'}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}