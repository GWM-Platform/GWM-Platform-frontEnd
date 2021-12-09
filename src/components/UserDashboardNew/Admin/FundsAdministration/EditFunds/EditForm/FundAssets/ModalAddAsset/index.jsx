import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, FloatingLabel } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import AvailableAssets from './AvailableAssets';
import './index.css'

const FundAssets = ({ Show, setShow,Fund }) => {
    const { t } = useTranslation();

    const [Amount, setAmount] = useState(0)
    const [AssetSelected, setAssetSelected] = useState(-1)
    const [Assets, setAssets] = useState([])

    const handleChange = (event) => {
        setAmount(parseInt(event.target.value))
    }

    const getAssets = async () => {
        var url = `${process.env.REACT_APP_APIURL}/assets`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setAssets(data)
        } else {
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    const addAssets = async () => {
        const token = sessionStorage.getItem("access_token")
        var url = `${process.env.REACT_APP_APIURL}/funds/${Fund.id}/sources`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(
                {
                    assetId: Assets[AssetSelected].id,
                    amount:Amount
                }
            ),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setAssets(data)
        } else {
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    useEffect(() => {
        getAssets()
    }, [])

    return (
        <Modal centered className="editModal" size="lg" show={Show} onHide={() => setShow(false)} >
            <Modal.Body className="body">
                <h1 className='mb-5'>Agregar Activos</h1>
                <AvailableAssets Assets={Assets} AssetSelected={AssetSelected} setAssetSelected={setAssetSelected} />
                <FloatingLabel label={t("Cantidad")} className="mb-3">
                    <Form.Control required onChange={handleChange} id="name" value={Amount} type="number" placeholder={t("Amount")} />
                    <Form.Control.Feedback type="invalid">
                        {t("")}
                    </Form.Control.Feedback>
                </FloatingLabel>
            </Modal.Body>
            <Modal.Footer className="footer justify-content-center">
                <Button variant="outline-danger" onClick={() => setShow(false)}>
                    Close
                </Button>
                <Button variant="outline-secondary" onClick={()=>addAssets()}>
                    {t("Add Asset")}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FundAssets