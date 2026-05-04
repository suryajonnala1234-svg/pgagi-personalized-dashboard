import { motion } from 'framer-motion';
import { Film, PlayCircle, Star, Plus } from 'lucide-react';

export default function RecommendationCard({ item }: { item: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }} 
      className="premium-card rounded-2xl overflow-hidden flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-purple-100 dark:border-purple-900/30 relative"
    >
      <div 
        className="relative h-48 bg-purple-900 flex flex-col items-center justify-center p-4 text-center bg-cover bg-center"
        style={{ backgroundImage: item.artwork ? `url(${item.artwork})` : undefined }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute top-3 right-3 px-2 py-1 bg-purple-500/80 backdrop-blur rounded text-xs font-bold text-white uppercase tracking-wider z-10 shadow-lg">
          {item.tag || 'Recommended'}
        </div>
        {!item.artwork && <Film size={48} className="text-purple-300 mb-2 opacity-80 z-10" />}
        <h3 className="text-xl font-bold text-white line-clamp-1 z-10 drop-shadow-md">{item.title}</h3>
        <p className="text-purple-200 text-sm z-10 font-medium drop-shadow-md">{item.author}</p>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow line-clamp-3 mb-4 font-medium">
          {item.content}
        </p>
        
        <div className="mt-auto pt-4 border-t border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
          <div className="flex items-center text-yellow-500 gap-1 text-sm font-bold">
            <Star size={16} className="fill-current" /> {item.rating ? Number(item.rating).toFixed(1) : Math.max(4.0, parseFloat((Math.random() * 5).toFixed(1)))}
          </div>
          
          <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900 transition-colors">
              <Plus size={16} />
            </button>
            <a 
              href={item.previewUrl || "#"} 
              target="_blank" 
              rel="noreferrer"
              className="px-4 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold flex items-center gap-1 transition-colors shadow-md shadow-purple-500/20"
            >
              <PlayCircle size={16} /> Trailer
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
