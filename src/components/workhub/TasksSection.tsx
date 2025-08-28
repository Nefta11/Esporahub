import React from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';

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

interface TasksSectionProps {
  filteredTasks: TaskAssignment[];
}

const TasksSection: React.FC<TasksSectionProps> = ({ filteredTasks }) => {
  return (
    <div className="workhub-tasks-container">
      {filteredTasks && filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <div
            key={task.itemId}
            className={`workhub-task-item ${task.completed ? 'completed' : ''}`}
          >
            <div className={`workhub-task-icon ${task.completed ? 'status-completed' : 'status-pending'}`}>
              {task.completed ? <CheckCircle size={20} /> : <Clock size={20} />}
            </div>

            <div className="workhub-task-content">
              <h3 className="workhub-task-title">
                {task.concept || "Tarea sin nombre"}
              </h3>
              <p className="workhub-task-section">
                {task.section}
              </p>
              <div className="workhub-task-meta">
                <div className="workhub-task-date">
                  <Calendar size={14} />
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-ES', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  }) : 'Sin fecha'}
                </div>
                <div className="workhub-task-id">
                  {task.itemId || task.code}
                </div>
              </div>
            </div>

            <div className={`workhub-task-status ${task.completed ? 'completed' : 'pending'}`}>
              {task.completed ? 'Completada' : 'Pendiente'}
            </div>
          </div>
        ))
      ) : (
        <div className="workhub-empty-state">
          <div className="workhub-empty-icon">
            <AlertCircle size={32} />
          </div>
          <h3 className="workhub-empty-title">
            No tienes tareas asignadas
          </h3>
          <p className="workhub-empty-description">
            No se encontraron tareas en esta categoría
          </p>
        </div>
      )}
    </div>
  );
};

export default TasksSection;