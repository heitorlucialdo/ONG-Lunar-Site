# Projeto Lunaar — Gestão de Acolhimento Animal

Sistema web (PWA) de gestão de acolhimento para a **ONG Projeto Lunaar** e o **Recanto**.
Centraliza o cadastro de animais, prontuário clínico e comportamental, controle de
vacinas e medicações, ocupação das alas e o fluxo de entrada/saída (acolhimento →
tratamento → apto para adoção).

Projeto de extensão — UniSenai-MT.

## Principais funcionalidades

- **Dashboard** com indicadores, distribuição por espécie, ocupação das alas e agenda do dia.
- **Animais**: cadastro com código único (LUN-000000) e QR Code, busca, filtros, porte (P/M/G),
  castração, temperamento, tags de status (castrado, vacinado, em medicação, com dor).
- **Perfil do animal**: visão geral, prontuário, medicamentos, vacinas, histórico de peso
  (gráfico), consultas, documentos e linha do tempo.
- **Logística**: Kanban com _drag and drop_ do ciclo de acolhimento (registra no histórico)
  e ocupação das alas/nichos.
- **Segregação ONG × Recanto**: alternância entre as duas bases pelo seletor no topo.
- **Agenda**, **Tarefas** (board por status), **Medicamentos** (agenda de doses),
  **Vacinas**, **Alertas**, **Tutores/responsáveis**, **Relatórios** e **Configurações**.
- **PWA**: instalável, responsivo (desktop, tablet e mobile) e com cache offline.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- React Router · Recharts · @dnd-kit · lucide-react
- vite-plugin-pwa

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção
npm run preview  # pré-visualização do build
```

## Arquitetura

- `src/data/` — modelo de domínio (`types.ts`) e dados de demonstração (`seed.ts`).
- `src/services/` — `store.tsx` (estado reativo, fonte única) e `repository.ts`
  (**camada de acesso a dados**; hoje usa dados mockados, pronta para trocar por
  Supabase/API sem alterar a interface).
- `src/components/` — componentes de UI, layout, gráficos, kanban e domínio (pets).
- `src/pages/` — páginas/rotas da aplicação.

Os dados são mockados no MVP. Toda leitura/escrita passa pelo `repository`, de modo que
a integração futura com backend altera apenas essa camada.

## Equipe

- Heitor Lucialdo — Frontend
- Ives de Arruda — Backend / APIs
- Gabriel Kimura — Banco de dados
