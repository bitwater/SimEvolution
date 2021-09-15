import chai, {expect} from 'chai';
import {ethers, network} from 'hardhat';
import {solidity} from 'ethereum-waffle';
import {BigNumber, ContractFactory, Contract, utils, Event} from 'ethers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import pino from 'pino';
import { json } from 'hardhat/internal/core/params/argumentTypes';

chai.use(solidity);
const Logger = pino();

describe('Evolution with Proxy', () => {
  let operator: SignerWithAddress;
  let accountA: SignerWithAddress;

  before('setup accounts', async () => {
    [operator, accountA] = await ethers.getSigners();
  });

  describe('test base Information', () => {
    let evolution: Contract;
    let evolutionFactory: ContractFactory;

    beforeEach('deploy and init contract', async () => {
      Logger.info('deploy  proxy');
      evolutionFactory = await ethers.getContractFactory(
        'Evolution'
      );

      evolution = await evolutionFactory.connect(operator).deploy();
      Logger.info(`deployed at ${evolution.address}`);
    });

    it('check mint', async () => {
      for (let index = 1; index < 5; index++) {
        await evolution.mint(index)
        let metadata =  await evolution.tokenURI(index);
        metadata = Buffer.from(metadata.split(',')[1], 'base64').toString('binary')
        // svgdata = Buffer.from(JSON.parse(metadata).image.split(',')[1], 'base64').toString('binary')
        Logger.info(`${index} tokenURI: ${metadata}`);
      }
    });
  });
});
