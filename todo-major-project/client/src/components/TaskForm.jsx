import React, { useState } from 'react';
import { tasksApi } from '../services/api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if(!title.trim()) return;
      await tasksApi.create({ 
        title, 
        description: desc, 
        priority, 
        dueDate: dueDate ? dueDate.toISOString() : undefined 
      });
      setTitle('');
      setDesc('');
      setDueDate(null);
      setPriority('Medium');
      onTaskCreated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="task-form" onSubmit={submit}>
      <input 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        placeholder="What needs to be done?" 
        required 
      />
      <input 
        value={desc} 
        onChange={e => setDesc(e.target.value)} 
        placeholder="Add details (optional)" 
      />
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/yyyy"
        isClearable
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        portalId="root"
        customInput={<input />}
      />
      <select value={priority} onChange={e => setPriority(e.target.value)} title="Priority">
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <button type="submit" className="btn-primary">Add Task</button>
    </form>
  );
}
