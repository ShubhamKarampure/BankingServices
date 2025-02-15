"use client"

import { useState, useEffect } from "react"
import BalanceDisplay from "./components/BalanceDisplay"
import TransactionForm from "./components/TransactionForm"
import TransactionHistory from "./components/TransactionHistory"
import axios from "axios"

type Transaction = {
  type: "deposit" | "withdrawal"
  amount: number
  date: Date
}

export default function BankingSystem() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.post("/api/banking", {
          method: "get_balance",
        })
        setBalance(parseInt(response.data.result[0])) // Extracting the balance value
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    }
    fetchBalance()
  }, [])

  const handleTransaction = async (type: "deposit" | "withdrawal", amount: number) => {
    if (type === "withdrawal" && amount > balance) {
      alert("Insufficient funds!")
      return
    }

    try {
      const response = await axios.post("/api/banking", {
        method: type === "deposit" ? "deposit" : "withdraw",
        amount: amount,
      })

      // Update balance after successful transaction
      const newBalance = type === "deposit" ? balance + amount : balance - amount
      setBalance(newBalance)

      // Add transaction to history
      const newTransaction: Transaction = {
        type,
        amount,
        date: new Date(),
      }
      setTransactions([newTransaction, ...transactions])
    } catch (error) {
      console.error("Transaction Error:", error)
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

