import classNames from "classnames";
import { FaqItem } from "components/common/FaqItem";
import { DashboardTabs } from "components/staking/DashboardTabs";
import { WithdrawUnstaked } from "components/staking/WithdrawUnstaked";
import { Icomoon } from "components/icon/Icomoon";
import { getLsdTokenContract, getStakeManagerContract } from "config/contract";
import { getExplorerAccountUrl } from "config/explorer";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { openLink } from "utils/commonUtils";
import {
  IFaqItem,
  getFaqList,
  getLsdTokenName,
  IFaqContent,
} from "utils/configUtils";
import { StakePage } from "components/staking/StakePage";
import { useLsdTokenRate } from "hooks/useLsdTokenRate";
import { useWalletAccount } from "hooks/useWalletAccount";
import { useApr } from "hooks/useApr";
import { useWithdrawInfo } from "hooks/useWithdrawInfo";
import { getEvmChainId } from "config/env";
import { useTotalStaked } from "hooks/useTotalStaked";
import { usePrice } from "hooks/usePrice";
import { BubblesLoading } from "components/common/BubblesLoading";
import { formatNumber } from "utils/numberUtils";

const TokenPage = () => {
  const router = useRouter();

  const { withdrawInfo } = useWithdrawInfo();
  const totalStaked = useTotalStaked();

  const { metaMaskAccount, metaMaskChainId } = useWalletAccount();
  const rate = useLsdTokenRate();
  const { tokenPrice } = usePrice();

  const totalStakedValue = useMemo(() => {
    if (
      isNaN(Number(totalStaked)) ||
      isNaN(Number(rate)) ||
      isNaN(Number(tokenPrice))
    ) {
      return "--";
    }
    return Number(totalStaked) * Number(rate) * Number(tokenPrice);
  }, [totalStaked, rate, tokenPrice]);

  const selectedTab = useMemo(() => {
    const tabParam = router.query.tab;
    if (tabParam) {
      switch (tabParam) {
        case "stake":
        case "unstake":
        case "withdraw":
          return tabParam;
        default:
          return "stake";
      }
    }
    return "stake";
  }, [router.query]);

  const isWrongMetaMaskNetwork = useMemo(() => {
    return Number(metaMaskChainId) !== getEvmChainId();
  }, [metaMaskChainId]);

  const showWithdrawTab = useMemo(() => {
    return (
      !isWrongMetaMaskNetwork &&
      !isNaN(Number(withdrawInfo.overallAmount)) &&
      Number(withdrawInfo.overallAmount) > 0
    );
  }, [withdrawInfo, isWrongMetaMaskNetwork]);

  const updateTab = (tab: string) => {
    router.replace({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab,
      },
    });
  };

  const renderFaqContent = (content: IFaqContent, index: number) => {
    if (content.type === "link") {
      if (content.content.endsWith("\n")) {
        return (
          <div className={classNames(index > 0 ? "mt-faqGap" : "")} key={index}>
            <a
              className="text-color-link cursor-pointer"
              href={content.link}
              target="_blank"
              rel="noreferrer"
            >
              {content.content.trimEnd()}
            </a>
          </div>
        );
      } else {
        return (
          <a
            className="text-color-link cursor-pointer"
            href={content.link}
            target="_blank"
            rel="noreferrer"
            key={index}
          >
            {content.content}
          </a>
        );
      }
    } else {
      if (content.content.endsWith("\n")) {
        return (
          <div className={classNames(index > 0 ? "mt-faqGap" : "")} key={index}>
            {content.content}
          </div>
        );
      } else {
        return <span key={index}>{content.content}</span>;
      }
    }
  };

  const renderFaqContents = (contents: IFaqContent[]) => {
    const renderedJSX: React.ReactElement[] = [];
    contents.forEach((content: IFaqContent, index: number) => {
      const contentJSX = renderFaqContent(content, index);
      renderedJSX.push(contentJSX);
    });
    return renderedJSX;
  };

  return (
    <div>
      <div className="w-smallContentW xl:w-contentW 2xl:w-largeContentW mx-auto">
        <div className="my-[.36rem] mr-[.56rem]">
          {showWithdrawTab && (
            <DashboardTabs
              selectedTab={selectedTab}
              onChangeTab={updateTab}
              showWithdrawTab={showWithdrawTab}
            />
          )}

          <div className="mt-[.36rem] flex ">
            <div className={classNames("flex-1 min-w-[6.2rem] w-[6.2rem]")}>
              {(selectedTab === "stake" || selectedTab === "unstake") && (
                <StakePage />
              )}

              {selectedTab === "withdraw" && (
                <WithdrawUnstaked withdrawInfo={withdrawInfo} />
              )}
            </div>

            <div className="ml-[.87rem] flex-1">
              <div className="mt-[.16rem] bg-color-bg3 rounded-[.12rem] py-[.16rem] px-[.24rem] text-[.14rem]">
                <div className="text-color-text1 font-[700]">Total Staked</div>

                <div className="mt-[.12rem] text-color-text2 flex items-center justify-between text-[.28rem]">
                  <div>
                    {isNaN(Number(totalStaked)) ? (
                      <BubblesLoading />
                    ) : (
                      formatNumber(totalStaked, { decimals: 4 }) + " MON"
                    )}
                  </div>
                  <div>
                    {isNaN(Number(totalStakedValue)) ? (
                      <BubblesLoading />
                    ) : (
                      "$" + formatNumber(totalStakedValue, { decimals: 2 })
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-[.16rem] bg-color-bg3 rounded-[.12rem] py-[.16rem] px-[.24rem] text-[.14rem]">
                <div className="text-color-text1 font-[700]">
                  {getLsdTokenName()} Token Contract Address
                </div>

                <div
                  className="cursor-pointer mt-[.12rem] text-color-link flex items-center"
                  onClick={() => {
                    openLink(getExplorerAccountUrl(getLsdTokenContract()));
                  }}
                >
                  <span className="mr-[.12rem] flex-1 break-all leading-normal dark:text-linkDark/50">
                    {getLsdTokenContract()}
                  </span>

                  <div className="min-w-[.12rem]">
                    <Icomoon icon="share" size=".12rem" />
                  </div>
                </div>

                <div className="text-color-text1 font-[700] mt-[.16rem]">
                  {getLsdTokenName()} Stake Contract Address
                </div>

                <div
                  className="cursor-pointer mt-[.12rem] text-color-link flex items-center"
                  onClick={() => {
                    openLink(getExplorerAccountUrl(getStakeManagerContract()));
                  }}
                >
                  <span className="mr-[.12rem] flex-1 break-all leading-normal dark:text-linkDark/50">
                    {getStakeManagerContract()}
                  </span>

                  <div className="min-w-[.12rem]">
                    <Icomoon icon="share" size=".12rem" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {getFaqList().length > 0 && (
          <div className={classNames("mr-[.56rem] pb-[.56rem]")}>
            <div className="mt-[.16rem] text-[.24rem] text-color-text1">
              FAQ
            </div>

            <div
              className="grid items-start mt-[.16rem]"
              style={{
                gridTemplateColumns: "48% 48%",
                columnGap: "4%",
                rowGap: ".16rem",
              }}
            >
              {getFaqList().map((item: IFaqItem, index: number) => (
                <FaqItem text={item.title} key={index}>
                  {renderFaqContents(item.contents)}
                </FaqItem>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenPage;
