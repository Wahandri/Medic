import IngredientsInput from '../components/IngredientsInput/IngredientsInput';
import Footer from '../components/Footer/Footer';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        {/* Título de la página */}
        <title>Remed-IA | Remedios caseros con inteligencia artificial</title>

        {/* Descripción para SEO */}
        <meta
          name="description"
          content="Remed-IA es una herramienta que utiliza inteligencia artificial para crear remedios caseros personalizados basados en tus síntomas y preferencias. ¡Cuida tu salud de forma natural!"
        />

        {/* Palabras clave para SEO */}
        <meta
          name="keywords"
          content="remedios caseros, inteligencia artificial, salud, síntomas, medicina natural, IA, bienestar, remedios personalizados"
        />

        {/* Open Graph (para compartir en redes sociales) */}
        <meta property="og:title" content="Remed-IA | Remedios caseros con inteligencia artificial" />
        <meta
          property="og:description"
          content="Remed-IA es una herramienta que utiliza inteligencia artificial para crear remedios caseros personalizados basados en tus síntomas y preferencias. ¡Cuida tu salud de forma natural!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.remed-ia.com" />
        <meta property="og:image" content="https://www.remed-ia.com/logoRemedyIA.png" />
        <meta property="og:image:width" content="300" />
        <meta property="og:image:height" content="300" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Logo de Remed-IA" />

        {/* Twitter Card (para compartir en Twitter) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Remed-IA | Remedios caseros con inteligencia artificial" />
        <meta
          name="twitter:description"
          content="Remed-IA es una herramienta que utiliza inteligencia artificial para crear remedios caseros personalizados basados en tus síntomas y preferencias. ¡Cuida tu salud de forma natural!"
        />
        <meta name="twitter:image" content="https://www.remed-ia.com/logoRemedyIA.png" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        {/* Apple Touch Icon (para dispositivos Apple) */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Canonical URL (para evitar contenido duplicado) */}
        <link rel="canonical" href="https://www.remed-ia.com" />
      </Head>

      <main className="container">
        {/* Logo de la página */}
        <img src='/logoRemedyIA.png' width='300px' alt="Remed-IA Logo" className="logo" />

        {/* Título principal */}
        <div>
          <h1>Remed-IA</h1>
          <h1 className='h1Page'>Remedios caseros con inteligencia artificial</h1>
        </div>

        {/* Descripción de la página */}
        <p className="description">Describe tus síntomas y preferencias.<br/> Una IA creará un remedio casero para ti.</p>

        {/* Contenedor del formulario de ingredientes */}
        <div className='box-Ingrdients'>
          <IngredientsInput />
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}