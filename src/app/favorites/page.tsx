'use client';
import { useState, useEffect } from 'react'; // 1. Import useState and useEffect
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useAppSelector, useAppDispatch } from '../../lib/hooks';
import { reorderFavorites } from '../../lib/features/favoritesSlice';
import { Article } from '../../lib/types';
import NewsCard from '../../components/cards/NewsCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableArticle({ article }: { article: Article }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: article.url });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div ref={setNodeRef} style={style}>
      <NewsCard 
        article={article} 
        dragHandle={<button {...attributes} {...listeners}>✋ Drag</button>} 
      />
    </div>
  );
}

export default function FavoritesPage() {
  const favorites = useAppSelector((s) => s.favorites.articles);
  const dispatch = useAppDispatch();
  
  // 2. Add a 'mounted' state
  const [mounted, setMounted] = useState(false);

  // 3. Set mounted to true once the component loads in the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = favorites.findIndex((a) => a.url === active.id);
      const newIndex = favorites.findIndex((a) => a.url === over?.id);
      const newOrder = arrayMove(favorites, oldIndex, newIndex);
      dispatch(reorderFavorites(newOrder));
    }
  };

  // 4. If we haven't mounted in the browser yet, render nothing (or a skeleton)
  if (!mounted) return null; 

  if (favorites.length === 0) return <p>No saved articles yet!</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Saved Articles</h2>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={favorites.map(f => f.url)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favorites.map((article: Article) => (
              <SortableArticle key={article.url} article={article} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
