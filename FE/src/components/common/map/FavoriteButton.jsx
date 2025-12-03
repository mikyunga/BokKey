// src/components/common/FavoriteButton.jsx
import { useFavorites } from '../../../contexts/FavoriteContext';
import { IconStarWhite, IconStarYellow } from '../../../utils/icons';

export default function FavoriteButton({ place, mode }) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const fav = isFavorite(place.id, mode);

  const handleClick = (e) => {
    e.stopPropagation(); // PlaceItem 클릭 방지
    toggleFavorite(place, mode);
  };

  return (
    <button onClick={handleClick}>
      <img src={fav ? IconStarYellow : IconStarWhite} alt="favorite" />
    </button>
  );
}
