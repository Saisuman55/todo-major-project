import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks = [], refresh }) {
  return (
    <section className="task-list">
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p className="empty">No tasks yet — add your first task.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <TaskItem key={task._id} task={task} refresh={refresh} />
          ))}
        </ul>
      )}
    </section>
  );
}
