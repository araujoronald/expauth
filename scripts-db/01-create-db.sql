DROP DATABASE IF EXISTS expauth;
CREATE DATABASE expauth;
\c expauth;

CREATE SCHEMA IF NOT EXISTS public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA public;


CREATE TABLE public.autenticacoes (
	id uuid NOT NULL, -- Identificador único
	tipo varchar(20) NOT NULL, -- Método de autenticação utilizado:¶SENHA¶CODIGO_ACESSO¶SENHA_CODIGO_ACESSO¶FACE
	codigo_link varchar(255) NOT NULL, -- Código aleatório composto por 6 caracteres e sufixo do link de acesso para autenticação
	avaliacao int4 NULL, -- Avaliação do usuário final com relação a experiência de uso
	"data" timestamp(0) NULL, -- Momento em que foi realizada a autenticação
	id_usuario uuid NOT NULL, -- Identificador do usuário que realizou a autenticação
	pendente bool NULL, -- Autenticação ainda não realizada
	duracao varchar(20) NULL, -- Duração em milisegundos do processo de autenticação
	turno_preferencial varchar(20) NOT NULL, -- Turno preferêncial para notificação automática:¶MANHA¶TARDE
	qtd_falha_credencial int4 NULL, -- Quantidade de falhas de acesso devido a credencial incorreta
	qtd_recuperacao_credencial int4 NULL, -- Quantidade de vezes que o usuário acionou o mecanismo de recuperação da credencial
	avaliacao_seguranca int4 NULL, -- Avaliação do usuário final com relação a segurança
	avaliacao_privacidade int4 NULL -- Avaliação do usuário final com relação a privacidade
);

COMMENT ON TABLE public.autenticacoes IS 'Registra as autenticações únicas a serem realizadas no experimento';

COMMENT ON COLUMN public.autenticacoes.id IS 'Identificador único';
COMMENT ON COLUMN public.autenticacoes.tipo IS 'Método de autenticação utilizado:
SENHA
CODIGO_ACESSO
SENHA_CODIGO_ACESSO
FACE';
COMMENT ON COLUMN public.autenticacoes.codigo_link IS 'Código aleatório composto por 6 caracteres e sufixo do link de acesso para autenticação';
COMMENT ON COLUMN public.autenticacoes.avaliacao IS 'Avaliação do usuário final com relação a experiência de uso';
COMMENT ON COLUMN public.autenticacoes."data" IS 'Momento em que foi realizada a autenticação';
COMMENT ON COLUMN public.autenticacoes.id_usuario IS 'Identificador do usuário que realizou a autenticação';
COMMENT ON COLUMN public.autenticacoes.pendente IS 'Autenticação ainda não realizada';
COMMENT ON COLUMN public.autenticacoes.duracao IS 'Duração em milisegundos do processo de autenticação';
COMMENT ON COLUMN public.autenticacoes.turno_preferencial IS 'Turno preferêncial para notificação automática:
MANHA
TARDE';
COMMENT ON COLUMN public.autenticacoes.qtd_falha_credencial IS 'Quantidade de falhas de acesso devido a credencial incorreta';
COMMENT ON COLUMN public.autenticacoes.qtd_recuperacao_credencial IS 'Quantidade de vezes que o usuário acionou o mecanismo de recuperação da credencial';
COMMENT ON COLUMN public.autenticacoes.avaliacao_seguranca IS 'Avaliação do usuário final com relação a segurança';
COMMENT ON COLUMN public.autenticacoes.avaliacao_privacidade IS 'Avaliação do usuário final com relação a privacidade';


-- public.autenticacoes foreign keys
ALTER TABLE public.autenticacoes ADD CONSTRAINT autenticacoes_fk FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE;


CREATE TABLE public.usuarios (
	id uuid NOT NULL, -- Identificador único
	nome varchar(60) NOT NULL, -- Nome do participante
	cpf varchar(11) NOT NULL, -- CPF do participante
	celular varchar(11) NOT NULL, -- Celular do participante
	senha varchar(255) NULL, -- Senha definida pelo participante na primeira interação que envolva senha ou na redefinição de senha. Pode ser uma autenticação do tipo SENHA ou CODIGO_ACESSO_SENHA
	area_atuacao varchar(40) NOT NULL, -- Área de atuação do participante.¶TI¶OUTRAS
	inicializado bool NULL, -- Indica que o participante já iniciou sua participação com aceitação do TCLA
	notificado bool NULL -- Indica que o participante já foi notificado da proximidade do início do experimento
);

-- Column comments
COMMENT ON COLUMN public.usuarios.id IS 'Identificador único';
COMMENT ON COLUMN public.usuarios.nome IS 'Nome do participante';
COMMENT ON COLUMN public.usuarios.cpf IS 'CPF do participante';
COMMENT ON COLUMN public.usuarios.celular IS 'Celular do participante';
COMMENT ON COLUMN public.usuarios.senha IS 'Senha definida pelo participante na primeira interação que envolva senha ou na redefinição de senha. Pode ser uma autenticação do tipo SENHA ou CODIGO_ACESSO_SENHA';
COMMENT ON COLUMN public.usuarios.area_atuacao IS 'Área de atuação do participante.
TI
OUTRAS';
COMMENT ON COLUMN public.usuarios.inicializado IS 'Indica que o participante já iniciou sua participação com aceitação do TCLA';
COMMENT ON COLUMN public.usuarios.notificado IS 'Indica que o participante já foi notificado da proximidade do início do experimento';

ALTER TABLE ONLY public.autenticacoes
    ADD CONSTRAINT autenticacoes_pk PRIMARY KEY (id);

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuario_pk PRIMARY KEY (id);

CREATE UNIQUE INDEX usuario_cpf_idx ON public.usuarios USING btree (cpf);

ALTER TABLE ONLY public.autenticacoes
    ADD CONSTRAINT autenticacoes_fk FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE CASCADE;