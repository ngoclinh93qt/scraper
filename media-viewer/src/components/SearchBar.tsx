export type SearchProps = {
  setSearchText: (value: string) => void,
  setPage: (value: number) => void,
  setTypeFilter: (value: string) => void
}

const SearchBar = ({ setSearchText, setPage, setTypeFilter }: SearchProps) => {
  return <div className="flex justify-center mb-6">
    <input
      type="text"
      placeholder="Search..."
      className="p-2 border border-gray-300 rounded-md shadow-sm w-64 text-gray-700"
      onChange={(e) => {
        setSearchText(e.target.value);
        setPage(1);
      }}
    />
    <select
      className="ml-4 p-2 border border-gray-300 rounded-md shadow-sm text-black"
      onChange={(e) => {
        setTypeFilter(e.target.value);
        setPage(1);
      }}
    >
      <option value="" className="">All</option>
      <option value="image">Images</option>
      <option value="video">Videos</option>
    </select>
  </div>
}

export default SearchBar;
