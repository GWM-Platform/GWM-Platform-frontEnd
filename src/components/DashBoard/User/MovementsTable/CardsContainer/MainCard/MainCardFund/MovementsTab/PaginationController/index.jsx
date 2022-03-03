import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';

const PaginationController = ({ PaginationData, setPaginationData, total }) => {

    const ActualPage = PaginationData.skip / PaginationData.take
    console.table({"total - PaginationData.take":total - PaginationData.take,
    "PaginationData.skip":PaginationData.skip,"PaginationData.take":PaginationData.take,"total":total})
    return (
        <div className={`w-100 ${total <= PaginationData.take ? "d-none" : "d-block"}`}>
            <Pagination className="mb-0 mt-2 d-flex justify-content-center">
                <Pagination.First
                    className={ActualPage < 2 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: 0,
                            }
                        }))
                    }} />

                <Pagination.Prev
                    className={ActualPage === 0 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: prevState.skip - prevState.take,
                            }
                        }))
                    }} />

                <Pagination.Item
                    className={ActualPage < 1 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: 0,
                            }
                        }))
                    }}>
                    {1}
                </Pagination.Item>

                <Pagination.Ellipsis
                    className={ActualPage < 4 ? "d-none" : "d-block"} />

                <Pagination.Item
                    className={ActualPage < 3 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: prevState.skip - prevState.take * 2,
                            }
                        }))
                    }}>
                    {ActualPage - 1}
                </Pagination.Item>

                <Pagination.Item
                    className={ActualPage < 2 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: prevState.skip - prevState.take
                            }
                        }))
                    }}>
                    {ActualPage}

                </Pagination.Item>

                <Pagination.Item active>{ActualPage + 1}</Pagination.Item>

                <Pagination.Item
                    className={ActualPage > Math.ceil(total / PaginationData.take) - 2 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: prevState.skip + prevState.take,
                            }
                        }))
                    }}>
                    {ActualPage + 2}
                </Pagination.Item>

                <Pagination.Item
                    className={ActualPage > Math.ceil(total / PaginationData.take) - 3 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: prevState.skip + prevState.take * 2,
                            }
                        }))
                    }}>
                    {ActualPage + 3}
                </Pagination.Item>

                <Pagination.Ellipsis
                    className={ActualPage > Math.ceil(total / PaginationData.take) - 5 ? "d-none" : "d-block"}
                />

                <Pagination.Item
                    className={ActualPage > Math.ceil(total / PaginationData.take) - 4 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: total - prevState.take,
                            }
                        }))
                    }}
                >
                    {Math.ceil(total / PaginationData.take)}
                </Pagination.Item>

                <Pagination.Next
                    className={ActualPage > Math.ceil(total / PaginationData.take) - 2 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: prevState.skip + prevState.take,
                            }
                        }))
                    }}
                />

                <Pagination.Last
                    className={ActualPage > Math.ceil(total / PaginationData.take) - 3 ? "d-none" : "d-block"}
                    onClick={() => {
                        setPaginationData((prevState) => ({
                            ...prevState, ...{
                                skip: (Math.ceil(total / prevState.take)-1)*prevState.take,
                            }
                        }))
                    }}
                />
            </Pagination>
        </div>
    )
}
export default PaginationController
