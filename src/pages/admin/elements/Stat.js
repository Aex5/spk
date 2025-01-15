import useSWR from "swr";
import axios from "axios";
import Link from "next/link";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Stat = () => {
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_SPK_API}api/destinations`,
    fetcher,
  );

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
      </div>
      <div className="p-8">
        <Link
          href={`/admin/destination/add`}
          data-ripple-light="true"
          className="rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
        >
          Tambah Destinasi
        </Link>
      </div>
    </div>
  );
};

export default Stat;
