// ============================================================================
// PM2 ECOSYSTEM CONFIG - SaaS Contas a Receber
// ============================================================================
// Configuração para gerenciar a aplicação com PM2
// Uso: pm2 start ecosystem.config.cjs
// ============================================================================

module.exports = {
  apps: [
    {
      // PRODUÇÃO - Servidor compilado
      name: 'saas-contas-receber',
      script: 'dist/index.js',
      cwd: '/home/user/webapp',
      instances: 1,
      exec_mode: 'fork',
      
      // Variáveis de ambiente
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Auto restart
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Logs
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Restart policies
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Kill timeout
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    
    {
      // DESENVOLVIMENTO - Servidor com watch mode
      name: 'saas-contas-receber-dev',
      script: 'tsx',
      args: 'watch server/_core/index.ts',
      cwd: '/home/user/webapp',
      instances: 1,
      exec_mode: 'fork',
      
      // Variáveis de ambiente para desenvolvimento
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      
      // Watch desabilitado pois tsx já faz watch
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // Logs
      error_file: './logs/dev-error.log',
      out_file: './logs/dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // Restart policies
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Kill timeout
      kill_timeout: 5000
    }
  ],

  // Configurações de deploy (opcional)
  deploy: {
    production: {
      user: 'deploy',
      host: 'seu-servidor.com',
      ref: 'origin/main',
      repo: 'git@github.com:seu-usuario/saas-contas-receber.git',
      path: '/var/www/saas-contas-receber',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': ''
    }
  }
};
