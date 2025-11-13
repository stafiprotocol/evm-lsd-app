import { getLsdTokenContractAbi, getLsdTokenContract } from "config/contract";
import { readContract } from "@wagmi/core";
import { useAppSelector } from "./common";
import Web3 from "web3";
import { useEffect, useState } from "react";

export const useTotalStaked = () => {
  const { updateFlag } = useAppSelector((state) => state.app);

  const [totalStaked, setTotalStaked] = useState<string | undefined>();

  const fetchData = async () => {
    try {
      const result =
        (await readContract({
          address: getLsdTokenContract() as `0x${string}`,
          abi: getLsdTokenContractAbi(),
          functionName: "totalSupply",
        })) + "";

      setTotalStaked(Web3.utils.fromWei(result, "ether"));
    } catch (err: any) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (updateFlag) {
      fetchData();
    }
  }, [updateFlag]);

  return totalStaked;
};
