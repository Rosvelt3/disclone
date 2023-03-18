import { Account, Client, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://be.isaiasdev.com/v1")
  .setProject("640fb1566bf66af19142");

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);

export { client, databases, account, storage };
