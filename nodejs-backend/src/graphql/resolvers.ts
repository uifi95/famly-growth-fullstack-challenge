import { GraphQLLong } from "graphql-scalars";
import { ProfileRepository } from "../repository/ProfileRepository";

const profileRepository = new ProfileRepository();

export const resolvers = {
  Long: GraphQLLong,
  Query: {
    parentProfile: async (_: any, { parentId }: { parentId: number }) => {
      return await profileRepository.getParentProfile(parentId);
    },
    paymentMethods: async (_: any, { parentId }: { parentId: number }) => {
      return await profileRepository.listPaymentMethods(parentId);
    },
    invoices: async (_: any, { parentId }: { parentId: number }) => {
      return await profileRepository.listInvoices(parentId);
    },
  },
  Mutation: {
    addPaymentMethod: async (
      _: any,
      { parentId, method }: { parentId: number; method: string },
    ) => {
      return await profileRepository.addPaymentMethod(parentId, method);
    },
    setActivePaymentMethod: async (
      _: any,
      { parentId, methodId }: { parentId: number; methodId: number },
    ) => {
      return await profileRepository.setActivePaymentMethod(parentId, methodId);
    },
    deletePaymentMethod: async (
      _: any,
      { parentId, method }: { parentId: number; method: string },
    ) => {
      return await profileRepository.deletePaymentMethod(parentId, method);
    },
  },
};
