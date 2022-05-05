import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine,ResponsiveContainer,Brush } from 'recharts';
import './index.css'
import moment from 'moment';

const Chart = ({  Height, Width }) => {



    const generateData = (amount = 10, max = 100, min = 0) => {
        let data = []

        for (let index = amount; index > 0; index--) {
            let todayMoment = moment()
            const date = todayMoment.subtract(index, "days").format('MMM DD YY')
            const price = (Math.random() * (max - min) + min).toFixed(2);;

            data.push({
                date: date,
                price: price
            })
        }
        return data
    }
    let data=generateData(20,100,30)

    return (
        <ResponsiveContainer width="100%" height={Height}>
            <LineChart width={Width} height={Height} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="uv" stroke="#808080" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" angle={0} dx={20} />        
                <YAxis />
                <Tooltip />
                <ReferenceLine y={80} label="Max" stroke="red" />
                <Line type="monotone" dataKey="price" stroke="#808080" />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                <Brush />
            </LineChart>
        </ResponsiveContainer> 
    )
}
export default Chart

