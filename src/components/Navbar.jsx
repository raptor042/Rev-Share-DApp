"use client"

import { useEffect, useState } from "react";
import logo from "../../public/hamster.png";
import chart from "../../public/chart.svg";
import user from "../../public/user.svg";
import cart from "../../public/shopcart.svg";
import hashtag from "../../public/hashtag.svg";
import { FaBars } from "react-icons/fa";
import Link from "next/link";
import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import Image from "next/image";

const Navbar = () => {
  const { address, isConnected } = useWeb3ModalAccount()

  const { open } = useWeb3Modal()

  const [account, setAccount] = useState()
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isConnected) {
      const _address = truncate(address)

      setAccount(_address)
    }
  }, [address, isConnected])

  const truncate = (_address) => {
    const start = _address.substring(0, 6)
    const end = _address.substring(36, 42)

    return start + "..." + end
  }
  return (
    <>
      <nav className="text-slate-800 bg-slate-100">
        <div className="container mx-auto px-4 py-4 flex md:items-center flex-col md:flex-row justify-between">
          <div
            id="brand"
            className="flex items-center justify-between ml-3 mb-3 md:mb-0"
          >
            <Link href="/">
              <Image src={logo} alt="" width={50} className="" />
            </Link>

            <button
              className="hover:bg-slate-300 p-2 rounded md:hidden"
              onClick={() => {
                setIsOpen((open) => !open);
              }}
            >
              <FaBars />
            </button>
          </div>

          <div
            className={`media-links text-sm flex flex-col md:block border md:border-none border-solid border-slate-900 my-3 md:my-0 rounded-lg py-3 md:py-0  ${isOpen ? "" : "hidden"
              }`}
          >
            {/* <Link
              href="/init"
              className="mx-4 text-lg uppercase hover:text-[#DE8508] py-2"
            >
              Init
            </Link> */}
            <a href="" className="mx-4 hover:text-[#DE8508] py-2">
              <Image src={chart} alt="chart" className="inline mr-1" width={30} />
              Chart
            </a>
            <a href="https://t.me/racinghamstersbot" className="mx-4 hover:text-[#DE8508] py-2">
              <Image src={user} alt="Tg Bot" className="inline mr-1" width={30} />
              Telegram
            </a>
            <a href="https://x.com/racinghamsters" className="mx-4 hover:text-[#DE8508] py-2">
              <Image
                src={hashtag}
                alt="Twitter"
                className="inline mr-1"
                width={25}
              />
              Twitter
            </a>
            <a href="" className="mx-4 hover:text-[#DE8508] py-2">
              <Image src={cart} alt="chart" className="inline mr-1" width={30} />
              Buy $HAMS
            </a>
          </div>

          <button
            className="bg-[#DE8508] text-slate-100 rounded-xl px-4 py-3 hover:bg-orange-400 animate-pulse"
            onClick={() => open()}
          >
            {isConnected ?
              account : "Connect Wallet"
            }
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
