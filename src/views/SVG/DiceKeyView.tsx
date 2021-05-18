import css from "./dicekey-view.module.css"
import React from "react";
import { observer } from "mobx-react";
import { PartialDiceKey } from "../../dicekeys/DiceKey";
import { FaceGroupView } from "./FaceView";

const diceBoxColor = "#050350"; // must be in hex format as it is parsed as such in this code.

export interface DiceKeyRenderOptions {
  highlightFaceAtIndex?: number;
  diceBoxColor?: [number, number, number];
  showLidTab?: boolean;
  leaveSpaceForTab?: boolean;
  onFaceClicked?: (faceIndex: number) => any;
}

export const distanceBetweenFacesAsFractionOfLinearSizeOfFace = 0.2;
export const marginOfBoxEdgeAsFractionOfLinearSizeOfFace = 1/8;
export const ratioOfBoxWidthToFaceSize = 1 * (
    5 +
    4 * distanceBetweenFacesAsFractionOfLinearSizeOfFace +
    2 * marginOfBoxEdgeAsFractionOfLinearSizeOfFace
  );
export const fractionBoxWithLidTabToBoxWithoutLidTab = 1.1;
class DiceKeySizeModel {
  constructor(public readonly linearSizeOfFace: number = 1, public readonly includeSpaceForTab: boolean = false) {}

  static fromBoxWith = (boxWidth: number, includeSpaceForTab: boolean = false) =>
    new DiceKeySizeModel(boxWidth / ratioOfBoxWidthToFaceSize, includeSpaceForTab);

  tabFraction = this.includeSpaceForTab ? 0.1 : 0;

  linearSizeOfBox = this.linearSizeOfFace * ratioOfBoxWidthToFaceSize;
  distanceBetweenDieCenters = this.linearSizeOfFace * (1 + distanceBetweenFacesAsFractionOfLinearSizeOfFace);
  linearSizeOfBoxWithTab = this.linearSizeOfBox * (1 + this.tabFraction);

  top = -this.linearSizeOfBox / 2;
  left = -this.linearSizeOfBox / 2;
  radius = this.linearSizeOfBox / 50;
}

export const DiceKeySvgGroup = observer( ({
    faces, ...options
  }: {faces: PartialDiceKey} & DiceKeyRenderOptions & {sizeModel: DiceKeySizeModel}
  ) => {
    const {
      showLidTab = false,
//      leaveSpaceForTab = showLidTab,
      sizeModel,
      onFaceClicked,
    } = options;
  
    return (
      <g>
        { (!showLidTab) ? null : (
          // Lid tab as circle
          <circle
            cx={0} cy={sizeModel.top + sizeModel.linearSizeOfBox}
            r={sizeModel.tabFraction * sizeModel.linearSizeOfBox}
            fill={diceBoxColor}
          />
        )}
        // The blue dice box
        <rect
          x={sizeModel.left} y={sizeModel.top}
          width={sizeModel.linearSizeOfBox} height={sizeModel.linearSizeOfBox}
          rx={sizeModel.radius} ry={sizeModel.radius}
          fill={diceBoxColor}
        />
        {
          faces.map( (face, index) => (
            <FaceGroupView
              {...(onFaceClicked ? ({onFaceClicked: () => onFaceClicked(index) }) : {})}
              key={index}
              face={face}
              center={{
                x: sizeModel.distanceBetweenDieCenters * (-2 + (index % 5)),
                y: sizeModel.distanceBetweenDieCenters * (-2 + Math.floor(index / 5))}
              }
              highlightThisFace={options.highlightFaceAtIndex == index}
            />
          ))
        }
      </g>
    );
});

export const DiceKeyView = observer( (props: {faces: PartialDiceKey} & {faceSize?: number} & DiceKeyRenderOptions
  ) => {
    const sizeModel = new DiceKeySizeModel(props.faceSize ?? 1, props.showLidTab || props.leaveSpaceForTab);
    const viewBox = `${sizeModel.left} ${sizeModel.top} ${sizeModel.linearSizeOfBox} ${sizeModel.linearSizeOfBoxWithTab}`
    return (
      <svg className={css.dicekey_svg} viewBox={viewBox}>
        <DiceKeySvgGroup {...props} sizeModel={sizeModel} />
      </svg>
    )    
});