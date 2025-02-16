"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface TransactionFormProps {
  onTransaction: (type: "deposit" | "withdrawal", amount: number) => void
}

export default function TransactionForm({ onTransaction }: TransactionFormProps) {
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"deposit" | "withdrawal">("deposit")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      alert("Please enter a valid amount")
      return
    }
    onTransaction(type, numAmount)
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          required
          min="0.01"
          step="0.01"
        />
      </div>
      <RadioGroup value={type} onValueChange={(value) => setType(value as "deposit" | "withdrawal")}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="deposit" id="deposit" />
          <Label htmlFor="deposit">Deposit</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="withdrawal" id="withdrawal" />
          <Label htmlFor="withdrawal">Withdrawal</Label>
        </div>
      </RadioGroup>
      <Button type="submit" className="w-full">
        Submit Transaction
      </Button>
    </form>
  )
}

