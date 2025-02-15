"use client"

import { useState } from "react"
import BalanceDisplay from "./components/BalanceDisplay"
import TransactionForm from "./components/TransactionForm"
import TransactionHistory from "./components/TransactionHistory"

type Transaction = {
  type: "deposit" | "withdrawal"
  amount: number
  date: Date
}

export default function BankingSystem() {
  const [balance, setBalance] = useState(1000) // Starting balance of $1000
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const handleTransaction = (type: "deposit" | "withdrawal", amount: number) => {
    if (type === "withdrawal" && amount > balance) {
      alert("Insufficient funds!")
      return
    }

    const newBalance = type === "deposit" ? balance + amount : balance - amount
    setBalance(newBalance)

    const newTransaction: Transaction = {
      type,
      amount,
      date: new Date(),
    }
    setTransactions([newTransaction, ...transactions])
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

