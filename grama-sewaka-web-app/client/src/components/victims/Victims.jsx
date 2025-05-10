import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { MapPin, CalendarDays, Home } from "lucide-react"

import FloodHouse from "@/assets/images/flood-house.jpg"

const victimData = [
  {
    name: "John Doe",
    homeId: "H1234",
    date: "2025-05-01",
    title: "Flood Victim",
    image: FloodHouse,
    location: "Colombo, Sri Lanka",
    flag: "/sri-lanka-flag.png",
  },
  {
    name: "Jane Smith",
    homeId: "H5678",
    date: "2025-05-03",
    title: "Fire Survivor",
    image: FloodHouse,
    location: "Kandy, Sri Lanka",
    flag: "/sri-lanka-flag.png",
  },
    {
    name: "Kamal Perera",
    homeId: "H9101",
    date: "2025-05-02",
    title: "Earthquake Victim",
    image: FloodHouse,
    location: "Galle, Sri Lanka",
    flag: "/sri-lanka-flag.png",
    },
    {
    name: "Anjali Kumari",
    homeId: "H1121",
    date: "2025-05-04",
    title: "Flood Victim",
    image: FloodHouse,
    location: "Matara, Sri Lanka",
    flag: "/sri-lanka-flag.png",
    },
        {
    name: "Nimal Perera",
    homeId: "H3141",
    date: "2025-05-01",
    title: "Flood Victim",
    image: FloodHouse,
    location: "Galle, Sri Lanka",
    flag: "/sri-lanka-flag.png",
    },
    {
    name: "Sunethra Silva",
    homeId: "H5161",
    date: "2025-05-03",
    title: "Fire Survivor",
    image: FloodHouse,
    location: "Matara, Sri Lanka",
    flag: "/sri-lanka-flag.png",
    },
    {
    name: "Kamal Fernando",
    homeId: "H7181",
    date: "2025-05-02",
    title: "Earthquake Victim",
    image: FloodHouse,
    location: "Colombo, Sri Lanka",
    flag: "/sri-lanka-flag.png",
    },
    {
    name: "Anjali Kumari",
    homeId: "H9202",
    date: "2025-05-04",
    title: "Flood Victim",
    image: FloodHouse,
    location: "Kandy, Sri Lanka",
    flag: "/sri-lanka-flag.png",
    },
]

export default function VictimCardSlider() {
    return (
        <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {victimData.map((victim, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <img
                  src={victim.image}
                  alt={victim.name}
                  className="w-full h-40 object-cover rounded-t-2xl"
                />
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-bold mb-1">{victim.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{victim.title}</p>
    
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <MapPin size={16} /> <span>{victim.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <CalendarDays size={16} /> <span>{victim.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                    <Home size={16} /> <span>Home ID: {victim.homeId}</span>
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
}
