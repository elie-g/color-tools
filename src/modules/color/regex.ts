export const xRGB = /^#?([0-9A-Z])([0-9A-Z])([0-9A-Z])([0-9A-Z])?$/i
export const xRGBA = /^#?([0-9A-Z]{2})([0-9A-Z]{2})([0-9A-Z]{2})([0-9A-Z]{2})?$/i
export const RGB = /^rgba?\(\s*0*(?:(2(?:5[0-5]|[0-4]\d)|1?\d{1,2})|((?:\d*\.)?\d+)%)\s*[, ]\s*0*(?:(2(?:5[0-5]|[0-4]\d)|1?\d{1,2})|((?:\d*\.)?\d+)%)\s*[, ]\s*0*(?:(2(?:5[0-5]|[0-4]\d)|1?\d{1,2})|((?:\d*\.)?\d+)%)\s*(?:[,/]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%))?\)$/
export const HSL = /^hsla?\(\s*(-?(?:\d*\.)?\d+)(deg|g?rad|turn)?\s*[, ]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*[, ]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*(?:[,/]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%))?\)$/
export const HWB = /^hwb\(\s*(-?(?:\d*\.)?\d+)(deg|g?rad|turn)?\s*[, ]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*[, ]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*(?:[,/]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%))?\)$/
export const CMYK = /^device-cmyk\(\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*[, ]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*[, ]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*[, ]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%)\s*(?:[,/]\s*0*(?:((?:\d*\.)?\d+)|((?:\d*\.)?\d+)%))?\)$/