import Time "mo:core/Time";
import Array "mo:core/Array";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";

actor {
  type Item = {
    itemName : Text;
    quantity : Nat;
  };

  type Order = {
    orderId : Nat;
    customerName : Text;
    phoneNumber : Text;
    items : [Item];
    timestamp : Int;
  };

  var nextOrderId = 1;
  let orders = Map.empty<Nat, Order>();

  public shared ({ caller }) func placeOrder(customerName : Text, phoneNumber : Text, items : [Item]) : async Nat {
    let order : Order = {
      orderId = nextOrderId;
      customerName;
      phoneNumber;
      items;
      timestamp = Time.now();
    };

    orders.add(nextOrderId, order);

    let currentOrderId = nextOrderId;
    nextOrderId += 1;
    currentOrderId;
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    orders.values().toArray();
  };
};
