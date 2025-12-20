import { createContext, useContext, useState, useEffect } from 'react';
import mockData from '../data/mockData.json';

const ProjectContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = () => {
      try {
        const storedProjects = localStorage.getItem('constructech_projects');

        if (storedProjects) {
          const parsed = JSON.parse(storedProjects);
          setProjects(parsed);
        } else {
          setProjects(mockData.projects);
          localStorage.setItem('constructech_projects', JSON.stringify(mockData.projects));
        }
      } catch (error) {
        console.error('Erro ao carregar projetos:', error);
        setProjects(mockData.projects);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0) {
      const stats = {
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === 'em_andamento').length,
        completedProjects: projects.filter(p => p.status === 'concluido').length,
        planningProjects: projects.filter(p => p.status === 'planejamento').length,
        totalBudget: projects.reduce((sum, p) => sum + (parseFloat(p.budget) || 0), 0),
        totalSpent: projects.reduce((sum, p) => sum + (parseFloat(p.spent) || 0), 0),
        totalWorkers: projects.reduce((sum, p) => sum + (parseInt(p.team?.workers, 10) || 0), 0),
      };
      setStatistics(stats);
    } else {
      setStatistics(mockData.statistics);
    }
  }, [projects]);

  const saveToLocalStorage = (updatedProjects) => {
    try {
      localStorage.setItem('constructech_projects', JSON.stringify(updatedProjects));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  };

  const createProject = (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      progress: 0,
      spent: 0,
      expenses: [],
      image: `https://images.unsplash.com/photo-${1541888000000 + Math.floor(Math.random() * 10000000)}-${Math.random().toString(36).substring(7)}?w=800&h=600&fit=crop`,
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveToLocalStorage(updatedProjects);

    return newProject;
  };

  const updateProject = (projectId, updates) => {
    const updatedProjects = projects.map(project => {
      if (String(project.id) === String(projectId)) {
        return { ...project, ...updates };
      }
      return project;
    });

    setProjects(updatedProjects);
    saveToLocalStorage(updatedProjects);
  };

  const deleteProject = (projectId) => {
    const updatedProjects = projects.filter(project => String(project.id) !== String(projectId));
    setProjects(updatedProjects);
    saveToLocalStorage(updatedProjects);
  };

  const addExpense = (projectId, expense) => {
    const updatedProjects = projects.map(project => {
      if (String(project.id) === String(projectId)) {
        const newExpense = {
          id: Date.now().toString(),
          ...expense,
          date: expense.date || new Date().toISOString().split('T')[0],
        };

        const updatedExpenses = [...(project.expenses || []), newExpense];
        const newSpent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        return {
          ...project,
          expenses: updatedExpenses,
          spent: newSpent,
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    saveToLocalStorage(updatedProjects);
  };

  const removeExpense = (projectId, expenseId) => {
    const updatedProjects = projects.map(project => {
      if (String(project.id) === String(projectId)) {
        const updatedExpenses = project.expenses.filter(exp => exp.id !== expenseId);
        const newSpent = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        return {
          ...project,
          expenses: updatedExpenses,
          spent: newSpent,
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    saveToLocalStorage(updatedProjects);
  };

  const getProjectById = (projectId) => {
    return projects.find(project => String(project.id) === String(projectId));
  };

  const resetToMockData = () => {
    setProjects(mockData.projects);
    saveToLocalStorage(mockData.projects);
  };

  const value = {
    projects,
    statistics,
    loading,
    createProject,
    updateProject,
    deleteProject,
    addExpense,
    removeExpense,
    getProjectById,
    resetToMockData,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
