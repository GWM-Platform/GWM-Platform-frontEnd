
import React from "react";
import { PDFViewer } from '@react-pdf/renderer';
// import TransactionReceipt from "Receipts/TransactionReceipt";
// import FixedDepositReceipt from "Receipts/FixedDepositReceipt";
// import MovementReceipt from "Receipts/MovementReceipt";
// import TransferReceipt from "Receipts/TransferReceipt";
import HoldingsReport from "TableExport/HoldingsReport";

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
        <HoldingsReport
          headerInfo={{
            clientName: "Marki Parengo",
            fundName: "Crypto",
            balance: 8.83233,
            sharePrice: 1703.8,
            balanceInCash: "15048.52",
            pendingshares: "9.91",
            performance: 3896.01
          }}
          holdings={
            {
              "accountsStatement": [
                {
                  "accountAlias": "Marki 3",
                  "balance": 29975.94,
                  "operations": [
                    {
                      "id": 540,
                      "accountId": 1,
                      "stateId": 5,
                      "userId": 1,
                      "transactionId": 154,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 1342.51,
                      "motive": "STAKE_SELL",
                      "applied": false,
                      "createdAt": "2023-11-14T15:05:58.883Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 527,
                      "accountId": 1,
                      "stateId": 5,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": 116,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -100,
                      "motive": "FIXED_DEPOSIT_CREATE",
                      "applied": true,
                      "createdAt": "2023-09-21T15:31:02.077Z",
                      "notes": [],
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 29975.940000000002
                    },
                    {
                      "id": 526,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": 115,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -100,
                      "motive": "FIXED_DEPOSIT_CREATE",
                      "applied": true,
                      "createdAt": "2023-09-14T16:51:16.558Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 30075.940000000002
                    },
                    {
                      "id": 519,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": null,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": 70,
                      "shareTransferId": null,
                      "amount": 75,
                      "motive": "TRANSFER_RECEIVE",
                      "applied": true,
                      "createdAt": "2023-08-31T14:41:05.610Z",
                      "notes": [],
                      "approvedBy": [],
                      "partialBalance": 30175.940000000002,
                      "transferSender": "Marcos 1 Parengo"
                    },
                    {
                      "id": 515,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": 102,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 102.3,
                      "motive": "FIXED_DEPOSIT_CLOSE",
                      "applied": true,
                      "createdAt": "2023-08-17T15:55:00.657Z",
                      "notes": [],
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 30100.940000000002
                    },
                    {
                      "id": 493,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": 7,
                      "amount": 0,
                      "motive": "SHARE_TRANSFER_RECEIVE",
                      "applied": true,
                      "createdAt": "2023-08-03T14:53:16.566Z",
                      "notes": [
                        {
                          "id": 53,
                          "text": "Transferencia revertida",
                          "noteType": "TRANSFER_MOTIVE",
                          "userName": "Marki Parengo",
                          "createdAt": "2023-08-03T14:53:16.571Z"
                        }
                      ],
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 29998.640000000003
                    },
                    {
                      "id": 490,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 47,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": 6,
                      "amount": 0,
                      "motive": "SHARE_TRANSFER_SEND",
                      "applied": true,
                      "createdAt": "2023-08-03T14:11:05.380Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [],
                      "partialBalance": 29998.640000000003
                    },
                    {
                      "id": 489,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": null,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": 5,
                      "amount": 0,
                      "motive": "SHARE_TRANSFER_RECEIVE",
                      "applied": true,
                      "createdAt": "2023-08-03T14:10:44.915Z",
                      "notes": [],
                      "approvedBy": [],
                      "partialBalance": 29998.640000000003
                    },
                    {
                      "id": 486,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": 4,
                      "amount": 0,
                      "motive": "SHARE_TRANSFER_SEND",
                      "applied": true,
                      "createdAt": "2023-08-03T13:41:50.783Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [],
                      "partialBalance": 29998.640000000003
                    },
                    {
                      "id": 485,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": null,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": 3,
                      "amount": 0,
                      "motive": "SHARE_TRANSFER_RECEIVE",
                      "applied": true,
                      "createdAt": "2023-08-03T13:28:56.835Z",
                      "notes": [],
                      "approvedBy": [],
                      "partialBalance": 29998.640000000003
                    },
                    {
                      "id": 482,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": 2,
                      "amount": 0,
                      "motive": "SHARE_TRANSFER_SEND",
                      "applied": true,
                      "createdAt": "2023-08-03T12:41:55.670Z",
                      "notes": [
                        {
                          "id": 51,
                          "text": "Transferencia",
                          "noteType": "TRANSFER_MOTIVE",
                          "userName": "Marcos Parengo",
                          "createdAt": "2023-08-03T12:41:55.680Z"
                        }
                      ],
                      "userName": "Marcos Parengo",
                      "approvedBy": [],
                      "partialBalance": 29998.640000000003
                    },
                    {
                      "id": 478,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": 68,
                      "shareTransferId": null,
                      "amount": -1,
                      "motive": "TRANSFER_SEND",
                      "applied": true,
                      "createdAt": "2023-07-27T14:16:15.063Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [],
                      "partialBalance": 29998.640000000003,
                      "transferReceiver": "Prueba Plazo"
                    },
                    {
                      "id": 476,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": 1,
                      "amount": 0,
                      "motive": "SHARE_TRANSFER_SEND",
                      "applied": true,
                      "createdAt": "2023-07-27T14:08:44.072Z",
                      "notes": [
                        {
                          "id": 48,
                          "text": "Transfer Cuota Partes",
                          "noteType": "TRANSFER_MOTIVE",
                          "userName": "Marcos Parengo",
                          "createdAt": "2023-07-27T14:08:44.084Z"
                        }
                      ],
                      "userName": "Marcos Parengo",
                      "approvedBy": [],
                      "partialBalance": 29999.640000000003
                    },
                    {
                      "id": 449,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": 107,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -5000,
                      "motive": "BID_OFFER",
                      "applied": true,
                      "createdAt": "2023-07-04T18:49:27.905Z",
                      "notes": [],
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Marki Parengo",
                        "Pamela Guespe"
                      ],
                      "partialBalance": 29999.640000000003
                    },
                    {
                      "id": 446,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": null,
                      "transactionId": null,
                      "fixedDepositId": 101,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 10.04,
                      "motive": "FIXED_DEPOSIT_CLOSE",
                      "applied": true,
                      "createdAt": "2023-06-30T00:00:09.057Z",
                      "notes": [],
                      "approvedBy": [],
                      "partialBalance": 34999.64
                    },
                    {
                      "id": 445,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": null,
                      "transactionId": null,
                      "fixedDepositId": 103,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 101.97,
                      "motive": "FIXED_DEPOSIT_CLOSE",
                      "applied": true,
                      "createdAt": "2023-06-29T00:00:08.722Z",
                      "notes": [],
                      "approvedBy": [],
                      "partialBalance": 34989.6
                    },
                    {
                      "id": 437,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": 136,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -2000.01,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-06-08T13:42:11.123Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 34887.63
                    },
                    {
                      "id": 436,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": 106,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -10,
                      "motive": "BID_OFFER",
                      "applied": true,
                      "createdAt": "2023-06-02T13:57:21.613Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo",
                        "Pamela Guespe"
                      ],
                      "partialBalance": 36887.64
                    },
                    {
                      "id": 425,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": 104,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -10,
                      "motive": "FIXED_DEPOSIT_CREATE",
                      "applied": false,
                      "createdAt": "2023-05-11T18:31:26.423Z",
                      "notes": [
                        {
                          "id": 10,
                          "text": "Rechazo plazo fijo",
                          "noteType": "DENIAL_MOTIVE",
                          "userName": "Marki Parengo",
                          "createdAt": "2023-05-11T18:32:00.533Z"
                        }
                      ],
                      "userName": "Marcos Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 424,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 14,
                      "transactionId": 134,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1400,
                      "motive": "STAKE_BUY",
                      "applied": false,
                      "createdAt": "2023-05-11T17:12:53.285Z",
                      "notes": [
                        {
                          "id": 9,
                          "text": "Rechazo 2",
                          "noteType": "DENIAL_MOTIVE",
                          "userName": "Marki Parengo",
                          "createdAt": "2023-05-11T18:27:17.599Z"
                        }
                      ],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 423,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -9,
                      "motive": "WITHDRAWAL",
                      "applied": false,
                      "createdAt": "2023-05-11T16:15:42.616Z",
                      "notes": [
                        {
                          "id": 7,
                          "text": "Nota con retiro",
                          "noteType": "CLIENT_NOTE",
                          "userName": "Marcos Parengo",
                          "createdAt": "2023-05-11T16:15:42.620Z"
                        },
                        {
                          "id": 8,
                          "text": "Nota de rechazo",
                          "noteType": "DENIAL_MOTIVE",
                          "userName": "Marki Parengo",
                          "createdAt": "2023-05-11T18:24:32.713Z"
                        }
                      ],
                      "userName": "Marcos Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 420,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -6,
                      "motive": "WITHDRAWAL",
                      "applied": false,
                      "createdAt": "2023-05-11T14:48:00.000Z",
                      "notes": [
                        {
                          "id": 6,
                          "text": "Nota del retiro",
                          "noteType": "ADMIN_NOTE",
                          "userName": "Marki Parengo",
                          "createdAt": "2023-05-11T14:48:32.228Z"
                        }
                      ],
                      "userName": "Marki Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 419,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 10,
                      "motive": "DEPOSIT",
                      "applied": true,
                      "createdAt": "2023-05-11T14:42:00.000Z",
                      "notes": [
                        {
                          "id": 5,
                          "text": "Nota de deposito",
                          "noteType": "ADMIN_NOTE",
                          "userName": "Marki Parengo",
                          "createdAt": "2023-05-11T14:45:21.274Z"
                        }
                      ],
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Pamela Guespe"
                      ],
                      "partialBalance": 36897.64
                    },
                    {
                      "id": 408,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 10,
                      "motive": "DEPOSIT",
                      "applied": true,
                      "createdAt": "2023-04-20T16:48:00.000Z",
                      "notes": [],
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Pamela Guespe"
                      ],
                      "partialBalance": 36887.64
                    },
                    {
                      "id": 407,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1,
                      "motive": "WITHDRAWAL",
                      "applied": false,
                      "createdAt": "2023-04-20T16:45:41.201Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 406,
                      "accountId": 1,
                      "stateId": 4,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -10,
                      "motive": "WITHDRAWAL",
                      "applied": true,
                      "createdAt": "2023-04-20T16:44:24.305Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 36877.64
                    },
                    {
                      "id": 405,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 133,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -2000,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-04-20T14:05:00.763Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 36887.64
                    },
                    {
                      "id": 404,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": 103,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -100,
                      "motive": "BID_OFFER",
                      "applied": true,
                      "createdAt": "2023-03-30T18:37:09.233Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo",
                        "Marki Parengo"
                      ],
                      "partialBalance": 38887.64
                    },
                    {
                      "id": 403,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": 102,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -100,
                      "motive": "FIXED_DEPOSIT_CREATE",
                      "applied": true,
                      "createdAt": "2023-03-30T17:23:43.227Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 38987.64
                    },
                    {
                      "id": 402,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": 101,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -10,
                      "motive": "BID_OFFER",
                      "applied": true,
                      "createdAt": "2023-03-30T14:15:42.764Z",
                      "notes": [],
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Marki Parengo",
                        "Marki Parengo"
                      ],
                      "partialBalance": 39087.64
                    },
                    {
                      "id": 395,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 131,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1200,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-03-09T13:38:27.570Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Pamela Guespe"
                      ],
                      "partialBalance": 39097.64
                    },
                    {
                      "id": 394,
                      "accountId": 1,
                      "stateId": 5,
                      "userId": 1,
                      "transactionId": 130,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1200.01,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-03-08T15:06:50.934Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 40297.64
                    },
                    {
                      "id": 393,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 1,
                      "transactionId": 129,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1200,
                      "motive": "STAKE_BUY",
                      "applied": false,
                      "createdAt": "2023-03-08T13:52:04.324Z",
                      "notes": [
                        {
                          "id": 26,
                          "text": "Rechazado",
                          "noteType": "DENIAL_MOTIVE",
                          "userName": "Pamela Guespe",
                          "createdAt": "2023-07-03T18:22:13.507Z"
                        }
                      ],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 392,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 1,
                      "motive": "DEPOSIT",
                      "applied": true,
                      "createdAt": "2023-03-08T13:49:00.000Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 41497.65
                    },
                    {
                      "id": 391,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 100,
                      "motive": "DEPOSIT",
                      "applied": true,
                      "createdAt": "2023-03-08T13:45:00.000Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 41496.65
                    },
                    {
                      "id": 390,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 128,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1300,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-03-03T18:24:48.580Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 41396.65
                    },
                    {
                      "id": 389,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 127,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 1198.18,
                      "motive": "STAKE_SELL",
                      "applied": true,
                      "createdAt": "2023-03-03T18:23:26.838Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 42696.65
                    },
                    {
                      "id": 388,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 126,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -2000,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-03-03T18:22:37.094Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 41498.47
                    },
                    {
                      "id": 387,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 125,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 1198.18,
                      "motive": "STAKE_SELL",
                      "applied": true,
                      "createdAt": "2023-03-03T18:17:46.458Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 43498.47
                    },
                    {
                      "id": 384,
                      "accountId": 1,
                      "stateId": 4,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -400,
                      "motive": "WITHDRAWAL",
                      "applied": true,
                      "createdAt": "2023-03-03T18:01:59.501Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 42300.29
                    },
                    {
                      "id": 350,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 1000,
                      "motive": "DEPOSIT",
                      "applied": true,
                      "createdAt": "2023-02-09T14:16:00.000Z",
                      "notes": [],
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Pamela Guespe"
                      ],
                      "partialBalance": 42700.29
                    },
                    {
                      "id": 349,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": 117,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -2000,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-02-02T14:26:03.243Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Marco Gianga"
                      ],
                      "partialBalance": 41700.29
                    },
                    {
                      "id": 331,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": 110,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 1310.6,
                      "motive": "STAKE_SELL",
                      "applied": true,
                      "createdAt": "2023-01-24T21:45:40.837Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 43700.29
                    },
                    {
                      "id": 330,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": 109,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -2000,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-24T21:40:27.816Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 42389.69
                    },
                    {
                      "id": 329,
                      "accountId": 1,
                      "stateId": 5,
                      "userId": 1,
                      "transactionId": 108,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1400,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-24T21:36:01.321Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 44389.69
                    },
                    {
                      "id": 328,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 1,
                      "transactionId": 107,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1330,
                      "motive": "STAKE_BUY",
                      "applied": false,
                      "createdAt": "2023-01-24T21:35:09.003Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 317,
                      "accountId": 1,
                      "stateId": 5,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -10,
                      "motive": "WITHDRAWAL",
                      "applied": true,
                      "createdAt": "2023-01-20T16:05:41.840Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [],
                      "partialBalance": 45789.69
                    },
                    {
                      "id": 316,
                      "accountId": 1,
                      "stateId": 5,
                      "userId": 1,
                      "transactionId": 106,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": 1212.06,
                      "motive": "STAKE_SELL",
                      "applied": false,
                      "createdAt": "2023-01-20T15:39:06.538Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 301,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": 105,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1500,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-06T18:08:33.765Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [],
                      "partialBalance": 45799.69
                    },
                    {
                      "id": 300,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": 104,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1299.99,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-05T16:54:01.875Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 47299.69
                    },
                    {
                      "id": 299,
                      "accountId": 1,
                      "stateId": 3,
                      "userId": 1,
                      "transactionId": 103,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1299.99,
                      "motive": "STAKE_BUY",
                      "applied": false,
                      "createdAt": "2023-01-05T16:52:53.430Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": []
                    },
                    {
                      "id": 298,
                      "accountId": 1,
                      "stateId": 5,
                      "userId": 14,
                      "transactionId": 102,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1500,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-05T16:49:49.370Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marcos Parengo",
                      "approvedBy": [],
                      "partialBalance": 48599.68
                    },
                    {
                      "id": 297,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 1,
                      "transactionId": 101,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1500,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-05T15:04:20.824Z",
                      "notes": [],
                      "fundId": 2,
                      "fundName": "Crypto",
                      "userName": "Marki Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 50099.68
                    },
                    {
                      "id": 296,
                      "accountId": 1,
                      "stateId": 4,
                      "userId": 14,
                      "transactionId": null,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -100,
                      "motive": "WITHDRAWAL",
                      "applied": true,
                      "createdAt": "2023-01-05T15:00:25.078Z",
                      "notes": [],
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 51599.68
                    },
                    {
                      "id": 295,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 100,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1000,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-05T14:59:56.293Z",
                      "notes": [],
                      "fundId": 3,
                      "fundName": "Acciones",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 51699.68
                    },
                    {
                      "id": 294,
                      "accountId": 1,
                      "stateId": 2,
                      "userId": 14,
                      "transactionId": 99,
                      "fixedDepositId": null,
                      "transferId": null,
                      "shareTransferId": null,
                      "amount": -1000,
                      "motive": "STAKE_BUY",
                      "applied": true,
                      "createdAt": "2023-01-05T14:59:21.533Z",
                      "notes": [],
                      "fundId": 3,
                      "fundName": "Acciones",
                      "userName": "Marcos Parengo",
                      "approvedBy": [
                        "Marki Parengo"
                      ],
                      "partialBalance": 52699.68
                    }
                  ]
                }
              ],
              "fundsStatement": [
                {
                  "fundName": "Crypto",
                  "operations": [
                    {
                      "id": 154,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 5,
                      "shares": -1,
                      "sharePrice": 1342.51,
                      "createdAt": "2023-11-14T15:05:58.879Z",
                      "updatedAt": "2023-11-14T15:05:58.879Z"
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
                      "updatedAt": "2023-08-03T19:54:46.000Z"
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
                      "updatedAt": "2023-08-03T14:10:44.904Z"
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
                      "updatedAt": "2023-08-03T13:28:56.826Z"
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
                      "updatedAt": "2023-08-03T12:41:55.661Z"
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
                      "updatedAt": "2023-08-01T22:24:05.219Z"
                    },
                    {
                      "id": 136,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.47096,
                      "sharePrice": 1359.66,
                      "createdAt": "2023-06-08T13:42:11.113Z",
                      "updatedAt": "2024-04-12T15:47:40.000Z"
                    },
                    {
                      "id": 133,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.3914,
                      "sharePrice": 1437.4,
                      "createdAt": "2023-04-20T14:04:59.471Z",
                      "updatedAt": "2023-04-20T14:05:37.000Z"
                    },
                    {
                      "id": 131,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.02759,
                      "sharePrice": 1167.78,
                      "createdAt": "2023-03-09T13:38:26.279Z",
                      "updatedAt": "2023-07-03T18:21:22.000Z"
                    },
                    {
                      "id": 130,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 5,
                      "shares": 1.01654,
                      "sharePrice": 1180.48,
                      "createdAt": "2023-03-08T15:06:50.926Z",
                      "updatedAt": "2023-03-08T15:06:50.926Z"
                    },
                    {
                      "id": 128,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.08498,
                      "sharePrice": 1198.18,
                      "createdAt": "2023-03-03T18:24:47.374Z",
                      "updatedAt": "2024-04-12T15:47:46.000Z"
                    },
                    {
                      "id": 127,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": -1,
                      "sharePrice": 1198.18,
                      "createdAt": "2023-03-03T18:23:25.737Z",
                      "updatedAt": "2024-04-12T15:47:51.000Z"
                    },
                    {
                      "id": 126,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.6692,
                      "sharePrice": 1198.18,
                      "createdAt": "2023-03-03T18:22:36.039Z",
                      "updatedAt": "2024-04-12T15:47:57.000Z"
                    },
                    {
                      "id": 125,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": -1,
                      "sharePrice": 1198.18,
                      "createdAt": "2023-03-03T18:17:45.170Z",
                      "updatedAt": "2024-04-12T15:48:35.000Z"
                    },
                    {
                      "id": 117,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.48961,
                      "sharePrice": 1342.63,
                      "createdAt": "2023-02-02T14:26:01.946Z",
                      "updatedAt": "2023-02-16T17:06:10.000Z"
                    },
                    {
                      "id": 110,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": -1,
                      "sharePrice": 1310.6,
                      "createdAt": "2023-01-24T21:45:40.829Z",
                      "updatedAt": "2023-01-24T21:47:53.000Z"
                    },
                    {
                      "id": 109,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.52602,
                      "sharePrice": 1310.6,
                      "createdAt": "2023-01-24T21:40:27.808Z",
                      "updatedAt": "2023-01-24T21:43:38.000Z"
                    },
                    {
                      "id": 108,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 5,
                      "shares": 1.06821,
                      "sharePrice": 1310.6,
                      "createdAt": "2023-01-24T21:36:01.317Z",
                      "updatedAt": "2023-01-24T21:36:01.317Z"
                    },
                    {
                      "id": 106,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 5,
                      "shares": -1,
                      "sharePrice": 1212.06,
                      "createdAt": "2023-01-20T15:39:06.526Z",
                      "updatedAt": "2023-01-20T15:39:06.526Z"
                    },
                    {
                      "id": 105,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.23756,
                      "sharePrice": 1212.06,
                      "createdAt": "2023-01-06T18:08:33.757Z",
                      "updatedAt": "2023-01-20T15:38:48.000Z"
                    },
                    {
                      "id": 104,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.07255,
                      "sharePrice": 1212.06,
                      "createdAt": "2023-01-05T16:54:01.871Z",
                      "updatedAt": "2024-04-12T15:48:49.000Z"
                    },
                    {
                      "id": 102,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 5,
                      "shares": 1.23756,
                      "sharePrice": 1212.06,
                      "createdAt": "2023-01-05T16:49:49.364Z",
                      "updatedAt": "2023-01-05T16:49:49.364Z"
                    },
                    {
                      "id": 101,
                      "clientId": 1,
                      "fundId": 2,
                      "stateId": 2,
                      "shares": 1.23756,
                      "sharePrice": 1212.06,
                      "createdAt": "2023-01-05T15:04:20.818Z",
                      "updatedAt": "2024-04-12T15:48:53.000Z"
                    }
                  ],
                  "shares": 8.83233,
                  "sharePrice": 1497.67,
                  "balance": 13227.92
                },
                {
                  "fundName": "Acciones",
                  "operations": [
                    {
                      "id": 100,
                      "clientId": 1,
                      "fundId": 3,
                      "stateId": 2,
                      "shares": 1.17396,
                      "sharePrice": 851.82,
                      "createdAt": "2023-01-05T14:59:55.130Z",
                      "updatedAt": "2024-04-12T15:53:15.000Z"
                    },
                    {
                      "id": 99,
                      "clientId": 1,
                      "fundId": 3,
                      "stateId": 2,
                      "shares": 1.17396,
                      "sharePrice": 851.82,
                      "createdAt": "2023-01-05T14:59:20.027Z",
                      "updatedAt": "2024-04-12T15:53:21.000Z"
                    }
                  ],
                  "shares": 2.34792,
                  "sharePrice": 1135.42,
                  "balance": 2665.88
                },
                {
                  "fundName": "Real Estate Fund",
                  "operations": [],
                  "shares": 88.99743,
                  "sharePrice": 420,
                  "balance": 37378.92
                }
              ],
              "fixedDepositsStatement": {
                "operations": [
                  {
                    "closed": true,
                    "id": 101,
                    "clientId": 1,
                    "initialAmount": 10,
                    "interestRate": 1.7,
                    "duration": 91,
                    "startDate": "2023-03-30T17:12:57.000Z",
                    "endDate": "2023-06-29T17:12:57.000Z",
                    "stateId": 2,
                    "createdAt": "2023-03-30T14:15:42.754Z",
                    "updatedAt": "2023-06-30T00:00:09.000Z",
                    "profit": 10.04,
                    "closeDuration": 91
                  },
                  {
                    "closed": true,
                    "id": 102,
                    "clientId": 1,
                    "initialAmount": 100,
                    "interestRate": 6,
                    "duration": 542,
                    "startDate": "2023-03-30T17:24:18.000Z",
                    "endDate": "2024-09-22T17:24:18.000Z",
                    "stateId": 2,
                    "createdAt": "2023-03-30T17:23:43.222Z",
                    "updatedAt": "2023-08-17T15:55:00.000Z",
                    "profit": 102.3,
                    "closeDuration": 140
                  },
                  {
                    "closed": true,
                    "id": 103,
                    "clientId": 1,
                    "initialAmount": 100,
                    "interestRate": 8,
                    "duration": 90,
                    "startDate": "2023-03-30T18:38:21.000Z",
                    "endDate": "2023-06-28T18:38:21.000Z",
                    "stateId": 2,
                    "createdAt": "2023-03-30T18:37:09.229Z",
                    "updatedAt": "2023-06-29T00:00:08.000Z",
                    "profit": 101.97,
                    "closeDuration": 90
                  },
                  {
                    "closed": false,
                    "id": 115,
                    "clientId": 1,
                    "initialAmount": 100,
                    "interestRate": 8,
                    "duration": 729,
                    "startDate": "2023-09-14T18:10:17.000Z",
                    "endDate": "2025-09-12T18:10:17.000Z",
                    "stateId": 2,
                    "createdAt": "2023-09-14T16:51:16.547Z",
                    "updatedAt": "2023-09-14T18:10:17.000Z",
                    "profit": 102.39,
                    "closeDuration": 109
                  }
                ]
              },
              "totalBalance": 87823.73
            }
          }
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
