interface BalanceDisplayProps {
  balance: number
}

export default function BalanceDisplay({ balance }: BalanceDisplayProps) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium leading-6 text-gray-900">Current Balance</h3>
      <p className="mt-1 text-3xl font-semibold text-green-600">${balance.toFixed(2)}</p>
    </div>
  )
}

