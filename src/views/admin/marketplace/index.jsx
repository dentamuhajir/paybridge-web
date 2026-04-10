import { useEffect, useState } from "react";
import Banner from "./components/Banner";
import NFt2 from "assets/img/nfts/Nft2.png";
import NFt4 from "assets/img/nfts/Nft4.png";
import NFt3 from "assets/img/nfts/Nft3.png";
import NFt5 from "assets/img/nfts/Nft5.png";
import NFt6 from "assets/img/nfts/Nft6.png";
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";

import tableDataTopCreators from "views/admin/marketplace/variables/tableDataTopCreators.json";
import { tableColumnsTopCreators } from "views/admin/marketplace/variables/tableColumnsTopCreators";
import HistoryCard from "./components/HistoryCard";
import TopCreatorTable from "./components/TableTopCreators";
import NftCard from "components/card/NftCard";
import LoanApplicationModal from "components/modal/LoanApplicationModal";
import api from "lib/axios";

const Marketplace = () => {
  const [loanProducts, setLoanProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  const fetchLoanProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/loan-products");
      if (response.data.success && response.data.data) {
        setLoanProducts(response.data.data);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching loan products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };
  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        {/* NFt Banner */}
        <Banner />

        {/* NFt Header */}
        <div className="mb-4 mt-5 flex flex-col justify-between px-4 md:flex-row md:items-center">
          <h4 className="ml-1 text-2xl font-bold text-navy-700 dark:text-white">
            Trending NFTs
          </h4>
          <ul className="mt-4 flex items-center justify-between md:mt-0 md:justify-center md:!gap-5 2xl:!gap-12">
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                Art
              </a>
            </li>
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                Music
              </a>
            </li>
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                Collection
              </a>
            </li>
            <li>
              <a
                className="text-base font-medium text-brand-500 hover:text-brand-500 dark:text-white"
                href=" "
              >
                <a href=" ">Sports</a>
              </a>
            </li>
          </ul>
        </div>

        {/* Product Loan Cards */}
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-3">
          {loading ? (
            <div className="col-span-1 md:col-span-3 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading loan products...</p>
            </div>
          ) : error ? (
            <div className="col-span-1 md:col-span-3 py-8 text-center">
              <p className="text-red-500 dark:text-red-400">Error loading loan products: {error}</p>
            </div>
          ) : loanProducts.length > 0 ? (
            loanProducts.map((product) => {
              const lowestRate = product.tenors.length > 0 
                ? Math.min(...product.tenors.map(t => parseFloat(t.interestRate)))
                : 0;
              const highestTenor = product.tenors.length > 0
                ? Math.max(...product.tenors.map(t => t.tenorMonths))
                : 0;
              
              const imageOptions = [NFt2, NFt3, NFt4, NFt5, NFt6];
              const randomImage = imageOptions[Math.floor(Math.random() * imageOptions.length)];

              return (
                <NftCard
                  key={product.id}
                  bidders={[avatar1, avatar2, avatar3]}
                  title={product.name}
                  author={product.description}
                  price={`From ${lowestRate}% / month (${highestTenor} months)`}
                  image={randomImage}
                  onPlaceBid={() => handlePlaceBid(product)}
                />
              );
            })
          ) : (
            <div className="col-span-1 md:col-span-3 py-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No loan products available</p>
            </div>
          )}
        </div>


        {/* Recenlty Added setion */}
        {/* Section removed - using API-driven loan products instead */}
      </div>

      {/* right side section */}

      <div className="col-span-1 h-full w-full rounded-xl 2xl:col-span-1">
        <TopCreatorTable
          extra="mb-5"
          tableData={tableDataTopCreators}
          columnsData={tableColumnsTopCreators}
        />
        <HistoryCard />
      </div>
      <LoanApplicationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Marketplace;
