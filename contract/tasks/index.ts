export * from './deployment/deploy';
export * from './verify/verify-evolution';

export interface ContractInfo {
  address: string;
  impl: string;
}

export interface Deployment {
  operator: string;
  Evolution: ContractInfo;
}

export interface EvolutionDeployment {
  [network: string]: Deployment;
}
