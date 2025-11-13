import { Popover } from "@mui/material";
import classNames from "classnames";
import { CustomButton } from "components/common/CustomButton";
import { NoticeDrawer } from "components/drawer/NoticeDrawer";
import { SettingsDrawer } from "components/drawer/SettingsDrawer";
import { Icomoon } from "components/icon/Icomoon";
import { useAppDispatch, useAppSelector } from "hooks/common";
import { useAppSlice } from "hooks/selector";
import { useWalletAccount } from "hooks/useWalletAccount";
import noticeIcon from "public/images/notice.png";
import notice2Icon from "public/images/notice2.png";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import Image from "next/image";
import auditIcon from "public/images/audit.svg";
import defaultAvatar from "public/images/default_avatar.png";
import { useEffect, useMemo, useState } from "react";
import { connectMetaMask, disconnectWallet } from "redux/reducers/WalletSlice";
import { RootState } from "redux/store";
import { getShortAddress } from "utils/stringUtils";
import { getEvmChainId } from "config/env";
import {
  getAuditList,
  getLsdTokenName,
  getSupportChains,
  getTokenChainName,
  getTokenName,
  getTokenStandard,
} from "utils/configUtils";
import { getChainIcon, getLsdTokenIcon } from "utils/iconUtils";
import { useConnect, useDisconnect } from "wagmi";
import { PageTitleContainer } from "components/common/PageTitleContainer";
import { CustomTag } from "components/common/CustomTag";
import { formatNumber } from "utils/numberUtils";
import { useApr } from "hooks/useApr";
import { useBalance } from "hooks/useBalance";
import { useLsdTokenRate } from "hooks/useLsdTokenRate";
import logoImg from "public/images/logo.svg";

