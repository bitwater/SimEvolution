import React from 'react';

const Info: React.FC = () => {
  return (
    <div className="info">
      <h2>关于</h2>
      <p>
        这是一个像 <a target="_blank" rel="noopener noreferrer" href="https://github.com/gabrielecirulli/2048">2048</a> 的小游戏，在游戏结束时可以铸造一枚演化拼图NFT，
        <a target="_blank" rel="noopener noreferrer" href="https://testnets.opensea.io/collection/simevolution"> 在 OpenSea 上浏览 </a>
      </p>
      <p>
        <a target="_blank" rel="noopener noreferrer"  href="https://github.com/bitwater/SimEvolution">模拟演化</a> 是一个基于区块链的NFT游戏，将各层次上的事物随机生成数据，铸造成演化拼图NFT，尺度从原子到元宇宙，时间从远古到现代，构成模拟演化全景。
      </p>
      <p>
        目前是一个兴趣导向的实验性开源项目, 由 <a target="_blank" rel="noopener noreferrer" href="https://github.com/bitwater">三水</a> 设计和开发.
      </p>
    </div>
  );
};

export default Info;
