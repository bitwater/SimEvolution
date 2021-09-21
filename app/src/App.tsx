import React from 'react';
// import GithubCorner from 'react-github-corner';
import './App.scss';

import { animationDuration, gridGap } from './config';
import Header from './components/Header';
import Board from './components/Board';
import Info from './components/Info';
// import BoardSizePicker from './components/BoardSizePicker';

const App: React.FC = () => {
  return (
    <div
      className="app"
      style={
        {
          '--animation-duration': animationDuration + 'ms',
          '--grid-gap': gridGap,
        } as any
      }
    >
      {/* <GithubCorner target="_blank" href="https://github.com/bitwater/SimEvolution" /> */}
      <div className="page">
        <Header />
        <Board />
        <Info />
      </div>
    </div>
  );
};

export default App;
