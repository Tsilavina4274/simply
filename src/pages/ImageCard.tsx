import React from 'react';
import type { ImageCardProps } from '../types/ImageTypes';

const Tag: React.FC<{ content: string; color: string }> = ({ content, color }) => (
  <span 
    className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full text-white"
    style={{ backgroundColor: color }}
  >
    {content}
  </span>
);

const ImageCard: React.FC<ImageCardProps & { onSelect?: () => void }> = ({
  imageUrl,
  price,
  versionTag,
  versionColor,
  onSelect,
}) => {
  return (
    <div
      className="h-full  relative cursor-pointer transition duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]"
      onClick={onSelect}
    >
      <div className="w-full h-40 overflow-hidden rounded-lg bg-gray-700">
        <img
          src={imageUrl}
          alt="Optimised Upload"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <Tag content={price} color={versionColor} />

      <div className=" text-sm text-white text-center">
        <p className="">Optimisé</p>
        <p className="text-gray-400">{versionTag}</p>
      </div>
    </div>
  );
};

export default ImageCard;
