# ConstrutechPro - Sistema de Controle de Projetos de Construção

Sistema de gerenciamento de projetos de construção com dashboard interativo e controle financeiro detalhado. Desenvolvido com React 19, este MVP demonstra o uso de componentização, roteamento e design responsivo.

## Sobre o Projeto

ConstrutechPro é uma aplicação front-end para gerenciar projetos de construção civil, permitindo o acompanhamento de orçamentos, despesas, progresso de obras e equipes. A aplicação utiliza dados mockados em JSON e simula requisições a um servidor.

## Funcionalidades

### Páginas (6 páginas)
1. **Dashboard** - Visão geral com estatísticas e gráficos interativos
2. **Projects** - Lista completa de projetos com filtros e busca
3. **ProjectDetail** - Detalhes do projeto com edição completa
4. **NewProject** - Formulário de cadastro com validação e rascunho automático
5. **ExpenseControl** - Controle detalhado de despesas por projeto
6. **NotFound (404)** - Página de erro para URLs inexistentes

### Componentes Reutilizáveis
- **DashboardLayout** - Layout principal com sidebar e navegação responsiva
- **Card** - Cards de projetos com imagem, informações e progresso

#### Componentes UI Customizados
- **CustomCard** - Card estilizado com suporte a tema claro/escuro
- **CustomButton** - Botão personalizado com variantes e estados
- **CustomTextField** - Campo de texto com validação e estilos customizados

#### Componentes MUI
- **Alert** - Mensagens de feedback (sucesso, erro, aviso, info)
- **Dialog/Modal** - Confirmação para ações críticas
- **Tooltip** - Explicações rápidas em botões e ícones
- **CircularProgress/Loading** - Indicadores de carregamento

### Hooks Utilizados

#### React Hooks
- **useState** - Gerenciamento de estado dos componentes
- **useEffect** - Efeitos colaterais e simulação de requisições
- **useMemo** - Otimização de cálculos e filtros
- **useCallback** - Memorização de funções
- **useContext** - Acesso ao contexto global (ProjectContext, ThemeContext)

#### React Router Hooks
- **useNavigate** - Navegação programática entre rotas
- **useParams** - Captura de parâmetros da URL (ID do projeto)
- **useLocation** - Leitura e monitoramento da URL atual

### Recursos de UX
- Loading states durante carregamento de dados
- Tooltips explicativas em botões e informações
- Mensagens de sucesso/erro contextuais
- Validação em tempo real de formulários
- Rascunho automático salvo no localStorage
- Tema claro/escuro
- Layout responsivo (desktop, tablet, mobile)

## Estrutura do Projeto

```
construction-control/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── CustomCard.jsx
│   │   │   ├── CustomButton.jsx
│   │   │   ├── CustomTextField.jsx
│   │   │   └── index.js
│   │   ├── DashboardLayout.jsx
│   │   └── Card.jsx
│   ├── context/
│   │   └── ProjectContext.jsx
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Dashboard.css
│   │   ├── Projects.jsx
│   │   ├── Projects.css
│   │   ├── ProjectDetail.jsx
│   │   ├── NewProject.jsx
│   │   ├── ExpenseControl.jsx
│   │   └── NotFound.jsx
│   ├── data/
│   │   └── mockData.json
│   ├── utils/
│   │   └── formatters.js
│   ├── theme/
│   │   └── theme.js
│   ├── styles/
│   │   └── variables.css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── README.md
```

## Tecnologias Utilizadas

- **React 19.2.0** - Biblioteca principal
- **React Router DOM 7.9.6** - Navegação entre páginas
- **Material UI (MUI) 7.3.6** - Componentes de interface
  - **@mui/x-charts 8.21.0** - Gráficos avançados
  - **@mui/x-data-grid 8.21.0** - Tabelas de dados
  - **@mui/x-date-pickers 8.21.0** - Seletores de data
- **Emotion** - Estilização CSS-in-JS
- **React Icons 5.5.0** - Ícones
- **Recharts 3.5.1** - Gráficos e visualizações
- **Day.js 1.11.19** - Manipulação de datas
- **Vite 7.2.4** - Build tool e dev server
- **ESLint 9.39.1** - Linting de código

## Pré-requisitos

- **Node.js** (versão 16 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **yarn**

Para verificar se estão instalados:
```bash
node --version
npm --version
```

## Instruções de Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/construction-control.git
cd construction-control
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Execute o servidor de desenvolvimento
```bash
npm run dev
```

### 4. Acesse a aplicação
```
http://localhost:5173
```

## Rotas da Aplicação

| Rota | Página |
|------|--------|
| `/` | Dashboard |
| `/projects` | Lista de Projetos |
| `/new-project` | Novo Projeto |
| `/project/:id` | Detalhes do Projeto |
| `/project/:id/expenses` | Controle de Despesas |
| `/*` | Página 404 |

## Testando a Página 404

Acesse qualquer URL inexistente:
- `http://localhost:5173/pagina-inexistente`
- `http://localhost:5173/teste`

## Layout Responsivo

- **Desktop (>1024px)** - Layout completo com sidebar fixa
- **Tablet (768px-1024px)** - Layout de 2 colunas
- **Mobile (<768px)** - Layout de 1 coluna, menu hamburguer

## Simulação de Dados

Os dados são carregados do arquivo `mockData.json` com delays simulados para representar requisições a um servidor. Os dados são persistidos no localStorage para manter alterações entre sessões.
