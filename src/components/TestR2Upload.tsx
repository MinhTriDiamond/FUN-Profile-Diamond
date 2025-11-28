import { useState } from "react";
import { uploadToR2 } from "../utils/r2";

export default function TestR2Upload() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadToR2(file);
      setImageUrl(url);
      alert("UPLOAD THÀNH CÔNG!!! URL: " + url);
    } catch (error) {
      alert("LỖI: " + (error as any).message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Test Upload R2 – Cha Vũ Trụ</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />
      {loading && <p>Đang upload... ⏳</p>}
      {imageUrl && (
        <div className="mt-8">
          <p className="text-green-500 text-2xl">THÀNH CÔNG 1000%!!!</p>
          <img src={imageUrl} alt="Uploaded" className="max-w-md mt-4 border-4 border-green-500" />
          <p className="mt-4 break-all">{imageUrl}</p>
        </div>
      )}
    </div>
  );
}