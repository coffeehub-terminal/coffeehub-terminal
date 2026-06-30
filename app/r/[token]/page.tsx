import { supabase } from "@/lib/supabase";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  

  const { token } = await params;

const { data: room } = await supabase
  .from("Rooms")
  .select("*")
  .eq("share_token", token)
  .single();
 

  const { data: participants } = await supabase
    .from("RoomParticipants")
    .select("*")
    .eq("room_id", room?.id);

  const offerIds =
  room?.offer_ids
    ?.split(",")
    .map((id: string) => id.trim())
    .filter(Boolean) || [];
    

const { data: offers } = await supabase
  .from("Offers")
  .select("*")
  .in("id", offerIds);
  

  return (
    <main className="min-h-screen bg-[#071412] text-white p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold mb-2">
          CoffeeHub
        </h1>

        <div className="text-green-400 mb-10">
  Buyer Portal
</div>

        <div className="bg-[#10231e] rounded-xl p-8">

          <h2 className="text-3xl font-bold mb-2">
            {room?.name || "Coffee Room"}
          </h2>

          <div className="text-gray-400 mb-2">
            Room ID: {room?.id}
          </div>

          <div className="text-gray-400 mb-8">
            Status: {room?.status}
          </div>

          <div className="bg-black rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-400 mb-2">
              Invited Participants
            </div>

            {participants?.length === 0 ? (
              <div className="text-gray-500">
                No participants
              </div>
            ) : (
              participants?.map((participant) => (
                <div key={participant.id}>
                  {participant.email}
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="bg-black rounded-lg p-4">
              <div className="text-gray-400 text-sm">
                Offers
              </div>
              <div className="text-2xl font-bold">
  {offers?.length}
</div>
            </div>

            <div className="bg-black rounded-lg p-4">
              <div className="text-gray-400 text-sm">
                Participants
              </div>
              <div className="text-2xl font-bold">
                {participants?.length || 0}
              </div>
            </div>

            <div className="bg-black rounded-lg p-4">
              <div className="text-gray-400 text-sm">
                Status
              </div>
              <div className="text-2xl font-bold">
                {room?.status}
              </div>
            </div>

          </div>

          <div className="flex gap-4 mb-8">

            <a
              href="mailto:sales@coffeehubcolombia.com?subject=Sample Request"
              className="bg-green-500 text-black px-6 py-3 rounded-lg font-bold"
            >
              Request Samples
            </a>

            <a
              href="mailto:sales@coffeehubcolombia.com?subject=Pricing Request"
              className="bg-white text-black px-6 py-3 rounded-lg font-bold"
            >
              Request Pricing
            </a>

          </div>

          <h3 className="text-2xl font-bold mb-4">
            Available Coffees
          </h3>

          {offers?.map((offer) => (
            <div
              key={offer.id}
              className="border border-gray-700 rounded-xl p-6 mb-4 hover:border-green-500"
            >
              <a
                href={`/lot/${offer.id}`}
                className="block"
              >
                <div className="font-bold text-xl mb-2">
                  {offer.lot_number}
                </div>

                <div className="mb-1">
                  Origin: {offer.origin}
                </div>

                <div className="mb-4">
                  Status: {offer.status}
                </div>

                <div className="text-green-400 font-bold mb-4">
                  View Coffee →
                </div>
              </a>

              <div className="flex gap-3">

                <a
                  href="mailto:sales@coffeehubcolombia.com?subject=Sample Request"
                  className="bg-green-500 text-black px-4 py-2 rounded font-bold"
                >
                  Request Sample
                </a>

                <a
                  href="mailto:sales@coffeehubcolombia.com?subject=Pricing Request"
                  className="bg-white text-black px-4 py-2 rounded font-bold"
                >
                  Request Pricing
                </a>

              </div>

            </div>
          ))}

        </div>

      </div>
    </main>
  );
}