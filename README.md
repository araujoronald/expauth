<img src="https://github.com/araujoronald/uauth/blob/master/docs/uAUTH-png.png" width="300" />

# uAUTH Experimento

uAUTH é um experimento que visa investigar o comportamento dos usuários finais quando deparados com diferentes métodos de autenticação. 

A versão atual do uAUTH utiliza os seguintes métodos de autenticação: 
* Senha
* Código de Acesso
* Face
* 2FA (Senha e Código de Acesso)

## Componentes:
O projeto está dividido da seguinte forma:

- [API NodeJS e Typescript](/api)
- [Aplicação web](/web)
- [Scripts de banco de dados](/scripts-db)
- [Docs](/docs)


## Docker para inicialização da API e do DB
```bash
$ docker-compose up
```

## Inicialização aplicação web
```bash
$ npm run serve
```