
import axiosInstance from "@/axiosInstance";
import { ChangeEvent, FormEvent, useState } from "react";

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setMessage(null);
      setError(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axiosInstance.post(
        "/urls/dynamic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 1000 * 30 * 5000 // 1 min * 30s for each urls 
        }
      );

      setMessage(response.data.message || "File uploaded successfully!");
    } catch (error: any) {
      console.log(error)
      setError(
        error.response?.data?.message || "An error occurred while uploading the file."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Upload CSV File
        </h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-4">
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select a CSV file:
            </label>
            <input
              type="file"
              id="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
              }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-green-600 text-sm font-medium text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-4 text-red-600 text-sm font-medium text-center">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadPage;

