import Image from "next/image";

export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3001/api/destinations');
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
    const result = await res.json();
    
    return { props: { result } };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { props: { result: null } }; // Mengembalikan null jika terjadi kesalahan
  }
}

export default function Page({ result }) {

  if (!result) {
    return <div>Error fetching data</div>; // Menampilkan pesan kesalahan jika data tidak tersedia
  }
  
  return (
    <main className="container mx-auto p-4 my-6">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5 w-full">
      {result.data.map((dest) => {
        return (
          <div key={dest.id}>
            <div className="h-44 md:h-72 w-full relative ">
            <Image
              src={dest.image}
              alt={`${dest.destination_name}`}
              fill
              style={{ objectFit: "cover" }}
              className=""
            />
          </div>
          <h1 className="font-semibold text-lg text-slate-700 mb-2">{dest.destination_name}</h1>
          <p>{dest.description.length > 100 ? `${dest.description.slice(0, 100)}...` : dest.description}</p>
        </div>
        )
      })}
      </div>
    </main>
  );
}
