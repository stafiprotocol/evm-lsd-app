import classNames from "classnames";

type CustomTagProps = React.PropsWithChildren<{
  type?: "stroke" | "primary";
}>;

export const CustomTag = (props: CustomTagProps) => {
  const { type } = props;
  return (
    <div
      className={classNames(
        "rounded-[.06rem] px-[.04rem] py-[.04rem] text-[.12rem] flex items-center justify-center",
        !type || type === "primary" ? "text-white" : "text-color-text1",
        {
          "border-[0.01rem] border-text1/10 dark:border-text1Dark/10":
            type === "stroke",
        }
      )}
      style={{
        background: !type || type === "primary" ? "#6E54FF" : "none",
      }}
    >
      {props.children}
    </div>
  );
};
