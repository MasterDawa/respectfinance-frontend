import React, {useMemo} from 'react';
import styled from 'styled-components';

import {Box, Button, Card, CardContent, Typography} from '@material-ui/core';

import TokenSymbol from '../../../components/TokenSymbol';
import Label from '../../../components/Label';
import Value from '../../../components/Value';
import CardIcon from '../../../components/CardIcon';
import useClaimRewardTimerBoardroom from '../../../hooks/boardroom/useClaimRewardTimerBoardroom';
import useClaimRewardCheck from '../../../hooks/boardroom/useClaimRewardCheck';
import ProgressCountdown from './ProgressCountdown';
import useHarvestFromBoardroom from '../../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';
import useRespectStats from '../../../hooks/useRespectStats';
import {getDisplayBalance} from '../../../utils/formatBalance';

const Harvest: React.FC = () => {
  const respectStats = useRespectStats();
  const {onReward} = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();

  const tokenPriceInDollars = useMemo(
    () => (respectStats ? Number(respectStats.priceInDollars).toFixed(2) : null),
    [respectStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const {from, to} = useClaimRewardTimerBoardroom();

  return (
    <Box>
      <Card>
        <CardContent>
          <StyledCardContentInner>
            <StyledCardHeader>
              <CardIcon>
                <TokenSymbol symbol="RESPECT" />
              </CardIcon>
              <Value value={getDisplayBalance(earnings)} />
              <Label text={`≈ $${earnedInDollars}`} variant="yellow" />
              <Label text="RESPECT Earned" variant="yellow" />
            </StyledCardHeader>
            <StyledCardActions>
              <Button
                // style={{width: '47%'}}
                onClick={onReward}
                className={earnings.eq(0) || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward
              </Button>
              {/* <div style={{margin: 'auto auto'}}/>
              <Button
                style={{width: '47%'}}
                onClick={compoundApprovalState === ApprovalState.APPROVED ? onCompound : approveCompound}
                className={!canCompound || !canClaimReward ? 'shinyButtonDisabled' : 'shinyButton'}
                disabled={!canCompound || !canClaimReward}
              >
                {compoundApprovalState === ApprovalState.APPROVED ? 'Compound 🔄' : 'Approve 🔄'}
              </Button> */}
            </StyledCardActions>
          </StyledCardContentInner>
        </CardContent>
      </Card>
      <Box mt={2} style={{color: '#FFF'}}>
        {canClaimReward ? (
          ''
        ) : (
          <Card>
            <CardContent>
              <Typography style={{textAlign: 'center'}}>Claim possible in</Typography>
              <ProgressCountdown hideBar={true} base={from} deadline={to} description="Claim available in" />
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
  margin-top: ${(props) => props.theme.spacing[6]}px;
  width: 100%;
`;

const StyledCardContentInner = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;

export default Harvest;
