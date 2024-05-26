import { FaPlane } from "react-icons/fa6";
import { FaWandMagicSparkles } from "react-icons/fa6";

function Search() {
  return (
    <section className="w-full text-slate-500">
      <div className="md:max-w-[1150px] h-[200px] mx-auto rounded-2xl bg-white shadow-lg -translate-y-24 ">
        <p className="text-sm px-5 py-3">KuduSeru</p>

        <form action="" className="px-5 flex justify-between">
          <div className="flex items-center gap-2">
            <input
              placeholder="Dari"
              type=""
              className="bg-slate-100 py-2 px-3 w-72 rounded-lg"
            />
            <FaPlane />
            <input
              placeholder="Ke"
              type=""
              className="bg-slate-100 py-2 px-3 w-72 rounded-lg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              className="bg-slate-100 py-2 px-3 w-96 rounded-lg"
              placeholder="Tanggal mulai"
            />
          </div>
        </form>
        <div className="px-5">
          <p className="text-sm py-3">Rekomendasi Wisata :</p>
          <div className="flex gap-2">
            <input
              placeholder=""
              type=""
              className="bg-slate-100 py-2 px-3 w-72 rounded-lg"
            />
            <button className="flex items-center text-[#0E8388] bg-[#CBE4DE] p-2 rounded-lg">
              <span className="mr-2">Generate</span>
              <FaWandMagicSparkles />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Search;
