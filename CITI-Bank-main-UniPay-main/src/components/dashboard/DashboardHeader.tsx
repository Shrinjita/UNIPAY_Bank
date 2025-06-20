
// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Bell, Search, Settings, User } from 'lucide-react';

// const DashboardHeader = () => {
//   return (
//     <div className="border-b border-gray-200">
//       <div className="container py-4 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
        
//         <div className="flex items-center space-x-4">
//           <div className="relative hidden md:block">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search..." 
//               className="pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
//             />
//           </div>
          
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell size={20} />
//             <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-white text-xs flex items-center justify-center">
              
//             </span>
//             {/* <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
//               3
//             </span> */}
//           </Button>
          
//           <Button variant="ghost" size="icon">
//             <Settings size={20} />
//           </Button>
          
//           <Button variant="ghost" size="icon" className="rounded-full">
//             <User size={20} />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;

// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
// import { auth } from '../../firebase/firebaseConfig'; // Adjust the import path if needed
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom'; // Required for redirect

// const DashboardHeader = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);              // End Firebase session
//       console.log("User signed out");
//       navigate('/');                   // Redirect to landing page
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <div className="border-b border-gray-200">
//       <div className="container py-4 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Dashboard</h1>
        
//         <div className="flex items-center space-x-4">
//           <div className="relative hidden md:block">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search..." 
//               className="pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
//             />
//           </div>
          
//           <Button variant="ghost" size="icon" className="relative">
//             <Bell size={20} />
//           </Button>
          
//           <Button variant="ghost" size="icon">
//             <Settings size={20} />
//           </Button>

//           <Button variant="ghost" size="icon" className="rounded-full">
//             <User size={20} />
//           </Button>

//           {/* 🚪 Logout Button */}
//           <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
//             <LogOut size={16} />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;


// src/components/DashboardHeader.tsx

// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
// import { auth } from '../../firebase/firebaseConfig';
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';

// const DashboardHeader = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth); // Ends Firebase session
//       console.log("User signed out successfully");
//       navigate('/');       // Redirect to landing page
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <div className="border-b border-gray-200">
//       <div className="container py-4 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Dashboard</h1>

//         <div className="flex items-center space-x-4">
//           <div className="relative hidden md:block">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search..."
//               className="pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
//             />
//           </div>

//           <Button variant="ghost" size="icon" className="relative">
//             <Bell size={20} />
//           </Button>

//           <Button variant="ghost" size="icon">
//             <Settings size={20} />
//           </Button>

//           <Button variant="ghost" size="icon" className="rounded-full">
//             <User size={20} />
//           </Button>

//           {/* 🚪 Logout Button */}
//           <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
//             <LogOut size={16} />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;



// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
// import { auth } from '../../firebase/firebaseConfig';
// import { signOut } from 'firebase/auth';
// import { useNavigate } from 'react-router-dom';

// const DashboardHeader = () => {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);        // Ends the Firebase session
//       console.log("User signed out");
//       navigate('/');              // Redirect to landing page
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   return (
//     <div className="border-b border-gray-200">
//       <div className="container py-4 flex items-center justify-between">
//         <h1 className="text-2xl font-bold">Dashboard</h1>

//         <div className="flex items-center space-x-4">
//           {/* other buttons here */}

//           <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
//             <LogOut size={16} />
//             Logout
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardHeader;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, User, LogOut } from 'lucide-react';
import { auth } from '../../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const DashboardHeader = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);        // Ends the Firebase session
      console.log("User signed out");
      navigate('/');              // Redirect to landing page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="border-b border-gray-200">
      <div className="container py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex items-center space-x-4">
          {/* other buttons here */}

          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#007bff] text-white hover:bg-[#006ae0] px-4 py-2 rounded-md"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
