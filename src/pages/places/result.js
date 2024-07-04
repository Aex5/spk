import { useEffect, useState } from 'react';

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
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hasil Prediksi</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default Results;
