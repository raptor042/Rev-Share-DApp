"use client"

import { HAMS_ABI, HAMS_CA, REV_SHARE_ABI, REV_SHARE_CA } from "@/context/config";
import { useWeb3ModalAccount, useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import {
  AiOutlineSecurityScan,
  AiOutlineClockCircle,
  AiOutlineHeatMap,
} from "react-icons/ai";

const App = () => {
  const [successMsg, setSuccessMsg] = useState()
  const [errorMsg, setErrorMsg] = useState()

  const [minBalance, setMinBalance] = useState(0)
  const [poolTotal, setPoolTotal] = useState(0)
  const [nextShareTotal, setNextShareTotal] = useState(0)
  const [nextClaimTime, setNextClaimTime] = useState(0)
  const [hamsBalance, setHamsBalance] = useState(0)
  const [ethBalance, setETHBalance] = useState(0)

  const [canClaim, setCanClaim] = useState(false)
  const [eligible, setEligible] = useState(false)

  const [loading, setLoading] = useState(false)

  const { address, isConnected } = useWeb3ModalAccount()

  const { walletProvider } = useWeb3ModalProvider()

  let provider;

  if (walletProvider) {
    provider = new ethers.BrowserProvider(walletProvider)
  }

  useEffect(() => {
    if (isConnected) {
      rev_share()
    }
  }, [
    minBalance,
    poolTotal,
    nextShareTotal,
    nextClaimTime,
    hamsBalance,
    ethBalance,
    address,
    isConnected,
    provider
  ])

  const rev_share = async () => {
    const signer = await provider.getSigner()

    const rev = new ethers.Contract(
      REV_SHARE_CA,
      REV_SHARE_ABI,
      signer
    )

    const hams = new ethers.Contract(
      HAMS_CA,
      HAMS_ABI.abi,
      signer
    )

    const eligible = await rev.eligible(address)
    console.log(eligible)
    setEligible(eligible)

    const minBalance = await rev.minBalance()
    console.log(ethers.formatEther(minBalance))
    setMinBalance(Number(ethers.formatEther(minBalance)).toFixed(0))

    const pool = await rev.pool()
    console.log(ethers.formatEther(pool))
    setPoolTotal(ethers.formatEther(pool))

    const hamsBalance = await hams.balanceOf(address)
    console.log(ethers.formatEther(hamsBalance))
    setHamsBalance(Number(ethers.formatEther(hamsBalance)).toFixed(0))

    const eth = await provider.getBalance(address)
    console.log(ethers.formatEther(eth))

    const supply = await hams.totalSupply()
    console.log(ethers.formatEther(supply))

    const user = await rev.user(address)
    console.log(user)

    const ratio = Number(ethers.formatEther(hamsBalance)) / Number(ethers.formatEther(supply))
    const nextShareTotal = Number(ratio * Number(ethers.formatEther(pool))).toFixed(3)
    console.log(ratio, nextShareTotal)

    const nextClaimTime = Number(user[2]) + 86400
    console.log(nextClaimTime)

    setETHBalance(ethers.formatEther(user[1]))
    setNextShareTotal(nextShareTotal)

    if (Number(user[2]) == 0) {
      const block = await provider.getBlock("latest")
      console.log(block.timestamp)

      setNextClaimTime(block.timestamp - 1000)
    } else {
      setNextClaimTime(nextClaimTime)
    }

    if (Number(ethers.formatEther(hamsBalance)) >= Number(ethers.formatEther(minBalance)) && Number(ethers.formatEther(pool)) > 0) {
      setCanClaim(true)
    }
  }

  const onClaim = async e => {
    e.preventDefault()

    const signer = await provider.getSigner()

    const rev = new ethers.Contract(
      REV_SHARE_CA,
      REV_SHARE_ABI,
      signer
    )

    if (poolTotal > 0 && Number(nextShareTotal) < poolTotal) {
      if (hamsBalance >= minBalance) {
        if (nextClaimTime != 0 && nextClaimTime * 1000 < Date.now()) {
          try {
            setCanClaim(false)
            setLoading(true)

            await rev.claim()

            // rev.on("User_Created", (user, e) => {
            //   console.log(user)
            //   setSuccessMsg(`Congratulations, your $HAMS revenue account has been created.`)
            //   setTimeout(() => {
            //     setSuccessMsg(null)
            //   }, 3000)
            // })

            rev.on("Claimed", (user, amount, e) => {
              console.log(user, amount)
              setCanClaim(true)
              setLoading(false)
              setSuccessMsg(`Congratulations, you just claimed ${ethers.formatEther(amount)} ETH.`)
              setTimeout(() => {
                setSuccessMsg(null)
              }, 3000)
            })
          } catch (error) {
            console.log(error)
            setCanClaim(true)
            setLoading(false)
            setErrorMsg("An error occured while processing this request.")
            setTimeout(() => {
              setErrorMsg(null)
            }, 3000)
          }
        } else {
          setErrorMsg("You cannot claim at this moment, check your Next Claim Time.")
          setTimeout(() => {
            setErrorMsg(null)
          }, 3000)
        }
      } else {
        setErrorMsg(`You must hold at least ${minBalance} $HAMS to claim.`)
        setTimeout(() => {
          setErrorMsg(null)
        }, 3000)
      }
    } else {
      setErrorMsg("Insufficient funds in the pool.")
      setTimeout(() => {
        setErrorMsg(null)
      }, 3000)
    }
  }

  return (
    <>
      <div className="my-20 bg-slate-100 w-11/12 md:w-8/12 lg:w-5/12 mx-auto p-6 py-9 rounded-xl">
        {successMsg && (
          <div className="bg-green-500 text-white p-4 text-center my-4 rounded-lg">
            <p>{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-700 text-white p-4 text-center my-4 rounded-lg">
            <p>{errorMsg}</p>
          </div>
        )}

        <h2 className="font-bold tracking-wider">REVENUE SHARING</h2>
        <div className="p-6 text-center text-slate-600">
          <p>
            You must hold at least {minBalance} $HAMS to claim
          </p>
        </div>

        <div id="details" className="">
          <ul className="text-slate-700">
            <li className="flex items-center justify-between p-3 mb-1">
              <span className="flex items-center">
                <AiOutlineSecurityScan /> &nbsp; Pool total
              </span>
              <span>{poolTotal} ETH</span>
            </li>
            <li className="flex items-center justify-between p-3 mb-1">
              <span className="flex items-center">
                <AiOutlineHeatMap /> &nbsp; Next Share Total
              </span>
              <span>{nextShareTotal} ETH</span>
            </li>
            <li className="flex items-center justify-between p-3 mb-1">
              <span className="flex items-center">
                <AiOutlineClockCircle /> &nbsp; Next Share Unlock
              </span>
              <span>
                {nextClaimTime != 0 && nextClaimTime * 1000 > Date.now()
                  ? new Date(nextClaimTime * 1000).toLocaleString()
                  : "Now"}
              </span>
            </li>
            <li className="flex items-center justify-between p-3 mb-1">
              <span>$HAMS Balance</span>
              <span>{hamsBalance} $HAMS</span>
            </li>
            <li className="flex items-center justify-between p-3 mb-1">
              <span>ETH Balance</span>
              <span>{ethBalance} ETH</span>
            </li>
          </ul>
        </div>

        <button
          className="w-full text-center text-slate-100 bg-[#DE8508] hover:bg-orange-500 py-3 rounded-lg disabled:bg-slate-400"
          disabled={
            !isConnected ||
            !canClaim ||
            !eligible ||
            (nextClaimTime != 0 && nextClaimTime * 1000 >= Date.now())
          }
          onClick={onClaim}
        >
          {!loading && "Claim"}
          {loading &&
            <div className="flex justify-center">
              <div role="status">
                <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          }
        </button>
      </div>
    </>
  );
};

export default App;
