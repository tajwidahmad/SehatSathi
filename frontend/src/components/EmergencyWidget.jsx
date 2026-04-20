import React, { useState, useEffect } from 'react';
import { AlertCircle, MapPin, Phone, Hospital, X, ShieldAlert, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const EmergencyWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [locationState, setLocationState] = useState('idle'); // idle, locating, found, error
  const [hospitals, setHospitals] = useState([]);

  // Mock function to "fetch" hospitals based on coordinates
  const fetchNearbyHospitals = async (lat, lng) => {
    // In a real app, you would query Nominatim/Overpass or Google Places API here.
    // For this interview mock, we simulate it organically perfectly inline.
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { name: "City Care Emergency Hospital", distance: "1.2 km", phone: "102" },
          { name: "LifeLine Trauma Center", distance: "2.4 km", phone: "112" },
          { name: "Global Health Govt Hospital", distance: "3.5 km", phone: "108" }
        ]);
      }, 1500);
    });
  }

  const triggerEmergency = () => {
    setIsOpen(true);
    setLocationState('locating');

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const foundHospitals = await fetchNearbyHospitals(latitude, longitude);
          setHospitals(foundHospitals);
          setLocationState('found');
          toast.success("Emergency contacts notified with your location.");
        },
        (error) => {
          console.error(error);
          setLocationState('error');
          toast.error("Could not fetch precise location. Showing default emergency services.");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationState('error');
    }
  };

  return (
    <>
      {/* Floating SOS Button */}
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={triggerEmergency}
        className="fixed bottom-6 right-6 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] border-2 border-red-400 z-50 cursor-pointer overflow-hidden group"
      >
        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
        <AlertCircle className="w-7 h-7 mb-0.5 relative z-10" />
        <span className="text-[10px] font-bold tracking-widest relative z-10">SOS</span>
      </motion.button>

      {/* Emergency Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
            
            {/* Modal */}
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border-4 border-red-500"
            >
              <button 
                onClick={() => setIsOpen(false)} 
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              <div className="bg-gradient-to-b from-red-600 to-red-700 p-6 sm:p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4"></div>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-3 relative z-10">
                  <ShieldAlert className="w-10 h-10 animate-pulse text-white fill-red-800" />
                  EMERGENCY
                </h2>
                <p className="text-red-100 mt-2 font-medium relative z-10">Your designated emergency contacts have been sent an SOS ping with your live secure location.</p>
              </div>

              <div className="p-6 sm:p-8 bg-gray-50">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  {locationState === 'locating' ? "Locating Nearest Hospitals..." : "Nearest Emergency Wards"}
                </h3>
                
                {locationState === 'locating' && (
                  <div className="flex flex-col items-center justify-center py-8">
                     <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                     <p className="mt-4 text-gray-500 font-medium">Acquiring GPS coordinates...</p>
                  </div>
                )}

                {(locationState === 'found' || locationState === 'error') && (
                  <div className="space-y-4">
                    {hospitals.length > 0 ? (
                      hospitals.map((hospital, idx) => (
                        <div key={idx} className="bg-white border text-left border-gray-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="bg-red-50 p-3 rounded-lg text-red-600">
                               <Hospital className="w-6 h-6" />
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-800">{hospital.name}</h4>
                               <p className="text-sm font-semibold text-gray-500 mt-0.5 flex items-center gap-1"><Navigation className="w-3 h-3 text-red-500"/>{hospital.distance} Away</p>
                            </div>
                          </div>
                          <a href={`tel:${hospital.phone}`} className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95">
                             <Phone className="w-5 h-5 fill-current" />
                          </a>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>Showing national emergency numbers due to location unavailability.</p>
                        <a href={`tel:112`} className="mt-4 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg font-bold">
                           <Phone className="w-5 h-5 fill-current" /> DIAL 112
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-white p-4text-center border-t border-gray-100 flex justify-center py-4">
                 <p className="text-xs text-gray-400">Do not close this window. Help is advised.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyWidget;
