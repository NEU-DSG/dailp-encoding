export enum Environment {
  Local = "local",
  Development = "dev",
  Production = "prod",
  UAT = "uat",
}

export const deploymentEnvironment: Environment =
  (import.meta.env["VITE_DEPLOYMENT_ENV"] as Environment) ?? Environment.Local
