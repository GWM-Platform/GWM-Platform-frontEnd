
import React from "react";
import { PDFViewer } from '@react-pdf/renderer';
import TransactionReceipt from "Receipts/TransactionReceipt";

const TestPDF = () => {

  const Transaction = {
    "id": 51,
    "clientId": 4,
    "fundId": 2,
    "stateId": 2,
    "shares": 1.4627,
    "sharePrice": 1435.7,
    "createdAt": "2022-05-19T20:07:42.656Z",
    "updatedAt": "2022-06-30T12:37:38.000Z",
    "accountAlias": "Matias Podrojsky (4)",
    state: "Approved",
  }


  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <TransactionReceipt Transaction={Transaction} />
    </PDFViewer>
  );
}

export default TestPDF
