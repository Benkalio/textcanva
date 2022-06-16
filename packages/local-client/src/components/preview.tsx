import { useEffect, useRef } from 'react';
import './styles/preview.css';

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}

// iframe html
// html structure written for events
const html = `
  <html>
    <head>
      <style>html { background-color: white; }</style>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        };

        // Handling asynchronous error
        window.addEventListener('error',(event) => {
          event.preventDefault();
          handleError(event.error);
        });

        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            handleError(err)
          }
        }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = useRef<any>();

  // Resetting content in the iframe after each code transpile
  useEffect(() => {
    iframe.current.srcdoc = html;

    // Show code on preview with execution timeout
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 100);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}
    </div>
  );
};

export default Preview;
