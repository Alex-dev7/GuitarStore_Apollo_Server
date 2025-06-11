import bcrypt from "bcrypt";
// import jwt from 'jsonwebtoken';
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
export const resolvers = {
    Query: {
      getProducts: async (parent, args, context) => {
        return context.prisma.product.findMany()
      },
      getProductByID: (parent, args, context) => {
        const id = args.id
        // fetch product in DB by Id
        return context.prisma.product.findUnique({
          where: {
            id: id,
          },
        })
      }
    },
    Mutation: {
      // Product Mutations
        createProduct: async (_, args, context) => {
            const {name, images, description, price, color, condition, categoryId} = args
            const newProduct = await context.prisma.product.create({
                data: {
                  name,
                  images,
                  description,
                  price,
                  color,
                  condition,
                  category: {
                    connect: {id: categoryId},
                  },
                },
                include: {
                  category: true,
                },
            })
            return newProduct
        },
        updateProduct: async (_, args, context) => {
            const {id, ...data} = args
            const updateRecordByID = await context.prisma.product.update({
              where: {
                id: id,
              },
              data,
            })
            return updateRecordByID
        },
        deleteProduct: async (_, args, context) => {
          const { id } = args;
          const deletedProduct = await context.prisma.product.delete({
              where: { id: id },
          });
          return deletedProduct
        },


        // User Mutations
        createUser: async (_, args, context) => {
          const {email, password, name} = args
          const hashedPassword = await bcrypt.hash(password, 10)
          const user = await context.prisma.user.create({
            data: {
              email,
              password: hashedPassword,
              name,
            },
          })
          return user
        },
        // login: async (_, args, context) => {
        //   const {email, password} = args
        //   const user = await context.prisma.user.findUnique({
        //     where: {email},
        //   })
        //   if (!user) throw new Error('Invalid email or password')

        //   const valid = await bcrypt.compare(password, user.password)
        //   if (!valid) throw new Error('Invalid email or password')

        //   const token = jwt.sign({
        //     userId: user.id
        //   },
        //   process.env.JWT_SECRET, {
        //     expiresIn: '7d',
        //   })

        //   return{
        //     token,
        //     user
        //   }
        // },

        
        
        // CartItem Mutations
        addToCart: async (_, { userId, productId, quantity }, context) => {
          return context.prisma.cartItem.create({
            data: {
              user: { connect: { id: userId } },
              product: { connect: { id: productId } },
              quantity,
            },
            include: {
              user: true,
              product: true,
            },
          });
        },

        removeFromCart: async (_, { cartItemId }, context) => {
          return context.prisma.cartItem.delete({
            where: { id: cartItemId },
            include: {
              user: true,
              product: true,
            },
          });
        },

        clearCart: async (_, { userId }, context) => {
          await context.prisma.cartItem.deleteMany({
            where: { userId },
          });
          return true;
        },

  }}