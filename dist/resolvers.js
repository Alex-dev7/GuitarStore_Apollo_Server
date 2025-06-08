// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
    Query: {
        getProducts: async (parent, args, context) => {
            return context.prisma.product.findMany();
        },
        getProductByID: (parent, args, context) => {
            const id = args.id;
            // fetch product in DB by Id
            return context.prisma.product.findUnique({
                where: {
                    id: id,
                },
            });
        }
    },
    Mutation: {
        createProduct: async (parent, args, context) => {
            const { name, images, description, price, id, createdAt } = args;
            const newProduct = await context.prisma.product.create({
                data: {
                    id,
                    name,
                    images,
                    description,
                    price,
                    createdAt,
                }
            });
            return newProduct;
        }
    }
};
// module.exports = resolvers
// export const resolvers = {
//     Query
// }find(product => product.id === id)
