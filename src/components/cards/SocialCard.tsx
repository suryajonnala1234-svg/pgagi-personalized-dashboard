import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Hash, Camera } from 'lucide-react';

export default function SocialCard({ post }: { post: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }} 
      className="premium-card rounded-2xl p-5 flex flex-col h-full bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
          {post.author?.[0]?.toUpperCase() || 'U'}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white">{post.author}</h4>
          <p className="text-xs text-gray-500">{post.platform}</p>
        </div>
        <div className="ml-auto text-blue-500">
          {post.platform === 'Twitter' ? <Hash size={20} /> : <Camera size={20} />}
        </div>
      </div>
      
      <p className="text-gray-800 dark:text-gray-200 mb-6 flex-grow font-medium">
        {post.content}
      </p>
      
      <div className="flex items-center gap-4 text-gray-500 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
        <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
          <Heart size={16} /> {post.likes}
        </button>
        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
          <MessageCircle size={16} /> {Math.floor(post.likes / 10)}
        </button>
        <button className="flex items-center gap-1 hover:text-green-500 transition-colors ml-auto">
          <Share2 size={16} /> Share
        </button>
      </div>
    </motion.div>
  );
}
