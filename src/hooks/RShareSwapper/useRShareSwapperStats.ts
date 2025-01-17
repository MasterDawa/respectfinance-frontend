import {useEffect, useState} from 'react';
import useRespectFinance from '../useRespectFinance';
import {RShareSwapperStat} from '../../respect-finance/types';
import useRefresh from '../useRefresh';

const useRShareSwapperStats = (account: string) => {
  const [stat, setStat] = useState<RShareSwapperStat>();
  const {fastRefresh /*, slowRefresh*/} = useRefresh();
  const respectFinance = useRespectFinance();

  useEffect(() => {
    async function fetchRSwapperStat() {
      try {
        if (respectFinance.myAccount) {
          setStat(await respectFinance.getRShareSwapperStat(account));
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchRSwapperStat();
  }, [setStat, respectFinance, fastRefresh, account]);

  return stat;
};

export default useRShareSwapperStats;
