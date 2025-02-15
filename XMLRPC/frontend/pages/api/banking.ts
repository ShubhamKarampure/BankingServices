import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import xml2js from 'xml2js'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end()
    }

    const { method, amount } = req.body

    // Prepare XML-RPC Request Body
    const xmlRequest = `<?xml version="1.0"?>
    <methodCall>
      <methodName>${method}</methodName>
      <params>
        ${amount ? `<param><value><int>${amount}</int></value></param>` : ''}
      </params>
    </methodCall>
  `

    try {
        // Send request to XML-RPC server
        const response = await axios.post('http://localhost:8000/RPC2', xmlRequest, {
            headers: {
                'Content-Type': 'text/xml',
            },
        })

        // Parse XML Response
        xml2js.parseString(response.data, (err: any, result: any) => {
            if (err) {
                console.error("XML Parsing Error:", err)
                res.status(500).json({ error: "Error parsing XML" })
            } else {
                const methodResponse = result?.methodResponse

                // Check if there's a fault
                const fault = methodResponse?.fault
                if (fault) {
                    const faultCode = fault[0]?.value[0]?.struct[0]?.member[0]?.value[0]?.int[0] || "Unknown"
                    const faultString = fault[0]?.value[0]?.struct[0]?.member[1]?.value[0]?.string[0] || "Unknown error"
                    res.status(500).json({ error: `Fault Code ${faultCode}: ${faultString}` })
                } else {
                    // Proceed if no fault
                    const value = methodResponse?.params[0]?.param[0]?.value[0]?.int || "Error"
                    res.status(200).json({ result: value })
                }
            }
        })

    } catch (error) {
        console.error("XML-RPC Error:", error)
        res.status(500).json({ error: "Server Error" })
    }
}
