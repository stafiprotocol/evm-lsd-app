import classNames from "classnames";
import { useMemo } from "react";
import { LsdTokenStake } from "./LsdTokenStake";
import { LsdTokenUnstake } from "./LsdTokenUnstake";
import { useRouter } from "next/router";
import styles from "styles/CustomButton.module.css";
import { useAppSelector } from "hooks/common";

export const StakePage = () => {
  const router = useRouter();
  const { darkMode } = useAppSelector((state) => state.app);

  const selectedTab = useMemo(() => {
    const tabParam = router.query.tab;
    if (tabParam) {
      switch (tabParam) {
        case "stake":
        case "unstake":
        case "trade":
        case "bridge":
        case "withdraw":
          return tabParam;
        default:
          return "stake";
      }
    }
    return "stake";
  }, [router.query]);

  const updateTab = (tab: string) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab,
      },
    });
  };

  return (
    <div>
      <div className="bg-white/50 dark:bg-bg2Dark rounded-[.3rem] pb-[.14rem] border-[.01rem] border-color-border1">
        <div
          className="h-[.56rem] grid items-stretch"
          style={{ gridTemplateColumns: "50% 50%" }}
        >
          <div
            className={classNames(
              "cursor-pointer flex items-center justify-center rounded-tl-[.3rem] text-[.16rem] text-color-text1 border-[0.01rem]",
              selectedTab === "stake"
                ? "font-[700] border-[#6E54FF]"
                : "border-none"
              // selectedTab === "stake" ? styles["selected-bg"] : "bg-color-bg2"
            )}
            style={{
              background:
                selectedTab === "stake"
                  ? darkMode
                    ? "#6E54FF"
                    : "linear-gradient(174.16deg, #EAE6FC 41.33%, #C4B9FF 169.02%)"
                  : darkMode
                  ? "#6c86ad4d"
                  : "#ffffff",
              borderLeftWidth: selectedTab === "stake" ? "0.01rem" : "0px",
            }}
            onClick={() => {
              updateTab("stake");
            }}
          >
            Stake
          </div>

          <div
            className={classNames(
              "cursor-pointer flex items-center justify-center rounded-tr-[.3rem] text-[.16rem] text-color-text1 border-[0.01rem]",
              selectedTab === "unstake"
                ? "font-[700] border-[#6E54FF]"
                : "border-none"
              // selectedTab === "unstake" ? styles["selected-bg"] : "bg-color-bg2"
            )}
            style={{
              background:
                selectedTab === "unstake"
                  ? darkMode
                    ? "#6E54FF"
                    : "linear-gradient(174.16deg, #EAE6FC 41.33%, #C4B9FF 169.02%)"
                  : darkMode
                  ? "#6c86ad4d"
                  : "#ffffff",
              borderLeftWidth: selectedTab === "unstake" ? "0.01rem" : "0px",
            }}
            onClick={() => {
              updateTab("unstake");
            }}
          >
            Unstake
          </div>
        </div>

        {selectedTab === "stake" && <LsdTokenStake />}

        {selectedTab === "unstake" && <LsdTokenUnstake />}
      </div>
    </div>
  );
};
