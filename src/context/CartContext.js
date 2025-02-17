import { createContext, useContext, useEffect, useState } from "react";

export const CartContext = createContext()
const productsFromLocalStorage = JSON.parse(localStorage.getItem('cart') || '[]')

export const CartProvider = ({children}) => {

    const [cart, setCart] =  useState(productsFromLocalStorage);
    useEffect(() =>{
        localStorage.setItem('cart', JSON.stringify(cart))
    },[cart])

    const addItem = (item) => {
        const existInCart = cart.find((prod)=> prod.id === item.id)
        if(existInCart){
            const noRepeat = cart.map((prod)=> {
                if(prod.id === item.id){
                    return {...prod, quantity:prod.quantity + item.quantity}
                }else{
                    return prod
                }
            })
            setCart(noRepeat)
        }else{
            setCart([...cart, item])
        }
    }
    const clear = () =>{
        setCart([])
    }

    const removeItem = (id) => {
        setCart(cart.filter((prod)=> prod.id !== id))
    }

    const isInCart = (id) => {
        return cart.some((prod)=> prod.id === id)
    }

    const cartQuantity = () =>{
        return cart.reduce((acumulador, prod) => acumulador += prod.quantity,0)
    }

    const cartTotal = () => {
        return cart.reduce((acumulador, prod)=> acumulador += prod.price * prod.quantity,0)
    }


    return(
        <CartContext.Provider value={{cart, clear, removeItem, isInCart, addItem, cartQuantity, cartTotal}}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => useContext(CartContext)