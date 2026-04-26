// 'use client'

// import React from 'react'
// import { useQuery } from '@tanstack/react-query'
// import apiClient from '@/lib/api'
// interface TeamMember {
//     _id: string
//     name: string
//     role: string
//     roleInTeam: string
//     number?: string
//     images?: string[]
//     video?: string
// }

// const OurTeam = () => {

//     const { data: members = [], isLoading, isError } = useQuery({
//         queryKey: ['team'],
//         queryFn: async () => {
//             const res = await apiClient.get('/auth/team')
//             // console.log(res.data.team);
//             return res.data.team
//         }
//     })

//     if (isLoading) {
//         return (
//             <section className="py-20  text-center text-white">
//                 <p className="text-xl">Loading team members...</p>
//             </section>
//         )
//     }

//     if (isError) {
//         return (
//             <section className="py-20 text-center text-red-500">
//                 <p>Failed to load team members.</p>
//             </section>
//         )
//     }

//     return (
//         <section className="py-20 text-white">
//             <div className="max-w-7xl mx-auto px-6">

//                 {/* Section Title */}
//                 <div className="text-center mb-16">
//                     <h2 className="text-4xl text-black font-bold mb-4">Our Team</h2>
//                     <p className="text-black max-w-2xl mx-auto">
//                         Meet our professional team dedicated to delivering the best travel experience.
//                     </p>
//                 </div>

//                 {/* Team Grid */}
//                 {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"> */}

//                     <div className="flex flex-row flex-wrap justify-center gap-12 p-12 bg-gray-50">
//                         {members.map((member: TeamMember) => {
//                             return (
//                                 <div className="group flex flex-col items-center text-center cursor-pointer" key={member._id}
//                                 >
//                                     <div className="relative w-72 h-72 mb-4">
//                                         <img
//                                             src={member.images
//                                                 ? `${member.images[0]}`
//                                                 : '/default-profile.png'} alt={member.name}
//                                             className="w-full h-full object-cover m-2 rounded-full"
//                                         />
//                                         <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
//                                     </div>
//                                     <h3 className="text-xl font-semibold text-gray-800 transform transition-all duration-300 group-hover:-translate-y-1 group-hover:text-blue-600">{member.name}</h3>
//                                     <p className="text-sm text-gray-500 mt-1  transform translate-y-2 transition-all duration-300 ">
//                                         {member.roleInTeam}
//                                     </p>
//                                 </div>
//                             )
//                         })}
                      
//                     </div>

//                 {/* </div> */}

//                 {members.length === 0 && (
//                     <div className="text-center text-gray-400 mt-12">
//                         No team members available.
//                     </div>
//                 )}

//             </div>
//         </section>
//     )
// }

// export default OurTeam



'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import apiClient from '@/lib/api'

interface TeamMember {
    _id: string
    name: string
    role: string
    roleInTeam: string
    number?: string
    images?: string[]
    video?: string
}

const OurTeam = () => {
    const [hoveredId, setHoveredId] = useState<string | null>(null)

    const { data: members = [], isLoading, isError } = useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const res = await apiClient.get('/auth/team')
            console.log(res.data.team);
            return res.data.team
        }
    })

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] as const
            }
        }
    }

    if (isLoading) {
        return (
            <section className="py-24 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                        <p className="text-lg text-slate-500 font-medium">Loading team members...</p>
                    </motion.div>
                </div>
            </section>
        )
    }

    if (isError) {
        return (
            <section className="py-24 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto"
                    >
                        <p className="text-red-600 font-medium">Failed to load team members.</p>
                    </motion.div>
                </div>
            </section>
        )
    }

    return (
        <section className="relative py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-100/15 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-6">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    {/* <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
                        The People Behind
                    </span> */}
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                        Our Team
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto rounded-full mb-6" />
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Meet our professional team dedicated to delivering the best travel experience
                    </p>
                </motion.div>

                {/* Team Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="flex flex-row flex-wrap justify-center gap-8 lg:gap-12"
                >
                    {members.map((member: TeamMember) => {
                        const isHovered = hoveredId === member._id

                        return (
                            <motion.div
                                key={member._id}
                                variants={itemVariants}
                                className="group relative"
                                onMouseEnter={() => setHoveredId(member._id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className="relative flex flex-col items-center text-center p-6 rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/40 hover:border-blue-100 transition-all duration-500">
                                    {/* Image Container */}
                                    <div className="relative w-64 h-64 mb-6">
                                        {/* Animated ring */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full"
                                            animate={{
                                                boxShadow: isHovered
                                                    ? '0 0 0 4px rgba(71, 66, 143, 1), 0 0 0 8px rgba(71, 66, 143, .1)'
                                                    : '0 0 0 0px rgba(71, 66, 143, 0)'
                                            }}
                                            transition={{ duration: 0.4 }}
                                        />

                                        <div className="relative w-full h-full overflow-hidden rounded-full">
                                            <motion.img
                                                src={member.images ? `${member.images[0]}` : '/default-profile.png'}
                                                alt={member.name}
                                                className="w-full h-full object-cover"
                                                animate={{
                                                    scale: isHovered ? 1.08 : 1
                                                }}
                                                transition={{ duration: 0.5, ease: "easeOut" }}
                                            />

                                            {/* Overlay gradient on hover */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-t from-blue-600/60 via-transparent to-transparent"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: isHovered ? 1 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            />

                                            {/* Contact number reveal */}
                                            <AnimatePresence>
                                                {/* {isHovered && member.number && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="absolute bottom-4 left-0 right-0 text-center"
                                                    >
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-slate-700 shadow-sm">
                                                            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            {member.number}
                                                        </span>
                                                    </motion.div>
                                                )} */}
                                            </AnimatePresence>
                                        </div>

                                        {/* Decorative dots */}
                                        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="absolute -bottom-1 -left-3 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300">
                                            {member.name}
                                        </h3>
                                        <div className="w-8 h-0.5 bg-slate-200 mx-auto group-hover:w-16 group-hover:bg-red-400 transition-all duration-500" />
                                        <p className="text-sm font-medium text-blue-900 transition-colors duration-300 uppercase tracking-wide">
                                            {member.roleInTeam}
                                        </p>
                                    </div>

                                    {/* Hover indicator line */}
                                    <motion.div
                                        className="absolute bottom-0 left-6 right-6 h-1 bg-gradient-to-r from-blue-900 to-blue-600 rounded-full"
                                        initial={{ scaleX: 0, opacity: 0 }}
                                        animate={{
                                            scaleX: isHovered ? 1 : 0,
                                            opacity: isHovered ? 1 : 0
                                        }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>
                        )
                    })}
                </motion.div>

                {members.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-slate-400 mt-12 py-12"
                    >
                        <p className="text-lg">No team members available.</p>
                    </motion.div>
                )}
            </div>
        </section>
    )
}

export default OurTeam