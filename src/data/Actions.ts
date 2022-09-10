import { ReactComponent as AloeLogo } from '../assets/svg/aloe_capital_logo.svg';
import { ReactComponent as UniswapLogo } from '../assets/svg/uniswap_logo.svg';
import { AloeBorrowActionCard } from '../components/borrow/actions/AloeBorrowActionCard';
import { AloeMintTokenPlusActionCard } from '../components/borrow/actions/AloeMintTokenPlusActionCard';
import { AloeRepayActionCard } from '../components/borrow/actions/AloeRepayActionCard';
import { AloeWithdrawActionCard } from '../components/borrow/actions/AloeWithdrawActionCard';
import { AloeAddMarginActionCard } from '../components/borrow/actions/AloeAddMarginActionCard';
import { AloeBurnTokenPlusActionCard } from '../components/borrow/actions/AloeBurnTokenPlusActionCard';
import UniswapAddLiquidityActionCard from '../components/borrow/actions/UniswapAddLiquidityActionCard';
import UniswapRemoveLiquidityActionCard from '../components/borrow/actions/UniswapRemoveLiquidityActionCard';
import { DropdownOption } from '../components/common/Dropdown';
import { FeeTier } from './FeeTier';
import { TokenData } from './TokenData';
import JSBI from 'jsbi';
import { Assets, isSolvent, Liabilities, MarginAccount } from './MarginAccount';
import Big from 'big.js';
import { UserBalances } from './UserBalances';
import { uniswapPositionKey } from '../util/Uniswap';
import { deepCopyMap } from '../util/Maps';

export enum ActionID {
  TRANSFER_IN,
  TRANSFER_OUT,
  MINT,
  BURN,
  BORROW,
  REPAY,
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  SWAP,
}

export function getNameOfAction(id: ActionID): string {
  switch (id) {
    case ActionID.TRANSFER_IN:
      return 'Add Margin';
    case ActionID.TRANSFER_OUT:
      return 'Withdraw';
    case ActionID.MINT:
      return 'Mint Token+';
    case ActionID.BURN:
      return 'Burn Token+';
    case ActionID.BORROW:
      return 'Borrow';
    case ActionID.REPAY:
      return 'Repay';
    case ActionID.ADD_LIQUIDITY:
      return 'Add Liquidity';
    case ActionID.REMOVE_LIQUIDITY:
      return 'Remove Liquidity';
    default:
      return 'UNKNOWN';
  }
}

// export type ActionValue = number;

export type UniswapPosition = {
  amount0?: number;
  amount1?: number;
  lower: number | null;
  upper: number | null;
  liquidity: JSBI;
};

export type UniswapPositionPrior = Omit<UniswapPosition, 'amount0' | 'amount1' | 'liquidity'>;

export enum TokenType {
  ASSET0 = 'ASSET0',
  ASSET1 = 'ASSET1',
  KITTY0 = 'KITTY0',
  KITTY1 = 'KITTY1',
}

export type AloeResult = {
  token0RawDelta?: number;
  token1RawDelta?: number;
  token0DebtDelta?: number;
  token1DebtDelta?: number;
  token0PlusDelta?: number;
  token1PlusDelta?: number;
  selectedToken: TokenType | null;
};

export type UniswapResult = {
  uniswapPosition: UniswapPosition;
  slippageTolerance?: number;
  removeLiquidityPercentage?: number;
  isToken0Selected?: boolean;
  isAmount0LastUpdated?: boolean;
};

export type ActionCardState = {
  actionId: ActionID;
  actionArgs?: string;
  textFields?: string[];
  aloeResult: AloeResult | null;
  uniswapResult: UniswapResult | null;
};

export type CumulativeActionCardResult = {
  aloeResult: AloeResult | null;
  uniswapPositions: UniswapPosition[];
};

export type ActionCardProps = {
  marginAccount: MarginAccount;
  availableBalances: UserBalances;
  uniswapPositions: UniswapPosition[];
  previousActionCardState: ActionCardState | null;
  isCausingError: boolean;
  onRemove: () => void;
  onChange: (result: ActionCardState) => void;
};

