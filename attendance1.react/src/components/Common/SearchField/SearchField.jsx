import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { styles } from './SearchField.styles';

const SearchField = ({ 
  onSearch, 
  placeholder = "Search...",
  debounceTime = 1000,  // default debounce time
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // use useEffect to implement search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch, debounceTime]);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleSearchChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={styles.textField}
      {...props}
    />
  );
};

export default SearchField; 