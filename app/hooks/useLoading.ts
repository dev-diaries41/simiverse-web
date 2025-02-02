import React, {useLayoutEffect, useState } from 'react'

const useLoading = (defaultState: boolean = false) => {
    const [loading, setLoading] = useState(defaultState);
    const [minimize, setMinimize] = useState(false);
    const showLoadingDialog = loading && !minimize;
    const showLoadingMiniIndicator = loading && minimize;
  

    const minimizeLoader = () => {
        setMinimize(true);
    }

    useLayoutEffect(() => {
        if(!loading && minimize){
            setMinimize(false);
        }
    }, [minimize, loading])

    return {
        loading, 
        setLoading,
        minimize,
        minimizeLoader,
        showLoadingDialog,
        showLoadingMiniIndicator
    };
}

export default useLoading;

