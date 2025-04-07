import React from "react";
import { Trash2 } from "lucide-react";

const NewElectionModal = ({ formData, setFormData, onClose, onSubmit }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const addPosition = () => {
    setFormData((prev) => ({
      ...prev,
      positions: [...prev.positions, { name: "", candidates: [] }],
    }));
  };

  const handlePositionChange = (index, value) => {
    const updatedPositions = [...formData.positions];
    updatedPositions[index].name = value;
    setFormData((prev) => ({
      ...prev,
      positions: updatedPositions,
    }));
  };

  const removePosition = (index) => {
    const updatedPositions = formData.positions.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      positions: updatedPositions,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          {formData._id ? "Edit Election" : "Create New Election"}
        </h3>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-300"
            >
              Election Name
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-300"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-300"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">
                Positions
              </label>
              <button
                type="button"
                onClick={addPosition}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                + Add Position
              </button>
            </div>
            <div className="mt-2 space-y-3">
              {formData.positions.map((position, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={position.name}
                    onChange={(e) =>
                      handlePositionChange(index, e.target.value)
                    }
                    placeholder="Position name"
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removePosition(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {formData._id ? "Update Election" : "Create Election"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewElectionModal;
