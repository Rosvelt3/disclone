import { account, databases } from "@/lib/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ID } from "appwrite";
import { useForm } from "react-hook-form";
import { z } from "zod";

const addServerSchema = z.object({
  serverName: z
    .string()
    .trim()
    .min(5, "Server name must be at least 5 characters long")
    .regex(/^[A-Za-z\s]*$/, "Server name must only contain letters and spaces"),
});

type AddServerData = z.infer<typeof addServerSchema>;
type ServerData = {
  name: string;
  users: string[];
  owner: string;
};

export default function AddServerModal({
  show,
  toggle,
}: {
  show: boolean;
  toggle: () => void;
  onConfirm: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddServerData>({
    resolver: zodResolver(addServerSchema),
  });

  const queryClient = useQueryClient();

  const useAddServerMutation = () =>
    useMutation({
      mutationFn: async (serverData: ServerData) => {
        const server = await databases.createDocument(
          process.env.NEXT_PUBLIC_DISCLONE_DATABASE as string,
          process.env.NEXT_PUBLIC_SERVERS_COLLECTION as string,
          ID.unique(),
          serverData
        );
        return server;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["listUserServers"],
        });
      },
    });

  const addServerMutation = useAddServerMutation();

  const onSubmit = async (data: AddServerData) => {
    const currentUser = await account.get();

    const serverData = {
      name: data.serverName,
      users: [currentUser?.$id],
      owner: currentUser?.$id,
    };

    toggle();

    addServerMutation.mutate(serverData);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-700 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block transform overflow-hidden rounded-lg bg-slate-800 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg font-medium leading-6 text-white"
                  id="modal-headline"
                >
                  Create Server
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Create a new server to chat with your friends!
                  </p>
                </div>
              </div>
            </div>
          </div>
          <form className="px-10" onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="serverName" className="text-slate-200">
              Server Name
            </label>
            <input
              type="text"
              className="form-input mb-3 mt-3 w-full rounded-md"
              {...register("serverName")}
            />
            {errors.serverName && (
              <p className="text-sm italic text-red-500">
                {errors.serverName.message}
              </p>
            )}
            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-sky-400 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Create
              </button>
              <button
                type="button"
                onClick={toggle}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
