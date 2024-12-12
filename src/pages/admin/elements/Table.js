// components/Stat.js
import useSWR from "swr";
import axios from "axios";
import Image from "next/image";

const Table = () => {
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_SPK_API}api/destinations`,
    fetcher,
  );

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div className="pl-64 ">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    No
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Nama Destinasi
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Deskripsi
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Pin Lokasi
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Kategori
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((d, index) => (
                  <tr
                    key={d.id}
                    className={
                      index % 2 === 0
                        ? "bg-gray-100 border-b"
                        : "bg-white border-b"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap">
                      {d.destination_name}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap">
                      <p>
                        {d.description.length > 50
                          ? `${d.description.slice(0, 50)}...`
                          : d.description}
                      </p>
                    </td>
                    <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${d.longlat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {d.longlat}
                      </a>
                    </td>
                    <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap">
                      {d.rating}
                    </td>
                    <td className="text-sm text-gray-900 font-light px-2 py-2 whitespace-nowrap">
                      {d.kategori}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
