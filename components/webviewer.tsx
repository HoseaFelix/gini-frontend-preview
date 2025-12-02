

'use client';

import { useEffect, useRef, useState } from 'react';

export default function WebViewer() {

  const viewer = useRef(null);
    const [wvInst, setWvInst] = useState(null)


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const f = e.target.files[0];

      // Wait for WebViewer instance to be ready before loading document
      if (wvInst) {
        wvInst.UI.loadDocument(f);
      } else {
        console.warn('WebViewer is still initializing. Please try again.');
        alert('Please wait for the viewer to load before selecting a file.');
      }
    }
  }

    useEffect(() => {
      let isMounted = true;

      import('@pdftron/webviewer').then((module) => {
        const WebViewer = module.default;
        WebViewer(
          {
            path: '/lib/webviewer',
            licenseKey: 'demo:1764331071821:60e6e5820300000000c76c0cd0a05fb809ee7448a8e9e9cf7edc2aae12', // sign up to get a key at https://dev.apryse.com
            initialDoc: '',
          },
          viewer.current,
        ).then((instance) => {
            if (isMounted) {
              // const { documentViewer } = instance.Core;
              // you can now call WebViewer APIs here...
              setWvInst(instance);
            }
          });
      })

      return () => {
        isMounted = false;
      };
    }, []);


    return (
      <div className='myComponent'>

        <div id='button-div'>
          <input 
            type="file" 
            onChange={handleFileChange}
            disabled={!wvInst}
            title={!wvInst ? "Waiting for viewer to load..." : "Select a PDF"}
          />
        </div>

        <div className="webviewer" ref={viewer} style={{height: "100vh"}}>
        </div>

      </div>

    );
  
}