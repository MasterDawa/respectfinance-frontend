import {useEffect, useState} from 'react';
import useRespectFinance from './useRespectFinance';
import {BigNumber} from 'ethers';
import useRefresh from './useRefresh';

const useCurrentEpoch = () => {
  const [currentEpoch, setCurrentEpoch] = useState<BigNumber>(BigNumber.from(0));
  const respectFinance = useRespectFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchCurrentEpoch() {
      try {
        setCurrentEpoch(await respectFinance.getCurrentEpoch());
      } catch (err) {
        console.error(err);
      }
    }
    fetchCurrentEpoch();
  }, [setCurrentEpoch, respectFinance, slowRefresh]);

  return currentEpoch;
};

export default useCurrentEpoch;
