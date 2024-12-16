
import axiosInstance from '@/axiosInstance';
import MediaView from '@/components/MediaView';
import { Media } from '@/types';
import { GetServerSideProps } from 'next';

interface MediaPageProps {
  media: Media[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export const getServerSideProps: GetServerSideProps<MediaPageProps> = async (
  context
) => {
  const { page = '1', limit = '12' } = context.query;

  try {
    const response = await axiosInstance.get('/media/paginated', {
      params: { page, limit },
    });

    const { media, totalCount } = response.data;

    return {
      props: {
        media,
        totalCount,
        currentPage: parseInt(page as string, 12),
        totalPages: Math.ceil(totalCount / parseInt(limit as string, 12)),
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);

    return {
      props: {
        media: [],
        totalCount: 0,
        currentPage: parseInt(page as string, 12),
        totalPages: 0,
      },
    };
  }
};

const MediaPageSeverSide = ({
  media,
  totalCount,
  currentPage,
  totalPages,
}: MediaPageProps) => {


  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Media Viewer</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {media.map(item => <MediaView item={item} />)}
      </div>
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
          disabled={currentPage <= 1}
        >
          <a
            href={`/?page=${currentPage - 1}&limit=12`}
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
            href={`/severside/?page=${currentPage + 1}&limit=12`}
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
