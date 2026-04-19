import React from 'react'
import { assets, doctors } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, ease: "easeOut" }} 
            viewport={{ once: true, amount: 0.2 }}
            className='relative flex flex-col md:flex-row bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-indigo-900/40 rounded-[2.5rem] px-6 sm:px-10 md:px-14 lg:px-20 my-24 md:mx-10 overflow-hidden z-10'
        >
            {/* Background glowing decorations */}
            <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-primary/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-60 h-60 bg-purple-500/20 blur-3xl rounded-full pointer-events-none"></div>

            {/* ------- Left Side (Content) ------- */}
            <div className='flex-1 py-12 sm:py-16 md:py-24 lg:py-28 z-10'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight'
                >
                    <p>Ready to prioritize</p>
                    <p className='mt-2'>Your Health Journey?</p>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <p className='mt-6 text-white/90 text-sm md:text-base max-w-md leading-relaxed font-light'>
                        Join over <span className='font-semibold text-white'>50,000+ patients</span> who trust SehatSathi. Book appointments with 100+ top-tier verified specialists instantly and hassle-free.
                    </p>
                    
                    <div className='flex gap-4 mt-6 items-center'>
                        <img src={assets.group_profiles} className="w-20 shadow-sm rounded-full" alt="profiles" />
                        <p className="text-sm font-medium text-white/90">Community of Health</p>
                    </div>
                </motion.div>

                <motion.button 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { navigate('/login'); scrollTo(0, 0) }} 
                    className='bg-white text-primary font-semibold text-sm sm:text-base px-10 py-4 text-center rounded-full mt-10 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all cursor-pointer'
                >
                    Create Account Now
                </motion.button>
            </div>

            {/* ------- Right Side (Modern Floating Collage - Female Doctors) ------- */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }} 
                viewport={{ once: true }}
                className='hidden md:flex md:w-1/2 relative flex justify-center items-center h-[350px] md:h-auto py-10 z-10 mt-10 md:mt-0'
            >
                {/* Main Doctor Bubble (Emily Larson) */}
                <motion.img 
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className='w-48 h-48 md:w-64 md:h-64 object-cover object-top rounded-full border-[6px] border-white/30 shadow-2xl absolute z-20 bg-pink-50' 
                    src={doctors[1].image} 
                    alt="Leading Female Doctor" 
                />
                
                {/* Secondary Doctor 1 (Sarah Patel) */}
                <motion.img 
                    animate={{ y: [12, -12, 12] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    className='w-32 h-32 md:w-40 md:h-40 object-cover object-top rounded-full border-4 border-white/30 shadow-xl absolute left-0 md:left-4 top-4 md:top-8 z-10 bg-teal-50' 
                    src={doctors[2].image} 
                    alt="Specialist" 
                />

                {/* Secondary Doctor 2 (Jennifer Garcia) */}
                <motion.img 
                    animate={{ y: [8, -15, 8] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    className='w-28 h-28 md:w-36 md:h-36 object-cover object-top rounded-full border-4 border-white/30 shadow-xl absolute right-2 md:right-8 bottom-6 md:bottom-12 z-30 bg-purple-50' 
                    src={doctors[4].image} 
                    alt="Expert" 
                />
            </motion.div>
        </motion.div>
    )
}

export default Banner