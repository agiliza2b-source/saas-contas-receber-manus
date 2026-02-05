# Usar Node.js 20 Alpine para menor tamanho
FROM node:20-alpine AS builder

# Instalar dependências de build
RUN apk add --no-cache python3 make g++

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Instalar dependências
RUN npm install --legacy-peer-deps --production=false

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# ============================================================================
# Imagem de produção
# ============================================================================
FROM node:20-alpine

# Instalar PM2 globalmente
RUN npm install -g pm2

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e instalar apenas dependências de produção
COPY package*.json ./
RUN npm install --legacy-peer-deps --production

# Copiar build da etapa anterior
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nodejs:nodejs /app/shared ./shared
COPY --from=builder --chown=nodejs:nodejs /app/ecosystem.config.cjs ./

# Criar diretório de logs
RUN mkdir -p logs && chown -R nodejs:nodejs logs

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 3000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Iniciar com PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs", "--only", "saas-contas-receber"]
