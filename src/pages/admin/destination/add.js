"use client";

import Layout from "../elements/Layout";
import { useState } from "react";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../utils/firebase";

export default function DestinationAdd() {
  const [data, setData] = useState({
    destination_name: "",
    description: "",
    longlat: "",
    category: "",
    popularity: "",
    rating: "",
    harga_tiket: "",
    jumlah_pengunjung: "",
    image: "",
  });

  const [uploading, setUploading] = useState(false);

  // Fungsi untuk upload gambar ke Firebase dan dapatkan URL-nya
  const uploadImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error("Upload failed:", error);
          reject("Image upload failed!");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        },
      );
    });
  };

  // Fungsi untuk submit form
  const submitHandler = async (e) => {
    e.preventDefault();

    if (uploading) return; // Jangan submit jika sedang upload

    // Pastikan ada gambar yang dipilih
    if (!data.image) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      setUploading(true);

      // Upload gambar
      const imageUrl = await uploadImage(data.image);
      console.log("Image uploaded:", imageUrl);

      // Set URL gambar ke dalam data
      const formData = { ...data, image: imageUrl };

      // Kirim data ke API setelah gambar diupload
      const createDestination = await fetch(
        `${process.env.NEXT_PUBLIC_SPK_API}api/destination/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const createRes = await createDestination.json();

      if (createRes.status === "success") {
        toast.success("Create successful!");
        // Reset form fields setelah submit berhasil
        setData({
          destination_name: "",
          description: "",
          longlat: "",
          category: "",
          popularity: "",
          rating: "",
          harga_tiket: "",
          jumlah_pengunjung: "",
          image: "", // Reset image state
        });
        // Reset input file
        document.getElementById("destination_image").value = "";
      } else {
        toast.error(`${createRes.message}`);
      }
    } catch (error) {
      toast.error("Something went wrong!");
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handler untuk input form
  function formHandler(e) {
    const value = e.target.value;
    const name = e.target.name;

    setData({ ...data, [name]: value });
  }

  // Handler untuk memilih file gambar
  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
      setData({ ...data, image: file });
    }
  }

  return (
    <Layout>
      <div className="pl-64">
        <h1 className="text-center font-bold text-4xl text-slate-700 mb-10 pt-10">
          Tambah Destinasi
        </h1>
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full bg-white">
            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="destination_name"
                  id="name"
                  placeholder="Nama Destinasi"
                  value={data.destination_name}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="description"
                  id="description"
                  placeholder="Deskripsi"
                  value={data.description}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  name="image"
                  id="destination_image"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
                {uploading && <p className="text-blue-500">Uploading...</p>}
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="longlat"
                  id="longlat"
                  placeholder="Longitude, Latitude"
                  value={data.longlat}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="category"
                  id="category"
                  placeholder="Kategori"
                  value={data.category}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="number"
                  onChange={formHandler}
                  name="popularity"
                  id="popularity"
                  placeholder="Popularity"
                  value={data.popularity}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="number"
                  onChange={formHandler}
                  name="rating"
                  id="rating"
                  placeholder="Rating"
                  value={data.rating}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="number"
                  onChange={formHandler}
                  name="harga_tiket"
                  id="harga_tiket"
                  placeholder="Harga Tiket"
                  value={data.harga_tiket}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="number"
                  onChange={formHandler}
                  name="jumlah_pengunjung"
                  id="jumlah_pengunjung"
                  placeholder="Jumlah Pengunjung"
                  value={data.jumlah_pengunjung}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>

              <div>
                <button
                  disabled={uploading}
                  className="hover:shadow-form w-full rounded-md bg-slate-800 py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Tambah Destinasi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
