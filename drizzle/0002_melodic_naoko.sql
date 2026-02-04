CREATE TABLE `faturamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cliente_id` int NOT NULL,
	`numero` varchar(50) NOT NULL,
	`descricao` text,
	`data_emissao` timestamp NOT NULL DEFAULT (now()),
	`data_vencimento` timestamp NOT NULL,
	`valor_total` varchar(20) NOT NULL,
	`status` enum('pendente','parcial','pago','vencido','cancelado') DEFAULT 'pendente',
	`tipo_parcela` enum('unica','parcelado','recorrente') DEFAULT 'unica',
	`quantidade_parcelas` int DEFAULT 1,
	`juros_ao_mes` varchar(10),
	`desconto` varchar(20),
	`observacoes` text,
	`ativo` int DEFAULT 1,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faturamentos_id` PRIMARY KEY(`id`),
	CONSTRAINT `faturamentos_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `itens_faturamento` (
	`id` int AUTO_INCREMENT NOT NULL,
	`faturamento_id` int NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`quantidade` varchar(20) NOT NULL,
	`valor_unitario` varchar(20) NOT NULL,
	`valor_total` varchar(20) NOT NULL,
	`ativo` int DEFAULT 1,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `itens_faturamento_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parcelas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`faturamento_id` int NOT NULL,
	`numero_parcela` int NOT NULL,
	`data_vencimento` timestamp NOT NULL,
	`valor` varchar(20) NOT NULL,
	`juros` varchar(20) DEFAULT '0',
	`multa` varchar(20) DEFAULT '0',
	`desconto` varchar(20) DEFAULT '0',
	`valor_pago` varchar(20) DEFAULT '0',
	`data_pagamento` timestamp,
	`forma_pagamento` varchar(50),
	`status` enum('pendente','pago','vencido','cancelado') DEFAULT 'pendente',
	`chave_pix` varchar(255),
	`codigo_barras` varchar(50),
	`ativo` int DEFAULT 1,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parcelas_id` PRIMARY KEY(`id`)
);
