export class CacheStateConfigItemDto {
  id: string;
  title: string;
  synopsis: string;
  availableTo: string;
  availableFrom: string;
  images: {
    alt: string;
    src: string;
    title: string;
  }[];
  streams: {
    url: string;
    type: 'mp4' | 'hls' | 'dash' | 'f4m';
  }[];
  streamUrls: string[];
}
