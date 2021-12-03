import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import ViewDeleteAndCreateFunds from './ViewDeleteAndCreateFunds'
import EditFunds from './EditFunds'
import Loading from './Loading'
import './index.css'


const FundsAdministration = () => {
    const [FetchingFunds, setFetchingFunds] = useState([])
    const [Funds, setFunds] = useState([])
    const [FilteredFunds, setFilteredFunds] = useState([])
    const [AssetTypes, setAssetTypes] = useState([])

    const [FundSelected, setFundSelected] = useState(-1)

    const [SearchText, setSearchText] = useState("")

    const getFunds = async () => {
        var url = `${process.env.REACT_APP_APIURL}/funds`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setFunds(data)
            setFilteredFunds(data)
            setFetchingFunds(false)
        } else {
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    useEffect(() => {
        const getTypes = async () => {
            var url = `${process.env.REACT_APP_APIURL}/assets/types`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setAssetTypes(data)
                getFunds()
            } else {
                switch (response.status) {
                    default:
                        console.error(response.status)
                }
            }
        }

        setFetchingFunds(true)
        getTypes()
    }, [])

    const handleSearch = (event) => {
        setSearchText(event.target.value)
        const regex = new RegExp(`${event.target.value}`, 'i')
        const suggestions = Funds.sort().filter(Fund => Fund.name.match(regex))
        setFilteredFunds(suggestions)
    }

    const cancelSearch = () => {
        setSearchText("")
        setFilteredFunds(Funds)
    }

    const chargeFunds = () => {
        setFetchingFunds(true)
        getFunds()
    }

    if (FetchingFunds) {
        return <Loading />
    } else {
        return (
            <Container className="h-100 FundsAdministration">
                <Row className="h-100 d-flex justify-content-center">
                    {FundSelected === -1 ?
                        <ViewDeleteAndCreateFunds
                            SearchText={SearchText} handleSearch={handleSearch} cancelSearch={cancelSearch} AssetTypes={AssetTypes}
                            FilteredFunds={FilteredFunds} chargeFunds={chargeFunds} setFundSelected={setFundSelected}
                        />
                        :
                        <EditFunds Funds={Funds} AssetTypes={AssetTypes} chargeFunds={chargeFunds}
                            FundSelected={FundSelected} setFundSelected={setFundSelected} />
                    }
                </Row>
            </Container>
        )
    }

}
export default FundsAdministration