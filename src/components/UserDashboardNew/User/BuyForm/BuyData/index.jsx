import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, FloatingLabel, Row,Button } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const BuyData = ({ data, founds }) => {
    const { t } = useTranslation();

    return (
        <div className={`formSection ${data.foundSelected === undefined ? "d-none": "d-block"}`}>
            <Row className="d-flex justify-content-center">
                <Form.Label className="mb-3 pt-0 label d-flex align-items-center" column sm="auto">
                    <div className="d-inline-block numberContainer">
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <span className="number">2</span>
                        </div>
                    </div>
                    {t("Specify the cuantity you want to buy")}
                </Form.Label>

                <Form>
                    <FloatingLabel
                        label={t("Cuantity")}
                        className="mb-3"
                    >
                        <Form.Control
                            min="1"
                            max={data.foundSelected === undefined ?
                                1
                                :
                                founds[data.foundSelected].feePartsAvalilable}
                            id="cuantity"
                            type="number"
                            placeholder={t("Cuantity")}
                        />
                    </FloatingLabel>
                    <Button variant="danger" type="submit">{t("Submit")}</Button>
                </Form>
            </Row>
        </div>
    )
}
export default BuyData