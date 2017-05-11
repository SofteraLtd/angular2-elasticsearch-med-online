/* FIXME: use this interface instead for better type checking */
/* Defines the product entity */
export interface IProduct {
    productId: number;
    productName: string;
    brand: string;
    description: string;
    price: number;
}