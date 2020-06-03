import {
  SeededCryptoModuleWithHelpers, SeededCryptoModulePromise
} from "@dicekeys/seeded-crypto-js"
import {
  DiceKey
} from "../dicekeys/dicekey";
import {
  RequestForUsersConsent,
  UsersConsentResponse
} from "../api/unsealing-instructions";
import {
  PermissionCheckedMarshalledCommands
} from "./abstract-permission-checked-marshalled-commands"
import {
  urlSafeBase64Decode,
  urlSafeBase64Encode
} from "../api/encodings"

/**
 * Wrap the [PermissionCheckedCommands] to unmarshall parameters from the
 * Android Intents (e.g. via `getStringExtra` or `getByteArrayExtra`) and then
 * marshall the Api call's result into a result intent (e.g. via `putExtra`).
 *
 *  The caller is responsible for catching exceptions and marshalling them
 */
export class UrlPermissionCheckedMarshalledCommands extends PermissionCheckedMarshalledCommands {
  constructor(
    seededCryptoModule: SeededCryptoModuleWithHelpers,
    protected requestUrl: URL,
    loadDiceKey: () => Promise<DiceKey>,
    requestUsersConsent: (
      requestForUsersConsent: RequestForUsersConsent
    ) => Promise<UsersConsentResponse>,
    private transmitResponse: (response: URL) => any = (response: URL) => this.defaultTransmitResponse(response)
  ) {    
    super(seededCryptoModule, loadDiceKey, requestUsersConsent);
  }

  protected unmarshallOptionalStringParameter = (parameterName: string): string | undefined => {
    const valueStringOrNull = this.requestUrl.searchParams.get(parameterName);
    if (valueStringOrNull == null) {
      return;
    }
    return valueStringOrNull;
  }

  protected unmarshallBinaryParameter = (parameterName: string): Uint8Array => {
    const base64Value  = this.unmarshallStringParameter(parameterName);
    return urlSafeBase64Decode(base64Value);
  }

  private defaultTransmitResponse = (response: URL): any => {
    window.location.replace(response.toString());
  }

  protected sendResponse = (response: [string, string][]) => {
    if (!this.respondTo) {
      return;
    }
    const responseUrl = new URL(this.respondTo);
    response.forEach( ([name, value]) => {
      responseUrl.searchParams.append(name, value);
    });
    this.transmitResponse(responseUrl)
  }

  static executeIfCommand = async (
    loadDiceKey: () => Promise<DiceKey>,
    requestUsersConsent: (
      requestForUsersConsent: RequestForUsersConsent
    ) => Promise<UsersConsentResponse>
  ) => {
    const seededCryptoModule = await SeededCryptoModulePromise;
    const command = new UrlPermissionCheckedMarshalledCommands(
      seededCryptoModule,
      new URL(window.location.href),
      loadDiceKey, requestUsersConsent
    );
    if (command.isCommand()) {
      command.execute();
    }    
  }


}
