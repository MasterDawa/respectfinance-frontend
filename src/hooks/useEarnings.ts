import {useCallback, useEffect, useState} from 'react';
import {BigNumber} from 'ethers';
import useRespectFinance from './useRespectFinance';
import {ContractName} from '../respect-finance';
import config from '../config';

const useEarnings = (poolName: ContractName, earnTokenName: String, poolId: Number) => {
  const [balance, setBalance] = useState(BigNumber.from(0));
  const respectFinance = useRespectFinance();
  const isUnlocked = respectFinance?.isUnlocked;

  const fetchBalance = useCallback(async () => {
    const balance = await respectFinance.earnedFromBank(poolName, earnTokenName, poolId, respectFinance.myAccount);
    setBalance(balance);
  }, [poolName, earnTokenName, poolId, respectFinance]);

  useEffect(() => {
    if (isUnlocked) {
      fetchBalance().catch((err) => console.error(err.stack));

      const refreshBalance = setInterval(fetchBalance, config.refreshInterval);
      return () => clearInterval(refreshBalance);
    }
  }, [isUnlocked, poolName, respectFinance, fetchBalance]);

  return balance;
};

export default useEarnings;
