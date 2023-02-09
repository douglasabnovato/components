import React, { useState, useEffect } from "react";
import FilterableProductTable from "./FilterableProductTable";



function MockUp() {
  const [products, setProducts] = useState([]);

  function getData() {
    fetch("./dataProducts.json", {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setProducts(res.dataProducts));
  }

  useEffect(() => {
    getData();
  }, []);

  return <FilterableProductTable products={products} />;
}

export default MockUp;
