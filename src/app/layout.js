import { Kanit } from "next/font/google";
import "./globals.css";
import { Web3ModalProvider } from "@/context/Web3Modal";

const kanit = Kanit({
  subsets: ["latin"],
  weight: ["200", "300", "400"]
});

export const metadata = {
  title: "Hamster Revenue Sharing",
  description: "Claim ETH tokens based on the amount of $HAMS tokens you HODL.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any"/>
      </head>
      <body className={kanit.className}>
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </body>
    </html>
  );
}