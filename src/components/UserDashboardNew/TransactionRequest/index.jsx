import React, { useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Col,
    Row,
    Container,
    Form,
    Collapse,
    Button,
    Spinner,
    InputGroup,
    Accordion,
} from "react-bootstrap";
import { useState } from "react";
import "./index.css";
import AccountCard from "./AccountCard";
import TransactionTypeCard from "./TransactionTypeCard";
import GeographicInfo from "./GeographicInfo";
import TargetAccountTypeCard from "./TargetAccountTypeCard";
import GeographicBankInfo from "./GeographicBankInfo";
import { urlContext } from "../../../context/urlContext";

const TransactionRequest = ({ setItemSelected, type, setHaveInternal, transactionInfo, setTransactionInfo, }) => {
    //Params from the url
    const { sourceAccountId, transactionType } = useParams();
    //history of path in the site
    let history = useHistory();
    //Token from the loged user
    const [token] = useState(sessionStorage.getItem("access_token"));

    //Go to login page (used in cases that the token is expired or not valid)
    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    };


    //To use the translations from i18n
    const { t } = useTranslation();

    // States (as variables) for form functionalities
    const [validated, setValidated] = useState(false);
    const [accountSelected, setAccountSelected] = useState(-1);
    const [targetAccountSelected, setTargetAccountSelected] = useState(-1);
    const [open, setOpen] = useState(true);
    const [some, setSome] = useState(true);
    const [secret, setSecret] = useState(false);
    const [errorExternalNumber, setErrorExternalNumber] = useState({
        text: "Please, enter the the target account",
        color: "text-muted",
    });
    const [verify, setVerify] = useState(false);//if External target number entered belongs wadiah
    const [bankDataFetched, setBankDataFetched] = useState(false);
    const [fetchingBD, setFetchingBD] = useState(false);
    const [geoBankInfoActive, setGeoBankInfoActive] = useState("0");
    const [transacctionInProgress, setTransactionInProgress] = useState(false);

    //Array with the user's accounts
    const [accounts, setAccounts] = useState([]);

    //Array with the user's saved accounts
    const [savedAccounts, setSavedAccounts] = useState([1]);

    //Array with the user's recent accounts
    const [recentAccounts, setRecentAccounts] = useState([1]);

    //Where all the form's data is saved. It checks if in the url have a valid parameter for the Transaction Destination
    const [data, setData] = useState({
        transactionType:
            transactionType !== "1" &&
                transactionType !== "2" &&
                transactionType !== "4"
                ? 1
                : transactionType,
        targetAccountType: "4",
        currency: "",
        targetAccount: "",
        sourceAccountId: sourceAccountId,
    });
    const [bankData, setBankData] = useState({});
    //Options for selectors
    const transactionTypes = [
        "",
        "Client of Another Bank",
        "",
        "Wadiah Customer",
    ];
    const targetAccountType = [
        "",
        "Saved contact",
        "Recent contact",
        "New contact",
    ];

    //Context variable
