import { Decimal128, ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { GetServerSideProps } from "next";

interface Account {
  id: string;
  title: string;
}

interface Transaction {
  id: string;
  account: string;
  amount: number;
  category: string;
  incomes: boolean;
  date: Date;
}

interface User {
  _id: string;
  name: string;
  accounts: Account[];
  transactions: Transaction[];
}

interface UsersProps {
  user: User;
}

const UserPage: React.FC<UsersProps> = ({ user }) => {
  const userId = "670672dd35ec83ed0cecbb66";
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("User Has been deleted saccessfully!");
      } else {
        alert("You don't have right. Oh, you don't have right to...");
      }
    } catch (error) {
      alert("Error deleting user!");
    }
  };
  return (
    <div>
      <div className="flex gap-[20px] items-center">
        <h2>{user.name}</h2>
        <button
          onClick={handleDelete}
          className="rounded-[10px] border-[1px] border-black h-[40px] w-[120px]">
          Delete User
        </button>
      </div>
      <h3>{user._id}</h3>
      <h3>Accounts</h3>
      <ul>
        {user.accounts.map((account) => (
          <li key={account.id}>{account.title}</li>
        ))}
      </ul>

      <h3>Transactions</h3>
      <ul>
        {user.transactions.map((transaction) => (
          <li key={transaction.id}>
            Amount: {transaction.incomes ? "+" : "-"}
            {transaction.amount}, Date:{" "}
            {new Date(transaction.date).toLocaleDateString()}, Category:{" "}
            {transaction.category}, Account: {transaction.account}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPage;

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const client = await clientPromise;
    const db = client.db("ExpTrack");

    const user = await db
      .collection("Users")
      .findOne({ _id: new ObjectId("670672dd35ec83ed0cecbb66") });

    const categories = await db.collection("Categories").find({}).toArray();

    if (!user) {
      return {
        props: { user: null },
      };
    }

    user.transactions = user.transactions.map((transaction: any) => {
      if (transaction.amount && transaction.amount instanceof Decimal128) {
        transaction.amount = transaction.amount.toString();
      }

      const category = categories.find(
        (category: any) =>
          category._id.toString() === transaction.categoryId.toString()
      );

      transaction.category = category ? category.title : "Unknown Category";

      const account = user.accounts.find(
        (account: any) =>
          account.id.toString() === transaction.accountId.toString()
      );

      transaction.account = account ? account.title : "Unknown Account";

      return transaction;
    });

    return {
      props: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (e) {
    console.error(e);
    return { props: { user: null } };
  }
};
