/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Evolution__factory } from "../typechain/factories/Evolution__factory";
import { ethers, Signer, BigNumber, PayableOverrides } from "ethers";
import type { Web3Provider, Provider } from "@ethersproject/providers";
import { randomInt } from "./math";
import detectEthereumProvider from "@metamask/detect-provider";

const EVOLUTION_CONTRACT_ADDRESS = "0x49e0e90064256a92AfCA34c513925ef3a14026C7";
// const provider = new ethers.providers.JsonRpcProvider(RPC_HOST)

export interface IWalletInfo {
  address: string;
  networkName: string;
  chainId: number;
  balance: string;
}
// rinkeby id
export const contractChainId = 4;
export const contractChainName = "rinkeby";

class EtherClient {
  evolutionContractAddress: string;
  winProvider?: any;
  provider?: Web3Provider;
  client?: EvolutionClient;
  //   readonly onAccountsDidChange = new Emitter<string[]>();
  //   onAccountsChange = this.onAccountsDidChange.event;

  constructor(evolutionContractAddress: string) {
    this.evolutionContractAddress = evolutionContractAddress;
  }

  async loadProvider() {
    if (this.provider) {
      return;
    }
    this.winProvider = await detectEthereumProvider();
    if (this.winProvider) {
      // change event bind
      this.winProvider.on("accountsChanged", (accounts: string[]) => {
        // this.onAccountsDidChange.fire(accounts);
      });
      this.winProvider.on("chainChanged", () => {
        window.location.reload();
      });
      this.provider = new ethers.providers.Web3Provider(this.winProvider);
      return;
    }
    throw new Error("there are no eth provider.");
  }

  async getWalletInfo(): Promise<IWalletInfo | undefined> {
    if (this.provider) {
      await this.winProvider.request({ method: "eth_requestAccounts" });
      const address = await this.provider.getSigner().getAddress();
      const balance = await this.provider.getBalance(address);
      const network = await this.provider.getNetwork();
      return {
        address,
        networkName: network.name,
        chainId: network.chainId,
        balance: ethers.utils.formatEther(balance),
      };
    }
    throw new Error("get wallet info failed");
  }

  connectEvolutionContract() {
    if (this.provider) {
      this.client = new EvolutionClient();
      this.client.connectProvider(this.evolutionContractAddress, this.provider);
      this.client.setWaitConfirmations(1);
    }
  }

  connectSigner() {
    if (this.client && this.provider) {
      this.client.setWaitConfirmations(1);
      const signer = this.provider.getSigner();
      this.client.connectSigner(signer);
    }
  }

  resetClientConfirmations() {
    if (this.client) {
      this.client.setWaitConfirmations(1); // set number of confirmations to wait default is 5 blocks
    }
  }
}

class EvolutionClient {
  private evolution: any | undefined;
  private provider: Provider | undefined;
  private signer: Signer | undefined;
  private _waitConfirmations = 5;

  constructor() {
    this._waitConfirmations = 5;
  }

  public connectProvider(address: string, provider: Provider): EvolutionClient {
    this.provider = provider;
    this.evolution = Evolution__factory.connect(address, this.provider);
    return this;
  }

  public connectSigner(signer: Signer): EvolutionClient {
    this.signer = signer;
    return this;
  }

  public setWaitConfirmations(num: number): void {
    this._waitConfirmations = num;
  }

  public contract(): Promise<any> {
    if (this.provider === undefined || this.evolution === undefined) {
      return Promise.reject("need to connect a valid provider");
    }
    return Promise.resolve(this.evolution);
  }

  public async mint(
    id: BigNumber,
    config: PayableOverrides = {}
  ): Promise<any> {
    if (
      this.provider === undefined ||
      this.evolution === undefined ||
      this.signer === undefined
    ) {
      return Promise.reject("need to connect a valid provider and signer");
    }
    const gas = await this.evolution
      .connect(this.signer)
      .estimateGas.mint(id, { ...config });
    const transaction = await this.evolution
      .connect(this.signer)
      .mint(id, { gasLimit: gas.mul(13).div(10), ...config });
    const receipt = await transaction.wait(this._waitConfirmations);
    return receipt;
  }

  public async ownerOf(id: BigNumber, config: PayableOverrides = {}) {
    if (this.provider === undefined || this.evolution === undefined) {
      return Promise.reject("need to connect a valid provider");
    }
    return this.evolution.ownerOf(id, { ...config });
  }

  public async totalSupply(config: PayableOverrides = {}) {
    if (this.provider === undefined || this.evolution === undefined) {
      return Promise.reject("need to connect a valid provider");
    }
    return this.evolution.totalSupply({ ...config });
  }

  public async newMint(config: PayableOverrides = {}) {
    if (this.provider === undefined || this.evolution === undefined) {
      return Promise.reject("need to connect a valid provider");
    }
    let id = randomInt(0, 9800);
    // console.log("newMint:", id);
    return this.mint(BigNumber.from(id), config);
  }
}

export const etherClient = new EtherClient(EVOLUTION_CONTRACT_ADDRESS);
