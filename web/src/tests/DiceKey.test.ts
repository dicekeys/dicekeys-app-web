import { DiceKey } from "../dicekeys/DiceKey";

import { Crypto } from "@peculiar/webcrypto"
import { TestDiceKeys } from "./TestDiceKeys";
global.crypto = new Crypto();


describe("Formats: Bip39", () => {

  describe("Human readable form", () => {
    TestDiceKeys.forEach( (diceKey, testIndex) => {
      const {inHumanReadableForm} = diceKey;
      test(`${inHumanReadableForm} (${testIndex})`, () => {
        const replica = DiceKey.fromHumanReadableForm(inHumanReadableForm, {requireOneOfEachLetter: true, throwOnFailures: true});
        const equal = Array.from(Array(25).keys()).every( index => 
          replica.faces[index].digit === diceKey.faces[index].digit &&
          replica.faces[index].letter === diceKey.faces[index].letter &&
          replica.faces[index].orientationAsLowercaseLetterTrbl === diceKey.faces[index].orientationAsLowercaseLetterTrbl
        );
        expect(equal).toStrictEqual(true);
      });
    });
  });

  describe("Numeric form", () => {
    TestDiceKeys.forEach( (diceKey, testIndex) => {
      test(`${diceKey.inHumanReadableForm} (${testIndex})`, () => {
        const replica = DiceKey.fromNumericForm(diceKey.inNumericForm!);
        expect(replica.inHumanReadableForm).toStrictEqual(replica.inHumanReadableForm);
      });
    });
  });

  
});
