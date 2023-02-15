import { context } from "../prismaContext"

const { prisma } = context

export const typeDefs = `#graphql
  type Category {
    id: String!
    name: String!
    color: String
  }
  type Query {
    categories: [Category!]!
    category(id: String!): Category!
  }
  input CategoryContent {
    name: String!
    color: String
  }
  type Mutation {
    addCategory(categoryContent: CategoryContent!): Category!
  }
`

export const resolvers = {
  Query: {
    categories: () => {
      return prisma.category.findMany();
    },
    category: (_, { id }) => {
      return prisma.category.findUnique({
        where: { id },
      })
    },
  },
  Mutation: {
    addCategory: (_, { categoryContent }) => {
      return prisma.category.create({
        data: { ...categoryContent },
      })
    }
  }
}