import App from "@/components/App";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="bg-black pb-4">
      <section id="nav">
        <Navbar/>
      </section>

      <section id="app">
        <App/>
      </section>

      <footer className="container mx-auto text-slate-100 capitalize text-center my-5">
        <p>Copyright &copy; 2024 by Team</p>
      </footer>
    </div>
  );
}
