import React from "react";
import { UserCircle } from "lucide-react";
import "../../styles/Buttons.css";
import SellerProfileDropdown from "../Profiledropdown/SellerprofileDropdown"; 
import NotificationDropdown from "../NotificationDropdown";


const Sellernavbar = () => {
  //const navigate = useNavigate();
  
  return (
    <div
      className="w-full h-16 
                    bg-[#0A0D2E] 
                    border-b border-[#13183C]
                    flex items-center justify-between px-6"
    >
      
  <h1 className="text-2xl font-bold text-[#00E7FF] tracking-wide">
    Seller Panel
  </h1>

      <div className="flex items-center gap-6 text-[#00E7FF]">
        <NotificationDropdown notifications={[]} />

        
        

         <SellerProfileDropdown user={<UserCircle/>} />
        
      </div>
    </div>
  );
};

export default Sellernavbar;
