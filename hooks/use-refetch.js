import { allTxnsQueryParamsAtom } from "@/app/browse/transactions/components/all-txns/data-table"
import { readyTxnsQueryParamsAtom } from "@/app/browse/transactions/components/ready-txns/data-table"
import { completedTxnsQueryParamsAtom } from "@/app/browse/transactions/components/completed-txns/data-table"
import { invoicesQueryParamsAtom } from "@/app/browse/invoices/page"
import { useAtom } from 'jotai';

export function useRefetch() {
  const [allTxnsQueryParams, setAllTxnsQueryParams] = useAtom(allTxnsQueryParamsAtom);
  const [readyTxnsQueryParams, setReadyTxnsQueryParams] = useAtom(readyTxnsQueryParamsAtom);
  const [completedTxnsQueryParams, setCompletedTxnsQueryParams] = useAtom(completedTxnsQueryParamsAtom);
  const [invoiceQueryParams, setInvoiceQueryParams] = useAtom(invoicesQueryParamsAtom)

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

