"use client"

import { Session } from "inspector/promises";
import { SessionProvider } from "next-auth/react";
import { createContext, Dispatch, SetStateAction, useState } from "react";




export  const cartContext=createContext<{
    cartCount:number;
    setCartCount:Dispatch<SetStateAction<number>>;
}>({
    cartCount:0,
    setCartCount:()=>{},

})

export default function CartContextProvider({
    children,
}
:{children:React.ReactNode}){
    const [cartCount,setCartCount]=useState(0);
    return(
        <SessionProvider>
            <cartContext.Provider value={{cartCount,setCartCount}}>
            {children}
        </cartContext.Provider>
        </SessionProvider>
    )
}


