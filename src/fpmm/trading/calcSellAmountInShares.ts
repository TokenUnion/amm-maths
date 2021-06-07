import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { WeiPerEther as ONE } from "@ethersproject/constants";
import { ceilDiv } from "../../utils";

/**
 * Computes the amount of outcome tokens sold for a given return amount
 * @param returnAmount - the amount of collateral to be received
 * @param outcomeIndex - the index of the outcome token being sold
 * @param poolBalances - the market maker's balances of outcome tokens before the trade
 * @param fee - the percentage fees taken by the market maker on each trade
 */
export const calcSellAmountInShares = (
  returnAmount: BigNumberish,
  outcomeIndex: number,
  poolBalances: BigNumberish[],
  fee: BigNumberish,
): BigNumber => {
  const returnAmountPlusFees = BigNumber.from(returnAmount)
    .mul(ONE)
    .div(ONE.sub(fee));
  const sellTokenPoolBalance = poolBalances[outcomeIndex];

  const endingOutcomeBalance = poolBalances.reduce((accumulator: BigNumber, poolBalance, i) => {
    return i === outcomeIndex
      ? accumulator
      : ceilDiv(accumulator.mul(poolBalance), BigNumber.from(poolBalance).sub(returnAmountPlusFees));
  }, BigNumber.from(sellTokenPoolBalance).mul(ONE));

  return returnAmountPlusFees.add(ceilDiv(endingOutcomeBalance, ONE)).sub(sellTokenPoolBalance);
};
