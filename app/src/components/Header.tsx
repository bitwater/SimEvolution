import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetAction } from '../actions';
import { StateType } from '../reducers';
import WalletInfo from './WalletInfo';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const reset = useCallback(() => dispatch(resetAction()), [dispatch]);
  // const undo = useCallback(() => dispatch(undoAction()), [dispatch]);

  const score = useSelector((state: StateType) => state.score);
  const scoreIncrease = useSelector((state: StateType) => state.scoreIncrease);
  const moveId = useSelector((state: StateType) => state.moveId);
  const best = useSelector((state: StateType) => state.best);
  // const previousBoard = useSelector((state: StateType) => state.previousBoard);

  return (
    <div className="header">
      <div className="header-row">
          <div></div>
        <div className="header-buttons">
          <WalletInfo />
        </div>
      </div>
      <div className="header-row">
        <h2>Evolution 2048</h2>
        <div className="header-scores">
          <div className="header-scores-score">
            <div>Score</div>
            <div>{score}</div>
            {!!scoreIncrease && (
              <div className="header-scores-score-increase" key={moveId}>
                +{scoreIncrease}
              </div>
            )}
          </div>
          <div className="header-scores-score">
            <div>Best</div>
            <div>{best}</div>
          </div>
        </div>
      </div>
      <div className="header-row">
        <div>
          Join the tiles and experience the journey of evolution
        </div>
        <div className="header-buttons">
          <button onClick={reset}>New Game</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
