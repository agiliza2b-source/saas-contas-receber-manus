# Configuração do Supabase

Este projeto foi migrado de MySQL para PostgreSQL para ser utilizado com o **Supabase**.

## Passos para Configuração

### 1. Criar Projeto no Supabase
Crie um novo projeto no [Supabase](https://supabase.com/).

### 2. Executar o Schema SQL
No painel do Supabase, vá em **SQL Editor** e execute o conteúdo do arquivo:
`database/schema_completo_corrigido.sql`

Este arquivo criará todas as tabelas, tipos enumerados, índices e triggers necessários.

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (use o `.env.example` como base) e preencha a variável `DATABASE_URL`.

Você pode encontrar a URL de conexão em:
**Project Settings > Database > Connection string > URI**

> **Nota:** Certifique-se de substituir `[YOUR-PASSWORD]` pela senha que você definiu ao criar o projeto.

### 4. Instalar Dependências
Execute o comando para instalar as novas dependências (PostgreSQL):
```bash
pnpm install
```

### 5. Sincronizar Drizzle (Opcional)
Se desejar gerar as migrações do Drizzle:
```bash
pnpm db:push
```

## Alterações Realizadas
- Migração do Schema de MySQL para PostgreSQL.
- Atualização do `drizzle/schema.ts` para usar `pg-core`.
- Atualização do `server/db.ts` para usar o driver `postgres-js`.
- Configuração do `drizzle.config.ts` para dialeto `postgresql`.
- Adição da dependência `postgres` ao `package.json`.
