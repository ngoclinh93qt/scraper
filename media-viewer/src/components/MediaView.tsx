import { Media } from "@/types";

export type MediaProps = {
  item: Media
}

const MediaView = ({ item }: MediaProps) => (
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

export default MediaView
