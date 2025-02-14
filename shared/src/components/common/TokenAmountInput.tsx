import React from 'react';

import { SquareInputWithMax } from './Input';
import { Text } from './Typography';
import { Token } from '../../data/Token';
import { formatNumberInput, truncateDecimals } from '../../util/Numbers';
import styled from 'styled-components';

import ErrorIcon from '../../assets/svg/InteractionError';

const INPUT_LABEL_TEXT_COLOR = 'rgba(255, 255, 255, 1)';
const BALANCE_VALUE_TEXT_COLOR = 'rgba(75, 105, 128, 1)';

const ErrorMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ErrorMessageText = styled.div`
  color: rgba(235, 87, 87, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

export type TokenAmountInputProps = {
  value: string;
  token: Token;
  onChange: (newValue: string) => void;
  // NOTE: if onMax is defined, onChange will not run when max button is clicked
  onMax?: (maxValue: string) => void;
  max?: string;
  maxed?: boolean;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  onBlur?: () => void;
};

export default function TokenAmountInput(props: TokenAmountInputProps) {
  const { value, token, onChange, onMax, max, maxed, error, errorMessage, disabled, onBlur } = props;
  return (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-2'>
        <Text size='M' weight='medium' color={INPUT_LABEL_TEXT_COLOR}>
          {token.symbol}
        </Text>
        {max !== undefined && (
          <Text size='XS' weight='medium' color={BALANCE_VALUE_TEXT_COLOR}>
            Balance: {max}
          </Text>
        )}
      </div>
      <SquareInputWithMax
        size='L'
        inputClassName={value !== '' ? 'active' : ''}
        placeholder='0.00'
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const output = formatNumberInput(event.target.value);
          if (output !== null) {
            const truncatedOutput = truncateDecimals(output, token.decimals);
            onChange(truncatedOutput);
          }
        }}
        value={value}
        onMaxClick={() => {
          if (max) {
            onMax ? onMax(max) : onChange(max.toString());
          }
        }}
        maxDisabled={maxed}
        maxHidden={max === undefined}
        fullWidth={true}
        onBlur={onBlur}
        disabled={disabled}
      />
      {error && (
        <ErrorMessageWrapper>
          <ErrorIcon width={16} height={16} />
          <ErrorMessageText>{errorMessage ? errorMessage : 'Invalid input'}</ErrorMessageText>
        </ErrorMessageWrapper>
      )}
    </div>
  );
}
