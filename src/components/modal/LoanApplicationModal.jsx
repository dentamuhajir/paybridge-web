import React, { useState, useEffect } from "react";
import InputField from "components/fields/InputField";
import { applyLoanApplication } from "services/transactionService";

const LoanApplicationModal = ({ isOpen, onClose, product }) => {
  const [formData, setFormData] = useState({
    productId: "",
    loanProductId: "",
    loanTenorId: "",
    interestRate: "",
    adminFee: "",
    requestedAmount: "",
  });
  const [selectedTenor, setSelectedTenor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        productId: product.id,
        loanProductId: product.id, // assuming same
        loanTenorId: "",
        interestRate: "",
        adminFee: product.adminFee || "", // set from product
        requestedAmount: "",
      });
      setSelectedTenor(null);
    }
  }, [product]);

  const handleTenorChange = (e) => {
    const tenorId = e.target.value;
    const tenor = product.tenors.find(t => t.id == tenorId);
    if (tenor) {
      setSelectedTenor(tenor);
      setFormData(prev => ({
        ...prev,
        loanTenorId: tenor.id,
        interestRate: tenor.interestRate,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await applyLoanApplication(formData);
      alert("Loan application submitted successfully!");
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-navy-800">
        <h2 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
          Apply for Loan: {product.name}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-navy-700 dark:text-white">
              Loan Tenor
            </label>
            <select
              name="loanTenorId"
              value={formData.loanTenorId}
              onChange={handleTenorChange}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white"
              required
            >
              <option value="">Select Tenor</option>
              {product.tenors.map(tenor => (
                <option key={tenor.id} value={tenor.id}>
                  {tenor.tenorMonths} months
                </option>
              ))}
            </select>
          </div>
          <InputField
            label="Interest Rate (%)"
            id="interestRate"
            name="interestRate"
            type="number"
            value={formData.interestRate}
            readOnly
            extra="mb-4"
          />
          <InputField
            label="Admin Fee"
            id="adminFee"
            name="adminFee"
            type="number"
            value={formData.adminFee}
            readOnly
            extra="mb-4"
          />
          <InputField
            label="Requested Amount"
            id="requestedAmount"
            name="requestedAmount"
            type="number"
            value={formData.requestedAmount}
            onChange={handleInputChange}
            extra="mb-4"
            required
          />
          {error && (
            <p className="mb-4 text-red-500">{error}</p>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-900 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanApplicationModal;