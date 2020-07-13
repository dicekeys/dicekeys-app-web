import {
  ApiCalls,
  ApiStrings,
} from "@dicekeys/dicekeys-api-js";
import {
  throwIfHostNotPermitted
} from "./post-message-permission-checks";
import {
  handleApiRequest,
  ApiRequestContext,
  ConsentResponse
} from "./handle-api-request";


/**
 * 
 */
export const postMessageApiResponder = (
  getUsersConsent: (requestContext: ApiRequestContext) => Promise<ConsentResponse>,
  transmitResponseForTesting?: (response: ApiCalls.Response) => any // only set when testing
) => (candidateRequestEvent: MessageEvent) => {
  if (!(candidateRequestEvent.data && "command" in candidateRequestEvent.data && ApiStrings.isCommand(candidateRequestEvent.data.command))) {
    // This is not a request.  Ignore this message event.
    return;
  }
  const origin = candidateRequestEvent.origin;
  const {windowName, ...request} = candidateRequestEvent.data as ApiCalls.RequestMessage & ApiCalls.PostMessageRequestMetadata;
  const transmitResponse = transmitResponseForTesting ||
    (
      (response) => window.postMessage(response, origin)
    );
  // The host must match any requirements in the derivation options and
  // (for unseal operations) the UnsealingInstructions.      
  const host = origin.startsWith("https://") ? origin.substr(8) :
    origin.startsWith("http://localhost") ? "localhost" : // useful for test
      // FUTURE -- add a general SecurityException
      (() => { throw Error("DiceKeys requests must come from HTTPS origins only") } )();
  const throwIfClientNotPermitted = throwIfHostNotPermitted(host);
  const requestContext: ApiRequestContext = {
    host, request
  }
  return handleApiRequest(
    throwIfClientNotPermitted,
    getUsersConsent,
    transmitResponse,
    requestContext
  )
}
