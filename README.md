# **API Ebanx**

Este projeto é uma aplicação para gerenciar contas bancárias, permitindo operações como depósito, saque, transferência e consulta de saldo. Ele utiliza uma arquitetura baseada em casos de uso e repositórios, com suporte para testes unitários utilizando Jest.

## **Estrutura do Projeto**

O projeto está organizado da seguinte forma:

- **domain**: Contém as entidades do domínio, como `Account`.
- **application**: Contém os casos de uso, como `DepositUseCase`, `WithdrawUseCase`, `TransferUseCase`, etc.
- **database**: Implementação do repositório de contas (`Database`).
- **controllers**: Controladores responsáveis por lidar com as requisições HTTP.
- **tests**: Testes unitários para os casos de uso e outras partes do sistema.

## **Pré-requisitos**

Antes de executar o projeto, certifique-se de ter instalado:

- Node.js (versão 16 ou superior)
- npm ou yarn

## **Instalação**

1. Clone o repositório:
   ```bash
   git clone https://github.com/andreramosdovale/api-ebanx
   cd api-ebanx
   ```
2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

## **Uso**

### Iniciar o Servidor

Para iniciar o servidor, execute o seguinte comando:

```bash
npm start
# ou
yarn start
```

O servidor será iniciado e estará disponível em [http://localhost:3000](http://localhost:3000).

### **Endpoints Disponíveis**

#### **Resetar Banco de Dados**

- **Endpoint:** `POST /reset`
- **Descrição:** Reseta o banco de dados para o estado inicial.

#### **Consultar Saldo**

- **Endpoint:** `GET /balance?account_id={id}`
- **Descrição:** Retorna o saldo da conta especificada.
- **Resposta:**
  - `200`: Retorna o saldo.
  - `404`: Conta não encontrada.

#### **Realizar Operações**

- **Endpoint:** `POST /event`
- **Descrição:** Realiza operações como depósito, saque e transferência.
- **Body:**
  ```json
  {
    "type": "deposit | withdraw | transfer",
    "origin": "id da conta de origem (opcional para depósito)",
    "destination": "id da conta de destino (opcional para saque)",
    "amount": "valor da operação"
  }
  ```
- **Resposta:**
  - `201`: Operação realizada com sucesso.
  - `404`: Conta não encontrada.
  - `400`: Tipo de operação inválido.

## **Testes**

Para executar os testes unitários, utilize o comando:

```bash
npm run test
# ou
yarn test
```

Os testes cobrem os casos de uso e a lógica principal do sistema.
