import React from 'react';

const Info: React.FC = () => {
  return (
    <div className="info">
      <h2>About</h2>
      <p>
        This is a <a target="_blank" rel="noopener noreferrer" href="https://github.com/gabrielecirulli/2048">2048</a> like game, you can mint an Evolution Puzzle NFT when the game is over.
        <a target="_blank" rel="noopener noreferrer" href="https://testnets.opensea.io/collection/simevolution"> Browse in OpenSea </a>
      </p>
      <p>
        SimEvolution is a NFT game based on blockchain, which randomly generates data from things at all levels and creates an Evolution Puzzle NFT with scales from atoms to metaverse and time from antiquity to modern times, forming a panoramic view of simulation evolution.
      </p>
      <p>
        At present, it is an interest-oriented experimental project, build with React, TypeScript and Solidity, combined with Ethereum and ERC721, developed by <a target="_blank" rel="noopener noreferrer" href="https://github.com/bitwater">bitwater</a>.
      </p>
    </div>
  );
};

export default Info;
