import React from 'react';
import { TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

function SearchBar({ onSearch }) {
  const handleInputChange = (e) => {// gets input value
    const query = e.target.value; //sends to parent
    onSearch(query);
  };

  return (
    <div className="search-bar">
      <TextField.Root>
        <TextField.Slot>
          <MagnifyingGlassIcon height="24" width="14" />
        </TextField.Slot>
        <TextField.Input
          placeholder="Search shows..."
          onChange={handleInputChange}
     
         
        />
      </TextField.Root>
    </div>
  );
}

export default SearchBar;