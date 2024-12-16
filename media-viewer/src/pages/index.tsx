import { useEffect, useState } from 'react';
import { Media } from '@/types';
import axiosInstance from '@/axiosInstance';
import SearchBar from '@/components/SearchBar';
import MediaView from '@/components/MediaView';


export default function Home() {
  const [media, setMedia] = useState<Media[]>([]);
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [searchText, setSearchText] = useState('');
  const [total, setTotal] = useState(0);
  const limit = 12;

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">Media Viewer client side rendering</h1>

      <SearchBar setSearchText={setSearchText} setPage={setPage} setTypeFilter={setTypeFilter} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {media.map(item => <MediaView item={item} />)}
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
