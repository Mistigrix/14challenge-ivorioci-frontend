export const filterVideos = (videos, query = '', filters = {}) => {
  const { genre = 'Tous', year = 'Toutes', rating = 'Tous' } = filters;

  return videos.filter(v => {

    // ——— Filtre texte ———
    const matchesQuery = query.length < 2 || (
      v.title.toLowerCase().includes(query.toLowerCase()) ||
      v.description.toLowerCase().includes(query.toLowerCase()) ||
      v.genres.some(g => g.toLowerCase().includes(query.toLowerCase())) ||
      v.director.toLowerCase().includes(query.toLowerCase()) ||
      v.cast.some(c => c.toLowerCase().includes(query.toLowerCase()))
    );

    // ——— Filtre genre ———
    const matchesGenre = genre === 'Tous' || v.genres.includes(genre);

    // ——— Filtre année ———
    const matchesYear = year === 'Toutes' || v.releaseDate === year;

    // ——— Filtre classification ———
    const matchesRating = rating === 'Tous' || v.rating === rating;

    return matchesQuery && matchesGenre && matchesYear && matchesRating;
  });
};
