import React, { useState, useEffect } from 'react';
import { Pill, Clock, Plus, Trash2, CalendarCheck, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const MedicineReminders = () => {
    const [reminders, setReminders] = useState([]);
    const [name, setName] = useState('');
    const [time, setTime] = useState('');
    const [dosage, setDosage] = useState('');

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('medicine_reminders')) || [];
        setReminders(saved);

        // Request notification permission if not granted
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    const addReminder = (e) => {
        e.preventDefault();
        if (!name || !time || !dosage) {
            toast.warning("Please fill all fields");
            return;
        }

        const newReminder = {
            id: Date.now().toString(),
            name,
            time,
            dosage,
            active: true,
            lastTriggered: null // Stores the date string it was last triggered
        };

        const updated = [...reminders, newReminder];
        setReminders(updated);
        localStorage.setItem('medicine_reminders', JSON.stringify(updated));
        
        setName('');
        setTime('');
        setDosage('');
        toast.success(`Reminder set for ${time}`);
    };

    const deleteReminder = (id) => {
        const updated = reminders.filter(r => r.id !== id);
        setReminders(updated);
        localStorage.setItem('medicine_reminders', JSON.stringify(updated));
    };

    // Calculate Adherence (mock calculation based on number of active vs inactive or total)
    // For a real app, you'd track logs of 'taken' statuses each day.
    const activeCount = reminders.length;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8 min-h-[70vh]">
            <div className="bg-gradient-to-r from-teal-500 to-green-500 p-8 rounded-3xl text-white shadow-lg mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 blur-3xl rounded-full -mt-10 -mr-10"></div>
                <h1 className="text-3xl font-extrabold flex items-center gap-3 relative z-10"><Pill className="w-8 h-8"/> Medicine Reminders</h1>
                <p className="mt-2 text-green-50 font-medium relative z-10">Never miss a dose. Track your daily medication and improve adherence.</p>
                <div className="mt-6 flex flex-wrap gap-4 relative z-10">
                    <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-2 font-semibold">
                       <CalendarCheck className="w-5 h-5" /> {activeCount} Active Reminders
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Form */}
                <div className="md:col-span-1 border border-gray-200 p-6 rounded-2xl shadow-sm bg-white self-start">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-primary"/> Add Medicine</h3>
                    <form onSubmit={addReminder} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Medicine Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Paracetamol" className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Dosage</label>
                            <input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g. 1 Pill (500mg)" className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-600">Time</label>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full mt-1 p-3 border border-gray-300 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
                        </div>
                        <button type="submit" className="mt-2 w-full bg-primary text-white font-bold p-3 rounded-xl hover:bg-primary/90 transition-all shadow-md">Set Reminder</button>
                    </form>
                </div>

                {/* List */}
                <div className="md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Your Schedule</h3>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Info className="w-3 h-3"/> System notifications active</span>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        {reminders.length === 0 ? (
                            <div className="text-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 text-gray-400">
                                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p className="font-semibold">No reminders set.</p>
                                <p className="text-sm">Add a medicine from the panel to start tracking.</p>
                            </div>
                        ) : (
                            reminders.sort((a,b) => a.time.localeCompare(b.time)).map(r => (
                                <div key={r.id} className="bg-white border border-gray-200 p-4 rounded-xl flex items-center justify-between shadow-sm hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full text-primary">
                                            <Pill className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg leading-tight">{r.name}</h4>
                                            <p className="text-sm font-medium text-gray-500 mt-0.5">{r.dosage}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gray-100 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-gray-200">
                                            <Clock className="w-4 h-4 text-primary" />
                                            <span className="font-bold text-gray-700">{r.time}</span>
                                        </div>
                                        <button onClick={() => deleteReminder(r.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicineReminders;
