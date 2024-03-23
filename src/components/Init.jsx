import { useState } from "react";

const Init = () => {
  const [amount, setAmount] = useState(0)

  return (
    <>
      <div className="my-20 bg-slate-100 w-11/12 md:w-8/12 lg:w-5/12 mx-auto p-6 py-9 rounded-xl">
        {successMsg && (
          <div className="bg-green-500 text-white p-4 text-center my-4 rounded-lg">
            <p>{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="bg-green-700 text-white p-4 text-center my-4 rounded-lg">
            <p>{errorMsg}</p>
          </div>
        )}
        <form action="" onSubmit={handleSubmit}>
          <input
            type="number"
            value={amount}
            placeholder="Enter amount of ETH to deposit per period*"
            className="w-full py-3 px-4 my-5 rounded-lg"
            onChange={(e) => setAmount(e.target.value)}
          />
          <input
            type="number"
            value={minimumTokenBalance}
            placeholder="Enter minimum token balance for claim*"
            className="w-full py-3 px-4 my-5 rounded-lg"
            onChange={(e) => setMinimumTokenBalance(e.target.value)}
          />
          <button
            className="w-full text-center text-slate-100 bg-blue-600 hover:bg-blue-800 py-3 rounded-lg disabled:bg-slate-400"
            type="submit"
            disabled={!ctx.isWalletConnected || !amount || !minimumTokenBalance}
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Init;