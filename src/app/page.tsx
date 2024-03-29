import dynamic from 'next/dynamic';

const MapComponentWithNoSSR = dynamic(() => import('./components/MapComponent/MapComponent'), {
  ssr: false
});

export default function Home() {
  return (
    <div>
      <MapComponentWithNoSSR />
    </div>
  );
}
