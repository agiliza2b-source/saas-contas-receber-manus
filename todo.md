# SaaS de Contas a Receber - TODO

## Fase 1: Modernização da Interface e Navegação
- [x] Atualizar paleta de cores para Agiliza2b no `client/src/index.css`
- [x] Criar componente DashboardLayout com menu lateral retrátil
- [x] Implementar tema claro/escuro com cores personalizadas
- [x] Criar navegação principal com módulos (Clientes, Faturamento, Cobrança, Contas a Receber, Configurações)
- [x] Atualizar App.tsx com rotas para todos os módulos
- [x] Criar página Dashboard com resumo de informações
- [x] Atualizar landing page Home com design moderno

## Fase 2: Módulo de Cadastro de Clientes e Serviços
- [x] Criar schema de banco de dados para `clientes` e `servicos`
- [x] Implementar helpers de banco de dados em `server/db.ts`
- [x] Criar rotas tRPC para CRUD de clientes e serviços
- [x] Implementar integração com API de CEP (ViaCEP)
- [x] Implementar integração com API de CNPJ (BrasilAPI)
- [x] Implementar validação de CPF/CNPJ
- [x] Criar página de cadastro de clientes com busca automática
- [ ] Criar página de cadastro de serviços
- [ ] Implementar busca e filtros para clientes e serviços
- [x] Adicionar testes unitários para validações

## Fase 3: Módulo de Faturamento
- [ ] Criar schema de banco de dados para `faturamentos` e `parcelas`
- [ ] Implementar helpers de banco de dados para faturamento
- [ ] Criar rotas tRPC para CRUD de faturamentos
- [ ] Implementar lógica de cálculo de parcelas
- [ ] Criar página de faturamento com seleção de cliente e serviço
- [ ] Implementar modal de cadastro rápido de cliente/serviço dentro do faturamento
- [ ] Implementar cálculo automático de valor total e parcelas
- [ ] Criar tabela de parcelas com edição individual
- [ ] Implementar rastreamento de envio de e-mail (status: pendente, enviado, recebido, lido)
- [ ] Adicionar testes unitários para cálculos de parcelas

## Fase 4: Módulo de Contas a Receber
- [ ] Criar página de contas a receber com busca avançada
- [ ] Implementar filtros de data (vencidos, a vencer, entre datas, hoje, esta semana, últimos 30 dias, mês atual)
- [ ] Implementar exportação de relatórios (CSV, PDF)
- [ ] Implementar agrupamento de relatórios (por data, cliente, status)
- [ ] Criar visualizações de dados (gráficos de cobranças vencidas vs a vencer)

## Fase 5: Módulo de Cobrança
- [ ] Criar página de cobrança com busca e filtros
- [ ] Implementar seleção em massa com checkboxes
- [ ] Implementar botão "Enviar Faturamento" (apenas para títulos a vencer)
- [ ] Implementar botão "Enviar Cobrança" (apenas para títulos vencidos)
- [ ] Integrar com sistema PIX existente para geração de QR Code
- [ ] Implementar envio de cobrança por cliente com canais configurados
- [ ] Criar página de conciliação de PIX/Boleto
- [ ] Implementar baixa automática de pagamentos (integração bancária)
- [ ] Implementar conciliação manual
- [ ] Adicionar rastreamento de envio de e-mail (status: pendente, enviado, recebido, lido)

## Fase 6: Telas de Configuração
- [ ] Criar página de configurações da empresa (dados, CNPJ, endereço, logo)
- [ ] Criar aba de configuração de SMTP (melhorar existente com tenant_id)
- [ ] Criar aba de configuração de WhatsApp
- [ ] Criar aba de configuração de SMS
- [ ] Criar aba de configuração de conta bancária para conciliação
- [ ] Criar aba de configuração de PIX (melhorar existente com tenant_id)
- [ ] Criar aba de configuração de Boleto
- [ ] Criar aba de configuração de Cartão e Link de Pagamento
- [ ] Criar aba de configuração de formulário de cobrança
- [ ] Implementar validação de credenciais para cada meio de pagamento

## Fase 7: Segurança e Autenticação
- [ ] Implementar autenticação de dois fatores (2FA) com TOTP
- [ ] Implementar notificações de login por e-mail
- [ ] Implementar RBAC (Role-Based Access Control) com permissões granulares
- [ ] Implementar gerenciamento de sessões com invalidação
- [ ] Implementar criptografia de dados sensíveis (chaves PIX, credenciais SMTP)
- [ ] Implementar segregação de dados por tenant (tenant_id em todas as tabelas)
- [ ] Implementar rate limiting nas APIs
- [ ] Implementar logging e monitoramento de atividades

## Fase 8: Banco de Dados Supabase
- [ ] Migrar schema para PostgreSQL (Supabase)
- [ ] Criar tabela de tenants
- [ ] Atualizar tabela de usuários com tenant_id e 2FA
- [ ] Criar todas as tabelas de configuração (empresa, SMTP, WhatsApp, SMS, etc.)
- [ ] Criar tabelas de clientes, serviços, faturamentos e parcelas
- [ ] Criar tabelas de logs de e-mail e conciliação
- [ ] Implementar índices para otimização de consultas
- [ ] Implementar RLS (Row Level Security) para segregação de dados por tenant
- [ ] Testar migrações de dados do MySQL para PostgreSQL

## Fase 9: Testes e Validação
- [ ] Executar testes unitários para todos os módulos
- [ ] Testar fluxo completo de faturamento (criar, enviar, receber, conciliar)
- [ ] Testar integração com APIs externas (CEP, CNPJ, PIX, Boleto)
- [ ] Testar segurança (2FA, segregação de dados, rate limiting)
- [ ] Testar performance com dados em volume
- [ ] Testar responsividade em diferentes dispositivos
- [ ] Testar acessibilidade (WCAG 2.1)

## Fase 10: Entrega Final
- [ ] Documentação completa do sistema
- [ ] Guia de uso para administradores
- [ ] Guia de uso para usuários finais
- [ ] Configuração de backup e recuperação de desastres
- [ ] Deployment em produção
- [ ] Monitoramento e alertas
- [ ] Suporte ao cliente

## Problemas Conhecidos
- (Nenhum por enquanto)

## Notas Importantes
- Manter compatibilidade com o sistema PIX existente
- Implementar multi-tenancy desde o início
- Usar tRPC para todas as comunicações cliente-servidor
- Manter validação rigorosa com Zod
- Usar Tailwind CSS 4 com cores personalizadas da Agiliza2b
- Implementar shadcn/ui para componentes de UI


## Tarefas Adicionais: Máscaras e Validações
- [x] Criar hook customizado useMask para máscaras em tempo real
- [x] Criar componentes de Input com máscaras integradas (CPF, CNPJ, CEP, Telefone, Moeda)
- [x] Implementar validadores avançados para email, URL, moeda
- [x] Aplicar máscaras em formulário de clientes
- [ ] Aplicar máscaras em formulário de faturamento
- [ ] Aplicar máscaras em formulário de configurações
- [x] Adicionar feedback visual de validação em tempo real
- [x] Criar testes para máscaras e validadores (63 testes passando)
