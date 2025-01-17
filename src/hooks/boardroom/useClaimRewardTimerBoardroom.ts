import {useEffect, useState} from 'react';
import useRespectFinance from '../useRespectFinance';
import {AllocationTime} from '../../respect-finance/types';

const useClaimRewardTimerBoardroom = () => {
  const [time, setTime] = useState<AllocationTime>({
    from: new Date(),
    to: new Date(),
  });
  const respectFinance = useRespectFinance();

  useEffect(() => {
    if (respectFinance) {
      respectFinance.getUserClaimRewardTime().then(setTime);
    }
  }, [respectFinance]);
  return time;
};

export default useClaimRewardTimerBoardroom;
