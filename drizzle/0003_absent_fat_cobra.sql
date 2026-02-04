CREATE TABLE `cobrancas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parcela_id` int NOT NULL,
	`faturamento_id` int NOT NULL,
	`cliente_id` int NOT NULL,
	`status` enum('pendente','enviada','recebida','lida','paga','cancelada') DEFAULT 'pendente',
	`data_envio` timestamp,
	`data_recebimento` timestamp,
	`data_leitura` timestamp,
	`canal` enum('email','whatsapp','sms','pix') DEFAULT 'email',
	`tentativas` int DEFAULT 0,
	`proxima_tentativa` timestamp,
	`observacoes` text,
	`ativo` int DEFAULT 1,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cobrancas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conciliacao` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parcela_id` int NOT NULL,
	`faturamento_id` int NOT NULL,
	`cliente_id` int NOT NULL,
	`valor` varchar(20) NOT NULL,
	`data_recebimento` timestamp NOT NULL,
	`forma_pagamento` varchar(50) NOT NULL,
	`referencia` varchar(255),
	`descricao` text,
	`status` enum('pendente','confirmada','rejeitada') DEFAULT 'pendente',
	`observacoes` text,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conciliacao_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `historico_pagamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parcela_id` int NOT NULL,
	`faturamento_id` int NOT NULL,
	`cliente_id` int NOT NULL,
	`valor_pago` varchar(20) NOT NULL,
	`data_pagamento` timestamp NOT NULL,
	`forma_pagamento` varchar(50) NOT NULL,
	`referencia` varchar(255),
	`juros_aplicados` varchar(20) DEFAULT '0',
	`multa_aplicada` varchar(20) DEFAULT '0',
	`desconto_aplicado` varchar(20) DEFAULT '0',
	`observacoes` text,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `historico_pagamentos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logs_email` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cobranca_id` int,
	`faturamento_id` int,
	`parcela_id` int,
	`cliente_id` int,
	`email_destino` varchar(320) NOT NULL,
	`assunto` varchar(255) NOT NULL,
	`corpo` text,
	`status` enum('enviado','falha','bounce','recebido','lido') DEFAULT 'enviado',
	`mensagem_erro` text,
	`data_envio` timestamp NOT NULL DEFAULT (now()),
	`data_recebimento` timestamp,
	`data_leitura` timestamp,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logs_email_id` PRIMARY KEY(`id`)
);
