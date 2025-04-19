const images = import.meta.glob('../assets/*', { eager: true, as: 'url' });

export default images;