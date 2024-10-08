export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
}

export const updateCart = (state) => {
       // Calculate Item Price 
       state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item)=> acc + item.price * item.qty, 0));

       //calculate shipping price
       state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

       // Calculate Total Price
       state.totalPrice = (
           Number(state.itemsPrice) + Number(state.shippingPrice)
       ).toFixed(2);

       localStorage.setItem('cart', JSON.stringify(state));
       
       return state;
}