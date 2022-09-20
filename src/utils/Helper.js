import aes from "crypto-js/aes";
import encHex from "crypto-js/enc-hex";
import padZeroPadding from "crypto-js/pad-zeropadding";
import CryptoJS from "crypto-js";

export function en(data) {
  try {
    let text =
      data !== undefined && data !== null && data !== "" ? "" + data + "" : "";
    if (text === "") {
      return text;
    }

    let key = encHex.parse(process.env.REACT_APP_EN_ID1);
    let iv = encHex.parse(process.env.REACT_APP_EN_ID2);
    let en1 = aes
      .encrypt(text, key, { iv: iv, padding: padZeroPadding })
      .toString();

    return en1;
  } catch (e) {
    return "";
  }
}

export function de(data) {
  try {
    let encrypted =
      data !== undefined && data !== null && data !== "" ? data : "";
    if (encrypted === "") {function hideShow()
      {
          let body = document.getElementById('body');
          let wrapper = document.getElementById('wrapper');
          if(body.className.indexOf('fixed-left-void') !== -1)
          {
              body.classList.remove('fixed-left-void');
              wrapper.classList.remove('enlarged');
          }
          else
          {
              body.classList.add('fixed-left-void');
              wrapper.classList.add('enlarged');
          }
      }
      return encrypted;
    }

    let key = encHex.parse(process.env.REACT_APP_EN_ID1);
    let iv = encHex.parse(process.env.REACT_APP_EN_ID2);
    let de1 = aes
      .decrypt(encrypted, key, { iv: iv })
      .toString(CryptoJS.enc.Utf8);

    return de1;
  } catch (e) {
    return "";
  }
}

export function rtrim(str, chr) {
  var rgxtrim = !chr ? new RegExp("\\s+$") : new RegExp(chr + "+$");
  return str.replace(rgxtrim, "");
}

export function ltrim(str, chr) {
  var rgxtrim = !chr ? new RegExp("^\\s+") : new RegExp("^" + chr + "+");
  return str.replace(rgxtrim, "");
}

export function getFullScreenElement()
{
  return document.getFullScreenElement || document.webkitFullscreenElement || document.mozFullscreenElement || document.msFullscreenElement;
}

export function removeDuplicate(arr, key) {
  return [...new Map(arr.map(item => [item[key], item])).values()]
}
