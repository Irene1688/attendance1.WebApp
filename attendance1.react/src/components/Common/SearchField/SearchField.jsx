import { TextField, InputAdornment, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { styles } from './SearchField.styles';

const SearchField = ({ 
  onSearch, 
  placeholder = "Search...",
  debounceTime = 1000,  // default debounce time
  sx,
  ...props 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const themedStyles = styles(theme);

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
            <SearchIcon sx={themedStyles.searchIcon} />
          </InputAdornment>
        ),
      }}
      sx={{ ...themedStyles.searchField, ...sx }}
      {...props}
    />
  );
};

export default SearchField; 