import {useContext, useEffect, useState} from "react";
import {_debounce} from "../../utils/functions";
import {EwindowSizes, RecordUpdateModels, windowSize} from "../../utils/enum";
import {AppContext} from "../context/app.context";
import {log} from "console";
import {useLocation} from "react-router-dom";
import {SocketListeners} from "../../utils/interface";

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

export const useCheckUserVerification = () => {
    const data = useContext(AppContext);

    return data?.isUserVerified;
};

export const useNetworkConnectivity = () => {
    let isOnline: boolean = false;

    window.addEventListener("offline", () => {
        isOnline = window.navigator.onLine;
    });
    window.addEventListener("online", () => {
        isOnline = window.navigator.onLine;
    });
    return {isOnline};
};

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function useRecordUpdateListener(model: RecordUpdateModels, ids: number | number[] | string[] | string) {
    const ctx = useContext(AppContext);
    const [update, setUpdate] = useState<{ id: number } | null>(null);
    useEffect(() => {
        if (ctx?.globalSocket?.connected) {
            console.log('[listening] records updates');
            ctx?.globalSocket?.on(SocketListeners.RECORDUPDATE, function (data: {
                model: RecordUpdateModels,
                id: number
            }) {
                console.log('[update] for record ' + model + ' has been deleted');
                if (typeof (ids) === 'number' || typeof (ids) === 'string') {
                    if (data.id === ids && data.model === model) {
                        setUpdate(data)
                    }
                } else if (Array.isArray(ids)) {
                    ids.forEach(function (id: string | number) {
                        if (id.toString() === data.id.toString()) {
                            setUpdate(data)
                        }
                    })
                }
            })
        }
    }, [ctx?.globalSocket?.connected]);
    useEffect(() => {
        if (update) {
            console.log("Cleanup");
            window.setTimeout(function () {
                setUpdate(null);
            }, 100)
        }
    }, [update]);
    return update
}