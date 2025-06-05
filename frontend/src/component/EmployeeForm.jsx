import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosconfig from '../axiosconfig';
import { useNavigate } from 'react-router-dom';
import { UserIcon, CheckIcon } from '@heroicons/react/24/outline';

const EmployeeForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {

      const res = await axiosconfig.post('/add', { name, email, phone });
      if (onAdd) onAdd(res.data.user);
      toast.success('Employee added successfully!', { autoClose: 2000 });
      setTimeout(() => {
        navigate('/');
      }, 2000);

      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      console.error('Error adding employee:', error.response?.data, error.response?.status);
      toast.error(`Failed to add employee: ${error.response?.data?.message || error.message}`, {
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-bray from-cream to-teal-500 flex flex-col items-center justify-center py-8 px-4 font-poppins">
      {/* Header */}
      <header className="flex items-center mb-6 space-x-2">
        <UserIcon className="h-8 w-8 text-coral-500" />
        <h1 className="text-3xl font-bold text-gray-800">Add Employee</h1>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg"
      >
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-teal-50 text-gray-700 rounded-lg shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-coral-400 transition-colors"
                placeholder="Enter name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 text-gray-700 rounded-lg shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-600">Phone</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full p-3 bg-gray-50 text-gray-700 rounded-lg shadow-sm border-none focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                placeholder="Enter phone (10 digits)"
                required
                pattern="[0-9]{10}"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="relative">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`relative w-full py-3 px-4 text-base font-semibold text-white rounded-lg shadow-sm transition-all flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-coral-500 to-teal-500 hover:from-coral-600 hover:to-teal-600'
              }`}
            >
              <CheckIcon className="h-5 w-5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Employee'}</span>
              {!isSubmitting && (
                <span className="absolute inset-0 rounded-lg animate-ripple hidden group-hover:block bg-white opacity-0"></span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ToastContainer */}
      <ToastContainer
        autoClose={2000}
        position="top-right"
        theme="colored"
        toastClassName="bg-teal-50 text-gray-700 border border-teal-200 rounded-lg shadow-md"
        bodyClassName="text-sm font-semibold"
        progressClassName="bg-coral-500"
      />
    </div>
  );
};

export default EmployeeForm;