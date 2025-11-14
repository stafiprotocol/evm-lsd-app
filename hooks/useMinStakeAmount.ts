import {
  getStakeManagerContractAbi,
  getStakeManagerContract,
} from "config/contract";
import { readContract } from "@wagmi/core";
import { useAppSelector } from "./common";
import Web3 from "web3";
import { useEffect, useState } from "react";

export const useMinStakeAmount = () => {
  const { updateFlag } = useAppSelector((state) => state.app);

  const [minStakeAmount, setMinStakeAmount] = useState<string | undefined>();

  const fetchData = async () => {
    try {
      const result =
        (await readContract({
          address: getStakeManagerContract() as `0x${string}`,
          abi: getStakeManagerContractAbi(),
          functionName: "minStakeAmount",
        })) + "";

      setMinStakeAmount(Web3.utils.fromWei(result, "ether"));
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (updateFlag) {
      fetchData();
    }
  }, [updateFlag]);

  return minStakeAmount;
};
