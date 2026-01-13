import React from 'react'
import { useNavigate } from 'react-router-dom';

function Options() {
    
    const navigate = useNavigate();
    
    const createplan = () => {
        navigate('/createplan');
    }
    const joinplan = () => {
        navigate('/showplans');
    }
    const friends = () => {
        navigate('/userlist');
    }

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-black via-lightDark2 to-black">
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-20 w-5/6 px-10 justify-center items-center "> 

<div className="border border-white/20 hover:border-white/70 hover:border-2 p-6 rounded-lg shadow-lg transition-all duration-300 w-10/11 min-h-56 cursor-pointer" onClick={createplan}>
  <div className="flex items-center justify-center mb-4">
    {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-white">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0" />
    </svg> */}
  </div>
  <h3 className="text-lg font-semibold text-white mb-2">Create a Plan</h3>
  <p className="text-gray-400">Discover carefully curated destinations revealed only before departure.</p>
</div>



      <div className="border border-white/20 hover:border-white/70 hover:border-2 p-6 rounded-lg shadow-lg transition-all duration-300 w-10/11 min-h-56 cursor-pointer" onClick={joinplan}>
        <div className="flex items-center justify-center mb-4">
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V21M21 18.75V21M3 12h18M12 3v18" />
          </svg> */}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Join Plans</h3>
        <p className="text-gray-400">Wanna to join plan to do adventure of Blind Date.??</p>
      </div>

      <div className="border border-white/20 hover:border-white/70 hover:border-2 p-6 rounded-lg shadow-lg transition-all duration-300 w-10/11 min-h-56 cursor-pointer" onClick={friends}>
        <div className="flex items-center justify-center mb-4">
          {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.75V8.25c0-1.125-.45-2.175-1.2-2.9-1.05-1.125-2.7-1.65-4.5-1.65h-6c-1.8 0-3.45.525-4.5 1.65C4.5 6.075 4 7.125 4 8.25v6.5c0 1.125.45 2.175 1.2 2.9 1.05 1.125 2.7 1.65 4.5 1.65h6c1.8 0 3.45-.525 4.5-1.65C20.795 16.925 21.25 15.875 21.25 14.75z" />
          </svg> */}
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Make Friends</h3>
        <p className="text-gray-400">Discover new friends whose vibes match with u and experiences for unforgettable moments.</p>
      </div>
    </div>
    </div>
  )
}

export default Options
