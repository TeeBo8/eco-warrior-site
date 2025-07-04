import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Validation - gardons la locale telle quelle si elle est valide
  const validLocale = locale && ['en', 'fr'].includes(locale) ? locale : 'fr';
  
  return {
    locale: validLocale,
    messages: (await import(`./messages/${validLocale}.json`)).default
  };
}); 