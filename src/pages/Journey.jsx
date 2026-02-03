import { useParams } from "react-router-dom";

export default function Journey() {
  const { customerId } = useParams();
  return <h2>Journey for Customer {customerId}</h2>;
}