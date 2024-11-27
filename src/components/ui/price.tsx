import React from "react";
import numeral from "numeral";

const Price = ({ price }: { price: number }) => {
  const formattedPrice = numeral(price).format("0,0"); // Định dạng số theo kiểu "0,0" (200.000)

  return <span>{formattedPrice}</span>;
};

export default Price;