export type Action = {
  id: ActionID;
  actionCard: React.FC<ActionCardProps>;
};

export type ActionProvider = {
  name: string;
  Icon: React.FC;
  color: string;
  actions: {
    [key: string]: Action;
  };
};

export type ActionTemplate = {
  name: string;
  actions: Array<Action>;
  defaultActionStates?: Array<ActionCardState>;
};

export const MINT_TOKEN_PLUS: Action = {
  id: ActionID.MINT,
  actionCard: AloeMintTokenPlusActionCard,
};

export const BURN_TOKEN_PLUS: Action = {
  id: ActionID.BURN,
  actionCard: AloeBurnTokenPlusActionCard,
};

export const BORROW: Action = {
  id: ActionID.BORROW,
  actionCard: AloeBorrowActionCard,
};

export const REPAY: Action = {
  id: ActionID.REPAY,
  actionCard: AloeRepayActionCard,
};

export const WITHDRAW: Action = {
  id: ActionID.TRANSFER_OUT,
  actionCard: AloeWithdrawActionCard,
};

export const ADD_MARGIN: Action = {
  id: ActionID.TRANSFER_IN,
  actionCard: AloeAddMarginActionCard,
};

export const REMOVE_LIQUIDITY: Action = {
  id: ActionID.REMOVE_LIQUIDITY,
  actionCard: UniswapRemoveLiquidityActionCard,
};

export const ADD_LIQUIDITY: Action = {
  id: ActionID.ADD_LIQUIDITY,
  actionCard: UniswapAddLiquidityActionCard,
};

export const ActionProviders: { [key: string]: ActionProvider } = {
  AloeII: {
    name: 'Aloe II',
    Icon: AloeLogo,
    color: '#63b59a',
    actions: {
      MINT_TOKEN_PLUS,
      BURN_TOKEN_PLUS,
      BORROW,
      REPAY,
      WITHDRAW,
      ADD_MARGIN,
    },
  },
  UniswapV3: {
    name: 'Uniswap V3',
    Icon: UniswapLogo,
    color: '#f31677',
    actions: {
      ADD_LIQUIDITY,
      REMOVE_LIQUIDITY,
    },
  },
};

export const ActionTemplates: { [key: string]: ActionTemplate } = {
  TEN_X_LEVERAGE: {
    name: '10x Leverage',
    actions: [ADD_MARGIN, BORROW, ADD_LIQUIDITY],
    defaultActionStates: [
      {
        actionId: ADD_MARGIN.id,
        textFields: ['10'],
        aloeResult: {
          token0RawDelta: 10,
          selectedToken: TokenType.ASSET0,
        },
        uniswapResult: null,
      },
      {
        actionId: BORROW.id,
        textFields: ['100'],
        aloeResult: {
          token0RawDelta: 100,
          token0DebtDelta: 100,
          selectedToken: TokenType.ASSET0,
        },
        uniswapResult: null,
      },
      {
        actionId: ADD_LIQUIDITY.id,
        aloeResult: null,
        uniswapResult: null,
      },
    ],
  },
  MARKET_MAKING: {
    name: 'Market-Making',
    actions: [ADD_MARGIN, BORROW, BORROW, ADD_LIQUIDITY],
    defaultActionStates: [
      {
        actionId: ADD_MARGIN.id,
        textFields: ['10'],
        aloeResult: {
          token0RawDelta: 10,
          selectedToken: TokenType.ASSET0,
        },
        uniswapResult: null,
      },
      {
        actionId: BORROW.id,
        textFields: ['50'],
        aloeResult: {
          token0RawDelta: 50,
          token0DebtDelta: 50,
          selectedToken: TokenType.ASSET0,
        },
        uniswapResult: null,
      },
      {
        actionId: BORROW.id,
        textFields: ['0.03'],
        aloeResult: {
          token1RawDelta: 0.03,
          token1DebtDelta: 0.03,
          selectedToken: TokenType.ASSET1,
        },
        uniswapResult: null,
      },
      {
        actionId: ADD_LIQUIDITY.id,
        aloeResult: null,
        uniswapResult: null,
      },
    ],
  },
};

