import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

const dummyTransactions = [
    { id: 1, date: '2023-10-01', category: 'Food', amount: 20, description: 'Lunch' },
    { id: 2, date: '2023-10-02', category: 'Travel', amount: 50, description: 'Taxi' },
    { id: 3, date: '2023-10-03', category: 'Entertainment', amount: 30, description: 'Movie' },
    { id: 4, date: '2023-10-04', category: 'Food', amount: 15, description: 'Dinner' },
    { id: 5, date: '2023-10-05', category: 'Travel', amount: 100, description: 'Flight' },
    { id: 6, date: '2023-10-06', category: 'Entertainment', amount: 25, description: 'Concert' },
    { id: 7, date: '2023-10-07', category: 'Food', amount: 10, description: 'Breakfast' },
    { id: 8, date: '2023-10-08', category: 'Travel', amount: 40, description: 'Bus' },
    { id: 9, date: '2023-10-09', category: 'Entertainment', amount: 20, description: 'Game' },
    { id: 10, date: '2023-10-10', category: 'Food', amount: 30, description: 'Brunch' },
    // Add more dummy transactions here
]

const TransactionItem = ({ transaction }) => (
    <Card className="mb-4 bg-zinc-800 text-white">
        <CardHeader>
            <CardTitle>{transaction.description}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between">
                <span>{transaction.category}</span>
                <span>{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
                <span>${transaction.amount}</span>
            </div>
        </CardContent>
    </Card>
)

const Filter = ({ filters, setFilters }) => (
    <div className="flex gap-4 mb-4">
        <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            placeholder="Start Date"
            className="bg-zinc-700 text-white"
        />
        <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            placeholder="End Date"
            className="bg-zinc-700 text-white"
        />
        <Select
            value={filters.category}
            onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
            <SelectTrigger className="bg-zinc-700 text-white">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-700 text-white">
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Travel">Travel</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                {/* Add more categories here */}
            </SelectContent>
        </Select>
        <Input
            type="number"
            value={filters.minAmount}
            onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
            placeholder="Min Amount"
            className="bg-zinc-700 text-white"
        />
        <Input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
            placeholder="Max Amount"
            className="bg-zinc-700 text-white"
        />
        <Button onClick={() => setFilters({ startDate: '', endDate: '', category: 'All', minAmount: '', maxAmount: '' })}>
            Reset
        </Button>
    </div>
)

export const Transactions = () => {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        category: 'All',
        minAmount: '',
        maxAmount: '',
    })

    const filteredTransactions = dummyTransactions.filter((transaction) => {
        const startDateMatch = filters.startDate ? new Date(transaction.date) >= new Date(filters.startDate) : true
        const endDateMatch = filters.endDate ? new Date(transaction.date) <= new Date(filters.endDate) : true
        const categoryMatch = filters.category !== 'All' ? transaction.category === filters.category : true
        const minAmountMatch = filters.minAmount ? transaction.amount >= filters.minAmount : true
        const maxAmountMatch = filters.maxAmount ? transaction.amount <= filters.maxAmount : true
        return startDateMatch && endDateMatch && categoryMatch && minAmountMatch && maxAmountMatch
    })

    return (
        <div className="p-4 bg-zinc-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Transactions</h1>
            <Filter filters={filters} setFilters={setFilters} />
            {filteredTransactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
        </div>
    )
}