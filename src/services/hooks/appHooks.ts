import {useEffect, useState} from "react";
import {_debounce} from "../../utils/functions";
import {EwindowSizes, windowSize} from "../../utils/enum";


export const useWindowSize = (size?: windowSize) => {
  const [current, setCurrent] = useState<windowSize>(EwindowSizes.Xl);
  const [sizes, setSizes] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(
    function () {
      if (sizes.width >= 1200 && sizes.height >= 800) {
        setCurrent(EwindowSizes["Xl"]);
      } else if (sizes.width >= 768 && sizes.height >= 600) {
        setCurrent(EwindowSizes["M"]);
      } else {
        setCurrent(EwindowSizes["S"]);
      }
    },
    [sizes]
  );
  window.addEventListener("resize", function () {
    _debounce(function () {
      setSizes({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    });
  });

  return {
    current,
    size: size === current,
  };
};
