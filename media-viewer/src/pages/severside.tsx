
import axiosInstance from '@/axiosInstance';
import { Media } from '@/types';
import { GetServerSideProps } from 'next';
import React from 'react';

interface MediaPageProps {
  media: Media[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const getServerSideProps: GetServerSideProps<MediaPageProps> = async (
  context
) => {
  const { page = '1', limit = '10' } = context.query;

  try {
    const response = await axiosInstance.get('/media/paginated', {
      params: { page, limit },
    });

    const { media, totalCount } = response.data;

    return {
      props: {
        media,
        totalCount,
        currentPage: parseInt(page as string, 10),
        totalPages: Math.ceil(totalCount / parseInt(limit as string, 10)),
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        media: [],
        totalCount: 0,
        currentPage: parseInt(page as string, 10),
        totalPages: 0,
      },
    };
  }
};

const MediaPageSeverSide: React.FC<MediaPageProps> = ({
  media,
  totalCount,
  currentPage,
  totalPages,
}) => {
  console.log(totalCount)
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Media Viewer</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {media.map(renderMediaItem)}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          disabled={currentPage <= 1}
        >
          <a
            href={`/?page=${currentPage - 1}&limit=10`}
            className="no-underline text-white"
          >
            Previous
          </a>
        </button>

        <span className="font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          disabled={currentPage >= totalPages}
        >
          <a
            href={`/severside/?page=${currentPage + 1}&limit=10`}
            className="no-underline text-white"
          >
            Next
          </a>
        </button>
      </div>
    </div>
  );
};

export default MediaPageSeverSide;
