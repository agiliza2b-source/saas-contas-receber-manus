# 🚀 GUIA RÁPIDO DE DEPLOY - SaaS Contas a Receber

## ⚡ Deploy em 5 Minutos

### Passo 1: Configurar Banco de Dados no Supabase

1. **Criar projeto no Supabase**
   - Acesse: https://supabase.com/
   - Clique em "New Project"
   - Anote a senha do banco de dados

2. **Executar o Schema SQL**
   - No painel do Supabase, vá em **SQL Editor**
   - Abra o arquivo `database/schema_supabase_completo.sql`
   - Copie todo o conteúdo
   - Cole no SQL Editor do Supabase
   - Clique em **RUN** para executar

3. **Obter credenciais**
   - Vá em: **Project Settings** > **Database** > **Connection string**
   - Copie a **URI** (Transaction mode)
   - Também copie:
     - **VITE_SUPABASE_URL**: Project Settings > API > Project URL
     - **VITE_SUPABASE_ANON_KEY**: Project Settings > API > anon public

### Passo 2: Configurar Variáveis de Ambiente

Edite o arquivo `.env` na raiz do projeto:

```bash
# Substitua pelos seus valores
DATABASE_URL="postgresql://postgres:SUA-SENHA@db.SEU-PROJETO.supabase.co:5432/postgres"
VITE_SUPABASE_URL="https://SEU-PROJETO.supabase.co"
VITE_SUPABASE_ANON_KEY="SUA-ANON-KEY"

# Gere um JWT Secret seguro:
# Execute: openssl rand -base64 32
JWT_SECRET="cole-o-resultado-aqui"

NODE_ENV="production"
PORT=3000
```

### Passo 3: Instalar e Buildar

```bash
# Instalar dependências
npm install --legacy-peer-deps

# Buildar o projeto
npm run build
```

### Passo 4: Iniciar Aplicação

```bash
# Criar diretório de logs
mkdir -p logs

# Iniciar com PM2
pm2 start ecosystem.config.cjs --only saas-contas-receber

# Verificar status
pm2 list

# Ver logs (se necessário)
pm2 logs saas-contas-receber --nostream
```

### Passo 5: Acessar Aplicação

A aplicação estará disponível em: `http://localhost:3000`

## 🔄 Comandos Úteis

```bash
# Ver status da aplicação
pm2 list

# Reiniciar aplicação
pm2 restart saas-contas-receber

# Parar aplicação
pm2 stop saas-contas-receber

# Ver logs em tempo real
pm2 logs saas-contas-receber

# Remover do PM2
pm2 delete saas-contas-receber

# Limpar porta 3000 (se necessário)
fuser -k 3000/tcp

# Testar conexão
curl http://localhost:3000
```

## 🌍 Deploy em Servidor Remoto

### Opção 1: VPS (DigitalOcean, AWS, etc.)

1. **Conectar no servidor**
```bash
ssh usuario@seu-servidor.com
```

2. **Instalar dependências do sistema**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm git

# Instalar PM2 globalmente
sudo npm install -g pm2
```

3. **Clonar repositório**
```bash
git clone https://github.com/seu-usuario/saas-contas-receber.git
cd saas-contas-receber
```

4. **Configurar .env** (seguir Passo 2 acima)

5. **Instalar e iniciar**
```bash
npm install --legacy-peer-deps
npm run build
pm2 start ecosystem.config.cjs --only saas-contas-receber
pm2 save
pm2 startup
```

6. **Configurar firewall**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

7. **Configurar Nginx como proxy reverso**
```nginx
# /etc/nginx/sites-available/saas-contas-receber
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/saas-contas-receber /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Opção 2: Plataformas Gerenciadas

#### Railway.app
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente
3. Deploy automático

#### Render.com
1. New Web Service
2. Conecte repositório
3. Build command: `npm install --legacy-peer-deps && npm run build`
4. Start command: `npm start`

#### Heroku
1. `heroku create nome-app`
2. Configure variáveis de ambiente no dashboard
3. `git push heroku main`

## 📋 Checklist de Deploy

- [ ] Banco de dados criado no Supabase
- [ ] Schema SQL executado
- [ ] Arquivo .env configurado
- [ ] JWT_SECRET gerado (seguro)
- [ ] Dependências instaladas
- [ ] Build realizado com sucesso
- [ ] Aplicação iniciada com PM2
- [ ] Portas configuradas no firewall
- [ ] HTTPS configurado (produção)
- [ ] Backup do banco configurado
- [ ] Monitoramento configurado

## 🆘 Problemas Comuns

### "DATABASE_URL is required"
- Verifique se o .env existe e está configurado
- Verifique se a URL do banco está correta

### "Port 3000 already in use"
```bash
fuser -k 3000/tcp
pm2 delete all
pm2 start ecosystem.config.cjs
```

### "Cannot find module 'XXX'"
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### "Application crashed"
```bash
pm2 logs saas-contas-receber --err
# Verifique os erros e corrija
pm2 restart saas-contas-receber
```

## 🔐 Segurança em Produção

1. **Alterar JWT_SECRET**
```bash
openssl rand -base64 32
```

2. **Usar HTTPS** (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

3. **Configurar variáveis de ambiente no sistema**
```bash
# Não commitar .env para git
# Usar variáveis de ambiente do servidor
export DATABASE_URL="..."
export JWT_SECRET="..."
```

4. **Backup do banco de dados**
- Configure backups automáticos no Supabase
- Ou crie cronjob para backup manual

## 📊 Monitoramento

```bash
# PM2 Monitoring
pm2 monitor

# Logs em produção
pm2 logs saas-contas-receber --lines 100

# Status dos processos
pm2 status
```

## 🎉 Pronto!

Sua aplicação está no ar! Acesse e comece a usar.

Para suporte, consulte o README.md principal ou abra uma issue no GitHub.
