// import styles from "./approve-api-command.module.css";
// import layoutStyles from "../layout.module.css";

// import {
// //  Exceptions,
//   Recipe, ApiCalls
// } from "@dicekeys/dicekeys-api-js";
// import {
//   Attributes,
//   Component, Appendable
// } from "../../web-component-framework";
// import {
//   mutateRequest
// } from "../../api-handler/mutate-request";
// import {
//   DiceKey,
//   DiceKeyInHumanReadableForm,
// } from "../../dicekeys/dicekey";
// // import {
// //   DiceKeySvg
// // } from "../display-dicekey/dicekey-svg";
// import {
//   CopyablePasswordFieldView
// } from "../selected-dicekey/CopyablePasswordFieldView";
// import {
// //  describeFrameOfReferenceForReallyBigNumber,
//   describeHintPurpose, describeHost
// } from "../../phrasing/api";
// import { 
//   Div,
//   Label,
//   TextInput,
// //  A,
//   Observable,
//   MonospaceSpan,
//   Span,
//   Checkbox,
//   RadioButton
// } from "../../web-component-framework";
// // import {
// //   DiceKeyAppState
// // } from "../../state";
// import {
//   extraRequestRecipeAndInstructions
// } from "../../api-handler/get-requests-recipe";
// import {
//   ApiRequestContext, ConsentResponse
// } from "../../api-handler/QueuedApiRequest";
// import {
//   ComputeApiCommandWorker
// } from "../../workers/call-api-command-worker";
// import { PasswordJson } from "@dicekeys/seeded-crypto-js";
// import { DICEKEY } from "../../web-components/dicekey-styled";
// import {
//   mayRecipeBeModified
// } from "../../api-handler/mutate-recipe";
// // We recommend you never write down your DiceKey (there are better ways to copy it)
// // or read it over the phone (which you should never be asked to do), but if you
// // had a legitimate reason to, removing orientations make it easier and more reliable.

// // By removing orientations from your DiceKey before generating a ___,
// // your DiceKey will be more than a quadrillion
// // (one million billion) times easier to guess, but the number of possible
// // values will still be ... 

// // This hint makes your DiceKey 303,600 easier to guess.  However, the number of possible
// // guesses is still greater than ... .
// // The hint does make it possible for others to know that you used the same  DiceKey for multiple
// // accounts.

// export interface ApproveApiCommandOptions extends Attributes {
//   requestContext: ApiRequestContext
//   diceKey: DiceKey
// }

// export class ApproveApiCommand extends Component<ApproveApiCommandOptions> {

// //  private readonly recipeObjectInOriginalRequest: Recipe;
//   private excludeOrientationOfFaces?: boolean;
//   private seedHint?: string;

//   private readonly mayRecipeBeModified: boolean;
//   private static readonly computeApiCommandWorker = new ComputeApiCommandWorker();
 

//   /**
//    * The code supporting the demo page cannot until the WebAssembly module for the image
//    * processor has been loaded. Pass the module to wire up the page with this class.
//    * @param module The web assembly module that implements the DiceKey image processing.
//    */
//   constructor(
//     options: ApproveApiCommandOptions
// ) {
//     super(options);
//     const requestContext = this.options.requestContext;
//     const request = requestContext.request;
//     const {recipe} = extraRequestRecipeAndInstructions(request);
//     const recipeObject = Recipe(recipe);
//     this.mayRecipeBeModified = mayRecipeBeModified(request);

//     // Components of derivation that can be modified
//     this.excludeOrientationOfFaces = recipeObject.excludeOrientationOfFaces;
//     this.seedHint = recipeObject.seedHint;

//     // Kick of computation of initial values calculated by workers.
//     ApproveApiCommand.computeApiCommandWorker.calculate({
//       request,
//       seedString: DiceKey.toSeedString(this.options.diceKey, !this.excludeOrientationOfFaces),
//     });
//     // After this class is constructed, kick of background calculations.
//     setTimeout( () => this.updateBackgroundOperationsForRecipe(), 1);
//     if ( request.command === ApiCalls.Command.getPassword ) {
//       (ApproveApiCommand.computeApiCommandWorker.resultPromise as Promise<ApiCalls.GetPasswordSuccessResponse>).then(
//         precomputedResult => this.password.value = (JSON.parse(precomputedResult.passwordJson) as PasswordJson).password
//       ).catch( (e: unknown) => 
//         this.throwException(e, "precomputing an API command")
//       );
//     }  
//   }