// eslint-disable-next-line 
        const { urlPrefix } = useContext(urlContext)

    //--------------------------------------------Functions--------------------------------------------

    //Keep the "data" state updated to the fields of the form
    const handleChange = (event) => {
        setSome(!some);
        let aux = data;
        switch (event.target.id) {
            case "saveContact":
                aux[event.target.id] = event.target.checked;
                break;
            case "editContact":
                aux[event.target.id] = event.target.checked;
                break
            case "targetRoutingNumber":
                aux[event.target.id] = event.target.value;
                setBankDataFetched(false);
                break;
            case "transactionType":
                aux[event.target.id] = event.target.value[0];
                setOpen(!open);
                break
            case "targetAccountType":
                aux[event.target.id] = event.target.value[0];
                if (event.target.value[0] === "1") {
                    if (aux.transactionType !== "1") {
                        aux.transactionType = "1";
                        setOpen(!open);
                    }
                }
                break
            case "targetAccount":
                if (data.targetAccountType === "3" || data.targetAccountType === "2") {
                    if (data.targetAccountType === "2") {
                        aux[event.target.id] = savedAccounts[event.target.value].accountNumber;
                        aux.targetRoutingNumber =
                            savedAccounts[event.target.value].routingNumber;
                        aux.targetBank = savedAccounts[event.target.value].bankName;
                        aux.targetBeneficiary = savedAccounts[event.target.value].name;
                        aux.savedAccountId = savedAccounts[event.target.value].id;
                        if (savedAccounts[event.target.value].routingNumber === "Wadiah") {
                            if (aux.transactionType !== "4") {
                                aux.transactionType = "4"
                                getId(setVerify, token, aux.targetAccount, setErrorExternalNumber,
                                    data, setData, some, setSome, urlPrefix);
                            }
                        } else {
                            if (aux.transactionType !== "2") {
                                aux.transactionType = "2"
                                getBankInfoBySwift(
                                    savedAccounts[event.target.value].routingNumber,
                                    data,
                                    setData,
                                    bankData,
                                    setBankData,
                                    setSome,
                                    some,
                                    setBankDataFetched,
                                    setFetchingBD,
                                    setGeoBankInfoActive,
                                    urlPrefix
                                );
                            }
                        }
                    } else {
                        aux[event.target.id] = recentAccounts[event.target.value].accountNumber;
                        aux.targetRoutingNumber =
                            recentAccounts[event.target.value].routingNumber;
                        aux.targetBank = recentAccounts[event.target.value].bank;
                        aux.targetBeneficiary = recentAccounts[event.target.value].name;
                        if (recentAccounts[event.target.value].routingNumber === "Wadiah") {
                            if (aux.transactionType !== "4") {
                                aux.transactionType = "4"
                                setOpen(!open);
                            }
                        } else {
                            if (aux.transactionType !== "2") {
                                aux.transactionType = "2"
                                getBankInfoBySwift(
                                    recentAccounts[event.target.value].routingNumber,
                                    data,
                                    setData,
                                    bankData,
                                    setBankData,
                                    setSome,
                                    some,
                                    setBankDataFetched,
                                    setFetchingBD,
                                    setGeoBankInfoActive,
                                    urlPrefix
                                );
                                setOpen(!open);
                            }
                        }
                    }
                } else {
                    aux[event.target.id] = event.target.value;
                }
                break
            default:
                aux[event.target.id] = event.target.value;
                break
        }
        setData(aux);
    };

    //Submit the data of the form
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            if (accounts[accountSelected].balance >= data.movementAmount) {
                const transactionObject = (typeSelected) => {
                    switch (typeSelected) {
                        case '1':
                            //Internal user Transaction
                            return {
                                sourceAccountId: parseInt(data.sourceAccountId),
                                type: parseInt(data.transactionType),
                                targetAccountId: parseInt(data.targetAccount),
                                targetExternalNumber: parseInt(
                                    accounts[IndexOfaccountSelected(accounts, data.sourceAccountId)]
                                        .externalNumber
                                ),
                                targetExternalBeneficiary:
                                    accounts[IndexOfaccountSelected(accounts, data.sourceAccountId)]
                                        .beneficiaryName,
                                amount: parseFloat(data.movementAmount),
                                description: data.transactionRequestDescription,
                            }
                        case '4':
                            // New / target Wadiah user
                            return {
                                sourceAccountId: parseInt(data.sourceAccountId),
                                type: parseInt(data.transactionType),
                                targetAccountId: parseInt(data.targetAccountId),
                                targetExternalNumber: data.targetAccount,
                                targetExternalBeneficiary: data.targetBeneficiary,
                                amount: parseFloat(data.movementAmount),
                                description: data.transactionRequestDescription,
                            }
                        case '2':
                            //New / target external user (type 2)
                            return {
                                type: parseInt(data.transactionType),//Transaction Type
                                sourceAccountId: parseInt(data.sourceAccountId),//Source account ID
                                targetAccountId: parseInt(data.targetAccountId),//Target account ID
                                targetExternalNumber: data.targetAccount,//Target account external number
                                targetExternalBeneficiary: data.targetBeneficiary,//Target account's owner name
                                targetRoutingNumber: data.targetRoutingNumber,//Target bank swift
                                targetExternalBank: data.targetBank,//target bank name
                                amount: parseFloat(data.movementAmount),//Amount
                                description: data.transactionRequestDescription,//Description
                            }
                        default:
                            return{
                                invalidType:true
                            }
                    }
                }

                if (data.saveContact) {
                    saveAccount(
                        {
                            name: data.targetBeneficiary,
                            type: 1,
                            routingNumber: ((data.transactionType === "4") ? "Wadiah" : data.targetRoutingNumber),
                            bankName: ((data.transactionType === "4") ? "Wadiah" : data.targetBank),
                            accountNumber: data.targetAccount,
                        },
                        token
                    );
                }
                if (data.editContact && data.transactionType !== "1" && data.targetAccountType === "2") {
                    updateAccount(
                        {
                            name: data.targetBeneficiary,
                            type: 1,
                            routingNumber: ((data.transactionType === "4") ? "Wadiah" : data.targetRoutingNumber),
                            bankName: ((data.transactionType === "4") ? "Wadiah" : data.targetBank),
                            accountNumber: data.targetAccount,
                        },
                        token,
                        data.savedAccountId
                    );
                }
                if(transactionObject(data.transactionType).invalidType===undefined){
                    sendTransactionRequest(
                        transactionObject(data.transactionType),
                        token,
                        transactionInfo,
                        setTransactionInfo,
                        accounts,
                        data,
                        setItemSelected,
                        history,
                        setTransactionInProgress,
                        urlPrefix
                    )
                }
            }
        }
        setValidated(true);
    };

    //When the user try to open this url it checks if the user has a valid token in their session storage,
    //if it is true, it's redirected to the dashboard, if not, it's redirected to login

    //GET method -- obtain the user's accouts to fill the "account source" field
    const getAccounts = (token) => {
        let catchedUserData = JSON.parse(sessionStorage.getItem('account'));//If its catched we wont fetch the 

        if (catchedUserData === null) {
            let response = [{ "id": 293, "description": "asset custody usd", "type": { "id": 111, "description": "asset custody", "productLine": { "id": 0, "description": " " } }, "externalNumber": "000000000000001", "currency": { "code": "USD", "name": "United States Dollar", "symbol": "$", "decimals": 2 }, "decimals": 0, "beneficiaryName": "Burton Gray", "balance": 24989989828.999996, "movementsCount": 124 }, { "id": 294, "description": "asset custody EUR", "type": { "id": 112, "description": "asset custody", "productLine": { "id": 0, "description": " " } }, "externalNumber": "000000000000002", "currency": { "code": "EUR", "name": "Euro", "symbol": "€", "decimals": 2 }, "decimals": 0, "beneficiaryName": "Burton Gray", "balance": 34999999985, "movementsCount": 4 }, { "id": 295, "description": "asset custody usd", "type": { "id": 111, "description": "asset custody", "productLine": { "id": 0, "description": " " } }, "externalNumber": "00000000000000003", "currency": { "code": "USD", "name": "United States Dollar", "symbol": "$", "decimals": 2 }, "decimals": 0, "beneficiaryName": "Burton Gray", "balance": 8520388, "movementsCount": 99 }]
            sessionStorage.setItem('account', JSON.stringify(response));
            setAccounts(response);
            for (let i = 0; i < response.length; i++) {
                if (
                    response.filter(
                        (u) => response[i].currency.name === u.currency.name
                    ).length > 1
                ) {
                    setHaveInternal(true);
                }
            }
            response.forEach((u, i) => {
                let aux = data;
                if (u.id.toString() === data.sourceAccountId.toString()) {
                    if (IndexOfaccountSelected(response, u.id.toString()) >= 0) {
                        aux.currency = u.currency.name;
                        aux.currencyCode = u.currency.code;
                        setAccountSelected(
                            IndexOfaccountSelected(response, u.id.toString())
                        );
                    }
                    setData(aux);
                    setSome(false);
                }
            });
        } else {
            setAccounts(catchedUserData);
            for (let i = 0; i < catchedUserData.length; i++) {
                if (
                    catchedUserData.filter(
                        (u) => catchedUserData[i].currency.name === u.currency.name
                    ).length > 1
                ) {
                    setHaveInternal(true);
                }
            }
            catchedUserData.forEach((u, i) => {
                let aux = data;
                if (u.id.toString() === data.sourceAccountId.toString()) {
                    if (IndexOfaccountSelected(catchedUserData, u.id.toString()) >= 0) {
                        aux.currency = u.currency.name;
                        aux.currencyCode = u.currency.code;
                        setAccountSelected(
                            IndexOfaccountSelected(catchedUserData, u.id.toString())
                        );
                    }
                    setData(aux);
                    setSome(false);
                }
            });
        }

    };

    //GET method -- get the accounts with which the user recently had transactions
    const getUserRecents = () => {
        setRecentAccounts([{ "name": "Algo Zamora", "accountNumber": "3710 8100 1314 6755.", "bank": "BANCO SANTANDER RIO S.A.", "routingNumber": "BSCHARBA" }, { "name": "Wang Zamora", "accountNumber": "3710 8100 1314 6755.", "bank": "BANCO SANTANDER RIO S.A.", "routingNumber": "BSCHARBA" }, { "name": "Wang Zamora", "accountNumber": "00000000000000003", "bank": "STANDARD CHARTERED BANK", "routingNumber": "SCBLUS33" }, { "name": "Wang Zamora", "accountNumber": "000000000000001", "bank": "STANDARD CHARTERED BANK", "routingNumber": "SCBLUS33" }, { "name": "Wang Zamora", "accountNumber": "3710 8100 1314 6755.", "bank": "STANDARD CHARTERED BANK", "routingNumber": "SCBLUS33" }]);

    };

    //GET method -- get the accounts that the user decided to save when making a transaction
    const getUserSavedContacts = () => {
        setSavedAccounts([{ "id": 40, "name": "Wang Zamora", "type": 1, "routingNumber": "BSCHARBA", "bankName": "BSCHARBA", "accountNumber": "3710 8100 1314 6755." }, { "id": 44, "name": "Wang Zamora", "type": 1, "routingNumber": "SCBLUS33", "bankName": "STANDARD CHARTERED BANK", "accountNumber": "000000000000001" }, { "id": 45, "name": "Wang Zamora", "type": 1, "routingNumber": "SCBLUS33", "bankName": "STANDARD CHARTERED BANK", "accountNumber": "000000000000001" }, { "id": 47, "name": "Wang Zamora", "type": 1, "routingNumber": "SCBLUS33", "bankName": "STANDARD CHARTERED BANK", "accountNumber": "000001" }, { "id": 48, "name": "Wang Zamora", "type": 1, "routingNumber": "SCBLUS33", "bankName": "STANDARD CHARTERED BANK", "accountNumber": "000001" }, { "id": 49, "name": "Wang Zamora", "type": 1, "routingNumber": "SCBLUS33", "bankName": "STANDARD CHARTERED BANK", "accountNumber": "000001" }, { "id": 50, "name": "Wang Zamora", "type": 1, "routingNumber": "SCBLUS33", "bankName": "STANDARD CHARTERED BANK", "accountNumber": "000001" }, { "id": 39, "name": "Wang Zamora Algo", "type": 1, "routingNumber": "Wadiah", "bankName": "Wadiah", "accountNumber": "3710 8100 1314 6755." }]);

    };

    //POST method -- Push an account that the user want to save
    const saveAccount = (data, token) => { };

    //PUT method -- Update an existing saved beneficiary for the authenticated user with a customer associated
    const updateAccount = (data, token, savedAccountId) => { };

    //DELETE method -- Delete an account from the saved by id
    const deleteAccount = (token, id) => { };

    //Every time a state from the array in the second param is modified, this hook is fired
    useEffect(() => {
        if (accounts.length === 0) {
            getAccounts();
        }
        if (recentAccounts[0] === 1) {
            getUserRecents();
        }
        if (savedAccounts[0] === 1) {
            getUserSavedContacts();
        }
        if (type === "internalTransaction" && data.transactionType !== "1") {
            let aux = data;
            aux.transactionType = "1";
            aux.targetAccount = "";
            setTargetAccountSelected(-1);
            setData(aux);
            setSome(!some);
        } else if (type === "otherTransaction" && data.transactionType === "1") {
            let aux = data;
            aux.transactionType = "4";
            aux.targetAccount = "";
            setErrorExternalNumber({
                text: "Please, enter the the target account",
                color: "text-muted",
            });
            setData(aux);
            setSome(!some);
        }
        return () => { };
        // eslint-disable-next-line
    }, [data, some, type]);
    //-----------------------------------------------------------------------------------------------

    return (
        <div className="bg-light">
            <Container
                fluid
                style={{
                    minHeight: data.transactionType === "1" ? "calc( 100vh - 60px)" : "auto",
                }}
            >
                {accounts.length === 0 ? (
                    <Row className="d-flex justify-content-center align-items-center">
                        <Col
                            className="freeSpace d-flex justify-content-center align-items-center"
                        >
                            <Spinner className="me-2" animation="border" variant="danger" />
                            <span className="loadingText">{t("Loading")}</span>
                        </Col>
                    </Row>
                ) : (
                    <Row className="d-flex justify-content-center pt-3">
                        <Col xs="12" className="px-3 px-sm-5  pt-3">
                            <h1
                                className="mb-4 mt-0"
                                onClick={() => {
                                    setSecret(!secret);
                                }}
                            >
                                {t(
                                    `${transactionType === "1" ? "Internal " : ""
                                    }Transaction Request`
                                )}
                            </h1>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                {/*------------------------------Source account selector-------------*/}
                                <Container className={`mx-0 px-0 mb-2 `} fluid>
                                    <Row>
                                        <Form.Label column sm={3} xl={2}>
                                            {t("Source Account")}
                                        </Form.Label>
                                        <Col sm={9} xl={10}>
                                            <Container className="px-0" fluid>
                                                <Row className="accountSelector flex-row flex-nowrap ">
                                                    {accounts.map((u, i) => {
                                                        return (
                                                            data.transactionType === "1" ? (
                                                                (accounts.filter((n) => n.currency.name === u.currency.name).length) > 1 ?
                                                                    <AccountCard
                                                                        setAccountSelected={setAccountSelected}
                                                                        accountSelected={accountSelected}
                                                                        setData={setData}
                                                                        data={data}
                                                                        setSome={setSome}
                                                                        some={some}
                                                                        field={"sourceAccountId"}
                                                                        account={u}
                                                                        ownKey={i}
                                                                        key={i}
                                                                        setErrorExternalNumber={
                                                                            setErrorExternalNumber
                                                                        }
                                                                        setTargetAccountSelected={
                                                                            setTargetAccountSelected
                                                                        } />
                                                                    :
                                                                    <></>)
                                                                :
                                                                <AccountCard
                                                                    setAccountSelected={setAccountSelected}
                                                                    accountSelected={accountSelected}
                                                                    setData={setData}
                                                                    data={data}
                                                                    setSome={setSome}
                                                                    some={some}
                                                                    field={"sourceAccountId"}
                                                                    account={u}
                                                                    ownKey={i}
                                                                    key={i}
                                                                    setErrorExternalNumber={
                                                                        setErrorExternalNumber
                                                                    }
                                                                    setTargetAccountSelected={
                                                                        setTargetAccountSelected
                                                                    }
                                                                />
                                                        )
                                                    })}
                                                </Row>
                                            </Container>
                                            <p
                                                class={`text-danger mt-1 ${data.sourceAccountId === "0" ? "d-block" : "d-none"
                                                    }`}
                                            >
                                                {t("Please, select a source account")}
                                            </p>
                                        </Col>
                                    </Row>
                                </Container>

                                {/*-----------------------Target account type (New, Recent or Saved contact) type--------------------------*/}
                                <Container
                                    className={`mt-2 mx-0 px-0 mb-2 ${data.transactionType === "1"
                                        ? "d-none"
                                        : savedAccounts.length === 0 &&
                                            recentAccounts.length === 0
                                            ? "d-none"
                                            : "d-block"
                                        }`}
                                    fluid
                                >
                                    <Row>
                                        <Form.Label column sm={3} xl={2}>
                                            {t("Account Type")}
                                        </Form.Label>
                                        <Col sm={9} xl={10}>
                                            <Container className="px-0" fluid>
                                                <Row className="accountSelector ">
                                                    {targetAccountType.map((u, i) => {
                                                        return u === "" ||
                                                            (i + 1 === 2 && savedAccounts.length === 0) ||
                                                            (i + 1 === 3 && recentAccounts.length === 0) ? (
                                                            <></>
                                                        ) : (
                                                            <TargetAccountTypeCard
                                                                Transaction
                                                                Destination
                                                                key={i}
                                                                data={data}
                                                                setData={setData}
                                                                some={some}
                                                                setSome={setSome}
                                                                ownKey={i}
                                                                option={u}
                                                                open={open}
                                                                setOpen={setOpen}
                                                            ></TargetAccountTypeCard>
                                                        );
                                                    })}
                                                </Row>
                                            </Container>
                                        </Col>
                                    </Row>
                                </Container>

                                {/*-----------------------Target account selector (for saved or recent contacts)--------------------------*/}
                                {data.targetAccountType === "2" ?
                                    /*---------------Selector of Target Account for other transactions for saved contacts-------------- */
                                    <Form.Group
                                        className={`mt-2  ${data.targetAccountType === "2" &&
                                            data.transactionType !== "1"
                                            ? "d-flex"
                                            : "d-none"
                                            }`}
                                        as={Row}
                                    >
                                        <Form.Label column sm={3} xl={2}>
                                            {t("Target Account")}
                                        </Form.Label>
                                        <Col sm={9} xl={10}>
                                            <Form.Control
                                                required={
                                                    data.targetAccountType === "2" &&
                                                        data.transactionType !== "1"
                                                        ? true
                                                        : false
                                                }
                                                as="select"
                                                id="targetAccount"
                                                onChange={handleChange}
                                            >
                                                <option selected value="">
                                                    {" "}
                                                    {t("-- select an option --")}{" "}
                                                </option>
                                                {savedAccounts.map((u, i) => {
                                                    return (
                                                        <option value={i}>
                                                            {u.name} - {u.accountNumber}
                                                        </option>
                                                    );
                                                })}
                                            </Form.Control>
                                            <Form.Text muted>
                                                {t("Please, select the target account")}
                                            </Form.Text>
                                        </Col>
                                    </Form.Group>
                                    :
                                    data.targetAccountType === "3" ?
                                        /*---------------Selector of Target Account for recent contacts-------------- */
                                        <Form.Group
                                            className={`mt-2  ${data.targetAccountType === "3" &&
                                                data.transactionType !== "1"
                                                ? "d-flex"
                                                : "d-none"
                                                }`}
                                            as={Row}
                                        >
                                            <Form.Label column sm={3} xl={2}>
                                                {t("Target Account")}
                                            </Form.Label>
                                            <Col sm={9} xl={10}>
                                                <Form.Control
                                                    required={
                                                        data.targetAccountType === "3" &&
                                                            data.transactionType !== "1"
                                                            ? true
                                                            : false
                                                    }
                                                    as="select"
                                                    id="targetAccount"
                                                    onChange={handleChange}
                                                >
                                                    <option disabled selected value="">
                                                        {" "}
                                                        {t("-- select an option --")}{" "}
                                                    </option>
                                                    {recentAccounts.map((u, i) => {
                                                        return (
                                                            <option value={i}>
                                                                {u.name} - {u.accountNumber}
                                                            </option>
                                                        );
                                                    })}
                                                </Form.Control>
                                                <Form.Text muted>
                                                    {t("Please, select the target account")}
                                                </Form.Text>
                                            </Col>
                                        </Form.Group>
                                        :
                                        <>
                                        </>
                                }

                                <hr className={data.transactionType === "1" ? "d-none" : "d-flex"} />

                                {/*Transaction Destination (Transaction type) for other transfers */}
                                <Container
                                    className={`mt-2 mx-0 px-0 mb-2 ${transactionType !== "1" ? "d-block" : "d-none"}`}
                                    fluid
                                >
                                    <Row>
                                        <Form.Label column sm={3} xl={2}>
                                            {t("Transaction Destination")}
                                        </Form.Label>
                                        <Col sm={9} xl={10}>
                                            <Container className="px-0" fluid>
                                                <Row className="accountSelecto ">
                                                    {transactionTypes.map((u, i) => {
                                                        return u === "" ? (
                                                            <></>
                                                        ) : (
                                                            <TransactionTypeCard
                                                                key={i}
                                                                data={data}
                                                                setData={setData}
                                                                some={some}
                                                                setSome={setSome}
                                                                ownKey={i}
                                                                option={u}
                                                                open={open}
                                                                setOpen={setOpen}
                                                            ></TransactionTypeCard>
                                                        );
                                                    })}
                                                </Row>
                                            </Container>
                                        </Col>
                                    </Row>
                                </Container>

                                {/*------------------------ Bank info -------------------*/}
                                <Collapse in={data.transactionType === "2"}>
                                    <div >
                                        {/*---------------Target Bank routing number for External transactions-------------- */}
                                        <Form.Group
                                            as={Row}
                                            className={`mt-2 `}
                                        >
                                            <Form.Label column sm={3} xl={2}>
                                                {t("Target Bank Number")}
                                            </Form.Label>
                                            <Col sm={9} xl={10}>
                                                <InputGroup>
                                                    <Form.Control
                                                        value={data.targetRoutingNumber}
                                                        type="text"
                                                        placeholder=""
                                                        id="targetRoutingNumber"
                                                        required={
                                                            data.transactionType === "1"
                                                                ? false
                                                                : data.transactionType === "4"
                                                                    ? false
                                                                    : true
                                                        }
                                                        onChange={handleChange}
                                                        onBlur={() => {
                                                            getBankInfoBySwift(
                                                                data.targetRoutingNumber,
                                                                data,
                                                                setData,
                                                                bankData,
                                                                setBankData,
                                                                setSome,
                                                                some,
                                                                setBankDataFetched,
                                                                setFetchingBD,
                                                                setGeoBankInfoActive,
                                                                urlPrefix
                                                            );
                                                        }}
                                                        className="borderRightNone"
                                                    />
                                                    <InputGroup.Text
                                                        id="basic-addon1"
                                                        className={`${fetchingBD ? "d-block" : "d-none"} bgWhite borderXNone`}
                                                    >
                                                        <Spinner
                                                            variant="danger"
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                    </InputGroup.Text>
                                                    <Button
                                                        variant="danger"
                                                        className="mainColor:validated"
                                                        id="button-addon2"
                                                        disabled={fetchingBD}
                                                        onClick={() => {
                                                            getBankInfoBySwift(
                                                                data.targetRoutingNumber,
                                                                data,
                                                                setData,
                                                                bankData,
                                                                setBankData,
                                                                setSome,
                                                                some,
                                                                setBankDataFetched,
                                                                setFetchingBD,
                                                                setGeoBankInfoActive,
                                                                urlPrefix
                                                            );
                                                        }}
                                                    >
                                                        {t("Search")}
                                                    </Button>
                                                </InputGroup>
                                                <Form.Text muted>
                                                    {t("Please, enter the target bank's number")}
                                                </Form.Text>
                                            </Col>
                                        </Form.Group>

                                        {/*---------------Target Bank Name for External transactions-------------- */}
                                        <Form.Group
                                            as={Row}
                                            className={`mt-2 `}
                                        >
                                            <Form.Label column sm={3} xl={2}>
                                                {t("Target Bank Name")}
                                            </Form.Label>
                                            <Col sm={9} xl={10}>
                                                <Form.Control
                                                    value={data.targetBank}
                                                    type="text"
                                                    placeholder=""
                                                    id="targetBank"
                                                    required={
                                                        transactionType === "1"
                                                            ? false
                                                            : data.transactionType === "4"
                                                                ? false
                                                                : true
                                                    }
                                                    onChange={handleChange}
                                                    readOnly={bankDataFetched}
                                                />
                                                <Form.Text muted>
                                                    {t(
                                                        "Please, enter the name from the  bank which the target account belongs"
                                                    )}
                                                </Form.Text>
                                            </Col>
                                        </Form.Group>

                                        {/*---------------Target Bank geoInfo for External transactions-------------- */}
                                        <GeographicBankInfo
                                            geoBankInfoActive={geoBankInfoActive}
                                            setGeoBankInfoActive={setGeoBankInfoActive}
                                            bankDataFetched={bankDataFetched}
                                            data={bankData}
                                            setData={setBankData}
                                            transactionType={data.transactionType}
                                        />
                                    </div>
                                </Collapse>

                                <hr className={data.transactionType === "1" ? "d-none" : "d-flex"} />

                                <Collapse
                                    in={open}
                                    onExited={function () {
                                        setTimeout(() => {
                                            setOpen(!open);
                                        }, 250);
                                    }}
                                >
                                    <div>
                                        <>
                                            {/*---------------Target Account for other transactions with a wadiah newtarget-------------- */}
                                            <Form.Group
                                                className={`mt-2  ${data.transactionType === "1" ||
                                                    data.transactionType === "2"
                                                    ? "d-none"
                                                    : "d-flex"
                                                    }`}
                                                as={Row}
                                            >
                                                <Form.Label column sm={3} xl={2}>
                                                    {t("Target Account Number")}
                                                </Form.Label>
                                                <Col sm={9} xl={10}>
                                                    <InputGroup>
                                                        <Form.Control
                                                            value={data.targetAccount}
                                                            required={
                                                                data.transactionType === "4"
                                                                    ? true
                                                                    : false
                                                            }
                                                            type="text"
                                                            id="targetAccount"
                                                            onChange={handleChange}
                                                            onBlur={() => {
                                                                if (
                                                                    data.transactionType === "4" &&
                                                                    data.targetAccount !== "" &&
                                                                    data.targetAccount !== undefined
                                                                )
                                                                    getId(
                                                                        setVerify,
                                                                        token,
                                                                        data.targetAccount,
                                                                        setErrorExternalNumber,
                                                                        data,
                                                                        setData,
                                                                        some,
                                                                        setSome,
                                                                        urlPrefix
                                                                    );
                                                            }}
                                                            className="borderRightNone"
                                                        ></Form.Control>
                                                        <InputGroup.Text
                                                            id="basic-addon1"
                                                            className={`bgWhite borderXNone ${verify ? "d-inline-block" : "d-none"
                                                                }`}
                                                        >
                                                            <Spinner
                                                                variant="danger"
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                        </InputGroup.Text>
                                                        <Button
                                                            variant="danger"
                                                            disabled={verify}
                                                            className="mainColor:validated"
                                                            id="button-addon2"
                                                            onClick={() => {
                                                                if (
                                                                    data.transactionType === "4" &&
                                                                    data.targetAccount !== "" &&
                                                                    data.targetAccount !== undefined
                                                                )
                                                                    getId(
                                                                        setVerify,
                                                                        token,
                                                                        data.targetAccount,
                                                                        setErrorExternalNumber,
                                                                        data,
                                                                        setData,
                                                                        some,
                                                                        setSome,
                                                                        urlPrefix
                                                                    );
                                                            }}
                                                        >
                                                            {t("Verify")}
                                                        </Button>
                                                    </InputGroup>
                                                    <Form.Text
                                                        className={`text-primary ${data.transactionType === "4"
                                                            ? "d-flex"
                                                            : "d-none"
                                                            }`}
                                                        muted
                                                    >
                                                        <p class={errorExternalNumber.color}>
                                                            {t(errorExternalNumber.text)}
                                                        </p>
                                                    </Form.Text>
                                                    <Form.Text
                                                        className={
                                                            data.transactionType === "2"
                                                                ? "d-flex"
                                                                : "d-none"
                                                        }
                                                        muted
                                                    >
                                                        {t("Please, enter the target account")}
                                                    </Form.Text>
                                                </Col>
                                            </Form.Group>
                                            {/*---------------Target Account for other transactions with a external newtarget-------------- */}
                                            <Form.Group
                                                className={`mt-2  ${data.transactionType === "1" ||
                                                    data.transactionType === "4"
                                                    ? "d-none"
                                                    : "d-flex"
                                                    }`}
                                                as={Row}
                                            >
                                                <Form.Label column sm={3} xl={2}>
                                                    {t("Target Account Number")}
                                                </Form.Label>
                                                <Col sm={9} xl={10}>
                                                    <InputGroup>
                                                        <Form.Control
                                                            value={data.targetAccount}
                                                            required={
                                                                data.transactionType === "2"
                                                                    ? true
                                                                    : false
                                                            }
                                                            type="text"
                                                            id="targetAccount"
                                                            onChange={handleChange}
                                                        ></Form.Control>
                                                    </InputGroup>
                                                    <Form.Text muted>
                                                        {t(
                                                            "Please, enter the number of the target account"
                                                        )}
                                                    </Form.Text>
                                                </Col>
                                            </Form.Group>
                                        </>

                                        {/*------------------------------New Target account selector for internal Transactions-------------*/}
                                        <Container
                                            className={`mx-0 px-0 mb-2 ${data.transactionType === "1" ? "d-block" : "d-none"
                                                }`}
                                            fluid
                                        >
                                            <hr />
                                            <h2>Target Account</h2>
                                            <Row>
                                                <Form.Label column sm={3} xl={2}>
                                                    {t("Target Account")}
                                                </Form.Label>
                                                <Col sm={9} xl={10}>
                                                    <Container className="px-0" fluid>
                                                        <Row className="accountSelector flex-row flex-nowrap ">
                                                            {accounts.map((u, i) => {
                                                                return (
                                                                    u.id.toString() ===
                                                                        data.sourceAccountId.toString() ? (
                                                                        <></>
                                                                    ) : (
                                                                        data.currency !== u.currency.name
                                                                    )
                                                                ) ? (
                                                                    <></>
                                                                ) : (
                                                                    <AccountCard
                                                                        setAccountSelected={
                                                                            setTargetAccountSelected
                                                                        }
                                                                        accountSelected={targetAccountSelected}
                                                                        setData={setData}
                                                                        data={data}
                                                                        setSome={setSome}
                                                                        some={some}
                                                                        field={"targetAccount"}
                                                                        account={u}
                                                                        ownKey={i}
                                                                        key={i}
                                                                        setErrorExternalNumber={
                                                                            setErrorExternalNumber
                                                                        }
                                                                        disabled={
                                                                            u.id.toString() ===
                                                                                data.sourceAccountId
                                                                                ? true
                                                                                : data.currency !== u.currency.name
                                                                        }
                                                                    ></AccountCard>
                                                                );
                                                            })}
                                                        </Row>
                                                    </Container>
                                                </Col>
                                            </Row>
                                        </Container>

                                        {/*---------------Target beneficiary (Name) for Other transactions-------------- */}

                                        <Form.Group
                                            as={Row}
                                            className={`mt-2 ${data.transactionType === "1" ? "d-none" : "d-flex"
                                                }`}
                                        >
                                            <Form.Label column sm={3} xl={2}>
                                                {t("Target Beneficiary")}
                                            </Form.Label>
                                            <Col sm={9} xl={10}>
                                                <Form.Control
                                                    value={data.targetBeneficiary}
                                                    type="text"
                                                    placeholder=""
                                                    id="targetBeneficiary"
                                                    required={transactionType === "1" ? false : true}
                                                    onChange={handleChange}
                                                />
                                                <Form.Text muted>
                                                    {t(
                                                        "Please, enter the name of the owner of target account"
                                                    )}
                                                </Form.Text>
                                            </Col>
                                        </Form.Group>

                                        {/*---------------Geographic info for non internal transactions-------------- */}
                                        <GeographicInfo data={data} setData={setData} />


                                        {/*--------------------------------------------------------------------------   Transaction info     -------------------------------------------------------------*/}
                                        <hr />
                                        <h2>{t("Transaction details")}</h2>
                                        {/*---------------currency for Other transactions-------------- */}
                                        <Form.Group as={Row} className={`mt-0 d-none `}>
                                            <Form.Label column sm={3} xl={2}>
                                                {t("Currency")}
                                            </Form.Label>
                                            <Col sm={9} xl={10}>
                                                <Form.Control
                                                    value={data.currency}
                                                    type="text"
                                                    id="currency"
                                                    required={transactionType === "1" ? false : true}
                                                    onChange={handleChange}
                                                />
                                                <Form.Text muted>
                                                    {t(
                                                        "Please, select the source account to autocomplete this field"
                                                    )}
                                                </Form.Text>
                                            </Col>
                                        </Form.Group>

                                        {/*---------------Movement Amount for all types of transactions-------------- */}
                                        <Form.Group as={Row} className="mt-2">
                                            <Form.Label column sm={3} xl={2}>
                                                {t("Movement Amount")}
                                            </Form.Label>
                                            <Col sm={9} xl={10}>
                                                <InputGroup className="mb-0" autocomplete="nope">
                                                    {IndexOfaccountSelected(
                                                        accounts,
                                                        data.sourceAccountId
                                                    ) === -1 ? (
                                                        <div></div>
                                                    ) : (
                                                        <InputGroup.Text>
                                                            <span>
                                                                {
                                                                    accounts[
                                                                        IndexOfaccountSelected(
                                                                            accounts,
                                                                            data.sourceAccountId
                                                                        )
                                                                    ].currency.symbol
                                                                }
                                                            </span>
                                                        </InputGroup.Text>
                                                    )}
                                                    <Form.Control
                                                        value={data.movementAmount}
                                                        type="number"
                                                        min="1"
                                                        step="0.01"
                                                        placeholder=""
                                                        id="movementAmount"
                                                        required
                                                        onChange={handleChange}
                                                    />
                                                </InputGroup>
                                                <Form.Text muted className="mb-2">
                                                    {t("Please, enter the movement amount")}
                                                </Form.Text>
                                            </Col>
                                        </Form.Group>

                                        {/*---------------Transaction Request Description for all types of transactions-------------- */}
                                        <Form.Group as={Row} className="mt-2 mb-2">
                                            <Form.Label column sm={3} xl={2}>
                                                {t("Transaction Request Description")}
                                            </Form.Label>
                                            <Col sm={9} xl={10}>
                                                <Form.Control
                                                    value={data.transactionRequestDescription}
                                                    type="text"
                                                    placeholder=""
                                                    id="transactionRequestDescription"
                                                    required
                                                    onChange={handleChange}
                                                />
                                                <Form.Text muted>
                                                    {t(
                                                        "Please, enter a short description about the transaction"
                                                    )}
                                                </Form.Text>
                                            </Col>
                                        </Form.Group>

                                        <Accordion
                                            className={`mb-2 ${data.transactionType === "2" ? "d-block" : "d-none"
                                                }`}
                                            defaultActiveKey="0"
                                            flush
                                        >
                                            <Accordion.Item>
                                                <Accordion.Header className="ps-0">
                                                    {t("Special instructions")}
                                                </Accordion.Header>
                                                <Accordion.Body>
                                                    <Form.Group as={Row} className="mt-2 mb-2">
                                                        <Form.Label column sm={3} xl={2}>
                                                            {t("Special instructions")}
                                                        </Form.Label>
                                                        <Col sm={9} xl={10}>
                                                            <Form.Control maxlength="80" type="text" />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mt-2 mb-2">
                                                        <Form.Label column sm={3} xl={2} />
                                                        <Col sm={9} xl={10}>
                                                            <Form.Control maxlength="80" type="text" />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mt-2 mb-2">
                                                        <Form.Label column sm={3} xl={2} />
                                                        <Col sm={9} xl={10}>
                                                            <Form.Control maxlength="80" type="text" />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mt-2 mb-2">
                                                        <Form.Label column sm={3} xl={2} />
                                                        <Col sm={9} xl={10}>
                                                            <Form.Control maxlength="80" type="text" />
                                                        </Col>
                                                    </Form.Group>
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                        {/*Checkbox for saving target account details*/}
                                        <Form.Group
                                            className={`mb-4 ${data.transactionType === "1"
                                                ? "d-none"
                                                : data.targetAccountType === "1"
                                                    ? "d-none"
                                                    : data.targetAccountType === "2"
                                                        ? "d-none"
                                                        : "d-flex"
                                                }`}
                                        >
                                            <Form.Check
                                                id="saveContact"
                                                onChange={handleChange}
                                                type="checkbox"
                                                label={t(
                                                    "Save target account details to use for future transactions"
                                                )}
                                            />
                                        </Form.Group>
                                        {/*//Checkbox for edit saved target account selected details*/}
                                        <Form.Group
                                            className={`mb-4 ${data.transactionType === "1"
                                                ? "d-none"
                                                : data.targetAccountType === "1"
                                                    ? "d-none"
                                                    : data.targetAccountType === "2"
                                                        ? "d-flex"
                                                        : "d-none"
                                                }`}
                                        >
                                            <Form.Check
                                                id="editContact"
                                                onChange={handleChange}
                                                type="checkbox"
                                                label={t(
                                                    "Update target account details of the saved account selected"
                                                )}
                                            />
                                        </Form.Group>
                                    </div>
                                </Collapse>

                                {/* Submit button */}
                                <Container
                                    className={`p-0 ${data.transactionType === "1"
                                        ? accounts.filter(
                                            (u) =>
                                                u.id.toString() !== data.sourceAccountId &&
                                                u.currency.name === data.currency
                                        ).length > 0
                                            ? "d-block"
                                            : "d-none"
                                        : "d-block"
                                        }`}
                                >
                                    <Row>
                                        <Col className="d-flex flex-row-reverse">
                                            <Button
                                                disabled={
                                                    data.movementAmount === undefined ||
                                                    data.movementAmount === "" ||
                                                    accounts[accountSelected] === undefined ||
                                                    accounts[accountSelected].balance <
                                                    data.movementAmount || transacctionInProgress
                                                }
                                                type="submit"
                                                variant="danger"
                                                className="mainColor mb-5"
                                            >   <span>
                                                    <Spinner
                                                        className={transacctionInProgress ? "d-inline-block" : "d-none"}
                                                        variant="light"
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                                {" "}{t("Submit")}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>

                                {/* Secret for devops delete on deploy */}
                                <div className={secret ? "d-block" : "d-none"}>
                                    <Button
                                        onClick={() => {
                                            getUserRecents(token);
                                        }}
                                        variant="danger"
                                        className="mainColor me-3"
                                    >
                                        get recent
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            getUserSavedContacts(token);
                                        }}
                                        variant="danger"
                                        className="mainColor me-3"
                                    >
                                        get saved
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            deleteAccount(token, 30);
                                        }}
                                        variant="danger"
                                        className="mainColor"
                                    >
                                        Delete saved
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
};
export default TransactionRequest;

