"use client";

import Layout from "../elements/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import toast from "react-hot-toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../utils/firebase";

export default function DestinationUpdate() {
  const router = useRouter();
  const { id: destination_id } = router.query;

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

  // Fetch data sebelumnya berdasarkan destination_id
  useEffect(() => {
    if (!destination_id) return;

    const fetchDestinationData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SPK_API}api/destination/detail/${destination_id}`,
        );
        const result = await response.json();
        console.log(result);

        if (result.status === "success") {
          setData(result.data[0]); // Set data dari API ke state
        } else {
          toast.error("Failed to fetch destination data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong while fetching data.");
      }
    };

    fetchDestinationData();
  }, [destination_id]);

  // Fungsi untuk upload gambar ke Firebase
  const uploadImage = async (file) => {
    if (!file) {
      throw new Error("No file selected");
    }

    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
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

    if (uploading) return;

    // Validasi input
    const { destination_name, description, longlat, image } = data;
    if (!destination_name || !description || !longlat || !image) {
      toast.error("Please fill out all required fields.");
      return;
    }

    try {
      setUploading(true);

      // Upload gambar jika ada file baru
      let imageUrl = data.image;
      if (image && typeof image !== "string") {
        imageUrl = await uploadImage(image);
        console.log("Image uploaded:", imageUrl);
      }

      // Set URL gambar ke dalam data
      const formData = { ...data, image: imageUrl };

      // Kirim data ke API
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SPK_API}api/destination/update/${destination_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const result = await response.json();

      if (result.status === "success") {
        toast.success("Update successful!");
        router.push("/admin/dashboard");
      } else {
        toast.error(result.message || "Failed to update destination.");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
      console.error("Error:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handler untuk input form
  const formHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk memilih file gambar
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }
      setData((prev) => ({ ...prev, image: file }));
    }
  };

  return (
    <Layout>
      <div className="pl-64">
        <h1 className="text-center font-bold text-4xl text-slate-700 mb-10 pt-10">
          Update Destinasi
        </h1>
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full bg-white">
            <form onSubmit={submitHandler}>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="destination_name"
                  placeholder="Nama Destinasi"
                  value={data.destination_name || ""}
                  className="w-full rounded-md border bg-white py-3 px-6 text-base text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <textarea
                  onChange={formHandler}
                  name="description"
                  placeholder="Deskripsi"
                  value={data.description || ""}
                  className="w-full rounded-md border bg-white py-3 px-6 text-base text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  name="image"
                  className="w-full rounded-md border bg-white py-3 px-6 text-base text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                />
                {data.image && typeof data.image === "string" && (
                  <Image
                    src={data.image}
                    width={100}
                    height={100}
                    alt="Preview"
                    className="mt-3 max-w-full h-auto rounded-md"
                  />
                )}
                {uploading && <p className="text-blue-500">Uploading...</p>}
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  onChange={formHandler}
                  name="longlat"
                  placeholder="Longitude, Latitude"
                  value={data.longlat || ""}
                  className="w-full rounded-md border bg-white py-3 px-6 text-base text-[#6B7280] focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>

              <button
                disabled={uploading}
                className="w-full rounded-md bg-slate-800 py-3 px-8 text-base font-semibold text-white hover:shadow-lg"
              >
                {uploading ? "Updating..." : "Update Destinasi"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
