import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Order {
    customerName: string;
    orderId: bigint;
    timestamp: bigint;
    items: Array<Item>;
    phoneNumber: string;
}
export interface Item {
    itemName: string;
    quantity: bigint;
}
export interface backendInterface {
    getAllOrders(): Promise<Array<Order>>;
    placeOrder(customerName: string, phoneNumber: string, items: Array<Item>): Promise<bigint>;
}
