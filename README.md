# Backend Engineer (Contract) Test Assignment - Insomnia Labs

## Table of Contents
1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Frameworks and Technologies](#frameworks-and-technologies)
4. [Installation and Running Instructions](#installation-and-running-instructions)
5. [API Documentation](#api-documentation)
6. [Conclusion](#conclusion)

## Introduction
The Avalanche USDC Transfer Analyzer is a backend service developed in TypeScript using Node.js. It connects to the Avalanche blockchain to fetch, aggregate, and analyze real-time USDC transfer data. This service is designed to extract USDC transactions, aggregate relevant information, and provide insights through API endpoints.

## Architecture Overview
The architecture of the Avalanche USDC Transfer Analyzer can be broken down into several key components:

1. **Blockchain Interaction Layer**: Connects to the Avalanche C-Chain via an RPC node to query USDC transactions.
2. **Data Aggregation Layer**: Processes and aggregates transaction data.
3. **Database Layer**: Stores transaction data and aggregated results in PostgreSQL. 
4. **API Layer**: Provides endpoints to access the data in PostgreSQL.
5. **Testing and Validation**: Ensures data integrity and reliability of the service.

### Diagram
```plaintext
                +------------------------+
                |   Avalanche Blockchain  |
                +-----------+------------+
                            |
                            v
                +------------------------+
                | Blockchain Interaction |
                +------------------------+
                            |
                            v
                +------------------------+
                |  Database (PostgreSQL) |
                +------------------------+
                            |
                            v
                +------------------------+
                |       API Layer        |
                +------------------------+
                            |
                            v
                +------------------------+
                | Testing and Validation |
                +------------------------+

```
### Documentation
Provide comprehensive documentation including setup instructions, API usage, and architecture overview.

## Frameworks and Technologies
- **Backend Framework**: [Express.js](https://expressjs.com/en/starter/installing.html)
- **Language**: [TypeScript](https://www.npmjs.com/package/typescript)
- **Database**: [PostgreSQL](https://www.postgresql.org/docs/current/tutorial-install.html)
- **Blockchain Library**: [ether.js](https://docs.ethers.org/v5/getting-started/)
- **Testing**: [Jest](https://jestjs.io/docs/getting-started)

## Installation and Running Instructions
### Prerequisites
- Node.js (https://docs.npmjs.com/getting-started/installing-node)
- PostgreSQL (https://www.postgresql.org/docs/current/tutorial-install.html)

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd insomnialabs-test
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:

  Create a `.env` file with necessary configurations.
   `export DB_USER='' DB='' DB_PASS='' DB_HOST='' DB_PORT='' DB_MAX_CLIENTS='' DB_IDLE_TIMEOUT_MS=''`

  this can also be done by creating a `.env` file in the root of this project see `.env.example` for a reference

5. **Run the application**:
   - Quickstart: transpile, lint and start the app all at once
   
   ```bash
   npm start
   ```

   - Or each step individually:

    Transpile TypeScript to the build folder
       run `tsc`
    Run ESLint
       `npm run lint`
    Run your built node app
       `node build/app.js`

   - Run the unit test
       `npm run test`

## API Documentation
### Endpoints
- **GET /total-volume**
  - **Description**: Fetch total volumes of transfers.
  - **Response**: Total Volume of all transfers.

- **GET /top-accounts**
  - **Description**: Fetch top accounts from the database with filters.
  - **Response**: JSON array of transfer data objects.

- **GET /transfers**
  - **Description**: Fetch all transfers from the database with filters.
  - **Response**: JSON array of transfer data objects.

### Example Request
```bash
curl GET http://localhost:3000/total-volume
```
```bash
curl GET localhost:3000/top-accounts?from=2024-06-10 20:54:06&to=2024-06-11 20:54:15&limit=5&offset=0
```
```bash
curl GET localhost:3000/transfers?sort=amount&direction=DESC&limit=3
```

### Example Response
```json
{
    "status": "ok",
    "data": [
        {
            "total_amount": "580954781817"
        }
    ],
    "statusCode": 200
}
```
```json
{
    "status": "ok",
    "data": [
        {
            "address": "0x0000000000000000000000000000000000000000",
            "total_volume": "504999900000"
        },
        {
            "address": "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
            "total_volume": "500000000000"
        },
        {
            "address": "0x8efa72ceD215b58Fa767B42ff84fAfF054C1dcb7",
            "total_volume": "26330705815"
        },
        {
            "address": "0xe6C7E4142b0cB24F2bFa7b9a50911375f8EE8DB9",
            "total_volume": "26330666276"
        },
        {
            "address": "0xfF7DF031a3FECC56e5Fb95c59D46cb3eCC2e5A8C",
            "total_volume": "24072752666"
        }
    ],
    "statusCode": 200
}
```
```json
{
    "status": "ok",
    "data": [
        {
            "id": 97,
            "sender": "0x3BCE63C6C9ABf7A47f52c9A3a7950867700B0158",
            "receiver": "0x6fc6F08Ae3ca06527D7f1d0EC4465A02E343e425",
            "amount": "9999870000",
            "timestamp": "2024-06-11T09:50:05.101Z"
        },
        {
            "id": 91,
            "sender": "0x187b2d576ba7ec2141c180A96eDd0f202492f36B",
            "receiver": "0x7688928c9BFA294048238f6cb34e27C067016Df6",
            "amount": "994690000",
            "timestamp": "2024-06-11T09:49:52.868Z"
        },
        {
            "id": 107,
            "sender": "0x802b65b5d9016621E66003aeD0b16615093f328b",
            "receiver": "0xfAe3f424a0a47706811521E3ee268f00cFb5c45E",
            "amount": "844395956",
            "timestamp": "2024-06-11T09:50:32.982Z"
        }
    ],
    "statusCode": 200
}
```

## Conclusion
The Avalanche USDC Transfer Analyzer provides a robust backend service to monitor, aggregate, and analyze USDC transactions on the Avalanche blockchain. By leveraging Node.js, TypeScript, and PostgreSQL, it ensures real-time data processing and reliable API endpoints for accessing transaction insights. This documentation serves as a comprehensive guide to understand, set up, and extend the service.
