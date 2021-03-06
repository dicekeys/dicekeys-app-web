import layoutCSS from "../../css/Layout.module.css";
import {NavigationBars} from "../../css"
import React from "react";
import { observer  } from "mobx-react";
import { DiceKey } from "../../dicekeys/DiceKey";
import { DiceKeyViewAutoSized } from "../SVG/DiceKeyView";
import imageOfDiceKeyIcon from /*url:*/"../../images/DiceKey Icon.svg";
import imageOfUsbKey from /*url:*/"../../images/USB Key.svg";
import imageOfSecretWithArrow from /*url:*/"../../images/Secret with Arrow.svg";
import imageOfBackup from /*url:*/"../../images/Backup to DiceKey.svg";
import { DerivationView } from "../Recipes/DerivationView";
import { Navigation } from "../../state";
import { SeedHardwareKeyView } from "../Recipes/SeedHardwareKeyView";
import { SimpleTopNavBar } from "../Navigation/SimpleTopNavBar";
import { BackupView } from "../BackupView/BackupView";
import { DiceKeyState } from "../../state/Window/DiceKeyState";
import { SelectedDiceKeyViewState } from "./SelectedDiceKeyViewState";
import { addPreview } from "../basics/Previews";
const SubViews = Navigation.SelectedDiceKeySubViews

// const saveSupported = isElectron() && false; // To support save, investigate https://github.com/atom/node-keytar

interface SelectedDiceKeyViewProps {
  state: SelectedDiceKeyViewState;
  goBack?: () => any;
}

const FooterButtonView = observer( ( props: SelectedDiceKeyViewProps & {
  subView: Navigation.SelectedDiceKeySubViews, imageSrc: string, labelStr: string
  onClick: () => void
} ) => (
  <div
    className={props.state.subView === props.subView ? NavigationBars.footer_button_selected : NavigationBars.footer_button}
    onClick={(e) => { props.onClick(); e.preventDefault(); }}
  ><img className={NavigationBars.footer_icon} src={props.imageSrc}/><div>{props.labelStr}</div></div>
));

const SelectedDiceKeyViewStateFooter = observer( ( props: SelectedDiceKeyViewProps) => {
  const navState = props.state;
  return (
  <div className={NavigationBars.BottomNavigationBar}>
    <FooterButtonView {...props} labelStr={`DiceKey`} subView={SubViews.DisplayDiceKey} imageSrc={imageOfDiceKeyIcon} onClick={navState.navigateToDisplayDiceKey} />
    <FooterButtonView {...props} labelStr={`Seed`} subView={SubViews.SeedHardwareKey} imageSrc={imageOfUsbKey} onClick={navState.navigateToSeedHardwareKey} />
    <FooterButtonView {...props} labelStr={`Secret`} subView={SubViews.DeriveSecrets} imageSrc={imageOfSecretWithArrow} onClick={navState.navigateToDeriveSecrets} />
    <FooterButtonView {...props} labelStr={`Backup`} subView={SubViews.Backup} imageSrc={imageOfBackup} onClick={navState.navigateToBackup} />
  </div>
  );
});

const SelectedDiceKeySubViewSwitch = observer( ( {state}: SelectedDiceKeyViewProps) => {
  const {foregroundDiceKeyState } = state;
  const diceKey = foregroundDiceKeyState.diceKey;
  if (!diceKey) return null;
  switch(state.subView) {
    case Navigation.SelectedDiceKeySubViews.DisplayDiceKey: return (
      <DiceKeyViewAutoSized maxWidth="80vw" maxHeight="70vh" faces={diceKey.faces}/>
    );
    case Navigation.SelectedDiceKeySubViews.DeriveSecrets: return (
      <DerivationView seedString={diceKey.toSeedString()} />
    );
    case Navigation.SelectedDiceKeySubViews.SeedHardwareKey: return (
      <SeedHardwareKeyView seedString={diceKey.toSeedString()} />
    );
    case Navigation.SelectedDiceKeySubViews.Backup: return (
      <BackupView state={state.backupState} nextStepAfterEnd={() => {
        state.backupState.clear();
        state.navigateToDisplayDiceKey();
      }} />
    );
    default: return null;
  }
});

export const SelectedDiceKeyView = observer( ( props: SelectedDiceKeyViewProps) => {
  const diceKey = props.state.foregroundDiceKeyState.diceKey;
  const {goBack} = props;
  if (!diceKey) return null;
  return (
    <div className={layoutCSS.HeaderFooterContentBox}>
      <SimpleTopNavBar title={diceKey.nickname} goBack={goBack} />
      <div className={NavigationBars.BetweenTopAndBottomNavigationBars}>
        <SelectedDiceKeySubViewSwitch {...{...props}} />
      </div>
      <SelectedDiceKeyViewStateFooter {...props} />
    </div>
  );
});



addPreview("SelectedDiceKey", observer ( () => (
  <SelectedDiceKeyView
    goBack={() => alert("Back off man, I'm a scientist!")}
    state={new Navigation.SelectedDiceKeyViewState(new DiceKeyState(DiceKey.testExample), SubViews.DisplayDiceKey)}
/>)));

addPreview("Recipes", () => (<SelectedDiceKeyView
      state={new Navigation.SelectedDiceKeyViewState(new DiceKeyState(DiceKey.testExample), SubViews.DeriveSecrets)}
  />)
);

addPreview("SeedHardwareKey", () => (<SelectedDiceKeyView
  state={new Navigation.SelectedDiceKeyViewState(new DiceKeyState(DiceKey.testExample), SubViews.SeedHardwareKey)}
/>)
);