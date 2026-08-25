import Footer from "./Footer";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
