@echo off
REM ============================================================================
REM SCRIPT DE INSTALAÇÃO AUTOMÁTICA - SaaS Contas a Receber (Windows)
REM ============================================================================

echo ========================================================================
echo      SaaS Contas a Receber - Instalacao Automatica (Windows)
echo ========================================================================
echo.

REM Verificar Node.js
echo Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao encontrado!
    echo Instale Node.js 18+ em: https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js encontrado: 
node -v
echo.

REM Verificar npm
echo Verificando npm...
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] npm nao encontrado!
    pause
    exit /b 1
)
echo [OK] npm encontrado:
npm -v
echo.

REM Verificar PM2
echo Verificando PM2...
pm2 -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] PM2 nao encontrado. Instalando globalmente...
    npm install -g pm2
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar PM2
        pause
        exit /b 1
    )
    echo [OK] PM2 instalado
) else (
    echo [OK] PM2 encontrado:
    pm2 -v
)
echo.

REM Verificar .env
echo Verificando configuracao...
if not exist ".env" (
    echo [AVISO] Arquivo .env nao encontrado!
    if exist ".env.example" (
        echo Copiando .env.example para .env...
        copy .env.example .env
        echo.
        echo [ATENCAO] Configure o arquivo .env com suas credenciais!
        echo.
        echo Edite o arquivo .env e configure:
        echo   - DATABASE_URL (URL do Supabase^)
        echo   - VITE_SUPABASE_URL
        echo   - VITE_SUPABASE_ANON_KEY
        echo   - JWT_SECRET
        echo.
        pause
    ) else (
        echo [ERRO] Arquivo .env.example nao encontrado!
        pause
        exit /b 1
    )
) else (
    echo [OK] Arquivo .env encontrado
)
echo.

REM Criar diretórios
echo Criando diretorios...
if not exist "logs" mkdir logs
if not exist "dist" mkdir dist
echo [OK] Diretorios criados
echo.

REM Instalar dependências
echo Instalando dependencias...
echo Isso pode levar alguns minutos...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)
echo [OK] Dependencias instaladas
echo.

REM Build
echo Compilando aplicacao...
echo Isso pode levar alguns minutos...
call npm run build
if %errorlevel% neq 0 (
    echo [ERRO] Falha no build
    pause
    exit /b 1
)
echo [OK] Build concluido
echo.

REM Parar aplicação existente
echo Parando aplicacao existente (se houver^)...
pm2 delete saas-contas-receber >nul 2>&1
echo [OK] Aplicacao anterior removida
echo.

REM Iniciar aplicação
echo Iniciando aplicacao com PM2...
pm2 start ecosystem.config.cjs --only saas-contas-receber
if %errorlevel% neq 0 (
    echo [ERRO] Falha ao iniciar aplicacao
    pause
    exit /b 1
)
echo [OK] Aplicacao iniciada
echo.

REM Salvar configuração PM2
echo Salvando configuracao PM2...
pm2 save
echo [OK] Configuracao salva
echo.

REM Aguardar inicialização
echo Aguardando inicializacao...
timeout /t 3 /nobreak >nul
echo.

REM Verificar status
echo Verificando aplicacao...
pm2 list | findstr "saas-contas-receber" | findstr "online" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Aplicacao rodando com sucesso!
) else (
    echo [ERRO] Erro ao iniciar aplicacao
    echo Verifique os logs com: pm2 logs saas-contas-receber
    pause
    exit /b 1
)
echo.

echo ========================================================================
echo                      INSTALACAO CONCLUIDA!
echo ========================================================================
echo.
echo Aplicacao disponivel em: http://localhost:3000
echo.
echo Comandos uteis:
echo   pm2 list                           - Ver status
echo   pm2 logs saas-contas-receber       - Ver logs
echo   pm2 restart saas-contas-receber    - Reiniciar
echo   pm2 stop saas-contas-receber       - Parar
echo.
echo [IMPORTANTE]
echo   1. Execute o schema SQL no Supabase
echo   2. Verifique se as tabelas foram criadas
echo   3. Configure um usuario de teste se necessario
echo.
echo Documentacao:
echo   - README.md                        - Documentacao completa
echo   - DEPLOY.md                        - Guia de deploy
echo   - IMPORTANTE-LEIA-PRIMEIRO.md      - Configuracao do banco
echo.
echo Tudo pronto para uso!
echo.
pause
