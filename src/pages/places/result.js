import { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css'; // Pastikan Tailwind CSS terpasang dan diimpor

function Results() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Ambil data dari localStorage
    const storedResults = localStorage.getItem('previousResponse');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
  }, []);

  if (!results) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  const { status, destinationName, weights, percentages, destinationInfo } = results;

  if (!destinationInfo) {
    return <p className="text-center text-red-500">Error: Destination info not available.</p>;
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Prediction Results</h1>
      <p className={`text-lg font-semibold mb-2 text-center ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
        Status: {status}
      </p>
      <p className="text-lg font-semibold mb-4 text-center">Destination Name: {destinationName}</p>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Weights and Percentages:</h2>
        <table className="min-w-full divide-y divide-gray-200 mb-6">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criteria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {weights.map((w, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-lg font-semibold">{w.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg">{w.weight}</td>
                <td className="px-6 py-4 whitespace-nowrap text-lg">{percentages[index].percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Detail Data:</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Destination Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{destinationInfo.description}</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{destinationInfo.category}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Popularity</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{destinationInfo.popularity}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rating</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{destinationInfo.rating}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Harga Tiket</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{destinationInfo.harga_tiket}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Jumlah Pengunjung</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">{destinationInfo.jumlah_pengunjung}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;
