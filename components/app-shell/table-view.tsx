import { TransactionTable } from "@/components/transactions/table/transaction-table";
import type { Transaction } from "@/lib/types/transaction";

type TableViewProps = {
  transactions: Transaction[];
};

export const TableView = ({ transactions }: TableViewProps) => {
  return <TransactionTable transactions={transactions} />;
};
