import React from "react";
import { PlayerID, PlayerInfo } from "../types";

interface ScoreBoardProps {
  scores: { [key: string]: number };
  numVictories: { [key: string]: number };
  playerInfos: { [key: string]: PlayerInfo };
  currentPlayer: PlayerID;
  playOrder: PlayerID[];
  numColsToWin: number | "auto";
}

export class ScoreBoard extends React.Component<ScoreBoardProps> {
  render() {
    const {
      playOrder,
      playerInfos,
      scores,
      currentPlayer,
      numVictories,
      numColsToWin,
    } = this.props;

    if (numColsToWin === "auto") {
      throw new Error("invalid num cols to win");
    }

    const content = playOrder.map((playerID) => {
      const name = playerInfos[playerID].name;
      const color = playerInfos[playerID].color;
      const points = scores[playerID];
      // 5 is the maximum number of points but you can finish with up to 8
      const tds = Array(8)
        .fill(null)
        .map((_, i) => {
          const hasStar = points > i;
          if (i >= numColsToWin && !hasStar) {
            return null;
          }
          const className = hasStar ? ` color${color}` : ` emptyStar`;
          return (
            <td className="starCol" key={i}>
              <div {...{ className }} key={playerID}>
                ★
              </div>
            </td>
          );
        });
      let className = `scoreBoardPlayerName bgcolor${color}`;
      if (playerID === currentPlayer) {
        className += " scoreBoardPlayerNameCurrent littleFlash";
      }
      return (
        <tr key={playerID}>
          <td className="numVictoriesCol">
            <div className={`bgcolor${color} scoreBoardNumVictories`}>
              {numVictories[playerID] || ""}
            </div>
          </td>
          <td>
            <div {...{ className }}>{name}</div>
          </td>
          {tds}
        </tr>
      );
    });

    return (
      <table className="scoreBoard">
        <tbody>{content}</tbody>
      </table>
    );
  }
}
