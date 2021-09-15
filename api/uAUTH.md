
# uAUTH Experimento

Experimento de autenticação que investiga o comportamento dos usuários quando deparados com diferentes métodos de autenticação. São observados os comportamentos relativos a experiência de uso, segurança e privacidade.

### / hello
verificação da disponibilidade da API

```bash
Method: GET
Type: 
URL: localhost:3000/auth/hello/
```

### / info
Recupera informações sobre um determinado link de autenticação

```bash
Method: GET
Type: 
URL: localhost:3000/auth/info/:codigoLink
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| codigoLink |  código que identifica uma solicitação de autenticação |


### / inicializar-usuario
Indica o usuário como inicializado no experimento.

```bash
Method: PUT
Type: 
URL: localhost:3000/auth/usuario/inicializar/:idUsuario
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idUsuario |  identificador do usuário |


### / notificacao

Notifica os usuários que possuem autenticações pendentes para o turno informado.
As notificações são realizadas via SMS e contém o a URL para acesso a uma determinada autenticação.

```bash
Method: GET
Type: 
URL: localhost:3000/auth/notificacao/:turnoEnvio
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| turnoEnvio |  Turno de envio da mensagem. Assume os valores MANHA e TARDE |


### / notificar-usuario

Notifica os usuários via SMS que o experimento esta próximo de ser iniciado.
Os usuários só serão notificados uma única vez.

```bash
Method: PUT
Type: 
URL: localhost:3000/auth/usuario/notificar
```

### / usuario-config
Efetua o cadastro de um usuário no experimento e gera entradas na tabela de autenticações de acordo com a configuração de tipos de autenticações e quantidade.

```bash
Method: POST
URL: localhost:3000/auth/usuario/config
```

***Cabeçalhos:***

| Nome |  Descrição |
| --- | -------------|
| Authorization |  token de autorização para realizar a ação |


***Corpo:***

```js        
{
    "usuario": {
        "nome": "Brasiliano Ficticio da Silva",
        "cpf": "48379975030",
        "celular": "99999999999",
        "area_atuacao": "TI",
        "autenticacoes": {
            "tipos": ["SENHA", "CODIGO_ACESSO", "FACE", "SENHA_CODIGO_ACESSO"],
            "quantidade": 2
        }
    }
}
```



### / auth-2fa-1-password

Realiza a a primeira parte da autenticação com duplo fator de autenticação.
A primeira validação é realizada utilizando senha

```bash
Method: PUT
URL: localhost:3000/auth/2fa/password/:idUsuario/:idAutenticacao
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idUsuario |  Identificador do usuário |
| idAutenticacao |  Identificador da autenticação em curso |

***Corpo:***
```js        
{
    "cpf": "48379975030",
    "senha": "Abcd1234@"
}
```

### / auth-2fa-2-otp

Realiza a segunda parte da autenticação com duplo fator de autenticação.
A segunda validação é realizada utilizando código de acesso

```bash
Method: PUT
URL: localhost:3000/auth/2fa/otp/:idUsuario/:idAutenticacao
```

***Parâmetros:***

| Nome |  Descrição |
| --- |-------------|
| idUsuario |  Identificador do usuário |
| idAutenticacao |  Identificador da autenticação em curso |

***Corpo:***
```js        
{
    "otp": "823915"
}
```



### / auth-facial
Realiza a autenticação utilizando a face do usuário

```bash
Method: PUT
URL: localhost:3000/auth/facial/:idUsuario
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idUsuario |  Identificador do usuário |

***Corpo:***

```js        
{
    "cpf": "00801812526"
}
```

### / auth-otp

Realiza a autenticação do usuário utilizando código de acesso

```bash
Method: PUT
URL: localhost:3000/auth/otp/:idUsuario/:idAutenticacao
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idUsuario |  Identificador do usuário |
| idAutenticacao |  Identificador da autenticação em curso |

***Corpo:***
```js        
{
    "otp": "823915"
}
```

### / auth-password
Realiza a autenticação de um usuário utilizando senha

```bash
Method: PUT
URL: localhost:3000/auth/password/:idUsuario/:idAutenticacao
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idUsuario |  Identificador do usuário |
| idAutenticacao |  Identificador da autenticação em curso |

***Corpo:***
```js        
{
    "cpf": "48379975030",
    "senha": "Abcd1234@"
}
```

### / config-password
Define/Redefine a senha do usuário em questão

```bash
Method: PUT
URL: localhost:3000/auth/config/password/:idUsuario/:idAutenticacao
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idUsuario |  Identificador do usuário |
| idAutenticacao |  Identificador da autenticação em curso |

***Corpo:***
```js        
{
    "password": "Abcd1234@"
}
```

### / enviar-otp
Gera o código de acesso para o usuário e encaminha via SMS

```bash
Method: GET
URL: localhost:3000/auth/otp/:idUsuario/:cpf
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idUsuario |  Identificador do usuário |
| cpf |  CPF do usuário |

### / feedback

Registra a avaliação do usuário com relação a autenticação.
A duração é registrada em millissegundos

```bash
Method: PUT
URL: localhost:3000/auth/feedback/:idAutenticacao
```

***Parâmetros:***

| Nome |  Descrição |
| --- | -------------|
| idAutenticacao |  Identificador da autenticação em curso |

***Corpo:***
```js        
{
    "avaliacao": "5",
    "duracao": "10000"
}
```