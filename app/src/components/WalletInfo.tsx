import React from 'react';
import { useState, useEffect } from 'react';
import { etherClient, IWalletInfo } from '../utils/etherClient';
import { contractChainId, contractChainName } from '../utils/etherClient';

const WalletInfo: React.FC = () => {
  const [walletInfo, setWalletInfo] = useState<IWalletInfo | null>(null);
  // const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const doSetWalletInfo = () => {
      doGetWalletInfo()
        .then((info) => {
          if (info) setWalletInfo(info);
        })
        .catch(() => {
          /** ignore */
        })
        .finally(() => {
          // setLoaded(true);
        });
    };
    doSetWalletInfo();
  }, [walletInfo]);

  async function connectWallet() {
    let info = await doGetWalletInfo();
    console.log('getWalletInfo:', info);
  }

  return (
    <button onClick={connectWallet}>
      { !walletInfo && <div>连接钱包</div>}
      {walletInfo && walletInfo.chainId !== contractChainId && (
            <div>请切换到 {contractChainName} 网络</div>
      )}
      {walletInfo && walletInfo.chainId === contractChainId && (
            <div>
              <div>
                {walletInfo.address.substr(0, 6)}...{walletInfo.address.substr(-4)}
              </div>
            </div>
      )}
    </button>
  );
};

export async function doGetWalletInfo() {
  await etherClient.loadProvider();
  return await etherClient.getWalletInfo();
}

export default WalletInfo;
