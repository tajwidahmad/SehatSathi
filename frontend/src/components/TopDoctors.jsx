import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'

const TopDoctors = () => {

    const navigate = useNavigate()

    const { doctors } = useContext(AppContext)

    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }} 
            viewport={{ once: true, amount: 0.1 }}
            className='flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10'
        >
            <h1 className='text-3xl font-medium'>Top Doctors to Book</h1>
            <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }} 
                        viewport={{ once: true, amount: 0.1 }}
                        onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                        className='border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 group' 
                        key={index}
                    >
                        <img className='bg-[#EAEFFF] group-hover:bg-primary group-hover:scale-105 transition-all duration-500' src={item.image} alt="" />
                        <div className='p-4'>
                            <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : "text-gray-500"}`}>
                                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : "bg-gray-500"}`}></p><p>{item.available ? 'Available' : "Not Available"}</p>
                            </div>
                            <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                            <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className='bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10'>more</button>
        </motion.div>

    )
}

export default TopDoctors