const IndexOfaccountSelected = (accounts, id) => {
    if (accounts !== undefined) {
        var index = accounts.findIndex((x) => x.id.toString() === id);
    }
    return index;
};

//For accounts from wadiah,retrieves the id by the external number
const getId = (
    setVerify,
    token,
    externalNumberEntered,
    setErrorExternalNumber,
    data,
    setData,
    some,
    setSome,
    urlPrefix
) => {
    let response = {
        "id": 336,
        "externalNumber": "3710 8100 1314 6755.",
        "currency": {
            "code": "USD",
            "name": "United States Dollar",
            "symbol": "$",
            "decimals": 2
        },
        "beneficiaryName": "Wang Zamora"
    }
    if (data.currency === response.currency.name) {
        setErrorExternalNumber({
            text: "The external number was validated correctly!",
            color: "text-success",
        });
    } else if (data.currency === "") {
        setErrorExternalNumber({
            text: "Please, select a source account",
            color: "text-danger",
        });
    } else {
        setErrorExternalNumber({
            text: "The external number entered belongs to an account with a currency different from the source account",
            color: "text-danger",
        });
    }
    let aux = data;
    aux.targetBeneficiary = response.beneficiaryName;
    aux.targetAccountCurrency = response.currency.name;
    aux.targetAccountId = response.id;

    setData(aux);
    setSome(!some);
};

