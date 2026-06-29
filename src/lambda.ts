import awsLambdaFastify from "@fastify/aws-lambda";
import { buildApp } from "./app";
import type { Handler } from "aws-lambda";

const app = buildApp();
const proxy = awsLambdaFastify(app);

export const handler: Handler = (event, context) => {
  return proxy(event, context);
};