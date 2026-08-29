import { useState, useEffect } from 'react';
import { Search, Users, Shield, Mail, Calendar } from 'lucide-react';
import adminApi from '../../services/adminApi';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.get('/users');
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = search
    ? customers.filter(
        (c) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase())
      )
    : customers;

  const customerCount = customers.filter((c) => c.role === 'customer').length;
  const adminCount = customers.filter((c) => c.role === 'admin').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold">Customers</h1>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-600">Total: {customers.length}</span>
          <span className="text-gray-600">Customers: {customerCount}</span>
          <span className="text-gray-600">Admins: {adminCount}</span>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name or email..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gold focus:border-transparent"
        />
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-medium">Customer</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Phone</th>
                <th className="text-center p-3 font-medium">Role</th>
                <th className="text-center p-3 font-medium">Verified</th>
                <th className="text-center p-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b last:border-0">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            {customer.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        {customer.name || 'Unnamed'}
                      </div>
                    </td>
                    <td className="p-3 text-gray-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {customer.email}
                    </td>
                    <td className="p-3 text-gray-600">{customer.phone || '-'}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-xs rounded-full ${
                          customer.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {customer.role}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      {customer.isEmailVerified ? '✓' : '—'}
                    </td>
                    <td className="p-3 text-center text-gray-500">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;