//   private updateBackgroundOperationsForRecipe = async () => {
//     await ApproveApiCommand.computeApiCommandWorker.calculate({
//       seedString: this.seedString,
//       request: await mutateRequest({
//         request: this.options.requestContext.request,
//         seedString: this.seedString,
//         excludeOrientationOfFaces: this.excludeOrientationOfFaces,
//         seedHint: this.seedHint,
//       })
//     });
//     this.renderSoon();
//   }

//   private get diceKey(): DiceKey {
//     return this.options.diceKey;
//   }

//   private get seedString(): DiceKeyInHumanReadableForm {
//     return DiceKey.toSeedString(this.options.diceKey, !!this.excludeOrientationOfFaces);
//   }


//   private get cornerLettersClockwise(): string {
//     const diceKey = this.diceKey;
//     if (typeof diceKey === "undefined") {
//       return "";
//     }
//     return DiceKey.cornerIndexesClockwise
//       .map( index => diceKey[index].letter )
//       .join("");
//   }


  
//   // private get strength(): number {
//   //   const letterCount = 25; // FIXME - this.?.length || 0;
//   //   var fromLetters = 1;
//   //   for (var i=2; i <= letterCount; i++) fromLetters *= i;
//   //   const fromDigits = 6 ** 25;
//   //   const fromOrientations: number = 
//   //     this.recipeObject.excludeOrientationOfFaces ? 1 :
//   //     4 ** 25;
//   //   return fromLetters * fromDigits * fromOrientations;
//   // }

//   // private get strengthMessage(): string {
//   //   // ",000" for US factor of 3, ".000" for jurisdictions that use that.
//   //   const zerosForThreeDecimalOrdersOfMagnitude = (1000).toLocaleString().substr(1);

//   //   var strength = this.strength;
//   //   const bits = Math.floor(Math.log2(strength));
//   //   var decimal: string = "";
//   //   while (strength > 1000000000) {
//   //     strength /= 10000;
//   //     decimal += zerosForThreeDecimalOrdersOfMagnitude;
//   //   }
//   //   decimal = Math.floor(strength).toLocaleString() + decimal;

//   //   return `Attackers must guess from ${decimal} possible values (${bits.toLocaleString()} bits of strength)`;
//   // }

//   password = new Observable<string>();
//   obscurePassword = new Observable<boolean>(true);
// //  private setDiceKeySvg = this.replaceableChild<DiceKeySvg>();


//   public getResponseReturnUponUsersConsent = async (): Promise<ConsentResponse> => {
//     const seedString = this.seedString;
//     const mutatedRequest = await mutateRequest({
//       seedString,
//       request: this.options.requestContext.request,
//       excludeOrientationOfFaces: this.excludeOrientationOfFaces,
//       seedHint: this.seedHint,
//     });
//     return {
//         seedString,
//         mutatedRequest
//     };
//   }


//   renderDiceKey = () => {
//     if (!this.diceKey) {
//       return;
//     }
//     // const diceKeySvg = this.setDiceKeySvg(new DiceKeySvg({
//     //   diceKey: this.excludeOrientationOfFaces ?
//     //     DiceKey.removeOrientations(this.diceKey) :
//     //     this.diceKey,
//     //   obscureByDefault: true,
//     //   overlayMessage: {
//     //     message: "press to open box",
//     //     fontFamily: "Sans-Serif",
//     //     fontColor: "#00A000",
//     //     fontWeight: 600,
//     //   }
//     // }));
//     // return diceKeySvg;
//   }

