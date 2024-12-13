import { useState } from 'react';
import { X } from 'lucide-react';

export function ManagementModal({ title, isOpen, onClose, onSubmit, fields, data }) {
  const [formErrors, setFormErrors] = useState({});

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors({});

    const formData = new FormData(e.target);
    const values = {};

    fields.forEach(field => {
      if (field.type === 'multiselect') {
        // Handle multiselect fields
        const selected = Array.from(e.target.elements[field.name].selectedOptions)
          .map(option => option.value);
        values[field.name] = selected;
      } else if (field.type === 'select') {
        // Handle single select fields
        values[field.name] = formData.get(field.name);
      } else if (field.type === 'number') {
        // Handle number fields
        const value = formData.get(field.name);
        values[field.name] = value ? Number(value) : null;
      } else {
        // Handle text and other fields
        values[field.name] = formData.get(field.name);
      }
    });

    try {
      onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
      setFormErrors({ submit: error.message });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {data ? `Edit ${title}` : `Add ${title}`}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {formErrors.submit && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {formErrors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label 
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>

                {field.type === 'select' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    defaultValue={data?.[field.name] || ''}
                    required={field.required}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  >
                    <option value="">Select {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'multiselect' ? (
                  <select
                    id={field.name}
                    name={field.name}
                    multiple
                    defaultValue={data?.[field.name] || []}
                    required={field.required}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                    size={4}
                  >
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    defaultValue={data?.[field.name] || ''}
                    required={field.required}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || 'text'}
                    defaultValue={data?.[field.name] || ''}
                    required={field.required}
                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-amber-500"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                  />
                )}

                {formErrors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors[field.name]}
                  </p>
                )}

                {field.description && (
                  <p className="mt-1 text-sm text-gray-500">
                    {field.description}
                  </p>
                )}
              </div>
            ))}

            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-black bg-amber-500 border border-transparent rounded-md shadow-sm hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                {data ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}