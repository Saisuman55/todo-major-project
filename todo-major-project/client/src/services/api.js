const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Simple in-memory storage of the CURRENT active user (matches the token)
let currentUserId = null;

export function setAuthToken(token) {
  if (token) {
    currentUserId = token; // Use token as the userId in this mock
  } else {
    currentUserId = null;
  }
}

export const auth = {
  register: async (data) => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    if (users.find(u => u.email === data.email)) {
      throw { response: { data: { message: 'User already exists' } } };
    }
    const newUser = { id: generateId(), name: data.name, email: data.email, password: data.password };
    users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(users));
    return { data: { message: 'Registered successfully' } };
  },

  login: async (data) => {
    await delay(500);
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const user = users.find(u => u.email === data.email && u.password === data.password);
    if (!user) {
      throw { response: { data: { message: 'Invalid credentials' } } };
    }
    // Return a fake token (using user.id) and user object
    return { data: { token: user.id, user: { id: user.id, name: user.name, email: user.email } } };
  },
};

export const tasksApi = {
  getAll: async (filter) => {
    await delay(300);
    const allTasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    // Only return tasks belonging to the current user
    let userTasks = allTasks.filter(t => t.userId === currentUserId);
    
    if (filter === 'completed') {
      userTasks = userTasks.filter(t => t.completed);
    } else if (filter === 'pending') {
      userTasks = userTasks.filter(t => !t.completed);
    }
    return { data: userTasks };
  },

  create: async (task) => {
    await delay(300);
    const allTasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    const newTask = {
      _id: generateId(),
      userId: currentUserId,
      title: task.title,
      description: task.description || '',
      completed: false,
      priority: task.priority || 'Medium',
      dueDate: task.dueDate || null,
      createdAt: new Date().toISOString()
    };
    allTasks.push(newTask);
    localStorage.setItem('mockTasks', JSON.stringify(allTasks));
    return { data: newTask };
  },

  update: async (id, data) => {
    await delay(300);
    let allTasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    let updatedTask = null;
    allTasks = allTasks.map(t => {
      if (t._id === id && t.userId === currentUserId) {
        updatedTask = { ...t, ...data };
        return updatedTask;
      }
      return t;
    });
    localStorage.setItem('mockTasks', JSON.stringify(allTasks));
    if (!updatedTask) throw { response: { data: { message: 'Task not found' } } };
    return { data: updatedTask };
  },

  remove: async (id) => {
    await delay(300);
    let allTasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    allTasks = allTasks.filter(t => !(t._id === id && t.userId === currentUserId));
    localStorage.setItem('mockTasks', JSON.stringify(allTasks));
    return { data: { message: 'Task removed' } };
  },
};

const client = { defaults: { headers: { common: {} } } };
export default client;
