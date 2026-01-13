import React, { useState } from 'react';

function EditProfile({ user, onSave, onCancel }) {
    const [name, setName] = useState(user.name || '');
    const [location, setLocation] = useState(user.location || '');
    // const [bio, setBio] = useState(user.bio || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedUser = { ...user, name, location };
        onSave(updatedUser);
    };

    return (
       <div className=' h-screen absolute flex justify-center items-center'>
         <form onSubmit={handleSubmit} className="border-2 bg-dark rounded-xl absolute  p-10 flex flex-col justify-center items-center">
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border bg-black border-gray-300 rounded p-2 mb-2"
                placeholder="Name"
                required
            />
            <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border bg-black border-gray-300 rounded p-2 mb-2"
                placeholder="Location"
                required
            />
            {/* <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-2"
                placeholder="Bio"
                required
            /> */}
            <div className="flex justify-between gap-6 mt-6">
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                <button type="button" onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
        </form>
       </div>
    );
}

export default EditProfile;
