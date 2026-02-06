import React, { useState } from 'react';

function EditProfile({ user, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        location: user.location || '',
        photo: user.photo || '',
        bio: Array.isArray(user.bio) ? user.bio : []
    });

    const [bioInput, setBioInput] = useState('');
    const [bioError, setBioError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleBioInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 15) {
            setBioInput(value);
            setBioError('');
        } else {
            setBioError('Max 15 characters per keyword');
        }
    };

    const handleAddBioKeyword = (e) => {
        e.preventDefault();
        const trimmedInput = bioInput.trim();
        
        if (!trimmedInput) {
            setBioError('Please enter a keyword');
            return;
        }

        if (formData.bio.length >= 6) {
            setBioError('Maximum 6 keywords allowed');
            return;
        }

        if (trimmedInput.length > 15) {
            setBioError('Max 15 characters per keyword');
            return;
        }

        if (formData.bio.includes(trimmedInput)) {
            setBioError('Keyword already added');
            return;
        }

        setFormData({
            ...formData,
            bio: [...formData.bio, trimmedInput]
        });
        setBioInput('');
        setBioError('');
    };

    const handleRemoveBioKeyword = (indexToRemove) => {
        setFormData({
            ...formData,
            bio: formData.bio.filter((_, index) => index !== indexToRemove)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving profile data:', formData); // Debug log
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-pink-500/30 p-8 rounded-3xl w-11/12 md:w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl">
                <h2 className="text-3xl font-bold text-white mb-6">Edit Profile</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-pink-500/30 rounded-xl text-white focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-pink-500/30 rounded-xl text-white focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">Photo URL</label>
                        <input
                            type="text"
                            name="photo"
                            value={formData.photo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-pink-500/30 rounded-xl text-white focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-300 font-semibold mb-2">
                            Bio Keywords ({formData.bio.length}/6)
                        </label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={bioInput}
                                onChange={handleBioInputChange}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddBioKeyword(e);
                                    }
                                }}
                                placeholder="Add keyword (max 15 chars)"
                                className="flex-1 px-4 py-3 bg-gray-900/50 border border-pink-500/30 rounded-xl text-white focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
                                maxLength={15}
                            />
                            <button
                                type="button"
                                onClick={handleAddBioKeyword}
                                disabled={formData.bio.length >= 6}
                                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transform hover:scale-105 disabled:transform-none transition-all duration-300"
                            >
                                Add
                            </button>
                        </div>
                        
                        {bioError && (
                            <p className="text-red-400 text-sm mb-2">{bioError}</p>
                        )}
                        
                        <p className="text-gray-400 text-sm mb-3">
                            Press Enter or click Add to add a keyword. Max 15 characters per keyword, 6 keywords total.
                        </p>

                        {formData.bio.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-4 bg-gray-900/30 border border-pink-500/20 rounded-xl">
                                {formData.bio.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/40 text-pink-300 text-sm font-medium rounded-full backdrop-blur-sm group hover:from-pink-500/30 hover:to-rose-500/30 transition-all duration-300"
                                    >
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                        </svg>
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveBioKeyword(index)}
                                            className="ml-1 text-pink-400 hover:text-pink-200 transition-colors duration-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-pink-500/50 transform hover:scale-105 transition-all duration-300"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
