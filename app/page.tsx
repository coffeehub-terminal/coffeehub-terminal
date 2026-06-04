"use client";

import { useState } from "react";

type Lot = {
  id: number;
  lotNumber: string;
  origin: string;
  process: string;
  score: number;
  quantity: number;
};

type Offer = {
  id: string;
  lotNumber: string;
  origin: string;
  quantity: number;
  status: string;
};

type Deal = {
  id: string;
  offerId: string;
  lotNumber: string;
  quantity: number;
  status: string;
};

export default function Home() {
  const [activeScreen, setActiveScreen] = useState("inventory");

  const [lots] = useState<Lot[]>([
    {
      id: 1,
      lotNumber: "LOT-001",
      origin: "Colombia",
      process: "Washed",
      score: 86,
      quantity: 500,
    },
    {
      id: 2,
      lotNumber: "LOT-002",
      origin: "Ethiopia",
      process: "Natural",
      score: 87,
      quantity: 1200,
    },
    {
      id: 3,
      lotNumber: "LOT-003",
      origin: "Kenya",
      process: "Washed",
      score: 88,
      quantity: 800,
    },
    {
      id: 4,
      lotNumber: "LOT-004",
      origin: "Guatemala",
      process: "Honey",
      score: 85,
      quantity: 1500,
    },
  ]);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  const createOffer = (lot: Lot) => {
    const newOffer: Offer = {
      id: `OFF-${String(offers.length + 1).padStart(3, "0")}`,
      lotNumber: lot.lotNumber,
      origin: lot.origin,
      quantity: lot.quantity,
      status: "Open",
    };

    setOffers([...offers, newOffer]);
    setActiveScreen("offers");
  };

  const createDeal = (offer: Offer) => {
    const newDeal: Deal = {
      id: `DEAL-${String(deals.length + 1).padStart(3, "0")}`,
      offerId: offer.id,
      lotNumber: offer.lotNumber,
      quantity: offer.quantity,
      status: "Confirmed",
    };

    setDeals([...deals, newDeal]);

    setOffers(
      offers.filter((existingOffer) => existingOffer.id !== offer.id)
    );

    setActiveScreen("deals");
  };

  return (
    <main className="min-h-screen bg-[#071412] text-white">
      <div className="flex">

        {/* Sidebar */}

        <aside className="w-64 bg-[#05100e] min-h-screen p-6 border-r border-gray-800">

          <h1 className="text-3xl font-bold text-green-400 mb-10">
            CoffeeHub
          </h1>

          <nav className="space-y-3">

            <button
              onClick={() => setActiveScreen("inventory")}
              className={`w-full text-left px-4 py-3 rounded-lg ${
                activeScreen === "inventory"
                  ? "bg-green-500 text-black font-bold"
                  : "hover:bg-[#10231e]"
              }`}
            >
              ☕ Inventory
            </button>

            <button
              onClick={() => setActiveScreen("offers")}
              className={`w-full text-left px-4 py-3 rounded-lg ${
                activeScreen === "offers"
                  ? "bg-green-500 text-black font-bold"
                  : "hover:bg-[#10231e]"
              }`}
            >
              📦 Offers
            </button>

            <button
              onClick={() => setActiveScreen("deals")}
              className={`w-full text-left px-4 py-3 rounded-lg ${
                activeScreen === "deals"
                  ? "bg-green-500 text-black font-bold"
                  : "hover:bg-[#10231e]"
              }`}
            >
              🤝 Deals
            </button>

            <div className="border-t border-gray-800 pt-6 mt-6 space-y-3 text-gray-500">

              <div>🏢 CRM</div>
              <div>🧪 Samples</div>
              <div>📄 Purchase Orders</div>
              <div>📜 Contracts</div>
              <div>🚚 Logistics</div>
              <div>📊 Analytics</div>

            </div>

          </nav>

        </aside>

        {/* Main Content */}

        <section className="flex-1 p-8">

          <h2 className="text-5xl font-bold text-green-400 mb-8">
            CoffeeHub Terminal
          </h2>

          {activeScreen === "inventory" && (
            <>
              <div className="grid grid-cols-4 gap-4 mb-8">

                <div className="bg-[#10231e] p-6 rounded-xl">
                  <p className="text-gray-400">Inventory Value</p>
                  <h3 className="text-3xl font-bold mt-2">€483K</h3>
                </div>

                <div className="bg-[#10231e] p-6 rounded-xl">
                  <p className="text-gray-400">Lots</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {lots.length}
                  </h3>
                </div>

                <div className="bg-[#10231e] p-6 rounded-xl">
                  <p className="text-gray-400">Offers</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {offers.length}
                  </h3>
                </div>

                <div className="bg-[#10231e] p-6 rounded-xl">
                  <p className="text-gray-400">Deals</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {deals.length}
                  </h3>
                </div>

              </div>

              <div className="bg-[#10231e] rounded-xl p-6">

                <h3 className="text-2xl font-bold mb-6">
                  Inventory Engine
                </h3>

                <table className="w-full">

                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="pb-3">Lot</th>
                      <th className="pb-3">Origin</th>
                      <th className="pb-3">Process</th>
                      <th className="pb-3">Score</th>
                      <th className="pb-3">Quantity</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {lots.map((lot) => (
                      <tr
                        key={lot.id}
                        className="border-b border-gray-800"
                      >
                        <td className="py-4">{lot.lotNumber}</td>
                        <td>{lot.origin}</td>
                        <td>{lot.process}</td>
                        <td>{lot.score}</td>
                        <td>{lot.quantity}kg</td>

                        <td>
                          <button
                            onClick={() => createOffer(lot)}
                            className="bg-green-500 text-black px-3 py-1 rounded font-semibold"
                          >
                            Create Offer
                          </button>
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </>
          )}

          {activeScreen === "offers" && (
            <div className="bg-[#10231e] rounded-xl p-6">

              <h3 className="text-3xl font-bold mb-6">
                Offer Engine
              </h3>

              {offers.length === 0 ? (
                <p className="text-gray-400">
                  No offers yet.
                </p>
              ) : (
                <table className="w-full">

                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="pb-3">Offer ID</th>
                      <th className="pb-3">Lot</th>
                      <th className="pb-3">Origin</th>
                      <th className="pb-3">Quantity</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {offers.map((offer) => (
                      <tr
                        key={offer.id}
                        className="border-b border-gray-800"
                      >
                        <td className="py-4">{offer.id}</td>
                        <td>{offer.lotNumber}</td>
                        <td>{offer.origin}</td>
                        <td>{offer.quantity}kg</td>
                        <td>{offer.status}</td>

                        <td>
                          <button
                            onClick={() => createDeal(offer)}
                            className="bg-green-500 text-black px-3 py-1 rounded font-semibold"
                          >
                            Convert To Deal
                          </button>
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>
              )}

            </div>
          )}

          {activeScreen === "deals" && (
            <div className="bg-[#10231e] rounded-xl p-6">

              <h3 className="text-3xl font-bold mb-6">
                Deal Engine
              </h3>

              {deals.length === 0 ? (
                <p className="text-gray-400">
                  No deals yet.
                </p>
              ) : (
                <table className="w-full">

                  <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-700">
                      <th className="pb-3">Deal ID</th>
                      <th className="pb-3">Offer</th>
                      <th className="pb-3">Lot</th>
                      <th className="pb-3">Quantity</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {deals.map((deal) => (
                      <tr
                        key={deal.id}
                        className="border-b border-gray-800"
                      >
                        <td className="py-4">{deal.id}</td>
                        <td>{deal.offerId}</td>
                        <td>{deal.lotNumber}</td>
                        <td>{deal.quantity}kg</td>
                        <td>{deal.status}</td>
                      </tr>
                    ))}

                  </tbody>

                </table>
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}
