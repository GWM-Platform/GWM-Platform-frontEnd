
import React from "react";
import { PDFViewer } from '@react-pdf/renderer';
import TransactionReceipt from "Receipts/TransactionReceipt";
import FixedDepositReceipt from "Receipts/FixedDepositReceipt";
import MovementReceipt from "Receipts/MovementReceipt";
import TransferReceipt from "Receipts/TransferReceipt";

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
    fundName:"Real Estate"
  }

  const Movement = {
    "id": 112,
    "accountId": 4,
    "stateId": 2,
    "transactionId": 75,
    "fixedDepositId": null,
    "amount": -328.56,
    "motive": "STAKE_BUY",
    "applied": true,
    "createdAt": "2022-07-13T00:07:29.698Z",
    "fundId": 4,
    "fundName": "Real Estate Fund",
    "state": "Approved",
    "accountAlias": "Matias Podrojsky (4)"
  }

  const Transfer = {
    "id": 16,
    "senderId": 5,
    "receiverId": 4,
    "stateId": 1,
    "amount": 100,
    "createdAt": "2022-06-02T18:21:08.185Z",
    "updatedAt": "2022-06-02T18:21:08.185Z",
    "senderAlias": "Pamela Guespe (5)",
    "receiverAlias": "Matias Podrojsky (4)",
    "state": "Pending",
    "accountAlias": "Matias Podrojsky (4)",
    "incomingTransfer": true,
    "AccountId": 4
  }

  const FixedDeposit = {
    "closed": false,
    "id": 47,
    "clientId": 35,
    "initialAmount": 100,
    "interestRate": 8,
    "duration": 665,
    "startDate": "2021-01-03T00:52:52.000Z",
    "endDate": "2022-10-30T00:52:52.000Z",
    "stateId": 2,
    "createdAt": "2021-01-02T00:52:52.000Z",
    "updatedAt": "2022-07-21T21:09:57.076Z",
    "accountAlias": "Prueba final Plazo Fijo",
    "ActualProfit": {
      "fetching": false,
      "fetched": false,
      "valid": false,
      "value": 0
    },
    "ProfitAtTheEnd": {
      "fetching": false,
      "fetched": true,
      "valid": true,
      "value": 114.58
    },
    "RefundedProfit": {
      "fetching": false,
      "fetched": false,
      "valid": false,
      "value": 0
    },
    "ellapsedDays": 579,
    "AnualRate": 8,
    "state": {
      "bg": "primary",
      "text": "Ongoing"
    }
  }

  return (
    <>
     {/*<PDFViewer style={{ width: "100%", height: "100vh" }}><TransactionReceipt Transaction={Transaction} /></PDFViewer>*/}
      <PDFViewer style={{ width: "100%", height: "100vh" }}><FixedDepositReceipt FixedDeposit={FixedDeposit} /></PDFViewer>
      {/*<PDFViewer style={{ width: "100%", height: "100vh" }}><MovementReceipt Movement={Movement} /></PDFViewer>*/}
     {/* <PDFViewer style={{ width: "100%", height: "100vh" }}>  <TransferReceipt Transfer={Transfer} /></PDFViewer>*/}
    </>
  );
}

export default TestPDF
