import App from 'next/app';
// import '@/styles/globals.css';
import '@/styles/style.css';
import '@/styles/app.css';
import type { AppContext, AppProps } from 'next/app';
import pokemonService from './api/pokemon';
import type { basicDataType } from './../typeing';

export default function MyApp({
  Component,
  pageProps,
  data
}: AppProps & { data: basicDataType }) {
  return (
    <div>
      <style jsx>{`
        @font-face {
          font-family: 'icomoon';
          src: url('./fonts/icomoon.ttf?qbk5wu') format('truetype'),
            url('./fonts/icomoon.woff?qbk5wu') format('woff'),
            url('./fonts/icomoon.svg?qbk5wu#icomoon') format('svg');
          font-weight: normal;
          font-style: normal;
        }
      `}</style>
      <Component {...pageProps} {...data} />
    </div>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  let basicDatas: Partial<basicDataType> = {
    ability: [],
    type: [],
    maxId: 898,
    region: []
  };
  const res: any = await pokemonService.basicData();
  if (res.success) {
    basicDatas = res.data;
  }
  return { ...appProps, data: basicDatas };
};
