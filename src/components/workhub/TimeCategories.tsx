import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface TaskAssignment {
  itemId: string;
  userId: string;
  concept: string;
  dueDate: string;
  section: string;
  sectionId?: string;
  completed?: boolean;
  code?: string;
}

interface TimeCategoriesProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
  taskAssignments: TaskAssignment[];
}

const TimeCategories: React.FC<TimeCategoriesProps> = ({
  selectedCategory,
  onCategoryClick,
  taskAssignments
}) => {
  const getTaskCountForCategory = (categoryId: string) => {
    if (!taskAssignments.length) return 0;

    if (categoryId === 'all') return taskAssignments.length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7 - today.getDay());

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    return taskAssignments.filter(task => {
      if (!task.dueDate) return categoryId === 'no-date';

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      switch (categoryId) {
        case 'past':
          return dueDate < today;
        case 'today':
          return dueDate.getTime() === today.getTime();
        case 'this-week': {
          const thisWeekEnd = new Date(today);
          thisWeekEnd.setDate(today.getDate() + (6 - today.getDay()));
          return dueDate > today && dueDate <= thisWeekEnd;
        }
        case 'next-week':
          return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
        case 'later':
          return dueDate > nextWeekEnd;
        case 'no-date':
          return !task.dueDate;
        default:
          return true;
      }
    }).length;
  };

  const timeCategories = [
    { id: 'all', label: 'Todas', icon: <Calendar size={16} /> },
    { id: 'past', label: 'Días anteriores', icon: <Clock size={16} /> },
    { id: 'today', label: 'Hoy', icon: <Calendar size={16} /> },
    { id: 'this-week', label: 'Esta semana', icon: <Calendar size={16} /> },
    { id: 'next-week', label: 'Siguiente semana', icon: <Calendar size={16} /> },
    { id: 'later', label: 'Después', icon: <Calendar size={16} /> },
    { id: 'no-date', label: 'Sin fecha', icon: <Calendar size={16} /> }
  ];

  return (
    <div className="workhub-categories-grid">
      {timeCategories.map(category => (
        <div
          key={category.id}
          className={`workhub-category-card ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryClick(category.id)}
        >
          <div className="workhub-category-icon">
            {category.icon}
          </div>
          <h3 className="workhub-category-title">{category.label}</h3>
          <p className="workhub-category-count">{getTaskCountForCategory(category.id)} tareas</p>
        </div>
      ))}
    </div>
  );
};

export default TimeCategories;