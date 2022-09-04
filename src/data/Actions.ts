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

export const ActionProviders = {
  AloeII: {
    name: 'Aloe II',
    Icon: AloeLogo,
    color: '#63b59a',
    actions: {
      DEPOSIT: {
        name: 'Mint Token+',
        actionCard: AloeMintTokenPlusActionCard,
      },
      WITHDRAW: {
        name: 'Burn Token+',
        actionCard: AloeBurnTokenPlusActionCard,
      },
      BORROW: {
        name: 'Borrow',
        actionCard: AloeBorrowActionCard,
      },
      REPAY: {
        name: 'Repay',
        actionCard: AloeRepayActionCard,
      },
      TRANSFER_FROM_MARGIN_ACCOUNT: {
        name: 'Withdraw',
        actionCard: AloeWithdrawActionCard,
      },
      TRANSFER_TO_MARGIN_ACCOUNT: {
        name: 'Add Margin',
        actionCard: AloeAddMarginActionCard,
      },
    },
  },
  UniswapV3: {
    name: 'Uniswap V3',
    Icon: UniswapLogo,
    color: '#f31677',
    actions: {
      ADD_LIQUIDITY: {
        name: 'Add Liquidity',
        actionCard: UniswapAddLiquidityActionCard,
      },
      REMOVE_LIQUIDITY: {
        name: 'Remove Liquidity',
        actionCard: UniswapRemoveLiquidityActionCard,
      },
    },
  },
};

export type ActionValue = {
  numericValue: number;
  inputValue: string;
};

export type UniswapPosition = {
  amount0: ActionValue;
  amount1: ActionValue;
  lowerBound: number | null;
  upperBound: number | null;
};

export type AloeResult = {
  token0RawDelta: ActionValue;
  token1RawDelta: ActionValue;
  token0DebtDelta: ActionValue;
  token1DebtDelta: ActionValue;
  token0PlusDelta: ActionValue;
  token1PlusDelta: ActionValue;
  selectedTokenA: DropdownOption | null;
}

export type UniswapResult = {
  uniswapPosition: UniswapPosition;
  slippageTolerance?: ActionValue;
  removeLiquidityPercentage?: ActionValue;
  isToken0Selected?: boolean;
  isAmount0LastUpdated?: boolean;
}

export type ActionCardResult = {
  aloeResult: AloeResult | null;
  uniswapResult: UniswapResult | null;
}

export type CumulativeActionCardResult = {
  aloeResult: AloeResult | null;
  uniswapPositions: UniswapPosition[];
}

export type ActionCardProps = {
  token0: TokenData;
  token1: TokenData;
  feeTier: FeeTier;
  previousActionCardState: ActionCardResult | null;
  onRemove: () => void;
  onChange: (result: ActionCardResult) => void;
};

export type Action = {
  name: string;
  actionCard: React.FC<ActionCardProps>;
}

export type ActionProvider = {
  name: string;
  Icon: React.FC;
  color: string;
  actions: {
    [key: string]: {
      name: string;
      actionCard: React.FC<ActionCardProps>;
    }
  };
};

export const DEFAULT_ACTION_VALUE: ActionValue = {
  numericValue: 0,
  inputValue: '',
}
