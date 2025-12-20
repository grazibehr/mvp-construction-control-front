import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { formatCurrency } from "../utils/formatters";
import Card from "../components/Card";
import "./Projects.css";

import {
  FaBriefcase,
  FaClock,
  FaCheckCircle,
  FaPauseCircle,
  FaPlus,
  FaSearch,
  FaTimes,
  FaFolderOpen,
  FaDollarSign,
} from "react-icons/fa";

const Projects = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, loading, statistics } = useProjects();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const statusCounts = useMemo(() => {
    return {
      all: projects.length,
      em_andamento: projects.filter((p) => p.status === "em_andamento").length,
      planejamento: projects.filter((p) => p.status === "planejamento").length,
      concluido: projects.filter((p) => p.status === "concluido").length,
      pausado: projects.filter((p) => p.status === "pausado").length,
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (loading || projects.length === 0) return [];

    let result = projects;

    if (activeFilter !== "all") {
      result = result.filter((project) => project.status === activeFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (project) =>
          project.name.toLowerCase().includes(term) ||
          project.description.toLowerCase().includes(term) ||
          project.location.toLowerCase().includes(term)
      );
    }

    return result;
  }, [projects, loading, activeFilter, searchTerm]);

  useEffect(() => {
    console.log("Rota atual:", location.pathname);
  }, [location]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilter = (status) => {
    setActiveFilter(status);
  };

  if (loading) {
    return (
      <div className="loading">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="projects-container">
      {/* Header */}
      <header className="projects-header">
        <div className="header-content">
          <div>
            <h1>Meus Projetos</h1>
            <p>Gerencie e acompanhe todos os seus projetos de construção</p>
          </div>
          <button
            className="new-project-btn"
            onClick={() => navigate("/new-project")}
          >
            <FaPlus />
            Novo Projeto
          </button>
        </div>
      </header>

      <section className="search-filters-section">
        <div className="search-row">
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar projetos por nome, descrição ou localização..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={handleClearSearch}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-chips">
            <button
              className={`filter-chip ${
                activeFilter === "all" ? "active" : ""
              }`}
              onClick={() => handleFilter("all")}
            >
              Todos
              <span className="filter-count">{statusCounts.all}</span>
            </button>
            <button
              className={`filter-chip ${
                activeFilter === "em_andamento" ? "active em_andamento" : ""
              }`}
              onClick={() => handleFilter("em_andamento")}
            >
              Em Andamento
              <span className="filter-count">{statusCounts.em_andamento}</span>
            </button>
            <button
              className={`filter-chip ${
                activeFilter === "planejamento" ? "active planejamento" : ""
              }`}
              onClick={() => handleFilter("planejamento")}
            >
              Planejamento
              <span className="filter-count">{statusCounts.planejamento}</span>
            </button>
            <button
              className={`filter-chip ${
                activeFilter === "concluido" ? "active concluido" : ""
              }`}
              onClick={() => handleFilter("concluido")}
            >
              Concluído
              <span className="filter-count">{statusCounts.concluido}</span>
            </button>
            <button
              className={`filter-chip ${
                activeFilter === "pausado" ? "active pausado" : ""
              }`}
              onClick={() => handleFilter("pausado")}
            >
              Pausado
              <span className="filter-count">{statusCounts.pausado}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {filteredProjects.length > 0 ? (
        <section className="results-section">
          <div className="results-header">
            <p className="results-count">
              Mostrando <strong>{filteredProjects.length}</strong>{" "}
              {filteredProjects.length === 1 ? "projeto" : "projetos"}
              {activeFilter !== "all" &&
                ` com status "${activeFilter.replace("_", " ")}"`}
              {searchTerm && ` para "${searchTerm}"`}
            </p>
          </div>
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <Card key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <FaFolderOpen />
          </div>
          <h3>Nenhum projeto encontrado</h3>
          <p>
            {searchTerm
              ? `Não encontramos resultados para "${searchTerm}". Tente outro termo.`
              : activeFilter !== "all"
              ? `Não há projetos com status "${activeFilter.replace(
                  "_",
                  " "
                )}".`
              : "Você ainda não tem projetos. Comece criando seu primeiro projeto!"}
          </p>
          {!searchTerm && activeFilter === "all" && (
            <button
              className="empty-action-btn"
              onClick={() => navigate("/new-project")}
            >
              <FaPlus />
              Criar Primeiro Projeto
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
