import React, { useContext } from 'react';

const Context = React.createContext(null);

export default function GoodsProvider (props) {

    const { children, value } = props;
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}

export function useGoodsContext() {
    return useContext(Context);
}