const sendTransactionRequest = (
    data,
    token,
    transactionInfo,
    setTransactionInfo,
    accounts,
    formData,
    setItemSelected,
    history,
    setTransactionInProgress,
    urlPrefix
) => {

    let response = {
        amount: 15,
        canceled: false,
        confirmed: true,
        currency: { code: "USD", name: "United States Dollar", symbol: "$", decimals: 2 },
        date: "2021-09-16T14:45:48.000Z",
        description: "Descripcion",
        id: 320,
        movementAmount: 15,
        processed: true,
        sourceAccount: {
            balance: 24989989828.999996,
            beneficiaryName: "Burton Gray",
            currency: { code: "USD", name: "United States Dollar", symbol: "$", decimals: 2 },
            decimals: 0,
            description: "asset custody usd",
            externalNumber: "000000000000001",
            id: 293,
            movementsCount: 124,
            type: {
                description: "asset custody",
                id: 111,
                productLine:
                {
                    description: " ",
                    id: 0,
                }
            }
        },
        status: 30,
        statusKey: "CONFIRMED",
        targetExternalBank: "Wadiah Capital",
        targetExternalBeneficiary: "Burton Gray",
        targetExternalNumber: "00000000000000003",
        targetRoutingNumber: "",
        type: 1
    }
    response.sourceAccount =
        accounts[IndexOfaccountSelected(accounts, formData.sourceAccountId)];
    setTransactionInfo(response);
    setItemSelected("");
    sessionStorage.removeItem('account')
    history.push(`/dashboardNew/transactionResult`);

};

