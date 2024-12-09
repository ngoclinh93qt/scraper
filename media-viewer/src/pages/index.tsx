import { useEffect, useState } from 'react';
import { Media } from '@/types';
import axiosInstance from '@/axiosInstance';


export default function Home() {
  const [media, setMedia] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await axiosInstance.get('/media/paginated', {
          params: { page, limit, type: typeFilter, search: searchText },
        });
        setMedia(response.data.media);
        setTotal(response.data.totalCount);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, [page, typeFilter, searchText]);
  const renderMediaItem = (item: Media) => (
    <div key={item.id} className="bg-white shadow-lg rounded-md overflow-hidden">
      <p className="text-sm font-medium text-gray-700 p-2">{item.type.toUpperCase()}</p>
      {item.type === 'image' ? (
        <img src={item.link} alt="Media" className="w-full h-48 object-cover" />
      ) : (
        <video controls className="w-full h-48 object-cover">
          <source src={item.link} type="video/mp4" />
        </video>
      )}
    </div>
  );
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Media Viewer client side rendering</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded-md shadow-sm w-64"
          onChange={(e) => {
            setSearchText(e.target.value);
            setPage(1);
          }}
        />
        <select
          className="ml-4 p-2 border border-gray-300 rounded-md shadow-sm text-black"
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="" className="">All</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map(renderMediaItem)}
      </div>

      <div className="flex justify-between items-center mt-8">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="text-white">Page {page} of {Math.ceil(total / limit)}</span>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          onClick={() => setPage((prev) => (prev < Math.ceil(total / limit) ? prev + 1 : prev))}
          disabled={page >= Math.ceil(total / limit)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
