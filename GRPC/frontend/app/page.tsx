"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import BalanceDisplay from "./components/BalanceDisplay"
import TransactionForm from "./components/TransactionForm"
import TransactionHistory from "./components/TransactionHistory"

type Transaction = {
  type: "deposit" | "withdrawal"
  amount: number
  date: Date
}

export default function BankingSystem() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Fetch balance when the component mounts
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await axios.get('http://localhost:8000/balance')
        setBalance(res.data.balance)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      }
    }
    fetchBalance()
  }, [])

  const handleTransaction = async (type: "deposit" | "withdrawal", amount: number) => {
    try {
      const endpoint = type === "deposit" ? "/deposit" : "/withdraw"

      const res = await axios.post(`http://localhost:8000${endpoint}`, { amount })

      if (res.data.success) {
        // Refresh balance after a successful transaction
        setBalance(res.data.new_balance)

        // Add the new transaction to the history
        const newTransaction: Transaction = {
          type,
          amount,
          date: new Date(),
        }
        setTransactions([newTransaction, ...transactions])
      } else {
        alert('Transaction failed!')
      }
    } catch (error) {
      console.error('Transaction error:', error)
      alert('An error occurred while processing the transaction.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-extrabold text-center">Banking System</h2>
                <BalanceDisplay balance={balance} />
                <TransactionForm onTransaction={handleTransaction} />
                <TransactionHistory transactions={transactions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
