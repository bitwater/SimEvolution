import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissAction, resetAction } from '../actions';
import { StateType } from '../reducers';
import { etherClient } from '../utils/etherClient';
import { doGetWalletInfo } from './WalletInfo';

const Overlay: React.FC = () => {
  const dispatch = useDispatch();
  const reset = useCallback(() => dispatch(resetAction()), [dispatch]);
  const dismiss = useCallback(() => dispatch(dismissAction()), [dispatch]);

  const defeat = useSelector((state: StateType) => state.defeat);
  const victory = useSelector(
    (state: StateType) => state.victory && !state.victoryDismissed
  );

  async function mint() {
    let info = await doGetWalletInfo();
    console.log('getWalletInfo:', info);
    etherClient.connectEvolutionContract();
    etherClient.connectSigner();
    if (!etherClient.client) {
      console.error('上传失败', `钱包异常`);
      throw new Error(`钱包异常`);
    }
    try {
      // await etherClient.client.ownerOf(BigNumber.from(1001));
      const receipt =  await etherClient.client.newMint();
      console.log('receipt:', receipt)
    } catch (error) {
      console.error(error)
    } 
    
    reset();
  }

  if (victory) {
    return (
      <div className="overlay overlay-victory">
        <h1>You win!</h1>
        <div className="overlay-buttons">
          <button onClick={mint}>Mint puzzle</button>
          <button onClick={dismiss}>Keep going</button>
        </div>
      </div>
    );
  }

  if (defeat) {
    return (
      <div className="overlay overlay-defeat">
        <h1>Game over!</h1>
        <div className="overlay-buttons">
          <button onClick={mint}>Mint puzzle</button>
          <button onClick={reset}>Try again</button>
        </div>
      </div>
    );
  }

  return null;
};

export default Overlay;
