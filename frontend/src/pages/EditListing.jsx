import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaWifi, FaSnowflake, FaUtensils, FaTshirt, FaVideo, FaCar, FaUsers, FaGraduationCap, FaUpload, FaCheck, FaPlus, FaTimes, FaArrowLeft } from 'react-icons/fa';
import '../styles/CreateListing.css'; // Assuming shared styles
import api from '../services/ApiService';
import axios from 'axios'; // Import axios for Cloudinary upload

const EditListing = () => {
    const { listingId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        pgName: '',
        description: '',
        address: '',
        city: '',
        locality: '',
        gender: 'co-ed',
        amenities: [],
        deposite: '',
        bookingFee: '',
        success:false,
        error:false,
        discount: ''
    });

    const [roomDetails, setRoomDetails] = useState([]); // Array to store {roomType, bedsPerRoom, roomCount, price} objects
    const [newRoomType, setNewRoomType] = useState('private');
    const [newBedsPerRoom, setNewBedsPerRoom] = useState(1);
    const [newRoomCount, setNewRoomCount] = useState(1);
    const [newRoomPrice, setNewRoomPrice] = useState('');
    const [photos, setPhotos] = useState([]); // Store actual File objects for upload
    const [existingImageUrls, setExistingImageUrls] = useState([]); // Store existing image URLs
    const fileInputRef = useRef(null);

    // --- Cloudinary Configuration ---
    const CLOUD_NAME = 'dqzdhaxkv';
    const UPLOAD_PRESET = 'Staynest';

    const amenitiesList = [
        { id: 'wifi', name: 'WiFi', icon: <FaWifi /> },
        { id: 'ac', name: 'AC', icon: <FaSnowflake /> },
        { id: 'meals', name: 'Meals', icon: <FaUtensils /> },
        { id: 'laundry', name: 'Laundry', icon: <FaTshirt /> },
        { id: 'cctv', name: 'CCTV', icon: <FaVideo /> },
        { id: 'parking', name: 'Parking', icon: <FaCar /> },
        { id: 'commonArea', name: 'Common Area', icon: <FaUsers /> },
        { id: 'studyDesk', name: 'Study Desk', icon: <FaGraduationCap /> }
    ];

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await api.get(`/listing/${listingId}`);
                const data = res.data;

                // Map backend amenity names to frontend IDs
                const fetchedAmenities = [];
                if (data.wifiAvilable) fetchedAmenities.push('wifi');
                if (data.acAvilable) fetchedAmenities.push('ac');
                if (data.mealsAvilable) fetchedAmenities.push('meals');
                if (data.laundryAvilable) fetchedAmenities.push('laundry');
                if (data.cctvAvilable) fetchedAmenities.push('cctv');
                if (data.parkingAvilable) fetchedAmenities.push('parking');
                if (data.commonAreasAvilable) fetchedAmenities.push('commonArea');
                if (data.studyDeskAvilable) fetchedAmenities.push('studyDesk');

                setFormData({
                    pgName: data.title || '',
                    description: data.description || '',
                    address: data.address || '',
                    city: data.city || '',
                    locality: data.locality || '',
                    gender: data.gender || 'co-ed',
                    amenities: fetchedAmenities,
                    deposite: data.deposite || '',
                    bookingFee: data.bookingFee || '',
                    discount: data.discount || '0',
                    success: false, // Resetting success/error on fetch
                    error: false
                });

                // Set room details
                setRoomDetails(data.roomDetails || []);
                setExistingImageUrls(data.urls || []); // Set existing image URLs
            } catch (err) {
                console.error('Error fetching listing:', err);
                setFormData(prev => ({ ...prev, error: true })); // Indicate error
                alert('Failed to fetch listing. Please try again.');
            }
        };
        fetchListing();
    }, [listingId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value, success: false, error: false })); // Reset status on input change
    };

    const handleAmenityChange = (amenityId) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenityId)
                ? prev.amenities.filter(id => id !== amenityId)
                : [...prev.amenities, amenityId],
            success: false, // Reset status on amenity change
            error: false
        }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(files);
        setFormData(prev => ({ ...prev, success: false, error: false })); // Reset status on photo change
    };

    const handleRemoveExistingPhoto = (urlToRemove) => {
        setExistingImageUrls(prev => prev.filter(url => url !== urlToRemove));
        setFormData(prev => ({ ...prev, success: false, error: false })); // Reset status on photo removal
    };

    // --- New functions for room details management ---
    const handleAddNewRoomType = () => {
        if (!newRoomType || newRoomCount <= 0 || newRoomPrice === '' || newRoomPrice <= 0) {
            alert('Please fill all room type details correctly.');
            return;
        }

        if (newRoomType === 'shared' && newBedsPerRoom <= 1) {
            alert('Shared rooms must have at least 2 beds per room.');
            return;
        }

        if (newRoomType === 'private' && roomDetails.some(room => room.roomType === 'private')) {
            alert('A private room configuration already exists. You can only have one private room entry.');
            return;
        }

        if (newRoomType === 'shared' && roomDetails.some(room => room.roomType === 'shared' && room.bedsPerRoom === parseInt(newBedsPerRoom))) {
            alert(`A shared room configuration with ${newBedsPerRoom} beds per room already exists. Please select a different bed count or remove the existing one.`);
            return;
        }

        setRoomDetails(prev => [
            ...prev,
            {
                roomType: newRoomType,
                bedsPerRoom: newRoomType === 'private' ? 1 : parseInt(newBedsPerRoom),
                roomCount: parseInt(newRoomCount),
                price: parseFloat(newRoomPrice)
            }
        ]);

        // Reset new room input fields, ensure private default is 1 bed
        // Ensure that if 'private' is already added, it's not an option for newRoomType, unless no other options exist.
        const nextNewRoomType = availableRoomTypes.filter(type => !roomDetails.some(room => room.roomType === type))[0] || 'private';
        setNewRoomType(nextNewRoomType);
        setNewBedsPerRoom(nextNewRoomType === 'private' ? 1 : 2); // Default to 2 for shared, 1 for private
        setNewRoomCount(1);
        setNewRoomPrice('');
        setFormData(prev => ({ ...prev, success: false, error: false })); // Reset status
    };

    const handleRemoveRoomType = (indexToRemove) => {
        setRoomDetails(prev => prev.filter((_, index) => index !== indexToRemove));
        setFormData(prev => ({ ...prev, success: false, error: false })); // Reset status
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (roomDetails.length === 0) {
            alert('Please add at least one room type configuration.');
            return;
        }

        let uploadedImageUrls = [...existingImageUrls]; // Start with existing URLs

        // 1. Upload new images to Cloudinary
        if (photos.length > 0) {
            try {
                for (const photo of photos) {
                    const cloudinaryData = new FormData();
                    cloudinaryData.append('file', photo);
                    cloudinaryData.append('upload_preset', UPLOAD_PRESET);
                    const res = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, cloudinaryData);
                    uploadedImageUrls.push(res.data.secure_url);
                }
            } catch (cloudinaryError) {
                console.error('Error uploading image to Cloudinary:', cloudinaryError);
                setFormData(prev => ({ ...prev, error: true }));
                alert('Failed to upload new images. Please check your upload preset and try again.');
                return;
            }
        }

        // 2. Build payload for backend
        const updatedListing = {
            id: listingId, // Ensure the ID is part of the payload
            title: formData.pgName,
            address: formData.address,
            city: formData.city,
            locality: formData.locality,
            gender: formData.gender,
            acAvilable: formData.amenities.includes('ac'),
            wifiAvilable: formData.amenities.includes('wifi'),
            mealsAvilable: formData.amenities.includes('meals'),
            laundryAvilable: formData.amenities.includes('laundry'),
            cctvAvilable: formData.amenities.includes('cctv'),
            parkingAvilable: formData.amenities.includes('parking'),
            commonAreasAvilable: formData.amenities.includes('commonArea'),
            studyDeskAvilable: formData.amenities.includes('studyDesk'),
            deposite: parseFloat(formData.deposite),
            discount: parseFloat(formData.discount),
            urls: uploadedImageUrls, // Send all image URLs (existing + new)
            description: formData.description,
            // Assuming startDate and endDate are not editable from this form
            // You might want to fetch and include existing ones or handle their updates
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0, 10),
            bookingFee: parseFloat(formData.bookingFee),
            roomDetails: roomDetails // <--- IMPORTANT: Send the array of room details
        };

        // Set the general rent field to the lowest price among the defined room types if available.
        if (roomDetails.length > 0) {
            updatedListing.rent = Math.min(...roomDetails.map(room => room.price));
        } else {
            updatedListing.rent = 0; // Or handle this case as an error if no room details are added
        }

        // 3. Send updated listing to backend
        try {
           // console.log('Submitting updated listing:', updatedListing);
            // Assuming the PUT endpoint takes the ID in the URL path
            await api.put(`/listing/update`, updatedListing);
            
            setFormData(prev => ({ ...prev, success: true, error: false }));
            alert('Listing updated successfully!');
            navigate('/owner/dashboard');
        } catch (err) {
            console.error('Error updating listing:', err);
            setFormData(prev => ({ ...prev, error: true, success: false })); // Indicate error
            if (err.response) {
                console.error('Server Error Data:', err.response.data);
                console.error('Server Error Status:', err.response.status);
                alert(`Failed to update listing: ${err.response.data.message || 'Server error'}`);
            } else {
                alert('Failed to update listing. Please try again.');
            }
        }
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    // Determine which room types are still available to be added
    const availableRoomTypes = [];
    if (!roomDetails.some(room => room.roomType === 'private')) {
        availableRoomTypes.push('private');
    }
    // Always allow 'shared' unless a shared room with bedsPerRoom is already added (handled by validation in handleAddNewRoomType)
    availableRoomTypes.push('shared');

    // Special logic for the room type dropdown options
    const roomTypeOptions = availableRoomTypes.map(type => ({ value: type, label: type.charAt(0).toUpperCase() + type.slice(1) }));

    const handleBack = () => {
        navigate('/owner/dashboard');
    };

    return (
        <div className="create-listing-container">
            <div className="form-container">
                <div className="edit-header">
                    <button className="back-btn" onClick={handleBack}>
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                    <h1 className="edit-title">Edit Listing</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* PG Details */}
                    <section className="form-section">
                        <h2>PG Details</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>PG/Hostel Name</label>
                                <input type="text" name="pgName" value={formData.pgName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Short Description</label>
                                <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" required />
                            </div>
                            <div className="form-group full-width">
                                <label>Complete Address</label>
                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label>Locality</label>
                                <input type="text" name="locality" value={formData.locality} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group full-width">
                                <label>Gender Selection</label>
                                <div className="radio-group">
                                    {['boys', 'girls', 'co-ed'].map(option => (
                                        <label key={option} className="radio-option">
                                            <input type="radio" name="gender" value={option} checked={formData.gender === option} onChange={handleInputChange} />
                                            <span className="radio-custom"></span>{option.charAt(0).toUpperCase() + option.slice(1)}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    ---

                    {/* Room Details (New Section) */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>Room Configurations</h2>
                        </div>
                        <div className="room-config-adder">
                            <div className="form-grid room-input-grid">
                                <div className="form-group">
                                    <label>Room Type</label>
                                    <select
                                        value={newRoomType}
                                        onChange={(e) => {
                                            setNewRoomType(e.target.value);
                                            if (e.target.value === 'private') {
                                                setNewBedsPerRoom(1);
                                            } else {
                                                setNewBedsPerRoom(prev => prev < 2 ? 2 : prev);
                                            }
                                        }}
                                    >
                                        {roomTypeOptions.length === 0 ? (
                                            <option value="">All room types added</option>
                                        ) : (
                                            roomTypeOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Beds per Room</label>
                                    <input
                                        type="number"
                                        value={newBedsPerRoom}
                                        onChange={(e) => setNewBedsPerRoom(parseInt(e.target.value) || 0)}
                                        min={newRoomType === 'private' ? "1" : "2"}
                                        readOnly={newRoomType === 'private'} // This is the fix for readOnly
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Number of Rooms</label>
                                    <input type="number" value={newRoomCount} onChange={(e) => setNewRoomCount(parseInt(e.target.value) || 0)} min="1" />
                                </div>
                                <div className="form-group">
                                    <label>Price per Bed (₹)</label>
                                    <input type="number" value={newRoomPrice} onChange={(e) => setNewRoomPrice(e.target.value)} min="0" required />
                                </div>
                            </div>
                            <button type="button" className="add-room-btn" onClick={handleAddNewRoomType} disabled={false}>
                                <FaPlus /> Add Room Type
                            </button>
                        </div>
                        {roomDetails.length > 0 && (
                            <div className="added-room-types">
                                <h3>Added Room Configurations:</h3>
                                <div className="room-details-table">
                                    <div className="table-header">
                                        <span>Type</span>
                                        <span>Beds/Room</span>
                                        <span>No. of Rooms</span>
                                        <span>Price/Bed (₹)</span>
                                        <span>Actions</span>
                                    </div>
                                    {roomDetails.map((room, index) => (
                                        <div key={index} className="table-row">
                                            <span>{room.roomType.charAt(0).toUpperCase() + room.roomType.slice(1)}</span>
                                            <span>{room.bedsPerRoom}</span>
                                            <span>{room.roomCount}</span>
                                            <span>{room.price.toLocaleString()}</span>
                                            <button type="button" className="remove-room-btn" onClick={() => handleRemoveRoomType(index)}>
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>

                    ---

                    {/* Amenities */}
                    <section className="form-section">
                        <div className="section-header">
                            <h2>Amenities</h2>
                        </div>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Select Amenities</label>
                                <div className="amenities-grid">
                                    {amenitiesList.map(amenity => (
                                        <label key={amenity.id} className="amenity-checkbox">
                                            <input type="checkbox" checked={formData.amenities.includes(amenity.id)} onChange={() => handleAmenityChange(amenity.id)} />
                                            <span className="checkbox-custom">
                                                {amenity.icon}
                                                <span className="amenity-name">{amenity.name}</span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    ---

                    {/* Upload Photos */}
                    <section className="form-section">
                        <h2>Update Photos</h2>
                        <div className="upload-area">
                            <div className="upload-box" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                                <FaUpload className="upload-icon" />
                                <h3>Drag & Drop New Photos Here</h3>
                                <p>or click to browse files</p>
                                <p className="upload-hint">Recommended: 1200x800px, JPG/PNG format</p>
                                <button type="button" className="upload-btn" onClick={handleUploadClick}>Upload Photos</button>
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" multiple onChange={handlePhotoChange} />
                            </div>
                            {photos.length > 0 && (
                                <div className="file-upload-summary">
                                    <p>Selected {photos.length} new file(s):</p>
                                    <ul>
                                        {photos.map((file, idx) => (
                                            <li key={idx}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {existingImageUrls.length > 0 && (
                                <div className="existing-photos-summary">
                                    <p>Existing Photos:</p>
                                    <div className="existing-photo-grid">
                                        {existingImageUrls.map((url, idx) => (
                                            <div key={idx} className="existing-photo-item">
                                                <img src={url} alt={`Existing Photo ${idx}`} />
                                                <button type="button" className="remove-existing-photo-btn" onClick={() => handleRemoveExistingPhoto(url)}>
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    ---

                    {/* Pricing */}
                    <section className="form-section">
                        <h2>Additional Pricing Details</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Security Deposit (₹)</label>
                                <input type="number" name="deposite" value={formData.deposite} onChange={handleInputChange} min="0" />
                            </div>
                            <div className="form-group">
                                <label>Booking Fee (₹)</label>
                                <input type="number" name="bookingFee" value={formData.bookingFee} onChange={handleInputChange} min="0" />
                            </div>
                            <div className="form-group">
                                <label>Optional Discount (%)</label>
                                <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} min="0" max="100" />
                            </div>
                        </div>
                    </section>

                    ---

                    {/* Submit */}
                    <section className="submit-section">
                        <button type="submit" className="submit-btn">
                            <FaCheck /> Update Listing
                        </button>
                        <p className="submit-hint">Changes will be reflected immediately on your dashboard.</p>
                        {formData.success && <p className="success-message">Listing updated successfully!</p>}
                        {formData.error && <p className="error-message">Failed to update listing. Please try again.</p>}
                    </section>
                </form>
            </div>
        </div>
    );
};

export default EditListing;