'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
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

    const { data: members = [], isLoading, isError } = useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const res = await apiClient.get('/auth/team')
            console.log(res.data.team);
            return res.data.team
        }
    })

    if (isLoading) {
        return (
            <section className="py-20  text-center text-white">
                <p className="text-xl">Loading team members...</p>
            </section>
        )
    }

    if (isError) {
        return (
            <section className="py-20 text-center text-red-500">
                <p>Failed to load team members.</p>
            </section>
        )
    }

    return (
        <section className="py-20 text-white">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Title */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl text-black font-bold mb-4">Our Team</h2>
                    <p className="text-black max-w-2xl mx-auto">
                        Meet our professional team dedicated to delivering the best travel experience.
                    </p>
                </div>

                {/* Team Grid */}
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"> */}

                    <div className="flex flex-row flex-wrap justify-center gap-12 p-12 bg-gray-50">
                        {members.map((member: TeamMember) => {
                            return (
                                <div className="group flex flex-col items-center text-center cursor-pointer" key={member._id}
                                >
                                    <div className="relative w-72 h-72 mb-4">
                                        <img
                                            src={member.images
                                                ? `http://147.93.126.15${member.images[0]}`
                                                : '/default-profile.png'} alt={member.name}
                                            className="w-full h-full object-cover m-2 rounded-full"
                                        />
                                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 transform transition-all duration-300 group-hover:-translate-y-1 group-hover:text-blue-600">{member.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1  transform translate-y-2 transition-all duration-300 ">
                                        {member.roleInTeam}
                                    </p>
                                </div>
                            )
                        })}
                      
                    </div>

                {/* </div> */}

                {members.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                        No team members available.
                    </div>
                )}

            </div>
        </section>
    )
}

export default OurTeam