const getBankInfoBySwift = (
    targetRoutingNumber,
    data,
    setData,
    bankData,
    setBankData,
    setSome,
    some,
    setBankDataFetched,
    setFetchingBD,
    setGeoBankInfoActive,
    urlPrefix
) => {
    setFetchingBD(true);
    let auxBankData = bankData;
    let aux = data
    let response = {
        "code": "SCBLUS33",
        "name": "STANDARD CHARTERED BANK",
        "address": "1095 AVENUE OF THE AMERICAS",
        "city": "NEW YORK",
        "zipCode": "10036",
        "country": "UNITED STATES OF AMERICA",
        "countryCode": "US",
        "source": "Service"
    }
    if (response.statusCode === undefined) {
        auxBankData.bankAddress = response.address;
        auxBankData.bankCountry = response.country;
        auxBankData.bankCity = response.city;
        auxBankData.bankZipCode = response.zipCode;
        setBankData(aux);
        aux.targetBank = response.name;
        setData(aux);
        setSome(!some);
        setBankDataFetched(true);
        setGeoBankInfoActive("0");
    } else {
        auxBankData.bankAddress = "";
        auxBankData.bankCountry = "";
        auxBankData.bankCity = "";
        auxBankData.bankZipCode = "";
        setBankData(aux);
        aux.targetBank = "";
        setData(aux);
        setBankDataFetched(false);
        setSome(!some);
        setGeoBankInfoActive("1");
    }
    setFetchingBD(false);

};
