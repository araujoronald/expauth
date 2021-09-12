# Título

Código Único

## Status

Implementado

## Contexto

A necessidade de autenticação do usuário utilizando um código de acesso único. A abordagem mais observada é a de utilização de um código OTP (One-Time Password), porém existem outras abordagens que são mais simples e que não observam as RFCs que definem os dois tipos de OTP: HOTP (RFC 4226) e TOTP (RFC 6238)

## Decisão

Utilizar uma implementação de TOTP e que siga as restrições impostas na RFC 6238. Um ponto de observação é que a key geradora, nencessária para a geração do OTP, deve ser individualizada por usuário. A RFC também indica que uma forma de derivação da chave individualizada é através da função HASH (Master Key, Info Usuário). Em geral uma master key é uma chave simétrica.

MasterKey = AES_256_CBC
Key = SHA256(Master Key, Id Usuário)

A Master Key está salva no arqivo .env do projeto

O OTP possui validade de 5 minutos

## Consequências

Derivar uma key a partir do Id do Usuário faz com que o processo de geração do OTP fique um pouco mais complexo

O uso de uma chave individualizada faz com que o OTP gerado para um determinado cliente só seja validado se for com uma solicitação relacionada àquele usuário

É necessário ter uma gestão segura do arquivo que contém a Master Key
