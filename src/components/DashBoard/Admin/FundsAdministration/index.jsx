import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import ViewAndDeleteFunds from './ViewAndDeleteFunds'
import EditFunds from './EditFunds'
import CreateFunds from './CreateFunds'
import Loading from 'components/DashBoard/Admin/Loading'
import './index.css'


const FundsAdministration = () => {
    const [FetchingFunds, setFetchingFunds] = useState([])
    const [Funds, setFunds] = useState([])
    const [FilteredFunds, setFilteredFunds] = useState([])
    const [AssetTypes, setAssetTypes] = useState([])

    const [Action, setAction] = useState({ fund: -1, action: -1 })//Action===0 -> edit; Action===1 -> create

    const [SearchText, setSearchText] = useState("")
    //const [CategorySearched, setCategorySearched] = useState("")

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
            //setCategorySearched(Object.keys(data[0])[0])
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
                getFunds()
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
                    {

                        {
                            "-1":
                                <ViewAndDeleteFunds
                                    /*CategorySearched={CategorySearched} setCategorySearched={setCategorySearched}*/
                                    SearchText={SearchText} handleSearch={handleSearch} cancelSearch={cancelSearch} AssetTypes={AssetTypes}
                                    FilteredFunds={FilteredFunds} Funds={Funds} chargeFunds={chargeFunds} setAction={setAction} Action={Action}
                                />
                            ,
                            0: <EditFunds Funds={Funds} AssetTypes={AssetTypes} chargeFunds={chargeFunds}
                                Action={Action} setAction={setAction} />,
                            1: <CreateFunds Funds={Funds} AssetTypes={AssetTypes} chargeFunds={chargeFunds}
                                Action={Action} setAction={setAction} />
                        }[Action.action]
                    }
                </Row>
            </Container>
        )
    }

}
export default FundsAdministration