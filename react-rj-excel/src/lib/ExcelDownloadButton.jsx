import { useState } from "react";
import { useExcelDownload } from "./useExcelDownload.js";
import { DownloadIcon, Spinner } from "./icons.jsx";

const DIRECTIONS = {
  right: "to right",
  left: "to left",
  top: "to top",
  bottom: "to bottom",
  "top-right": "to top right",
  "top-left": "to top left",
  "bottom-right": "to bottom right",
  "bottom-left": "to bottom left",
};

const SIZES = {
  sm: { padding: "6px 12px", fontSize: 13, icon: 14, gap: 6, square: 32 },
  md: { padding: "10px 18px", fontSize: 15, icon: 18, gap: 8, square: 40 },
  lg: { padding: "13px 24px", fontSize: 17, icon: 22, gap: 10, square: 48 },
};

// "right" -> "to right", 45 -> "45deg", or raw CSS like "to bottom right"
function toCssDirection(dir) {
  if (typeof dir === "number") return `${dir}deg`;
  return DIRECTIONS[dir] ?? dir;
}

export function ExcelDownloadButton({
  // ---- button look ----
  label = "Download Excel",
  color = "#2563EB",
  textColor,
  gradient, // e.g. ["#f97316", "#ec4899", "#8b5cf6"] (2 or 3 colors)
  gradientDirection = "right", // right | left | top | bottom | top-right ... | 45
  variant = "solid", // solid | outline
  size = "md", // sm | md | lg
  borderRadius = 8,
  icon, // custom React node, or false for no icon
  iconPosition = "left", // left | right | only
  fullWidth = false,
  loadingText,
  disabled = false,
  className,
  style,

  // ---- excel data ----
  headers,
  rows,
  fileName,
  sheetName,
  sheetTheme, // blue | green | dark | minimal
  mergeDown,
  freezeHeader,
  getData, // optional: () => ({ headers, rows, fileName }) sync or async

  // ---- callbacks ----
  onSuccess,
  onError,
  ...rest
}) {
  const { download, loading } = useExcelDownload({ onSuccess, onError });
  const [hover, setHover] = useState(false);

  const s = SIZES[size] ?? SIZES.md;
  const iconOnly = iconPosition === "only" || iconPosition === "center";
  const isGradient = Array.isArray(gradient) && gradient.length >= 2;
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;

  const mainColor = isGradient ? gradient[0] : color;
  const background = isOutline
    ? "transparent"
    : isGradient
    ? `linear-gradient(${toCssDirection(gradientDirection)}, ${gradient
        .slice(0, 3)
        .join(", ")})`
    : color;

  const buttonStyle = {
    display: fullWidth && !iconOnly ? "flex" : "inline-flex",
    width: iconOnly ? s.square : fullWidth ? "100%" : undefined,
    height: iconOnly ? s.square : undefined,
    padding: iconOnly ? 0 : s.padding,
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    fontSize: s.fontSize,
    fontWeight: 600,
    fontFamily: "inherit",
    lineHeight: 1.2,
    borderRadius,
    border: isOutline ? `2px solid ${mainColor}` : "none",
    background,
    color: textColor ?? (isOutline ? mainColor : "#fff"),
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.6 : 1,
    userSelect: "none",
    transition: "filter .15s, box-shadow .15s",
    filter: hover && !isDisabled ? "brightness(1.08)" : "none",
    boxShadow:
      hover && !isDisabled && !isOutline ? "0 4px 12px rgba(0,0,0,.18)" : "none",
    ...style,
  };

  // Decide which icon to show
  let iconNode;
  if (loading) iconNode = <Spinner size={s.icon} />;
  else if (icon === false && !iconOnly) iconNode = null;
  else if (icon && icon !== true) iconNode = icon;
  else iconNode = <DownloadIcon size={s.icon} />;

  const iconEl = iconNode ? (
    <span style={{ display: "inline-flex" }} aria-hidden="true">
      {iconNode}
    </span>
  ) : null;

  const text = loading && loadingText ? loadingText : label;

  // Reads the latest props at click time, so data can change dynamically
  const handleClick = () =>
    download(async () => {
      const extra = getData ? await getData() : {};
      return {
        headers,
        rows,
        fileName,
        sheetName,
        theme: sheetTheme,
        mergeDown,
        freezeHeader,
        ...extra,
      };
    });

  return (
    <button
      type="button"
      {...rest}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={isDisabled}
      aria-busy={loading}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : rest.title}
      className={className}
      style={buttonStyle}
    >
      {iconOnly ? (
        iconEl
      ) : (
        <>
          {iconPosition !== "right" && iconEl}
          <span>{text}</span>
          {iconPosition === "right" && iconEl}
        </>
      )}
    </button>
  );
}