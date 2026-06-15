// 东/西阿拉伯数字转换。计算器结果默认西阿拉伯数字（0-9，易读易复制），
// 提供东阿拉伯数字（٠-٩）显示开关。纯函数，不依赖 DOM。

const WESTERN = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const EASTERN = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** 把字符串中的西阿拉伯数字转为东阿拉伯数字。 */
export function toEasternNumerals(str) {
  return String(str).replace(/[0-9]/g, (d) => EASTERN[WESTERN.indexOf(d)]);
}

/** 把字符串中的东阿拉伯数字转回西阿拉伯数字。 */
export function toWesternNumerals(str) {
  return String(str).replace(/[٠-٩]/g, (d) => WESTERN[EASTERN.indexOf(d)]);
}

/**
 * 按用户偏好渲染数字。
 * @param {number|string} value
 * @param {'western'|'eastern'} system
 */
export function renderNumerals(value, system = 'western') {
  return system === 'eastern' ? toEasternNumerals(value) : String(value);
}
