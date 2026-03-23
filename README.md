# 📦 StockPro 
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> **Status do Projeto:** 🚀 Produção 
> **Link do Projeto:** [Acesse o StockPro Online](https://stock-control-o8b3oqs5g-honoratothauanys-projects.vercel.app/login)

O **StockPro** é uma plataforma SaaS Full Stack projetada para transformar a gestão de pequenos negócios. Diferente de listas de estoque convencionais, este sistema foca na **integridade de dados de missão crítica** e no isolamento total entre lojistas.

---
## 🔐 Acesso ao Sistema
Para garantir a segurança e o isolamento dos dados (Multi-tenancy), todas as funcionalidades do sistema (Dashboard, Stock e Vendas) requerem autenticação.

Novos utilizadores devem criar uma conta na página de Registo.

Após o login, o sistema cria um ecossistema exclusivo para o utilizador, onde todos os dados inseridos são privados e protegidos.

## 🎯 O Desafio de Negócio
Pequenos empreendedores frequentemente perdem dinheiro devido a furos no estoque ou falta de clareza no faturamento. O StockPro resolve isso centralizando o fluxo de caixa e o inventário em uma interface intuitiva que automatiza baixas e gera alertas de reposição.

---

## 📸 Demonstração Visual

### 📊 Dashboard de Business Intelligence
Visualização em tempo real de KPIs: Faturamento total, saldo em conta e taxa de saída de produtos.
> <img width="1595" height="868" alt="image" src="https://github.com/user-attachments/assets/4f73aa94-8157-4262-a73b-ad162c10a60a" />



### 🛒 Checkout de Alta Integridade
Interface de vendas com validação dinâmica de estoque e registro automático de movimentações financeiras.
> <img width="1567" height="764" alt="image" src="https://github.com/user-attachments/assets/b4b34c9f-1d61-445d-b80e-5ce747f3c4c8" />

---

## ✨ Funcionalidades Principais
- **Multi-tenant SaaS:** Cada usuário possui seu próprio ecossistema de dados, isolado por `userId`.
- **Controle de Inventário:** Alertas visuais (badges) para produtos com estoque crítico.
- **Fluxo de Caixa Automatizado:** Cada venda gera automaticamente um log de movimentação e abate o estoque.
- **Relatórios em PDF:** Exportação de histórico de movimentações para auditorias rápidas.
- **Interface Responsiva:** UX otimizada para Desktop e Mobile com suporte a Dark Mode.

---

## 🏗️ Diferenciais de Engenharia 

### 🧪 Transações ACID com Prisma
Implementei o uso de `$transaction` para garantir que as operações de venda e atualização de estoque ocorram de forma **atômica**. Se uma etapa falhar, o sistema reverte as alterações, impedindo "vendas fantasmas" e inconsistências no banco.

### ⚡ Otimização de Performance
Apliquei **Índices SQL (B-Tree)** nas colunas de busca frequente no PostgreSQL via Supabase. Isso garante que a filtragem de dados por usuário ocorra em milissegundos, independente do volume de registros.

### 🔐 Segurança de Camadas
Filtros de isolamento de dados aplicados diretamente nas **Server Actions** e **API Routes**, garantindo que as credenciais do usuário sejam validadas em cada requisição ao banco.

---

## 🛠️ Stack Tecnológica
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Lucide React.
- **Backend:** Next.js Server Actions, Prisma ORM.
- **Database:** PostgreSQL no Supabase.
- **BI/Gráficos:** Recharts.
- **Relatórios:** jsPDF & AutoTable.

---
## 📧 Contato
Desenvolvido por Thauany Honorato - [Linkedin](www.linkedin.com/in/thauany-honorato-9087482b3)
