import Layout from "../elements/Layout";

const criteriaData = [
  { no: 1, name: "Jarak", weight: 0.4, atribut: "Cost" },
  { no: 2, name: "Rating", weight: 0.3, atribut: "Benefit"  },
  { no: 3, name: "Harga Tiket", weight: 0.2, atribut: "Cost"  },
  { no: 4, name: "Jumlah Pengunjung", weight: 0.1, atribut: "Benefit"  },
];

export default function Criteria() {
  return (
    <Layout>
      <div className="pl-64">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8 pb-[500px]">
          <h1 className="text-center font-bold text-4xl text-slate-700 mb-10 pt-10">
            Kriteria
          </h1>
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
                  Nama Kriteria
                </th>
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Bobot
                </th>
                <th
                  scope="col"
                  className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                >
                  Atribut
                </th>
              </tr>
            </thead>
            <tbody>
              {criteriaData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.no}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.weight}
                  </td>
                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.atribut}
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
