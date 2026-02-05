# ✅ CHECKLIST - DEPLOY NO RENDER

## 📋 Antes de Começar

- [ ] Git instalado no Windows
- [ ] Repositório GitHub configurado (`agiliza2b-source/saas-contas-receber`)
- [ ] Conta no Render.com criada
- [ ] Conta no Supabase ativa

---

## 🚀 Passo a Passo

### 1. Push das Correções ✅
```powershell
cd "D:\MINHAS_EMPRESAS\AGILIZA\DIGITAL\13 - SITE AGILIZA\SISTEMA DE GERENCIAMENTO\saas-contas-receber"
git add .
git commit -m "Fix: Move build tools to dependencies for Render"
git push origin main
```

- [ ] Push realizado com sucesso
- [ ] Código no GitHub atualizado

### 2. Configurar Render Dashboard 🎯

#### 2.1 Criar Web Service
- [ ] Acessei https://dashboard.render.com/
- [ ] Cliquei em "New +" → "Web Service"
- [ ] Conectei o repositório `agiliza2b-source/saas-contas-receber`

#### 2.2 Configurações Básicas
- [ ] Name: `saas-contas-receber`
- [ ] Region: `Oregon` (ou mais próximo)
- [ ] Branch: `main`
- [ ] Runtime: `Node`
- [ ] Build Command: `npm install --legacy-peer-deps --include=dev && npm run build`
- [ ] Start Command: `npm start`
- [ ] Plan: `Free`

#### 2.3 Variáveis de Ambiente
Copiar e colar no Render (Environment → Environment Variables):

```
DATABASE_URL=postgresql://postgres:6ToKwfk5D1T01N8A@db.smljzczodssmmlzqesjo.supabase.co:5432/postgres
VITE_SUPABASE_URL=https://smljzczodssmmlzqesjo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbGp6Y3pvZHNzbW1senFlc2pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODc5NTMsImV4cCI6MjA4NTc2Mzk1M30.gZn60wuFauAsvdEALdZVDLt6PblHH--kc8SdTO5753w
NODE_ENV=production
PORT=3000
VITE_APP_ID=saas-contas-receber
OWNER_OPEN_ID=admin
```

**JWT_SECRET:** Clicar em "Generate" para gerar automaticamente

**URLs OAuth:** Adicionar temporariamente, atualizar depois
```
OAUTH_SERVER_URL=https://saas-contas-receber.onrender.com
VITE_OAUTH_PORTAL_URL=https://saas-contas-receber.onrender.com
```

- [ ] Todas variáveis adicionadas
- [ ] JWT_SECRET gerado
- [ ] Cliquei em "Create Web Service"

### 3. Aguardar Deploy ⏳
- [ ] Build iniciou
- [ ] Build completou (5-10 min)
- [ ] Aplicação está online
- [ ] Copiei a URL gerada: `_______________________________`

### 4. Atualizar URLs OAuth 🔄
- [ ] Voltei em Environment → Environment Variables
- [ ] Atualizei `OAUTH_SERVER_URL` com a URL real
- [ ] Atualizei `VITE_OAUTH_PORTAL_URL` com a URL real
- [ ] Cliquei em "Save Changes"
- [ ] Aguardei redeploy automático (2-3 min)

### 5. Executar Schema SQL no Supabase 🗄️

**IMPORTANTE:** Sem isso, a aplicação não funciona!

- [ ] Acessei https://supabase.com/
- [ ] Selecionei projeto `smljzczodssmmlzqesjo`
- [ ] Fui em SQL Editor (menu lateral)
- [ ] Abri o arquivo `database/schema_supabase_completo.sql` no PC
- [ ] Copiei TODO o conteúdo
- [ ] Colei no SQL Editor do Supabase
- [ ] Cliquei em "RUN"
- [ ] Aguardei 10-30 segundos
- [ ] Verifiquei em Table Editor: 10 tabelas criadas ✅

### 6. Testar Aplicação ✅
- [ ] Acessei a URL: `https://_____________________________.onrender.com/`
- [ ] Página carregou corretamente
- [ ] Sem erro 500
- [ ] Interface aparece corretamente

### 7. Verificar Logs 📋
- [ ] No Render Dashboard → Logs
- [ ] Procurei por: "Server running at http://localhost:3000/"
- [ ] Sem erros críticos nos logs

---

## ✅ Deploy Completo!

**URL da Aplicação:** `_______________________________`

**Próximos Passos:**
1. Testar cadastro de clientes
2. Testar criação de faturamentos
3. Configurar domínio customizado (opcional)
4. Configurar backups automáticos

---

## 🆘 Se Algo Deu Errado

### Build Falhou
- Verificar se fez push do `package.json` atualizado
- Verificar logs do Render para mensagem de erro
- Copiar erro completo e me enviar

### App Não Inicia
- Verificar se executou schema SQL no Supabase
- Verificar variáveis de ambiente no Render
- Verificar logs para mensagens de erro

### Erro 403 ou 500
- Verificar conexão com banco de dados
- Verificar se todas as 10 tabelas foram criadas no Supabase
- Verificar variáveis OAUTH_SERVER_URL e VITE_OAUTH_PORTAL_URL

---

**Data do Deploy:** ___/___/______
**Responsável:** _______________________
