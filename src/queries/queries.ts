import pb from "@/lib/pocketbase";
import { useMutation } from "react-query";

type LoginData = {
  email: string;
  password: string;
};

export const useLoginMutation = () =>
  useMutation(
    async (data: LoginData) => {
      const authData = await pb.collection('users').authWithPassword(
        data.email,
        data.password
      );
      return authData;
    }
  );
