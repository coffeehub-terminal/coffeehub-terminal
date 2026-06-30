"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
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
  certifications: string;

  variety: string;
  altitude: string;
  farm: string;
  producer: string;
  cupNotes: string;

  photoFile?: File | null;
  photoUrl?: string;
};

type Offer = {
  id: string;
  lotNumber: string;
  companyName: string;
  origin: string;
  status: string;
};

type Deal = {
  id: string;
  offerId: string;
  lotNumber: string;
  status: string;
};

type Room = {
  id: string;
  name: string;
  offerIds: string[];
  status: string;
  shareToken?: string;
};

export default function Home() {
  const [activeScreen, setActiveScreen] = useState("inventory");
  const [lots, setLots] = useState<Lot[]>([]);

useEffect(() => {
  loadLots();
  loadOffers();
  loadDeals();
  loadRooms();
}, []);







  const loadLots = async () => {
    const { data, error } = await supabase
      .from("Lots")
      .select("*");

    console.log("LOTS:", data);
    console.log("LOTS ERROR:", error);

    if (data) {
      const formattedLots = data.map((lot: any) => ({
  id: lot.id,
  companyName: lot.Company || "",
  lotReference: lot.lot_reference || "",
  lotNumber: lot.lot_number || "",
  origin: lot.origin || "",
  processMethod: lot.process || "",

  score: String(lot.score || ""),
  fobBuenaventura: String(lot.fob || ""),
  harvestYear: String(lot.harvest_year || ""),
  requiredBags: String(lot.required_bags || ""),
  certifications: lot.certifications || "",

  variety: lot.variety || "",
  altitude: lot.altitude || "",
  farm: lot.farm || "",
  producer: lot.producer || "",
  cupNotes: lot.cup_notes || "",

  photoUrl: lot.photo_url || "",
  photoFile: null,
}));

setLots(formattedLots);
    }
  };
  
  const loadOffers = async () => {
    const { data, error } = await supabase
      .from("Offers")
      .select("*");

    console.log("OFFERS:", data);
    console.log("OFFERS ERROR:", error);

    if (data) {
      const formattedOffers = data.map((offer: any) => ({
        id: offer.id,
        lotNumber: offer.lot_number || "",
        companyName: offer.company_name || "",
        origin: offer.origin || "",
        status: offer.status || "",
      }));

      setOffers(formattedOffers);
    }
  };

  const loadDeals = async () => {
  const { data, error } = await supabase
    .from("Deals")
    .select("*");

  console.log("DEALS:", data);
  console.log("DEALS ERROR:", error);

  if (data) {
    const formattedDeals = data.map((deal: any) => ({
      id: deal.id,
      offerId: deal.offer_id || "",
      lotNumber: deal.lot_number || "",
      status: deal.status || "",
    }));

    setDeals(formattedDeals);
  }
};
const loadRooms = async () => {
  const { data, error } = await supabase
    .from("Rooms")
    .select("*");

  console.log("ROOMS:", data);
  console.log("ROOMS ERROR:", error);

  if (data) {
    const formattedRooms = data.map((room: any) => ({
  id: room.id,
  name: room.name || "",
  offerIds: room.offer_ids
    ? room.offer_ids.split(",")
    : [],
  status: room.status || "",
  shareToken: room.share_token || "",
}));

    setRooms(formattedRooms);
  }
};











const [offers, setOffers] = useState<Offer[]>([]);
const [deals, setDeals] = useState<Deal[]>([]);

const [rooms, setRooms] = useState<Room[]>([
  {
    id: "ROOM-001",
    name: "Starbucks Colombia Q4",
    offerIds: ["OFF-001"],
    status: "Draft",
  },
]);

const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
const [roomParticipants, setRoomParticipants] = useState<any[]>([]);
const [roomOffers, setRoomOffers] = useState<Offer[]>([]);
const [showRoomForm, setShowRoomForm] = useState(false);

const [newRoomName, setNewRoomName] = useState("");
const [selectedOfferIds, setSelectedOfferIds] = useState<string[]>([]);
const [participantEmail, setParticipantEmail] = useState("");

const [selectedLot, setSelectedLot] = useState<Lot | null>(null);

const [showLotForm, setShowLotForm] = useState(false);

  const [newLot, setNewLot] = useState<{
  companyName: string;
  lotReference: string;
  lotNumber: string;
  origin: string;
  processMethod: string;

  score: string;
  fobBuenaventura: string;
  harvestYear: string;
  requiredBags: string;
  certifications: string;

  variety: string;
  altitude: string;
  farm: string;
  producer: string;
  cupNotes: string;

  photoFile: File | null;
  photoUrl: string;
}>({
  companyName: "",
  lotReference: "",
  lotNumber: "",
  origin: "",
  processMethod: "",

  score: "",
  fobBuenaventura: "",
  harvestYear: "",
  requiredBags: "",
  certifications: "",

  variety: "",
  altitude: "",
  farm: "",
  producer: "",
  cupNotes: "",

  photoFile: null,
  photoUrl: "",
});

const testSupabase = async () => {
  const { data, error } = await supabase
    .from("Lots")
    .insert([
      {
        Company: "Test Company",
        lot_reference: "TEST-REF",
        lot_number: "TEST-LOT",
        origin: "Huila",
        process: "Washed",
        score: 86,
        fob: 4.25,
        harvest_year: 2025,
        required_bags: 40,
        certifications: "Organic",
      },
    ]);

  console.log("DATA:", data);
  console.log("ERROR:", error);
};


const addLot = async () => {

  if (
    !newLot.companyName ||
    !newLot.lotReference ||
    !newLot.lotNumber
  ) {
    return;
  }

  let photoUrl = "";

  if (newLot.photoFile) {
    const file = newLot.photoFile as File;
const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from("coffee-photos")
      .upload(fileName, newLot.photoFile);

    if (!error && data) {
      photoUrl =
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/coffee-photos/${fileName}`;
    }
  }

  const lot: Lot = {
    id: Date.now(),
    ...newLot,
    photoUrl,
  };

  const { data, error } = await supabase
  .from("Lots")
  .insert([
    {
      Company: newLot.companyName,
      lot_reference: newLot.lotReference,
      lot_number: newLot.lotNumber,
      origin: newLot.origin,

      process: newLot.processMethod,
      score: Number(newLot.score),
      fob: Number(newLot.fobBuenaventura),
      harvest_year: Number(newLot.harvestYear),
      required_bags: Number(newLot.requiredBags),
      certifications: newLot.certifications,



      photo_url: photoUrl,
    },
  ]);

console.log("LOT INSERT DATA:", data);
console.log("LOT INSERT ERROR:", error);

if (error) {
  alert(error.message);
  return;
}

  setLots([...lots, lot]);

  setNewLot({
    companyName: "",
    lotReference: "",
    lotNumber: "",
    origin: "",
    processMethod: "",
    score: "",
    fobBuenaventura: "",
    harvestYear: "",
    requiredBags: "",
    certifications: "",
    variety: "",
    altitude: "",
    farm: "",
    producer: "",
    cupNotes: "",
    photoFile: null,
    photoUrl: "",
  });

  setShowLotForm(false);

  loadLots();
};






















  const createOffer = async (lot: Lot) => {
  const offer: Offer = {
    id: `OFF-${Date.now()}`,
    lotNumber: lot.lotNumber,
    companyName: lot.companyName,
    origin: lot.origin,
    status: "Open",
  };

  const { error } = await supabase
    .from("Offers")
    .insert([
      {
        id: offer.id,
        lot_number: offer.lotNumber,
        company_name: offer.companyName,
          photos: lot.photoUrl || "",

        origin: offer.origin,
        status: offer.status,

        process: lot.processMethod,
        score: Number(lot.score),
        fob: Number(lot.fobBuenaventura),
        harvest_year: Number(lot.harvestYear),
        required_bags: Number(lot.requiredBags),
        certifications: lot.certifications,

        variety: lot.variety,
        altitude: lot.altitude,
        farm: lot.farm,
        producer: lot.producer,
        cup_notes: lot.cupNotes,
      },
    ]);

  if (error) {
    console.log("OFFER INSERT ERROR:", error);
    return;
  }

  loadOffers();
  setActiveScreen("offers");
};







const createDeal = async (offer: Offer) => {
    const deal: Deal = {
      id: `DEAL-${String(deals.length + 1).padStart(3, "0")}`,
      offerId: offer.id,
      lotNumber: offer.lotNumber,
      status: "Confirmed",
    };

const { error } = await supabase
  .from("Deals")
  .insert([
    {
      id: deal.id,
      offer_id: offer.id,
      lot_number: offer.lotNumber,
      status: deal.status,
    },
  ]);

if (error) {
  console.log("DEAL INSERT ERROR:", error);
  return;
}



    setOffers(
      offers.filter((existing) => existing.id !== offer.id)
    );

    setActiveScreen("deals");
  };
  const saveRoom = async () => {
  if (!newRoomName) return;

  const room: Room = {
    id: `ROOM-${String(rooms.length + 1).padStart(3, "0")}`,
    name: newRoomName,
offerIds: selectedOfferIds,    
    status: "Draft",
  };

  const shareToken = crypto.randomUUID();

const { error } = await supabase
  .from("Rooms")
  .insert([
    {
      id: room.id,
      name: room.name,
      offer_ids: room.offerIds.join(","),
      status: room.status,
      share_token: shareToken,
    },
  ]);

if (error) {
  console.log("ROOM INSERT ERROR:", error);
  return;
}

await loadRooms();

if (participantEmail) {
  await supabase
    .from("RoomParticipants")
    .insert([
      {
        room_id: room.id,
        email: participantEmail,
        role: "guest",
        status: "invited",
      },
    ]);

  await fetch("/api/send-room-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: participantEmail,
      roomName: room.name,
      shareToken,
    }),
  });
}

 
  setNewRoomName("");
  setShowRoomForm(false);
};

  return (
    <main className="min-h-screen bg-[#071412] text-white">
      <div className="flex">

        <aside className="w-64 min-h-screen bg-[#05100e] border-r border-gray-800 p-6">

          <h1 className="text-3xl font-bold text-green-400 mb-10">
            CoffeeHub
          </h1>

          <nav className="space-y-3">

            <button
              onClick={() => setActiveScreen("inventory")}
              className="block w-full text-left px-4 py-3 rounded hover:bg-[#10231e]"
            >
              ☕ Inventory
            </button>

            <button
  onClick={() => setActiveScreen("offers")}
  className="block w-full text-left px-4 py-3 rounded hover:bg-[#10231e]"
>
  📦 Offers
</button>

<button
  onClick={() => setActiveScreen("rooms")}
  className="block w-full text-left px-4 py-3 rounded hover:bg-[#10231e]"
>
  🚪 Rooms
</button>

<button
  onClick={() => setActiveScreen("deals")}
  className="block w-full text-left px-4 py-3 rounded hover:bg-[#10231e]"
>
  🤝 Deals
</button>

            <div className="border-t border-gray-800 mt-6 pt-6 text-gray-500 space-y-2">
              <div>🏢 CRM</div>
              <div>🧪 Samples</div>
              <div>📄 Purchase Orders</div>
              <div>📜 Contracts</div>
              <div>🚚 Logistics</div>
              <div>📊 Analytics</div>
            </div>

          </nav>

        </aside>

        <section className="flex-1 p-8">

          <h2 className="text-5xl font-bold text-green-400 mb-8">
            CoffeeHub Terminal
          </h2>

          {activeScreen === "inventory" && (
            <div className="bg-[#10231e] rounded-xl p-6">

              <div className="flex justify-between items-center mb-6">

                <h3 className="text-2xl font-bold">
                  Inventory Engine
                </h3>

                <button
                  onClick={() => setShowLotForm(!showLotForm)}
                  className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold"
                >
                  + New Lot
                </button>
<button
  onClick={testSupabase}
  className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2"
>
  Test DB
</button>
              </div>

              {showLotForm && (
                <div className="grid grid-cols-2 gap-4 mb-8">

                  <input
                    placeholder="Company Name"
                    value={newLot.companyName}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        companyName: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="Lot Reference"
                    value={newLot.lotReference}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        lotReference: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="Lot Number"
                    value={newLot.lotNumber}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        lotNumber: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="Origin"
                    value={newLot.origin}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        origin: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="Process Method"
                    value={newLot.processMethod}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        processMethod: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="Score"
                    value={newLot.score}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        score: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="FOB Buenaventura"
                    value={newLot.fobBuenaventura}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        fobBuenaventura: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />
                  <input
  placeholder="Variety"
  value={newLot.variety || ""}
  onChange={(e) =>
    setNewLot({
      ...newLot,
      variety: e.target.value,
    })
  }
  className="bg-black p-2 rounded"
/>

<input
  placeholder="Altitude"
  value={newLot.altitude || ""}
  onChange={(e) =>
    setNewLot({
      ...newLot,
      altitude: e.target.value,
    })
  }
  className="bg-black p-2 rounded"
/>

<input
  placeholder="Farm"
  value={newLot.farm || ""}
  onChange={(e) =>
    setNewLot({
      ...newLot,
      farm: e.target.value,
    })
  }
  className="bg-black p-2 rounded"
/>

<input
  placeholder="Producer"
  value={newLot.producer || ""}
  onChange={(e) =>
    setNewLot({
      ...newLot,
      producer: e.target.value,
    })
  }
  className="bg-black p-2 rounded"
/>

<textarea
  placeholder="Cup Notes"
  value={newLot.cupNotes || ""}
  onChange={(e) =>
    setNewLot({
      ...newLot,
      cupNotes: e.target.value,
    })
  }
  className="bg-black p-2 rounded min-h-[100px]"
/>

                  <input
                    placeholder="Harvest Year"
                    value={newLot.harvestYear}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        harvestYear: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="Required Bags"
                    value={newLot.requiredBags}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        requiredBags: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    placeholder="Certifications"
                    value={newLot.certifications}
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        certifications: e.target.value,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewLot({
                        ...newLot,
                        photoFile: e.target.files?.[0] || null,
                      })
                    }
                    className="bg-black p-2 rounded"
                  />

                  <button
                    onClick={addLot}
                    className="bg-green-500 text-black font-bold rounded p-2"
                  >
                    Save Lot
                  </button>

                </div>
              )}

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <table className="w-full">

                    <thead>
                      <tr className="border-b border-gray-700 text-left">
                        <th className="pb-3">Lot</th>
                        <th className="pb-3">Company</th>
                        <th className="pb-3">Origin</th>
                        <th className="pb-3">Score</th>
                      </tr>
                    </thead>

                    <tbody>

                      {lots.map((lot) => (
                        <tr
                          key={lot.id}
                          onClick={() => setSelectedLot(lot)}
                          className={`border-b border-gray-800 cursor-pointer hover:bg-[#17332d] ${
                            selectedLot?.id === lot.id
                              ? "bg-[#17332d]"
                              : ""
                          }`}
                        >
                          <td className="py-4">{lot.lotNumber}</td>
                          <td>{lot.companyName}</td>
                          <td>{lot.origin}</td>
                          <td>{lot.score}</td>
                          <td
  onClick={async (e) => {
  e.stopPropagation();

  const confirmed = window.confirm(
    `Delete ${lot.lotNumber} and all related records?`
  );

  if (!confirmed) return;

  try {
    const { data: offers } = await supabase
      .from("Offers")
      .select("id")
      .eq("lot_number", lot.lotNumber);

    const offerIds =
      offers?.map((o) => o.id) || [];

    if (offerIds.length > 0) {

      await supabase
        .from("Deals")
        .delete()
        .in("offer_id", offerIds);

      const { data: rooms } = await supabase
        .from("Rooms")
        .select("*");

      if (rooms) {
        for (const room of rooms) {

          const current: string[] =
  room.offer_ids
    ? room.offer_ids.split(",")
    : [];

const cleaned = current.filter(
  (id: string) => !offerIds.includes(id)
);

          await supabase
            .from("Rooms")
            .update({
              offer_ids: cleaned.join(","),
            })
            .eq("id", room.id);
        }
      }

      await supabase
        .from("Offers")
        .delete()
        .in("id", offerIds);
    }

    const { error } = await supabase
      .from("Lots")
      .delete()
      .eq("id", lot.id);

    if (error) throw error;

    await loadLots();

  } catch (err: any) {
    alert(err.message);
  }
}}
  className="text-red-500 hover:text-red-300 text-center"
>
  🗑️
</td>
                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>

                <div className="bg-[#071412] rounded-xl p-6">

                  <h3 className="text-2xl font-bold mb-6">
                    Lot Details
                  </h3>

                  {selectedLot ? (
                    <div className="space-y-3">

                      <div>
                        <strong>Company:</strong>{" "}
                        {selectedLot.companyName}
                      </div>

                      <div>
                        <strong>Lot Reference:</strong>{" "}
                        {selectedLot.lotReference}
                      </div>

                      <div>
                        <strong>Lot Number:</strong>{" "}
                        {selectedLot.lotNumber}
                      </div>

                      <div>
                        <strong>Origin:</strong>{" "}
                        {selectedLot.origin}
                      </div>

                      <div>
                        <strong>Process:</strong>{" "}
                        {selectedLot.processMethod}
                      </div>

                      <div>
                        <strong>Score:</strong>{" "}
                        {selectedLot.score}
                      </div>

                      <div>
                        <strong>FOB:</strong>{" "}
                        {selectedLot.fobBuenaventura}
                      </div>

                      <div>
                        <strong>Harvest Year:</strong>{" "}
                        {selectedLot.harvestYear}
                      </div>

                      <div>
                        <strong>Required Bags:</strong>{" "}
                        {selectedLot.requiredBags}
                      </div>

                      <div>
                        <strong>Certifications:</strong>{" "}
                        {selectedLot.certifications}
                      </div>

                      <button
                        onClick={() => createOffer(selectedLot)}
                        className="mt-4 bg-green-500 text-black px-4 py-2 rounded font-bold"
                      >
                        Create Offer
                      </button>

                    </div>
                  ) : (
                    <div className="text-gray-400">
                      Select a lot from the inventory table.
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {activeScreen === "offers" && (
            <div className="bg-[#10231e] rounded-xl p-6">

              <h3 className="text-3xl font-bold mb-6">
                Offer Engine
              </h3>

              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="border-b border-gray-800 py-4 flex justify-between"
                >
                  <div>
                    {offer.id} | {offer.lotNumber} | {offer.origin}
                  </div>

                  <button
                    onClick={() => createDeal(offer)}
                    className="bg-green-500 text-black px-3 py-1 rounded"
                  >
                    Convert To Deal
                  </button>
                </div>
              ))}

            </div>
          )}
{activeScreen === "rooms" && (
  <div className="bg-[#10231e] rounded-xl p-6">

    <div className="flex justify-between items-center mb-6">
      <h3 className="text-3xl font-bold">
        Rooms
      </h3>

      <button
        onClick={() => setShowRoomForm(!showRoomForm)}
        className="bg-green-500 text-black px-4 py-2 rounded-lg font-bold"
      >
        + Create Room
      </button>
    </div>

    {showRoomForm && (
      <div className="bg-[#071412] rounded-xl p-6 mb-8">

        <h4 className="text-2xl font-bold mb-4">
          Room Builder
        </h4>

        <input
          placeholder="Room Name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="bg-black p-3 rounded w-full mb-6"
        />
        <input
  placeholder="Invite Email"
  value={participantEmail}
  onChange={(e) => setParticipantEmail(e.target.value)}
  className="bg-black p-3 rounded w-full mb-6"
/>

        <h4 className="text-xl font-bold mb-3">
          Available Offers
        </h4>

        {offers.length === 0 ? (
  <div className="text-gray-400">
    Create offers from Inventory first.
  </div>
) : (
  offers.map((offer) => (
    <label
      key={offer.id}
      className="border border-gray-700 rounded p-3 mb-3 flex items-center gap-3 cursor-pointer"
    >
      <input
        type="checkbox"
        checked={selectedOfferIds.includes(offer.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedOfferIds([
              ...selectedOfferIds,
              offer.id,
            ]);
          } else {
            setSelectedOfferIds(
              selectedOfferIds.filter(
                (id) => id !== offer.id
              )
            );
          }
        }}
      />

      <div>
        <div className="font-bold">
          {offer.id}
        </div>

        <div>
          {offer.lotNumber}
        </div>

        <div>
          {offer.origin}
        </div>
      </div>
    </label>
  ))
)}

        <button
  onClick={saveRoom}
  className="mt-6 bg-green-500 text-black px-4 py-2 rounded font-bold"
>
  Save Room
</button>

      </div>
    )}

    {rooms.map((room) => (
      <div
  key={room.id}
  onClick={async () => {
  setSelectedRoom(room);

  const { data: participants } = await supabase
    .from("RoomParticipants")
    .select("*")
    .eq("room_id", room.id);

  setRoomParticipants(participants || []);

  const selectedOffers = offers.filter((offer) =>
    room.offerIds.includes(offer.id)
  );

  setRoomOffers(selectedOffers);
}}
  className="border-b border-gray-800 py-4 cursor-pointer hover:bg-[#071412]"
>
        <div className="text-xl font-bold">
          {room.name}
        </div>

        <div className="text-gray-400">
          {room.id}
        </div>

        <div>
          Offers: {room.offerIds.join(", ")}
        </div>

        <div>
          Status: {room.status}
        </div>
      </div>
    ))}
    {selectedRoom && (
  <div className="mt-8 bg-[#071412] rounded-xl p-6">
    <h4 className="text-2xl font-bold mb-4">
      Room Details
    </h4>

    <div className="mb-2">
  <strong>Name:</strong> {selectedRoom.name}
</div>

<div className="mb-2">
  <strong>ID:</strong> {selectedRoom.id}
</div>

<div className="my-6">
  <div className="text-sm text-gray-400 mb-2">
    Room Link
  </div>

  <div className="bg-black border border-gray-700 rounded p-3 flex justify-between items-center">
    <span className="text-green-400">
      {`https://app.coffeehubcolombia.com/r/${selectedRoom.shareToken}`}
    </span>

    <button
      onClick={() => {
        navigator.clipboard.writeText(
  `https://app.coffeehubcolombia.com/r/${selectedRoom.shareToken}`
);
        alert("Room link copied");
      }}
      className="bg-green-500 text-black px-3 py-1 rounded font-bold"
    >
      Copy
    </button>
  </div>
</div>

    <div className="mb-2">
      <strong>Status:</strong> {selectedRoom.status}
    </div>

    <div className="mb-2">
      <div className="mb-4">
  <strong>Participants:</strong>

  {roomParticipants.length === 0 ? (
    <div className="text-gray-400">
      No participants
    </div>
  ) : (
    roomParticipants.map((participant) => (
      <div key={participant.id}>
        {participant.email} ({participant.status})
      </div>
    ))
  )}
</div>
      <div className="mb-4">
  <strong>Offers</strong>

  {roomOffers.map((offer) => (
    <div
      key={offer.id}
      className="border border-gray-700 rounded p-3 mt-2"
    >
      <div className="font-bold">
        {offer.id}
      </div>

      <div>
        Lot: {offer.lotNumber}
      </div>

      <div>
        Origin: {offer.origin}
      </div>

      <div>
        Status: {offer.status}
      </div>
    </div>
  ))}
</div>
    </div>
  </div>
)}

  </div>
)}
          {activeScreen === "deals" && (
            <div className="bg-[#10231e] rounded-xl p-6">

              <h3 className="text-3xl font-bold mb-6">
                Deal Engine
              </h3>

              {deals.map((deal) => (
                <div
                  key={deal.id}
                  className="border-b border-gray-800 py-4"
                >
                  {deal.id} | {deal.offerId} | {deal.status}
                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}
