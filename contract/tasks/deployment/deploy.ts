import '@nomiclabs/hardhat-ethers';
import {task} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import pino from 'pino';
import fs from 'fs';
import {Deployment, EvolutionDeployment} from '..';
import {PayableOverrides} from 'ethers';
import {getPersisLogDir, AutoTry} from '../utils';

const Logger = pino();
const taskName = 'Evolution:deploy';

task(taskName, 'Deploy Evolution upgradeable')
  .addParam('waitNum', 'The waitNum to transaction')
  .setAction(async (args, hre: HardhatRuntimeEnvironment) => {
    // check log-persis folder
    const autoTry = new AutoTry(taskName);
    await autoTry.load();
    const waitNum = parseInt(args['waitNum']);
    const txConfig: PayableOverrides = {};
    const deploymentLog = `${await getPersisLogDir()}/deployment.json`;
    let deploymentFull: EvolutionDeployment = {};
    if (fs.existsSync(deploymentLog)) {
      deploymentFull = JSON.parse(
        (await fs.promises.readFile(deploymentLog)).toString()
      );
    }

    Logger.info('deploy');

    const EvolutionFactory = await hre.ethers.getContractFactory(
      'Evolution'
    );

    const deployCellEvolutionResult = await autoTry.transaction(
      EvolutionFactory.deploy.bind(EvolutionFactory),
      [],
      ['contractAddress'],
      'deploy Evolution',
      txConfig,
      waitNum,
      true
    );
    Logger.info(
      `Evolution deployed at ${deployCellEvolutionResult.contractAddress}`
    );
    const Evolution = EvolutionFactory.attach(
      deployCellEvolutionResult.contractAddress
    );
    const operator = (await hre.ethers.getSigners())[0];

    const deployment: Deployment = {
      operator: operator.address,
      Evolution: {
        address: Evolution.address,
        impl: 'Evolution',
      }
    };
    // persis log
    deploymentFull[hre.network.name] = deployment;
    await fs.promises.writeFile(
      deploymentLog,
      JSON.stringify(deploymentFull, undefined, 2)
    );
  });
