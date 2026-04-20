import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, IndianRupee, ShieldPlus, AlertTriangle } from 'lucide-react';

// Fix for default leaflet icons not loading in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon for Govt Hospitals
const govtIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/803/803087.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Component to dynamically set map center
const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 14, { animate: true });
        }
    }, [center, map]);
    return null;
};

const AffordableTreatment = () => {
    const defaultCenter = [23.3441, 85.3096]; // Ranchi, Jharkhand (Default fallback)
    const [userLocation, setUserLocation] = useState(null);
    const [hospitals, setHospitals] = useState([]);
    const [filter, setFilter] = useState('all'); // all, govt, low-cost
    const [status, setStatus] = useState('Locating you...');

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                    setStatus('Generating nearby low-cost healthcare data...');
                    generateMockData(latitude, longitude);
                },
                (error) => {
                    console.error("Location error:", error);
                    setUserLocation(defaultCenter);
                    setStatus('Location denied. Showing default area.');
                    generateMockData(defaultCenter[0], defaultCenter[1]);
                }
            );
        } else {
            setUserLocation(defaultCenter);
            generateMockData(defaultCenter[0], defaultCenter[1]);
        }
    }, []);

    const generateMockData = (lat, lng) => {
        // Generating realistic fake clinics/hospitals around the user's location
        const randomOffset = () => (Math.random() - 0.5) * 0.05;
        
        const mockData = [
            { id: 1, name: "Sadar Government Hospital", type: "govt", fee: 0, lat: lat + randomOffset(), lng: lng + randomOffset(), rating: "4.2", desc: "Fully funded government facility. Free emergency and general checkups." },
            { id: 2, name: "City Municipal Dispensary", type: "govt", fee: 10, lat: lat + randomOffset(), lng: lng + randomOffset(), rating: "3.8", desc: "Basic OPD and free medicines provided under government schemes." },
            { id: 3, name: "Jivan Jyoti Low-Cost Clinic", type: "low-cost", fee: 150, lat: lat + randomOffset(), lng: lng + randomOffset(), rating: "4.5", desc: "NGO-run clinic focusing on affordable maternal and child care." },
            { id: 4, name: "Relief Charitable Trust Hospital", type: "low-cost", fee: 100, lat: lat + randomOffset(), lng: lng + randomOffset(), rating: "4.1", desc: "Subsidized specialized treatments and heavily discounted pharmacy." },
            { id: 5, name: "Jan Swasthya Kendra (Govt.)", type: "govt", fee: 5, lat: lat + randomOffset(), lng: lng + randomOffset(), rating: "4.0", desc: "Community health center for preliminary screening and vaccinations." }
        ];

        setTimeout(() => {
            setHospitals(mockData);
            setStatus('');
        }, 800);
    };

    const filteredHospitals = hospitals.filter(h => filter === 'all' || h.type === filter);

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] mx-2 my-2">
            <div className="bg-gradient-to-r from-blue-900 to-primary text-white p-6 rounded-2xl mb-4 shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                        <IndianRupee className="w-8 h-8" />
                        Affordable Treatment Finder
                    </h1>
                    <p className="opacity-90 mt-1 max-w-xl text-sm md:text-base">
                        Helping the community find heavily subsidized, free government hospitals, and NGO-run low-cost clinics near them perfectly solving the healthcare accessibility gap.
                    </p>
                </div>
                
                <div className="flex items-center gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-sm self-start md:self-auto">
                    <button 
                       onClick={() => setFilter('all')}
                       className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'all' ? 'bg-white text-primary shadow-md' : 'hover:bg-white/20'}`}
                    >All</button>
                    <button 
                       onClick={() => setFilter('govt')}
                       className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'govt' ? 'bg-white text-primary shadow-md' : 'hover:bg-white/20'}`}
                    >Govt. Free (₹0)</button>
                    <button 
                       onClick={() => setFilter('low-cost')}
                       className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === 'low-cost' ? 'bg-white text-primary shadow-md' : 'hover:bg-white/20'}`}
                    >NGO / Low-Cost</button>
                </div>
            </div>

            {status && (
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg mb-4 flex items-center justify-center gap-2 font-medium border border-blue-200">
                    <Navigation className="w-5 h-5 animate-pulse" /> {status}
                </div>
            )}

            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Map Section */}
                <div className="flex-1 h-[50vh] md:h-full rounded-2xl overflow-hidden shadow-md border-2 border-primary/20 z-0">
                    <MapContainer center={userLocation || defaultCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>You are exactly here.</Popup>
                            </Marker>
                        )}
                        {filteredHospitals.map(hospital => (
                            <Marker 
                                key={hospital.id} 
                                position={[hospital.lat, hospital.lng]}
                                icon={hospital.type === 'govt' ? govtIcon : new L.Icon.Default()}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <h3 className="font-bold text-gray-800 text-sm mb-1">{hospital.name}</h3>
                                        <p className="text-xs text-gray-600 mb-2">{hospital.desc}</p>
                                        <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-2 py-1 rounded w-fit text-xs">
                                            Consultation: {hospital.fee === 0 ? 'FREE' : `₹${hospital.fee}`}
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <MapUpdater center={userLocation} />
                    </MapContainer>
                </div>

                {/* List Section */}
                <div className="w-full md:w-1/3 h-full overflow-y-auto bg-gray-50 rounded-2xl p-4 border border-gray-200 shadow-inner flex flex-col gap-3">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-2 sticky top-0 bg-gray-50 pb-2 z-10 border-b border-gray-200">
                        <ShieldPlus className="w-5 h-5 text-primary" />
                        Available Nearby Options ({filteredHospitals.length})
                    </h3>
                    
                    {filteredHospitals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-gray-400">
                            <AlertTriangle className="w-12 h-12 mb-2 opacity-50" />
                            <p>No facilities found for this filter.</p>
                        </div>
                    ) : (
                        filteredHospitals.map(hospital => (
                            <div key={hospital.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30"
                                onClick={() => setUserLocation([hospital.lat, hospital.lng])} // Focus map on click
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800 text-sm">{hospital.name}</h4>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${hospital.type === 'govt' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                        {hospital.type === 'govt' ? 'Govt' : 'NGO'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{hospital.desc}</p>
                                
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                                        Fee: {hospital.fee === 0 ? 'FREE' : `₹${hospital.fee}`}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-yellow-600">
                                        ⭐ {hospital.rating}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AffordableTreatment;
