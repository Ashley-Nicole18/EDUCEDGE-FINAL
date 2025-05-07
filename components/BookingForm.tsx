'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  message: string;
}

interface FormErrors {
  message?: string;
}

interface BookingFormProps {
  onSubmit: (formData: FormData) => void;
  onReset?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, onReset }) => {
  const [formData, setFormData] = useState<FormData>({
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    // Message is optional, no validation required
    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Message / Additional Notes */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Additional Notes (Optional)
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any special requirements or topics you'd like to focus on..."
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2">
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-100"
          >
            Reset
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Complete Booking
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
