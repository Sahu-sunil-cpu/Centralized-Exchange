export const BidTable = ({ bids }: {bids: [string, string][]}) => {
    let currentTotal = 0; 
    const relevantBids = bids.slice(0, 15);
    const bidsWithTotal: [string, string, number][] = relevantBids.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
    const maxTotal = relevantBids.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);

    return <div className="flex-1 min-h-0">
    <div className="h-full overflow-y-auto scrollbar-hide">
      <div className="space-y-1">
        {bidsWithTotal.map(([price, quantity, total]) => (
          <div key={price} className="grid grid-cols-3 text-xs py-1 hover:bg-slate-800 cursor-pointer">
            <div className="text-green-400">{price}</div>
            <div className="text-right text-slate-300">{quantity}</div>
            <div className="text-right text-slate-400">{total}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
}

