import rgbHex from "rgb-hex";
import color from "css-color-function";
import elementPlusStyle from "element-plus/dist/index.css";
// 传入主色值
const formula = {
  "shade-1": "color(primary shade(10%))",
  "light-1": "color(primary tint(10%))",
  "light-2": "color(primary tint(20%))",
  "light-3": "color(primary tint(30%))",
  "light-4": "color(primary tint(40%))",
  "light-5": "color(primary tint(50%))",
  "light-6": "color(primary tint(60%))",
  "light-7": "color(primary tint(70%))",
  "light-8": "color(primary tint(80%))",
  "light-9": "color(primary tint(90%))",
  "dark-2": "color(primary shade(20%))",
  subMenuHover: "color(primary tint(70%))",
  subMenuBg: "color(primary tint(80%))",
  menuHover: "color(primary tint(90%))",
  menuBg: "color(primary)",
};

const generateColors = (primary) => {
  if (!primary) {
    return;
  }
  const colors = {
    primary,
  };
  // 遍历所有key值
  Object.keys(formula).forEach((key) => {
    const value = formula[key].replace(/primary/g, primary);
    // 转化rgb颜色为十六进制
    colors[key] = "#" + rgbHex(color.convert(value));
  });
  return colors;
};
const getStyleTemplate = (data) => {
  // element-plus 默认色值
  const colorMap = {
    "#3a8ee6": "shade-1",
    "#409eff": "primary",
    "#53a8ff": "light-1",
    "#66b1ff": "light-2",
    "#79bbff": "light-3",
    "#8cc5ff": "light-4",
    "#a0cfff": "light-5",
    "#b3d8ff": "light-6",
    "#c6e2ff": "light-7",
    "#d9ecff": "light-8",
    "#ecf5ff": "light-9",
    "#337ecc": "dark-2",
  };
  Object.keys(colorMap).forEach((key) => {
    const value = colorMap[key];
    data = data.replace(new RegExp(key, "ig"), value);
  });
  return data;
};

// 获取当前element-plus的默认样式表
const getOriginalStyle = async () => {
  return getStyleTemplate(elementPlusStyle);
};

/*
 *根据主题色 生成最新的样式表
 */
const generateNewStyle = async (parimaryColor: any) => {
  // 1. 根据主色生成色值表
  const colors: any = generateColors(parimaryColor);
  // 2. 获取当前默认样式表，并且把需要替换的色值打上标记
  let cssText = await getOriginalStyle();
  // 3. 遍历生成的色值表，在默认样式表全局替换
  Object.keys(colors).forEach((key) => {
    cssText = cssText.replace(
      new RegExp("(:|\\s+)" + key, "g"),
      "$1" + colors[key]
    );
  });
  return cssText;
};

// 把生成的样式表写入style
const writeNewStyle = (elNewStyle) => {
  const style = document.createElement("style");
  style.innerText = elNewStyle;
  document.head.appendChild(style);
};

export const confirm = async () => {
  // 1.1 获取主题色
  const newStyleText = await generateNewStyle("#876f8e");
  // 1.2 写入最新主题色
  writeNewStyle(newStyleText);
};
