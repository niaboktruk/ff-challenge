import { typeDefs as Account, resolvers as AccountResolvers } from "./account"

import {
  typeDefs as Category,
  resolvers as CategoryResolvers,
} from "./category"

import {
  typeDefs as Transaction,
  resolvers as TransactionResolvers,
} from "./transaction"

export const typeDefs = [Account, Category, Transaction]

export const resolvers = [
  AccountResolvers, CategoryResolvers, TransactionResolvers
]