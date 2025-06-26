
export const AskTable = ({ asks }: { asks: [string, string][] }) => {
  let currentTotal = 0;
  const relevantAsks = asks.slice(0, 15);
  relevantAsks.reverse();
  const asksWithTotal: [string, string, number][] = relevantAsks.map(([price, quantity]) => [price, quantity, currentTotal += Number(quantity)]);
  const maxTotal = relevantAsks.reduce((acc, [_, quantity]) => acc + Number(quantity), 0);
  asksWithTotal.reverse();

  return <div>
    {asksWithTotal.map(([price, quantity, total]) => <Asks maxTotal={maxTotal} key={price} price={price} quantity={quantity} total={total} />)}
  </div>
}

export function Asks({ price, quantity, total }: { price: string, quantity: string, total: number, maxTotal: number }) {


  return <div>
    <div className="flex-1 min-h-0">
      <div className="h-full overflow-y-auto scrollbar-hide">
        <div className="space-y-1">

          <div key={price} className="grid grid-cols-3 text-xs py-1 hover:bg-slate-800 cursor-pointer">
            <div className="text-red-400">{price}</div>
            <div className="text-right text-slate-300">{quantity}</div>
            <div className="text-right text-slate-400">{total}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
}