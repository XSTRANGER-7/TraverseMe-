import React from "react";

const trips = [
  { title: "Mountain Escape", img: "/images/mountain.jpg" },
  { title: "Beach Getaway", img: "/images/beach.jpg" },
  { title: "City Nights", img: "/images/city.jpg" },
];

const Trips = () => {
  return (
    <div className="p-10 bg-lightDark">
      <h2 className="text-4xl font-bold text-center text-primary mb-8">
        Discover Your Adventure
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trips.map((trip, index) => (
          <div
            key={index}
            className="bg-dark rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={trip.img}
              alt={trip.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold">{trip.title}</h3>
              <button className="mt-4 px-4 py-2 bg-primary rounded-lg">
                Explore
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;
