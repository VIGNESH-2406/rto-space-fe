import { allTxnsPageAtom } from "@/app/browse/transactions/components/all-txns/data-table"
import { readyTxnsPageAtom } from "@/app/browse/transactions/components/ready-txns/data-table"
import { completedTxnsPageAtom } from "@/app/browse/transactions/components/completed-txns/data-table"
import { invoicesPageAtom } from "@/app/browse/invoices/page"
import { useAtom } from 'jotai';

export function useRefetch() {
  const [allTxnsQueryParams, setAllTxnsQueryParams] = useAtom(allTxnsPageAtom);
  const [readyTxnsQueryParams, setReadyTxnsQueryParams] = useAtom(readyTxnsPageAtom);
  const [completedTxnsQueryParams, setCompletedTxnsQueryParams] = useAtom(completedTxnsPageAtom);
  const [invoiceQueryParams, setInvoiceQueryParams] = useAtom(invoicesPageAtom)

  const refetch = (tableName) => {
    switch (tableName) {
      case 'All':
        setAllTxnsQueryParams({ ...allTxnsQueryParams });
        break;
      case 'Ready':
        setReadyTxnsQueryParams({ ...readyTxnsQueryParams });
        break;
      case 'Completed':
        setCompletedTxnsQueryParams({ ...completedTxnsQueryParams });
        break;
      case 'Invoice':
        setInvoiceQueryParams({ ...invoiceQueryParams })
        break;
    }
  };

  return refetch;
}

