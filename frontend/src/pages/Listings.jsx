import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TenantSearchBar from "../components/TenantSearchBar";
import "../styles/Listings.css";
import listingService from "../services/ListingService";
import "../styles/Comparison.css";
import "../styles/Comparison.css";
// Function to extract clean URLs from the messy backend string
function extractUrls(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return [];
  }
  const urlRegex = /(https?:\/\/[^\s"]+)/g;
  const matches = urlString.match(urlRegex);
  return matches || [];
}

// Function to build tags based on amenities
function buildTags(pg) {
  const tags = [];
  if (pg.wifiAvilable) tags.push("Wi-Fi");
  if (pg.acAvilable) tags.push("A/C");
  if (pg.mealsAvilable) tags.push("Meals");
  if (pg.laudryAvilable) tags.push("Laundry");
  if (pg.cctvAvilable) tags.push("CCTV");
  if (pg.parkingAvilable) tags.push("Parking");
  if (pg.commonAreasAvilable) tags.push("CommonArea");
  if (pg.studyDeskAvilable) tags.push("StudyDesk");
  return tags;
}

// Function to map backend data to a usable UI format
function mapBackendToUI(pg) {
  const imageUrls = extractUrls(pg.urls[0]);
  const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : 'https://via.placeholder.com/300x200?text=No+Image';
  let sharingType = "N/A";
  if (pg.roomDetails && pg.roomDetails.length > 0) {
    const privateRoom = pg.roomDetails.find(room => room.roomType === "private");
    const sharedRoom = pg.roomDetails.find(room => room.roomType === "shared");
    if (privateRoom && sharedRoom) {
      sharingType = "Private & Shared";
    } else if (privateRoom) {
      sharingType = "Private";
    } else if (sharedRoom) {
      sharingType = "Shared";
    }
  }
  return {
    id: pg.id,
    name: pg.title,
    location: pg.address,
    price: pg.rent,
    tags: buildTags(pg),
    sharing: sharingType,
    rating: 4.5,
    availability: "Available",
    occupancy: "N/A",
    gender: pg.gender,
    imageUrl: firstImageUrl,
  };
}

// 🧩 Step 1: Modified ComparisonModal component
const ComparisonModal = ({ listings, onClose, onRemove }) => {
  if (listings.length === 0) return null;

  return (
    <div className="comparison-modal-overlay">
      <div className="comparison-modal-content">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <h2>Compare Listings</h2>
        <div className="comparison-grid">
          {listings.map((pg) => (
            <div className="comparison-card" key={pg.id}>
              <img src={pg.imageUrl} alt={pg.name} className="comparison-card-image" />
              <div className="comparison-card-body">
                <h3>{pg.name}</h3>
                <p><strong>Location:</strong> {pg.location}</p>
                <p><strong>Price:</strong> ₹{pg.price?.toLocaleString() || 'N/A'}/month</p>
                <p><strong>Sharing:</strong> {pg.sharing}</p>
                <p><strong>Gender:</strong> {pg.gender}</p>
                <div className="pg-tags">
                  {pg.tags.map((tag, i) => (
                    <span className="tag" key={i}>{tag}</span>
                  ))}
                </div>
                {/* 👇 New Button to remove PG from comparison */}
                <button
                  className="remove-from-compare-btn"
                  onClick={() => onRemove(pg.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// New Pagination component
const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container">
      {pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={`pagination-button ${currentPage === number ? 'active' : ''}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};


const Listings = () => {
  const navigate = useNavigate();
  const [pgData, setPgData] = useState([]);
  const [filteredPgData, setFilteredPgData] = useState([]);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of listings per page

  useEffect(() => {
    listingService.getAllListings().then(data => {
      const mapped = data.map(mapBackendToUI);
      mapped.reverse();
      setPgData(mapped);
      setFilteredPgData(mapped);
    }).catch(error => {
      console.error("Error fetching listings:", error);
    });
  }, []);

  const handleSearch = (searchParams) => {
    let filtered = [...pgData];
    if (searchParams.location) {
      filtered = filtered.filter(pg => pg.location?.toLowerCase().includes(searchParams.location.toLowerCase()));
    }
    if (searchParams.tenantType) {
      const genderInput = searchParams.tenantType.toLowerCase();
      const acceptableGenders = [];
      if (genderInput === 'male') {
        acceptableGenders.push('male', 'boys');
      } else if (genderInput === 'female') {
        acceptableGenders.push('female', 'girls');
      } else if (genderInput === 'unisex') {
        acceptableGenders.push('coed', 'co-ed', 'unisex', 'others');
      }
      if (acceptableGenders.length > 0) {
        filtered = filtered.filter(pg => {
          const pgGender = pg.gender?.toLowerCase();
          return pgGender && acceptableGenders.includes(pgGender);
        });
      }
    }
    if (searchParams.budget && searchParams.budget.length === 2) {
      const [minBudget, maxBudget] = searchParams.budget;
      filtered = filtered.filter(pg => {
        const pgPrice = typeof pg.price === 'string' ? parseFloat(pg.price) : pg.price;
        return ((!minBudget || pgPrice >= minBudget) && (!maxBudget || pgPrice <= maxBudget));
      });
    }
    setFilteredPgData(filtered);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const handleViewDetails = (pgId) => {
    navigate(`/book-pg/${pgId}`);
  };

  const handleCompareToggle = (pgId) => {
    setSelectedForComparison(prevSelected => {
      if (prevSelected.includes(pgId)) {
        return prevSelected.filter(id => id !== pgId);
      } else {
        if (prevSelected.length >= 3) {
          alert("You can compare a maximum of 3 listings at a time.");
          return prevSelected;
        }
        return [...prevSelected, pgId];
      }
    });
  };

  const listingsToCompare = pgData.filter(pg => selectedForComparison.includes(pg.id));
  
  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPgData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPgData.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: Scroll to top on page change
  };

  return (
    <>
      <div className="browsepgs-container">
        <div className="search-section">
          <h2 className="search-title">Find Your Perfect PG</h2>
          <TenantSearchBar onSearch={handleSearch} />
        </div>
        <h1>Available PGs</h1>
        <p>{filteredPgData.length} properties found</p>
        <div className="pg-grid">
          {filteredPgData.length === 0 && pgData.length > 0 ? (
            <p>No properties found matching your criteria. Try adjusting your filters.</p>
          ) : filteredPgData.length === 0 && pgData.length === 0 ? (
            <p>Loading properties or no properties available...</p>
          ) : (
            currentItems.map((pg, index) => (
              <div className="pg-card" key={pg.id || index}>
              <div className="pg-card-image-container">
                  <img src={pg.imageUrl} alt={pg.name} className="pg-card-image" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}/>
                </div>
                <div className="pg-card-content">
                  <h2>{pg.name}</h2>
                  <p className="location">{pg.location}</p>
                  <p className="price">₹{pg.price?.toLocaleString() || 'N/A'}/month</p>
                  <p>Sharing:{pg.sharing}</p>
                  <p className="availability">Availability:{pg.availability}</p>
                  <div className="pg-tags">
                    {pg.tags.map((tag, i) => (<span className={`tag ${tag.toLowerCase().replace(/\s/g, "-")}`} key={i}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="pg-card-actions">
                  <button className="details-btn" onClick={() => handleViewDetails(pg.id)}>View Details</button>
                  <button className={`compare-btn${selectedForComparison.includes(pg.id) ? 'selected' : ''}`} onClick={() => handleCompareToggle(pg.id)}>
                    {selectedForComparison.includes(pg.id) ? 'Remove' : 'Compare'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        )}
      </div>
      {selectedForComparison.length >= 2 && (
        <button className="floating-compare-button" onClick={() => setShowComparisonModal(true)}>
          Compare ({selectedForComparison.length})
        </button>
      )}
      {/* 🧩 Step 2: Updated how ComparisonModal is used */}
      {showComparisonModal && (
        <ComparisonModal
          listings={listingsToCompare}
          onClose={() => setShowComparisonModal(false)}
          onRemove={handleCompareToggle}
        />
      )}
    </>
  );
};

export default Listings;