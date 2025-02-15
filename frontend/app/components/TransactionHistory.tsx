interface Transaction {
  type: "deposit" | "withdrawal"
  amount: number
  date: Date
}

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Transaction History</h3>
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {transactions.map((transaction, index) => (
            <li key={index} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <span
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                      transaction.type === "deposit" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "deposit" ? "↑" : "↓"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {transaction.type === "deposit" ? "Deposit" : "Withdrawal"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{transaction.date.toLocaleString()}</p>
                </div>
                <div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === "deposit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

