import { useEffect, useState } from 'react';

import Big from 'big.js';
import { Kitty } from 'shared/lib/data/Kitty';
import { Token } from 'shared/lib/data/Token';
import { useContractRead } from 'wagmi';

import KittyABI from '../../assets/abis/Kitty.json';

export function useAmountToShares(token: Token, kitty: Kitty, withdrawAmount: string) {
  const [state, setState] = useState<string | null>(null);
  const { data: amountOfShares } = useContractRead({
    address: kitty.address,
    abi: KittyABI,
    functionName: 'convertToShares',
    args: [new Big(withdrawAmount || '0').mul(10 ** token.decimals).toFixed(0)] as const,
    // watch: true,
  });
  useEffect(() => {
    if (amountOfShares) {
      setState(amountOfShares.toString());
    }
  }, [amountOfShares, kitty.decimals]);
  return state;
}
