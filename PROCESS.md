# CoffeeHub Terminal - Seller vs Buyer Process

## Bug we had: seller stuck in view
- app/page.tsx line 90 had: href={`/r/${r.share_token}`} -> buyer read-only
- app/room/[id]/page.tsx had: redirect(`/r/${share_token}`) -> forced buyer view
- save() sent { _table, id } to Supabase -> UPDATE failed

## Fix (final working)
- app/page.tsx: Edit Room -> href={`/room/${r.id}`} (black button) + Buyer View -> href={`/r/${share_token}`}
- app/room/[id]/page.tsx: SellerRoomPage editable, save() deletes _table, id, created_at before .update(payload).eq("id",idVal)
- app/seller/room/[roomName]/page.tsx: same editable by name (trujillo)
- rm -rf .next + npm run dev required (zsh: space needed between -rf and .next)

## Current flow
1. Seller: Green OS -> Buyer rooms -> Edit Room -> /room/ROOM-XXXX
2. Edit Logistics: BK-603951 Maersk AMAZON Buenaventura->Rotterdam Shipped
3. Save -> Supabase Logistics table room_id=trujillo
4. Buyer: /r/{share_token} read-only cards + green progress bar auto-updates

## To verify
- /room/[id] shows "Seller Room • trujillo — Editable"
- /r/[token] shows "Buyer Portal" read-only
