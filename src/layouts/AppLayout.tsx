import Footer from "@components/Common/Footer";
import Navbar from "@components/Common/Navbar";

interface AppLayoutProps {
  children: React.ReactNode;
}
function AppLayout({ children }: AppLayoutProps) {
  return (
    <div>
      <span className="max-w-[1440px] sticky top-0 z-50 mx-auto block px-[1rem] lg:pl-[2.5rem] 1xl:pl-[3.89rem] lg:pr-[2.33rem] lg:py-[0.2rem] bg-white">
        <Navbar />
      </span>
      <main className="w-full relative min-h-screen max-w-[90rem] mx-auto mb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
