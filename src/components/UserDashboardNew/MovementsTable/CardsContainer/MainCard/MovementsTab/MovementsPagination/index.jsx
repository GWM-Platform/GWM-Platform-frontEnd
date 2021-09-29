import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap';

const MovementsPagination = ({ page, setPage, movsShown, movementsCount,useFilter }) => {

    return (
        <div className={`w-100 ${movementsCount<=movsShown || useFilter ? "d-none" : "d-block"}`}>
            <Pagination className="mb-0 mt-2 d-flex justify-content-center">
                <Pagination.First
                    className={page < 2 ? "d-none" : "d-block"}
                    onClick={() => { setPage(0) }} />

                <Pagination.Prev
                    className={page === 0 ? "d-none" : "d-block"}
                    onClick={() => { setPage(page - 1) }} />

                <Pagination.Item
                    className={page < 1 ? "d-none" : "d-block"}
                    onClick={() => { setPage(0) }}>
                    {1}
                </Pagination.Item>

                <Pagination.Ellipsis
                    className={page < 4 ? "d-none" : "d-block"} />

                <Pagination.Item
                    className={page < 3 ? "d-none" : "d-block"}
                    onClick={() => { setPage(page - 2) }}>
                    {page - 1}
                </Pagination.Item>

                <Pagination.Item
                    className={page < 2 ? "d-none" : "d-block"}
                    onClick={() => { setPage(page - 1) }}>
                    {page}
                </Pagination.Item>

                <Pagination.Item active>{page + 1}</Pagination.Item>

                <Pagination.Item
                    className={page > Math.ceil(movementsCount / movsShown) - 2 ? "d-none" : "d-block"}
                    onClick={() => { setPage(page + 1) }}>
                    {page + 2}
                </Pagination.Item>

                <Pagination.Item
                    className={page > Math.ceil(movementsCount / movsShown) - 3 ? "d-none" : "d-block"}
                    onClick={() => { setPage(page + 2) }} >
                    {page + 3}
                </Pagination.Item>

                <Pagination.Ellipsis
                    className={page > Math.ceil(movementsCount / movsShown) - 5 ? "d-none" : "d-block"}
                />

                <Pagination.Item
                    className={page > Math.ceil(movementsCount / movsShown) - 4 ? "d-none" : "d-block"}
                    onClick={() => { setPage(Math.ceil(movementsCount / movsShown) - 1) }}>
                    {Math.ceil(movementsCount / movsShown)}
                </Pagination.Item>

                <Pagination.Next
                    className={page > Math.ceil(movementsCount / movsShown) - 2 ? "d-none" : "d-block"}
                    onClick={() => { setPage(page + 1) }} />

                <Pagination.Last
                    className={page > Math.ceil(movementsCount / movsShown) - 3 ? "d-none" : "d-block"}
                    onClick={() => { setPage(Math.ceil(movementsCount / movsShown) - 1) }} />
            </Pagination>
        </div>
    )
}
export default MovementsPagination
