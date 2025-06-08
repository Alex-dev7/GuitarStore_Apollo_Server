import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
// data
const products = [
    {
        id: "1",
        name: "Fender",
        description: "This is a very cool vintage guitar",
        images: [],
        price: 1200.00,
    },
    {
        id: "2",
        name: "Gibson",
        description: "This is a very cool vintage guitar",
        images: [],
        price: 1000.00,
    },
    {
        id: "3",
        name: "Ibanez",
        description: "This is a very cool vintage guitar",
        images: [],
        price: 200.00,
    },
    {
        id: "4",
        name: "Tylor",
        description: "This is a very cool vintage guitar",
        images: [],
        price: 500.99,
    },
];
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
    # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getProducts: [Product!]!
    getProductByID(id: ID!): Product
  }

  # This "Book" type defines the queryable fields for every book in our data source.
  type Product {
    id: ID!
    name: String!
    images: [String],
    description: String!
    price: Float!
    createdAt: String!
  }

  type Mutation {
    createProduct(
        name: String!,
        images: [String],
        description: String!,
        price: Float!,
    ): Product
  }

`;
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        getProducts: () => {
            return products;
            // OR make call to database to get table/documents
        },
        getProductByID: (parent, args) => {
            const id = args.id;
            // fetch product in DB by Id
            return products.find(product => product.id === id);
        }
    },
    Mutation: {
        createProduct: (parent, args) => {
            const { name, images, description, price } = args;
            const newProduct = {
                id: (products.length + 1).toString(),
                name,
                images,
                description,
                price,
            };
            products.push(newProduct);
        }
    }
};
// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
// Passing an ApolloServer instance to the `startStandaloneServer` function:
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
