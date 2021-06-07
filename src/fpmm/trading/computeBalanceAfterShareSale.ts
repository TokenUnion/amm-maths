import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { mulBN } from "../../utils";
import { computeBalanceAfterTrade } from "./computeBalanceAfterTrade";

/**
 * Computes the market maker's balances of outcome tokens after a trade to sell shares of a particular outcome
 * @param initialPoolBalances - the market maker's balances of outcome tokens before the trade
 * @param outcomeIndex - the index of the outcome token being bought
 * @param returnAmountBeforeFees - the amount of collateral being converted into outcome tokens (i.e. post fees)
 * @param sharesSoldAmount - the amount of outcome tokens being removed from the market maker
 * @param fees - the percentage fees taken by the market maker on each trade
 */
export const computeBalanceAfterShareSale = (
  initialPoolBalances: BigNumberish[],
  outcomeIndex: number,
  returnAmount: BigNumberish,
  sharesSoldAmount: BigNumberish,
  fees: number,
): BigNumber[] =>
  computeBalanceAfterTrade(
    initialPoolBalances,
    outcomeIndex,
    fees !== 1
      ? BigNumber.from(returnAmount)
          .mul(WeiPerEther)
          .div(WeiPerEther.sub(mulBN(WeiPerEther, fees)))
          .mul(-1)
      : Zero,
    BigNumber.from(sharesSoldAmount).mul(-1),
  );
