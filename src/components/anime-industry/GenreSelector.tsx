import React from "react";
type Props = {
  genreList: string[];
  selectedGenreList: string[];
  onChange: (_arg: string[]) => void;
};
const GenereSelector = ({ genreList, selectedGenreList, onChange }: Props) => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      {genreList.map((d) => {
        const selectedIndex = selectedGenreList.indexOf(d);
        return (
          <button
            key={`genre-${d}`}
            className={`border rounded border-black px-2 ${selectedIndex !== -1 ? " bg-black text-white " : " bg-white text-black "}  `}
            onClick={() => {
              selectedIndex !== -1
                ? onChange(
                    selectedGenreList.filter((_, i) => i !== selectedIndex),
                  )
                : onChange([...selectedGenreList, d]);
            }}
          >
            {d}
          </button>
        );
      })}
    </div>
  );
};

export default GenereSelector;
