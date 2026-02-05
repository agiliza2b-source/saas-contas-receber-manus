# ⚠️ ATENÇÃO - AÇÃO NECESSÁRIA!

## 🔴 BANCO DE DADOS NÃO CONFIGURADO

A aplicação está rodando, mas o **banco de dados ainda não foi configurado**. Você precisa executar o schema SQL no Supabase.

---

## 📋 PASSOS OBRIGATÓRIOS (AGORA!)

### 1️⃣ **Executar Schema SQL no Supabase** 

**Este é o passo MAIS IMPORTANTE!**

1. Acesse seu projeto no Supabase: https://supabase.com/
   - Projeto: `smljzczodssmmlzqesjo`

2. No painel esquerdo, clique em **SQL Editor**

3. Abra o arquivo no seu projeto:
   ```
   database/schema_supabase_completo.sql
   ```

4. **Copie TODO o conteúdo** do arquivo

5. **Cole no SQL Editor** do Supabase

6. Clique no botão **RUN** (ou pressione Ctrl+Enter)

7. Aguarde a execução (pode levar 10-30 segundos)

8. Você deve ver mensagens de sucesso, como:
   ```
   Success. No rows returned
   ```

---

### 2️⃣ **Verificar se o Schema foi Criado**

Após executar o SQL, vá em **Table Editor** no Supabase e verifique se as seguintes tabelas foram criadas:

- ✅ users
- ✅ clientes
- ✅ servicos
- ✅ faturamentos
- ✅ parcelas
- ✅ itens_faturamento
- ✅ cobrancas
- ✅ logs_email
- ✅ conciliacao
- ✅ historico_pagamentos

---

### 3️⃣ **Criar Usuário de Teste (Opcional)**

Para testar sem OAuth, você pode criar um usuário diretamente:

1. No **SQL Editor** do Supabase, execute:

```sql
-- Criar usuário de teste
INSERT INTO users (open_id, name, email, role) 
VALUES ('test-user-001', 'Usuário Teste', 'teste@example.com', 'admin')
ON CONFLICT (open_id) DO NOTHING;
```

---

## 🌐 URL DA APLICAÇÃO

**Acesso Online**: https://3000-i1yoktaqj8ap81lploal1-0e616f0a.sandbox.novita.ai/

---

## ❓ POR QUE PRECISO FAZER ISSO?

O Supabase é um banco de dados PostgreSQL gerenciado na nuvem. Ele vem vazio por padrão. O arquivo `schema_supabase_completo.sql` contém todas as instruções SQL para:

1. Criar as tabelas
2. Definir relacionamentos
3. Criar índices para performance
4. Criar triggers para automações
5. Criar views para relatórios
6. Configurar permissões

**Sem executar o schema, a aplicação não conseguirá:**
- ❌ Cadastrar clientes
- ❌ Criar faturamentos
- ❌ Gerenciar parcelas
- ❌ Enviar cobranças
- ❌ Fazer qualquer operação no banco

---

## ✅ STATUS ATUAL

```
✅ Aplicação compilada e rodando
✅ Servidor Express funcionando
✅ Frontend carregando
✅ PM2 gerenciando o processo
⚠️  BANCO DE DADOS NÃO CONFIGURADO (AÇÃO NECESSÁRIA!)
```

---

## 🆘 SE TIVER PROBLEMAS

### Erro ao executar SQL no Supabase

Se der erro ao executar o SQL, pode ser que algumas tabelas já existam. Neste caso:

1. Abra o SQL Editor
2. Execute para limpar:
```sql
DROP TABLE IF EXISTS historico_pagamentos CASCADE;
DROP TABLE IF EXISTS conciliacao CASCADE;
DROP TABLE IF EXISTS logs_email CASCADE;
DROP TABLE IF EXISTS cobrancas CASCADE;
DROP TABLE IF EXISTS itens_faturamento CASCADE;
DROP TABLE IF EXISTS parcelas CASCADE;
DROP TABLE IF EXISTS faturamentos CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;
DROP TABLE IF EXISTS servicos CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

3. Depois execute o `schema_supabase_completo.sql` novamente

---

### Não consigo acessar o Supabase

Verifique se você tem acesso ao projeto:
- URL: https://smljzczodssmmlzqesjo.supabase.co
- Se não tiver acesso, você precisa criar um novo projeto Supabase

---

### Como criar novo projeto Supabase (se necessário)

1. Acesse: https://supabase.com/
2. Clique em "New Project"
3. Escolha um nome e senha
4. Aguarde a criação (2-3 minutos)
5. Copie as novas credenciais:
   - Database URL
   - Project URL
   - Anon Key
6. Atualize o arquivo `.env` com as novas credenciais
7. Execute o schema SQL no novo projeto
8. Rebuild: `npm run build`
9. Reinicie: `pm2 restart saas-contas-receber`

---

## 📞 PRÓXIMOS PASSOS

1. ✅ Execute o schema SQL no Supabase (AGORA!)
2. ✅ Verifique se as tabelas foram criadas
3. ✅ Acesse a aplicação e teste
4. ✅ Caso necessário, crie um usuário de teste

**Depois disso, a aplicação estará 100% funcional!** 🎉

---

Criado em: 2026-02-04  
Status: Aguardando configuração do banco de dados
