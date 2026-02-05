# 🚀 Deploy no Render.com - Guia Completo

## 📋 Status: CORREÇÃO APLICADA

**Problema identificado:** Vite e ESBuild estavam em `devDependencies`, mas o Render não instala devDependencies por padrão em produção.

**Solução:** Movemos as ferramentas de build para `dependencies` e atualizamos o comando de build.

---

## 🔧 Correções Aplicadas

### 1. package.json - Dependências Corrigidas
Movemos para `dependencies`:
- ✅ `vite@^7.1.7` - Build frontend
- ✅ `esbuild@^0.25.0` - Build backend
- ✅ `@vitejs/plugin-react@^5.0.4` - Plugin React
- ✅ `@tailwindcss/vite@^4.1.3` - Plugin Tailwind

### 2. render.yaml - Configuração Otimizada
```yaml
buildCommand: npm install --legacy-peer-deps --include=dev && npm run build
```

O flag `--include=dev` garante que todas as dependências sejam instaladas durante o build.

---

## 🎯 Passos para Deploy no Render

### Passo 1: Fazer Push das Correções
```powershell
# No PowerShell, na pasta do projeto:
cd "D:\MINHAS_EMPRESAS\AGILIZA\DIGITAL\13 - SITE AGILIZA\SISTEMA DE GERENCIAMENTO\saas-contas-receber"

# Adicionar as correções
git add .
git commit -m "Fix: Move build tools to dependencies for Render deployment"
git push origin main
```

### Passo 2: Configurar no Render Dashboard

#### 2.1 Acessar Render
1. Acesse: https://dashboard.render.com/
2. Faça login na sua conta

#### 2.2 Criar Web Service
1. Clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub: `agiliza2b-source/saas-contas-receber`
3. Clique em **"Connect"**

#### 2.3 Configurações do Serviço
- **Name:** `saas-contas-receber`
- **Region:** `Oregon (US West)` (ou mais próximo de você)
- **Branch:** `main`
- **Runtime:** `Node`
- **Build Command:** 
  ```bash
  npm install --legacy-peer-deps --include=dev && npm run build
  ```
- **Start Command:**
  ```bash
  npm start
  ```
- **Plan:** `Free` (ou escolha o plano desejado)

#### 2.4 Adicionar Variáveis de Ambiente

Clique em **"Environment"** e adicione:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://postgres:6ToKwfk5D1T01N8A@db.smljzczodssmmlzqesjo.supabase.co:5432/postgres` |
| `VITE_SUPABASE_URL` | `https://smljzczodssmmlzqesjo.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbGp6Y3pvZHNzbW1senFlc2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODc5NTMsImV4cCI6MjA4NTc2Mzk1M30.gZn60wuFauAsvdEALdZVDLt6PblHH--kc8SdTO5753w` |
| `JWT_SECRET` | Clique em **"Generate"** (Render gera automaticamente) |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `VITE_APP_ID` | `saas-contas-receber` |
| `OAUTH_SERVER_URL` | `https://saas-contas-receber.onrender.com` (ajustar após deploy) |
| `OWNER_OPEN_ID` | `admin` |
| `VITE_OAUTH_PORTAL_URL` | `https://saas-contas-receber.onrender.com` (ajustar após deploy) |

#### 2.5 Criar o Serviço
1. Clique em **"Create Web Service"**
2. Aguarde o build (5-10 minutos)
3. O Render irá:
   - ✅ Clonar seu repositório
   - ✅ Instalar dependências com `--legacy-peer-deps`
   - ✅ Fazer build do frontend e backend
   - ✅ Iniciar a aplicação

### Passo 3: Atualizar URLs OAuth

Após o deploy bem-sucedido:

1. Copie a URL gerada (ex: `https://saas-contas-receber-xxxx.onrender.com`)
2. Volte para **Environment** → **Environment Variables**
3. Atualize as variáveis:
   - `OAUTH_SERVER_URL`: Cole a URL completa
   - `VITE_OAUTH_PORTAL_URL`: Cole a mesma URL
4. Clique em **"Save Changes"**
5. O Render fará redeploy automaticamente

### Passo 4: Executar Schema SQL no Supabase

**IMPORTANTE:** Este passo é obrigatório antes de usar a aplicação!

1. Acesse: https://supabase.com/
2. Faça login e selecione seu projeto: `smljzczodssmmlzqesjo`
3. Vá em **SQL Editor** (menu lateral esquerdo)
4. Abra o arquivo: `database/schema_supabase_completo.sql` no seu computador
5. Copie **TODO** o conteúdo do arquivo
6. Cole no SQL Editor do Supabase
7. Clique em **"RUN"** (ou pressione Ctrl+Enter)
8. Aguarde 10-30 segundos
9. Verifique em **Table Editor** se foram criadas **10 tabelas**:
   - ✅ users
   - ✅ servicos
   - ✅ clientes
   - ✅ faturamentos
   - ✅ parcelas
   - ✅ itens_faturamento
   - ✅ cobrancas
   - ✅ logs_email
   - ✅ conciliacao
   - ✅ historico_pagamentos

---

## ✅ Verificação Final

### 1. Testar a Aplicação
```bash
# Acessar a URL no navegador
https://saas-contas-receber-xxxx.onrender.com/
```

### 2. Verificar Logs
No Dashboard do Render:
- Clique em **"Logs"** (menu superior direito)
- Procure por:
  - ✅ `Server running at http://localhost:3000/`
  - ✅ `OAuth initialized`
  - ❌ Erros (se houver, me avise)

### 3. Testar Endpoints
```bash
# Health check
curl https://seu-app.onrender.com/

# API tRPC
curl https://seu-app.onrender.com/api/trpc
```

---

## 🔄 Deploy Automático

Agora toda vez que você fizer `git push origin main`, o Render automaticamente:
1. Detecta as mudanças
2. Faz o build
3. Faz o deploy

---

## 🆘 Problemas Comuns

### Build Falha: "vite: not found"
**Solução:** Certifique-se de fazer push do `package.json` atualizado.

### Build Falha: "ERESOLVE"
**Solução:** O comando usa `--legacy-peer-deps` automaticamente.

### App Não Inicia: "Cannot find module"
**Solução:** Verifique se o build gerou `dist/index.js` nos logs.

### Erro 500: Database Connection
**Solução:** Verifique se executou o schema SQL no Supabase.

### OAuth Não Funciona
**Solução:** Verifique se atualizou `OAUTH_SERVER_URL` e `VITE_OAUTH_PORTAL_URL` com a URL real.

---

## 📚 Links Úteis

- **Render Dashboard:** https://dashboard.render.com/
- **Supabase Dashboard:** https://supabase.com/dashboard/project/smljzczodssmmlzqesjo
- **Logs da Aplicação:** Dashboard → Seu Serviço → Logs
- **Documentação Render:** https://render.com/docs

---

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. ✅ Testar cadastro de clientes
2. ✅ Testar criação de faturamentos
3. ✅ Testar geração de parcelas
4. ✅ Testar cobranças
5. ✅ Configurar domínio customizado (opcional)
6. ✅ Configurar backups automáticos do Supabase

---

## 📞 Suporte

Se encontrar algum erro:
1. Copie os logs do Render
2. Copie a mensagem de erro completa
3. Me envie para análise

Boa sorte com o deploy! 🚀
