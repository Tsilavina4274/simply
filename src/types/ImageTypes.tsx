// src/types/ImageTypes.ts

export interface ImageData {
  id: number;
  url: string;
  price: string;
  versionTag: string;
  versionColor: string;
}

export interface ImageCardProps {
  imageUrl: string;
  price: string;
  versionTag: string;
  versionColor: string;
}