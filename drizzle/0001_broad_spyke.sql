CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome_completo` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`cpf_cnpj` varchar(18) NOT NULL,
	`telefone` varchar(20),
	`endereco` text,
	`cep` varchar(10),
	`cidade` varchar(100),
	`estado` varchar(2),
	`formas_faturamento` text,
	`ativo` int DEFAULT 1,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`),
	CONSTRAINT `clientes_cpf_cnpj_unique` UNIQUE(`cpf_cnpj`)
);
--> statement-breakpoint
CREATE TABLE `servicos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`descricao` varchar(255) NOT NULL,
	`valor` varchar(20) NOT NULL,
	`ativo` int DEFAULT 1,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `servicos_id` PRIMARY KEY(`id`)
);
