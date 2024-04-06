export async function getServerSideProps() {
  try {
    const res = await fetch('http://localhost:3000/api/destinations'); // Perhatikan penulisan URL yang benar
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
  console.log(result)
  if (!result) {
    return <div>Error fetching data</div>; // Menampilkan pesan kesalahan jika data tidak tersedia
  }
  return (
    <main>
      {result.data.map((m) => {
        return (
          <p>{m.id}</p>
        )
      })}
    </main>
  );
}
