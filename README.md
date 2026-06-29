# 🎾 Tennis API

REST API for managing tennis players and computing aggregate statistics, built with **Fastify** and **TypeScript**. Originally created as a technical test ("Test Technique pour l'Atelier").

The API can run as a standalone Node.js server or be deployed as an **AWS Lambda** function via the Serverless Framework.

## Live Demo - AWS Lambda
```bash
https://fa0kwz0mf6.execute-api.eu-west-3.amazonaws.com/health
```

## Features

- List all players, sorted by ranking
- Retrieve a single player by ID
- Create a new player (with full request validation)
- Compute global statistics:
  - Country with the highest win ratio
  - Average BMI across all players
  - Median height across all players
- Health check endpoint
- Layered architecture: routes → controllers → services → repository
- Unit and integration tests with Vitest + Supertest

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Web framework | [Fastify](https://fastify.dev/) |
| Validation | [Zod](https://zod.dev/) |
| Testing | [Vitest](https://vitest.dev/) + Supertest |
| Lint / Format | ESLint + Prettier |
| Deployment | AWS Lambda (`@fastify/aws-lambda`) via Serverless Framework |
| Data storage | Local JSON file (`src/data/headtohead.json`) — AWS DynamoDB client is scaffolded for future use |


## Prerequisites

- [Node.js](https://nodejs.org/) v22 or later
- npm (comes with Node.js)

## Installation

```bash
git clone https://github.com/NourJadlaoui/tennis-api.git
cd tennis-api
npm install
```

## Running locally

Start the API in watch mode (auto-reloads on file changes):

```bash
npm run dev
```

The server starts on **http://localhost:3000**.

Other available scripts:

```bash
npm run build          # Compile TypeScript to dist/
npm start              # Run the compiled server (node dist/server.js)
npm test               # Run the test suite once
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
npm run lint           # Lint the codebase
npm run lint:fix       # Lint and auto-fix issues
npm run format         # Format the codebase with Prettier
```

## API Reference

### Health check

```
GET /health
```

**Response `200`**
```json
{ "status": "ok" }
```

### List all players

```
GET /players
```

Returns all players sorted by ranking (best rank first).

**Response `200`** — array of `Player` objects (see [Player model](#player-model) below).

### Get a player by ID

```
GET /players/:id
```

| Param | Type | Description |
|---|---|---|
| `id` | integer | Player ID |

**Responses**
- `200` — the matching `Player` object
- `400` — `id` is not a valid positive integer
- `404` — no player found with that ID

### Create a player

```
POST /players
```

**Request body**
```json
{
  "firstname": "Rafael",
  "lastname": "Nadal",
  "shortname": "R.NAD",
  "sex": "M",
  "country": {
    "picture": "https://example.com/spain.png",
    "code": "ESP"
  },
  "picture": "https://example.com/nadal.png",
  "data": {
    "rank": 10,
    "points": 2000,
    "weight": 85000,
    "height": 185,
    "age": 30,
    "last": [1, 0, 1]
  }
}
```

**Responses**
- `201` — the created `Player` object (with generated `id`)
- `400` — validation error, with details:
  ```json
  { "message": "Validation error", "errors": { /* Zod field errors */ } }
  ```

### Get global statistics

```
GET /stats
```

**Response `200`**
```json
{
  "countryWithHighestWinRatio": { "country": "SRB", "ratio": 1 },
  "averageBmi": 23.36,
  "medianHeight": 185
}
```

| Field | Description |
|---|---|
| `countryWithHighestWinRatio` | Country code with the best win ratio over players' last matches, and that ratio |
| `averageBmi` | Average BMI (kg/m²) across all players |
| `medianHeight` | Median height (cm) across all players |

## Player model

```ts
interface Player {
  id: number;
  firstname: string;
  lastname: string;
  shortname: string;
  sex: "M" | "F";
  country: {
    picture: string; // URL
    code: string;    // ISO-ish 2-3 letter country code
  };
  picture: string;    // URL
  data: {
    rank: number;
    points: number;
    weight: number;        // in grams
    height: number;         // in centimeters
    age: number;
    last: (0 | 1)[];        // results of last matches, 1 = win, 0 = loss
  };
}
```

> Note: `weight` is stored in **grams** and `height` in **centimeters** in the dataset; BMI is calculated internally by converting to kg and meters.

## Testing

Tests are written with **Vitest**, using Fastify's `inject` method for integration tests (no real HTTP server needed) and mocked repositories for unit tests on the service layer.

```bash
npm test
```

## Deployment (AWS Lambda)

The project includes a `serverless.yml` for deploying to AWS Lambda behind an HTTP API Gateway, using [Serverless Framework](https://www.serverless.com/).

```yaml
service: tennis-api
provider:
  name: aws
  runtime: nodejs22.x
  region: eu-west-3
functions:
  api:
    handler: dist/lambda.handler
    events:
      - httpApi:
          path: /{proxy+}
          method: ANY
```

Build the project first, then deploy:

```bash
npm run build
npx serverless deploy
```

> This requires the Serverless Framework CLI and valid AWS credentials configured locally (e.g. via `aws configure`).

## License

ISC
