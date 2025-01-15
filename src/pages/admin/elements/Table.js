import useSWR from "swr";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useState } from "react";

const Table = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data, error, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_SPK_API}api/destinations`,
    fetcher
  );

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  async function handleDelete() {
    if (selectedId) {
      const deleteReq = await fetch(
        `${process.env.NEXT_PUBLIC_SPK_API}api/destination/delete/${selectedId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const deleteRes = await deleteReq.json();
      if (deleteRes.status === "success") {
        toast.success("Delete successful!");
        mutate(); // Refresh data
      } else {
        toast.error(`${deleteRes.message}`);
      }
      setIsModalOpen(false);
      setSelectedId(null);
    }
  }

  function confirmDelete(id) {
    setSelectedId(id);
    setIsModalOpen(true);
  }

  return (
    <div className="pl-64">
      <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-white border-b">
                <tr>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Aksi</th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">No</th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Nama Destinasi</th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Deskripsi</th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Pin Lokasi</th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Rating</th>
                  <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Kategori</th>
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
                    <td className="px-2 py-1 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex">
                        <button
                          onClick={() => confirmDelete(d.id)}
                          className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-2 py-1 rounded"
                        >
                          <MdDelete />
                        </button>
                        <Link
                          href={`destination/${d.id}`}
                          className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-2 py-1 rounded ml-2"
                        >
                          <MdEdit />
                        </Link>
                      </div>
                    </td>
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
                      {d.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p>Are you sure you want to delete this destination?</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded mr-2"
              >
                Yes
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;

