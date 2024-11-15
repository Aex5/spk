import Layout from "./elements/Layout";
import useSWR from "swr";
import axios from "axios";

export default function User() {
  const fetcher = (url) => axios.get(url).then((res) => res.data);
  const { data, error } = useSWR("http://localhost:3001/api/users", fetcher);

  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="pl-64">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8 pb-96">
          <h1 className="text-center font-bold text-4xl text-slate-700 mb-10 pt-10">
            User
          </h1>
          <div className="p-6 max-w-[15rem] rounded-2xl bg-white shadow">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium text-gray-500">
                <span>Pengguna</span>
              </div>
              <div className="text-3xl">{data.data.count}</div>
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

          <table className="min-w-full mt-20">
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
                  Email
                </th>
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Username
                </th>
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {data.data.users.map((d, index) => (
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
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {d.email}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {d.username}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {d.role_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
