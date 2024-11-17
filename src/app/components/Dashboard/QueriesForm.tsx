import React, { useState, useEffect, ReactNode } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname } from 'next/navigation';

export interface contactNumber {
  [x: string]: ReactNode;
  queryId?: string;
  full_name: string;
  phone_number: string;
  Comments: string;
  travelType: string;
  queryType: string;
  leadSource: string;
  priority: string;
  agentId?: string | null; // Made agentId optional and nullable
  status: string;
  TravelTime: string;
  TravelDate?: string;
  editReason?: string; // Add edit reason field
}

interface FormProps {
  onSubmit: (data: contactNumber) => void;
  onCancel: () => void;
  initialData?: contactNumber;
}

const QueryForm: React.FC<FormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [agents, setAgents] = useState<contactNumber[]>([]);
  const [formData, setFormData] = useState<contactNumber>({
    queryId: '',
    full_name: '',
    phone_number: '',
    Comments: '',
    travelType: '',
    queryType: '',
    leadSource: '',
    priority: '',
    agentId: null,
    status: '',
    TravelTime: '',
    TravelDate: '',
    editReason: '', // Initialize edit reason
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const pathname = usePathname();
  const isAgentPath = pathname.startsWith('/agent');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch('https://crm-syste-f15f21fd2637.herokuapp.com/api/agent');
        const data = await response.json();

        if (Array.isArray(data)) {
          setAgents(data);
        } else {
          toast.error('Unexpected data format from API');
        }
      } catch (error) {
        toast.error('Failed to fetch agents');
      }
    };

    fetchAgents();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        TravelDate: initialData.TravelDate ? formatDateForInput(new Date(initialData.TravelDate)) : '',
        agentId: initialData.agentId || null,
      });
    }
  }, [initialData]);

  // Function to adjust the date for the local timezone
  const formatDateForInput = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
  
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.phone_number) newErrors.phone_number = 'Phone number is required';
    if (!formData.Comments) newErrors.Comments = 'Comments are required';
  
    // Only validate `editReason` if `initialData` exists (indicating we're editing)
    if (initialData && !formData.editReason) newErrors.editReason = 'Reason is required';
  
    return newErrors;
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fill out all required fields');
      return;
    }

    // Convert TravelDate to the format expected by MySQL ('YYYY-MM-DD')
    const formattedData = {
      ...formData,
      TravelDate: formData.TravelDate ? formData.TravelDate : '',
      agentId: formData.agentId || null,
    };

    try {
      const response = await fetch(
        `https://crm-syste-f15f21fd2637.herokuapp.com/api/queries/${initialData?.queryId || ''}`,
        {
          method: initialData ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formattedData),
        }
      );

      if (response.status === (initialData ? 200 : 201)) {
        toast.success(
          initialData
            ? 'Query updated successfully!'
            : 'Query submitted successfully!'
        );
        onSubmit(formData);
      } else {
        toast.error(
          initialData
            ? 'Failed to update query'
            : 'Failed to submit query'
        );
      }
    } catch (error) {
      toast.error(
        initialData
          ? 'An error occurred while updating the query'
          : 'An error occurred while submitting the query'
      );
    }
  };

  return (
    <div className='max-w-2xl  space-y-4 w-full text-white p-4 bg-[#242424] border rounded-md border-[#5c5a5acb]'>
      <ToastContainer />
      <form onSubmit={handleSubmit} autoComplete='off'>
        <div className="grid grid-cols-2 gap-4">
          {/* Required Fields */}
          <div>
            <label htmlFor="full_name" className="block text-white">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb] ${errors.full_name ? 'border-red-500' : ''}`}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-white">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className={`w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb] ${errors.phone_number ? 'border-red-500' : ''}`}
            />
            {errors.phone_number && (
              <p className="text-red-500 text-sm">{errors.phone_number}</p>
            )}
          </div>

          <div className="col-span-2">
            <label htmlFor="Comments" className="block text-white">Comments</label>
            <textarea
              id="Comments"
              name="Comments"
              value={formData.Comments}
              onChange={handleChange}
              className={`w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb] ${errors.Comments ? 'border-red-500' : ''}`}
              rows={2}
            />
            {errors.Comments && (
              <p className="text-red-500 text-sm">{errors.Comments}</p>
            )}
          </div>

          {/* Optional Fields */}
          <div>
            <label htmlFor="travelType" className="block text-white">Travel Type</label>
            <select
              id="travelType"
              name="travelType"
              value={formData.travelType}
              onChange={handleChange}
              className="w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb]"
            >
              <option value="">Select Travel Type</option>
              <option value="local">Local</option>
              <option value="international">International</option>
            </select>
          </div>

          <div>
            <label htmlFor="queryType" className="block text-white">Query Type</label>
            <select
              id="queryType"
              name="queryType"
              value={formData.queryType}
              onChange={handleChange}
              className={`w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb] ${errors.queryType ? 'border-red-500' : ''}`}
            >
              <option value="">Select Query Type</option>
              <option value="follow up">Follow Up</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            {errors.queryType && (
              <p className="text-red-500 text-sm">{errors.queryType}</p>
            )}
          </div>

          <div>
            <label htmlFor="leadSource" className="block text-white">Lead Source</label>
            <select
              id="leadSource"
              name="leadSource"
              value={formData.leadSource}
              onChange={handleChange}
              className={`w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb] ${errors.leadSource ? 'border-red-500' : ''}`}
            >
              <option value="">Select Lead Source</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
            </select>
            {errors.leadSource && (
              <p className="text-red-500 text-sm">{errors.leadSource}</p>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="block text-white">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb]"
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="low">Low</option>
            </select>
          </div>
      {/* Conditionally Rendered Agent Field */}
      {isAgentPath ? (
            <div>
              <label htmlFor="agentId" className="block text-white">
                Agent
              </label>
              <select
                disabled
                id="agentId"
                name="agentId"
                value={formData.agentId || ''} // Ensure agentId is empty if null
                onChange={handleChange}
                className={`w-full p-2 bg-[#5c5a5a4f] border cursor-not-allowed rounded-md border-[#5c5a5acb] ${errors.agentId ? 'border-red-500' : ''
                  }`}
              >
                <option value="">Select an Agent</option>
                {Array.isArray(agents) && agents.length > 0 ? (
                  agents.map((agent) => (
                    <option key={agent.agentId} value={agent.agentId ?? ''}>
                      {agent.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No agents available</option>
                )}
              </select>
              {errors.agentId && (
                <p className="text-red-500 text-sm">{errors.agentId}</p>
              )}
            </div>
          ) : (
            <div>
              <label htmlFor="agentId" className="block text-white">
                Agent
              </label>
              <select
                id="agentId"
                name="agentId"
                value={formData.agentId || ''} // Ensure agentId is empty if null
                onChange={handleChange}
                className={`w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb] ${errors.agentId ? 'border-red-500' : ''
                  }`}
              >
                <option value="">Select an Agent</option>
                {Array.isArray(agents) && agents.length > 0 ? (
                  agents.map((agent) => (
                    <option key={agent.agentId} value={agent.agentId ?? ''}>
                      {agent.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No agents available</option>
                )}
              </select>
              {errors.agentId && (
                <p className="text-red-500 text-sm">{errors.agentId}</p>
              )}
            </div>
          )}

          {/* Optional Fields */}
          {isAgentPath ? (
            <div>
              <label htmlFor="status" className="block text-white">Status</label>
              <select
                disabled
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 bg-[#5c5a5a4f] cursor-not-allowed border rounded-md border-[#5c5a5acb]"
              >
                <option value="">Select Status</option>
                <option value="assigned">Assigned</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          ) : (
            <div>
              <label htmlFor="status" className="block text-white">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb]"
              >
                <option value="">Select Status</option>
                <option value="assigned">Assigned</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
             
          <div>
            <label htmlFor="TravelTime" className="block text-white">Travel Time</label>
            <input
              type="time"
              id="TravelTime"
              name="TravelTime"
              value={formData.TravelTime}
              onChange={handleChange}
              className="w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb]"
            />
          </div>
        <div className='w-full'>
          <label htmlFor="TravelDate" className="block text-white">Travel Date</label>
          <input
            type="date"
            id="TravelDate"
            name="TravelDate"
            value={formData.TravelDate}
            onChange={handleChange}
            className="w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb]"
          />
        </div>

          {/* Conditionally render Reason for Edit field only in edit mode */}
          {initialData && (
            <div className="col-span-2">
              <label htmlFor="editReason" className="block text-white">Reason for Edit</label>
              <textarea
                id="editReason"
                name="editReason"
                value={formData.editReason}
                onChange={handleChange}
                className="w-full p-2 bg-[#5c5a5a6f] border rounded-md border-[#5c5a5acb]"
                rows={2}
              />
                {errors.editReason && (
              <p className="text-red-500 text-sm">{errors.editReason}</p>
            )}
            </div>
          )}
        </div>

        
        <div className="flex justify-between mt-4 gap-2">
          <button
            type="submit"
            className="px-4 py-2 hover:bg-[#0D99FF] bg-[#0d9affb1] transition-colors duration-200 w-full text-white rounded-md"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 hover:bg-[#5c5a5acb] bg-[#5c5a5a6f] transition-colors duration-200 border border-[#5c5a5acb] text-white rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QueryForm;
