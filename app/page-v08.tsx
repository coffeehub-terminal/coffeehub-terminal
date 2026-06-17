"use client";

import { useState } from "react";

type Lot = {
  id: number;
  companyName: string;
  lotReference: string;
  lotNumber: string;
  origin: string;
  processMethod: string;
  score: string;
  fobBuenaventura: string;
  harvestYear: string;
  requiredBags: string;

  altitude: string;
  varieties: string;
  species: string;

  flavor: string;
  acidity: string;

  producerType: string;
  millType: string;
  manager: string;

  certifications: string;
};

export default function Home() {
  const [lots] = useState<Lot[]>([
    {
      id: 1,
      companyName: "Cafe Exportadora SAS",
      lotReference: "REF-001",
      lotNumber: "LOT-001",
      origin: "Huila",
      processMethod: "Washed",
      score: "86",
      fobBuenaventura: "4.25",
      harvestYear: "2024/2025",
      requiredBags: "40",
      altitude: "1850",
      varieties: "Castillo, Caturra",
      species: "Arabica",
      flavor: "Chocolate, Caramel",
      acidity: "Medium High",
      producerType: "Cooperative",
      millType: "Dry Mill",
      manager: "Juan Perez",
      certifications: "Organic",
    }
  ]);

  const [selectedLot, setSelectedLot] = useState<Lot | null>(lots[0]);
  const [activeScreen, setActiveScreen] = useState("inventory");

  return (
    <main className="min-h-screen bg-[#071412] text-white">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-[#05100e] p-6">
          <h1 className="text-3xl font-bold text-green-400 mb-8">CoffeeHub</h1>

          <button onClick={() => setActiveScreen("inventory")} className="block mb-3">
            ☕ Inventory
          </button>
          <button onClick={() => setActiveScreen("offers")} className="block mb-3">
            📦 Offers
          </button>
          <button onClick={() => setActiveScreen("deals")} className="block mb-3">
            🤝 Deals
          </button>
        </aside>

        <section className="flex-1 p-8">
          {activeScreen === "inventory" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#10231e] rounded-xl p-6">
                {lots.map((lot) => (
                  <div key={lot.id} onClick={() => setSelectedLot(lot)} className="cursor-pointer py-3">
                    {lot.lotNumber} | {lot.origin}
                  </div>
                ))}
              </div>

              <div className="bg-[#10231e] rounded-xl p-6">
                {selectedLot && (
                  <div className="space-y-2">
                    <div><strong>Company:</strong> {selectedLot.companyName}</div>
                    <div><strong>Altitude:</strong> {selectedLot.altitude}</div>
                    <div><strong>Varieties:</strong> {selectedLot.varieties}</div>
                    <div><strong>Species:</strong> {selectedLot.species}</div>
                    <div><strong>Flavor:</strong> {selectedLot.flavor}</div>
                    <div><strong>Acidity:</strong> {selectedLot.acidity}</div>
                    <div><strong>Producer Type:</strong> {selectedLot.producerType}</div>
                    <div><strong>Mill Type:</strong> {selectedLot.millType}</div>
                    <div><strong>Manager:</strong> {selectedLot.manager}</div>
                    <div><strong>Certifications:</strong> {selectedLot.certifications}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

