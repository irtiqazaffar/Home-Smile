import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const useFilter = (data) => {
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [sortedField, setSortedField] = useState("");
  const router = useRouter();

  console.log("sortedfield", data);

  const productData = useMemo(() => {
    let services = [...data];
    //filter user order
    if (router.pathname === "/user/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending"
      );
      setPending(orderPending);

      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing"
      );
      setProcessing(orderProcessing);

      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered"
      );
      setDelivered(orderDelivered);
    }

    //service sorting with low and high price
    if (sortedField === "Featured") {
      // Reset filters
      setPending([]);
      setProcessing([]);
      setDelivered([]);
      return services; // Just return original data
    }
    if (sortedField === "Low") {
      services = services?.sort(
        (a, b) => a.prices.price < b.prices.price && -1
      );
    }
    if (sortedField === "High") {
      services = services?.sort(
        (a, b) => a.prices.price > b.prices.price && -1
      );
    }

    // if (sortedField === "AtoZ") {
    //   services = services?.sort((a, b) => a.title?.en.localeCompare(b.title?.en));
    // }
    // if (sortedField === "ZtoA") {
    //   services = services?.sort((a, b) => b.title?.en.localeCompare(a.title?.en));
    // }

    if (sortedField === "Newest") {
      services = services?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortedField === "Discount") {
      services = services?.sort(
        (a, b) => a.prices.discount > b.prices.discount && -1
      );
    }
    if (sortedField === "Popularity") {
      services = services?.sort(
        (a, b) => a.rating > b.rating && -1
      );
    }
    if (sortedField === "Featured") {
      services = services;
    }

    return services;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedField, data]);

  return {
    productData,
    pending,
    processing,
    delivered,
    setSortedField,
  };
};

export default useFilter;
