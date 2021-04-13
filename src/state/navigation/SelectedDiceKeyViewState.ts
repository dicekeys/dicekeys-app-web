import { computed, makeObservable } from "mobx";
import { DiceKey } from "../../dicekeys";
import { DiceKeyMemoryStore } from "../stores/DiceKeyMemoryStore";
import { HasSubViews } from "../core";

export enum SelectedDiceKeySubViews {
  DisplayDiceKey, // primary view
  Backup,
  SeedHardwareKey,
  DeriveSecrets,
//  Save
}

export class SelectedDiceKeyViewState extends HasSubViews<SelectedDiceKeySubViews> {

  public get diceKey(): DiceKey | undefined {
    return this.keyId ? DiceKeyMemoryStore.diceKeyForKeyId(this.keyId) : undefined;
  };

  constructor(
    public readonly goBack: () => any,
    public readonly keyId: string,
    initialSubView: SelectedDiceKeySubViews = SelectedDiceKeySubViews.DisplayDiceKey
  ) {
    super(initialSubView);
    makeObservable(this, {
      diceKey: computed
    });
  }

  navigateToDisplayDiceKey = this.navigateToSubView(SelectedDiceKeySubViews.DisplayDiceKey);
  navigateToBackup = this.navigateToSubView(SelectedDiceKeySubViews.Backup);
  navigateToSeedHardwareKey = this.navigateToSubView(SelectedDiceKeySubViews.SeedHardwareKey);
  navigateToDeriveSecrets = this.navigateToSubView(SelectedDiceKeySubViews.DeriveSecrets);

  static create = async (goBack: () => any, diceKey: DiceKey): Promise<SelectedDiceKeyViewState> => {
    const keyId = await DiceKey.keyId(diceKey);
    DiceKeyMemoryStore.addDiceKeyForKeyId(keyId, diceKey);
    return new SelectedDiceKeyViewState(goBack, keyId);
  }

  
}