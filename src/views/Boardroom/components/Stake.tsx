import React, {useMemo} from 'react';
import styled from 'styled-components';

import {Box, Button, Card, CardContent, Typography} from '@material-ui/core';

// import Button from '../../../components/Button';
// import Card from '../../../components/Card';
// import CardContent from '../../../components/CardContent';
import CardIcon from '../../../components/CardIcon';
import {AddIcon, RemoveIcon} from '../../../components/icons';
import IconButton from '../../../components/IconButton';
import Label from '../../../components/Label';
import Value from '../../../components/Value';

import useApprove, {ApprovalState} from '../../../hooks/useApprove';
import useModal from '../../../hooks/useModal';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdrawCheck from '../../../hooks/boardroom/useWithdrawCheck';

import {getDisplayBalance} from '../../../utils/formatBalance';

import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useRespectFinance from '../../../hooks/useRespectFinance';
import ProgressCountdown from './ProgressCountdown';
import useStakedBalanceOnBoardroom from '../../../hooks/useStakedBalanceOnBoardroom';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import useUnstakeTimerBoardroom from '../../../hooks/boardroom/useUnstakeTimerBoardroom';
import TokenSymbol from '../../../components/TokenSymbol';
import useStakeToBoardroom from '../../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../../hooks/useWithdrawFromBoardroom';

const Stake: React.FC = () => {
  const respectFinance = useRespectFinance();
  const [approveStatus, approve] = useApprove(respectFinance.RSHARE, respectFinance.contracts.Boardroom.address);

  const tokenBalance = useTokenBalance(respectFinance.RSHARE);
  const stakedBalance = useStakedBalanceOnBoardroom();
  const {from, to} = useUnstakeTimerBoardroom();

  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars('RSHARE', respectFinance.RShare);
  const tokenPriceInDollars = useMemo(
    () =>
      stakedTokenPriceInDollars
        ? (Number(stakedTokenPriceInDollars) * Number(getDisplayBalance(stakedBalance))).toFixed(2).toString()
        : null,
    [stakedTokenPriceInDollars, stakedBalance],
  );
  // const isOldBoardroomMember = boardroomVersion !== 'latest';

  const {onStake} = useStakeToBoardroom();
  const {onWithdraw} = useWithdrawFromBoardroom();
  const canWithdrawFromBoardroom = useWithdrawCheck();

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'RShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'RShare'}
    />,
  );

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="RShare" />
              </CardIcon>
              <Value value={getDisplayBalance(stakedBalance)} />
              <Label text={`≈ $${tokenPriceInDollars}`} variant="yellow" />
              <Label text={'RShare Staked'} variant="yellow" />
            </StyledCardHeader>
            <StyledCardActions>
              {approveStatus !== ApprovalState.APPROVED ? (
                <Button
                  disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                  className={approveStatus !== ApprovalState.NOT_APPROVED ? 'shinyButton' : 'shinyButtonDisabled'}
                  style={{marginTop: '20px'}}
                  onClick={approve}
                >
                  Approve RShare
                </Button>
              ) : (
                <>
                  <IconButton disabled={!canWithdrawFromBoardroom} onClick={onPresentWithdraw}>
                    <RemoveIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                  </IconButton>
                  <StyledActionSpacer />
                  <IconButton onClick={onPresentDeposit}>
                    <AddIcon color={!canWithdrawFromBoardroom ? '' : 'yellow'} />
                  </IconButton>
                </>
              )}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      <Box mt={2} style={{color: '#FFF'}}>
        {canWithdrawFromBoardroom ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{textAlign: 'center'}}>Withdraw possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Withdraw available in" />
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

const StyledCardHeader = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;
const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
  width: 100%;
`;

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Stake;
