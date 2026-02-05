#!/bin/bash

# ============================================================================
# SCRIPT DE INSTALAÇÃO AUTOMÁTICA - SaaS Contas a Receber
# ============================================================================
# Este script instala e configura automaticamente a aplicação
# ============================================================================

set -e  # Parar em caso de erro

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     SaaS Contas a Receber - Instalação Automática             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado!${NC}"
    echo "Instale Node.js 18+ em: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js versão 18+ necessária. Você tem: $(node -v)${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v) encontrado${NC}"

# Verificar npm
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) encontrado${NC}"

# Verificar PM2
echo "📦 Verificando PM2..."
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 não encontrado. Instalando globalmente...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 instalado${NC}"
else
    echo -e "${GREEN}✅ PM2 $(pm2 -v) encontrado${NC}"
fi

# Verificar .env
echo ""
echo "🔧 Verificando configuração..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado!${NC}"
    
    if [ -f ".env.example" ]; then
        echo "📝 Copiando .env.example para .env..."
        cp .env.example .env
        echo -e "${YELLOW}⚠️  ATENÇÃO: Configure o arquivo .env com suas credenciais!${NC}"
        echo ""
        echo "Edite o arquivo .env e configure:"
        echo "  - DATABASE_URL (URL do Supabase)"
        echo "  - VITE_SUPABASE_URL"
        echo "  - VITE_SUPABASE_ANON_KEY"
        echo "  - JWT_SECRET (gere com: openssl rand -base64 32)"
        echo ""
        read -p "Pressione ENTER após configurar o .env..." 
    else
        echo -e "${RED}❌ Arquivo .env.example não encontrado!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Arquivo .env encontrado${NC}"
fi

# Verificar DATABASE_URL
if grep -q "postgresql://postgres:\[SUA-SENHA\]" .env 2>/dev/null; then
    echo -e "${RED}❌ DATABASE_URL não configurada no .env!${NC}"
    echo "Configure suas credenciais do Supabase no arquivo .env"
    exit 1
fi

# Criar diretórios necessários
echo ""
echo "📁 Criando diretórios..."
mkdir -p logs
mkdir -p dist
echo -e "${GREEN}✅ Diretórios criados${NC}"

# Instalar dependências
echo ""
echo "📦 Instalando dependências..."
echo "Isso pode levar alguns minutos..."
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Dependências instaladas${NC}"

# Build da aplicação
echo ""
echo "🔨 Compilando aplicação..."
echo "Isso pode levar alguns minutos..."
npm run build
echo -e "${GREEN}✅ Build concluído${NC}"

# Limpar porta 3000
echo ""
echo "🧹 Limpando porta 3000..."
fuser -k 3000/tcp 2>/dev/null || true
echo -e "${GREEN}✅ Porta 3000 liberada${NC}"

# Parar aplicação existente
echo ""
echo "🛑 Parando aplicação existente (se houver)..."
pm2 delete saas-contas-receber 2>/dev/null || true
echo -e "${GREEN}✅ Aplicação anterior removida${NC}"

# Iniciar aplicação
echo ""
echo "🚀 Iniciando aplicação com PM2..."
pm2 start ecosystem.config.cjs --only saas-contas-receber
echo -e "${GREEN}✅ Aplicação iniciada${NC}"

# Salvar configuração PM2
echo ""
echo "💾 Salvando configuração PM2..."
pm2 save
echo -e "${GREEN}✅ Configuração salva${NC}"

# Configurar PM2 para iniciar no boot
echo ""
echo "🔄 Configurando PM2 para iniciar no boot..."
pm2 startup > /dev/null 2>&1 || true
echo -e "${GREEN}✅ PM2 configurado para auto-start${NC}"

# Verificar se está rodando
echo ""
echo "🔍 Verificando aplicação..."
sleep 3

if pm2 list | grep -q "saas-contas-receber.*online"; then
    echo -e "${GREEN}✅ Aplicação rodando com sucesso!${NC}"
    
    # Testar endpoint
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Servidor respondendo na porta 3000${NC}"
    else
        echo -e "${YELLOW}⚠️  Servidor não está respondendo ainda. Aguarde alguns segundos...${NC}"
    fi
else
    echo -e "${RED}❌ Erro ao iniciar aplicação${NC}"
    echo "Verifique os logs com: pm2 logs saas-contas-receber"
    exit 1
fi

# Mostrar informações
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    INSTALAÇÃO CONCLUÍDA! 🎉                     ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Aplicação disponível em: http://localhost:3000"
echo ""
echo "📋 Comandos úteis:"
echo "  pm2 list                           - Ver status"
echo "  pm2 logs saas-contas-receber       - Ver logs"
echo "  pm2 restart saas-contas-receber    - Reiniciar"
echo "  pm2 stop saas-contas-receber       - Parar"
echo ""
echo "⚠️  IMPORTANTE:"
echo "  1. Execute o schema SQL no Supabase (database/schema_supabase_completo.sql)"
echo "  2. Verifique se as tabelas foram criadas"
echo "  3. Configure um usuário de teste se necessário"
echo ""
echo "📚 Documentação:"
echo "  - README.md                        - Documentação completa"
echo "  - DEPLOY.md                        - Guia de deploy"
echo "  - IMPORTANTE-LEIA-PRIMEIRO.md      - Configuração do banco"
echo ""
echo -e "${GREEN}✨ Tudo pronto para uso!${NC}"
