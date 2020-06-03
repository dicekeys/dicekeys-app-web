import {
  PackagedSealedMessage,
  Secret,
  SealingKey,
  SignatureVerificationKey,
  SigningKey,
  SymmetricKey,
  UnsealingKey,
  SeededCryptoModuleWithHelpers
} from "@dicekeys/seeded-crypto-js";
import {
  DerivableObjectNames, DerivationOptions
} from "../api/derivation-options";
import {
  PermissionCheckedSeedAccessor
} from "./permission-checked-seed-accessor";
import { DiceKeyAppState } from "./app-state-dicekey";

/**
 * Implements the server-side API calls and the necessary permission checks,
 * using a structure that's locally testable
 * (all intent marshalling and unmarshalling occurs outside this library.)
 *
 * Internally, this class does not have access to the user's raw DiceKey (KeySqrState).
 * The only way it can get seeds is by calling the [PermissionCheckedSeedAccessor]
 * to get the seeds. ([PermissionCheckedSeedAccessor] acts as a reference monitor.)
 *
 * The caller is responsible for catching exceptions
 */
export class PermissionCheckedCommands {
  constructor(
    private permissionCheckedSeedAccessor: PermissionCheckedSeedAccessor,
    private seededCryptoModule: SeededCryptoModuleWithHelpers
  ) {}

  public getAuthToken = (respondToUrl: string): string =>
    DiceKeyAppState.instance!!.addAuthenticationToken(respondToUrl);

  /**
   * Implement [DiceKeysIntentApiClient.getSecret] with the necessary permissions checks
   */
  public getSecret = async (derivationOptionsJson: string): Promise<Secret> =>
    this.seededCryptoModule.Secret.deriveFromSeed(
      await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedAsync(
        derivationOptionsJson,
        DerivableObjectNames.Secret
      ),
      derivationOptionsJson
    )

  /**
   * Implement [DiceKeysIntentApiClient.sealWithSymmetricKey] with the necessary permissions checks
   */
  // public sealWithSymmetricKey = async (
  //   derivationOptionsJson: string,
  //   plaintext: Uint8Array,
  //   unsealingInstructions?: string
  // ): Promise<PackagedSealedMessage> =>
  // this.seededCryptoModule.SymmetricKey.sealWithInstructions(
  //   plaintext,
  //   unsealingInstructions ?? "",
  //   await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedAsync(
  //       derivationOptionsJson,
  //       DerivableObjectNames.SymmetricKey
  //   ),
  //   derivationOptionsJson
  // );
  public sealWithSymmetricKey = (
    derivationOptionsJson: string,
    plaintext: Uint8Array,
    unsealingInstructions?: string
  ): Promise<PackagedSealedMessage> =>
    this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedAsync(
      derivationOptionsJson,
      DerivableObjectNames.SymmetricKey
    ).then( seedString => {
      const isOk = (typeof plaintext === "string" || (plaintext instanceof Uint8Array));
      console.log("isOk", isOk, plaintext.constructor.name);
      return this.seededCryptoModule.SymmetricKey.sealWithInstructions(
        plaintext,
        unsealingInstructions ?? "",
        seedString,
        derivationOptionsJson
      )
    }
    );

  /**
   * Implement [DiceKeysIntentApiClient.unsealWithSymmetricKey] with the necessary permissions checks
   */
  public unsealWithSymmetricKey = async (
    packagedSealedMessage: PackagedSealedMessage
  ) : Promise<Uint8Array> => this.seededCryptoModule.SymmetricKey.unseal(
      packagedSealedMessage,
      await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedToUnsealAsync(
        packagedSealedMessage,
        DerivableObjectNames.SymmetricKey
      )
    )

  /**
   * Implement [DiceKeysIntentApiClient.getSealingKey] with the necessary permissions checks
   */
  public getSealingKey = async (
    derivationOptionsJson: string
  ) : Promise<SealingKey> =>
    this.seededCryptoModule.UnsealingKey.deriveFromSeed(
      await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedAsync(
        derivationOptionsJson,
        DerivableObjectNames.UnsealingKey
      ),
      derivationOptionsJson
    ).getSealingKey()

  /**
   * Implement [DiceKeysIntentApiClient.getUnsealingKey] with the necessary permissions checks
   */
  public getUnsealingKey = async (
    derivationOptionsJson: string
  ) : Promise<UnsealingKey> => this.seededCryptoModule.UnsealingKey.deriveFromSeed(
    await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientsMayNotRetrieveKeysOrThisClientNotAuthorizedAsync(
      derivationOptionsJson,
      DerivableObjectNames.UnsealingKey
    ),
    derivationOptionsJson
  )

  /**
   * Implement [DiceKeysIntentApiClient.getSigningKey] with the necessary permissions checks
   */
  public getSigningKey = async (
    derivationOptionsJson: string
  ) : Promise<SigningKey> => this.seededCryptoModule.SigningKey.deriveFromSeed(
    await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientsMayNotRetrieveKeysOrThisClientNotAuthorizedAsync(
      derivationOptionsJson,
      DerivableObjectNames.SigningKey
    ),
    derivationOptionsJson
  )

  /**
   * Implement [DiceKeysIntentApiClient.getSymmetricKey] with the necessary permissions checks
   */
  public getSymmetricKey = async (
    derivationOptionsJson: string
  ) : Promise<SymmetricKey> => this.seededCryptoModule.SymmetricKey.deriveFromSeed(
    await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientsMayNotRetrieveKeysOrThisClientNotAuthorizedAsync(
      derivationOptionsJson,
      DerivableObjectNames.SymmetricKey
    ),
    derivationOptionsJson
  )

  /**
   * Implement [DiceKeysIntentApiClient.getSignatureVerificationKey] with the necessary permissions checks
   */
  public getSignatureVerificationKey = async (
    derivationOptionsJson: string
  ) : Promise<SignatureVerificationKey> =>
    this.seededCryptoModule.SigningKey.deriveFromSeed(
      await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedAsync(
        derivationOptionsJson,
        DerivableObjectNames.SigningKey
      ),
      derivationOptionsJson
    ).getSignatureVerificationKey()

  /**
   * Implement [DiceKeysIntentApiClient.unsealWithUnsealingKey] with the necessary permissions checks
   */
  public unsealWithUnsealingKey = async (
    packagedSealedMessage: PackagedSealedMessage
  ) : Promise<Uint8Array> =>
    this.seededCryptoModule.UnsealingKey.deriveFromSeed(
        await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedToUnsealAsync(
          packagedSealedMessage,
          DerivableObjectNames.UnsealingKey
        ),
        packagedSealedMessage.derivationOptionsJson
      ).unseal(packagedSealedMessage)

  /**
   * Implement [DiceKeysIntentApiClient.generateSignature] with the necessary permissions checks
   */
  public generateSignature = async (
    derivationOptionsJson: string,
    message: Uint8Array
  ): Promise<[Uint8Array, SignatureVerificationKey]> => {
    const signingKey = this.seededCryptoModule.SigningKey.deriveFromSeed(
      await this.permissionCheckedSeedAccessor.getSeedOrThrowIfClientNotAuthorizedAsync(
          derivationOptionsJson,
          DerivableObjectNames.SigningKey
        ),
        derivationOptionsJson
      );
    return [ signingKey.generateSignature(message), signingKey.getSignatureVerificationKey()]
  }
}