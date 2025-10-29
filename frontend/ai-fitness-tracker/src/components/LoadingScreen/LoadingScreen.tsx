import { PropagateLoader } from 'react-spinners';


export default function LoadingScreen() {
  return (
    <div className='loading-screen'>
      <PropagateLoader
        size={20}
        cssOverride={{
          alignItems: "center",
          justifyContent: "center"
        }}
        color="#00ffcc"
      />
    </div>
  );
}