const Navbar = () => {
  const { unreadNoticeFlag } = useAppSlice();
  const { darkMode } = useAppSelector((state) => state.app);

  const { apr } = useApr();
  const { lsdBalance } = useBalance();
  const rate = useLsdTokenRate();

  const [noticeDrawerOpen, setNoticeDrawerOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [auditExpand, setAuditExpand] = useState(false);
  const [pageWidth, setPageWidth] = useState(
    document.documentElement.clientWidth
  );
  const { metaMaskAccount } = useWalletAccount();

  const stakedToken = useMemo(() => {
    console.log({ lsdBalance, rate });
    if (isNaN(Number(lsdBalance)) || isNaN(Number(rate))) {
      return "--";
    }
    return Number(lsdBalance) * Number(rate);
  }, [lsdBalance, rate]);

  const resizeListener = () => {
    const clientW = document.documentElement.clientWidth;
    setPageWidth(clientW);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    resizeListener();

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <div
      style={{
        background: darkMode
          ? "#222C3C"
          : "linear-gradient(180deg, #EAE6FC 0%, #C4B9FF 100%)",
      }}
    >
      <div className="py-[.36rem] flex items-center justify-center">
        <div className="w-smallContentW xl:w-contentW 2xl:w-largeContentW mx-auto flex items-center justify-between relative">
          <div
            className={classNames("absolute top-[.11rem] w-[.82rem] h-[.2rem]")}
          ></div>

          <div className={classNames("flex items-center")}>
            {/* <AuditComponent
              expand={auditExpand}
              onExpandChange={setAuditExpand}
            /> */}
            <div className="relative w-[.216rem] h-[.1365rem]">
              <Image src={logoImg} fill alt="logo" />
            </div>
          </div>

          <div className={classNames("flex items-center")}>
            <div className={classNames("ml-[.16rem]")}>
              {metaMaskAccount ? (
                <UserInfo auditExpand={auditExpand} />
              ) : (
                <ConnectButton />
              )}
            </div>

            <div
              className={classNames(
                "cursor-pointer ml-[.3rem] w-[.42rem] h-[.42rem] flex items-center justify-center rounded-[.12rem] relative",
                noticeDrawerOpen ? "bg-color-selected" : ""
              )}
              onClick={() => {
                setSettingsDrawerOpen(false);
                setNoticeDrawerOpen(!noticeDrawerOpen);
              }}
            >
              <div className="h-[.25rem] w-[.22rem] relative">
                <Image
                  src={darkMode ? notice2Icon : noticeIcon}
                  layout="fill"
                  alt="notice"
                />
              </div>

              {unreadNoticeFlag && (
                <div className="bg-error rounded-full w-[.06rem] h-[.06rem] absolute right-[0.08rem] top-[0.08rem]"></div>
              )}
            </div>

            <div
              className={classNames(
                "cursor-pointer ml-[.3rem] w-[.42rem] h-[.42rem] flex items-center justify-center rounded-[.12rem]",
                settingsDrawerOpen ? "bg-color-selected" : ""
              )}
              onClick={() => {
                setNoticeDrawerOpen(false);
                setSettingsDrawerOpen(!settingsDrawerOpen);
              }}
            >
              <Icomoon
                icon="more"
                size=".2rem"
                color={darkMode ? "#6c86ad" : "#222C3C"}
              />
            </div>
          </div>

          <SettingsDrawer
            open={settingsDrawerOpen}
            onChangeOpen={setSettingsDrawerOpen}
          />

          <NoticeDrawer
            open={noticeDrawerOpen}
            onChangeOpen={setNoticeDrawerOpen}
          />
        </div>
      </div>

      <PageTitleContainer>
        <div className="h-full flex items-center w-smallContentW xl:w-contentW 2xl:w-largeContentW">
          <div className="w-[.68rem] h-[.68rem] flex items-center justify-center bg-white rounded-full">
            <div className="w-[.41rem] h-[.41rem] relative">
              <Image src={getLsdTokenIcon()} layout="fill" alt="icon" />
            </div>
          </div>
          <div className="ml-[.12rem]">
            <div className="flex items-center">
              <div className="text-[.34rem] font-[700] text-color-text1">
                {getLsdTokenName()}
              </div>

              <div className="ml-[.16rem]">
                <CustomTag type="stroke">
                  <div className="text-[.16rem] scale-75 origin-center">
                    {getTokenStandard()}
                  </div>
                </CustomTag>
              </div>

              <div className="ml-[.06rem]">
                <CustomTag>
                  <div className="text-[.16rem] scale-75 origin-center flex items-center">
                    <span className="font-[700]">
                      {formatNumber(apr, { decimals: 2 })}%
                    </span>
                    <span className="ml-[.02rem]">APR</span>
                  </div>
                </CustomTag>
              </div>

              {/* <div
                className="ml-[.24rem] flex items-center cursor-pointer"
                onClick={() => {
                  addLsdTokenToMetaMask();
                }}
              >
                <div className="text-color-link text-[.14rem]">
                  Add {getLsdTokenName()} to Wallet
                </div>

                <span className="ml-[.06rem] flex items-center">
                  <Icomoon icon="share" size=".12rem" />
                </span>
              </div> */}
            </div>

            <div className="mt-[.04rem] text-color-text2 text-[.16rem] scale-75 origin-bottom-left">
              On {getSupportChains().join(", ")} Chain
            </div>
          </div>

          {metaMaskAccount && (
            <div className="ml-auto mr-[.56rem] flex flex-col justify-center items-end">
              <div className="text-[.34rem] font-[700] text-color-text1">
                {formatNumber(lsdBalance)}
              </div>
              <div className="text-[.12rem] text-color-text1 mt-[.04rem]">
                {formatNumber(stakedToken)} {getTokenName()} Staked
              </div>
            </div>
          )}
        </div>
      </PageTitleContainer>
    </div>
  );
};

const UserInfo = (props: { auditExpand: boolean }) => {
  const { auditExpand } = props;
  const dispatch = useAppDispatch();
  const { metaMaskAccount } = useWalletAccount();
  const { disconnectAsync } = useDisconnect();
  const { darkMode } = useAppSelector((state: RootState) => {
    return {
      darkMode: state.app.darkMode,
    };
  });

  const hideAddress = useMemo(() => {
    return auditExpand;
  }, [auditExpand]);

  const addressPopupState = usePopupState({
    variant: "popover",
    popupId: "address",
  });

  return (
    <div className="h-[.42rem] bg-color-bg2 rounded-[.6rem] flex items-stretch">
      <div
        className={classNames(
          "items-center pl-[.04rem] pr-[.12rem] rounded-l-[.6rem] cursor-pointer",
          auditExpand ? "hidden 2xl:flex" : "flex"
        )}
      >
        <div className="w-[.34rem] h-[.34rem] relative">
          <Image
            src={getChainIcon()}
            alt="logo"
            className="rounded-full  overflow-hidden"
            layout="fill"
          />
        </div>

        <div
          className={classNames("ml-[.08rem] text-[.16rem] text-color-text1")}
        >
          {getTokenChainName()}
        </div>

        {/* <div className="ml-[.12rem]">
          <Icomoon icon="arrow-down" size=".1rem" color="#848B97" />
        </div> */}
      </div>

      <div
        className={classNames(
          "self-center h-[.22rem] w-[.01rem] bg-[#DEE6F7] dark:bg-[#6C86AD80]",
          auditExpand ? "hidden 2xl:flex" : "flex"
        )}
      />

      <div
        className={classNames(
          "cursor-pointer pr-[.54rem] flex items-center rounded-r-[.6rem] relative",
          addressPopupState.isOpen ? "bg-color-selected" : "",
          auditExpand
            ? "rounded-[.6rem] pl-[.04rem] 2xl:rounded-r-[.6rem] 2xl:pl-[.12rem]"
            : "rounded-r-[.6rem]  pl-[.12rem]"
        )}
        {...bindTrigger(addressPopupState)}
      >
        <Image
          src={defaultAvatar}
          alt="logo"
          className="w-[.34rem] h-[.34rem] rounded-full"
        />

        {!hideAddress && (
          <div
            className={classNames(
              "mx-[.12rem] text-[.16rem]",
              addressPopupState.isOpen ? "text-text1 " : "text-color-text1"
            )}
          >
            {getShortAddress(metaMaskAccount, 5)}
          </div>
        )}

        <TestnetTag />
      </div>

      {/* Address Menu */}
      <Popover
        {...bindPopover(addressPopupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        elevation={0}
        sx={{
          marginTop: ".15rem",
          "& .MuiPopover-paper": {
            background: darkMode ? "#6C86AD4D" : "#ffffff80",
            border: darkMode
              ? "0.01rem solid #6C86AD80"
              : "0.01rem solid #FFFFFF",
            backdropFilter: "blur(.4rem)",
            borderRadius: ".3rem",
          },
          "& .MuiTypography-root": {
            padding: "0px",
          },
          "& .MuiBox-root": {
            padding: "0px",
          },
        }}
      >
        <div
          className={classNames("p-[.16rem] w-[2rem]", darkMode ? "dark" : "")}
        >
          <div
            className="cursor-pointer flex items-center justify-between"
            onClick={() => {
              navigator.clipboard.writeText(metaMaskAccount || "").then(() => {
                addressPopupState.close();
              });
            }}
          >
            <div className="flex items-center">
              <div className="ml-[.12rem] text-color-text1 text-[.16rem]">
                Copy Address
              </div>
            </div>
          </div>

          <div className="my-[.16rem] h-[0.01rem] bg-color-divider1" />

          <div
            className="cursor-pointer flex items-center justify-between"
            onClick={async () => {
              addressPopupState.close();
              disconnectAsync();
              dispatch(disconnectWallet());
            }}
          >
            <div className="ml-[.12rem] text-color-text1 text-[.16rem]">
              Disconnect
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
};

const ConnectButton = () => {
  const { metaMaskAccount } = useWalletAccount();

  const { connectAsync, connectors } = useConnect();

  const clickConnectWallet = async () => {
    const metamaskConnector = connectors.find(
      (item) => item.name === "MetaMask"
    );
    // todo: install metamask
    if (!metamaskConnector) return;
    if (!metaMaskAccount) {
      await connectAsync({ connector: metamaskConnector }).catch((err) =>
        console.log(err)
      );
    }
  };

  return (
    <CustomButton
      // type="small"
      height=".42rem"
      onClick={() => {
        clickConnectWallet();
      }}
      border="none"
      // textColor={darkMode ? "#E8EFFD" : ""}
    >
      Connect Wallet
    </CustomButton>
  );
};

interface AuditComponentProps {
  expand: boolean;
  onExpandChange: (expand: boolean) => void;
}

const AuditComponent = (props: AuditComponentProps) => {
  const { expand, onExpandChange } = props;
  const { darkMode } = useAppSlice();
  const { metaMaskAccount } = useWalletAccount();

  useEffect(() => {
    if (metaMaskAccount) {
      onExpandChange(false);
    }
  }, [metaMaskAccount, onExpandChange]);

  return (
    <div
      className={classNames(
        "h-[.42rem] rounded-[.3rem] border-[#6C86AD]/20 flex items-center",
        expand ? "border-[0.01rem]" : ""
      )}
    >
      <div
        className="cursor-pointer ml-[.04rem] w-[.34rem] h-[.34rem] p-[.06rem] relative rounded-full bg-color-bg1"
        onClick={() => {
          onExpandChange(!expand);
        }}
      >
        <div className="w-full h-full relative">
          <Image src={auditIcon} alt="audit" layout="fill" />
        </div>
      </div>

      <div
        className={classNames(
          "items-center origin-left",
          expand ? "animate-expand flex" : "animate-collapse hidden"
        )}
      >
        <div
          className="text-color-text2 ml-[.06rem] text-[.14rem] w-[.8rem] min-w-[.8rem] break-normal"
          style={
            {
              // maxLines: 1,
              // overflow: "hidden",
              // textOverflow: "ellipsis",
              // WebkitLineClamp: 1,
              // lineClamp: 1,
              // display: "-webkit-box",
              // WebkitBoxOrient: "vertical",
            }
          }
        >
          Audited By
        </div>

        {getAuditList().map(
          (item: { name: string; icon: string; iconDark: string }) => (
            <div
              className="ml-[.1rem] w-[.8rem] h-[.17rem] relative"
              key={item.name}
            >
              <Image
                src={darkMode ? item.iconDark : item.icon}
                alt="audit"
                layout="fill"
              />
            </div>
          )
        )}

        <div
          className="mx-[.12rem] cursor-pointer"
          onClick={() => {
            onExpandChange(false);
          }}
        >
          <Icomoon icon="collapse" size=".12rem" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

const TestnetTag = () => {
  return (
    <div className="bg-[#FFCD29] border-[.01rem] border-white/50 text-[.12rem] leading-[.18rem] text-text1 flex items-center justify-center px-[.06rem] py-[.04rem] absolute top-0 right-0 rounded-[.08rem]">
      Testnet
    </div>
  );
};
