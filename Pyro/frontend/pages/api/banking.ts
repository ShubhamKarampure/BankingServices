import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const response = await axios.get('http://localhost:8001/get_balance')
            res.status(200).json(response.data)
        } catch (error) {
            console.error('Error:', error)
            res.status(500).json({ error: 'Failed to get balance' })
        }
    } else if (req.method === 'POST') {
        const { type, amount } = req.body
        try {
            const endpoint = type === 'deposit' ? 'deposit' : 'withdraw'
            const response = await axios.post(`http://localhost:8001/${endpoint}/${amount}`)
            res.status(200).json(response.data)
        } catch (error) {
            console.error('Error:', error)
            res.status(500).json({ error: 'Transaction failed' })
        }
    } else {
        res.status(405).end() // Method Not Allowed
    }
}
