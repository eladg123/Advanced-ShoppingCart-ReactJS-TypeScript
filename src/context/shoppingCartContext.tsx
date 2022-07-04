import { useContext,createContext ,ReactNode,useState} from "react";
import ShoppingCart from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

type ShoppingCartProviderProps = {
    children:ReactNode
}

type CartItem = {
    id:number
    quantity:number
}

type ShoppingCartContext={
    openCart: ()=> void;
    closeCart: ()=>void;
    cartQuantity: number;
    cartItems: CartItem[];
    getItemsQuantity: (id:number)=> number;
    increaseCartQuantity: (id:number)=> void;
    decreaseCartQuantity: (id:number)=> void;
    removeFromCart: (id:number)=> void;

}


const ShoppingCartContext = createContext({} as ShoppingCartContext)

export function useShoppingCart(){
   
    return useContext(ShoppingCartContext)
}




export function ShoppingCartProvider({children} : ShoppingCartProviderProps){
    const [cartItems,setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[])
    const [isOpen,setIsOpen] = useState<boolean>(false)
const cartQuantity = cartItems.reduce((quantity,item)=> item.quantity+ quantity,0);

function getItemsQuantity(id:number){
    return cartItems.find((item)=> item.id === id)?.quantity || 0;  
   }
  
   function increaseCartQuantity(id:number){
      setCartItems((currentItems : CartItem[]) =>{
          if(currentItems.find(item=> item.id === id) == null){
              return [...currentItems,{id,quantity:1}]
          }else{
             return currentItems.map(item=>{
              if(item.id === id){
                  return {...item,quantity:item.quantity+1}
              }else{
                  return item
              }
             })
          }
      })  
     }
  
     function decreaseCartQuantity(id:number){
      setCartItems((currentItems : CartItem[]) =>{
          if(currentItems.find(item=> item.id === id)?.quantity === 1){
              return currentItems.filter((item)=> item.id !== id)
          }else{
             return currentItems.map(item=>{
              if(item.id === id){
                  return {...item,quantity:item.quantity-1}
              }else{
                  return item
              }
             })
          }
      })  
     }
  
     function removeFromCart(id:number){
   setCartItems(currentItems=>{
      return currentItems.filter(item=> item.id !== id)
   })
     }
     const openCart = ()=> setIsOpen(true);
     const closeCart = ()=> setIsOpen(false);
    return(
        <ShoppingCartContext.Provider value={{getItemsQuantity,increaseCartQuantity,decreaseCartQuantity,removeFromCart,cartItems,cartQuantity,openCart,closeCart}}>
            {children}
            <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
    )
}
