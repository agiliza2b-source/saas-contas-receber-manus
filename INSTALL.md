# 📦 GUIA DE INSTALAÇÃO E DEPLOY

## 🚀 Instalação Rápida (Recomendado)

### Linux/Mac
```bash
# 1. Extrair o arquivo ZIP
unzip saas-contas-receber.zip
cd saas-contas-receber

# 2. Executar instalador automático
chmod +x install.sh
./install.sh
```

### Windows
```cmd
# 1. Extrair o arquivo ZIP
# 2. Abrir PowerShell ou CMD na pasta extraída
# 3. Executar:
install.bat
```

O script instalador irá:
- ✅ Verificar Node.js e npm
- ✅ Instalar PM2 (se necessário)
- ✅ Instalar dependências
- ✅ Fazer build da aplicação
- ✅ Iniciar o servidor
- ✅ Configurar auto-start

---

## 📋 Instalação Manual

### Pré-requisitos
- Node.js 18+ ([Download](https://nodejs.org/))
- npm (incluído com Node.js)
- Git (opcional)

### Passo a Passo

#### 1. Configurar Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env e configurar:
# - DATABASE_URL (do Supabase)
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - JWT_SECRET (gerar com: openssl rand -base64 32)
```

#### 2. Instalar Dependências
```bash
npm install --legacy-peer-deps
```

#### 3. Configurar Banco de Dados
1. Acesse [Supabase](https://supabase.com/)
2. Vá em SQL Editor
3. Execute `database/schema_supabase_completo.sql`
4. Verifique se as 10 tabelas foram criadas

#### 4. Build da Aplicação
```bash
npm run build
```

#### 5. Iniciar Aplicação

**Desenvolvimento:**
```bash
npm run dev
```

**Produção (com PM2):**
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start ecosystem.config.cjs --only saas-contas-receber

# Salvar configuração
pm2 save

# Configurar auto-start
pm2 startup
```

**Produção (sem PM2):**
```bash
npm start
```

#### 6. Acessar Aplicação
Abra no navegador: `http://localhost:3000`

---

## 🌍 Deploy em Servidor

### VPS (DigitalOcean, AWS, Linode, etc.)

#### 1. Conectar ao Servidor
```bash
ssh usuario@seu-servidor.com
```

#### 2. Instalar Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node -v
npm -v
```

#### 3. Clonar/Enviar Projeto
```bash
# Opção 1: Via Git
git clone https://github.com/seu-usuario/saas-contas-receber.git
cd saas-contas-receber

# Opção 2: Via SCP (do seu computador)
scp -r saas-contas-receber usuario@servidor:/home/usuario/
```

#### 4. Executar Instalador
```bash
chmod +x install.sh
./install.sh
```

#### 5. Configurar Nginx (Proxy Reverso)
```bash
# Instalar Nginx
sudo apt install nginx

# Criar configuração
sudo nano /etc/nginx/sites-available/saas-contas-receber
```

Conteúdo do arquivo:
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Ativar site
sudo ln -s /etc/nginx/sites-available/saas-contas-receber /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx
```

#### 6. Configurar HTTPS (Let's Encrypt)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com

# Renovação automática (já configurado)
sudo certbot renew --dry-run
```

#### 7. Configurar Firewall
```bash
# Permitir portas
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# Ativar firewall
sudo ufw enable
```

---

## 🐳 Deploy com Docker

### Criar Dockerfile
Já incluído no projeto: `Dockerfile`

### Build e Run
```bash
# Build da imagem
docker build -t saas-contas-receber .

# Executar container
docker run -d \
  --name saas-contas-receber \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  saas-contas-receber

# Ver logs
docker logs -f saas-contas-receber
```

### Docker Compose
```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

---

## ☁️ Deploy em Plataformas Cloud

### Railway.app
1. Conecte seu repositório GitHub
2. Configure variáveis de ambiente (Settings > Variables)
3. Deploy automático

### Render.com
1. New Web Service
2. Conecte repositório
3. Build command: `npm install --legacy-peer-deps && npm run build`
4. Start command: `npm start`
5. Configure environment variables

### Heroku
```bash
# Login
heroku login

# Criar app
heroku create nome-do-app

# Configurar variáveis
heroku config:set DATABASE_URL="sua-url"
heroku config:set VITE_SUPABASE_URL="sua-url"
heroku config:set VITE_SUPABASE_ANON_KEY="sua-key"
heroku config:set JWT_SECRET="seu-secret"

# Deploy
git push heroku main
```

### Vercel (Frontend + Serverless)
```bash
# Instalar CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis no dashboard
```

---

## 🔧 Manutenção

### Atualizar Aplicação
```bash
# Parar aplicação
pm2 stop saas-contas-receber

# Atualizar código (se usar git)
git pull origin main

# Reinstalar dependências (se necessário)
npm install --legacy-peer-deps

# Rebuild
npm run build

# Reiniciar
pm2 restart saas-contas-receber
```

### Backup do Banco de Dados
```bash
# Via Supabase Dashboard
# Settings > Database > Backups

# Ou via CLI
pg_dump $DATABASE_URL > backup.sql
```

### Ver Logs
```bash
# PM2
pm2 logs saas-contas-receber

# Arquivos de log
tail -f logs/out.log
tail -f logs/error.log
```

### Monitoramento
```bash
# Status PM2
pm2 status

# Monitoramento em tempo real
pm2 monit
```

---

## 🆘 Troubleshooting

### Porta em uso
```bash
# Linux/Mac
fuser -k 3000/tcp

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Erro ao instalar dependências
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json

# Reinstalar
npm install --legacy-peer-deps
```

### PM2 não inicia no boot
```bash
# Reconfigurar
pm2 unstartup
pm2 startup
pm2 save
```

### Aplicação não responde
```bash
# Ver logs
pm2 logs saas-contas-receber --err

# Reiniciar
pm2 restart saas-contas-receber

# Se necessário, rebuild
npm run build
pm2 restart saas-contas-receber
```

---

## 📞 Suporte

Para mais informações:
- **README.md** - Documentação completa
- **DEPLOY.md** - Guia de deploy detalhado
- **IMPORTANTE-LEIA-PRIMEIRO.md** - Setup do banco de dados

---

Criado em: 2026-02-04  
Versão: 1.0.0
