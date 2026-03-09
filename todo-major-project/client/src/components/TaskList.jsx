import React, { useMemo, useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks = [], refresh, search = '' }) {
  const [sortBy, setSortBy] = useState('created'); // created | due | priority

  const filteredAndSorted = useMemo(() => {
    let list = [...tasks];
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(t =>
        t.title.toLowerCase().includes(term) ||
        (t.description || '').toLowerCase().includes(term)
      );
    }

    if (sortBy === 'due') {
      list.sort((a, b) => {
        const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return ad - bd;
      });
    } else if (sortBy === 'priority') {
      const order = { High: 0, Medium: 1, Low: 2 };
      list.sort((a, b) => (order[a.priority] ?? 1) - (order[b.priority] ?? 1));
    } else {
      list.sort((a, b) => {
        const ac = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bc = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bc - ac;
      });
    }

    return list;
  }, [tasks, search, sortBy]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Tasks</h2>
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort tasks"
        >
          <option value="created">Sort: Newest First</option>
          <option value="due">Sort: Closest Due Date</option>
          <option value="priority">Sort: By Priority</option>
        </select>
      </div>
      
      {filteredAndSorted.length === 0 ? (
        <div className="glass-card empty-state">
          <h3>No tasks found</h3>
          <p>You don't have any tasks matching this criteria right now.</p>
        </div>
      ) : (
        <ul className="task-list">
          {filteredAndSorted.map((task) => (
            <TaskItem key={task._id} task={task} refresh={refresh} />
          ))}
        </ul>
      )}
    </>
  );
}