//   handleOrientationCheckboxClicked = (excludeOrientationOfFaces: boolean) => {
//     if (this.mayRecipeBeModified) {
//       this.excludeOrientationOfFaces = excludeOrientationOfFaces;
//       this.updateBackgroundOperationsForRecipe();
//       this.renderDiceKey()
//     }
//   }

//   render() {
//     super.render();
//     this.addClass(layoutStyles.CenteredColumn);

//     //var orientationCheckbox: Checkbox;
//     this.append(
//       Div({class: styles.dicekey_container},
// //        this.renderDiceKey()
//       )
//     );
//     if (this.mayRecipeBeModified) {
//       this.append(
//         Div({class: "orientation-widget"},
//           Div({}, `Orientation of individual dice`),
//           Label({}, RadioButton({name: "orientation", value: "preserve", ...(!this.excludeOrientationOfFaces ? {checked: ""} : {})}).with( r => r.events.click.on( () => {
//             this.excludeOrientationOfFaces = false;
//             this.renderSoon();
//           }) ), "Preserve"),
//           Label({},
//             RadioButton({
//                 name: "orientation",
//                 value:"remove",
//                 ...(!!this.excludeOrientationOfFaces ? {checked: ""} : {}),
//                 events: (events) => {
//                   events.click.on( () => {
//                     this.excludeOrientationOfFaces = true;
//                     this.renderSoon();
//                   })
//                 }
//               },
//             ),
//           "Remove",
//           )
//         )
//       );
//     }
//     // this.append(
//     //   Div({class: styles.dicekey_preservation_instruction},
//     //     Span({text: `When you make your choice, the DiceKeys app will forget your DiceKey.  If you want to keep this app open and your DiceKey in memory, `}, '&nbsp;'),
//     //     A({href: window.origin, target:"_blank"}).append(`open a new app tab`),
//     //     `&nbsp;`,
//     //     Span({text: ` first.`}),      
//     //   ).withElement( div => {
//     //     DiceKeyAppState.instance!.windowsOpen.changedEvent.onChangeAndInitialValue( () => {
//     //       div.style.setProperty("visibility", DiceKeyAppState.instance!.windowsOpen.areThereOthers ? "hidden" : "visible")
//     //     } );
//     //   }),
//     // );
//     var hintPurpose: Appendable | undefined;
//     if (this.mayRecipeBeModified && (hintPurpose = describeHintPurpose(this.options.requestContext.request.command)) != null) {
//       var cornerCheckbox: Checkbox | undefined;
//       var hintTextFieldLabel: Label | undefined;
//       this.append(
//         Div().append(
//           Div().append(
//             `Include hint(s) to help you find the same `, DICEKEY() ,` to ${hintPurpose}.`
//           ),
//           Div().append(
//             cornerCheckbox = Checkbox(),
//             Label({for: cornerCheckbox?.primaryElementId}).append(
//               `Include the corner letters of your `, DICEKEY(), `: `,
//               MonospaceSpan({text: this.cornerLettersClockwise}),
//               `.`
//             ),
//           ),
//           Div().append(
//             hintTextFieldLabel = Label().appendText(`Custom hint:`),
//             TextInput().with( t => { 
//               t.primaryElement.setAttribute("size", "60")
//               hintTextFieldLabel?.primaryElement.setAttribute("for", t.primaryElementId)
//               t.events.change.on( () => {
//                 this.seedHint = t.value;
//                 this.updateBackgroundOperationsForRecipe();
//               })
//             })
//           )
//         )
//       );
//     }
//     if (this.options.requestContext.request.command === ApiCalls.Command.getPassword) {
//       this.append(
//         Div({class: layoutStyles.CenteredColumn},
//           Div({class: styles.password_to_be_shared_label}, Span({},
//             `password to be sent to&nbsp;`),
//             describeHost(this.options.requestContext.host
//           )),
//           new CopyablePasswordFieldView({
//             password: this.password,
//             obscurePassword: this.obscurePassword,
//             showCopyIcon: true
//           })
//         ).withElement( e =>
//           this.password.observe( (password) => e.style.setProperty("visibility",
//             password ? "visible" : "hidden"
//           ))
//         )
//       );
//     }


//   }


// }
