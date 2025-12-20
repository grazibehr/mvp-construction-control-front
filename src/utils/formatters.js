export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCurrencyDetailed = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Formata valor para exibição em inputs (sem símbolo R$)
// Recebe número (ex: 354000) e retorna string formatada (ex: "354.000")
export const formatCurrencyInput = (value) => {
  if (!value && value !== 0) return '';
  const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  return numValue.toLocaleString('pt-BR');
};

// Converte input formatado para número
// Remove separadores de milhar e converte vírgula decimal para ponto
export const parseCurrencyInput = (value) => {
  if (!value) return 0;
  // Remove pontos (separador de milhar) e troca vírgula por ponto (decimal)
  const cleanValue = value.toString().replace(/\./g, '').replace(',', '.');
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? 0 : numericValue;
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR');
};

export const statusConfig = {
  em_andamento: {
    label: 'Em Andamento',
    color: 'primary',
  },
  planejamento: {
    label: 'Planejamento',
    color: 'warning',
  },
  concluido: {
    label: 'Concluído',
    color: 'success',
  },
  pausado: {
    label: 'Pausado',
    color: 'error',
  },
};

export const getStatusColor = (status) => {
  return statusConfig[status]?.color || 'default';
};

export const getStatusText = (status) => {
  return statusConfig[status]?.label || status;
};

export const categoryNames = {
  material: 'Material',
  mao_de_obra: 'Mão de Obra',
  equipamentos: 'Equipamentos',
  fundacao: 'Fundação',
  infraestrutura: 'Infraestrutura',
  projeto: 'Projeto',
  licencas: 'Licenças',
  acabamento: 'Acabamento',
};
