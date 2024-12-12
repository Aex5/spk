// components/Stat.js
import useSWR from 'swr';
import axios from 'axios';

const fetcher = url => axios.get(url).then(res => res.data);

const Stat = () => {
  
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_SPK_API}api/destinations`, fetcher);

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="bg-gray-200 pl-64 ">
      <div className="grid gap-4 lg:gap-8 md:grid-cols-3 p-8 pt-20">
        <div className="relative p-6 rounded-2xl bg-white shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
              <span>Total Wisata</span>
            </div>
            <div className="text-3xl">{data.total_destination}</div>
            <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
              <span>12+ increase</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative p-6 rounded-2xl bg-white shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
              <span>Pengguna</span>
            </div>
            <div className="text-3xl">230</div>
            <div className="flex items-center space-x-1 text-sm font-medium text-red-600">
              <span>3% decrease</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="relative p-6 rounded-2xl bg-white shadow">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
              <span>Pesanan Baru</span>
            </div>
            <div className="text-3xl">3543</div>
            <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
              <span>7% increase</span>
              <svg
                className="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Destinations</h2>
        <ul>
        </ul>
      </div>
    </div>
  );
};

export default Stat;
 
