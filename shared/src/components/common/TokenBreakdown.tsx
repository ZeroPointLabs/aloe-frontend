import React from 'react';
import styled from 'styled-components';
import { Text } from './Typography';
import { GREY_700 } from '../../data/constants/Colors';

const LABEL_TEXT_COLOR = 'rgba(75, 105, 128, 1)';
const VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

const TokenBreakdownWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  column-gap: 0.75rem;
  padding: 16px;
  border: 1px solid ${GREY_700};
  border-radius: 8px;
`;

export type TokenBreakdownProps = {
  token0Symbol: string;
  token1Symbol: string;
  token0Estimate: string;
  token1Estimate: string;
};

export default function TokenBreakdown(props: TokenBreakdownProps) {
  const { token0Symbol, token1Symbol, token0Estimate, token1Estimate } = props;
  return (
    <div className='w-full grid grid-cols-2 gap-x-2'>
      <TokenBreakdownWrapper>
        <Text size='XS' weight='medium' color={LABEL_TEXT_COLOR}>
          {token0Symbol}
        </Text>
        <Text
          size='M'
          weight='medium'
          color={VALUE_TEXT_COLOR}
          title={token0Estimate}
          className='overflow-hidden text-ellipsis whitespace-nowrap'
        >
          {token0Estimate}
        </Text>
      </TokenBreakdownWrapper>
      <TokenBreakdownWrapper>
        <Text size='XS' weight='medium' color={LABEL_TEXT_COLOR}>
          {token1Symbol}
        </Text>
        <Text
          size='M'
          weight='medium'
          color={VALUE_TEXT_COLOR}
          title={token1Estimate}
          className='overflow-hidden text-ellipsis whitespace-nowrap'
        >
          {token1Estimate}
        </Text>
      </TokenBreakdownWrapper>
    </div>
  );
}
