import "./Dashboard.css";
import { useProjects } from "../context/ProjectContext";
import { formatCurrency } from "../utils/formatters";
import { useNavigate } from "react-router-dom";

import {
  FaBriefcase,
  FaClock,
  FaDollarSign,
  FaUsers,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export default function Dashboard() {
  const { projects, statistics, loading } = useProjects();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="loading">
        <span className="spinner" />
      </div>
    );
  }

  // Dados simulados de comparação (mês atual vs mês anterior)
  const comparisons = {
    projects: {
      current: statistics?.totalProjects ?? 0,
      previous: (statistics?.totalProjects ?? 0) - 2,
      change: 2,
    },
    budget: {
      current: statistics?.totalBudget ?? 0,
      previous: (statistics?.totalBudget ?? 0) * 0.85,
      change: 15,
    },
    spent: {
      current: statistics?.totalSpent ?? 0,
      previous: (statistics?.totalSpent ?? 0) * 0.9,
      change: 10,
    },
    workers: {
      current: statistics?.totalWorkers ?? 0,
      previous: (statistics?.totalWorkers ?? 0) - 5,
      change: 5,
    },
  };

  const budgetData = [
    { month: "Jan", orcamento: 150000, gasto: 120000 },
    { month: "Fev", orcamento: 180000, gasto: 150000 },
    { month: "Mar", orcamento: 200000, gasto: 180000 },
    { month: "Abr", orcamento: 250000, gasto: 220000 },
    { month: "Mai", orcamento: 220000, gasto: 190000 },
    { month: "Jun", orcamento: 300000, gasto: 280000 },
  ];

  const progressData = projects.slice(0, 5).map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    progresso: p.progress,
    meta: 100,
  }));

  const statusData = [
    {
      name: "Em andamento",
      value: projects.filter((p) => p.status === "em_andamento").length,
      color: "#6366f1",
    },
    {
      name: "Planejamento",
      value: projects.filter((p) => p.status === "planejamento").length,
      color: "#f59e0b",
    },
    {
      name: "Concluído",
      value: projects.filter((p) => p.status === "concluido").length,
      color: "#10b981",
    },
    {
      name: "Pausado",
      value: projects.filter((p) => p.status === "pausado").length,
      color: "#ef4444",
    },
  ].filter((s) => s.value > 0);

  const recentProjects = projects.slice(0, 4);

  const alertProjects = projects.filter((p) => p.spent > p.budget);

  const avgEfficiency =
    projects.length > 0
      ? Math.round(
          projects.reduce(
            (acc, p) =>
              acc +
              (p.budget > 0 ? ((p.budget - p.spent) / p.budget) * 100 : 0),
            0
          ) / projects.length
        )
      : 0;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Olá, Grazi!</h1>
            <p>Visão geral dos seus projetos de construção</p>
          </div>
          <div className="header-date">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </header>
      {/* KPIs com indicadores de crescimento */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <div className="icon primary">
              <FaBriefcase />
            </div>
            <div
              className={`kpi-trend ${
                comparisons.projects.change >= 0 ? "up" : "down"
              }`}
            >
              {comparisons.projects.change >= 0 ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}
              <span>{Math.abs(comparisons.projects.change)}</span>
            </div>
          </div>
          <span className="kpi-label">Total de Projetos</span>
          <strong className="kpi-value">
            {statistics?.totalProjects ?? 0}
          </strong>
          <p className="kpi-comparison">vs. mês anterior</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="icon success">
              <FaClock />
            </div>
            <div className="kpi-trend up">
              <FaArrowUp />
              <span>{statistics?.activeProjects ?? 0}</span>
            </div>
          </div>
          <span className="kpi-label">Projetos Ativos</span>
          <strong className="kpi-value">
            {statistics?.activeProjects ?? 0}
          </strong>
          <p className="kpi-comparison">
            {statistics?.completedProjects ?? 0} concluídos
          </p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="icon warning">
              <FaDollarSign />
            </div>
            <div
              className={`kpi-trend ${
                comparisons.budget.change >= 0 ? "up" : "down"
              }`}
            >
              {comparisons.budget.change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
              <span>{comparisons.budget.change}%</span>
            </div>
          </div>
          <span className="kpi-label">Orçamento Total</span>
          <strong className="kpi-value">
            {formatCurrency(statistics?.totalBudget ?? 0)}
          </strong>
          <p className="kpi-comparison">
            Gasto: {formatCurrency(statistics?.totalSpent ?? 0)}
          </p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <div className="icon info">
              <FaUsers />
            </div>
            <div
              className={`kpi-trend ${
                comparisons.workers.change >= 0 ? "up" : "down"
              }`}
            >
              {comparisons.workers.change >= 0 ? (
                <FaArrowUp />
              ) : (
                <FaArrowDown />
              )}
              <span>{Math.abs(comparisons.workers.change)}</span>
            </div>
          </div>
          <span className="kpi-label">Trabalhadores</span>
          <strong className="kpi-value">{statistics?.totalWorkers ?? 0}</strong>
          <p className="kpi-comparison">em todos os projetos</p>
        </div>
      </section>
      {/* Seção de Comparação de Projetos */}
      <section className="comparison-section">
        <h2 className="section-title">
          <FaChartLine /> Análise Comparativa
        </h2>
        <div className="comparison-grid">
          <div className="comparison-card">
            <div className="comparison-icon success">
              <FaCheckCircle />
            </div>
            <div className="comparison-info">
              <span>Eficiência Média</span>
              <strong>{avgEfficiency}%</strong>
              <p>dos projetos dentro do orçamento</p>
            </div>
            <div
              className={`comparison-badge ${
                avgEfficiency >= 70
                  ? "success"
                  : avgEfficiency >= 50
                  ? "warning"
                  : "danger"
              }`}
            >
              {avgEfficiency >= 70
                ? "Excelente"
                : avgEfficiency >= 50
                ? "Regular"
                : "Atenção"}
            </div>
          </div>

          <div className="comparison-card">
            <div className="comparison-icon primary">
              <FaBriefcase />
            </div>
            <div className="comparison-info">
              <span>Projetos Concluídos</span>
              <strong>{statistics?.completedProjects ?? 0}</strong>
              <p>de {statistics?.totalProjects ?? 0} totais</p>
            </div>
            <div className="comparison-badge primary">
              {Math.round(
                ((statistics?.completedProjects ?? 0) /
                  (statistics?.totalProjects || 1)) *
                  100
              )}
              %
            </div>
          </div>

          <div className="comparison-card">
            <div
              className={`comparison-icon ${
                alertProjects.length > 0 ? "danger" : "success"
              }`}
            >
              <FaExclamationTriangle />
            </div>
            <div className="comparison-info">
              <span>Projetos com Alerta</span>
              <strong>{alertProjects.length}</strong>
              <p>orçamento excedido</p>
            </div>
            <div
              className={`comparison-badge ${
                alertProjects.length > 0 ? "danger" : "success"
              }`}
            >
              {alertProjects.length > 0 ? "Atenção" : "OK"}
            </div>
          </div>
        </div>
      </section>
      {/* Gráficos */}
      <section className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Acompanhamento de Orçamento</h3>
              <p>Planejado vs gasto real nos últimos 6 meses</p>
            </div>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="dot primary"></span> Orçamento
              </span>
              <span className="legend-item">
                <span className="dot success"></span> Gasto
              </span>
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={budgetData}>
                <defs>
                  <linearGradient
                    id="colorOrcamento"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                />
                <XAxis dataKey="month" stroke="var(--text-secondary)" />
                <YAxis
                  tickFormatter={(v) => `${v / 1000}k`}
                  stroke="var(--text-secondary)"
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="orcamento"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorOrcamento)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="gasto"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorGasto)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>Status dos Projetos</h3>
              <p>Distribuição atual</p>
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {statusData.map((item, index) => (
                    <Cell key={index} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                  }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
      {/* Projetos Recentes */}
      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Projetos Recentes</h2>
          <button
            className="view-all-btn"
            onClick={() => navigate("/projects")}
          >
            Ver todos
          </button>
        </div>
        <div className="recent-grid">
          {recentProjects.map((project) => (
            <div
              key={project.id}
              className="recent-card"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div
                className="recent-image"
                style={{ backgroundImage: `url(${project.image})` }}
              >
                <span className={`status-badge ${project.status}`}>
                  {project.status === "em_andamento" && "Em andamento"}
                  {project.status === "planejamento" && "Planejamento"}
                  {project.status === "concluido" && "Concluído"}
                  {project.status === "pausado" && "Pausado"}
                </span>
              </div>
              <div className="recent-content">
                <h4>{project.name}</h4>
                <div className="recent-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span>{project.progress}%</span>
                </div>
                <div className="recent-footer">
                  <span className="budget">
                    {formatCurrency(project.budget)}
                  </span>
                  <span
                    className={`spent ${
                      project.spent > project.budget ? "over" : ""
                    }`}
                  >
                    Gasto: {formatCurrency(project.spent)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
