import React from "react";

const Footer = () => {
  

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-[#131A22] text-white mt-10">

      {/* Back to top */}
      <div onClick={scrollToTop} className="bg-[#232F3E] text-center py-3 cursor-pointer hover:bg-[#37475A]">
        Back to top
      </div>

      {/* Main Footer */}
      <div className="bg-[#232F3E] px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <h3 className="font-bold mb-3">Get to Know Us</h3>
          <p>About</p>
          <p>Careers</p>
          <p>Press Releases</p>
          <p>Amazon Science</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Connect with Us</h3>
          <p>Facebook</p>
          <p>Twitter</p>
          <p>Instagram</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Make Money with Us</h3>
          <p>Sell on our app</p>
          <p>Become Affiliate</p>
          <p>Advertise Products</p>
          <p>Fulfilment</p>
        </div>

        <div>
          <h3 className="font-bold mb-3">Let Us Help You</h3>
          <p>Your Account</p>
          <p>Returns</p>
          <p>Help</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="bg-[#131A22] border-t border-gray-700 py-6 text-center">

        <h1 className="text-xl font-bold mb-2">MyShop</h1>

        <div className="flex justify-center gap-5 text-sm text-gray-400">
          <span>Conditions</span>
          <span>Privacy</span>
          <span>Help</span>
        </div>

      </div>

    </div>
  );
};

export default Footer;