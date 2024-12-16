{/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Add Add Environmental Report</h2>
        <button 
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <span className="text-xl">×</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Pollutant */}
          <div>
            <label className="block mb-1">
              Pollutant <span className="text-red-500">*</span>
            </label>
            <select
              name="pollutantId"
              value={formData.pollutantId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-amber-500"
              required
            >
              <option value="">Select Pollutant</option>
              {pollutants.map((pollutant) => (
                <option key={pollutant.id} value={pollutant.id}>
                  {pollutant.name} ({pollutant.unit})
                </option>
              ))}
            </select>
          </div>

          {/* Monitoring Station */}
          <div>
            <label className="block mb-1">
              Monitoring Station <span className="text-red-500">*</span>
            </label>
            <select
              name="stationId"
              value={formData.stationId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-amber-500"
              required
            >
              <option value="">Select Monitoring Station</option>
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.stationName} - {station.location}
                </option>
              ))}
            </select>
          </div>

          {/* Measured Value */}
          <div>
            <label className="block mb-1">
              Measured Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="measuredValue"
              value={formData.measuredValue}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-amber-500"
              step="0.01"
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-600 bg-gray-50 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}