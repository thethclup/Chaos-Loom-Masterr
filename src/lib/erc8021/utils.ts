/**
 * ERC-8021 Transaction Attribution Placeholder
 */
export const BUILDER_CODE = "bc_0lbrlvkz";

export function getAttributionData(appConfigCode: string = "[ATTRIBUTION_CODE]") {
  return {
    builder: BUILDER_CODE,
    appConfig: appConfigCode,
    version: "1.0",
    standard: "ERC-8021"
  };
}

export function generateAttributedTransactionPayload(txData: any, intent: string) {
  return {
    ...txData,
    _attribution: getAttributionData("chaos_loom_tx_intent_" + intent)
  }
}
