import { useState, useEffect } from "react";
import Card from "components/card";
import api from "lib/axios";
import { getLoanApplicationByUserId } from "services/loanService";

const ManageLoan = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await getLoanApplicationByUserId();
      console.log("API Response:", response.data);

    if (response && response.success) {
      setLoans(response.data || []); 
    } else {
      setLoans([]);
    }
    } catch (err) {
      setError(err.message || "Failed to fetch loans");
      console.error("Error fetching loans:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "disbursed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mt-3 grid h-full w-full gap-3 lg:!grid-cols-12">
      <div className="col-span-12 h-fit w-full lg:!col-span-12">
        <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-gray-900 dark:text-white dark:bg-navy-700 shadow-xl dark:shadow-xl">
          <div className="mb-8 px-9 pt-5">
            <h2 className="text-lg font-bold text-navy-700 dark:text-white">
              Manage Loans
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">Loading loans...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : loans.length === 0 ? (
            <div className="flex justify-center py-8">
              <p className="text-gray-500">No loans found</p>
            </div>
          ) : (
            <div className="overflow-x-auto px-9">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-600">
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 dark:text-gray-200">
                      Loan ID
                    </th>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 dark:text-gray-200">
                      Amount
                    </th>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 dark:text-gray-200">
                      Type
                    </th>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 dark:text-gray-200">
                      Status
                    </th>
                    <th className="py-3 pr-4 text-left font-bold text-gray-700 dark:text-gray-200">
                      Applied Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-navy-600"
                    >
                      <td className="py-4 pr-4 text-sm text-gray-700 dark:text-gray-200">
                        {loan.id || loan.loanId || "N/A"}
                      </td>
                      <td className="py-4 pr-4 text-sm font-medium text-gray-900 dark:text-white">
                        Rp {(loan.requestedAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-4 pr-4 text-sm text-gray-700 dark:text-gray-200">
                        {loan.productName || "N/A"}
                      </td>
                      <td className="py-4 pr-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(
                            loan.status
                          )}`}
                        >
                          {loan.status || "Pending"}
                        </span>
                      </td>
                      <td className="py-4 pr-4 text-sm text-gray-700 dark:text-gray-200">
                        {loan.appliedDate
                          ? new Date(loan.appliedDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManageLoan;