export function getDropdownOptionFromSelectedToken(
  selectedToken: TokenType | null,
  options: DropdownOption[]
): DropdownOption {
  if (options.length === 0) {
    throw new Error();
  }
  return (
    options.find((option: DropdownOption) => option.value === selectedToken) ||
    options[0]
  );
}

export function parseSelectedToken(
  value: string | undefined
): TokenType | null {
  if (!value) return null;
  return value as TokenType;
}

export function calculateUniswapEndState(
  marginAccount: MarginAccount,
  actionResults: ActionCardState[],
  uniswapPositionsI: Map<string, UniswapPosition>,
): [Map<string, UniswapPosition>, number] {
  const uniswapPositionsF = new Map<string, UniswapPosition>();
  uniswapPositionsI.forEach((v, k) => uniswapPositionsF.set(k, v));

  for (let i = 0; i < actionResults.length; i += 1) {
    const actionResult = actionResults[i];

    if (actionResult.actionId === ActionID.ADD_LIQUIDITY) {
      const pos = actionResult.uniswapResult?.uniswapPosition;
      if (!pos || !pos.lower || !pos.upper) continue; // TODO should maybe return early instead of just continuing

      const key = uniswapPositionKey(marginAccount.address, pos.lower, pos.upper);

      if (uniswapPositionsF.has(key)) {
        const oldPos = uniswapPositionsF.get(key)!;
        oldPos.liquidity = JSBI.add(oldPos.liquidity, pos.liquidity);
        uniswapPositionsF.set(key, oldPos);
        continue;
      }
      
      uniswapPositionsF.set(key, {...pos});
      continue;
    }

    if (actionResult.actionId === ActionID.REMOVE_LIQUIDITY) {
      const pos = actionResult.uniswapResult?.uniswapPosition;
      if (!pos || !pos.lower || !pos.upper) continue; // TODO should maybe return early instead of just continuing

      const key = uniswapPositionKey(marginAccount.address, pos.lower, pos.upper);
      if (uniswapPositionsF.has(key)) {
        const oldPos = uniswapPositionsF.get(key)!;

        if (JSBI.lessThan(oldPos.liquidity, pos.liquidity)) {
          // Action would result in negative liquidity!
          return [uniswapPositionsF, i];
        }
        oldPos.liquidity = JSBI.subtract(oldPos.liquidity, pos.liquidity);

        uniswapPositionsF.set(key, oldPos);
        continue;
      }
      
      console.error('Attempted to remove liquidity from a position that doens\'t exist');
      return [uniswapPositionsF, i];
    }
  }

  return [uniswapPositionsF, actionResults.length];
}

