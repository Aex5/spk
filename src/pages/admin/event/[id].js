import Layout from "../elements/Layout";

function DetailEventBooking({ bookings, error }) {
  // Jika ada error, tampilkan pesan error
  if (error) {
    return (
      <div className="pl=64">
        <h1 className="text-center font-bold text-2xl text-slate-700 mb-10 pt-10">
          Erorr: {error}
        </h1>
      </div>
    );
  }

  // Jika data tidak ada atau kosong
  if (!bookings || bookings.length === 0) {
    return (
      <div className="pl=64">
        <h1 className="text-center font-bold text-2xl text-slate-700 mb-10 pt-10">
          data masih kosong
        </h1>
      </div>
    );
  }

  return (
    <Layout>
      <div className="pl-64 ">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5 pb-[450px]">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <h1 className="text-center font-bold text-2xl text-slate-700 mb-10 pt-10">
              List Pendaftaran
            </h1>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-white border-b">
                  <tr>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                    >
                      Nama
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="text-sm font-medium text-gray-900 px-6 py-4 text-center"
                    >
                      Nomor Telepon
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {bookings.map((booking, index) => (
                    <tr
                      key={booking.booking_id}
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
                        {booking.name || "No Name"}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {booking.email || "No Email"}
                      </td>
                      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {booking.phone || "No Phone"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Menggunakan getServerSideProps untuk mengambil data di server side
export async function getServerSideProps(context) {
  const { id } = context.query;

  try {
    // Mengambil data dari API menggunakan fetch
    const response = await fetch(
      `http://localhost:3001/api/booking/event/${id}`,
    );
    const data = await response.json();

    // Jika ada error dari API
    if (!response.ok) {
      return {
        props: {
          error: data.message || "Failed to fetch data",
        },
      };
    }

    // Mengembalikan data bookings ke komponen sebagai props
    return {
      props: {
        bookings: data.data || [],
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message || "An unexpected error occurred",
      },
    };
  }
}

export default DetailEventBooking;
