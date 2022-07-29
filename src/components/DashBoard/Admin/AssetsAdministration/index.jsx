import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import ViewAndDeleteAssets from './ViewAndDeleteAssets'
import EditAssets from './EditAssets'
import CreateAssets from './CreateAssets'
import Loading from './Loading'
import './index.css'


const AssetsAdministration = () => {
    const [FetchingAssets, setFetchingAssets] = useState([])
    const [Assets, setAssets] = useState([])
    const [FilteredAssets, setFilteredAssets] = useState([])
    const [AssetTypes, setAssetTypes] = useState([])

    const [Action, setAction] = useState({ asset: -1, action: -1 })//Action===0 -> edit; Action===1 -> create

    const [SearchText, setSearchText] = useState("")

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
            setFilteredAssets(data)
            setFetchingAssets(false)
            //If there are no assets, go to creation form
            if(data.length===0) setAction({...Action,...{action:1,fund:-1}})
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
                getAssets()
            } else {
                switch (response.status) {
                    default:
                        console.error(response.status)
                }
            }
        }

        setFetchingAssets(true)
        getTypes()
        //eslint-disable-next-line
    }, [])

    const handleSearch = (event) => {
        setSearchText(event.target.value)
        const regex = new RegExp(`${event.target.value}`, 'i')
        const suggestions = Assets.sort().filter(Asset => Asset.name.match(regex))
        setFilteredAssets(suggestions)
    }

    const cancelSearch = () => {
        setSearchText("")
        setFilteredAssets(Assets)
    }

    const chargeAssets = () => {
        setFetchingAssets(true)
        getAssets()
    }

    if (FetchingAssets) {
        return <Loading />
    } else {
        return (
            <Container className="h-100 AssetsAdministration">
                <Row className="h-100 d-flex justify-content-center">
                    {

                        {
                            "-1":
                                <ViewAndDeleteAssets
                                    SearchText={SearchText} handleSearch={handleSearch} cancelSearch={cancelSearch} AssetTypes={AssetTypes}
                                    FilteredAssets={FilteredAssets} chargeAssets={chargeAssets} setAction={setAction} Action={Action}
                                />
                            ,
                            0: <EditAssets Assets={Assets} AssetTypes={AssetTypes} chargeAssets={chargeAssets}
                                Action={Action} setAction={setAction} />,
                            1: <CreateAssets Assets={Assets} AssetTypes={AssetTypes} chargeAssets={chargeAssets}
                                Action={Action} setAction={setAction} />
                        }[Action.action]
                    }
                </Row>
            </Container>
        )
    }

}
export default AssetsAdministration