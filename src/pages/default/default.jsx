import React from "react";
import Navbar from "../../components/navbar/navbar";
import Footer from "../../components/footer/footer";



const DefaultLayout = ({ children, allowOverflowY = true }) => {
  return (
    <div className="scroll-container flex flex-col min-h-screen w-full">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className={`flex-grow ${allowOverflowY ? 'overflow-y-auto' : 'overflow-y-hidden'}`}>
        <div className="mx-auto  scroll-container">
          {children}
        </div>
      </main>

      <Footer/>

      {/* Footer */}
      {/* <Footer /> */}

    </div>
  );
};

export default DefaultLayout;
