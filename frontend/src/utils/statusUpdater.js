export const updateFacilityStatus = async (facilityId, newStatus, setFacilities) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/facilities/${facilityId}/updateStatus`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      setFacilities((prevFacilities) =>
        prevFacilities.map((facility) =>
          facility._id === facilityId ? { ...facility, status: newStatus } : facility
        )
      );
      console.log(`Facility status updated to ${newStatus}`);
    } else {
      console.error("Failed to update facility status");
    }
  } catch (error) {
    console.error("Error updating facility status:", error);
  }
};
