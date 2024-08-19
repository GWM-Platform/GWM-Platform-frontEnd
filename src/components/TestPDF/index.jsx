
import React from "react";
import { PDFViewer } from '@react-pdf/renderer';
// import TransactionReceipt from "Receipts/TransactionReceipt";
// import FixedDepositReceipt from "Receipts/FixedDepositReceipt";
// import MovementReceipt from "Receipts/MovementReceipt";
// import TransferReceipt from "Receipts/TransferReceipt";
import TransactionTable from "TableExport/TransactionTable";

const TestPDF = () => {

  // const Transaction = {
  //   "id": 51,
  //   "clientId": 4,
  //   "fundId": 2,
  //   "stateId": 2,
  //   "shares": 1.4627,
  //   "sharePrice": 1435.7,
  //   "createdAt": "2022-05-19T20:07:42.656Z",
  //   "updatedAt": "2022-06-30T12:37:38.000Z",
  //   "accountAlias": "Matias Podrojsky (4)",
  //   state: "Approved",
  //   fundName:"Real Estate"
  // }

  // const Movement = {
  //   "id": 112,
  //   "accountId": 4,
  //   "stateId": 2,
  //   "transactionId": 75,
  //   "fixedDepositId": null,
  //   "amount": -328.56,
  //   "motive": "STAKE_BUY",
  //   "applied": true,
  //   "createdAt": "2022-07-13T00:07:29.698Z",
  //   "fundId": 4,
  //   "fundName": "Real Estate Fund",
  //   "state": "Approved",
  //   "accountAlias": "Matias Podrojsky (4)"
  // }

  // const Transfer = {
  //   "id": 16,
  //   "senderId": 5,
  //   "receiverId": 4,
  //   "stateId": 1,
  //   "amount": 100,
  //   "createdAt": "2022-06-02T18:21:08.185Z",
  //   "updatedAt": "2022-06-02T18:21:08.185Z",
  //   "senderAlias": "Pamela Guespe (5)",
  //   "receiverAlias": "Matias Podrojsky (4)",
  //   "state": "Pending",
  //   "accountAlias": "Matias Podrojsky (4)",
  //   "incomingTransfer": true,
  //   "AccountId": 4
  // }

  // const FixedDeposit = {
  //   "closed": false,
  //   "id": 47,
  //   "clientId": 35,
  //   "initialAmount": 100,
  //   "interestRate": 8,
  //   "duration": 665,
  //   "startDate": "2021-01-03T00:52:52.000Z",
  //   "endDate": "2022-10-30T00:52:52.000Z",
  //   "stateId": 2,
  //   "createdAt": "2021-01-02T00:52:52.000Z",
  //   "updatedAt": "2022-07-21T21:09:57.076Z",
  //   "accountAlias": "Prueba final Plazo Fijo",
  //   "ActualProfit": {
  //     "fetching": false,
  //     "fetched": false,
  //     "valid": false,
  //     "value": 0
  //   },
  //   "ProfitAtTheEnd": {
  //     "fetching": false,
  //     "fetched": true,
  //     "valid": true,
  //     "value": 114.58
  //   },
  //   "RefundedProfit": {
  //     "fetching": false,
  //     "fetched": false,
  //     "valid": false,
  //     "value": 0
  //   },
  //   "ellapsedDays": 579,
  //   "AnualRate": 8,
  //   "state": {
  //     "bg": "primary",
  //     "text": "Ongoing"
  //   }
  // }

  return (
    <>
      {/*<PDFViewer style={{ width: "100%", height: "100vh" }}><TransactionReceipt Transaction={Transaction} /></PDFViewer>*/}
      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <TransactionTable
          headerInfo={{
            clientName: "Marki Parengo",
            fundName: "Crypto",
            balance: 8.83233,
            sharePrice: 1703.8,
            balanceInCash: "15048.52",
            pendingshares: "9.91",
            performance: 3896.01
          }}
          transactions={[
            {
              "id": 169,
              "clientId": 1,
              "fundId": 2,
              "stateId": 1,
              "shares": -1,
              "sharePrice": 1703.8,
              "createdAt": "2024-08-05T17:30:12.660Z",
              "updatedAt": "2024-08-05T17:30:12.660Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 168,
              "clientId": 1,
              "fundId": 2,
              "stateId": 1,
              "shares": 6.59174,
              "sharePrice": 1703.8,
              "createdAt": "2024-08-05T17:30:03.249Z",
              "updatedAt": "2024-08-05T17:30:03.249Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 155,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1524.38,
              "createdAt": "2024-01-15T13:20:43.589Z",
              "updatedAt": "2024-04-12T15:47:18.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 154,
              "clientId": 1,
              "fundId": 2,
              "stateId": 5,
              "shares": -1,
              "sharePrice": 1342.51,
              "createdAt": "2023-11-14T15:05:58.879Z",
              "updatedAt": "2023-11-14T15:05:58.879Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 7,
              "senderId": 32,
              "receiverId": 1,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1349.24,
              "fundId": 2,
              "reverted": true,
              "createdAt": "2023-08-03T14:53:16.538Z",
              "updatedAt": "2023-08-03T14:53:16.538Z",
              "senderAlias": "Prueba Plazo Fijo 14/07",
              "receiverAlias": "Marcos Parengo",
              "userId": 1,
              "movementId": 492,
              "notes": [
                {
                  "id": 53,
                  "text": "Transferencia revertida",
                  "noteType": "TRANSFER_MOTIVE",
                  "userName": "Marki Parengo",
                  "createdAt": "2023-08-03T14:53:16.571Z"
                }
              ]
            },
            {
              "id": 6,
              "senderId": 1,
              "receiverId": 32,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1351.49,
              "fundId": 2,
              "reverted": false,
              "createdAt": "2023-08-03T14:11:05.377Z",
              "updatedAt": "2023-08-03T19:54:46.000Z",
              "senderAlias": "Marcos Parengo",
              "receiverAlias": "Prueba Plazo Fijo 14/07",
              "userId": 47,
              "movementId": 490,
              "notes": []
            },
            {
              "id": 5,
              "senderId": 32,
              "receiverId": 1,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1351.49,
              "fundId": 2,
              "reverted": false,
              "createdAt": "2023-08-03T14:10:44.904Z",
              "updatedAt": "2023-08-03T14:10:44.904Z",
              "senderAlias": "Prueba Plazo Fijo 14/07",
              "receiverAlias": "Marcos Parengo",
              "userId": 1,
              "movementId": 488,
              "notes": []
            },
            {
              "id": 4,
              "senderId": 1,
              "receiverId": 32,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1349.24,
              "fundId": 2,
              "reverted": true,
              "createdAt": "2023-08-03T13:41:50.779Z",
              "updatedAt": "2023-08-03T14:53:16.000Z",
              "senderAlias": "Marcos Parengo",
              "receiverAlias": "Prueba Plazo Fijo 14/07",
              "userId": 14,
              "movementId": 486,
              "notes": []
            },
            {
              "id": 3,
              "senderId": 32,
              "receiverId": 1,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1349.24,
              "fundId": 2,
              "reverted": false,
              "createdAt": "2023-08-03T13:28:56.826Z",
              "updatedAt": "2023-08-03T13:28:56.826Z",
              "senderAlias": "Prueba Plazo Fijo 14/07",
              "receiverAlias": "Marcos Parengo",
              "userId": 1,
              "movementId": 484,
              "notes": []
            },
            {
              "id": 2,
              "senderId": 1,
              "receiverId": 32,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1350.72,
              "fundId": 2,
              "reverted": false,
              "createdAt": "2023-08-03T12:41:55.661Z",
              "updatedAt": "2023-08-03T12:41:55.661Z",
              "senderAlias": "Marcos Parengo",
              "receiverAlias": "Prueba Plazo Fijo 14/07",
              "userId": 14,
              "movementId": 482,
              "notes": []
            },
            {
              "id": 1,
              "senderId": 1,
              "receiverId": 32,
              "stateId": 2,
              "shares": 1,
              "sharePrice": 1354.76,
              "fundId": 2,
              "reverted": false,
              "createdAt": "2023-07-27T14:08:44.061Z",
              "updatedAt": "2023-08-01T22:24:05.219Z",
              "senderAlias": "Marcos Parengo",
              "receiverAlias": "Prueba Plazo Fijo 14/07",
              "userId": 14,
              "movementId": 476,
              "notes": []
            },
            {
              "id": 136,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.47096,
              "sharePrice": 1359.66,
              "createdAt": "2023-06-08T13:42:11.113Z",
              "updatedAt": "2024-04-12T15:47:40.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 134,
              "clientId": 1,
              "fundId": 2,
              "stateId": 3,
              "shares": 1.02484,
              "sharePrice": 1366.07,
              "createdAt": "2023-05-11T17:12:51.731Z",
              "updatedAt": "2023-05-11T18:27:17.000Z",
              "approvedBy": [],
              "notes": [
                {
                  "id": 9,
                  "text": "Rechazo 2",
                  "noteType": "DENIAL_MOTIVE",
                  "userName": "Marki Parengo",
                  "createdAt": "2023-05-11T18:27:17.599Z"
                }
              ]
            },
            {
              "id": 133,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.3914,
              "sharePrice": 1437.4,
              "createdAt": "2023-04-20T14:04:59.471Z",
              "updatedAt": "2023-04-20T14:05:37.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 131,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.02759,
              "sharePrice": 1167.78,
              "createdAt": "2023-03-09T13:38:26.279Z",
              "updatedAt": "2023-07-03T18:21:22.000Z",
              "approvedBy": [
                6
              ],
              "notes": []
            },
            {
              "id": 130,
              "clientId": 1,
              "fundId": 2,
              "stateId": 5,
              "shares": 1.01654,
              "sharePrice": 1180.48,
              "createdAt": "2023-03-08T15:06:50.926Z",
              "updatedAt": "2023-03-08T15:06:50.926Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 129,
              "clientId": 1,
              "fundId": 2,
              "stateId": 3,
              "shares": 1.01512,
              "sharePrice": 1182.13,
              "createdAt": "2023-03-08T13:52:04.317Z",
              "updatedAt": "2023-07-03T18:22:13.000Z",
              "approvedBy": [],
              "notes": [
                {
                  "id": 26,
                  "text": "Rechazado",
                  "noteType": "DENIAL_MOTIVE",
                  "userName": "Pamela Guespe",
                  "createdAt": "2023-07-03T18:22:13.507Z"
                }
              ]
            },
            {
              "id": 128,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.08498,
              "sharePrice": 1198.18,
              "createdAt": "2023-03-03T18:24:47.374Z",
              "updatedAt": "2024-04-12T15:47:46.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 127,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": -1,
              "sharePrice": 1198.18,
              "createdAt": "2023-03-03T18:23:25.737Z",
              "updatedAt": "2024-04-12T15:47:51.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 126,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.6692,
              "sharePrice": 1198.18,
              "createdAt": "2023-03-03T18:22:36.039Z",
              "updatedAt": "2024-04-12T15:47:57.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 125,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": -1,
              "sharePrice": 1198.18,
              "createdAt": "2023-03-03T18:17:45.170Z",
              "updatedAt": "2024-04-12T15:48:35.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 117,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.48961,
              "sharePrice": 1342.63,
              "createdAt": "2023-02-02T14:26:01.946Z",
              "updatedAt": "2023-02-16T17:06:10.000Z",
              "approvedBy": [
                5
              ],
              "notes": []
            },
            {
              "id": 110,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": -1,
              "sharePrice": 1310.6,
              "createdAt": "2023-01-24T21:45:40.829Z",
              "updatedAt": "2023-01-24T21:47:53.000Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 109,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.52602,
              "sharePrice": 1310.6,
              "createdAt": "2023-01-24T21:40:27.808Z",
              "updatedAt": "2023-01-24T21:43:38.000Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 108,
              "clientId": 1,
              "fundId": 2,
              "stateId": 5,
              "shares": 1.06821,
              "sharePrice": 1310.6,
              "createdAt": "2023-01-24T21:36:01.317Z",
              "updatedAt": "2023-01-24T21:36:01.317Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 107,
              "clientId": 1,
              "fundId": 2,
              "stateId": 3,
              "shares": 1.0148,
              "sharePrice": 1310.6,
              "createdAt": "2023-01-24T21:35:08.991Z",
              "updatedAt": "2023-02-16T17:06:18.000Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 106,
              "clientId": 1,
              "fundId": 2,
              "stateId": 5,
              "shares": -1,
              "sharePrice": 1212.06,
              "createdAt": "2023-01-20T15:39:06.526Z",
              "updatedAt": "2023-01-20T15:39:06.526Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 105,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.23756,
              "sharePrice": 1212.06,
              "createdAt": "2023-01-06T18:08:33.757Z",
              "updatedAt": "2023-01-20T15:38:48.000Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 104,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.07255,
              "sharePrice": 1212.06,
              "createdAt": "2023-01-05T16:54:01.871Z",
              "updatedAt": "2024-04-12T15:48:49.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 103,
              "clientId": 1,
              "fundId": 2,
              "stateId": 3,
              "shares": 1.07255,
              "sharePrice": 1212.06,
              "createdAt": "2023-01-05T16:52:53.425Z",
              "updatedAt": "2023-01-05T16:53:21.000Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 102,
              "clientId": 1,
              "fundId": 2,
              "stateId": 5,
              "shares": 1.23756,
              "sharePrice": 1212.06,
              "createdAt": "2023-01-05T16:49:49.364Z",
              "updatedAt": "2023-01-05T16:49:49.364Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 101,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.23756,
              "sharePrice": 1212.06,
              "createdAt": "2023-01-05T15:04:20.818Z",
              "updatedAt": "2024-04-12T15:48:53.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 84,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.62136,
              "sharePrice": 1233.53,
              "createdAt": "2022-09-23T21:30:45.452Z",
              "updatedAt": "2024-04-12T15:54:14.000Z",
              "approvedBy": [
                1
              ],
              "notes": []
            },
            {
              "id": 81,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": -1.49,
              "sharePrice": 1241.8,
              "createdAt": "2022-09-22T23:34:38.938Z",
              "updatedAt": "2022-09-22T23:35:14.000Z",
              "approvedBy": [],
              "notes": []
            },
            {
              "id": 77,
              "clientId": 1,
              "fundId": 2,
              "stateId": 2,
              "shares": 1.49354,
              "sharePrice": 1339.1,
              "createdAt": "2022-08-23T20:40:55.439Z",
              "updatedAt": "2022-08-23T20:41:59.000Z",
              "approvedBy": [
                6
              ],
              "notes": []
            }
          ]}
        />
      </PDFViewer>
      {/*<PDFViewer style={{ width: "100%", height: "100vh" }}><MovementReceipt Movement={Movement} /></PDFViewer>*/}
      {/* <PDFViewer style={{ width: "100%", height: "100vh" }}>  <TransferReceipt Transfer={Transfer} /></PDFViewer>*/}
    </>
  );
}

export default TestPDF
