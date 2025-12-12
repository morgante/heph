import { useEffect } from 'react';

export function SubscribeForm() {
  useEffect(() => {
    // Load the beehiiv embed script
    const script = document.createElement('script');
    script.src = 'https://subscribe-forms.beehiiv.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <iframe
      src="https://subscribe-forms.beehiiv.com/c73c907a-bab8-4489-a833-93f672c42509"
      className="beehiiv-embed"
      data-test-id="beehiiv-embed"
      title="Beehiiv Subscribe Form"
      frameBorder="0"
      scrolling="no"
      style={{
        width: '560px',
        height: '207px',
        margin: 0,
        borderRadius: '0px 0px 0px 0px',
        backgroundColor: 'transparent',
        boxShadow: '0 0 #0000',
        maxWidth: '100%',
      }}
    />
  );
}