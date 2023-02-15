import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parse } from 'csv-parse'

const prisma = new PrismaClient()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

type Account = {
    id: string
    name: string
    bank: string
}

type Category = {
    id: string
    name: string
    color: string
}

type Transaction = {
    id: string
    accountId: string
    categoryId?: string | null
    reference?: string
    amount: number
    currency: string
    date: string
}

async function main() {

    const accountsFilePath = path.resolve(__dirname, `./data/accounts.csv`)
    const accountsFileContent = fs.readFileSync(accountsFilePath, { encoding: 'utf-8' })

    parse(accountsFileContent, {
        delimiter: ',',
        columns: ['id', 'name', 'bank'],
        relax_quotes: true,
    }, async (error, result: Account[]) => {
        if (error) {
            console.error(error)
            return
        }

        const [, ...data] = result

        await prisma.account.createMany({
            data
        })
    })

    const categoriesFilePath = path.resolve(__dirname, `./data/categories.csv`)
    const categoriesFileContent = fs.readFileSync(categoriesFilePath, { encoding: 'utf-8' })

    parse(categoriesFileContent, {
        delimiter: ',',
        columns: ['id', 'name', 'color'],
        relax_quotes: true,
    }, async (error, result: Category[]) => {
        if (error) {
            console.error(error)
            return
        }

        const [, ...data] = result.map((category) => ({
            ...category,
            color: category.color || null
        }))

        await prisma.category.createMany({
            data
        })
    })

    const transactionsFilePath = path.resolve(__dirname, `./data/transactions.csv`)
    const transactionsFileContent = fs.readFileSync(transactionsFilePath, { encoding: 'utf-8' })

    parse(transactionsFileContent, {
        delimiter: ',',
        columns: ['id', 'accountId', 'categoryId', 'reference', 'amount', 'currency', 'date'],
        relax_quotes: true,
    }, async (error, result: Transaction[]) => {
        if (error) {
            console.error(error)
            return
        }

        const [, ...data] = result.map((transaction) => ({
            ...transaction,
            categoryId: transaction.categoryId || null,
            reference: transaction.reference || null,
            date: new Date(transaction.date)
        }))

        await prisma.transaction.createMany({
            data: data//chunkData
        })
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })