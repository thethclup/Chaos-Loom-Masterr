/**
 * ERC-8021 Transaction Attribution
 */
export const BUILDER_CODE = "bc_0lbrlvkz";
export const ERC8021_DATA_SUFFIX =
  "0x07626173656170700080218021802180218021802180218021" as const;

export function getAttributionData(appConfigCode: string = "[ATTRIBUTION_CODE]") {
  return {
    builder: BUILDER_CODE,
    appConfig: appConfigCode,
    version: "1.0",
    standard: "ERC-8021"
  };
}

export function generateAttributedTransactionPayload(
  txData: { to: `0x${string}`; value: bigint; data?: `0x${string}` },
  _intent: string
) {
  const baseData = txData.data && txData.data !== "0x" ? txData.data : ERC8021_DATA_SUFFIX;
  return {
    to: txData.to,
    value: txData.value,
    data: baseData,
  };
}
