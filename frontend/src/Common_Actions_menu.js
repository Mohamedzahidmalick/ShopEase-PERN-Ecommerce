import { useState, useEffect ,useRef} from "react";
import { MoreVertical } from "lucide-react";

const ActionMenu = ({ children }) => {

  const [open, setOpen] = useState(false);
  const ref = useRef(null);

   useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
     <div ref={ref} className="relative overflow-visible">

      <button
        onClick={() => setOpen(!open)}
        className="px-2 py-1 text-black dark:text-black dark:bg-white/10 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
      >
        ⋮
      </button>

      {open && (
        <div
          className="
          absolute
          left-1/2
          -translate-x-1/2
          mt-2
          w-40
          bg-white
          shadow-lg
          rounded
          border
          z-50
          "
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;