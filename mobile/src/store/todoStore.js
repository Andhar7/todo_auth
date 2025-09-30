import { create } from "zustand";
import axios from "axios";
import { getBaseURL } from '../utils/config';

// Ensure axios is configured
if (!axios.defaults.baseURL) {
  axios.defaults.baseURL = getBaseURL();
}

const useTodoStore = create((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  // Fetch all todos
  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("/api/products/");
      set({ 
        todos: response.data, 
        loading: false, 
        error: null 
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to fetch todos";
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Create new todo
  createTodo: async (todoData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post("/api/products/", todoData);
      const newTodo = response.data;
      
      set(state => ({ 
        todos: [...state.todos, newTodo],
        loading: false, 
        error: null 
      }));
      
      return { success: true, data: newTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to create todo";
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Update todo
  updateTodo: async (id, todoData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`/api/products/${id}/`, todoData);
      const updatedTodo = response.data;
      
      set(state => ({ 
        todos: state.todos.map(todo => 
          todo.id === id ? updatedTodo : todo
        ),
        loading: false, 
        error: null 
      }));
      
      return { success: true, data: updatedTodo };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update todo";
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Delete todo
  deleteTodo: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`/api/products/${id}/`);
      
      set(state => ({ 
        todos: state.todos.filter(todo => todo.id !== id),
        loading: false, 
        error: null 
      }));
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to delete todo";
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, message: errorMessage };
    }
  },

  // Clear todos (for logout)
  clearTodos: () => {
    set({ todos: [], loading: false, error: null });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  }
}));

export default useTodoStore;