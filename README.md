# 💰 SaaS Contas a Receber

Sistema completo de gestão de contas a receber, faturamento e cobranças desenvolvido com React, Express, tRPC e Supabase (PostgreSQL).

![Status](https://img.shields.io/badge/status-active-success.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌐 URL de Acesso

- **Aplicação Online**: https://3000-i1yoktaqj8ap81lploal1-0e616f0a.sandbox.novita.ai/

## 🚀 Recursos Implementados

### ✅ Gestão de Clientes
- Cadastro completo de clientes (PF e PJ)
- CPF/CNPJ com validação
- Dados de contato e endereço
- Status ativo/inativo

### ✅ Faturamento
- Criação de faturamentos
- Suporte a parcelas únicas, parceladas e recorrentes
- Cálculo automático de juros e multas
- Múltiplos itens por faturamento
- Status: pendente, parcial, pago, vencido, cancelado

### ✅ Controle de Parcelas
- Gerenciamento individual de parcelas
- Controle de vencimentos
- Registro de pagamentos
- Integração PIX e código de barras
- Atualização automática do status do faturamento

### ✅ Sistema de Cobranças
- Múltiplos canais: email, WhatsApp, SMS, PIX
- Agendamento de cobranças
- Controle de tentativas
- Histórico completo de envios

### ✅ Logs e Auditoria
- Log detalhado de emails enviados
- Histórico completo de pagamentos
- Conciliação bancária
- Rastreamento de status

### ✅ Dashboard e Relatórios
- Visão geral financeira
- Parcelas a vencer
- Faturamentos pendentes
- Indicadores de performance

## 🛠️ Stack Tecnológica

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **shadcn/ui** - Componentes UI
- **Wouter** - Roteamento
- **TanStack Query** - State management
- **Zod** - Validação de formulários

### Backend
- **Express** - Framework Node.js
- **tRPC** - Type-safe API
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Banco de dados (Supabase)
- **JWT** - Autenticação

### DevOps & Tools
- **Vite** - Build tool
- **PM2** - Process manager
- **Git** - Version control
- **ESBuild** - Backend bundler

## 📦 Estrutura do Projeto

```
saas-contas-receber/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilitários
│   └── public/            # Arquivos estáticos
│
├── server/                # Backend Express + tRPC
│   ├── _core/            # Core do servidor
│   ├── routers/          # Routers tRPC
│   ├── db.ts             # Configuração do banco
│   └── validators.ts     # Validações Zod
│
├── drizzle/              # Database schema e migrations
│   ├── schema.ts         # Schema do banco
│   └── migrations/       # Migrations SQL
│
├── database/             # Scripts SQL
│   └── schema_supabase_completo.sql  # Schema completo
│
├── shared/               # Código compartilhado
│   └── types.ts          # Tipos TypeScript compartilhados
│
├── dist/                 # Build de produção
├── logs/                 # Logs da aplicação
├── .env                  # Variáveis de ambiente
├── ecosystem.config.cjs  # Configuração PM2
└── package.json          # Dependências
```

## 🗄️ Modelo de Dados

### Principais Tabelas

1. **users** - Usuários do sistema
2. **clientes** - Cadastro de clientes
3. **servicos** - Catálogo de serviços
4. **faturamentos** - Faturamentos emitidos
5. **parcelas** - Parcelas dos faturamentos
6. **itens_faturamento** - Itens de cada faturamento
7. **cobrancas** - Controle de cobranças
8. **logs_email** - Log de emails enviados
9. **conciliacao** - Conciliação bancária
10. **historico_pagamentos** - Histórico de pagamentos

### Relacionamentos

```
clientes (1) ──── (N) faturamentos
faturamentos (1) ──── (N) parcelas
faturamentos (1) ──── (N) itens_faturamento
parcelas (1) ──── (N) cobrancas
parcelas (1) ──── (N) historico_pagamentos
```

## 🔧 Configuração e Deploy

### 1. Pré-requisitos

- Node.js >= 18
- PostgreSQL (Supabase)
- Git
- PM2 (para produção)

### 2. Configurar Banco de Dados no Supabase

1. Crie um projeto no [Supabase](https://supabase.com/)
2. Acesse o **SQL Editor**
3. Execute o arquivo `database/schema_supabase_completo.sql`
4. Copie a **Connection String** em Project Settings > Database

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
# Banco de Dados
DATABASE_URL="postgresql://postgres:SENHA@db.PROJETO.supabase.co:5432/postgres"

# Supabase Client
VITE_SUPABASE_URL="https://PROJETO.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-anon-key"

# JWT Secret (gere um seguro)
JWT_SECRET="gere-com-openssl-rand-base64-32"

# Ambiente
NODE_ENV="production"
PORT=3000
```

### 4. Instalar Dependências

```bash
npm install --legacy-peer-deps
```

### 5. Build do Projeto

```bash
npm run build
```

### 6. Iniciar Aplicação

#### Desenvolvimento (com hot reload)
```bash
npm run dev
```

#### Produção (com PM2)
```bash
pm2 start ecosystem.config.cjs --only saas-contas-receber
```

#### Verificar Status
```bash
pm2 list
pm2 logs saas-contas-receber --nostream
```

#### Parar Aplicação
```bash
pm2 stop saas-contas-receber
pm2 delete saas-contas-receber
```

## 📝 Scripts Disponíveis

```json
{
  "dev": "Servidor de desenvolvimento com hot reload",
  "build": "Build frontend e backend para produção",
  "start": "Iniciar servidor de produção (node)",
  "check": "Verificar tipos TypeScript",
  "format": "Formatar código com Prettier",
  "test": "Executar testes com Vitest",
  "db:push": "Gerar e aplicar migrations do Drizzle"
}
```

## 🔐 Segurança

### Implementado
- ✅ Autenticação JWT
- ✅ Validação de entrada com Zod
- ✅ Prepared statements (SQL injection protection)
- ✅ CORS configurado
- ✅ Variáveis de ambiente seguras
- ✅ .gitignore configurado

### Recomendações para Produção
- 🔸 Configurar HTTPS
- 🔸 Implementar rate limiting
- 🔸 Adicionar WAF (Web Application Firewall)
- 🔸 Backup automático do banco de dados
- 🔸 Monitoramento de logs
- 🔸 Implementar 2FA para usuários admin

## 📊 Features Futuras

- [ ] Integração com gateways de pagamento (Stripe, PagSeguro)
- [ ] Envio automático de cobranças por WhatsApp
- [ ] Geração de boletos bancários
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Dashboard avançado com gráficos
- [ ] Notificações push
- [ ] App mobile (React Native)
- [ ] API pública com documentação
- [ ] Webhooks para integrações
- [ ] Multi-tenancy

## 🐛 Troubleshooting

### Erro ao conectar no banco de dados
```bash
# Verifique se a DATABASE_URL está correta
echo $DATABASE_URL

# Teste a conexão com o Supabase
npm run db:push
```

### Porta 3000 já em uso
```bash
# Matar processo na porta 3000
fuser -k 3000/tcp

# Ou configurar outra porta no .env
PORT=3001
```

### Erro ao instalar dependências
```bash
# Use --legacy-peer-deps
npm install --legacy-peer-deps
```

### Aplicação não inicia
```bash
# Verificar logs
pm2 logs saas-contas-receber

# Verificar se o build foi feito
ls -la dist/

# Rebuild se necessário
npm run build
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para gerenciar contas a receber de forma eficiente.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do email.

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