export function calculateHypotheticalUniswapStates(
  marginAccount: MarginAccount,
  actionResults: ActionCardState[],
  uniswapPositionsI: Map<string, UniswapPosition>,
): Array<Map<string, UniswapPosition>> {
  const hypotheticalUniswapStates: Map<string, UniswapPosition>[] = [deepCopyMap(uniswapPositionsI)];
  for (let i = 0; i < actionResults.length; i += 1) {
    const actionResult = actionResults[i];
    const currentPosition = actionResult.uniswapResult?.uniswapPosition;
    const uniswapPositionsTemp: Map<string, UniswapPosition> = deepCopyMap(hypotheticalUniswapStates[i]);

    if (!currentPosition || !currentPosition.lower || !currentPosition.upper) {
      hypotheticalUniswapStates.push(uniswapPositionsTemp);
      continue;
    }

    if (actionResult.actionId === ActionID.ADD_LIQUIDITY) {
      const key = uniswapPositionKey(marginAccount.address, currentPosition.lower, currentPosition.upper);
      if (uniswapPositionsTemp.has(key)) {
        const prevPosition = uniswapPositionsTemp.get(key)!;
        const copy = JSON.parse(JSON.stringify(prevPosition));
        copy.liquidity = JSBI.add(prevPosition.liquidity, currentPosition.liquidity);
        uniswapPositionsTemp.set(key, copy);
      } else {
        uniswapPositionsTemp.set(key, {...currentPosition});
      }
      hypotheticalUniswapStates.push(uniswapPositionsTemp);
    } else if (actionResult.actionId === ActionID.REMOVE_LIQUIDITY) {
      const key = uniswapPositionKey(marginAccount.address, currentPosition.lower, currentPosition.upper);
      if (uniswapPositionsTemp.has(key)) {
        const prevPosition = uniswapPositionsTemp.get(key)!;

        if (JSBI.lessThan(prevPosition.liquidity, currentPosition.liquidity)) {
          break;
        }
        const copy = JSON.parse(JSON.stringify(prevPosition));
        copy.liquidity = JSBI.subtract(prevPosition.liquidity, currentPosition.liquidity);
        uniswapPositionsTemp.set(key, copy);
      } else {
        console.error('Attempted to remove liquidity from a position that doens\'t exist');
        break;
      }
    }
  }
  return hypotheticalUniswapStates;
}

export function calculateHypotheticalStates(
  marginAccount: MarginAccount,
  actionResults: ActionCardState[],
): { assets: Assets, liabilities: Liabilities }[] {
  const hypotheticalStates: { assets: Assets, liabilities: Liabilities }[] = [{
    assets: marginAccount.assets,
    liabilities: marginAccount.liabilities,
  }];

  for (let i = 0; i < actionResults.length; i += 1) {
    const actionResult = actionResults[i];

    const assetsTemp = { ...hypotheticalStates[i].assets };
    const liabilitiesTemp = { ...hypotheticalStates[i].liabilities };

    // update assets
    assetsTemp.token0Raw += actionResult.aloeResult?.token0RawDelta ?? 0;
    assetsTemp.token1Raw += actionResult.aloeResult?.token1RawDelta ?? 0;
    assetsTemp.token0Plus += actionResult.aloeResult?.token0PlusDelta ?? 0;
    assetsTemp.token1Plus += actionResult.aloeResult?.token1PlusDelta ?? 0;
    assetsTemp.uni0 += actionResult.uniswapResult?.uniswapPosition.amount0 ?? 0;
    assetsTemp.uni1 += actionResult.uniswapResult?.uniswapPosition.amount1 ?? 0;

    // update liabilities
    liabilitiesTemp.amount0 += actionResult.aloeResult?.token0DebtDelta ?? 0;
    liabilitiesTemp.amount1 += actionResult.aloeResult?.token1DebtDelta ?? 0;

    // if any assets or liabilities are < 0, we have an issue!
    if (Object.values(assetsTemp).find((x) => x < 0) || Object.values(liabilitiesTemp).find((x) => x < 0)) {
      break;
    }

    // if the action would cause insolvency, we have an issue!
    // note: Technically (in the contracts) solvency is only checked at the end of a series of actions,
    //       not after each individual one. We tried following that pattern here, but it made the UX
    //       confusing in some cases. For example, with one set of inputs, an entire set of actions would
    //       be highlighted red to show a solvency error. But upon entering a massive value for one of those
    //       actions, the code singles that one out as problematic. In reality solvency is *also* still an issue,
    //       but to the user it looks like they've fixed solvency by entering bogus data in a single action.
    // TLDR: It's simpler to check solvency inside this for loop
    if (!isSolvent(assetsTemp, liabilitiesTemp, marginAccount.sqrtPriceX96, marginAccount.token0, marginAccount.token1)) {
      break;
    }

    // otherwise continue accumulating
    hypotheticalStates.push({
      assets: assetsTemp,
      liabilities: liabilitiesTemp,
    });
  }
  return hypotheticalStates;
}
