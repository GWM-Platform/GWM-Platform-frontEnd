import React from 'react'
import { Col, Card } from 'react-bootstrap';

function AccountCard({ disabled, some, setSome, data, setData, account, ownKey, setAccountSelected, accountSelected, field, setTargetAccountSelected, setErrorExternalNumber }) {
    if (field === "targetAccount") {
        //console.log(account.id,disabled?"deshabilitada":"habilitada")
    }
    return (
        <Col style={{ cursor: "pointer" }} className="pe-0" xs="auto" sm="auto" xl="auto" onClick={() => { if (!disabled) { setAccountSelected(ownKey); setAccountSelectedInData(some, setSome, data, setData, account, field, setTargetAccountSelected, setErrorExternalNumber) } }}>
            <Card className={`${accountSelected === ownKey ? "accountSelected" : "account"} h-100`}>
                <Card.Header className="text-end header"><strong>{account.externalNumber}</strong></Card.Header>
                <Card.Body>
                    <Card.Text style={{ textTransform: "capitalize" }}>
                        {account.description}
                    </Card.Text>
                    <Card.Text className="text-muted">
                        {account.currency.symbol}
                        {account.balance.toFixed(account.currency.decimals === 0 ? 2 : account.currency.decimals)}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default AccountCard;

const setAccountSelectedInData = (some, setSome, data, setData, account, field, setTargetAccountSelected, setErrorExternalNumber) => {
    setSome(!some)
    let aux
    aux = data
    aux.currency = account.currency.name
    if (field === "sourceAccountId") {
        if (data.transactionType === "1") {
            setTargetAccountSelected(-1)
            aux.targetAccount = ""
        }else{
            if (aux.targetAccountId !== "" && aux.targetAccountId !== undefined && aux.targetAccountCurrency === aux.currency) {
                setErrorExternalNumber({ text: "The external number was validated correctly!", color: "text-success" })
            } else if ((aux.targetAccountId !== "" || aux.targetAccountId !== undefined) && aux.targetAccountCurrency!==undefined ) {
                setErrorExternalNumber({ text: `The external number entered belongs to an account with a currency different from the source account`, color: "text-danger" })
            }
        }
    }
    aux[field] = account.id.toString()
    setData(aux)
}
